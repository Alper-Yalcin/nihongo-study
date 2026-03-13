/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Overview } from './pages/Overview';
import { Hiragana } from './pages/Hiragana';
import { Katakana } from './pages/Katakana';
import { Kanji } from './pages/Kanji';
import { Settings } from './pages/Settings';
import { TabType } from './types';
import { defaultKanaFontStyleId, kanaFontStyles, KanaFontStyleId } from './data/kanaFontStyles';

const KANA_FONT_STORAGE_KEY = 'nihongo-study.kana-font-style';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
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

  // Simple router based on state
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview onNavigate={setActiveTab} />;
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
        return <Overview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-50 font-sans text-slate-900"
      style={{ ['--font-jp-current' as string]: selectedKanaFont.fontFamily }}
    >
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
}
