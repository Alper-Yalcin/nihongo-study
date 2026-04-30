import React from 'react';
import { useLocation } from 'react-router-dom';
import { AppLanguage, ThemeMode } from '../../data/appPreferences';
import { KanaScript } from '../../features/kana/domain/kanaItem';
import { TopNav } from './TopNav';
import { SeasonalBackdrop } from '../feedback/SeasonalBackdrop';

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
  const isDark = themeMode === 'dark';
  const isLearnMap = location.pathname === '/learn' || location.pathname === '/learn/japanese';

  return (
    <div className={`min-h-screen !bg-transparent text-[var(--kt-ink)] ${isDark ? 'theme-dark' : 'theme-light'}`}>

      {/* Layer 3 — seasonal particles, above overlay so they remain visible */}
      {!isLearnMap && (
        <div className="pointer-events-none fixed inset-0 z-[3]" aria-hidden="true">
          <SeasonalBackdrop fixed={false} />
        </div>
      )}

      {/* Layer 5+ — all page content */}
      <div className="relative z-[5] min-h-screen">
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
              ? 'w-full max-w-none px-0 pb-0 pt-0'
              : 'mx-auto w-full max-w-[1400px] px-4 pb-28 pt-5 sm:px-6 lg:px-10 xl:pb-12 xl:pt-7'
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
};
