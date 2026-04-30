/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Kanji } from './pages/Kanji';
import { KanaItemPage } from './pages/KanaItemPage';
import { KanaPlayPage } from './pages/KanaPlayPage';
import { KanaSessionPage } from './pages/KanaSessionPage';
import { Settings } from './pages/Settings';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { LettersPage } from './pages/LettersPage';
import { PracticeConfusablePage } from './pages/PracticeConfusablePage';
import { PracticeCustomPage } from './pages/PracticeCustomPage';
import { PracticeRunPage } from './pages/PracticeRunPage';
import { PracticeReviewPage } from './pages/PracticeReviewPage';
import { PracticeStatsPage } from './pages/PracticeStatsPage';
import { PracticeWeakPage } from './pages/PracticeWeakPage';
import { MissionPage } from './pages/MissionPage';
import { QuestsPage } from './pages/QuestsPage';
import { ProfilePage } from './pages/ProfilePage';
import { LearnUnitPage } from './pages/LearnUnitPage';
import { LearnGuidePage } from './pages/LearnGuidePage';
import { LearnJapanesePage } from './pages/LearnJapanesePage';
import { LearnReviewPage } from './pages/LearnReviewPage';
import { LearnStatisticPage } from './pages/LearnStatisticPage';
import { ForgePage } from './pages/ForgePage';
import { defaultKanaFontStyleId, kanaFontStyles, KanaFontStyleId } from './data/kanaFontStyles';
import { AppLanguage, ThemeMode } from './data/appPreferences';
import { usePersistentState } from './hooks/usePersistentState';
import { ACTIVE_SCRIPT_STORAGE_KEY, isKanaScript, resolveActiveScript } from './hooks/useActiveScript';
import { appShellRoutes, getPracticeRoute } from './data/appShellContent';
import { KanaProgressProvider } from './features/kana/progress/progressStore';
import { KanaScript } from './features/kana/domain/kanaItem';
import { AppShell } from './components/layout';
import { ReEntrySplash } from './features/jlearn/reentry/ReEntrySplash';
import { ChallengeReadyPrompt } from './features/jlearn/challenge/ChallengeReadyPrompt';
import { ChallengeMissionPage } from './pages/ChallengeMissionPage';
import { SpeakingSuggestToast } from './features/jlearn/speaking/SpeakingSuggestToast';
import { FeedbackLayer } from './components/feedback/FeedbackLayer';
import { ensureWeeklyFreezeGrant } from './features/streak/tomoshibi';
import { TomoshibiRelightModal } from './components/feedback/TomoshibiRelightModal';
import { OnboardingGate } from './pages/OnboardingPage';
import { installSmartNotifier } from './features/notifications/smartNotifications';

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
    // Consistent fallback color — AppShell fixed layers handle the actual background image.
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
    actionHref: string = getPracticeRoute(activeScript, 'review'),
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
      <Route path={appShellRoutes.practice} element={<Navigate to={getPracticeRoute(activeScript, 'review')} replace />} />
      <Route path={appShellRoutes.practiceReview} element={<PracticeReviewPage language={language} />} />
      <Route path={appShellRoutes.practiceWeak} element={<PracticeWeakPage language={language} />} />
      <Route path={appShellRoutes.practiceConfusable} element={<PracticeConfusablePage language={language} />} />
      <Route path={appShellRoutes.practiceCustom} element={<PracticeCustomPage language={language} />} />
      <Route path={appShellRoutes.practiceStats} element={<PracticeStatsPage language={language} />} />
      <Route
        path={appShellRoutes.practiceKanaDrawing}
        element={modePlaceholder(
          'Drawing Practice',
          'Kana icin cizim pratigi. Harfi takip edip yazma kas hafizasini guclendirirsin.',
          'Drawing practice for kana. Trace and write characters to strengthen writing memory.',
          getPracticeRoute(activeScript, 'review'),
          [
            'Scope: Kana grubunda yer alacak. Hiragana ve katakana script secimine uyumlu olmali.',
            'Core loop: kullanici gosterilen kana icin stroke/cizim alani uzerinde yazar.',
            'Progress: drawing score, mistakes, weak kana ve tekrar verisine baglanmali.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceKanaAnswerType}
        element={modePlaceholder(
          'Answer Type',
          'Gordugun harfi yazarak aktif hatirlama calisirsin.',
          'Type the character you see to train active recall.',
          getPracticeRoute(activeScript, 'review'),
          [
            'Scope: Kana aktif hatirlama modu.',
            'Core loop: ekranda kana gosterilir, kullanici romaji/cevap yazar.',
            'Goal: pasif tanimadan cikartip hafizadan cevap uretmeyi olcmek.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceKanaListening}
        element={modePlaceholder(
          'Listening Practice',
          'Kana duyup dogru harfi secersin. Kulak aliskanligi ve ses-harf baglantisi kurar.',
          'Listen to kana and choose the correct character, building sound-letter connection.',
          getPracticeRoute(activeScript, 'review'),
          [
            'Scope: Kana listening practice.',
            'Core loop: ses calar, kullanici dogru kana karakterini secer.',
            'Goal: kulak aliskanligi, ses-harf baglantisi ve listening score takibi.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceKanaReading}
        element={modePlaceholder(
          'Kana Reading',
          'Gordugun kanayi yazarsin. Aktif hatirlama ve hiz odakli.',
          'Type the kana you see, focused on active recall and speed.',
          getPracticeRoute(activeScript, 'review'),
          [
            'Scope: Answer Type tabanli kana reading modu.',
            'Core loop: kana gosterilir, kullanici okunuşunu/cevabini yazar.',
            'Goal: aktif hatirlama, yazma hizi ve yanlis cevaplardan weak kana uretmek.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceKanaWritingRecall}
        element={modePlaceholder(
          'Writing Recall',
          'Ses verilir, dogru kanayi yazarsin. Ters yonden ogrenme icin cok onemli.',
          'Hear a sound and write the correct kana, training recall in reverse.',
          getPracticeRoute(activeScript, 'review'),
          [
            'Scope: Kana ses -> yazi recall modu.',
            'Core loop: romaji/audio ipucu verilir, kullanici dogru kanayi yazar.',
            'Goal: ters yonden ogrenme, listening ve writing memory baglantisi.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceKanaFlashcards}
        element={modePlaceholder(
          'Flashcards',
          'Kart sistemiyle kana tekrar edip ezberi guclendirirsin.',
          'Review kana with a card system to strengthen memorization.',
          getPracticeRoute(activeScript, 'review'),
          [
            'Scope: Kana kart sistemi.',
            'Core loop: kartin on yuzunde kana veya romaji, arka yuzunde cevap/ipuclari.',
            'Progress: kolay/zor geri bildirimi SRS veya weak state ile iliskilendirilmeli.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceKanaQuickStudy}
        element={modePlaceholder(
          'Quick Study',
          'Kana icin karisik hizli test. Refleks ve tekrar odakli.',
          'A mixed quick test for kana, focused on reflex and review.',
          getPracticeRoute(activeScript, 'review'),
          [
            'Scope: Sadece kana modu, hizli ve karisik soru akisi.',
            'Question mix: typing, recognition, listening veya kisa secim sorulari olabilir.',
            'Goal: refleks, tekrar ve zayif kana tespitini hizlandirmak.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceKanaPop}
        element={modePlaceholder(
          'Kana Pop',
          'Ipuculara gore dogru kanayi patlatacagin oyun hissi yuksek yeni mod.',
          'A playful mode where you pop the correct kana from clues.',
          getPracticeRoute(activeScript, 'review'),
          [
            'Scope: Kana grubunun daha oyun hissi yuksek modu.',
            'Core loop: ekranda bir ipucu verilir, kullanici dogru kana balonunu/kartini patlatir.',
            'Design: hiz, combo, yanlis patlatma cezasi ve kisa turlar oncelikli.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceJapaneseQuickStudy}
        element={modePlaceholder(
          'Quick Study',
          'Kana, kanji ve kelimeyi karisik soran hizli test modu.',
          'A fast mixed test mode for kana, kanji, and vocabulary.',
          getPracticeRoute(activeScript, 'review'),
          [
            'Scope: Japanese grubunda genel hizli calisma modu.',
            'Question mix: kana, kanji ve kelime sorulari ayni oturumda karisik gelebilir.',
            'Goal: genel seviye hissi, tekrar ve hizli pratik.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceJapaneseTopicLessons}
        element={modePlaceholder(
          'Topic Lessons',
          'Sayilar, renkler ve fiiller gibi belirli konulara gore dersler.',
          'Lessons organized by topics such as numbers, colors, and verbs.',
          getPracticeRoute(activeScript, 'review'),
          [
            'Scope: konu bazli Japanese dersleri.',
            'Example topics: sayilar, renkler, fiiller, gunluk ifadeler, temel cumle kaliplari.',
            'Each topic: kisa anlatim, ornekler, mini pratik ve tekrar sorulari icermeli.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceJapaneseReading}
        element={modePlaceholder(
          'Kitap Okuma',
          'Hikayelerin yer alacagi okuma alani. Kullanici hikayeyi okuyup Japonca okuma pratigi yapacak.',
          'A reading area for stories. Learners read stories and practice Japanese comprehension.',
          appShellRoutes.learn,
          [
            'Scope: Japanese grubunda hikaye/kitap okuma alani.',
            'Content: seviyeye gore kisa hikayeler, furigana destegi ve kelime ipuclari.',
            'Interaction: kullanici okur, bilinmeyen kelimeye bakar, sonunda anlama sorulari cozer.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceJapaneseFillBlank}
        element={modePlaceholder(
          'Fill in the Blank',
          'Eksik cumleyi tamamlarsin. Grammar ve kelime kullanimi calistirir.',
          'Complete missing parts of sentences to practice grammar and vocabulary usage.',
          appShellRoutes.learn,
          [
            'Scope: Japanese genel grammar + kelime kullanimi modu.',
            'Core loop: cumlede bosluk verilir, kullanici dogru kelime/partikul/fiil formunu tamamlar.',
            'Goal: pasif bilgiyi cumle icinde kullanima cevirmek.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceJapaneseTranslation}
        element={modePlaceholder(
          'Translation Practice',
          'TR ile JP arasinda ceviri yaparsin. Gercek kullanim odakli.',
          'Translate between Turkish and Japanese for practical usage.',
          appShellRoutes.learn,
          [
            'Scope: TR <-> JP ceviri pratigi.',
            'Core loop: verilen cumleyi hedef dile cevirme, sonra model cevapla karsilastirma.',
            'Goal: gercek kullanim, kelime secimi ve cumle kurma becerisi.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceJapaneseSentenceWriting}
        element={modePlaceholder(
          'Sentence Writing',
          'Verilen cumlelere sohbet gibi cevap yazarsin. Diyalog pratigi, aktif uretim ve akicilik.',
          'Reply to prompts in a chat-like flow for dialogue practice and fluency.',
          appShellRoutes.learn,
          [
            'Scope: Chat Mode tarzi Japanese aktif uretim alani.',
            'Core loop: sistem kisa cumle veya durum verir, kullanici cevap yazar.',
            'Goal: gercek diyalog pratigi, aktif uretim, akicilik ve geri bildirim.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceJapaneseFlashcards}
        element={
          <PlaceholderPage
            title="Flashcards"
            description={
              language === 'tr'
                ? 'Japanese flashcards sayfasi burada doldurulacak.'
                : 'The Japanese flashcards page will be built here.'
            }
            actionLabel={language === 'tr' ? 'Tekrara don' : 'Back to review'}
            actionHref={appShellRoutes.learnReview}
            details={[
              'Scope: Japanese kelime ve cumle tekrar kartlari.',
              'Core loop: kart on/arka yuz sistemiyle kelime, anlam ve ornek cumle tekrar edilir.',
              'Progress: kullanici kolay/zor isaretleyerek tekrar sirasini etkiler.'
            ]}
          />
        }
      />
      <Route
        path={appShellRoutes.practiceKanjiDrawing}
        element={modePlaceholder(
          'Drawing Practice',
          'Kanji icin cizim pratigi. Stroke ve form hafizasini guclendirirsin.',
          'Drawing practice for kanji, focused on stroke and form memory.',
          appShellRoutes.kanjiOverview,
          [
            'Scope: Kanji grubunda cizim pratigi.',
            'Core loop: kanji stroke/form referansi gosterilir, kullanici cizer veya takip eder.',
            'Goal: anlam ezberinin yaninda yazim formu ve stroke hafizasini guclendirmek.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceKanjiReading}
        element={modePlaceholder(
          'Kanji Reading',
          'Kanji gorunce okunusunu yazarsin. Okuma ve ezber baglantisi kurar.',
          'See a kanji and type its reading, connecting recognition and memory.',
          appShellRoutes.kanjiOverview,
          [
            'Scope: Kanji Answer Type modu.',
            'Core loop: kanji gosterilir, kullanici okunuşunu yazar.',
            'Goal: kanji tanima, okuma ezberi ve aktif cevap uretimi.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceKanjiListening}
        element={modePlaceholder(
          'Kanji Listening',
          'Kanji veya kelime duyup dogru kanjiyi secersin. Ses ile anlam eslesmesi kurar.',
          'Hear a kanji word and choose the correct kanji, linking sound and meaning.',
          appShellRoutes.kanjiOverview,
          [
            'Scope: Kanji listening recognition modu.',
            'Core loop: okuma/kelime sesi verilir, kullanici dogru kanjiyi secer.',
            'Goal: ses -> anlam -> kanji eslesmesini guclendirmek.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceKanjiWritingRecall}
        element={modePlaceholder(
          'Writing Recall',
          'Anlam verilir, kanjiyi yazarsin. Gercek ogrenme icin kritik.',
          'Given a meaning, write the kanji. Critical for real learning.',
          appShellRoutes.kanjiOverview,
          [
            'Scope: Kanji anlam -> yazi recall modu.',
            'Core loop: anlam veya ipucu verilir, kullanici kanjiyi yazar/cizer.',
            'Goal: sadece tanima degil, hafizadan kanji uretme becerisi.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceKanjiUsage}
        element={modePlaceholder(
          'Kanji Usage',
          'Cumle icinde dogru kanjiyi secersin. Gercek kullanim ogrenme.',
          'Choose the correct kanji in sentence context for real usage learning.',
          appShellRoutes.kanjiOverview,
          [
            'Scope: Kanji context practice modu.',
            'Core loop: cumle icinde bosluk veya secenek verilir, dogru kanji secilir.',
            'Goal: kanjiyi izole ezberden gercek cumle kullanimina tasimak.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceKanjiChallenge}
        element={modePlaceholder(
          'Kanji Challenge',
          'Kanjiyi anlam ve orneklerle ogrenecegin onemli kanji modu.',
          'A core kanji mode for learning characters with meanings and examples.',
          appShellRoutes.kanjiOverview,
          [
            'Scope: Kanji grubunun ana ogrenme modu.',
            'Content: kanji, anlam, okuma, ornek kelime ve ornek cumle birlikte verilmeli.',
            'Progress: bilinen/zayif kanji, orneklerde basari ve tekrar ihtiyaci izlenmeli.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceKanjiMatch}
        element={modePlaceholder(
          'Kanji Match',
          'Kanji ile anlami eslestirerek refleks gelistiren mod.',
          'A reflex-building mode for matching kanji with meanings.',
          appShellRoutes.kanjiOverview,
          [
            'Scope: kanji ve anlam eslestirme pratigi.',
            'Core loop: kanji kartlari ile anlam/okuma secenekleri eslestirilir.',
            'Goal: hizli tanima ve refleks gelistirmek.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.practiceKanjiPop}
        element={modePlaceholder(
          'Kanji Pop',
          'Ipuculara gore dogru kanjiyi patlatacagin oyun hissi yuksek yeni mod.',
          'A playful mode where you pop the correct kanji from clues.',
          appShellRoutes.kanjiOverview,
          [
            'Scope: Kanji grubunun oyun hissi yuksek modu.',
            'Core loop: anlam, okuma veya ornek ipucuna gore dogru kanji patlatilir.',
            'Design: kisa turlar, hiz baskisi, combo ve yanlis secim geri bildirimi.'
          ]
        )}
      />
      <Route path={appShellRoutes.practiceRun} element={<PracticeRunPage language={language} />} />
      <Route path={appShellRoutes.quiz} element={<Navigate to={appShellRoutes.quizKana} replace />} />
      <Route
        path={appShellRoutes.quizKanji}
        element={modePlaceholder(
          'Kanji Quiz',
          'Seviyeni olcen hizli kanji quiz modu.',
          'A quick quiz mode for measuring your kanji level.',
          appShellRoutes.quizKana,
          [
            'Scope: Quiz nav altinda kanji seviye olcumu.',
            'Format: test gibi ama kisa ve hizli.',
            'Output: kullaniciya kanji seviyesi, guclu/zayif alanlar ve sonraki calisma onerisi vermeli.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.quizKana}
        element={modePlaceholder(
          'Kana Quiz',
          'Seviyeni olcen hizli kana quiz modu.',
          'A quick quiz mode for measuring your kana level.',
          getPracticeRoute(activeScript, 'review'),
          [
            'Scope: Quiz nav altinda kana seviye olcumu.',
            'Format: hiragana/katakana tanima, yazma ve hizli secim sorulari.',
            'Output: script bazli seviye, zayif kana listesi ve tekrar yonlendirmesi.'
          ]
        )}
      />
      <Route
        path={appShellRoutes.quizJapanese}
        element={modePlaceholder(
          'Japanese Quiz',
          'Seviyeni olcen hizli Japanese quiz modu.',
          'A quick quiz mode for measuring your Japanese level.',
          appShellRoutes.learn,
          [
            'Scope: Quiz nav altinda genel Japanese seviye olcumu.',
            'Format: kana, kanji, kelime ve temel cumle anlama karisik sorulur.',
            'Output: genel seviye, eksik konu basliklari ve Topic Lessons onerileri.'
          ]
        )}
      />
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

      <Route path="/overview" element={<Navigate to={appShellRoutes.learn} replace />} />
      <Route path="/kana" element={<Navigate to={`${appShellRoutes.letters}?script=hiragana`} replace />} />
      <Route path="/hiragana" element={<Navigate to={`${appShellRoutes.letters}?script=hiragana`} replace />} />
      <Route path="/katakana" element={<Navigate to={`${appShellRoutes.letters}?script=katakana`} replace />} />
      <Route path="/kanji" element={<Navigate to={appShellRoutes.kanjiOverview} replace />} />
      <Route path="/kanji/overview" element={<Navigate to={appShellRoutes.kanjiOverview} replace />} />
      <Route path="/settings" element={<Navigate to={appShellRoutes.settings} replace />} />

      <Route path="/kana/hiragana" element={<Navigate to={`${appShellRoutes.letters}?script=hiragana`} replace />} />
      <Route path={appShellRoutes.hiraganaOverview} element={<Navigate to={`${appShellRoutes.letters}?script=hiragana`} replace />} />
      <Route path={appShellRoutes.hiraganaLearn} element={<Navigate to={`${appShellRoutes.letters}?script=hiragana`} replace />} />
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
      <Route path={appShellRoutes.katakanaLearn} element={<Navigate to={`${appShellRoutes.letters}?script=katakana`} replace />} />
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

  return (
    <KanaProgressProvider>
      <div
        className="min-h-screen text-[var(--kt-ink)]"
        style={{ ['--font-jp-current' as string]: selectedKanaFont.fontFamily }}
      >
        <Routes>
          <Route path={`${appShellRoutes.learnJapaneseMissionBase}/:stepId`} element={<MissionPage />} />
          <Route path={`${appShellRoutes.learnJapaneseChallengeBase}/:levelId`} element={<ChallengeMissionPage />} />
          <Route path={`${appShellRoutes.learnUnitBase}/:unitId`} element={<LearnUnitPage language={language} activeScript={activeScript} />} />
          <Route path="*" element={shell} />
        </Routes>
        <ReEntrySplash />
        <ChallengeReadyPrompt language={language} />
        <SpeakingSuggestToast language={language} />
        <FeedbackLayer />
        {!isLearnMapRoute && <TomoshibiRelightModal language={language} />}
        {!isLearnMapRoute && <OnboardingGate language={language} />}
      </div>
    </KanaProgressProvider>
  );
}
