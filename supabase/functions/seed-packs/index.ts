import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Admin-only: ensures the mint_packs table contains exactly
 * floor(total_supply / cards_per_pack) rows. Idempotent — safe to call
 * multiple times.
 */
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

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify admin role
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleRow) {
      return jsonResponse({ error: "Admin role required" }, 403);
    }

    // Read config
    const { data: config, error: cfgErr } = await admin
      .from("collection_config")
      .select("total_supply, cards_per_pack")
      .eq("id", 1)
      .single();

    if (cfgErr || !config) {
      return jsonResponse({ error: "Could not load collection config" }, 500);
    }

    const targetPacks = Math.floor(config.total_supply / config.cards_per_pack);

    const { count: existing } = await admin
      .from("mint_packs")
      .select("*", { count: "exact", head: true });

    const have = existing ?? 0;
    const toCreate = targetPacks - have;

    if (toCreate <= 0) {
      return jsonResponse({
        ok: true,
        target: targetPacks,
        existing: have,
        created: 0,
      });
    }

    // Insert in batches of 1000 to avoid payload limits
    const BATCH = 1000;
    let created = 0;
    for (let start = have; start < targetPacks; start += BATCH) {
      const end = Math.min(start + BATCH, targetPacks);
      const rows = [];
      for (let n = start + 1; n <= end; n++) {
        rows.push({ pack_number: n });
      }
      const { error: insErr } = await admin.from("mint_packs").insert(rows);
      if (insErr) {
        console.error("seed insert error", insErr);
        return jsonResponse(
          { error: "Failed to insert packs", created },
          500,
        );
      }
      created += rows.length;
    }

    return jsonResponse({
      ok: true,
      target: targetPacks,
      existing: have,
      created,
    });
  } catch (err) {
    console.error("seed-packs error", err);
    return jsonResponse({ error: "Internal error" }, 500);
  }
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
