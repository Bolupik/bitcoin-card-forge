import { useState, useCallback } from 'react';
import ParticleField from '@/components/ParticleField';
import LoginScreen from '@/components/LoginScreen';
import NavBar from '@/components/NavBar';
import GalleryPage from '@/components/GalleryPage';
import { AppPage, getCards, getTrades, NFTCard, Trade } from '@/lib/cardforge';

const Index = () => {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('cf_sess') === 'true');
  const [page, setPage] = useState<AppPage>('gallery');
  const [cards, setCards] = useState<NFTCard[]>(() => getCards());
  const [trades, setTrades] = useState<Trade[]>(() => getTrades());

  const refreshData = useCallback(() => {
    setCards(getCards());
    setTrades(getTrades());
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('cf_sess');
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <>
        <ParticleField />
        <LoginScreen onLogin={() => setLoggedIn(true)} />
      </>
    );
  }

  return (
    <>
      <ParticleField />
      <div className="relative z-10">
        <NavBar
          activePage={page}
          onNavigate={setPage}
          onLogout={handleLogout}
          tradeCount={trades.length}
        />
        {page === 'gallery' && <GalleryPage cards={cards} trades={trades} />}
        {page === 'forge' && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <h2 className="font-display text-2xl text-gold-gradient">Forge — Coming Next</h2>
          </div>
        )}
        {page === 'trading' && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <h2 className="font-display text-2xl text-gold-gradient">Trading — Coming Next</h2>
          </div>
        )}
      </div>
    </>
  );
};

export default Index;
