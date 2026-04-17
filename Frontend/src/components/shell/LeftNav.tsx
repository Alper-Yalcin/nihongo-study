import React, { useMemo, useState } from 'react';
import {
  CircleHelp,
  Gamepad2,
  Home,
  Languages,
  MoonStar,
  MoreHorizontal,
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
import { ScriptSwitcher } from './ScriptSwitcher';

interface LeftNavProps {
  language: AppLanguage;
  themeMode: ThemeMode;
  activeScript: KanaScript;
  onActiveScriptChange: (script: KanaScript) => void;
  onLanguageChange: (language: AppLanguage) => void;
  onThemeModeChange: (theme: ThemeMode) => void;
}

const labels = {
  tr: {
    learn: 'Ogren',
    letters: 'Harfler',
    practice: 'Alistirma',
    play: 'Oyun',
    quests: 'Gorevler',
    profile: 'Profil',
    more: 'Daha Fazla',
    settings: 'Ayarlar',
    search: 'Ara',
    help: 'Yardim',
    theme: 'Tema',
    language: 'Dil'
  },
  en: {
    learn: 'Learn',
    letters: 'Letters',
    practice: 'Practice',
    play: 'Play',
    quests: 'Quests',
    profile: 'Profile',
    more: 'More',
    settings: 'Settings',
    search: 'Search',
    help: 'Help',
    theme: 'Theme',
    language: 'Language'
  }
} as const;

export const LeftNav: React.FC<LeftNavProps> = ({
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

  const navItems = useMemo(
    () => [
      { id: 'learn', label: copy.learn, href: appShellRoutes.home, icon: Home },
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

  return (
    <aside className="hidden xl:flex xl:min-h-screen xl:flex-col xl:border-r xl:border-[var(--kt-border-subtle)] xl:bg-[rgba(8,14,22,0.92)] xl:px-5 xl:py-6">
      <Link to={appShellRoutes.home} className="px-3 pb-6 pt-2">
        <img src="/logo/kototsuna-logo-light.png" alt="Kototsuna" className="h-10 w-auto" />
      </Link>

      <nav className="flex flex-1 flex-col gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.id === 'learn'
              ? location.pathname === appShellRoutes.home || location.pathname.includes('/learn')
              : item.id === 'letters'
                ? location.pathname.startsWith(appShellRoutes.letters)
                : item.id === 'practice'
                  ? location.pathname.startsWith(appShellRoutes.practice)
                  : item.id === 'play'
                    ? location.pathname.includes('/play')
                    : item.id === 'quests'
                      ? location.pathname.startsWith(appShellRoutes.quests)
                      : location.pathname === appShellRoutes.account;

          return (
            <Link
              key={item.id}
              to={item.href}
              className={`flex items-center gap-4 rounded-[1.2rem] border px-4 py-4 text-sm font-black uppercase tracking-[0.12em] transition ${
                isActive
                  ? 'border-[color:var(--kt-accent-info)] bg-[rgba(54,160,255,0.12)] text-[var(--kt-accent-info)]'
                  : 'border-transparent text-white/84 hover:border-[var(--kt-border)] hover:bg-[rgba(255,255,255,0.04)]'
              }`}
            >
              <Icon size={24} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="relative">
          <button
            type="button"
            onClick={() => setMoreOpen((current) => !current)}
            className={`flex w-full items-center gap-4 rounded-[1.2rem] border px-4 py-4 text-sm font-black uppercase tracking-[0.12em] transition ${
              moreOpen
                ? 'border-[var(--kt-border)] bg-[rgba(255,255,255,0.05)] text-white'
                : 'border-transparent text-white/84 hover:border-[var(--kt-border)] hover:bg-[rgba(255,255,255,0.04)]'
            }`}
          >
            <MoreHorizontal size={24} />
            <span>{copy.more}</span>
          </button>

          {moreOpen && (
            <div className="mt-3 rounded-[1.4rem] border border-[var(--kt-border)] bg-[rgba(12,18,26,0.97)] p-3 shadow-[var(--kt-shadow-lg)]">
              <Link
                to={appShellRoutes.settings}
                className="flex items-center gap-3 rounded-[1rem] px-3 py-3 text-sm font-semibold text-white/86 transition hover:bg-[rgba(255,255,255,0.05)]"
              >
                <Settings2 size={18} />
                {copy.settings}
              </Link>
              <Link
                to={appShellRoutes.search}
                className="flex items-center gap-3 rounded-[1rem] px-3 py-3 text-sm font-semibold text-white/86 transition hover:bg-[rgba(255,255,255,0.05)]"
              >
                <Search size={18} />
                {copy.search}
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-[1rem] px-3 py-3 text-sm font-semibold text-white/86 transition hover:bg-[rgba(255,255,255,0.05)]"
              >
                <CircleHelp size={18} />
                {copy.help}
              </a>
              <button
                type="button"
                onClick={() => onThemeModeChange(themeMode === 'dark' ? 'light' : 'dark')}
                className="flex w-full items-center gap-3 rounded-[1rem] px-3 py-3 text-sm font-semibold text-white/86 transition hover:bg-[rgba(255,255,255,0.05)]"
              >
                <MoonStar size={18} />
                {`${copy.theme}: ${themeMode === 'dark' ? 'Gece' : 'Gun'}`}
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange(language === 'tr' ? 'en' : 'tr')}
                className="flex w-full items-center gap-3 rounded-[1rem] px-3 py-3 text-sm font-semibold text-white/86 transition hover:bg-[rgba(255,255,255,0.05)]"
              >
                <Languages size={18} />
                {`${copy.language}: ${language.toUpperCase()}`}
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="mt-6 space-y-4">
        <ScriptSwitcher activeScript={activeScript} onChange={onActiveScriptChange} />
        <div className="grid grid-cols-3 gap-2 px-3 text-[11px] font-black uppercase tracking-[0.14em] text-white/30">
          <a href="#" className="hover:text-white/60">Hakkinda</a>
          <a href="#" className="hover:text-white/60">Sartlar</a>
          <a href="#" className="hover:text-white/60">Gizlilik</a>
        </div>
      </div>
    </aside>
  );
};
