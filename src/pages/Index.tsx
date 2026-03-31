import { useState, useCallback } from 'react';
import ParticleField from '@/components/ParticleField';
import AppSidebar from '@/components/AppSidebar';
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
    <div className="flex min-h-screen">
      <ParticleField />
      <AppSidebar
        activePage={page}
        onNavigate={(p) => { setPage(p); if (p === 'gallery') refreshCards(); }}
        tradeCount={trades.filter(t => t.status === 'active').length}
      />
      <main className="relative z-10 flex-1 pb-20 sm:pb-0 overflow-hidden">
        <div className="animate-page-transition" key={page}>
          {page === 'gallery' && <GalleryPage cards={cards} trades={trades} />}
          {page === 'mint' && <MintPage />}
          {page === 'trading' && <PublicTradingPage cards={cards} trades={trades} />}
        </div>
      </main>
    </div>
  );
};

export default Index;
