import { useRef, useState } from 'react';
import { NFTCard, Rarity, Trade } from '@/lib/cardforge';

interface NFTCardComponentProps {
  card: NFTCard;
  index: number;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
  trades?: Trade[];
}

const RARITY_STYLES: Record<Rarity, { border: string; glow: string; text: string; shadow: string }> = {
  common: {
    border: '#8aa0b4', glow: 'rgba(160,190,215,0.3)', text: '#b8cfe0',
    shadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 18px rgba(160,190,215,0.3)',
  },
  rare: {
    border: '#3a7cd5', glow: 'rgba(60,140,255,0.4)', text: '#88c4ff',
    shadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 26px rgba(60,140,255,0.4), 0 0 55px rgba(60,140,255,0.15)',
  },
  epic: {
    border: '#8b3dc0', glow: 'rgba(160,60,240,0.4)', text: '#d870ff',
    shadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 28px rgba(160,60,240,0.4), 0 0 60px rgba(160,60,240,0.15)',
  },
  legendary: {
    border: '#d89010', glow: 'rgba(240,180,20,0.5)', text: '#ffe860',
    shadow: '0 8px 32px rgba(0,0,0,0.45), 0 0 36px rgba(240,180,20,0.5), 0 0 80px rgba(240,180,20,0.5)',
  },
};

const RARITY_LABELS: Record<Rarity, string> = {
  common: '◆ Common', rare: '💎 Rare', epic: '🔮 Epic', legendary: '⚡ Legendary',
};

const NFTCardComponent = ({ card, index, showDelete, onDelete, trades = [] }: NFTCardComponentProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const rs = RARITY_STYLES[card.rarity];
  const isLegendary = card.rarity === 'legendary';
  const hasTrade = trades.some(t => t.cardId === card.id);
  const maxStat = Math.max(card.stats.ATK, card.stats.DEF, card.stats.SPD, card.stats.SPC, card.stats.HP, 1);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!wrapRef.current || !innerRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    innerRef.current.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 15}deg) scale(1.05)`;
  };

  const handleMouseLeave = () => {
    if (innerRef.current) innerRef.current.style.transform = '';
    setHovered(false);
  };

  return (
    <div
      ref={wrapRef}
      className="group animate-card-enter"
      style={{
        perspective: '1000px',
        width: 285,
        height: 400,
        animationDelay: `${index * 0.06}s`,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={innerRef}
        className="relative w-full h-full rounded-[18px] flex flex-col p-[13px] gap-[9px] overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0d0d1a, #131324)',
          border: `2px solid ${rs.border}`,
          boxShadow: isLegendary ? undefined : rs.shadow,
          animation: isLegendary ? 'legPulse 2.5s ease-in-out infinite' : undefined,
          transition: 'transform 0.5s cubic-bezier(0.17, 0.67, 0.35, 1.1)',
        }}
      >
        {/* Holographic shimmer */}
        <div
          className="absolute inset-0 rounded-[18px] pointer-events-none z-10"
          style={{
            background: 'linear-gradient(115deg, transparent 15%, rgba(255,255,255,0.04) 30%, rgba(255,255,255,0.11) 50%, rgba(255,255,255,0.04) 70%, transparent 85%)',
            backgroundSize: '200% 200%',
            animation: 'shimmer 5s ease-in-out infinite',
            opacity: isLegendary ? (hovered ? 0.7 : 0.28) : (hovered ? 1 : 0),
            transition: 'opacity 0.3s',
          }}
        />

        {/* Delete button */}
        {showDelete && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete "${card.name}"?`)) onDelete(card.id);
            }}
            className="absolute top-2 left-2 z-20 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-125"
            style={{
              background: 'rgba(13,13,26,0.9)',
              border: '1px solid rgba(255,80,80,0.5)',
              color: '#ff6b6b',
            }}
          >
            ✕
          </button>
        )}

        {/* Top bar */}
        <div className="flex justify-between items-center">
          <span
            className="font-display text-[0.68rem] truncate max-w-[175px]"
            style={{ color: 'var(--cf-text)', textShadow: '0 0 10px rgba(255,255,255,0.25)' }}
          >
            {card.name || 'Unnamed'}
          </span>
          <span className="font-ui text-[0.65rem] font-bold" style={{ color: rs.text }}>
            {card.stats.HP} HP
          </span>
        </div>

        {/* Image area */}
        <div
          className="flex-1 min-h-[155px] rounded-[10px] relative overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at center, #1a1a2e, #0d0d1a)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {card.imageUrl ? (
            <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full" style={{ color: 'var(--cf-muted)' }}>
              <span className="text-2xl mb-1 opacity-40">🖼</span>
              <span className="font-body text-[0.5rem]">No Art</span>
            </div>
          )}

          {/* Rarity badge */}
          <span
            className="absolute top-2 right-2 font-ui text-[0.45rem] font-bold uppercase px-1.5 py-0.5 rounded-full"
            style={{
              border: `1px solid ${rs.border}`,
              color: rs.text,
              backdropFilter: 'blur(8px)',
              background: 'rgba(5,5,14,0.6)',
            }}
          >
            {RARITY_LABELS[card.rarity]}
          </span>

          {/* IPFS link */}
          {card.metadataUrl && (
            <a
              href={card.metadataUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-2 left-2 font-mono text-[0.42rem] px-1.5 py-0.5 rounded-full transition-colors"
              style={{
                background: 'rgba(5,5,14,0.7)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--cf-muted)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--cf-gold)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--cf-muted)'; }}
            >
              IPFS ↗
            </a>
          )}

          {/* Trade tag */}
          {hasTrade && (
            <span
              className="absolute bottom-2 right-2 font-ui text-[0.42rem] font-bold px-1.5 py-0.5 rounded-full"
              style={{
                background: 'rgba(5,5,14,0.7)',
                border: '1px solid rgba(200,168,75,0.3)',
                color: 'var(--cf-gold)',
              }}
            >
              ⇄ Trade
            </span>
          )}
        </div>

        {/* Type line */}
        <div className="flex justify-between items-center px-1">
          <span className="font-ui text-[0.58rem] uppercase" style={{ color: 'var(--cf-muted2)' }}>
            NFT Card
          </span>
          <span className="font-ui text-[0.58rem]" style={{ color: 'var(--cf-gold)' }}>
            {card.element}
          </span>
        </div>

        {/* Description */}
        <div
          className="rounded-md px-2 py-1.5 min-h-[32px]"
          style={{
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <p className="font-body italic text-[0.56rem] leading-relaxed" style={{ color: 'rgba(220,220,245,0.58)' }}>
            {card.description || 'No description'}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-5 gap-[3px]">
          {(['ATK', 'DEF', 'SPD', 'SPC', 'HP'] as const).map(stat => (
            <div
              key={stat}
              className="flex flex-col items-center rounded-[5px] py-1"
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <span className="font-ui text-[0.4rem] uppercase" style={{ color: 'var(--cf-muted)' }}>{stat}</span>
              <span className="font-ui text-[0.72rem] font-bold" style={{ color: 'var(--cf-text)' }}>
                {card.stats[stat]}
              </span>
              <div className="w-[80%] h-[2px] rounded-full mt-0.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(card.stats[stat] / maxStat) * 100}%`,
                    background: `linear-gradient(90deg, ${rs.border}, ${rs.text})`,
                    transition: 'width 0.8s cubic-bezier(0.17, 0.67, 0.35, 1.1)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="font-mono text-[0.48rem]" style={{ color: 'var(--cf-muted)' }}>
            #{String(card.serial).padStart(4, '0')} — CardForge
          </span>
          <span className="font-display text-[0.4rem]" style={{ color: 'var(--cf-gold)', opacity: 0.65 }}>
            Genesis Series
          </span>
        </div>
      </div>
    </div>
  );
};

export default NFTCardComponent;
