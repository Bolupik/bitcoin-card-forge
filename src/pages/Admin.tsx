import { useState, useCallback } from 'react';
import ParticleField from '@/components/ParticleField';
import LoginScreen from '@/components/LoginScreen';
import NavBar from '@/components/NavBar';
import GalleryPage from '@/components/GalleryPage';
import ForgePage from '@/components/ForgePage';
import TradingPage from '@/components/TradingPage';
import WhitelistAdmin from '@/components/WhitelistAdmin';
import { AdminPage, getCards, getTrades, NFTCard, Trade } from '@/lib/cardforge';

const Admin = () => {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('cf_sess') === 'true');
  const [page, setPage] = useState<AdminPage>('forge');
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
        {page === 'forge' && <ForgePage onDataChange={refreshData} />}
        {page === 'trading' && <TradingPage cards={cards} trades={trades} onDataChange={refreshData} />}
      </div>
    </>
  );
};

export default Admin;
