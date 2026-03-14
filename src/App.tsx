/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Overview } from './pages/Overview';
import { Hiragana } from './pages/Hiragana';
import { Katakana } from './pages/Katakana';
import { Kanji } from './pages/Kanji';
import { Settings } from './pages/Settings';
import { TabType } from './types';
import { defaultKanaFontStyleId, kanaFontStyles, KanaFontStyleId } from './data/kanaFontStyles';
import { AppLanguage, ThemeMode } from './data/appPreferences';

const KANA_FONT_STORAGE_KEY = 'nihongo-study.kana-font-style';
const APP_LANGUAGE_STORAGE_KEY = 'nihongo-study.app-language';
const THEME_MODE_STORAGE_KEY = 'nihongo-study.theme-mode';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [language, setLanguage] = useState<AppLanguage>(() => {
    if (typeof window === 'undefined') {
      return 'tr';
    }

    const saved = window.localStorage.getItem(APP_LANGUAGE_STORAGE_KEY);
    return saved === 'en' ? 'en' : 'tr';
  });
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    return window.localStorage.getItem(THEME_MODE_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  });
  const [kanaFontStyle, setKanaFontStyle] = useState<KanaFontStyleId>(() => {
    if (typeof window === 'undefined') {
      return defaultKanaFontStyleId;
    }

    const saved = window.localStorage.getItem(KANA_FONT_STORAGE_KEY) as KanaFontStyleId | null;
    return kanaFontStyles.some(option => option.id === saved) ? saved! : defaultKanaFontStyleId;
  });

  const selectedKanaFont = useMemo(
    () => kanaFontStyles.find(option => option.id === kanaFontStyle) ?? kanaFontStyles[0],
    [kanaFontStyle]
  );

  useEffect(() => {
    window.localStorage.setItem(KANA_FONT_STORAGE_KEY, kanaFontStyle);
  }, [kanaFontStyle]);

  useEffect(() => {
    window.localStorage.setItem(APP_LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    window.localStorage.setItem(THEME_MODE_STORAGE_KEY, themeMode);
  }, [themeMode]);

  // Simple router based on state
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview language={language} onNavigate={setActiveTab} />;
      case 'hiragana':
        return <Hiragana />;
      case 'katakana':
        return <Katakana />;
      case 'kanji':
        return <Kanji />;
      case 'settings':
        return (
          <Settings
            kanaFontStyle={kanaFontStyle}
            onKanaFontStyleChange={setKanaFontStyle}
          />
        );
      default:
        return <Overview language={language} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div
      className={`min-h-screen bg-slate-50 font-sans text-slate-900 ${themeMode === 'dark' ? 'theme-dark' : 'theme-light'} flex flex-col`}
      style={{ ['--font-jp-current' as string]: selectedKanaFont.fontFamily }}
    >
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={language}
        onLanguageChange={setLanguage}
        themeMode={themeMode}
        onThemeModeChange={setThemeMode}
      />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer language={language} themeMode={themeMode} />
    </div>
  );
}
