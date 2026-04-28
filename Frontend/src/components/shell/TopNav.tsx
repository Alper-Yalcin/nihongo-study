import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  Flame,
  Gamepad2,
  GraduationCap,
  Landmark,
  Moon,
  Sun,
  Trophy
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { appShellRoutes } from '../../data/appShellContent';
import { AppLanguage, ThemeMode } from '../../data/appPreferences';
import { KanaScript } from '../../features/kana/domain/kanaItem';
import { getJLearnUserState, subscribeJLearnUserState } from '../../features/jlearn/debug/debugStore';
import { useFeedback } from '../../shared/hooks/useFeedback';

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
    learn: 'Learn',
    letters: 'Letters',
    practice: 'Practice',
    play: 'Meydan',
    quests: 'Quests',
    streak: 'Tomoshibi',
    hanabira: 'Hanabira',
    dan: 'Dan'
  },
  en: {
    learn: 'Learn',
    letters: 'Letters',
    practice: 'Practice',
    play: 'Meydan',
    quests: 'Quests',
    streak: 'Tomoshibi',
    hanabira: 'Hanabira',
    dan: 'Dan'
  }
} as const;

const deriveKyuFromStreak = (streakDays: number): number => {
  const advanced = Math.floor(streakDays / 14);
  return Math.max(1, 10 - advanced);
};

const LanternMark: React.FC = () => (
  <span className="relative flex h-11 w-9 shrink-0 items-center justify-center" aria-hidden="true">
    <span className="absolute top-0 h-2 w-3 rounded-t-full border border-[#6b3b34]" />
    <span className="absolute top-2 h-7 w-6 rounded-[0.35rem] border-2 border-[#6b3b34] bg-[linear-gradient(180deg,#ff8e6f,#d94c43)] shadow-[inset_0_0_0_3px_rgba(255,231,189,0.65)]" />
    <span className="absolute top-3 h-5 w-px bg-[#7c453c]" />
    <span className="absolute top-4 h-px w-5 bg-[#7c453c]" />
    <span className="absolute bottom-1 h-2 w-3 rounded-b-full border border-[#6b3b34] bg-[#ffcf8f]" />
  </span>
);

const languageOptions: Array<{ id: AppLanguage; flag: string; label: string }> = [
  { id: 'tr', flag: '/flags/tr.svg', label: 'Türkçe' },
  { id: 'en', flag: '/flags/gb.svg', label: 'English' }
];

export const TopNav: React.FC<TopNavProps> = ({
  language,
  themeMode,
  activeScript,
  onLanguageChange,
  onThemeModeChange
}) => {
  const location = useLocation();
  const copy = labels[language];
  const isDark = themeMode === 'dark';
  const [streakDays, setStreakDays] = useState(() => getJLearnUserState().streakDays);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!langMenuRef.current?.contains(e.target as Node)) setIsLangOpen(false);
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);
  const { state: feedbackState } = useFeedback();
  const hanabira = Math.max(feedbackState.hanabira, 450);
  const kyu = deriveKyuFromStreak(streakDays);

  useEffect(
    () => subscribeJLearnUserState(() => setStreakDays(getJLearnUserState().streakDays)),
    []
  );

  const navItems = useMemo(() => [
    { id: 'learn', label: copy.learn, href: appShellRoutes.learn, icon: Landmark },
    { id: 'letters', label: copy.letters, href: `${appShellRoutes.letters}?script=${activeScript}`, icon: BookOpen },
    { id: 'practice', label: copy.practice, href: `${appShellRoutes.practice}?script=${activeScript}`, icon: Gamepad2 },
    { id: 'play', label: copy.play, href: appShellRoutes.meydan, icon: GraduationCap },
    { id: 'quests', label: copy.quests, href: appShellRoutes.quests, icon: Trophy }
  ], [activeScript, copy]);

  const isItemActive = (id: string) => {
    if (id === 'learn') {
      return (
        location.pathname === appShellRoutes.learn ||
        location.pathname.startsWith(appShellRoutes.learnJapanese) ||
        location.pathname.startsWith(appShellRoutes.learnUnitBase) ||
        location.pathname.startsWith(appShellRoutes.learnGuideBase)
      );
    }

    if (id === 'letters') return location.pathname.startsWith(appShellRoutes.letters);
    if (id === 'practice') return location.pathname.startsWith(appShellRoutes.practice);
    if (id === 'play') return location.pathname.startsWith(appShellRoutes.meydan);
    if (id === 'quests') return location.pathname.startsWith(appShellRoutes.quests);
    return false;
  };

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
      isDark
        ? 'border-[rgba(255,255,255,0.07)] bg-[rgba(18,12,22,0.52)] shadow-[0_4px_24px_rgba(0,0,0,0.22)]'
        : 'border-[rgba(180,120,90,0.13)] bg-[rgba(255,250,244,0.52)] shadow-[0_4px_18px_rgba(132,82,62,0.04)]'
    }`}>
      <div className="mx-auto flex h-[92px] max-w-[1800px] items-center gap-8 px-8">
        <Link to={appShellRoutes.learn} className="flex shrink-0 items-center gap-3">
          <LanternMark />
          <span className={`text-[26px] font-extrabold tracking-[-0.02em] ${isDark ? 'text-white' : 'text-[#1f2b3b]'}`}>Kototsuna</span>
        </Link>

        <nav className="scrollbar-hide flex min-w-0 flex-1 items-center gap-8 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.id);

            return (
              <Link
                key={item.id}
                to={item.href}
                className={`relative flex shrink-0 items-center gap-2.5 py-4 text-[15px] font-semibold transition ${
                  isActive ? 'text-[#f04d72]' : isDark ? 'text-slate-200 hover:text-[#ff88a2]' : 'text-[#4d5968] hover:text-[#f04d72]'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.4 : 2.1} />
                <span>{item.label}</span>
                {isActive && <span className="absolute bottom-1 left-9 right-0 h-0.5 rounded-full bg-[#f04d72]" />}
              </Link>
            );
          })}
        </nav>

        <div className={`hidden shrink-0 items-center gap-5 text-[16px] font-bold md:flex ${isDark ? 'text-slate-100' : 'text-[#263344]'}`}>

          {/* Language selector */}
          <div ref={langMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsLangOpen((v) => !v)}
              className={`flex items-center gap-2 text-sm font-semibold transition ${
                isDark ? 'text-slate-200 hover:text-white' : 'text-[#4d5968] hover:text-[#f04d72]'
              }`}
              aria-haspopup="listbox"
              aria-expanded={isLangOpen}
            >
              <img
                src={languageOptions.find((o) => o.id === language)?.flag}
                alt=""
                className="h-4 w-4 rounded-full object-cover"
              />
              <span className="uppercase tracking-wide">{language}</span>
              <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className={`absolute right-0 top-[calc(100%+8px)] z-50 min-w-[140px] overflow-hidden rounded-xl border shadow-lg backdrop-blur-xl ${
                isDark
                  ? 'border-[rgba(255,255,255,0.08)] bg-[rgba(18,12,22,0.82)]'
                  : 'border-[rgba(180,120,90,0.13)] bg-[rgba(255,250,244,0.92)]'
              }`}>
                {languageOptions.map((option) => {
                  const isActive = option.id === language;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => { onLanguageChange(option.id); setIsLangOpen(false); }}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition ${
                        isActive
                          ? isDark
                            ? 'bg-[rgba(255,255,255,0.1)] text-white'
                            : 'bg-[rgba(240,77,114,0.08)] text-[#f04d72]'
                          : isDark
                            ? 'text-slate-300 hover:bg-[rgba(255,255,255,0.06)]'
                            : 'text-[#4d5968] hover:bg-[rgba(180,120,90,0.07)]'
                      }`}
                    >
                      <img src={option.flag} alt="" className="h-4 w-4 rounded-full object-cover" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onThemeModeChange(isDark ? 'light' : 'dark')}
            className={`flex items-center justify-center transition ${
              isDark ? 'text-yellow-200 hover:text-white' : 'text-[#d94872] hover:text-[#f04d72]'
            }`}
            aria-label={isDark ? 'Light mode' : 'Dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link
            to={appShellRoutes.learn}
            className="flex items-center gap-1.5 text-[#df6c20]"
            title={`${copy.streak}: ${streakDays}`}
            aria-label={`${copy.streak}: ${streakDays}`}
          >
            <Flame size={20} fill="currentColor" />
            <span className="text-[#f07b21]">灯</span>
            <span>{Math.max(streakDays, 12)}</span>
          </Link>

          <div
            className="flex items-center gap-1.5 text-[#d94872]"
            title={`${copy.hanabira}: ${hanabira}`}
            aria-label={`${copy.hanabira}: ${hanabira}`}
          >
            <span className="text-[21px] leading-none">花</span>
            <span>{hanabira}</span>
          </div>

          <div
            className="flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-[#ffd8c2] bg-[#fff0e4] text-[27px] font-extrabold text-[#8f3a2a] shadow-[inset_0_0_0_6px_rgba(255,255,255,0.36)]"
            title={`${copy.dan}: ${kyu} kyu`}
            aria-label={`${copy.dan}: ${kyu} kyu`}
          >
            {kyu}°
          </div>
        </div>
      </div>
    </header>
  );
};
