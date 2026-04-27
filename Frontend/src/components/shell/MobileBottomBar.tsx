import React, { useMemo } from 'react';
import { BookOpenText, Gamepad2, Languages, MoreHorizontal, Sword } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { appShellRoutes, getKanaEntryRoute } from '../../data/appShellContent';
import { KanaScript } from '../../features/kana/domain/kanaItem';

interface MobileBottomBarProps {
  activeScript: KanaScript;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ activeScript }) => {
  const location = useLocation();

  const items = useMemo(
    () => [
      { id: 'home', href: appShellRoutes.learn, icon: BookOpenText, label: 'Ogren' },
      { id: 'letters', href: `${appShellRoutes.letters}?script=${activeScript}`, icon: Languages, label: 'Harfler' },
      { id: 'practice', href: `${appShellRoutes.practice}?script=${activeScript}`, icon: Sword, label: 'Pratik' },
      { id: 'play', href: getKanaEntryRoute(activeScript, 'play'), icon: Gamepad2, label: 'Oyun' },
      { id: 'more', href: appShellRoutes.account, icon: MoreHorizontal, label: 'Daha' }
    ],
    [activeScript]
  );

  return (
    <nav className="fixed bottom-4 left-1/2 z-40 flex w-[min(92vw,28rem)] -translate-x-1/2 justify-between rounded-[1.6rem] border border-[var(--kt-border)] bg-[var(--kt-nav-bg)] px-4 py-3 shadow-[var(--kt-shadow-lg)] backdrop-blur xl:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.id === 'home'
            ? location.pathname === appShellRoutes.learn || location.pathname.startsWith(appShellRoutes.learnJapanese) || location.pathname.startsWith(appShellRoutes.learnUnitBase)
            : item.id === 'letters'
              ? location.pathname.startsWith(appShellRoutes.letters)
              : item.id === 'practice'
                ? location.pathname.startsWith(appShellRoutes.practice)
                : item.id === 'play'
                  ? location.pathname.includes('/play')
                  : location.pathname === appShellRoutes.account;

        return (
          <Link
            key={item.id}
            to={item.href}
            className={`flex min-w-[3.8rem] flex-col items-center gap-1 rounded-[1rem] px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
              isActive ? 'text-[var(--kt-accent-info)]' : 'text-[var(--kt-nav-text-muted)]'
            }`}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
