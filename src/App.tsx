/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LandingPage } from './page-views/home/LandingPage';
import { Kanji } from './letters/pages/Kanji';
import { KanaItemPage } from './letters/pages/KanaItemPage';
import { KanaPlayPage } from './play/pages/KanaPlayPage';
import { KanaSessionPage } from './letters/pages/KanaSessionPage';
import { Settings } from './page-views/account/Settings';
import { PlaceholderPage } from './page-views/misc/PlaceholderPage';
import { LettersPage } from './letters/pages/LettersPage';
import { PracticeKanaDrawingPage } from './page-views/practice/kana/PracticeKanaDrawingPage';
import { PracticeKanaAnswerTypePage } from './page-views/practice/kana/PracticeKanaAnswerTypePage';
import { PracticeKanaListeningPage } from './page-views/practice/kana/PracticeKanaListeningPage';
import { PracticeKanaReadingPage } from './page-views/practice/kana/PracticeKanaReadingPage';
import { PracticeKanaWritingRecallPage } from './page-views/practice/kana/PracticeKanaWritingRecallPage';
import { PracticeKanaFlashcardsPage } from './page-views/practice/kana/PracticeKanaFlashcardsPage';
import { PracticeKanaQuickStudyPage } from './page-views/practice/kana/PracticeKanaQuickStudyPage';
import { PracticeKanaPopPage } from './page-views/practice/kana/PracticeKanaPopPage';
import {
  PracticeJapaneseFillBlankPage,
  PracticeJapaneseFlashcardsPage,
  PracticeJapaneseQuickStudyPage,
  PracticeJapaneseReadingPage,
  PracticeJapaneseSentenceWritingPage,
  PracticeJapaneseTopicLessonsPage,
  PracticeJapaneseTranslationPage
} from './page-views/practice/japanese';
import {
  PracticeKanjiChallengePage,
  PracticeKanjiDrawingPage,
  PracticeKanjiListeningPage,
  PracticeKanjiMatchPage,
  PracticeKanjiPopPage,
  PracticeKanjiReadingPage,
  PracticeKanjiUsagePage,
  PracticeKanjiWritingRecallPage
} from './page-views/practice/kanji';
import { QuizJapanesePage, QuizKanaPage, QuizKanjiPage } from './page-views/quiz';
import { PracticeStatsPage } from './page-views/practice/shared/PracticeStatsPage';
import { MissionPage } from './learn/pages/MissionPage';
import { QuestsPage } from './quests/pages/QuestsPage';
import { ProfilePage } from './page-views/account/ProfilePage';
import { LearnUnitPage } from './learn/pages/LearnUnitPage';
import { LearnLevelExamPage } from './learn/pages/LearnLevelExamPage';
import { LearnGuidePage } from './learn/pages/LearnGuidePage';
import { LearnJapanesePage } from './learn/pages/LearnJapanesePage';
import { LearnReviewPage } from './learn/pages/LearnReviewPage';
import { LearnStatisticPage } from './learn/pages/LearnStatisticPage';
import { ForgePage } from './page-views/practice/shared/ForgePage';
import { defaultKanaFontStyleId, kanaFontStyles, KanaFontStyleId } from './letters/data/kanaFontStyles';
import { AppLanguage, ThemeMode } from './data/appPreferences';
import { usePersistentState } from './hooks/usePersistentState';
import { ACTIVE_SCRIPT_STORAGE_KEY, isKanaScript, resolveActiveScript } from './hooks/useActiveScript';
import { appShellRoutes, getPracticeHomeRoute, getPracticeRoute } from './data/appShellContent';
import { KanaProgressProvider } from './features/kana/progress/progressStore';
import { KanaScript } from './features/kana/domain/kanaItem';
import { AppShell } from './components/layout';
import { ReEntrySplash } from './features/jlearn/reentry/ReEntrySplash';
import { ChallengeReadyPrompt } from './features/jlearn/challenge/ChallengeReadyPrompt';
import { ChallengeMissionPage } from './learn/pages/ChallengeMissionPage';
import { SpeakingSuggestToast } from './features/jlearn/speaking/SpeakingSuggestToast';
import { FeedbackLayer } from './components/feedback/FeedbackLayer';
import { ensureWeeklyFreezeGrant } from './features/streak/tomoshibi';
import { TomoshibiRelightModal } from './components/feedback/TomoshibiRelightModal';
import { OnboardingGate } from './page-views/home/OnboardingPage';
import { installSmartNotifier } from './features/notifications/smartNotifications';
import { LessonMapPage } from './features/lessons/pages/LessonMapPage';

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
const resolveDefaultThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export default function App() {
  const location = useLocation();
  const { i18n } = useTranslation();
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
    resolveDefaultThemeMode,
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
  const isLearnMapRoute =
    location.pathname === appShellRoutes.learn ||
    location.pathname === appShellRoutes.learnJapanese;
  const isLandingRoute = location.pathname === appShellRoutes.home;

  const selectedKanaFont = useMemo(
    () => kanaFontStyles.find((option) => option.id === kanaFontStyle) ?? kanaFontStyles[0],
    [kanaFontStyle]
  );
  useEffect(() => {
    document.documentElement.lang = language;
    i18n.changeLanguage(language);
    ensureWeeklyFreezeGrant();
    const cleanup = installSmartNotifier(language === 'tr' ? 'tr' : 'en');
    return cleanup;
  }, [language, i18n]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(themeMode === 'dark' ? 'theme-dark' : 'theme-light');
  }, [themeMode]);

  useEffect(() => {
    document.body.style.backgroundColor = themeMode === 'dark' ? '#151017' : '#fff5ef';
  }, [themeMode]);

  useEffect(() => {
    const routeScript = resolveActiveScript(location.pathname, location.search, activeScript);

    if (routeScript !== activeScript) {
      setActiveScript(routeScript);
    }
  }, [activeScript, location.pathname, location.search, setActiveScript]);

  const wrapPlayScope = (element: React.ReactElement) => (
    <KanaProgressProvider scope="play">{element}</KanaProgressProvider>
  );
  const modePlaceholder = (
    title: string,
    trDescription: string,
    enDescription: string,
    actionHref: string = getPracticeHomeRoute(activeScript),
    details: string[] = []
  ) => (
    <PlaceholderPage
      title={title}
      description={language === 'tr' ? trDescription : enDescription}
      actionLabel={language === 'tr' ? 'Pratige don' : 'Back to practice'}
      actionHref={actionHref}
      details={details}
    />
  );
  const shellRoutes = (
    <Routes>
      <Route
        path={appShellRoutes.home}
        element={<LandingPage language={language} activeScript={activeScript} themeMode={themeMode} />}
      />
      <Route path={appShellRoutes.learn} element={<LearnJapanesePage language={language} themeMode={themeMode} />} />
      <Route path={appShellRoutes.learnReview} element={<LearnReviewPage language={language} themeMode={themeMode} />} />
      <Route path={appShellRoutes.learnStatistic} element={<LearnStatisticPage language={language} themeMode={themeMode} />} />
      <Route path={appShellRoutes.learnStatisticAlias} element={<LearnStatisticPage language={language} themeMode={themeMode} />} />
      <Route path={`${appShellRoutes.learnGuideBase}/:unitId`} element={<LearnGuidePage language={language} />} />
      <Route path={appShellRoutes.learnJapanese} element={<Navigate to={appShellRoutes.learn} replace />} />
      <Route path={appShellRoutes.letters} element={<LettersPage language={language} />} />
      <Route path={appShellRoutes.practice} element={<Navigate to={getPracticeHomeRoute(activeScript)} replace />} />
      <Route path={appShellRoutes.practiceReview} element={<Navigate to={getPracticeHomeRoute(activeScript)} replace />} />
      <Route path={appShellRoutes.practiceWeak} element={<Navigate to={getPracticeHomeRoute(activeScript)} replace />} />
      <Route path={appShellRoutes.practiceConfusable} element={<Navigate to={getPracticeHomeRoute(activeScript)} replace />} />
      <Route path={appShellRoutes.practiceCustom} element={<Navigate to={getPracticeHomeRoute(activeScript)} replace />} />
      <Route path={appShellRoutes.practiceStats} element={<PracticeStatsPage language={language} />} />
      <Route
        path={appShellRoutes.practiceKanaDrawing}
        element={<PracticeKanaDrawingPage language={language} activeScript={activeScript} />}
      />
      <Route
        path={appShellRoutes.practiceKanaAnswerType}
        element={<PracticeKanaAnswerTypePage language={language} activeScript={activeScript} />}
      />
      <Route
        path={appShellRoutes.practiceKanaListening}
        element={<PracticeKanaListeningPage language={language} activeScript={activeScript} />}
      />
      <Route
        path={appShellRoutes.practiceKanaReading}
        element={<PracticeKanaReadingPage language={language} activeScript={activeScript} />}
      />
      <Route
        path={appShellRoutes.practiceKanaWritingRecall}
        element={<PracticeKanaWritingRecallPage language={language} activeScript={activeScript} />}
      />
      <Route
        path={appShellRoutes.practiceKanaFlashcards}
        element={<PracticeKanaFlashcardsPage language={language} activeScript={activeScript} />}
      />
      <Route
        path={appShellRoutes.practiceKanaQuickStudy}
        element={<PracticeKanaQuickStudyPage language={language} activeScript={activeScript} />}
      />
      <Route
        path={appShellRoutes.practiceKanaPop}
        element={<PracticeKanaPopPage language={language} activeScript={activeScript} />}
      />
      <Route
        path={appShellRoutes.practiceJapaneseQuickStudy}
        element={<PracticeJapaneseQuickStudyPage language={language} />}
      />
      <Route
        path={appShellRoutes.practiceJapaneseTopicLessons}
        element={<PracticeJapaneseTopicLessonsPage language={language} />}
      />
      <Route
        path={appShellRoutes.practiceJapaneseReading}
        element={<PracticeJapaneseReadingPage language={language} />}
      />
      <Route
        path={appShellRoutes.practiceJapaneseFillBlank}
        element={<PracticeJapaneseFillBlankPage language={language} />}
      />
      <Route
        path={appShellRoutes.practiceJapaneseTranslation}
        element={<PracticeJapaneseTranslationPage language={language} />}
      />
      <Route
        path={appShellRoutes.practiceJapaneseSentenceWriting}
        element={<PracticeJapaneseSentenceWritingPage language={language} />}
      />
      <Route
        path={appShellRoutes.practiceJapaneseFlashcards}
        element={<PracticeJapaneseFlashcardsPage language={language} />}
      />
      <Route
        path={appShellRoutes.practiceKanjiDrawing}
        element={<PracticeKanjiDrawingPage language={language} />}
      />
      <Route
        path={appShellRoutes.practiceKanjiReading}
        element={<PracticeKanjiReadingPage language={language} />}
      />
      <Route
        path={appShellRoutes.practiceKanjiListening}
        element={<PracticeKanjiListeningPage language={language} />}
      />
      <Route
        path={appShellRoutes.practiceKanjiWritingRecall}
        element={<PracticeKanjiWritingRecallPage language={language} />}
      />
      <Route
        path={appShellRoutes.practiceKanjiUsage}
        element={<PracticeKanjiUsagePage language={language} />}
      />
      <Route
        path={appShellRoutes.practiceKanjiChallenge}
        element={<PracticeKanjiChallengePage language={language} />}
      />
      <Route
        path={appShellRoutes.practiceKanjiMatch}
        element={<PracticeKanjiMatchPage language={language} />}
      />
      <Route
        path={appShellRoutes.practiceKanjiPop}
        element={<PracticeKanjiPopPage language={language} />}
      />
      <Route path={appShellRoutes.quiz} element={<Navigate to={appShellRoutes.quizKana} replace />} />
      <Route path={appShellRoutes.quizKanji} element={<QuizKanjiPage language={language} />} />
      <Route path={appShellRoutes.quizKana} element={<QuizKanaPage language={language} activeScript={activeScript} />} />
      <Route path={appShellRoutes.quizJapanese} element={<QuizJapanesePage language={language} />} />
      <Route path={appShellRoutes.forge} element={<ForgePage language={language} />} />
      <Route path={appShellRoutes.meydan} element={<Navigate to={appShellRoutes.meydanLobby} replace />} />
      <Route
        path={appShellRoutes.meydanLobby}
        element={modePlaceholder(
          'Arena Lobby',
          'Meydan ana girisi. Rekabet modlari, hizli turlar, dojo boss ilerlemesi ve dan durumunun ozetlenecegi alan.',
          'Main Meydan entry. This page will summarize competitive modes, fast runs, dojo boss progress, and dan status.',
          appShellRoutes.meydanLobby,
          [
            'Scope: Meydan dropdownundaki ana lobi sayfasi.',
            'Content: aktif boost, dan ilerlemesi, haftalik boss ve mod kisa yollarini gostermeli.',
            'Goal: kullanici hangi rekabet moduna girecegini buradan secmeli.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.meydanSpeed}
        element={modePlaceholder(
          'Speed Mode',
          'Hizli dogru zinciri ile streak baskisi olan meydan modu.',
          'A fast competitive mode built around correct-answer chains and streak pressure.',
          appShellRoutes.meydanLobby,
          [
            'Scope: hiz odakli meydan modu.',
            'Core loop: kullanici kisa surede arka arkaya dogru cevap vermeye calisir.',
            'Goal: refleks, combo ve streak baskisi ile puan kazanmak.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.meydanTimed}
        element={modePlaceholder(
          'Timed Challenge',
          'Belirli sure icinde oynanan challenge modu. Boost ve zaman baskisi uzerine kurulacak.',
          'A time-boxed challenge mode built around boosts and time pressure.',
          appShellRoutes.meydanLobby,
          [
            'Scope: sureli meydan challenge sayfasi.',
            'Core loop: kullanici zaman siniri icinde hedef puan veya hedef soru sayisina ulasir.',
            'Goal: boost, sure ve odul hissini tek akista toplamak.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.meydanDojo}
        element={modePlaceholder(
          'Dojo Boss',
          'Haftalik ortak boss ilerlemesi. Kullanici pratik yaptikca boss hasarina katkida bulunacak.',
          'Weekly shared boss progress. Practice sessions will contribute damage to a shared boss.',
          appShellRoutes.meydanLobby,
          [
            'Scope: haftalik topluluk boss modu.',
            'Core loop: kullanici calisma veya oyun oturumlariyla boss ilerlemesine katkida bulunur.',
            'Goal: haftalik hedef, ortak ilerleme ve odul motivasyonu.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.meydanDuel}
        element={modePlaceholder(
          'Duel',
          'Async 1v1 rekabet modu. Kullanici baska biriyle skor veya tur bazli kapisacak.',
          'Async 1v1 competitive mode where users compare scores or rounds.',
          appShellRoutes.meydanLobby,
          [
            'Scope: bire bir meydan modu.',
            'Core loop: kullanici bir rakibe karsi ayni soru seti veya skor hedefiyle oynar.',
            'Goal: rekabet, tekrar oynama istegi ve leaderboard motivasyonu.'
          ]
        )}
      />
      <Route path={appShellRoutes.quests} element={<QuestsPage language={language} />} />
      <Route path={appShellRoutes.lessonMap} element={<LessonMapPage />} />

      <Route path="/overview" element={<Navigate to={appShellRoutes.learn} replace />} />
      <Route path="/kana" element={<Navigate to={`${appShellRoutes.letters}?script=hiragana`} replace />} />
      <Route path="/hiragana" element={<Navigate to={`${appShellRoutes.letters}?script=hiragana`} replace />} />
      <Route path="/katakana" element={<Navigate to={`${appShellRoutes.letters}?script=katakana`} replace />} />
      <Route path="/kanji" element={<Navigate to={appShellRoutes.kanjiOverview} replace />} />
      <Route path="/kanji/overview" element={<Navigate to={appShellRoutes.kanjiOverview} replace />} />
      <Route path="/kana/hiragana" element={<Navigate to={`${appShellRoutes.letters}?script=hiragana`} replace />} />
      <Route path={appShellRoutes.hiraganaOverview} element={<Navigate to={`${appShellRoutes.letters}?script=hiragana`} replace />} />
      <Route path={appShellRoutes.hiraganaLearn} element={<Navigate to={`${appShellRoutes.letters}?script=hiragana`} replace />} />
      <Route
        path={appShellRoutes.hiraganaPlay}
        element={wrapPlayScope(<KanaPlayPage script="hiragana" language={language} />)}
      />
      <Route path={appShellRoutes.hiraganaReview} element={<Navigate to={getPracticeHomeRoute('hiragana')} replace />} />
      <Route path={appShellRoutes.hiraganaWeak} element={<Navigate to={getPracticeHomeRoute('hiragana')} replace />} />
      <Route path={appShellRoutes.hiraganaConfusable} element={<Navigate to={getPracticeHomeRoute('hiragana')} replace />} />
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
      <Route path={appShellRoutes.katakanaLearn} element={<Navigate to={`${appShellRoutes.letters}?script=katakana`} replace />} />
      <Route
        path={appShellRoutes.katakanaPlay}
        element={wrapPlayScope(<KanaPlayPage script="katakana" language={language} />)}
      />
      <Route path={appShellRoutes.katakanaReview} element={<Navigate to={getPracticeHomeRoute('katakana')} replace />} />
      <Route path={appShellRoutes.katakanaWeak} element={<Navigate to={getPracticeHomeRoute('katakana')} replace />} />
      <Route path={appShellRoutes.katakanaConfusable} element={<Navigate to={getPracticeHomeRoute('katakana')} replace />} />
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
      <Route path="/kana/item/:kanaId" element={<Navigate to={appShellRoutes.letters} replace />} />
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
      <Route path={appShellRoutes.profile} element={<ProfilePage language={language} />} />
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
      <Route path={appShellRoutes.legacyAccountSettings} element={<Navigate to={appShellRoutes.settings} replace />} />
      <Route path="*" element={<Navigate to={appShellRoutes.learn} replace />} />
    </Routes>
  );

  const shell = (
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
  );

  const isDark = themeMode === 'dark';

  return (
    <KanaProgressProvider>
      <div
        className="min-h-screen text-[var(--kt-ink)]"
        style={{ ['--font-jp-current' as string]: selectedKanaFont.fontFamily }}
      >
        {/* Global background layers — visible on every route */}
        {!isLandingRoute && (
          <>
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[0] bg-cover bg-top bg-no-repeat"
          style={{
            backgroundImage: isDark ? "url('/images/darkmode.png')" : "url('/images/light.png')",
            backgroundColor: isDark ? '#151017' : '#fff5ef',
            filter: isDark ? 'brightness(0.95) saturate(0.9)' : 'brightness(0.96) saturate(0.88)'
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[1]"
          style={{
            background: isDark
              ? 'linear-gradient(180deg, rgba(10,12,24,0.22) 0%, rgba(16,14,28,0.28) 100%)'
              : 'linear-gradient(180deg, rgba(255,245,239,0.18) 0%, rgba(255,245,239,0.26) 100%)'
          }}
        />
          </>
        )}
        <Routes>
          <Route path={`${appShellRoutes.learnJapaneseMissionBase}/:stepId`} element={<MissionPage />} />
          <Route path={`${appShellRoutes.learnJapaneseChallengeBase}/:levelId`} element={<ChallengeMissionPage />} />
          <Route path={`${appShellRoutes.learnUnitBase}/:unitId`} element={<LearnUnitPage language={language} themeMode={themeMode} activeScript={activeScript} />} />
          <Route path={`${appShellRoutes.learnExamBase}/:level`} element={<LearnLevelExamPage language={language} themeMode={themeMode} />} />
          <Route path="*" element={shell} />
        </Routes>
        <ReEntrySplash />
        <ChallengeReadyPrompt language={language} />
        <SpeakingSuggestToast language={language} />
        <FeedbackLayer />
        {!isLearnMapRoute && !isLandingRoute && <TomoshibiRelightModal language={language} />}
        {!isLearnMapRoute && !isLandingRoute && <OnboardingGate language={language} />}
      </div>
    </KanaProgressProvider>
  );
}
