import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  NFTCard,
  getCards,
  getTemplates,
  getCollectionConfig,
  getOpenedPackCount,
  getTotalPackCount,
  mintPack,
} from '@/lib/cardforge';
import PackGrid from './mint/PackGrid';
import PackOpenAnimation from './mint/PackOpenAnimation';
import CardRevealSequence from './mint/CardRevealSequence';

type Phase = 'pick' | 'opening' | 'revealing';

/**
 * Orchestrates the 3-stage Pokémon-style pack mint flow:
 *   pick → opening (animation) → revealing (one-by-one card flips)
 */
const MintPage = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('pick');
  const [pickedPackIdx, setPickedPackIdx] = useState<number | null>(null);
  const [drawnCards, setDrawnCards] = useState<NFTCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mintedTotal, setMintedTotal] = useState(() => getCards().length);

  const config = getCollectionConfig();
  const templates = getTemplates();
  const totalAllocated = templates.reduce((s, t) => s + t.supply, 0);
  const totalMintedFromTemplates = templates.reduce((s, t) => s + t.minted, 0);
  const cardsAvailable = totalAllocated - totalMintedFromTemplates;

  const totalPacks = getTotalPackCount();
  const openedPacks = getOpenedPackCount();
  const packsRemaining = totalPacks - openedPacks;

  const canMint = cardsAvailable >= config.cardsPerPack && packsRemaining > 0;

  const handlePackSelected = (idx: number) => {
    setError(null);
    const drawn = mintPack();
    if (!drawn) {
      setError('No cards available — the collection may be sold out.');
      return;
    }
    setPickedPackIdx(idx);
    setDrawnCards(drawn);
    setMintedTotal(getCards().length);
    setPhase('opening');
  };

  const reset = () => {
    setPhase('pick');
    setPickedPackIdx(null);
    setDrawnCards([]);
  };

  return (
    <div className="relative min-h-screen flex flex-col px-4 py-8 sm:py-12">
      {/* Stats bar */}
      <div className="w-full max-w-[860px] mx-auto mb-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { label: 'Packs Left', value: `${packsRemaining.toLocaleString()} / ${totalPacks.toLocaleString()}` },
          { label: 'Cards / Pack', value: config.cardsPerPack.toString() },
          { label: 'Total Minted', value: mintedTotal.toLocaleString() },
          { label: 'Price', value: 'Free' },
        ].map((row) => (
          <div
            key={row.label}
            className="flex flex-col items-center justify-center py-2 px-3 rounded-lg"
            style={{ background: 'var(--cf-surface)', border: '1px solid var(--cf-border)' }}
          >
            <span
              className="font-ui text-[0.5rem] uppercase tracking-wider"
              style={{ color: 'var(--cf-muted)' }}
            >
              {row.label}
            </span>
            <span
              className="font-display text-xs sm:text-sm font-bold mt-0.5"
              style={{ color: 'var(--cf-text)' }}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div
          className="w-full max-w-[420px] mx-auto mb-4 p-3 rounded-lg text-center animate-card-enter"
          style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}
        >
          <span className="font-body text-xs" style={{ color: '#f87171' }}>{error}</span>
        </div>
      )}

      {/* Sold out / no templates */}
      {!canMint && (
        <div
          className="w-full max-w-[420px] mx-auto mb-6 p-4 rounded-xl text-center animate-card-enter"
          style={{ background: 'var(--cf-surface)', border: '1px solid var(--cf-border)' }}
        >
          <p className="font-display text-sm mb-2" style={{ color: 'var(--cf-gold)' }}>
            Mint Unavailable
          </p>
          <p className="font-body text-xs" style={{ color: 'var(--cf-muted2)' }}>
            {templates.length === 0
              ? 'No card templates have been created yet. Check back soon.'
              : packsRemaining <= 0
                ? 'All packs have been opened!'
                : `Not enough cards in the pool (${cardsAvailable} left).`}
          </p>
        </div>
      )}

      {/* Stage 1: Pack picker */}
      {canMint && phase === 'pick' && (
        <PackGrid
          onPackSelected={handlePackSelected}
          packsRemaining={packsRemaining}
          totalPacks={totalPacks}
        />
      )}

      {/* Stage 2: Pack opening animation overlay */}
      {phase === 'opening' && pickedPackIdx !== null && (
        <PackOpenAnimation
          packIndex={pickedPackIdx}
          onComplete={() => setPhase('revealing')}
        />
      )}

      {/* Stage 3: Card reveal sequence overlay */}
      {phase === 'revealing' && drawnCards.length > 0 && (
        <CardRevealSequence
          cards={drawnCards}
          onMintAgain={reset}
          onDone={() => navigate('/gallery')}
        />
      )}
    </div>
  );
};

export default MintPage;
