/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { LandingPage } from './pages/LandingPage';
import { Kanji } from './pages/Kanji';
import { KanaItemPage } from './pages/KanaItemPage';
import { KanaPlayPage } from './pages/KanaPlayPage';
import { KanaSessionPage } from './pages/KanaSessionPage';
import { KanaStudyRoadmapPage } from './pages/KanaStudyRoadmapPage';
import { Settings } from './pages/Settings';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { LettersPage } from './pages/LettersPage';
import { PracticePage } from './pages/PracticePage';
import { QuestsPage } from './pages/QuestsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LearnUnitPage } from './pages/LearnUnitPage';
import { defaultKanaFontStyleId, kanaFontStyles, KanaFontStyleId } from './data/kanaFontStyles';
import { AppLanguage, ThemeMode } from './data/appPreferences';
import { usePersistentState } from './hooks/usePersistentState';
import { ACTIVE_SCRIPT_STORAGE_KEY, isKanaScript, resolveActiveScript } from './hooks/useActiveScript';
import { appShellRoutes, getPracticeRoute } from './data/appShellContent';
import { KanaProgressProvider } from './features/kana/progress/progressStore';
import { KanaScript } from './features/kana/domain/kanaItem';
import { AppShell } from './components/shell';

const KANA_FONT_STORAGE_KEY = 'kototsuna.kana-font-style';
const APP_LANGUAGE_STORAGE_KEY = 'kototsuna.app-language';
const THEME_MODE_STORAGE_KEY = 'kototsuna.theme-mode';
const LEGACY_KANA_FONT_STORAGE_KEY = 'kotonoha.kana-font-style';
const LEGACY_APP_LANGUAGE_STORAGE_KEY = 'kotonoha.app-language';
const LEGACY_THEME_MODE_STORAGE_KEY = 'kotonoha.theme-mode';

const serializeString = <T extends string>(value: T) => value;
const deserializeLanguage = (value: string): AppLanguage => (value === 'en' ? 'en' : 'tr');
const deserializeThemeMode = (value: string): ThemeMode => (value === 'light' ? 'light' : 'dark');
const deserializeKanaFontStyle = (value: string): KanaFontStyleId =>
  kanaFontStyles.some((option) => option.id === value)
    ? (value as KanaFontStyleId)
    : defaultKanaFontStyleId;
const deserializeActiveScript = (value: string): KanaScript => (isKanaScript(value) ? value : 'hiragana');

export default function App() {
  const location = useLocation();
  const [language, setLanguage] = usePersistentState<AppLanguage>(
    APP_LANGUAGE_STORAGE_KEY,
    'tr',
    {
      serialize: serializeString,
      deserialize: deserializeLanguage,
      legacyKeys: [LEGACY_APP_LANGUAGE_STORAGE_KEY]
    }
  );
  const [themeMode, setThemeMode] = usePersistentState<ThemeMode>(
    THEME_MODE_STORAGE_KEY,
    'dark',
    {
      serialize: serializeString,
      deserialize: deserializeThemeMode,
      legacyKeys: [LEGACY_THEME_MODE_STORAGE_KEY]
    }
  );
  const [kanaFontStyle, setKanaFontStyle] = usePersistentState<KanaFontStyleId>(
    KANA_FONT_STORAGE_KEY,
    defaultKanaFontStyleId,
    {
      serialize: serializeString,
      deserialize: deserializeKanaFontStyle,
      legacyKeys: [LEGACY_KANA_FONT_STORAGE_KEY]
    }
  );
  const [activeScript, setActiveScript] = usePersistentState<KanaScript>(
    ACTIVE_SCRIPT_STORAGE_KEY,
    'hiragana',
    {
      serialize: serializeString,
      deserialize: deserializeActiveScript
    }
  );

  const selectedKanaFont = useMemo(
    () => kanaFontStyles.find((option) => option.id === kanaFontStyle) ?? kanaFontStyles[0],
    [kanaFontStyle]
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const routeScript = resolveActiveScript(location.pathname, location.search, activeScript);

    if (routeScript !== activeScript) {
      setActiveScript(routeScript);
    }
  }, [activeScript, location.pathname, location.search, setActiveScript]);

  const wrapPlayScope = (element: React.ReactElement) => (
    <KanaProgressProvider scope="play">{element}</KanaProgressProvider>
  );

  const isLandingRoute = location.pathname === appShellRoutes.home;

  const shellRoutes = (
    <Routes>
      <Route path={appShellRoutes.learn} element={<Home language={language} activeScript={activeScript} />} />
      <Route path={`${appShellRoutes.learnUnitBase}/:unitId`} element={<LearnUnitPage language={language} activeScript={activeScript} />} />
      <Route path={appShellRoutes.letters} element={<LettersPage language={language} />} />
      <Route path={appShellRoutes.practice} element={<PracticePage language={language} />} />
      <Route path={appShellRoutes.quests} element={<QuestsPage language={language} />} />

      <Route path="/overview" element={<Navigate to={appShellRoutes.learn} replace />} />
      <Route path="/kana" element={<Navigate to={`${appShellRoutes.letters}?script=hiragana`} replace />} />
      <Route path="/hiragana" element={<Navigate to={`${appShellRoutes.letters}?script=hiragana`} replace />} />
      <Route path="/katakana" element={<Navigate to={`${appShellRoutes.letters}?script=katakana`} replace />} />
      <Route path="/kanji" element={<Navigate to={appShellRoutes.kanjiOverview} replace />} />
      <Route path="/kanji/overview" element={<Navigate to={appShellRoutes.kanjiOverview} replace />} />
      <Route path="/settings" element={<Navigate to={appShellRoutes.settings} replace />} />

      <Route path="/kana/hiragana" element={<Navigate to={`${appShellRoutes.letters}?script=hiragana`} replace />} />
      <Route path={appShellRoutes.hiraganaOverview} element={<Navigate to={`${appShellRoutes.letters}?script=hiragana`} replace />} />
      <Route
        path={appShellRoutes.hiraganaLearn}
        element={<KanaStudyRoadmapPage script="hiragana" language={language} />}
      />
      <Route
        path={appShellRoutes.hiraganaPlay}
        element={wrapPlayScope(<KanaPlayPage script="hiragana" language={language} />)}
      />
      <Route path={appShellRoutes.hiraganaReview} element={<Navigate to={getPracticeRoute('hiragana', 'review')} replace />} />
      <Route path={appShellRoutes.hiraganaWeak} element={<Navigate to={getPracticeRoute('hiragana', 'weak')} replace />} />
      <Route path={appShellRoutes.hiraganaConfusable} element={<Navigate to={getPracticeRoute('hiragana', 'confusable')} replace />} />
      <Route path={appShellRoutes.hiraganaStats} element={<Navigate to={getPracticeRoute('hiragana', 'stats')} replace />} />
      <Route path={appShellRoutes.hiraganaPlayStats} element={wrapPlayScope(<KanaPlayPage script="hiragana" language={language} />)} />
      <Route path={appShellRoutes.hiraganaWords} element={<Navigate to={`${appShellRoutes.letters}?script=hiragana`} replace />} />

      <Route
        path={`${appShellRoutes.hiraganaPlayItemBase}/:kanaId`}
        element={wrapPlayScope(<KanaItemPage language={language} scope="play" />)}
      />
      <Route
        path={`${appShellRoutes.hiraganaPlaySessionBase}/:sessionId`}
        element={wrapPlayScope(<KanaSessionPage language={language} scope="play" />)}
      />

      <Route path="/kana/katakana" element={<Navigate to={`${appShellRoutes.letters}?script=katakana`} replace />} />
      <Route path={appShellRoutes.katakanaOverview} element={<Navigate to={`${appShellRoutes.letters}?script=katakana`} replace />} />
      <Route
        path={appShellRoutes.katakanaLearn}
        element={<KanaStudyRoadmapPage script="katakana" language={language} />}
      />
      <Route
        path={appShellRoutes.katakanaPlay}
        element={wrapPlayScope(<KanaPlayPage script="katakana" language={language} />)}
      />
      <Route path={appShellRoutes.katakanaReview} element={<Navigate to={getPracticeRoute('katakana', 'review')} replace />} />
      <Route path={appShellRoutes.katakanaWeak} element={<Navigate to={getPracticeRoute('katakana', 'weak')} replace />} />
      <Route path={appShellRoutes.katakanaConfusable} element={<Navigate to={getPracticeRoute('katakana', 'confusable')} replace />} />
      <Route path={appShellRoutes.katakanaStats} element={<Navigate to={getPracticeRoute('katakana', 'stats')} replace />} />
      <Route path={appShellRoutes.katakanaPlayStats} element={wrapPlayScope(<KanaPlayPage script="katakana" language={language} />)} />
      <Route path={appShellRoutes.katakanaWords} element={<Navigate to={`${appShellRoutes.letters}?script=katakana`} replace />} />
      <Route
        path={`${appShellRoutes.katakanaPlayItemBase}/:kanaId`}
        element={wrapPlayScope(<KanaItemPage language={language} scope="play" />)}
      />
      <Route
        path={`${appShellRoutes.katakanaPlaySessionBase}/:sessionId`}
        element={wrapPlayScope(<KanaSessionPage language={language} scope="play" />)}
      />

      <Route path={appShellRoutes.kanjiOverview} element={<Kanji language={language} />} />
      <Route path="/kana/item/:kanaId" element={<KanaItemPage language={language} scope="study" />} />
      <Route path="/kana/session/:sessionId" element={<KanaSessionPage language={language} scope="study" />} />

      <Route
        path={appShellRoutes.search}
        element={
          <PlaceholderPage
            title="Search"
            description={
              language === 'tr'
                ? 'Arama deneyimi shell icinde ayrildi. Frontend yeniden yazimi tamamlandikca bu rota da doldurulacak.'
                : 'Search now has a dedicated place in the shell. This route will be filled as the frontend rewrite continues.'
            }
            actionLabel={language === 'tr' ? 'Landinge don' : 'Return to landing'}
            actionHref={appShellRoutes.home}
          />
        }
      />
      <Route path={appShellRoutes.account} element={<ProfilePage language={language} />} />
      <Route
        path={appShellRoutes.settings}
        element={
          <Settings
            language={language}
            themeMode={themeMode}
            kanaFontStyle={kanaFontStyle}
            onKanaFontStyleChange={setKanaFontStyle}
            onThemeModeChange={setThemeMode}
            onLanguageChange={setLanguage}
          />
        }
      />
      <Route path="*" element={<Navigate to={appShellRoutes.learn} replace />} />
    </Routes>
  );

  return (
    <KanaProgressProvider>
      <div
        className={`${themeMode === 'dark' ? 'theme-dark' : 'theme-light'} min-h-screen bg-[var(--kt-surface-page)] text-[var(--kt-ink)]`}
        style={{ ['--font-jp-current' as string]: selectedKanaFont.fontFamily }}
      >
        {isLandingRoute ? (
          <Routes>
            <Route path={appShellRoutes.home} element={<LandingPage language={language} activeScript={activeScript} />} />
          </Routes>
        ) : (
          <AppShell
            language={language}
            themeMode={themeMode}
            activeScript={activeScript}
            onActiveScriptChange={setActiveScript}
            onLanguageChange={setLanguage}
            onThemeModeChange={setThemeMode}
          >
            {shellRoutes}
          </AppShell>
        )}
      </div>
    </KanaProgressProvider>
  );
}
