import type { NFTCard, CardStats, Rarity } from './cardforge';

// DB row shape returned from the open-pack edge function and nft_cards table
export interface DbNftCard {
  id: string;
  template_id: string;
  owner_id: string;
  pack_id: string | null;
  serial: number;
  name: string;
  description: string;
  rarity: string;
  element: string;
  stats: unknown;
  image_url: string;
  metadata_url: string;
  created_at: string;
}

/** Map a Supabase nft_cards row → the camelCase NFTCard shape used by UI components */
export const dbCardToNft = (row: DbNftCard): NFTCard => ({
  id: row.id,
  templateId: row.template_id,
  name: row.name,
  description: row.description ?? '',
  rarity: row.rarity as Rarity,
  stats: row.stats as CardStats,
  element: row.element,
  imageUrl: row.image_url,
  metadataUrl: row.metadata_url ?? '',
  serial: row.serial,
  createdAt: row.created_at,
});
