import React from 'react';
import { Moon, Sun } from 'lucide-react';
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
  const labels = navbarLabels[language];
  const themeText = themeLabels[language];
  const isDark = themeMode === 'dark';

  const panelClass = isDark
    ? 'border border-slate-700 bg-slate-900/80'
    : 'border border-slate-200 bg-slate-50';

  const navClass = isDark
    ? 'bg-slate-950 border-b border-slate-800 shadow-[0_8px_24px_rgba(2,6,23,0.28)]'
    : 'bg-white border-b border-gray-200 shadow-sm';

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
            <div className={`hidden rounded-xl p-1 sm:flex ${panelClass}`}>
              {languageOptions.map((option) => {
                const isActive = option.id === language;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onLanguageChange(option.id)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : isDark
                          ? 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                          : 'text-slate-600 hover:bg-white hover:text-slate-900'
                    }`}
                    aria-label={languageMeta[option.id].label}
                  >
                    <img src={option.flag} alt="" className="h-4 w-4 rounded-full object-cover" />
                    <span>{languageMeta[option.id].shortLabel}</span>
                  </button>
                );
              })}
            </div>

            <div className={`hidden rounded-xl p-1 sm:flex ${panelClass}`}>
              <button
                type="button"
                onClick={() => onThemeModeChange('light')}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  themeMode === 'light'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : isDark
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
                aria-label={themeText.light}
              >
                <Sun size={16} />
                <span>{themeText.light}</span>
              </button>
              <button
                type="button"
                onClick={() => onThemeModeChange('dark')}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  themeMode === 'dark'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : isDark
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
                aria-label={themeText.dark}
              >
                <Moon size={16} />
                <span>{themeText.dark}</span>
              </button>
            </div>

            <div className={`flex rounded-xl p-1 sm:hidden ${panelClass}`}>
              {languageOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onLanguageChange(option.id)}
                  className={`rounded-lg p-2 transition-colors ${
                    option.id === language
                      ? 'bg-white shadow-sm ring-1 ring-slate-200'
                      : isDark
                        ? 'hover:bg-slate-800'
                        : 'hover:bg-white'
                  }`}
                  aria-label={languageMeta[option.id].label}
                >
                  <img src={option.flag} alt="" className="h-4 w-4 rounded-full object-cover" />
                </button>
              ))}
            </div>

            <div className={`flex rounded-xl p-1 sm:hidden ${panelClass}`}>
              <button
                type="button"
                onClick={() => onThemeModeChange('light')}
                className={`rounded-lg p-2 transition-colors ${
                  themeMode === 'light'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : isDark
                      ? 'text-slate-300 hover:bg-slate-800'
                      : 'text-slate-600 hover:bg-white'
                }`}
                aria-label={themeText.light}
              >
                <Sun size={16} />
              </button>
              <button
                type="button"
                onClick={() => onThemeModeChange('dark')}
                className={`rounded-lg p-2 transition-colors ${
                  themeMode === 'dark'
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                    : isDark
                      ? 'text-slate-300 hover:bg-slate-800'
                      : 'text-slate-600 hover:bg-white'
                }`}
                aria-label={themeText.dark}
              >
                <Moon size={16} />
              </button>
            </div>
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
