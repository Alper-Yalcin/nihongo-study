/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Hiragana } from './pages/Hiragana';
import { Katakana } from './pages/Katakana';
import { Kanji } from './pages/Kanji';
import { KanaItemPage } from './pages/KanaItemPage';
import { KanaPathPage } from './pages/KanaPathPage';
import { KanaPlayPage } from './pages/KanaPlayPage';
import { KanaSessionPage } from './pages/KanaSessionPage';
import { KanaStatsPage } from './pages/KanaStatsPage';
import { KanaStudyRoadmapPage } from './pages/KanaStudyRoadmapPage';
import { Settings } from './pages/Settings';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { defaultKanaFontStyleId, kanaFontStyles, KanaFontStyleId } from './data/kanaFontStyles';
import { AppLanguage, ThemeMode } from './data/appPreferences';
import { usePersistentState } from './hooks/usePersistentState';
import { appShellRoutes } from './data/appShellContent';
import { getPathForTab, getTabFromPath } from './utils/tabNavigation';
import { KanaProgressProvider } from './features/kana/progress/progressStore';

const KANA_FONT_STORAGE_KEY = 'kototsuna.kana-font-style';
const APP_LANGUAGE_STORAGE_KEY = 'kototsuna.app-language';
const THEME_MODE_STORAGE_KEY = 'kototsuna.theme-mode';
const LEGACY_KANA_FONT_STORAGE_KEY = 'kotonoha.kana-font-style';
const LEGACY_APP_LANGUAGE_STORAGE_KEY = 'kotonoha.app-language';
const LEGACY_THEME_MODE_STORAGE_KEY = 'kotonoha.theme-mode';

const serializeString = <T extends string>(value: T) => value;
const deserializeLanguage = (value: string): AppLanguage => (value === 'en' ? 'en' : 'tr');
const deserializeThemeMode = (value: string): ThemeMode => (value === 'dark' ? 'dark' : 'light');
const deserializeKanaFontStyle = (value: string): KanaFontStyleId =>
  kanaFontStyles.some((option) => option.id === value)
    ? (value as KanaFontStyleId)
    : defaultKanaFontStyleId;

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
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
    'light',
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

  const selectedKanaFont = useMemo(
    () => kanaFontStyles.find(option => option.id === kanaFontStyle) ?? kanaFontStyles[0],
    [kanaFontStyle]
  );
  const activeTab = useMemo(
    () => getTabFromPath(location.pathname),
    [location.pathname]
  );
  const searchPlaceholderCopy = useMemo(
    () => language === 'tr'
      ? {
          title: 'Search',
          description: 'Arama bilgi mimarisi yeni shell icinde ayrildi. Bu rota Phase 1a ile eklendi; arama deneyimi daha sonra doldurulacak.',
          actionLabel: 'Home sayfasina don',
          actionHref: appShellRoutes.home
        }
      : {
          title: 'Search',
          description: 'Search now has a dedicated route in the new shell. This entry was added in Phase 1a and will be expanded in a later phase.',
          actionLabel: 'Return home',
          actionHref: appShellRoutes.home
        },
    [language]
  );
  const accountPlaceholderCopy = useMemo(
    () => language === 'tr'
      ? {
          title: 'Account',
          description: 'Hesap ve dashboard alani yeni route yapisina baglandi. Ayrintili account deneyimi daha sonraki fazlarda genisletilecek.',
          actionLabel: 'Settings ekranina git',
          actionHref: appShellRoutes.settings
        }
      : {
          title: 'Account',
          description: 'The account and dashboard area is now connected to the new route shell. The full account experience will be expanded in a later phase.',
          actionLabel: 'Open settings',
          actionHref: appShellRoutes.settings
        },
    [language]
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const handleTabChange = (tab: ReturnType<typeof getTabFromPath>) => {
    navigate(getPathForTab(tab));
  };

  const wrapPlayScope = (element: React.ReactElement) => (
    <KanaProgressProvider scope="play">{element}</KanaProgressProvider>
  );

  return (
    <KanaProgressProvider>
      <div
        className={`min-h-screen bg-slate-50 font-sans text-slate-900 ${themeMode === 'dark' ? 'theme-dark' : 'theme-light'} flex flex-col`}
        style={{ ['--font-jp-current' as string]: selectedKanaFont.fontFamily }}
      >
        <Navbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          language={language}
          onLanguageChange={setLanguage}
          themeMode={themeMode}
          onThemeModeChange={setThemeMode}
        />
        <main className="flex-1">
          <Routes>
          <Route path={appShellRoutes.home} element={<Home language={language} />} />
          <Route path="/overview" element={<Navigate to={appShellRoutes.home} replace />} />
          <Route path="/kana" element={<Navigate to={appShellRoutes.hiraganaOverview} replace />} />
          <Route path="/hiragana" element={<Navigate to={appShellRoutes.hiraganaOverview} replace />} />
          <Route path="/katakana" element={<Navigate to={appShellRoutes.katakanaOverview} replace />} />
          <Route path="/kanji" element={<Navigate to={appShellRoutes.kanjiOverview} replace />} />
          <Route path="/kanji/overview" element={<Navigate to={appShellRoutes.kanjiOverview} replace />} />
          <Route path="/settings" element={<Navigate to={appShellRoutes.settings} replace />} />

          <Route path="/kana/hiragana" element={<Navigate to={appShellRoutes.hiraganaOverview} replace />} />
          <Route path={appShellRoutes.hiraganaOverview} element={<Hiragana language={language} />} />
          <Route
            path={appShellRoutes.hiraganaLearn}
            element={<KanaStudyRoadmapPage script="hiragana" language={language} />}
          />
          <Route
            path={appShellRoutes.hiraganaPlay}
            element={wrapPlayScope(<KanaPlayPage script="hiragana" language={language} />)}
          />
          <Route
            path={appShellRoutes.hiraganaReview}
            element={<KanaPathPage script="hiragana" language={language} variant="review" scope="study" />}
          />
          <Route
            path={appShellRoutes.hiraganaWeak}
            element={<KanaPathPage script="hiragana" language={language} variant="weak" scope="study" />}
          />
          <Route
            path={appShellRoutes.hiraganaConfusable}
            element={<KanaPathPage script="hiragana" language={language} variant="confusable" scope="study" />}
          />
          <Route
            path={appShellRoutes.hiraganaStats}
            element={<KanaStatsPage script="hiragana" language={language} scope="study" />}
          />
          <Route
            path={appShellRoutes.hiraganaPlayStats}
            element={wrapPlayScope(
              <KanaStatsPage script="hiragana" language={language} scope="play" />
            )}
          />
          <Route
            path={appShellRoutes.hiraganaWords}
            element={<Hiragana language={language} initialView="dictionary" />}
          />
          <Route
            path={`${appShellRoutes.hiraganaPlayItemBase}/:kanaId`}
            element={wrapPlayScope(<KanaItemPage language={language} scope="play" />)}
          />
          <Route
            path={`${appShellRoutes.hiraganaPlaySessionBase}/:sessionId`}
            element={wrapPlayScope(<KanaSessionPage language={language} scope="play" />)}
          />

          <Route path="/kana/katakana" element={<Navigate to={appShellRoutes.katakanaOverview} replace />} />
          <Route path={appShellRoutes.katakanaOverview} element={<Katakana language={language} />} />
          <Route
            path={appShellRoutes.katakanaLearn}
            element={<KanaStudyRoadmapPage script="katakana" language={language} />}
          />
          <Route
            path={appShellRoutes.katakanaPlay}
            element={wrapPlayScope(<KanaPlayPage script="katakana" language={language} />)}
          />
          <Route
            path={appShellRoutes.katakanaReview}
            element={<KanaPathPage script="katakana" language={language} variant="review" scope="study" />}
          />
          <Route
            path={appShellRoutes.katakanaWeak}
            element={<KanaPathPage script="katakana" language={language} variant="weak" scope="study" />}
          />
          <Route
            path={appShellRoutes.katakanaConfusable}
            element={<KanaPathPage script="katakana" language={language} variant="confusable" scope="study" />}
          />
          <Route
            path={appShellRoutes.katakanaStats}
            element={<KanaStatsPage script="katakana" language={language} scope="study" />}
          />
          <Route
            path={appShellRoutes.katakanaPlayStats}
            element={wrapPlayScope(
              <KanaStatsPage script="katakana" language={language} scope="play" />
            )}
          />
          <Route
            path={appShellRoutes.katakanaWords}
            element={<Katakana language={language} initialView="dictionary" />}
          />
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
                title={searchPlaceholderCopy.title}
                description={searchPlaceholderCopy.description}
                actionLabel={searchPlaceholderCopy.actionLabel}
                actionHref={searchPlaceholderCopy.actionHref}
              />
            }
          />
          <Route
            path={appShellRoutes.account}
            element={
              <PlaceholderPage
                title={accountPlaceholderCopy.title}
                description={accountPlaceholderCopy.description}
                actionLabel={accountPlaceholderCopy.actionLabel}
                actionHref={accountPlaceholderCopy.actionHref}
              />
            }
          />
          <Route
            path={appShellRoutes.settings}
            element={
              <Settings
                language={language}
                kanaFontStyle={kanaFontStyle}
                onKanaFontStyleChange={setKanaFontStyle}
              />
            }
          />
            <Route path="*" element={<Navigate to={appShellRoutes.home} replace />} />
          </Routes>
        </main>
        <Footer language={language} themeMode={themeMode} />
      </div>
    </KanaProgressProvider>
  );
}
