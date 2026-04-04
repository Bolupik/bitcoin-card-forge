import ParticleField from '@/components/ParticleField';
import WhitelistPage from '@/components/WhitelistPage';

const Index = () => {
  return (
    <div className="min-h-screen">
      <ParticleField />
      <div className="relative z-10">
        <WhitelistPage />
      </div>
    </div>
  );
};

export default Index;
