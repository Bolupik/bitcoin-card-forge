import { useState, useCallback } from 'react';
import ParticleField from '@/components/ParticleField';
import PublicNavBar from '@/components/PublicNavBar';
import GalleryPage from '@/components/GalleryPage';
import PublicTradingPage from '@/components/PublicTradingPage';
import { AppPage, getCards, getTrades, NFTCard, Trade } from '@/lib/cardforge';

const Index = () => {
  const [page, setPage] = useState<AppPage>('gallery');
  const [cards] = useState<NFTCard[]>(() => getCards());
  const [trades] = useState<Trade[]>(() => getTrades());

  return (
    <>
      <ParticleField />
      <div className="relative z-10">
        <PublicNavBar
          activePage={page}
          onNavigate={setPage}
          tradeCount={trades.filter(t => t.status === 'active').length}
        />
        {page === 'gallery' && <GalleryPage cards={cards} trades={trades} />}
        {page === 'trading' && <PublicTradingPage cards={cards} trades={trades} />}
      </div>
    </>
  );
};

export default Index;
