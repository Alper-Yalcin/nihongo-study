import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Moon, Sun } from 'lucide-react';
import { TabType } from '../types';
import {
  AppLanguage,
  ThemeMode,
  languageMeta,
  navbarLabels,
  themeLabels
} from '../data/appPreferences';
import trFlag from '../flags/tr.svg';
import gbFlag from '../flags/gb.svg';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: AppLanguage;
  onLanguageChange: (language: AppLanguage) => void;
  themeMode: ThemeMode;
  onThemeModeChange: (theme: ThemeMode) => void;
}

const tabs: TabType[] = ['overview', 'hiragana', 'katakana', 'kanji', 'settings'];

const languageOptions: Array<{ id: AppLanguage; flag: string }> = [
  { id: 'tr', flag: trFlag },
  { id: 'en', flag: gbFlag }
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  language,
  onLanguageChange,
  themeMode,
  onThemeModeChange
}) => {
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const desktopLanguageMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileLanguageMenuRef = useRef<HTMLDivElement | null>(null);

  const labels = navbarLabels[language];
  const themeText = themeLabels[language];
  const isDark = themeMode === 'dark';
  const logoSrc = isDark
    ? '/logo/Kotonoha_logo_with_sakura_design-removebg-preview.svg'
    : '/logo/Kotonoha_logo_with_cherry_blossoms-removebg-preview.svg';

  const selectedLanguage = useMemo(
    () => languageOptions.find(option => option.id === language) ?? languageOptions[0],
    [language]
  );

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideDesktopMenu = desktopLanguageMenuRef.current?.contains(target);
      const isInsideMobileMenu = mobileLanguageMenuRef.current?.contains(target);

      if (!isInsideDesktopMenu && !isInsideMobileMenu) {
        setIsLanguageMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const panelClass = isDark
    ? 'border border-slate-700 bg-slate-900/90'
    : 'border border-sky-100 bg-white/95';

  const desktopBarClass = isDark
    ? 'border border-slate-700 bg-slate-900/90 shadow-[0_12px_28px_rgba(15,10,16,0.45)]'
    : 'border border-sky-100 bg-white/95 shadow-[0_12px_28px_rgba(208,96,112,0.2)]';

  const navShellClass = isDark
    ? 'border-b border-slate-800/80 bg-slate-950/75'
    : 'border-b border-slate-200/80 bg-[#fff0f0]';

  const tabBaseClass = 'h-14 min-w-[92px] px-4 text-sm font-semibold tracking-[0.02em] transition-colors';

  const activeTabClass = isDark
    ? 'bg-sky-300 text-slate-950'
    : 'bg-sky-300 text-white';

  const inactiveTabClass = isDark
    ? 'text-sky-200 hover:bg-slate-800 hover:text-sky-100'
    : 'text-sky-400 hover:bg-sky-50 hover:text-sky-500';

  const utilityButtonClass = isDark
    ? 'text-sky-100 hover:bg-slate-800'
    : 'text-sky-400 hover:bg-sky-50';

  const utilityBorderClass = isDark ? 'border-slate-700' : 'border-sky-100';

  const dropdownItemBase = isDark
    ? 'text-slate-200 hover:bg-slate-800'
    : 'text-slate-700 hover:bg-sky-50';

  const toggleTheme = () => {
    onThemeModeChange(isDark ? 'light' : 'dark');
  };

  return (
    <nav className={`sticky top-0 z-20 backdrop-blur ${navShellClass}`}>
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className={`hidden items-stretch overflow-visible ${desktopBarClass} sm:flex`}>
          <div className={`flex w-52 flex-shrink-0 items-center justify-center border-r px-3 ${utilityBorderClass}`}>
            <img src={logoSrc} alt="Kotonoha logo" className="h-14 w-auto max-w-full object-contain" />
          </div>

          <div className="flex min-w-0 flex-1 items-stretch justify-center">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`${tabBaseClass} ${activeTab === tab ? activeTabClass : inactiveTabClass}`}
              >
                {labels[tab]}
              </button>
            ))}
          </div>

          <div className={`flex items-center gap-1 border-l px-2 ${utilityBorderClass}`}>
            <div ref={desktopLanguageMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsLanguageMenuOpen(prev => !prev)}
                className={`flex h-10 items-center gap-1 rounded-md px-2 text-xs font-semibold uppercase tracking-wide transition-colors ${utilityButtonClass}`}
                aria-haspopup="menu"
                aria-expanded={isLanguageMenuOpen}
              >
                <img src={selectedLanguage.flag} alt="" className="h-4 w-4 rounded-full object-cover" />
                <span>{languageMeta[language].shortLabel}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isLanguageMenuOpen && (
                <div
                  className={`absolute right-0 top-[calc(100%+8px)] z-30 min-w-40 overflow-hidden rounded-lg shadow-lg ${
                    isDark ? 'border border-slate-700 bg-slate-900' : 'border border-sky-100 bg-white'
                  }`}
                  role="menu"
                >
                  {languageOptions.map((option) => {
                    const isActive = option.id === language;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          onLanguageChange(option.id);
                          setIsLanguageMenuOpen(false);
                        }}
                        className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm font-medium transition-colors ${
                          isActive
                            ? isDark
                              ? 'bg-slate-800 text-white'
                              : 'bg-sky-50 text-sky-600'
                            : dropdownItemBase
                        }`}
                        role="menuitem"
                      >
                        <img src={option.flag} alt="" className="h-4 w-4 rounded-full object-cover" />
                        <span>{languageMeta[option.id].label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className={`flex h-10 w-10 items-center justify-center rounded-md transition-colors ${utilityButtonClass}`}
              aria-label={isDark ? themeText.dark : themeText.light}
              title={isDark ? themeText.dark : themeText.light}
            >
              {isDark ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-3 sm:hidden">
          <div className={`flex items-center justify-between rounded-xl px-3 py-2 ${panelClass}`}>
            <img
              src={logoSrc}
              alt="Kotonoha logo"
              className="h-12 w-auto max-w-[180px] object-contain"
            />

            <div className="flex items-center gap-2">
              <div ref={mobileLanguageMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsLanguageMenuOpen(prev => !prev)}
                  className={`flex h-9 items-center gap-1 rounded-md px-2 text-xs font-semibold uppercase tracking-wide transition-colors ${utilityButtonClass}`}
                  aria-haspopup="menu"
                  aria-expanded={isLanguageMenuOpen}
                >
                  <img src={selectedLanguage.flag} alt="" className="h-4 w-4 rounded-full object-cover" />
                  <span>{languageMeta[language].shortLabel}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isLanguageMenuOpen && (
                  <div
                    className={`absolute right-0 top-[calc(100%+8px)] z-30 min-w-40 overflow-hidden rounded-lg shadow-lg ${
                      isDark ? 'border border-slate-700 bg-slate-900' : 'border border-sky-100 bg-white'
                    }`}
                    role="menu"
                  >
                    {languageOptions.map((option) => {
                      const isActive = option.id === language;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            onLanguageChange(option.id);
                            setIsLanguageMenuOpen(false);
                          }}
                          className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm font-medium transition-colors ${
                            isActive
                              ? isDark
                                ? 'bg-slate-800 text-white'
                                : 'bg-sky-50 text-sky-600'
                              : dropdownItemBase
                          }`}
                          role="menuitem"
                        >
                          <img src={option.flag} alt="" className="h-4 w-4 rounded-full object-cover" />
                          <span>{languageMeta[option.id].label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${utilityButtonClass}`}
                aria-label={isDark ? themeText.dark : themeText.light}
                title={isDark ? themeText.dark : themeText.light}
              >
                {isDark ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>
          </div>

          <div className={`overflow-x-auto rounded-xl ${panelClass}`}>
            <div className="flex min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`px-4 py-3 text-sm font-semibold transition-colors ${
                    activeTab === tab
                      ? activeTabClass
                      : inactiveTabClass
                  }`}
                >
                  {labels[tab]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
