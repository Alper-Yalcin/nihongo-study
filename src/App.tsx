/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Overview } from './pages/Overview';
import { Hiragana } from './pages/Hiragana';
import { Katakana } from './pages/Katakana';
import { Kanji } from './pages/Kanji';
import { Settings } from './pages/Settings';
import { TabType } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

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
        return <Settings />;
      default:
        return <Overview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <main>
        {renderContent()}
      </main>
    </div>
  );
}
