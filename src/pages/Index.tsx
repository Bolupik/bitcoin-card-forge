import ParticleField from '@/components/ParticleField';
import LandingPage from '@/components/LandingPage';

const Index = () => {
  return (
    <div className="min-h-screen">
      <ParticleField />
      <div className="relative z-10">
        <LandingPage />
      </div>
    </div>
  );
};

export default Index;
