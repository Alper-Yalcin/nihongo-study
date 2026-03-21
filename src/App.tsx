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
import { usePersistentState } from './hooks/usePersistentState';

const KANA_FONT_STORAGE_KEY = 'nihongo-study.kana-font-style';
const APP_LANGUAGE_STORAGE_KEY = 'nihongo-study.app-language';
const THEME_MODE_STORAGE_KEY = 'nihongo-study.theme-mode';

const serializeString = <T extends string>(value: T) => value;
const deserializeLanguage = (value: string): AppLanguage => (value === 'en' ? 'en' : 'tr');
const deserializeThemeMode = (value: string): ThemeMode => (value === 'dark' ? 'dark' : 'light');
const deserializeKanaFontStyle = (value: string): KanaFontStyleId =>
  kanaFontStyles.some((option) => option.id === value)
    ? (value as KanaFontStyleId)
    : defaultKanaFontStyleId;

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [language, setLanguage] = usePersistentState<AppLanguage>(
    APP_LANGUAGE_STORAGE_KEY,
    'tr',
    {
      serialize: serializeString,
      deserialize: deserializeLanguage
    }
  );
  const [themeMode, setThemeMode] = usePersistentState<ThemeMode>(
    THEME_MODE_STORAGE_KEY,
    'light',
    {
      serialize: serializeString,
      deserialize: deserializeThemeMode
    }
  );
  const [kanaFontStyle, setKanaFontStyle] = usePersistentState<KanaFontStyleId>(
    KANA_FONT_STORAGE_KEY,
    defaultKanaFontStyleId,
    {
      serialize: serializeString,
      deserialize: deserializeKanaFontStyle
    }
  );

  const selectedKanaFont = useMemo(
    () => kanaFontStyles.find(option => option.id === kanaFontStyle) ?? kanaFontStyles[0],
    [kanaFontStyle]
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Simple router based on state
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview language={language} onNavigate={setActiveTab} />;
      case 'hiragana':
        return <Hiragana language={language} />;
      case 'katakana':
        return <Katakana language={language} />;
      case 'kanji':
        return <Kanji language={language} />;
      case 'settings':
        return (
          <Settings
            language={language}
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
