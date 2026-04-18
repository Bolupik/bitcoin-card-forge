import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticleField from '@/components/ParticleField';
import PublicNavBar from '@/components/PublicNavBar';
import GalleryPage from '@/components/GalleryPage';
import { AppPage, NFTCard, Trade, getTrades } from '@/lib/cardforge';
import { supabase } from '@/integrations/supabase/client';
import { useStacksAuth } from '@/contexts/StacksAuthContext';
import { dbCardToNft, DbNftCard } from '@/lib/dbCards';

const Gallery = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useStacksAuth();
  const [cards, setCards] = useState<NFTCard[]>([]);
  const [trades] = useState<Trade[]>(() => getTrades());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        // Show only the authenticated user's cards
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user.id;

        let query = supabase
          .from('nft_cards')
          .select('*')
          .order('created_at', { ascending: false });

        if (userId) query = query.eq('owner_id', userId);

        const { data, error } = await query;
        if (cancelled) return;

        if (error) {
          console.error('failed to load cards', error);
          setCards([]);
        } else {
          setCards((data as DbNftCard[] | null)?.map(dbCardToNft) ?? []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

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
        {loading ? (
          <div className="text-center py-32 font-body text-sm" style={{ color: 'var(--cf-muted2)' }}>
            Loading your collection…
          </div>
        ) : (
          <GalleryPage cards={cards} trades={trades} />
        )}
      </div>
    </div>
  );
};

export default Gallery;
