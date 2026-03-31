import { useState, useEffect } from 'react';
import { NFTCard, Rarity, generateStats, ELEMENTS, getCards, saveCards } from '@/lib/cardforge';
import NFTCardComponent from './NFTCard';

// Pre-made card templates available for public minting
const PREMADE_CARDS: {
  name: string;
  description: string;
  rarity: Rarity;
  element: string;
  imageEmoji: string;
  price: string;
}[] = [
  {
    name: 'Ember Sprite',
    description: 'A tiny flame spirit born from volcanic ash. Its warmth can melt steel.',
    rarity: 'common',
    element: '🔥 FIRE',
    imageEmoji: '🔥',
    price: '1 STX',
  },
  {
    name: 'Aqua Sentinel',
    description: 'Guardian of the deep currents. Commands tidal forces with a gesture.',
    rarity: 'common',
    element: '🌊 WATER',
    imageEmoji: '🌊',
    price: '1 STX',
  },
  {
    name: 'Thornweaver',
    description: 'Ancient dryad who weaves living barriers from enchanted brambles.',
    rarity: 'rare',
    element: '🌿 NATURE',
    imageEmoji: '🌿',
    price: '1 STX',
  },
  {
    name: 'Voltclaw',
    description: 'Lightning-infused predator. Each strike leaves a trail of plasma.',
    rarity: 'rare',
    element: '⚡ ELECTRIC',
    imageEmoji: '⚡',
    price: '1 STX',
  },
  {
    name: 'Voidwalker',
    description: 'Phase-shifting entity from beyond the veil. Reality bends in its wake.',
    rarity: 'epic',
    element: '🌑 DARK',
    imageEmoji: '🌑',
    price: '1 STX',
  },
  {
    name: 'Mindshatter',
    description: 'Psychic colossus whose thoughts manifest as devastating force waves.',
    rarity: 'epic',
    element: '✨ PSYCHIC',
    imageEmoji: '✨',
    price: '1 STX',
  },
  {
    name: 'Obsidian Titan',
    description: 'Mountain-born colossus forged in the planet\'s core. Unstoppable.',
    rarity: 'legendary',
    element: '🏔️ EARTH',
    imageEmoji: '🏔️',
    price: '1 STX',
  },
  {
    name: 'Soul Reaver',
    description: 'The final arbiter. Harvests essence from the defeated to grow stronger.',
    rarity: 'legendary',
    element: '💀 SHADOW',
    imageEmoji: '💀',
    price: '1 STX',
  },
];

const RARITY_COLORS: Record<Rarity, { border: string; bg: string; text: string; glow: string }> = {
  common: { border: 'rgba(160,190,215,0.3)', bg: 'rgba(160,190,215,0.04)', text: '#b8cfe0', glow: 'rgba(160,190,215,0.1)' },
  rare: { border: 'rgba(60,140,255,0.3)', bg: 'rgba(60,140,255,0.04)', text: '#88c4ff', glow: 'rgba(60,140,255,0.15)' },
  epic: { border: 'rgba(160,60,240,0.3)', bg: 'rgba(160,60,240,0.04)', text: '#d870ff', glow: 'rgba(160,60,240,0.15)' },
  legendary: { border: 'rgba(240,180,20,0.3)', bg: 'rgba(240,180,20,0.04)', text: '#ffe860', glow: 'rgba(240,180,20,0.2)' },
};

const MintPage = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [minting, setMinting] = useState(false);
  const [mintedCard, setMintedCard] = useState<NFTCard | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  // Staggered entrance animation
  useEffect(() => {
    PREMADE_CARDS.forEach((_, i) => {
      setTimeout(() => setVisibleCards(prev => [...prev, i]), i * 80);
    });
  }, []);

  const handleMint = async (index: number) => {
    const template = PREMADE_CARDS[index];
    setMinting(true);

    // Simulate minting delay
    await new Promise(r => setTimeout(r, 2000));

    const cards = getCards();
    const card: NFTCard = {
      id: crypto.randomUUID(),
      name: template.name,
      description: template.description,
      rarity: template.rarity,
      stats: generateStats(template.rarity),
      element: template.element,
      imageUrl: '',
      metadataUrl: '',
      serial: cards.length + 1,
      createdAt: new Date().toISOString(),
    };

    cards.push(card);
    saveCards(cards);
    setMintedCard(card);
    setMinting(false);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setMintedCard(null);
      setSelectedIndex(null);
    }, 4000);
  };

  const selected = selectedIndex !== null ? PREMADE_CARDS[selectedIndex] : null;

  return (
    <div className="relative min-h-[calc(100vh-64px)]">
      {/* Hero */}
      <section className="relative overflow-hidden text-center px-4" style={{ padding: '60px 16px 40px' }}>
        <span
          className="absolute pointer-events-none font-display font-black select-none"
          style={{
            top: '50%', left: '50%', transform: 'translate(-50%, -58%)',
            fontSize: 'clamp(3rem, 12vw, 10rem)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(200,168,75,0.04)',
          }}
        >
          MINT
        </span>

        <div
          className="inline-flex items-center gap-2 font-ui text-[0.55rem] font-semibold uppercase tracking-[0.35em] px-4 py-1.5 rounded-[20px] mb-5 animate-card-enter"
          style={{
            border: '1px solid rgba(200,168,75,0.2)',
            color: 'var(--cf-gold)',
            animationDelay: '0.1s',
          }}
        >
          <span className="animate-pulse-dot">⚡</span>
          Genesis Mint · Limited Collection
          <span className="animate-pulse-dot">⚡</span>
        </div>

        <h1
          className="font-display font-black mb-4 animate-card-enter"
          style={{
            fontSize: 'clamp(1.8rem, 5vw, 4rem)',
            background: 'linear-gradient(160deg, #c8a84b, #fff5c0, #e8c870, #c8a84b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 30px rgba(200,168,75,0.3))',
            animationDelay: '0.2s',
          }}
        >
          Mint Your Card
        </h1>

        <p
          className="font-body text-sm mx-auto leading-[1.8] max-w-[420px] mb-2 animate-card-enter"
          style={{ color: 'var(--cf-muted2)', animationDelay: '0.3s' }}
        >
          Choose from pre-made Genesis cards. Each mint generates unique battle stats. Connect your wallet to mint on-chain.
        </p>

        <div className="w-[80px] h-[2px] mx-auto mt-4" style={{ background: 'linear-gradient(90deg, transparent, var(--cf-gold), transparent)' }} />
      </section>

      {/* Cards Grid */}
      <section className="px-4 sm:px-6 pb-8 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {PREMADE_CARDS.map((card, i) => {
            const rc = RARITY_COLORS[card.rarity];
            const isVisible = visibleCards.includes(i);
            const isSelected = selectedIndex === i;

            return (
              <button
                key={i}
                onClick={() => setSelectedIndex(isSelected ? null : i)}
                className="relative text-left rounded-2xl p-4 sm:p-5 transition-all duration-500 group overflow-hidden"
                style={{
                  background: isSelected
                    ? `linear-gradient(145deg, ${rc.bg}, rgba(13,13,26,0.95))`
                    : 'linear-gradient(145deg, var(--cf-surface), var(--cf-surface2))',
                  border: `1.5px solid ${isSelected ? rc.border : 'var(--cf-border)'}`,
                  boxShadow: isSelected
                    ? `0 8px 40px ${rc.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`
                    : '0 4px 20px rgba(0,0,0,0.3)',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? (isSelected ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)')
                    : 'translateY(20px) scale(0.95)',
                  transitionTimingFunction: 'cubic-bezier(0.17, 0.67, 0.35, 1.1)',
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${rc.text}, transparent)`,
                    opacity: isSelected ? 1 : 0,
                  }}
                />

                {/* Shimmer on hover */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)',
                    opacity: isSelected ? 1 : 0,
                  }}
                />

                {/* Card emoji + rarity */}
                <div className="flex items-start justify-between mb-3">
                  <span
                    className="text-3xl sm:text-4xl transition-transform duration-500"
                    style={{ transform: isSelected ? 'scale(1.15) rotate(-5deg)' : 'scale(1) rotate(0)', filter: isSelected ? `drop-shadow(0 0 12px ${rc.glow})` : 'none' }}
                  >
                    {card.imageEmoji}
                  </span>
                  <span
                    className="font-ui text-[0.5rem] font-bold uppercase px-2 py-0.5 rounded-full"
                    style={{ border: `1px solid ${rc.border}`, color: rc.text }}
                  >
                    {card.rarity}
                  </span>
                </div>

                {/* Name + element */}
                <h3 className="font-display text-sm sm:text-base mb-1 transition-colors duration-300" style={{ color: isSelected ? rc.text : 'var(--cf-text)' }}>
                  {card.name}
                </h3>
                <span className="font-ui text-[0.55rem] mb-2 block" style={{ color: 'var(--cf-muted2)' }}>
                  {card.element}
                </span>

                {/* Description */}
                <p className="font-body text-[0.6rem] leading-relaxed mb-4" style={{ color: 'var(--cf-muted)' }}>
                  {card.description}
                </p>

                {/* Price + mint indicator */}
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold" style={{ color: 'var(--cf-gold)' }}>
                    {card.price}
                  </span>
                  <span
                    className="font-ui text-[0.55rem] px-2.5 py-1 rounded-full transition-all duration-300"
                    style={{
                      background: isSelected ? `${rc.text}15` : 'rgba(200,168,75,0.06)',
                      border: `1px solid ${isSelected ? rc.border : 'rgba(200,168,75,0.15)'}`,
                      color: isSelected ? rc.text : 'var(--cf-muted2)',
                    }}
                  >
                    {isSelected ? '✦ Selected' : 'Select'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Mint Action Panel - slides up when card selected */}
      <div
        className="sticky bottom-0 left-0 right-0 z-40 transition-all duration-500"
        style={{
          transform: selected ? 'translateY(0)' : 'translateY(100%)',
          opacity: selected ? 1 : 0,
          pointerEvents: selected ? 'auto' : 'none',
        }}
      >
        <div
          className="mx-auto max-w-[600px] rounded-t-2xl p-4 sm:p-6"
          style={{
            background: 'linear-gradient(180deg, rgba(13,13,26,0.98), rgba(5,5,14,0.99))',
            border: '1px solid var(--cf-border2)',
            borderBottom: 'none',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
          }}
        >
          {selected && (
            <div className="flex items-center gap-4">
              <span className="text-3xl">{selected.imageEmoji}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-display text-sm truncate" style={{ color: RARITY_COLORS[selected.rarity].text }}>
                  {selected.name}
                </h4>
                <span className="font-ui text-[0.6rem]" style={{ color: 'var(--cf-muted2)' }}>
                  {selected.price} · {selected.rarity.charAt(0).toUpperCase() + selected.rarity.slice(1)}
                </span>
              </div>
              <button
                onClick={() => handleMint(selectedIndex!)}
                disabled={minting}
                className="relative font-display text-xs sm:text-sm font-bold px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #a07828, #f0d060, #c8a84b, #fff0a0, #c8a84b)',
                  backgroundSize: '300% 100%',
                  color: 'var(--cf-bg)',
                  boxShadow: '0 4px 20px rgba(200,168,75,0.3)',
                }}
              >
                {minting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Minting...
                  </span>
                ) : (
                  '⚡ Mint Now'
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Wallet not connected hint */}
      <div className="text-center pb-20 px-4">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl animate-card-enter"
          style={{
            background: 'rgba(200,168,75,0.04)',
            border: '1px solid rgba(200,168,75,0.12)',
            animationDelay: '0.5s',
          }}
        >
          <span className="text-sm">🔗</span>
          <span className="font-body text-[0.65rem]" style={{ color: 'var(--cf-muted2)' }}>
            Connect your wallet to mint cards on the Stacks blockchain
          </span>
        </div>
      </div>

      {/* Success overlay */}
      {showSuccess && mintedCard && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(5,5,14,0.92)', backdropFilter: 'blur(12px)' }}
          onClick={() => { setShowSuccess(false); setMintedCard(null); setSelectedIndex(null); }}
        >
          <div className="flex flex-col items-center animate-card-enter" onClick={e => e.stopPropagation()}>
            <h2
              className="font-display text-2xl sm:text-3xl font-black mb-6 text-gold-gradient"
              style={{ filter: 'drop-shadow(0 0 30px rgba(200,168,75,0.4))' }}
            >
              ✦ Card Minted!
            </h2>
            <NFTCardComponent card={mintedCard} index={0} trades={[]} />
            <p className="font-body text-xs mt-6" style={{ color: 'var(--cf-muted2)' }}>
              Tap anywhere to dismiss
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MintPage;
