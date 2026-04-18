import React from 'react';
import { AppLanguage, ThemeMode } from '../../data/appPreferences';
import { KanaScript } from '../../features/kana/domain/kanaItem';
import { RightRail } from './RightRail';
import { TopNav } from './TopNav';
import { LeftNav } from './LeftNav';

interface AppShellProps {
  language: AppLanguage;
  themeMode: ThemeMode;
  activeScript: KanaScript;
  onActiveScriptChange: (script: KanaScript) => void;
  onLanguageChange: (language: AppLanguage) => void;
  onThemeModeChange: (theme: ThemeMode) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  language,
  themeMode,
  activeScript,
  onActiveScriptChange,
  onLanguageChange,
  onThemeModeChange,
  children
}) => (
  <div className={`min-h-screen bg-[var(--kt-surface-page)] text-[var(--kt-ink)] ${themeMode === 'dark' ? 'theme-dark' : 'theme-light'}`}>
    {/* Mobile/tablet top nav (hidden on xl+) */}
    <div className="xl:hidden">
      <TopNav
        language={language}
        themeMode={themeMode}
        activeScript={activeScript}
        onActiveScriptChange={onActiveScriptChange}
        onLanguageChange={onLanguageChange}
        onThemeModeChange={onThemeModeChange}
      />
    </div>

    {/* Desktop 3-column layout */}
    <div className="xl:grid xl:min-h-screen xl:grid-cols-[240px_minmax(0,1fr)_340px]">
      {/* Left sidebar — desktop only */}
      <LeftNav
        language={language}
        themeMode={themeMode}
        activeScript={activeScript}
        onActiveScriptChange={onActiveScriptChange}
        onLanguageChange={onLanguageChange}
        onThemeModeChange={onThemeModeChange}
      />

      {/* Main content */}
      <main className="min-w-0 px-4 pb-12 pt-5 sm:px-6 lg:px-8 xl:px-10 xl:pt-7">
        {children}
      </main>

      {/* Right rail — desktop only */}
      <div className="hidden px-6 pt-7 xl:block">
        <RightRail language={language} activeScript={activeScript} />
      </div>
    </div>
  </div>
);
