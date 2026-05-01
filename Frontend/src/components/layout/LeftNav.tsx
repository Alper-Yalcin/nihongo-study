import React, { useMemo, useState } from 'react';
import {
  BookOpenText, CircleHelp, Gamepad2, Home, Languages,
  MoonStar, MoreHorizontal, Search, Settings2, Sword, Trophy, UserRound
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { appShellRoutes, getKanaEntryRoute, getPracticeHomeRoute } from '../../data/appShellContent';
import { AppLanguage, ThemeMode } from '../../data/appPreferences';
import { KanaScript } from '../../features/kana/domain/kanaItem';

interface LeftNavProps {
  language: AppLanguage;
  themeMode: ThemeMode;
  activeScript: KanaScript;
  onLanguageChange: (language: AppLanguage) => void;
  onThemeModeChange: (theme: ThemeMode) => void;
}

const labels = {
  tr: {
    home: 'Home', learn: 'Ogren', letters: 'Harfler', practice: 'Alistirma',
    play: 'Oyun', quests: 'Gorevler', profile: 'Profil', more: 'Daha Fazla',
    settings: 'Ayarlar', search: 'Ara', help: 'Yardim', theme: 'Tema', language: 'Dil'
  },
  en: {
    home: 'Home', learn: 'Learn', letters: 'Letters', practice: 'Practice',
    play: 'Play', quests: 'Quests', profile: 'Profile', more: 'More',
    settings: 'Settings', search: 'Search', help: 'Help', theme: 'Theme', language: 'Language'
  }
} as const;

export const LeftNav: React.FC<LeftNavProps> = ({
  language, themeMode, activeScript,
  onLanguageChange, onThemeModeChange
}) => {
  const location = useLocation();
  const copy = labels[language];
  const [moreOpen, setMoreOpen] = useState(false);
  const logoSrc = themeMode === 'dark' ? '/logo/kototsuna-logo.png' : '/logo/kototsuna-logo-light.png';

  const navItems = useMemo(() => [
    { id: 'home', label: copy.home, href: appShellRoutes.home, icon: Home },
    { id: 'learn', label: copy.learn, href: appShellRoutes.learn, icon: BookOpenText },
    { id: 'letters', label: copy.letters, href: `${appShellRoutes.letters}?script=${activeScript}`, icon: Languages },
    { id: 'practice', label: copy.practice, href: getPracticeHomeRoute(activeScript), icon: Sword },
    { id: 'play', label: copy.play, href: getKanaEntryRoute(activeScript, 'play'), icon: Gamepad2 },
    { id: 'quests', label: copy.quests, href: appShellRoutes.quests, icon: Trophy },
    { id: 'profile', label: copy.profile, href: appShellRoutes.account, icon: UserRound }
  ], [activeScript, copy]);

  return (
    <aside className="hidden xl:sticky xl:top-0 xl:flex xl:h-screen xl:flex-col xl:overflow-y-auto xl:border-r xl:border-[var(--kt-border-subtle)] xl:bg-[radial-gradient(circle_at_top,var(--kt-accent-info-soft),transparent_18rem),var(--kt-nav-bg)] xl:px-5 xl:py-6 xl:backdrop-blur">
      <Link to={appShellRoutes.home} className="mb-6 block rounded-[1.5rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] px-4 py-4 shadow-[var(--kt-shadow-sm)]">
        <img src={logoSrc} alt="Kototsuna" className="h-10 w-auto" />
        <div className="mt-3 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--kt-nav-text-muted)]">
          Study cockpit
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.id === 'home' ? location.pathname === appShellRoutes.home
            : item.id === 'learn' ? location.pathname === appShellRoutes.learn || location.pathname.startsWith(appShellRoutes.learnJapanese) || location.pathname.startsWith(appShellRoutes.learnUnitBase) || location.pathname.startsWith(appShellRoutes.learnGuideBase)
            : item.id === 'letters' ? location.pathname.startsWith(appShellRoutes.letters)
            : item.id === 'practice' ? location.pathname.startsWith(appShellRoutes.practice)
            : item.id === 'play' ? location.pathname.includes('/play')
            : item.id === 'quests' ? location.pathname.startsWith(appShellRoutes.quests)
            : location.pathname === appShellRoutes.account;

          return (
            <Link
              key={item.id}
              to={item.href}
              className={`group relative flex items-center gap-4 rounded-[1.25rem] border px-4 py-4 text-sm font-black uppercase tracking-[0.12em] shadow-[var(--kt-shadow-sm)] transition ${
                isActive
                  ? 'border-[color:var(--kt-accent-info)] bg-[var(--kt-nav-item-active-bg)] text-[var(--kt-accent-info)]'
                  : 'border-transparent bg-transparent text-[var(--kt-nav-text)] hover:-translate-y-0.5 hover:border-[var(--kt-border)] hover:bg-[var(--kt-nav-item-hover)]'
              }`}
            >
              {isActive && <span className="absolute left-2 h-8 w-1 rounded-full bg-[var(--kt-accent-info)]" />}
              <Icon size={24} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="relative">
          <button
            type="button"
            onClick={() => setMoreOpen((c) => !c)}
            className={`flex w-full items-center gap-4 rounded-[1.25rem] border px-4 py-4 text-sm font-black uppercase tracking-[0.12em] shadow-[var(--kt-shadow-sm)] transition ${
              moreOpen
                ? 'border-[var(--kt-border)] bg-[var(--kt-nav-item-hover)] text-[var(--kt-ink-strong)]'
                : 'border-transparent text-[var(--kt-nav-text)] hover:-translate-y-0.5 hover:border-[var(--kt-border)] hover:bg-[var(--kt-nav-item-hover)]'
            }`}
          >
            <MoreHorizontal size={24} />
            <span>{copy.more}</span>
          </button>

          {moreOpen && (
            <div className="mt-3 rounded-[1.4rem] border border-[var(--kt-border)] bg-[var(--kt-dropdown-bg)] p-3 shadow-[var(--kt-shadow-lg)] backdrop-blur">
              <Link to={appShellRoutes.settings} className="flex items-center gap-3 rounded-[1rem] px-3 py-3 text-sm font-semibold text-[var(--kt-ink)] transition hover:bg-[var(--kt-nav-item-hover)]">
                <Settings2 size={18} />{copy.settings}
              </Link>
              <Link to={appShellRoutes.search} className="flex items-center gap-3 rounded-[1rem] px-3 py-3 text-sm font-semibold text-[var(--kt-ink)] transition hover:bg-[var(--kt-nav-item-hover)]">
                <Search size={18} />{copy.search}
              </Link>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-[1rem] px-3 py-3 text-sm font-semibold text-[var(--kt-ink)] transition hover:bg-[var(--kt-nav-item-hover)]">
                <CircleHelp size={18} />{copy.help}
              </a>
              <button type="button" onClick={() => onThemeModeChange(themeMode === 'dark' ? 'light' : 'dark')} className="flex w-full items-center gap-3 rounded-[1rem] px-3 py-3 text-sm font-semibold text-[var(--kt-ink)] transition hover:bg-[var(--kt-nav-item-hover)]">
                <MoonStar size={18} />
                {`${copy.theme}: ${themeMode === 'dark' ? 'Gece' : 'Gun'}`}
              </button>
              <button type="button" onClick={() => onLanguageChange(language === 'tr' ? 'en' : 'tr')} className="flex w-full items-center gap-3 rounded-[1rem] px-3 py-3 text-sm font-semibold text-[var(--kt-ink)] transition hover:bg-[var(--kt-nav-item-hover)]">
                <Languages size={18} />
                {`${copy.language}: ${language.toUpperCase()}`}
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="mt-6 space-y-4 rounded-[1.35rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-3 shadow-[var(--kt-shadow-sm)]">
        <div className="grid grid-cols-3 gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--kt-nav-text-muted)]">
          <a href="#" className="hover:text-[var(--kt-nav-text)]">Hakkinda</a>
          <a href="#" className="hover:text-[var(--kt-nav-text)]">Sartlar</a>
          <a href="#" className="hover:text-[var(--kt-nav-text)]">Gizlilik</a>
        </div>
      </div>
    </aside>
  );
};
