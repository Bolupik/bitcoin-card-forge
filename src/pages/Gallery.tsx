import ParticleField from '@/components/ParticleField';
import PublicNavBar from '@/components/PublicNavBar';
import GalleryPage from '@/components/GalleryPage';
import { useNavigate } from 'react-router-dom';
import { AppPage, getCards, getTrades } from '@/lib/cardforge';

const Gallery = () => {
  const navigate = useNavigate();
  const cards = getCards();
  const trades = getTrades();

  const handleNavigate = (page: AppPage) => {
    if (page === 'gallery') navigate('/gallery');
    else if (page === 'mint') navigate('/mint');
    else if (page === 'trading') navigate('/trading');
  };

  return (
    <div className="min-h-screen">
      <ParticleField />
      <div className="relative z-10">
        <PublicNavBar activePage="gallery" onNavigate={handleNavigate} tradeCount={trades.length} />
        <GalleryPage cards={cards} trades={trades} />
      </div>
    </div>
  );
};

export default Gallery;
