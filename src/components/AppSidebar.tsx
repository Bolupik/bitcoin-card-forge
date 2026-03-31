import { useState } from 'react';
import { AppPage } from '@/lib/cardforge';

interface AppSidebarProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  tradeCount: number;
}

const NAV_ITEMS: { page: AppPage; label: string; icon: string }[] = [
  { page: 'gallery', label: 'Gallery', icon: '🎴' },
  { page: 'mint', label: 'Mint', icon: '⚡' },
  { page: 'trading', label: 'Trading', icon: '⇄' },
];

const AppSidebar = ({ activePage, onNavigate, tradeCount }: AppSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile bottom bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex sm:hidden items-center justify-around h-14"
        style={{
          background: 'rgba(5,5,14,0.96)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--cf-border)',
        }}
      >
        {NAV_ITEMS.map(({ page, label, icon }) => {
          const active = activePage === page;
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className="relative flex flex-col items-center gap-0.5 px-4 py-1.5 transition-all duration-300"
            >
              <span
                className="text-lg transition-transform duration-300"
                style={{ transform: active ? 'scale(1.2)' : 'scale(1)' }}
              >
                {icon}
              </span>
              <span
                className="font-ui text-[0.55rem] font-semibold"
                style={{ color: active ? 'var(--cf-gold)' : 'var(--cf-muted2)' }}
              >
                {label}
              </span>
              {active && (
                <div
                  className="absolute -top-[1px] left-[25%] right-[25%] h-[2px]"
                  style={{ background: 'linear-gradient(90deg, transparent, var(--cf-gold), transparent)' }}
                />
              )}
              {page === 'trading' && tradeCount > 0 && (
                <span
                  className="absolute top-1 right-3 w-1.5 h-1.5 rounded-full animate-pulse-dot"
                  style={{ background: 'var(--cf-gold)', boxShadow: '0 0 6px rgba(200,168,75,0.6)' }}
                />
              )}
            </button>
          );
        })}
        <button
          className="flex flex-col items-center gap-0.5 px-4 py-1.5"
          onClick={() => alert('Wallet connect coming soon!')}
        >
          <span className="text-lg">🔗</span>
          <span className="font-ui text-[0.55rem] font-semibold" style={{ color: 'var(--cf-muted2)' }}>
            Wallet
          </span>
        </button>
      </nav>

      {/* Desktop sidebar */}
      <aside
        className="hidden sm:flex fixed left-0 top-0 bottom-0 z-50 flex-col transition-all duration-500 ease-out"
        style={{
          width: collapsed ? 64 : 220,
          background: 'rgba(5,5,14,0.96)',
          backdropFilter: 'blur(24px) saturate(1.5)',
          borderRight: '1px solid var(--cf-border)',
        }}
      >
        {/* Accent line */}
        <div
          className="absolute top-0 right-0 w-px h-full pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(200,168,75,0.12), transparent)' }}
        />

        {/* Logo */}
        <div className="flex items-center h-16 px-4 shrink-0" style={{ borderBottom: '1px solid var(--cf-border)' }}>
          <button
            onClick={() => onNavigate('gallery')}
            className="font-display font-bold text-gold-gradient transition-all duration-300 hover:drop-shadow-[0_0_16px_rgba(200,168,75,0.5)] truncate"
            style={{ fontSize: collapsed ? '1rem' : '1.15rem' }}
          >
            {collapsed ? 'CF' : 'CardForge'}
          </button>
        </div>

        {/* Nav items */}
        <div className="flex-1 flex flex-col gap-1 px-2 py-4">
          {NAV_ITEMS.map(({ page, label, icon }) => {
            const active = activePage === page;
            return (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className="relative flex items-center gap-3 rounded-xl transition-all duration-300 group"
                style={{
                  padding: collapsed ? '10px 0' : '10px 14px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  color: active ? 'var(--cf-gold)' : 'var(--cf-muted2)',
                  background: active ? 'rgba(200,168,75,0.08)' : 'transparent',
                  border: active ? '1px solid rgba(200,168,75,0.15)' : '1px solid transparent',
                }}
                title={collapsed ? label : undefined}
              >
                <span
                  className="text-lg transition-transform duration-300"
                  style={{ transform: active ? 'scale(1.15)' : 'scale(1)' }}
                >
                  {icon}
                </span>
                {!collapsed && (
                  <span className="font-ui text-sm font-semibold truncate">{label}</span>
                )}
                {active && (
                  <div
                    className="absolute left-0 top-[20%] bottom-[20%] w-[2px] rounded-full"
                    style={{ background: 'var(--cf-gold)' }}
                  />
                )}
                {page === 'trading' && tradeCount > 0 && (
                  <span
                    className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full animate-pulse-dot"
                    style={{ background: 'var(--cf-gold)', boxShadow: '0 0 6px rgba(200,168,75,0.6)' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Wallet button */}
        <div className="px-2 pb-3">
          <button
            className="w-full flex items-center gap-2 rounded-xl font-ui text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
            style={{
              padding: collapsed ? '10px 0' : '10px 14px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: 'var(--cf-gold)',
              border: '1px solid rgba(200,168,75,0.2)',
              background: 'rgba(200,168,75,0.04)',
            }}
            onClick={() => alert('Wallet connect coming soon!')}
          >
            <span>🔗</span>
            {!collapsed && <span>Connect Wallet</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-10 shrink-0 transition-colors duration-300"
          style={{
            borderTop: '1px solid var(--cf-border)',
            color: 'var(--cf-muted2)',
          }}
        >
          <span
            className="text-sm transition-transform duration-300"
            style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}
          >
            »
          </span>
        </button>
      </aside>

      {/* Spacer for desktop layout */}
      <div
        className="hidden sm:block shrink-0 transition-all duration-500"
        style={{ width: collapsed ? 64 : 220 }}
      />
    </>
  );
};

export default AppSidebar;
