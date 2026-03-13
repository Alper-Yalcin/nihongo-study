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
  const languageMenuRef = useRef<HTMLDivElement | null>(null);

  const labels = navbarLabels[language];
  const themeText = themeLabels[language];
  const isDark = themeMode === 'dark';

  const selectedLanguage = useMemo(
    () => languageOptions.find(option => option.id === language) ?? languageOptions[0],
    [language]
  );

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const panelClass = isDark
    ? 'border border-slate-700 bg-slate-900/80'
    : 'border border-slate-200 bg-slate-50';

  const navClass = isDark
    ? 'bg-slate-950 border-b border-slate-800 shadow-[0_8px_24px_rgba(2,6,23,0.28)]'
    : 'bg-white border-b border-gray-200 shadow-sm';

  const dropdownItemBase = isDark
    ? 'text-slate-200 hover:bg-slate-800'
    : 'text-slate-700 hover:bg-slate-50';

  const toggleTheme = () => {
    onThemeModeChange(isDark ? 'light' : 'dark');
  };

  return (
    <nav className={`sticky top-0 z-20 backdrop-blur ${navClass}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          <div className="flex min-w-0 items-center gap-6">
            <div className="flex-shrink-0">
              <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                Nihongo Study
              </span>
            </div>

            <div className="hidden sm:flex sm:space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : isDark
                        ? 'border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-100'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {labels[tab]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div ref={languageMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsLanguageMenuOpen(prev => !prev)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${panelClass} ${
                  isDark ? 'text-slate-100 hover:bg-slate-800' : 'text-slate-700 hover:bg-white'
                }`}
                aria-haspopup="menu"
                aria-expanded={isLanguageMenuOpen}
              >
                <img src={selectedLanguage.flag} alt="" className="h-4 w-4 rounded-full object-cover" />
                <span className="hidden sm:inline">{languageMeta[language].label}</span>
                <span className="sm:hidden">{languageMeta[language].shortLabel}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${isLanguageMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isLanguageMenuOpen && (
                <div
                  className={`absolute right-0 top-[calc(100%+8px)] min-w-44 overflow-hidden rounded-xl shadow-lg ${
                    isDark ? 'border border-slate-700 bg-slate-900' : 'border border-slate-200 bg-white'
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
                              : 'bg-indigo-50 text-indigo-700'
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
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${panelClass} ${
                isDark ? 'text-slate-100 hover:bg-slate-800' : 'text-slate-700 hover:bg-white'
              }`}
              aria-label={isDark ? themeText.dark : themeText.light}
              title={isDark ? themeText.dark : themeText.light}
            >
              {isDark ? <Moon size={16} /> : <Sun size={16} />}
              <span className="hidden sm:inline">{isDark ? themeText.dark : themeText.light}</span>
            </button>
          </div>
        </div>
      </div>

      <div className={`sm:hidden overflow-x-auto border-t ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
        <div className="flex space-x-4 px-4 py-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-indigo-50 text-indigo-700'
                  : isDark
                    ? 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {labels[tab]}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
