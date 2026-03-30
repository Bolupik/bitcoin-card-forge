import { useState, useCallback } from 'react';
import ParticleField from '@/components/ParticleField';
import PublicNavBar from '@/components/PublicNavBar';
import GalleryPage from '@/components/GalleryPage';
import PublicTradingPage from '@/components/PublicTradingPage';
import MintPage from '@/components/MintPage';
import { AppPage, getCards, getTrades, NFTCard, Trade } from '@/lib/cardforge';

const Index = () => {
  const [page, setPage] = useState<AppPage>('gallery');
  const [cards, setCards] = useState<NFTCard[]>(() => getCards());
  const [trades] = useState<Trade[]>(() => getTrades());

  const refreshCards = useCallback(() => setCards(getCards()), []);

  return (
    <>
      <ParticleField />
      <div className="relative z-10">
        <PublicNavBar
          activePage={page}
          onNavigate={(p) => { setPage(p); if (p === 'gallery') refreshCards(); }}
          tradeCount={trades.filter(t => t.status === 'active').length}
        />
        <div className="animate-page-transition" key={page}>
          {page === 'gallery' && <GalleryPage cards={cards} trades={trades} />}
          {page === 'mint' && <MintPage />}
          {page === 'trading' && <PublicTradingPage cards={cards} trades={trades} />}
        </div>
      </div>
    </>
  );
};

export default Index;
