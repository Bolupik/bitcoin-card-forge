import { AppPage } from '@/lib/cardforge';

interface PublicNavBarProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  tradeCount: number;
}

const PublicNavBar = ({ activePage, onNavigate, tradeCount }: PublicNavBarProps) => {
  const tabs: { page: AppPage; label: string; icon?: string }[] = [
    { page: 'gallery', label: 'Gallery' },
    { page: 'trading', label: 'Trading', icon: '⇄' },
  ];

  return (
    <nav
      className="sticky top-0 z-50 h-16 flex items-center px-4 md:px-6"
      style={{
        background: 'rgba(5,5,14,0.88)',
        backdropFilter: 'blur(20px) saturate(1.5)',
        borderBottom: '1px solid var(--cf-border)',
      }}
    >
      <div
        className="absolute bottom-0 left-0 w-full h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.18), transparent)' }}
      />

      <button
        onClick={() => onNavigate('gallery')}
        className="font-display text-lg font-bold text-gold-gradient transition-all duration-300 hover:drop-shadow-[0_0_16px_rgba(200,168,75,0.5)] shrink-0"
      >
        CardForge
      </button>

      <div className="flex-1 flex justify-center gap-1">
        {tabs.map(({ page, label, icon }) => {
          const active = activePage === page;
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className="relative font-ui text-xs md:text-sm font-semibold px-3 md:px-5 py-2 rounded-md transition-all duration-200"
              style={{
                color: active ? 'var(--cf-gold)' : 'var(--cf-muted2)',
                background: active ? 'rgba(200,168,75,0.07)' : 'transparent',
                border: active ? '1px solid rgba(200,168,75,0.22)' : '1px solid transparent',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = 'var(--cf-text)'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = 'var(--cf-muted2)'; }}
            >
              {icon && <span className="mr-1">{icon}</span>}
              {label}
              {active && (
                <div
                  className="absolute -bottom-[1px] left-[20%] right-[20%] h-[2px]"
                  style={{ background: 'linear-gradient(90deg, transparent, var(--cf-gold), transparent)' }}
                />
              )}
              {page === 'trading' && tradeCount > 0 && (
                <span
                  className="absolute top-[5px] right-[7px] w-1.5 h-1.5 rounded-full animate-pulse-dot"
                  style={{ background: 'var(--cf-gold)', boxShadow: '0 0 6px rgba(200,168,75,0.6)' }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Wallet Connect placeholder */}
      <button
        className="font-ui text-xs px-3 py-1.5 rounded-md border transition-all duration-200 shrink-0"
        style={{
          color: 'var(--cf-gold)',
          borderColor: 'rgba(200,168,75,0.3)',
          background: 'rgba(200,168,75,0.06)',
        }}
        onClick={() => alert('Wallet connect coming soon!')}
      >
        🔗 Connect Wallet
      </button>
    </nav>
  );
};

export default PublicNavBar;
