import { ClipboardList, HeartHandshake, Inbox, ShieldCheck } from 'lucide-react';
import { navItems, type ViewKey } from '../app/navigation';
import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
  view: ViewKey;
  onNavigate: (view: ViewKey) => void;
}

const navIcons = {
  application: ClipboardList,
  workbench: ShieldCheck,
  intentions: Inbox,
};

export function AppShell({ children, view, onNavigate }: AppShellProps) {
  return (
    <main className="app-root">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => onNavigate('home')}>
          <HeartHandshake aria-hidden="true" size={22} />
          善见 Agent
        </button>
        <nav className="topnav" aria-label="后台入口">
          {navItems.map((item) => {
            const Icon = navIcons[item.key];
            return (
              <button
                aria-current={view === item.key ? 'page' : undefined}
                key={item.key}
                type="button"
                onClick={() => onNavigate(item.key)}
              >
                <Icon aria-hidden="true" size={17} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>
      {children}
    </main>
  );
}
