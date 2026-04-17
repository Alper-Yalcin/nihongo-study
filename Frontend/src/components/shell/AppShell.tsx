import React from 'react';
import { AppLanguage, ThemeMode } from '../../data/appPreferences';
import { KanaScript } from '../../features/kana/domain/kanaItem';
import { LeftNav } from './LeftNav';
import { MobileBottomBar } from './MobileBottomBar';
import { RightRail } from './RightRail';

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
    <div className="mx-auto grid min-h-screen max-w-[1800px] xl:grid-cols-[240px_minmax(0,1fr)_340px]">
      <LeftNav
        language={language}
        themeMode={themeMode}
        activeScript={activeScript}
        onActiveScriptChange={onActiveScriptChange}
        onLanguageChange={onLanguageChange}
        onThemeModeChange={onThemeModeChange}
      />
      <main className="min-w-0 px-4 pb-24 pt-5 sm:px-6 lg:px-8 xl:px-10 xl:pt-7">
        {children}
      </main>
      <div className="px-6 pt-7">
        <RightRail language={language} activeScript={activeScript} />
      </div>
    </div>
    <MobileBottomBar activeScript={activeScript} />
  </div>
);
