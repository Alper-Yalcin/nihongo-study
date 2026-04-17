import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpenText,
  CircleHelp,
  Gamepad2,
  Home,
  Languages,
  MoonStar,
  Search,
  Settings2,
  Sword,
  Trophy,
  UserRound
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { appShellRoutes, getKanaEntryRoute } from '../../data/appShellContent';
import { AppLanguage, ThemeMode } from '../../data/appPreferences';
import { KanaScript } from '../../features/kana/domain/kanaItem';

interface TopNavProps {
  language: AppLanguage;
  themeMode: ThemeMode;
  activeScript: KanaScript;
  onActiveScriptChange: (script: KanaScript) => void;
  onLanguageChange: (language: AppLanguage) => void;
  onThemeModeChange: (theme: ThemeMode) => void;
}

const labels = {
  tr: {
    home: 'Home',
    learn: 'Ogren',
    letters: 'Harfler',
    practice: 'Alistirma',
    play: 'Oyun',
    quests: 'Gorevler',
    profile: 'Profil',
    settings: 'Ayarlar',
    search: 'Ara',
    help: 'Yardim',
    theme: 'Tema',
    language: 'Dil'
  },
  en: {
    home: 'Home',
    learn: 'Learn',
    letters: 'Letters',
    practice: 'Practice',
    play: 'Play',
    quests: 'Quests',
    profile: 'Profile',
    settings: 'Settings',
    search: 'Search',
    help: 'Help',
    theme: 'Theme',
    language: 'Language'
  }
} as const;

export const TopNav: React.FC<TopNavProps> = ({
  language,
  themeMode,
  activeScript,
  onActiveScriptChange,
  onLanguageChange,
  onThemeModeChange
}) => {
  const location = useLocation();
  const copy = labels[language];
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  const navItems = useMemo(
    () => [
      { id: 'home', label: copy.home, href: appShellRoutes.home, icon: Home },
      { id: 'learn', label: copy.learn, href: appShellRoutes.learn, icon: BookOpenText },
      {
        id: 'letters',
        label: copy.letters,
        href: `${appShellRoutes.letters}?script=${activeScript}`,
        icon: Languages
      },
      {
        id: 'practice',
        label: copy.practice,
        href: `${appShellRoutes.practice}?script=${activeScript}`,
        icon: Sword
      },
      {
        id: 'play',
        label: copy.play,
        href: getKanaEntryRoute(activeScript, 'play'),
        icon: Gamepad2
      },
      { id: 'quests', label: copy.quests, href: appShellRoutes.quests, icon: Trophy },
      { id: 'profile', label: copy.profile, href: appShellRoutes.account, icon: UserRound }
    ],
    [activeScript, copy]
  );

  const isItemActive = (id: string) => {
    if (id === 'home') {
      return location.pathname === appShellRoutes.home;
    }

    if (id === 'learn') {
      return (
        location.pathname === appShellRoutes.learn ||
        location.pathname.startsWith(appShellRoutes.learnUnitBase)
      );
    }

    if (id === 'letters') {
      return location.pathname.startsWith(appShellRoutes.letters);
    }

    if (id === 'practice') {
      return location.pathname.startsWith(appShellRoutes.practice);
    }

    if (id === 'play') {
      return location.pathname.includes('/play');
    }

    if (id === 'quests') {
      return location.pathname.startsWith(appShellRoutes.quests);
    }

    return location.pathname === appShellRoutes.account;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--kt-border-subtle)] bg-[rgba(8,14,22,0.92)] backdrop-blur">
      <div className="mx-auto flex max-w-[1800px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to={appShellRoutes.home} className="shrink-0">
          <img src="/logo/kototsuna-logo-light.png" alt="Kototsuna" className="h-9 w-auto" />
        </Link>

        <nav className="scrollbar-hide flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.id);

            return (
              <Link
                key={item.id}
                to={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-[0.95rem] border px-3 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
                  isActive
                    ? 'border-[color:var(--kt-accent-info)] bg-[rgba(54,160,255,0.12)] text-[var(--kt-accent-info)]'
                    : 'border-transparent text-white/84 hover:border-[var(--kt-border)] hover:bg-[rgba(255,255,255,0.05)]'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="relative hidden items-center gap-2 md:flex">
          <div className="flex items-center rounded-[0.95rem] border border-[var(--kt-border)] bg-[rgba(255,255,255,0.03)] p-1">
            {(['hiragana', 'katakana'] as KanaScript[]).map((script) => {
              const isActive = activeScript === script;

              return (
                <button
                  key={script}
                  type="button"
                  onClick={() => onActiveScriptChange(script)}
                  className={`rounded-[0.7rem] px-2.5 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] transition ${
                    isActive
                      ? 'bg-[var(--kt-accent-info)] text-[var(--kt-brand-on)]'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {script === 'hiragana' ? 'Hira' : 'Kata'}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onLanguageChange(language === 'tr' ? 'en' : 'tr')}
            className="rounded-[0.9rem] border border-[var(--kt-border)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white/80 transition hover:bg-[rgba(255,255,255,0.08)]"
          >
            {`${copy.language}: ${language.toUpperCase()}`}
          </button>

          <button
            type="button"
            onClick={() => onThemeModeChange(themeMode === 'dark' ? 'light' : 'dark')}
            className="rounded-[0.9rem] border border-[var(--kt-border)] bg-[rgba(255,255,255,0.03)] p-2 text-white/80 transition hover:bg-[rgba(255,255,255,0.08)]"
            title={copy.theme}
            aria-label={copy.theme}
          >
            <MoonStar size={16} />
          </button>

          <button
            type="button"
            onClick={() => setMoreOpen((current) => !current)}
            className="rounded-[0.9rem] border border-[var(--kt-border)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white/80 transition hover:bg-[rgba(255,255,255,0.08)]"
          >
            More
          </button>

          {moreOpen && (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] w-52 rounded-[1rem] border border-[var(--kt-border)] bg-[rgba(12,18,26,0.98)] p-2 shadow-[var(--kt-shadow-lg)]">
              <Link
                to={appShellRoutes.settings}
                className="flex items-center gap-2 rounded-[0.75rem] px-2.5 py-2 text-sm font-semibold text-white/85 transition hover:bg-[rgba(255,255,255,0.06)]"
              >
                <Settings2 size={16} />
                {copy.settings}
              </Link>
              <Link
                to={appShellRoutes.search}
                className="flex items-center gap-2 rounded-[0.75rem] px-2.5 py-2 text-sm font-semibold text-white/85 transition hover:bg-[rgba(255,255,255,0.06)]"
              >
                <Search size={16} />
                {copy.search}
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-[0.75rem] px-2.5 py-2 text-sm font-semibold text-white/85 transition hover:bg-[rgba(255,255,255,0.06)]"
              >
                <CircleHelp size={16} />
                {copy.help}
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
