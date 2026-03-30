import { AppPage } from '@/lib/cardforge';

interface PublicNavBarProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  tradeCount: number;
}

const PublicNavBar = ({ activePage, onNavigate, tradeCount }: PublicNavBarProps) => {
  const tabs: { page: AppPage; label: string; icon?: string; mobileLabel?: string }[] = [
    { page: 'gallery', label: 'Gallery', icon: '🎴', mobileLabel: '🎴' },
    { page: 'mint', label: 'Mint', icon: '⚡', mobileLabel: '⚡' },
    { page: 'trading', label: 'Trading', icon: '⇄', mobileLabel: '⇄' },
  ];

  return (
    <nav
      className="sticky top-0 z-50 h-14 sm:h-16 flex items-center px-3 sm:px-4 md:px-6"
      style={{
        background: 'rgba(5,5,14,0.92)',
        backdropFilter: 'blur(20px) saturate(1.5)',
        borderBottom: '1px solid var(--cf-border)',
      }}
    >
      <div
        className="absolute bottom-0 left-0 w-full h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.18), transparent)' }}
      />

      {/* Logo */}
      <button
        onClick={() => onNavigate('gallery')}
        className="font-display text-base sm:text-lg font-bold text-gold-gradient transition-all duration-300 hover:drop-shadow-[0_0_16px_rgba(200,168,75,0.5)] shrink-0"
      >
        <span className="hidden sm:inline">CardForge</span>
        <span className="sm:hidden">CF</span>
      </button>

      {/* Center Tabs */}
      <div className="flex-1 flex justify-center gap-0.5 sm:gap-1">
        {tabs.map(({ page, label, icon, mobileLabel }) => {
          const active = activePage === page;
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className="relative font-ui text-xs sm:text-sm font-semibold px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-md transition-all duration-300"
              style={{
                color: active ? 'var(--cf-gold)' : 'var(--cf-muted2)',
                background: active ? 'rgba(200,168,75,0.07)' : 'transparent',
                border: active ? '1px solid rgba(200,168,75,0.22)' : '1px solid transparent',
                transform: active ? 'scale(1.05)' : 'scale(1)',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--cf-text)'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = active ? 'var(--cf-gold)' : 'var(--cf-muted2)'; }}
            >
              {icon && <span className="mr-0 sm:mr-1">{icon}</span>}
              <span className="hidden sm:inline">{label}</span>
              {active && (
                <div
                  className="absolute -bottom-[1px] left-[20%] right-[20%] h-[2px]"
                  style={{ background: 'linear-gradient(90deg, transparent, var(--cf-gold), transparent)' }}
                />
              )}
              {page === 'trading' && tradeCount > 0 && (
                <span
                  className="absolute top-[3px] right-[5px] sm:top-[5px] sm:right-[7px] w-1.5 h-1.5 rounded-full animate-pulse-dot"
                  style={{ background: 'var(--cf-gold)', boxShadow: '0 0 6px rgba(200,168,75,0.6)' }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Wallet Connect */}
      <button
        className="font-ui text-[0.6rem] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border transition-all duration-300 shrink-0 hover:-translate-y-0.5 active:scale-95"
        style={{
          color: 'var(--cf-gold)',
          borderColor: 'rgba(200,168,75,0.3)',
          background: 'rgba(200,168,75,0.06)',
          boxShadow: '0 2px 10px rgba(200,168,75,0.1)',
        }}
        onClick={() => alert('Wallet connect coming soon!')}
      >
        <span className="hidden sm:inline">🔗 Connect Wallet</span>
        <span className="sm:hidden">🔗 Connect</span>
      </button>
    </nav>
  );
};

export default PublicNavBar;
