import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface CardStats {
  ATK: number;
  DEF: number;
  SPD: number;
  SPC: number;
  HP: number;
}

interface Template {
  id: string;
  name: string;
  description: string;
  rarity: string;
  element: string;
  stats: CardStats;
  image_url: string;
  metadata_url: string;
  supply: number;
  minted: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY",
    )!;

    // Authenticated client to read the caller's identity
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Missing authorization header" }, 401);
    }

    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    // Service-role client for atomic mint operations
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Parse optional pack_id from body (user picked a specific face-down pack)
    let requestedPackId: string | null = null;
    try {
      const body = await req.json();
      requestedPackId = body?.pack_id ?? null;
    } catch {
      // empty body is fine
    }

    // 1. Pick an unopened pack (either the requested one or the next available)
    let packQuery = admin
      .from("mint_packs")
      .select("id, pack_number")
      .is("opened_by", null);

    if (requestedPackId) {
      packQuery = packQuery.eq("id", requestedPackId);
    }

    const { data: packs, error: packError } = await packQuery
      .order("pack_number", { ascending: true })
      .limit(1);

    if (packError) {
      console.error("pack lookup error", packError);
      return jsonResponse({ error: "Failed to look up pack" }, 500);
    }
    if (!packs || packs.length === 0) {
      return jsonResponse(
        { error: "No packs available or selected pack already opened" },
        409,
      );
    }
    const pack = packs[0];

    // 2. Atomically claim the pack (race-safe: only succeeds if still unopened)
    const { data: claimed, error: claimError } = await admin
      .from("mint_packs")
      .update({ opened_by: user.id, opened_at: new Date().toISOString() })
      .eq("id", pack.id)
      .is("opened_by", null)
      .select("id, pack_number")
      .maybeSingle();

    if (claimError || !claimed) {
      return jsonResponse(
        { error: "Pack was just claimed by another user, try again" },
        409,
      );
    }

    // 3. Get cards-per-pack from config
    const { data: config } = await admin
      .from("collection_config")
      .select("cards_per_pack")
      .eq("id", 1)
      .single();
    const cardsPerPack = config?.cards_per_pack ?? 5;

    // 4. Load available templates (with remaining supply)
    const { data: templates, error: tmplError } = await admin
      .from("card_templates")
      .select(
        "id, name, description, rarity, element, stats, image_url, metadata_url, supply, minted",
      );

    if (tmplError || !templates) {
      // Roll back pack claim
      await admin
        .from("mint_packs")
        .update({ opened_by: null, opened_at: null })
        .eq("id", pack.id);
      return jsonResponse({ error: "Failed to load templates" }, 500);
    }

    const available = (templates as Template[]).filter(
      (t) => t.supply - t.minted > 0,
    );

    if (available.length === 0) {
      await admin
        .from("mint_packs")
        .update({ opened_by: null, opened_at: null })
        .eq("id", pack.id);
      return jsonResponse({ error: "No card templates available" }, 503);
    }

    // 5. Draw N cards weighted by remaining supply (decrement as we draw)
    const pool = available.map((t) => ({ ...t, remaining: t.supply - t.minted }));
    const drawn: Template[] = [];

    for (let i = 0; i < cardsPerPack; i++) {
      const totalRemaining = pool.reduce((s, t) => s + t.remaining, 0);
      if (totalRemaining <= 0) break;

      let roll = Math.random() * totalRemaining;
      let chosenIdx = 0;
      for (let j = 0; j < pool.length; j++) {
        roll -= pool[j].remaining;
        if (roll <= 0) {
          chosenIdx = j;
          break;
        }
      }
      drawn.push(pool[chosenIdx]);
      pool[chosenIdx].remaining -= 1;
    }

    if (drawn.length === 0) {
      await admin
        .from("mint_packs")
        .update({ opened_by: null, opened_at: null })
        .eq("id", pack.id);
      return jsonResponse({ error: "No cards could be drawn" }, 503);
    }

    // 6. Increment template minted counts (group by id)
    const counts = new Map<string, number>();
    for (const c of drawn) counts.set(c.id, (counts.get(c.id) ?? 0) + 1);

    for (const [tmplId, n] of counts.entries()) {
      const tmpl = available.find((t) => t.id === tmplId)!;
      const { error: updErr } = await admin
        .from("card_templates")
        .update({ minted: tmpl.minted + n })
        .eq("id", tmplId)
        .eq("minted", tmpl.minted); // optimistic concurrency
      if (updErr) {
        console.error("template update failed", updErr);
        // best-effort: continue, but log
      }
    }

    // 7. Compute next serial numbers (atomic via count)
    const { count: existingCount } = await admin
      .from("nft_cards")
      .select("*", { count: "exact", head: true });

    const startSerial = (existingCount ?? 0) + 1;

    // 8. Insert minted cards
    const cardsToInsert = drawn.map((t, idx) => ({
      template_id: t.id,
      owner_id: user.id,
      pack_id: pack.id,
      serial: startSerial + idx,
      name: t.name,
      description: t.description,
      rarity: t.rarity,
      element: t.element,
      stats: t.stats,
      image_url: t.image_url,
      metadata_url: t.metadata_url,
    }));

    const { data: insertedCards, error: insertErr } = await admin
      .from("nft_cards")
      .insert(cardsToInsert)
      .select();

    if (insertErr) {
      console.error("card insert failed", insertErr);
      return jsonResponse({ error: "Failed to mint cards" }, 500);
    }

    return jsonResponse({
      pack: { id: pack.id, pack_number: claimed.pack_number },
      cards: insertedCards,
    });
  } catch (err) {
    console.error("open-pack error", err);
    return jsonResponse({ error: "Internal error" }, 500);
  }
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
