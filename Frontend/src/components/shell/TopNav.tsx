import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpenText,
  CircleHelp,
  Flame,
  Gamepad2,
  GraduationCap,
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
import { getJLearnUserState, subscribeJLearnUserState } from '../../features/jlearn/debug/debugStore';

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
    home: 'Home', learn: 'Ogren', japanese: 'Japonca', letters: 'Harfler', practice: 'Alistirma',
    play: 'Oyun', quests: 'Gorevler', profile: 'Profil', settings: 'Ayarlar',
    search: 'Ara', help: 'Yardim', theme: 'Tema', language: 'Dil', streak: 'Seri'
  },
  en: {
    home: 'Home', learn: 'Learn', japanese: 'Japanese', letters: 'Letters', practice: 'Practice',
    play: 'Play', quests: 'Quests', profile: 'Profile', settings: 'Settings',
    search: 'Search', help: 'Help', theme: 'Theme', language: 'Language', streak: 'Streak'
  }
} as const;

export const TopNav: React.FC<TopNavProps> = ({
  language, themeMode, activeScript,
  onActiveScriptChange, onLanguageChange, onThemeModeChange
}) => {
  const location = useLocation();
  const copy = labels[language];
  const [moreOpen, setMoreOpen] = useState(false);
  const [streakDays, setStreakDays] = useState(() => getJLearnUserState().streakDays);
  const logoSrc = themeMode === 'dark' ? '/logo/kototsuna-logo.png' : '/logo/kototsuna-logo-light.png';

  useEffect(() => { setMoreOpen(false); }, [location.pathname]);
  useEffect(
    () => subscribeJLearnUserState(() => setStreakDays(getJLearnUserState().streakDays)),
    []
  );

  const navItems = useMemo(() => [
    { id: 'home', label: copy.home, href: appShellRoutes.home, icon: Home },
    { id: 'learn', label: copy.learn, href: appShellRoutes.learn, icon: BookOpenText },
    { id: 'japanese', label: copy.japanese, href: appShellRoutes.learnJapanese, icon: GraduationCap },
    { id: 'letters', label: copy.letters, href: `${appShellRoutes.letters}?script=${activeScript}`, icon: Languages },
    { id: 'practice', label: copy.practice, href: `${appShellRoutes.practice}?script=${activeScript}`, icon: Sword },
    { id: 'play', label: copy.play, href: getKanaEntryRoute(activeScript, 'play'), icon: Gamepad2 },
    { id: 'quests', label: copy.quests, href: appShellRoutes.quests, icon: Trophy },
    { id: 'profile', label: copy.profile, href: appShellRoutes.account, icon: UserRound }
  ], [activeScript, copy]);

  const isItemActive = (id: string) => {
    if (id === 'home') return location.pathname === appShellRoutes.home;
    if (id === 'learn') return location.pathname === appShellRoutes.learn || location.pathname.startsWith(appShellRoutes.learnUnitBase) || location.pathname.startsWith(appShellRoutes.learnGuideBase);
    if (id === 'japanese') return location.pathname.startsWith(appShellRoutes.learnJapanese);
    if (id === 'letters') return location.pathname.startsWith(appShellRoutes.letters);
    if (id === 'practice') return location.pathname.startsWith(appShellRoutes.practice);
    if (id === 'play') return location.pathname.includes('/play');
    if (id === 'quests') return location.pathname.startsWith(appShellRoutes.quests);
    return location.pathname === appShellRoutes.account;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--kt-border-subtle)] bg-[color-mix(in_srgb,var(--kt-nav-bg)_90%,transparent)] shadow-[var(--kt-shadow-sm)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1800px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to={appShellRoutes.home} className="shrink-0">
          <img src={logoSrc} alt="Kototsuna" className="h-9 w-auto" />
        </Link>

        <Link
          to={appShellRoutes.learnJapanese}
          className="flex shrink-0 items-center gap-1 rounded-[0.85rem] border border-[color:var(--kt-accent-warning)]/35 bg-[var(--kt-accent-warning-soft)] px-2.5 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--kt-accent-warning)] shadow-[var(--kt-shadow-sm)] md:hidden"
          title={`${copy.streak}: ${streakDays}`}
          aria-label={`${copy.streak}: ${streakDays}`}
        >
          <Flame size={14} />
          <span>{streakDays}</span>
        </Link>

        <nav className="scrollbar-hide flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.id);
            return (
              <Link
                key={item.id}
                to={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-[1rem] border px-3 py-2 text-xs font-black uppercase tracking-[0.12em] shadow-[var(--kt-shadow-sm)] transition ${
                  isActive
                    ? 'border-[color:var(--kt-accent-info)] bg-[var(--kt-nav-item-active-bg)] text-[var(--kt-accent-info)]'
                    : 'border-transparent text-[var(--kt-nav-text)] hover:-translate-y-0.5 hover:border-[var(--kt-border)] hover:bg-[var(--kt-nav-item-hover)]'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="relative hidden items-center gap-2 md:flex">
          <Link
            to={appShellRoutes.learnJapanese}
            className="flex items-center gap-1.5 rounded-[0.95rem] border border-[color:var(--kt-accent-warning)]/35 bg-[var(--kt-accent-warning-soft)] px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--kt-accent-warning)] shadow-[var(--kt-shadow-sm)] transition hover:-translate-y-0.5 hover:bg-[var(--kt-nav-item-hover)]"
            title={`${copy.streak}: ${streakDays}`}
            aria-label={`${copy.streak}: ${streakDays}`}
          >
            <Flame size={15} />
            <span>{streakDays}</span>
          </Link>

          <div className="flex items-center rounded-[0.95rem] border border-[var(--kt-border)] bg-[var(--kt-surface-muted)] p-1">
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
                      : 'text-[var(--kt-nav-text-muted)] hover:text-[var(--kt-nav-text)]'
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
            className="rounded-[0.9rem] border border-[var(--kt-border)] bg-[var(--kt-surface-muted)] px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--kt-nav-text)] transition hover:bg-[var(--kt-nav-item-hover)]"
          >
            {`${copy.language}: ${language.toUpperCase()}`}
          </button>

          <button
            type="button"
            onClick={() => onThemeModeChange(themeMode === 'dark' ? 'light' : 'dark')}
            className="rounded-[0.9rem] border border-[var(--kt-border)] bg-[var(--kt-surface-muted)] p-2 text-[var(--kt-nav-text)] transition hover:bg-[var(--kt-nav-item-hover)]"
            title={copy.theme}
            aria-label={copy.theme}
          >
            <MoonStar size={16} />
          </button>

          <button
            type="button"
            onClick={() => setMoreOpen((c) => !c)}
            className="rounded-[0.9rem] border border-[var(--kt-border)] bg-[var(--kt-surface-muted)] px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--kt-nav-text)] transition hover:bg-[var(--kt-nav-item-hover)]"
          >
            More
          </button>

          {moreOpen && (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] w-52 rounded-[1rem] border border-[var(--kt-border)] bg-[var(--kt-dropdown-bg)] p-2 shadow-[var(--kt-shadow-lg)] backdrop-blur">
              <Link to={appShellRoutes.settings} className="flex items-center gap-2 rounded-[0.75rem] px-2.5 py-2 text-sm font-semibold text-[var(--kt-ink)] transition hover:bg-[var(--kt-nav-item-hover)]">
                <Settings2 size={16} />{copy.settings}
              </Link>
              <Link to={appShellRoutes.search} className="flex items-center gap-2 rounded-[0.75rem] px-2.5 py-2 text-sm font-semibold text-[var(--kt-ink)] transition hover:bg-[var(--kt-nav-item-hover)]">
                <Search size={16} />{copy.search}
              </Link>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-[0.75rem] px-2.5 py-2 text-sm font-semibold text-[var(--kt-ink)] transition hover:bg-[var(--kt-nav-item-hover)]">
                <CircleHelp size={16} />{copy.help}
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
