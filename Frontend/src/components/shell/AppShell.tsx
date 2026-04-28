import React from 'react';
import { useLocation } from 'react-router-dom';
import { AppLanguage, ThemeMode } from '../../data/appPreferences';
import { KanaScript } from '../../features/kana/domain/kanaItem';
import { TopNav } from './TopNav';
import { SeasonalBackdrop } from '../../shared/feedback/SeasonalBackdrop';

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
}) => {
  const location = useLocation();
  const isLearnMap = location.pathname === '/learn' || location.pathname === '/learn/japanese';

  return (
    <div
      className={`min-h-screen text-[var(--kt-ink)] ${themeMode === 'dark' ? 'theme-dark' : 'theme-light'}`}
      style={{
        backgroundImage: isLearnMap ? 'none' : 'var(--kt-washi-bg)',
        backgroundColor: isLearnMap ? '#fff5ef' : 'var(--kt-surface-page)'
      }}
    >
      {!isLearnMap && <SeasonalBackdrop />}
      <TopNav
        language={language}
        themeMode={themeMode}
        activeScript={activeScript}
        onActiveScriptChange={onActiveScriptChange}
        onLanguageChange={onLanguageChange}
        onThemeModeChange={onThemeModeChange}
      />

      <main
        className={
          isLearnMap
            ? 'mx-auto w-full max-w-[1800px] px-0 pb-0 pt-0'
            : 'mx-auto w-full max-w-[1400px] px-4 pb-28 pt-5 sm:px-6 lg:px-10 xl:pb-12 xl:pt-7'
        }
      >
        {children}
      </main>
    </div>
  );
};
