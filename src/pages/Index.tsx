import { useState } from 'react';
import ParticleField from '@/components/ParticleField';
import LoginScreen from '@/components/LoginScreen';

const Index = () => {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('cf_sess') === 'true');

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
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <h1 className="font-display text-3xl text-gold-gradient">Welcome to CardForge</h1>
      </div>
    </>
  );
};

export default Index;
