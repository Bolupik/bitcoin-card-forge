import { useState, useRef, useCallback } from 'react';
import { NFTCard, Rarity, generateStats, ELEMENTS, getCards, saveCards } from '@/lib/cardforge';
import { playTick, playReveal, playSuccess, playClick } from '@/lib/sounds';
import NFTCardComponent from './NFTCard';

const NAMES: Record<Rarity, string[]> = {
  common: ['Ember Sprite', 'Aqua Sentinel', 'Stone Pup', 'Leaf Dancer'],
  rare: ['Thornweaver', 'Voltclaw', 'Frostfang', 'Duskraven'],
  epic: ['Voidwalker', 'Mindshatter', 'Starforger', 'Abyssal Maw'],
  legendary: ['Obsidian Titan', 'Soul Reaver'],
};

const DESCS: Record<Rarity, string[]> = {
  common: [
    'A tiny flame spirit born from volcanic ash.',
    'Guardian of the shallow currents, commands minor tidal forces.',
    'A rocky hound that never tires.',
    'Dances through canopies, leaving healing spores in its wake.',
  ],
  rare: [
    'Ancient dryad who weaves living barriers from enchanted brambles.',
    'Lightning-infused predator. Each strike leaves a trail of plasma.',
    'Born of the first blizzard, its bite freezes time itself.',
    'A twilight raptor that hunts between dimensions.',
  ],
  epic: [
    'Phase-shifting entity from beyond the veil.',
    'Psychic colossus whose thoughts manifest as force waves.',
    'Forges new stars from the remnants of dying galaxies.',
    'A deep-sea horror with jaws that consume light.',
  ],
  legendary: [
    "Mountain-born colossus forged in the planet's core. Unstoppable.",
    'The final arbiter. Harvests essence from the defeated.',
  ],
};

// Weighted rarity roll: common 50%, rare 30%, epic 15%, legendary 5%
const rollRarity = (): Rarity => {
  const r = Math.random() * 100;
  if (r < 50) return 'common';
  if (r < 80) return 'rare';
  if (r < 95) return 'epic';
  return 'legendary';
};

const RARITY_COLOR: Record<Rarity, { text: string; glow: string; border: string }> = {
  common: { text: '#b8cfe0', glow: 'rgba(160,190,215,0.35)', border: 'rgba(160,190,215,0.25)' },
  rare: { text: '#88c4ff', glow: 'rgba(60,140,255,0.4)', border: 'rgba(60,140,255,0.3)' },
  epic: { text: '#d870ff', glow: 'rgba(160,60,240,0.4)', border: 'rgba(160,60,240,0.3)' },
  legendary: { text: '#ffe860', glow: 'rgba(240,180,20,0.5)', border: 'rgba(240,180,20,0.35)' },
};

const TOTAL_SUPPLY = 10_000;

const MintPage = () => {
  const [phase, setPhase] = useState<'idle' | 'rolling' | 'reveal'>('idle');
  const [mintedCard, setMintedCard] = useState<NFTCard | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [rollEmoji, setRollEmoji] = useState('🎴');
  const rollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [mintCount, setMintCount] = useState(() => getCards().length);
  const [recentMints, setRecentMints] = useState<NFTCard[]>(() => getCards().slice(-10).reverse());

  const emojis = ['🔥', '🌊', '⚡', '🌿', '🌑', '✨', '🏔️', '💀', '🎴', '⚔️'];

  const handleMint = useCallback(() => {
    if (phase !== 'idle') return;
    playClick();
    setPhase('rolling');
    setMintedCard(null);

    let count = 0;
    const total = 20;

    rollRef.current = setInterval(() => {
      setRollEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
      playTick();
      count++;
      if (count >= total) {
        if (rollRef.current) clearInterval(rollRef.current);

        // Generate card
        const rarity = rollRarity();
        const names = NAMES[rarity];
        const descs = DESCS[rarity];
        const nameIdx = Math.floor(Math.random() * names.length);
        const element = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
        const cards = getCards();

        const card: NFTCard = {
          id: crypto.randomUUID(),
          name: names[nameIdx],
          description: descs[nameIdx % descs.length],
          rarity,
          stats: generateStats(rarity),
          element,
          imageUrl: '',
          metadataUrl: '',
          serial: cards.length + 1,
          createdAt: new Date().toISOString(),
        };

        cards.push(card);
        saveCards(cards);

        playReveal();
        setMintedCard(card);
        setMintCount(cards.length);
        setPhase('reveal');

        setTimeout(() => {
          playSuccess();
          setShowOverlay(true);
        }, 600);
      }
    }, 80);
  }, [phase]);

  const dismissOverlay = () => {
    setShowOverlay(false);
    setPhase('idle');
  };

  const minted = mintCount;
  const pct = Math.min((minted / TOTAL_SUPPLY) * 100, 100);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Content wrapper */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12">
        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 font-ui text-[0.5rem] font-bold uppercase tracking-[0.4em] px-4 py-1.5 rounded-full mb-6 animate-card-enter"
          style={{ border: '1px solid rgba(200,168,75,0.2)', color: 'var(--cf-gold)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: '#4ade80' }} />
          Live · Genesis Mint
        </div>

        {/* Title */}
        <h1
          className="font-display font-black text-center mb-2 animate-card-enter"
          style={{
            fontSize: 'clamp(1.6rem, 5vw, 3.5rem)',
            background: 'linear-gradient(160deg, #c8a84b, #fff5c0, #e8c870, #c8a84b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 30px rgba(200,168,75,0.25))',
            animationDelay: '0.1s',
          }}
        >
          CardForge Genesis
        </h1>
        <p
          className="font-body text-xs sm:text-sm text-center max-w-[380px] mb-8 animate-card-enter"
          style={{ color: 'var(--cf-muted2)', lineHeight: 1.8, animationDelay: '0.2s' }}
        >
          Randomly mint a unique card from the Genesis collection.
          Each card has procedurally generated stats and rarity.
        </p>

        {/* Mint card — the central visual */}
        <div
          className="relative w-[280px] sm:w-[320px] rounded-2xl overflow-hidden mb-8 animate-card-enter"
          style={{
            background: 'linear-gradient(160deg, var(--cf-surface), var(--cf-surface2))',
            border: `1.5px solid ${phase === 'rolling' ? 'var(--cf-gold)' : 'var(--cf-border)'}`,
            boxShadow: phase === 'rolling'
              ? '0 0 60px rgba(200,168,75,0.2), inset 0 0 40px rgba(0,0,0,0.4)'
              : '0 12px 50px rgba(0,0,0,0.5)',
            transition: 'border-color 0.3s, box-shadow 0.5s',
            animationDelay: '0.3s',
          }}
        >
          {/* Art area */}
          <div
            className="relative flex items-center justify-center overflow-hidden"
            style={{ height: 200 }}
          >
            {/* Background pattern */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(200,168,75,0.04), transparent 70%)',
              }}
            />

            {/* Rolling / idle emoji */}
            <span
              className="text-7xl sm:text-8xl select-none transition-all duration-150"
              style={{
                filter: phase === 'rolling'
                  ? 'drop-shadow(0 0 24px rgba(200,168,75,0.5))'
                  : 'drop-shadow(0 0 12px rgba(200,168,75,0.15))',
                animation: phase === 'rolling' ? 'shake 0.25s ease-in-out infinite' : 'float-gentle 3s ease-in-out infinite',
                transform: phase === 'rolling' ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {phase === 'reveal' && mintedCard
                ? mintedCard.element.split(' ')[0]
                : rollEmoji}
            </span>

            {/* Scan line during roll */}
            {phase === 'rolling' && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, transparent 35%, rgba(200,168,75,0.08) 50%, transparent 65%)',
                  animation: 'sweep 0.6s linear infinite',
                }}
              />
            )}
          </div>

          {/* Info section */}
          <div className="p-5" style={{ borderTop: '1px solid var(--cf-border)' }}>
            {phase === 'reveal' && mintedCard ? (
              <div className="animate-card-enter">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-display text-sm font-bold" style={{ color: RARITY_COLOR[mintedCard.rarity].text }}>
                    {mintedCard.name}
                  </span>
                  <span
                    className="font-ui text-[0.5rem] uppercase font-bold px-2 py-0.5 rounded-full"
                    style={{
                      border: `1px solid ${RARITY_COLOR[mintedCard.rarity].border}`,
                      color: RARITY_COLOR[mintedCard.rarity].text,
                    }}
                  >
                    {mintedCard.rarity}
                  </span>
                </div>
                <p className="font-body text-[0.6rem] leading-relaxed" style={{ color: 'var(--cf-muted2)' }}>
                  {mintedCard.description}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-sm" style={{ color: 'var(--cf-text)' }}>
                    {phase === 'rolling' ? 'Rolling...' : 'Random Card'}
                  </span>
                  <span className="font-ui text-[0.55rem] font-bold" style={{ color: 'var(--cf-gold)' }}>
                    FREE
                  </span>
                </div>
                <div className="flex gap-3">
                  {(['Common', 'Rare', 'Epic', 'Legendary'] as const).map(r => (
                    <span key={r} className="font-ui text-[0.4rem] uppercase" style={{ color: 'var(--cf-muted)' }}>
                      {r === 'Common' ? '50%' : r === 'Rare' ? '30%' : r === 'Epic' ? '15%' : '5%'} {r}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-[280px] sm:w-[320px] mb-4">
          <div className="flex justify-between mb-1.5">
            <span className="font-ui text-[0.5rem] uppercase tracking-wider" style={{ color: 'var(--cf-muted)' }}>
              Minted
            </span>
            <span className="font-mono text-[0.55rem]" style={{ color: 'var(--cf-muted2)' }}>
              {minted.toLocaleString()} / {TOTAL_SUPPLY.toLocaleString()}
            </span>
          </div>
          <div
            className="h-[6px] rounded-full overflow-hidden"
            style={{ background: 'var(--cf-surface2)', border: '1px solid var(--cf-border)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${Math.max(pct, 0.5)}%`,
                background: 'linear-gradient(90deg, var(--cf-gold-dark), var(--cf-gold), var(--cf-gold2))',
                boxShadow: '0 0 10px rgba(200,168,75,0.4)',
              }}
            />
          </div>
        </div>

        {/* Mint button */}
        <button
          onClick={handleMint}
          disabled={phase !== 'idle'}
          className="group relative w-[280px] sm:w-[320px] font-display text-sm sm:text-base font-bold py-3.5 sm:py-4 rounded-xl overflow-hidden transition-all duration-500 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, #a07828, #f0d060, #c8a84b)',
            color: 'var(--cf-bg)',
            boxShadow: phase === 'idle' ? '0 4px 30px rgba(200,168,75,0.3)' : 'none',
          }}
        >
          {/* Shimmer sweep */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.25) 50%, transparent 80%)',
              backgroundSize: '200%',
              animation: 'shimmer 2s linear infinite',
            }}
          />
          {phase === 'rolling' ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Minting...
            </span>
          ) : phase === 'reveal' ? (
            <span>✦ Minted!</span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              ⚡ Mint Now — Free
            </span>
          )}
        </button>

        {/* Wallet hint */}
        <div
          className="flex items-center gap-2 mt-5 px-4 py-2 rounded-xl"
          style={{
            background: 'rgba(200,168,75,0.03)',
            border: '1px solid rgba(200,168,75,0.1)',
          }}
        >
          <span className="text-xs">🔗</span>
          <span className="font-body text-[0.6rem]" style={{ color: 'var(--cf-muted)' }}>
            Connect wallet to mint on-chain
          </span>
        </div>

        {/* Details section */}
        <div className="w-[280px] sm:w-[320px] mt-10 space-y-3">
          {[
            { label: 'Network', value: 'Stacks (Bitcoin L2)' },
            { label: 'Standard', value: 'SIP-009 NFT' },
            { label: 'Supply', value: `${TOTAL_SUPPLY.toLocaleString()} Cards` },
            { label: 'Price', value: 'Free Mint' },
          ].map(row => (
            <div
              key={row.label}
              className="flex items-center justify-between py-2 px-3 rounded-lg"
              style={{
                background: 'var(--cf-surface)',
                border: '1px solid var(--cf-border)',
              }}
            >
              <span className="font-ui text-[0.55rem] uppercase tracking-wider" style={{ color: 'var(--cf-muted)' }}>
                {row.label}
              </span>
              <span className="font-body text-[0.65rem] font-semibold" style={{ color: 'var(--cf-text)' }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Success overlay */}
      {showOverlay && mintedCard && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(5,5,14,0.95)', backdropFilter: 'blur(20px)' }}
          onClick={dismissOverlay}
        >
          <div className="flex flex-col items-center animate-card-enter" onClick={e => e.stopPropagation()}>
            {/* Spinning glow */}
            <div
              className="absolute w-[350px] h-[350px] rounded-full pointer-events-none animate-spin-slow opacity-25"
              style={{
                background: `conic-gradient(from 0deg, transparent, ${RARITY_COLOR[mintedCard.rarity].glow}, transparent, ${RARITY_COLOR[mintedCard.rarity].glow}, transparent)`,
              }}
            />
            <h2
              className="font-display text-xl sm:text-2xl font-black mb-5 text-gold-gradient relative z-10"
              style={{ filter: 'drop-shadow(0 0 25px rgba(200,168,75,0.4))' }}
            >
              ✦ Card Minted!
            </h2>
            <div className="relative z-10">
              <NFTCardComponent card={mintedCard} index={0} trades={[]} />
            </div>
            <button
              onClick={dismissOverlay}
              className="relative z-10 font-ui text-xs mt-6 px-6 py-2 rounded-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              style={{
                border: '1px solid rgba(200,168,75,0.2)',
                color: 'var(--cf-gold)',
                background: 'rgba(200,168,75,0.05)',
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MintPage;
