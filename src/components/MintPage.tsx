import { useState, useEffect, useRef } from 'react';
import { NFTCard, Rarity, generateStats, getCards, saveCards } from '@/lib/cardforge';
import NFTCardComponent from './NFTCard';

const TEMPLATES = [
  { name: 'Ember Sprite', description: 'A tiny flame spirit born from volcanic ash. Its warmth can melt steel.', rarity: 'common' as Rarity, element: '🔥 FIRE', emoji: '🔥' },
  { name: 'Aqua Sentinel', description: 'Guardian of the deep currents. Commands tidal forces with a gesture.', rarity: 'common' as Rarity, element: '🌊 WATER', emoji: '🌊' },
  { name: 'Thornweaver', description: 'Ancient dryad who weaves living barriers from enchanted brambles.', rarity: 'rare' as Rarity, element: '🌿 NATURE', emoji: '🌿' },
  { name: 'Voltclaw', description: 'Lightning-infused predator. Each strike leaves a trail of plasma.', rarity: 'rare' as Rarity, element: '⚡ ELECTRIC', emoji: '⚡' },
  { name: 'Voidwalker', description: 'Phase-shifting entity from beyond the veil. Reality bends in its wake.', rarity: 'epic' as Rarity, element: '🌑 DARK', emoji: '🌑' },
  { name: 'Mindshatter', description: 'Psychic colossus whose thoughts manifest as devastating force waves.', rarity: 'epic' as Rarity, element: '✨ PSYCHIC', emoji: '✨' },
  { name: 'Obsidian Titan', description: "Mountain-born colossus forged in the planet's core. Unstoppable.", rarity: 'legendary' as Rarity, element: '🏔️ EARTH', emoji: '🏔️' },
  { name: 'Soul Reaver', description: 'The final arbiter. Harvests essence from the defeated to grow stronger.', rarity: 'legendary' as Rarity, element: '💀 SHADOW', emoji: '💀' },
];

const RARITY_GLOW: Record<Rarity, string> = {
  common: 'rgba(160,190,215,0.4)',
  rare: 'rgba(60,140,255,0.5)',
  epic: 'rgba(160,60,240,0.5)',
  legendary: 'rgba(240,180,20,0.6)',
};

const MintPage = () => {
  const [minting, setMinting] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [rollingIndex, setRollingIndex] = useState(0);
  const [mintedCard, setMintedCard] = useState<NFTCard | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
  const rollInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [mintCount, setMintCount] = useState(() => getCards().length);

  // Floating particles
  useEffect(() => {
    setParticles(Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    })));
  }, []);

  const handleMint = async () => {
    if (minting) return;
    setMinting(true);
    setRolling(true);
    setMintedCard(null);

    // Slot-machine roll effect
    let speed = 60;
    let count = 0;
    const totalRolls = 25;

    rollInterval.current = setInterval(() => {
      setRollingIndex(Math.floor(Math.random() * TEMPLATES.length));
      count++;
      if (count >= totalRolls) {
        if (rollInterval.current) clearInterval(rollInterval.current);
        // Final pick
        const finalIndex = Math.floor(Math.random() * TEMPLATES.length);
        setRollingIndex(finalIndex);
        setRolling(false);

        const template = TEMPLATES[finalIndex];
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
        setMintCount(cards.length);
        setMinting(false);

        setTimeout(() => setShowSuccess(true), 300);
      }
    }, speed);
  };

  const currentTemplate = TEMPLATES[rollingIndex];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-1 h-1 rounded-full pointer-events-none opacity-20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: 'var(--cf-gold)',
            animation: `float-gentle ${3 + p.delay}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Hero */}
      <section className="relative text-center px-4 pt-12 sm:pt-20 pb-8">
        <span
          className="absolute pointer-events-none font-display font-black select-none"
          style={{
            top: '50%', left: '50%', transform: 'translate(-50%, -58%)',
            fontSize: 'clamp(3rem, 14vw, 12rem)',
            color: 'transparent',
            WebkitTextStroke: '1px rgba(200,168,75,0.03)',
          }}
        >
          MINT
        </span>

        <div
          className="inline-flex items-center gap-2 font-ui text-[0.55rem] font-semibold uppercase tracking-[0.35em] px-4 py-1.5 rounded-[20px] mb-5 animate-card-enter"
          style={{ border: '1px solid rgba(200,168,75,0.2)', color: 'var(--cf-gold)' }}
        >
          <span className="animate-pulse-dot">⚡</span>
          Genesis Mint · Random Drop
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
            animationDelay: '0.15s',
          }}
        >
          Forge Your Destiny
        </h1>

        <p
          className="font-body text-sm mx-auto leading-[1.8] max-w-[420px] mb-2 animate-card-enter"
          style={{ color: 'var(--cf-muted2)', animationDelay: '0.25s' }}
        >
          Each mint randomly selects a card from the Genesis pool.
          Stats are uniquely generated — no two cards are alike.
        </p>

        <div className="w-[80px] h-[2px] mx-auto mt-4" style={{ background: 'linear-gradient(90deg, transparent, var(--cf-gold), transparent)' }} />
      </section>

      {/* Mint Machine */}
      <section className="flex flex-col items-center px-4 pb-20">
        {/* Roll Display */}
        <div
          className="relative w-[280px] sm:w-[340px] h-[160px] sm:h-[200px] rounded-2xl flex flex-col items-center justify-center overflow-hidden mb-8 transition-all duration-500"
          style={{
            background: 'linear-gradient(145deg, var(--cf-surface), var(--cf-surface2))',
            border: `2px solid ${rolling ? 'var(--cf-gold)' : 'var(--cf-border)'}`,
            boxShadow: rolling
              ? `0 0 60px ${RARITY_GLOW[currentTemplate.rarity]}, inset 0 0 30px rgba(0,0,0,0.5)`
              : '0 8px 40px rgba(0,0,0,0.4)',
          }}
        >
          {/* Scan line */}
          {rolling && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, transparent 40%, rgba(200,168,75,0.06) 50%, transparent 60%)',
                animation: 'sweep 0.8s linear infinite',
              }}
            />
          )}

          <span
            className="text-5xl sm:text-6xl mb-2 transition-all duration-150"
            style={{
              transform: rolling ? 'scale(1.2)' : 'scale(1)',
              filter: rolling ? `drop-shadow(0 0 20px ${RARITY_GLOW[currentTemplate.rarity]})` : 'none',
              animation: rolling ? 'shake 0.3s ease-in-out infinite' : 'none',
            }}
          >
            {currentTemplate.emoji}
          </span>

          <span
            className="font-display text-sm sm:text-base font-bold transition-all duration-150"
            style={{
              color: rolling ? 'var(--cf-text)' : 'var(--cf-muted2)',
              opacity: rolling ? 0.6 : 1,
            }}
          >
            {rolling ? '???' : (mintedCard ? mintedCard.name : 'Ready to Mint')}
          </span>

          {!rolling && mintedCard && (
            <span
              className="font-ui text-[0.55rem] uppercase mt-1 px-2 py-0.5 rounded-full animate-card-enter"
              style={{
                border: `1px solid ${RARITY_GLOW[mintedCard.rarity]}`,
                color: mintedCard.rarity === 'legendary' ? '#ffe860' : mintedCard.rarity === 'epic' ? '#d870ff' : mintedCard.rarity === 'rare' ? '#88c4ff' : '#b8cfe0',
              }}
            >
              {mintedCard.rarity}
            </span>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-6 mb-8">
          <div className="text-center">
            <span className="font-display text-2xl font-bold text-gold-gradient">{mintCount}</span>
            <span className="block font-ui text-[0.5rem] uppercase tracking-widest" style={{ color: 'var(--cf-muted)' }}>Minted</span>
          </div>
          <div className="w-px h-8" style={{ background: 'var(--cf-border)' }} />
          <div className="text-center">
            <span className="font-display text-2xl font-bold text-gold-gradient">{TEMPLATES.length}</span>
            <span className="block font-ui text-[0.5rem] uppercase tracking-widest" style={{ color: 'var(--cf-muted)' }}>In Pool</span>
          </div>
          <div className="w-px h-8" style={{ background: 'var(--cf-border)' }} />
          <div className="text-center">
            <span className="font-display text-2xl font-bold text-gold-gradient">∞</span>
            <span className="block font-ui text-[0.5rem] uppercase tracking-widest" style={{ color: 'var(--cf-muted)' }}>Supply</span>
          </div>
        </div>

        {/* Mint button */}
        <button
          onClick={handleMint}
          disabled={minting}
          className="group relative font-display text-base sm:text-lg font-bold px-10 sm:px-14 py-3.5 sm:py-4 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(200,168,75,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, #a07828, #f0d060, #c8a84b, #fff0a0, #c8a84b)',
            backgroundSize: '300% 100%',
            animation: !minting ? 'shimmer 4s ease-in-out infinite' : 'none',
            color: 'var(--cf-bg)',
            boxShadow: '0 4px 30px rgba(200,168,75,0.3)',
          }}
        >
          {/* Sweep effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.2) 50%, transparent 80%)',
              backgroundSize: '200%',
              animation: 'shimmer 2s linear infinite',
            }}
          />
          {minting ? (
            <span className="flex items-center gap-3">
              <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Rolling...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span className="text-xl group-hover:animate-shake">🎲</span>
              Random Mint
            </span>
          )}
        </button>

        {/* Wallet hint */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mt-8 animate-card-enter"
          style={{
            background: 'rgba(200,168,75,0.04)',
            border: '1px solid rgba(200,168,75,0.12)',
            animationDelay: '0.4s',
          }}
        >
          <span className="text-sm">🔗</span>
          <span className="font-body text-[0.65rem]" style={{ color: 'var(--cf-muted2)' }}>
            Connect wallet to mint on Stacks blockchain
          </span>
        </div>

        {/* Recent pool preview */}
        <div className="mt-12 w-full max-w-[600px]">
          <h3 className="font-display text-xs text-center mb-4" style={{ color: 'var(--cf-muted2)' }}>
            Genesis Pool
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {TEMPLATES.map((t, i) => (
              <div
                key={i}
                className="flex flex-col items-center p-3 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-default"
                style={{
                  background: 'var(--cf-surface)',
                  border: '1px solid var(--cf-border)',
                }}
              >
                <span className="text-xl mb-1">{t.emoji}</span>
                <span className="font-ui text-[0.45rem] text-center truncate w-full" style={{ color: 'var(--cf-muted2)' }}>
                  {t.name}
                </span>
                <span
                  className="font-ui text-[0.4rem] uppercase mt-0.5"
                  style={{
                    color: t.rarity === 'legendary' ? '#ffe860' : t.rarity === 'epic' ? '#d870ff' : t.rarity === 'rare' ? '#88c4ff' : '#b8cfe0',
                  }}
                >
                  {t.rarity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success overlay */}
      {showSuccess && mintedCard && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(5,5,14,0.94)', backdropFilter: 'blur(16px)' }}
          onClick={() => { setShowSuccess(false); setMintedCard(null); }}
        >
          <div className="flex flex-col items-center animate-card-enter" onClick={e => e.stopPropagation()}>
            {/* Radial burst */}
            <div
              className="absolute w-[400px] h-[400px] rounded-full pointer-events-none animate-spin-slow opacity-20"
              style={{
                background: `conic-gradient(from 0deg, transparent, ${RARITY_GLOW[mintedCard.rarity]}, transparent, ${RARITY_GLOW[mintedCard.rarity]}, transparent)`,
              }}
            />
            <h2
              className="font-display text-2xl sm:text-3xl font-black mb-6 text-gold-gradient relative z-10"
              style={{ filter: 'drop-shadow(0 0 30px rgba(200,168,75,0.4))' }}
            >
              ✦ Card Minted!
            </h2>
            <div className="relative z-10">
              <NFTCardComponent card={mintedCard} index={0} trades={[]} />
            </div>
            <p className="font-body text-xs mt-6 relative z-10 animate-pulse" style={{ color: 'var(--cf-muted2)' }}>
              Tap anywhere to dismiss
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MintPage;
