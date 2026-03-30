export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface CardStats {
  ATK: number;
  DEF: number;
  SPD: number;
  SPC: number;
  HP: number;
}

export interface NFTCard {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  stats: CardStats;
  element: string;
  imageUrl: string;
  metadataUrl: string;
  serial: number;
  createdAt: string;
}

export interface Trade {
  id: string;
  cardId: string;
  cardName: string;
  rarity: string;
  imageUrl: string;
  asking: string;
  status: 'hold' | 'active' | 'pending';
  createdAt: string;
}

export type AppPage = 'gallery' | 'trading' | 'mint';
export type AdminPage = 'forge' | 'trading' | 'gallery';

export const ELEMENTS = [
  '⚡ ELECTRIC', '🔥 FIRE', '🌊 WATER', '🌿 NATURE',
  '🌑 DARK', '✨ PSYCHIC', '🏔️ EARTH', '💀 SHADOW',
];

export const STAT_RANGES: Record<Rarity, { hp: [number, number]; other: [number, number] }> = {
  common: { hp: [60, 100], other: [30, 70] },
  rare: { hp: [80, 130], other: [50, 90] },
  epic: { hp: [100, 160], other: [70, 110] },
  legendary: { hp: [140, 200], other: [90, 150] },
};

export const randomInRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const generateStats = (rarity: Rarity): CardStats => {
  const r = STAT_RANGES[rarity];
  return {
    ATK: randomInRange(...r.other),
    DEF: randomInRange(...r.other),
    SPD: randomInRange(...r.other),
    SPC: randomInRange(...r.other),
    HP: randomInRange(...r.hp),
  };
};

export const getCards = (): NFTCard[] => {
  try { return JSON.parse(localStorage.getItem('cardforge_v2') || '[]'); }
  catch { return []; }
};

export const saveCards = (cards: NFTCard[]) =>
  localStorage.setItem('cardforge_v2', JSON.stringify(cards));

export const getTrades = (): Trade[] => {
  try { return JSON.parse(localStorage.getItem('cf_trades_v1') || '[]'); }
  catch { return []; }
};

export const saveTrades = (trades: Trade[]) =>
  localStorage.setItem('cf_trades_v1', JSON.stringify(trades));
