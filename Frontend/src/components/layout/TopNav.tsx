import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  Flame,
  Gamepad2,
  GraduationCap,
  Headphones,
  Landmark,
  Languages,
  MessageCircleMore,
  Moon,
  PenTool,
  Settings2,
  Shuffle,
  Sparkles,
  Swords,
  Sun,
  Target,
  Timer,
  Trophy,
  Type,
  Users,
  Zap,
  type LucideIcon
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { appShellRoutes } from '../../data/appShellContent';
import { AppLanguage, ThemeMode } from '../../data/appPreferences';
import { KanaScript } from '../../features/kana/domain/kanaItem';
import { getJLearnUserState, subscribeJLearnUserState } from '../../features/jlearn/debug/debugStore';
import { useFeedback } from '../../hooks/useFeedback';

interface TopNavProps {
  language: AppLanguage;
  themeMode: ThemeMode;
  activeScript: KanaScript;
  onActiveScriptChange: (script: KanaScript) => void;
  onLanguageChange: (language: AppLanguage) => void;
  onThemeModeChange: (theme: ThemeMode) => void;
}

const labels = {
  tr: {
    learn: 'Öğren',
    letters: 'Harfler',
    practice: 'Pratik',
    play: 'Meydan',
    quests: 'Görevler',
    settings: 'Ayarlar',
    streak: 'Tomoshibi',
    hanabira: 'Hanabira',
    dan: 'Dan',
    japanese: 'Japonca',
    kana: 'Kana',
    practiceJapanese: 'Japanese',
    kanji: 'Kanji',
    quiz: 'Quiz',
    arenaLobby: 'Arena Lobby',
    speedMode: 'Speed Mode',
    timedChallenge: 'Timed Challenge',
    dojoBoss: 'Dojo Boss',
    duel: 'Duel',
    reviewQueue: 'Tekrar Sirasi',
    weakDrill: 'Zayif Drill',
    confusables: 'Karistirilanlar',
    drawingPractice: 'Drawing Practice',
    answerTypeKana: 'Answer Type',
    listeningPracticeKana: 'Listening Practice',
    kanaReading: 'Kana Reading',
    writingRecallKana: 'Writing Recall',
    flashcardsKana: 'Flashcards',
    quickStudyKana: 'Quick Study',
    kanaPop: 'Kana Pop',
    quickStudy: 'Quick Study',
    topicLessons: 'Topic Lessons',
    reading: 'Kitap Okuma',
    fillBlank: 'Fill in the Blank',
    translationPractice: 'Translation Practice',
    sentenceWriting: 'Sentence Writing',
    kanjiDrawingPractice: 'Drawing Practice',
    kanjiReading: 'Kanji Reading',
    kanjiListening: 'Kanji Listening',
    writingRecallKanji: 'Writing Recall',
    kanjiUsage: 'Kanji Usage',
    kanjiChallenge: 'Kanji Challenge',
    kanjiMatch: 'Kanji Match',
    kanjiPop: 'Kanji Pop',
    kanjiQuiz: 'Kanji Quiz',
    kanaQuiz: 'Kana Quiz',
    japaneseQuiz: 'Japanese Quiz',
    customPractice: 'Custom Practice',
    trainingRecord: 'Antrenman Raporu',
    flashcards: 'Flashcards'
  },
  en: {
    learn: 'Learn',
    letters: 'Letters',
    practice: 'Practice',
    play: 'Meydan',
    quests: 'Quests',
    settings: 'Settings',
    streak: 'Tomoshibi',
    hanabira: 'Hanabira',
    dan: 'Dan',
    japanese: 'Japanese',
    kana: 'Kana',
    practiceJapanese: 'Japanese',
    kanji: 'Kanji',
    quiz: 'Quiz',
    arenaLobby: 'Arena Lobby',
    speedMode: 'Speed Mode',
    timedChallenge: 'Timed Challenge',
    dojoBoss: 'Dojo Boss',
    duel: 'Duel',
    reviewQueue: 'Review Queue',
    weakDrill: 'Weak Drill',
    confusables: 'Confusables',
    drawingPractice: 'Drawing Practice',
    answerTypeKana: 'Answer Type',
    listeningPracticeKana: 'Listening Practice',
    kanaReading: 'Kana Reading',
    writingRecallKana: 'Writing Recall',
    flashcardsKana: 'Flashcards',
    quickStudyKana: 'Quick Study',
    kanaPop: 'Kana Pop',
    quickStudy: 'Quick Study',
    topicLessons: 'Topic Lessons',
    reading: 'Reading',
    fillBlank: 'Fill in the Blank',
    translationPractice: 'Translation Practice',
    sentenceWriting: 'Sentence Writing',
    kanjiDrawingPractice: 'Drawing Practice',
    kanjiReading: 'Kanji Reading',
    kanjiListening: 'Kanji Listening',
    writingRecallKanji: 'Writing Recall',
    kanjiUsage: 'Kanji Usage',
    kanjiChallenge: 'Kanji Challenge',
    kanjiMatch: 'Kanji Match',
    kanjiPop: 'Kanji Pop',
    kanjiQuiz: 'Kanji Quiz',
    kanaQuiz: 'Kana Quiz',
    japaneseQuiz: 'Japanese Quiz',
    customPractice: 'Custom Practice',
    trainingRecord: 'Training Record',
    flashcards: 'Flashcards'
  }
} as const;

const deriveKyuFromStreak = (streakDays: number): number => {
  const advanced = Math.floor(streakDays / 14);
  return Math.max(1, 10 - advanced);
};

const LanternMark: React.FC = () => (
  <span className="relative flex h-11 w-9 shrink-0 items-center justify-center" aria-hidden="true">
    <span className="absolute top-0 h-2 w-3 rounded-t-full border border-[#6b3b34]" />
    <span className="absolute top-2 h-7 w-6 rounded-[0.35rem] border-2 border-[#6b3b34] bg-[linear-gradient(180deg,#ff8e6f,#d94c43)] shadow-[inset_0_0_0_3px_rgba(255,231,189,0.65)]" />
    <span className="absolute top-3 h-5 w-px bg-[#7c453c]" />
    <span className="absolute top-4 h-px w-5 bg-[#7c453c]" />
    <span className="absolute bottom-1 h-2 w-3 rounded-b-full border border-[#6b3b34] bg-[#ffcf8f]" />
  </span>
);

const languageOptions: Array<{ id: AppLanguage; flag: string; label: string }> = [
  { id: 'tr', flag: '/flags/tr.svg', label: 'Türkçe' },
  { id: 'en', flag: '/flags/gb.svg', label: 'English' }
];

type NavDropdownItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
};

type NavDropdownGroup = {
  id: string;
  title: string;
  children: NavDropdownItem[];
};

type NavItem = {
  id: string;
  label: string;
  href?: string;
  icon: LucideIcon;
  children?: NavDropdownItem[];
  groups?: NavDropdownGroup[];
};

export const TopNav: React.FC<TopNavProps> = ({
  language,
  themeMode,
  activeScript,
  onLanguageChange,
  onThemeModeChange
}) => {
  const location = useLocation();
  const copy = labels[language];
  const isDark = themeMode === 'dark';
  const [streakDays, setStreakDays] = useState(() => getJLearnUserState().streakDays);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [openNavMenu, setOpenNavMenu] = useState<string | null>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const navMenuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!langMenuRef.current?.contains(e.target as Node)) setIsLangOpen(false);
      if (!navMenuRef.current?.contains(e.target as Node)) setOpenNavMenu(null);
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setOpenNavMenu(null);
  }, [location.pathname, location.search]);
  const { state: feedbackState } = useFeedback();
  const hanabira = Math.max(feedbackState.hanabira, 450);
  const kyu = deriveKyuFromStreak(streakDays);

  useEffect(
    () => subscribeJLearnUserState(() => setStreakDays(getJLearnUserState().streakDays)),
    []
  );

  const navItems = useMemo<NavItem[]>(() => [
    {
      id: 'learn',
      label: copy.learn,
      icon: Landmark,
      children: [
        { id: 'learn-japanese', label: copy.japanese, href: appShellRoutes.learn, icon: Landmark },
        { id: 'learn-kana', label: copy.kana, href: `${appShellRoutes.letters}?script=${activeScript}`, icon: BookOpen }
      ]
    },
    {
      id: 'practice',
      label: copy.practice,
      icon: Gamepad2,
      groups: [
        {
          id: 'kana',
          title: copy.kana,
          children: [
            { id: 'practice-kana-drawing', label: copy.drawingPractice, href: appShellRoutes.practiceKanaDrawing, icon: PenTool },
            { id: 'practice-kana-answer-type', label: copy.answerTypeKana, href: appShellRoutes.practiceKanaAnswerType, icon: Type },
            { id: 'practice-kana-listening', label: copy.listeningPracticeKana, href: appShellRoutes.practiceKanaListening, icon: Headphones },
            { id: 'practice-kana-reading', label: copy.kanaReading, href: appShellRoutes.practiceKanaReading, icon: Type },
            { id: 'practice-kana-writing-recall', label: copy.writingRecallKana, href: appShellRoutes.practiceKanaWritingRecall, icon: PenTool },
            { id: 'practice-kana-flashcards', label: copy.flashcardsKana, href: appShellRoutes.practiceKanaFlashcards, icon: BookOpen },
            { id: 'practice-kana-quick-study', label: copy.quickStudyKana, href: appShellRoutes.practiceKanaQuickStudy, icon: Zap },
            { id: 'practice-kana-pop', label: copy.kanaPop, href: appShellRoutes.practiceKanaPop, icon: Sparkles }
          ]
        },
        {
          id: 'japanese',
          title: copy.practiceJapanese,
          children: [
            { id: 'practice-quick-study', label: copy.quickStudy, href: appShellRoutes.practiceJapaneseQuickStudy, icon: Zap },
            { id: 'practice-topic-lessons', label: copy.topicLessons, href: appShellRoutes.practiceJapaneseTopicLessons, icon: BookOpen },
            { id: 'practice-reading', label: copy.reading, href: appShellRoutes.practiceJapaneseReading, icon: BookOpen },
            { id: 'practice-fill-blank', label: copy.fillBlank, href: appShellRoutes.practiceJapaneseFillBlank, icon: Type },
            { id: 'practice-translation', label: copy.translationPractice, href: appShellRoutes.practiceJapaneseTranslation, icon: Languages },
            { id: 'practice-sentence-writing', label: copy.sentenceWriting, href: appShellRoutes.practiceJapaneseSentenceWriting, icon: MessageCircleMore }
          ]
        },
        {
          id: 'kanji',
          title: copy.kanji,
          children: [
            { id: 'practice-kanji-drawing', label: copy.kanjiDrawingPractice, href: appShellRoutes.practiceKanjiDrawing, icon: PenTool },
            { id: 'practice-kanji-reading', label: copy.kanjiReading, href: appShellRoutes.practiceKanjiReading, icon: Type },
            { id: 'practice-kanji-listening', label: copy.kanjiListening, href: appShellRoutes.practiceKanjiListening, icon: Headphones },
            { id: 'practice-kanji-writing-recall', label: copy.writingRecallKanji, href: appShellRoutes.practiceKanjiWritingRecall, icon: PenTool },
            { id: 'practice-kanji-usage', label: copy.kanjiUsage, href: appShellRoutes.practiceKanjiUsage, icon: Target },
            { id: 'practice-kanji-challenge', label: copy.kanjiChallenge, href: appShellRoutes.practiceKanjiChallenge, icon: Trophy },
            { id: 'practice-kanji-match', label: copy.kanjiMatch, href: appShellRoutes.practiceKanjiMatch, icon: Shuffle },
            { id: 'practice-kanji-pop', label: copy.kanjiPop, href: appShellRoutes.practiceKanjiPop, icon: Sparkles }
          ]
        }
      ]
    },
    {
      id: 'quiz',
      label: copy.quiz,
      icon: Target,
      children: [
        { id: 'quiz-kanji', label: copy.kanjiQuiz, href: appShellRoutes.quizKanji, icon: Trophy },
        { id: 'quiz-kana', label: copy.kanaQuiz, href: appShellRoutes.quizKana, icon: Target },
        { id: 'quiz-japanese', label: copy.japaneseQuiz, href: appShellRoutes.quizJapanese, icon: GraduationCap }
      ]
    },
    {
      id: 'play',
      label: copy.play,
      icon: GraduationCap,
      children: [
        { id: 'meydan-lobby', label: copy.arenaLobby, href: appShellRoutes.meydanLobby, icon: GraduationCap },
        { id: 'meydan-speed', label: copy.speedMode, href: appShellRoutes.meydanSpeed, icon: Flame },
        { id: 'meydan-timed', label: copy.timedChallenge, href: appShellRoutes.meydanTimed, icon: Timer },
        { id: 'meydan-dojo', label: copy.dojoBoss, href: appShellRoutes.meydanDojo, icon: Swords },
        { id: 'meydan-duel', label: copy.duel, href: appShellRoutes.meydanDuel, icon: Users }
      ]
    },
    { id: 'quests', label: copy.quests, href: appShellRoutes.quests, icon: Trophy },
    { id: 'settings', label: copy.settings, href: appShellRoutes.settings, icon: Settings2 }
  ], [activeScript, copy]);

  const isItemActive = (id: string) => {
    if (id === 'learn') {
      return (
        location.pathname === appShellRoutes.learn ||
        location.pathname.startsWith(appShellRoutes.learnJapanese) ||
        location.pathname.startsWith(appShellRoutes.learnStatistic) ||
        location.pathname.startsWith(appShellRoutes.learnStatisticAlias) ||
        location.pathname.startsWith(appShellRoutes.learnUnitBase) ||
        location.pathname.startsWith(appShellRoutes.learnGuideBase) ||
        location.pathname.startsWith(appShellRoutes.letters)
      );
    }

    if (id === 'practice') {
      return (
        location.pathname.startsWith(appShellRoutes.practice) ||
        location.pathname.startsWith(appShellRoutes.learnReview)
      );
    }
    if (id === 'play') return location.pathname.startsWith(appShellRoutes.meydan);
    if (id === 'quiz') return location.pathname.startsWith(appShellRoutes.quiz);
    if (id === 'quests') return location.pathname.startsWith(appShellRoutes.quests);
    if (id === 'settings') return location.pathname.startsWith(appShellRoutes.settings);
    return false;
  };

  const isDropdownItemActive = (item: NavDropdownItem) => {
    if (item.id === 'learn-japanese') {
      return (
        location.pathname === appShellRoutes.learn ||
        location.pathname.startsWith(appShellRoutes.learnJapanese) ||
        location.pathname.startsWith(appShellRoutes.learnUnitBase) ||
        location.pathname.startsWith(appShellRoutes.learnGuideBase)
      );
    }

    if (item.id === 'learn-kana') return location.pathname.startsWith(appShellRoutes.letters);
    if (item.id === 'practice-review') return location.pathname.startsWith(appShellRoutes.practiceReview);
    if (item.id === 'practice-weak') return location.pathname.startsWith(appShellRoutes.practiceWeak);
    if (item.id === 'practice-confusable') return location.pathname.startsWith(appShellRoutes.practiceConfusable);
    if (item.id === 'practice-custom') return location.pathname.startsWith(appShellRoutes.practiceCustom);
    if (item.id === 'practice-stats') return location.pathname.startsWith(appShellRoutes.practiceStats);
    if (item.id === 'practice-kana-drawing') return location.pathname.startsWith(appShellRoutes.practiceKanaDrawing);
    if (item.id === 'practice-kana-answer-type') return location.pathname.startsWith(appShellRoutes.practiceKanaAnswerType);
    if (item.id === 'practice-kana-listening') return location.pathname.startsWith(appShellRoutes.practiceKanaListening);
    if (item.id === 'practice-kana-reading') return location.pathname.startsWith(appShellRoutes.practiceKanaReading);
    if (item.id === 'practice-kana-writing-recall') return location.pathname.startsWith(appShellRoutes.practiceKanaWritingRecall);
    if (item.id === 'practice-kana-flashcards') return location.pathname.startsWith(appShellRoutes.practiceKanaFlashcards);
    if (item.id === 'practice-kana-quick-study') return location.pathname.startsWith(appShellRoutes.practiceKanaQuickStudy);
    if (item.id === 'practice-kana-pop') return location.pathname.startsWith(appShellRoutes.practiceKanaPop);
    if (item.id === 'practice-quick-study') return location.pathname.startsWith(appShellRoutes.practiceJapaneseQuickStudy);
    if (item.id === 'practice-topic-lessons') return location.pathname.startsWith(appShellRoutes.practiceJapaneseTopicLessons);
    if (item.id === 'practice-reading') return location.pathname.startsWith(appShellRoutes.practiceJapaneseReading);
    if (item.id === 'practice-fill-blank') return location.pathname.startsWith(appShellRoutes.practiceJapaneseFillBlank);
    if (item.id === 'practice-translation') return location.pathname.startsWith(appShellRoutes.practiceJapaneseTranslation);
    if (item.id === 'practice-sentence-writing') return location.pathname.startsWith(appShellRoutes.practiceJapaneseSentenceWriting);
    if (item.id === 'practice-flashcards') return location.pathname.startsWith(appShellRoutes.practiceJapaneseFlashcards);
    if (item.id === 'practice-kanji-drawing') return location.pathname.startsWith(appShellRoutes.practiceKanjiDrawing);
    if (item.id === 'practice-kanji-reading') return location.pathname.startsWith(appShellRoutes.practiceKanjiReading);
    if (item.id === 'practice-kanji-listening') return location.pathname.startsWith(appShellRoutes.practiceKanjiListening);
    if (item.id === 'practice-kanji-writing-recall') return location.pathname.startsWith(appShellRoutes.practiceKanjiWritingRecall);
    if (item.id === 'practice-kanji-usage') return location.pathname.startsWith(appShellRoutes.practiceKanjiUsage);
    if (item.id === 'practice-kanji-challenge') return location.pathname.startsWith(appShellRoutes.practiceKanjiChallenge);
    if (item.id === 'practice-kanji-match') return location.pathname.startsWith(appShellRoutes.practiceKanjiMatch);
    if (item.id === 'practice-kanji-pop') return location.pathname.startsWith(appShellRoutes.practiceKanjiPop);
    if (item.id === 'meydan-lobby') return location.pathname.startsWith(appShellRoutes.meydanLobby);
    if (item.id === 'meydan-speed') return location.pathname.startsWith(appShellRoutes.meydanSpeed);
    if (item.id === 'meydan-timed') return location.pathname.startsWith(appShellRoutes.meydanTimed);
    if (item.id === 'meydan-dojo') return location.pathname.startsWith(appShellRoutes.meydanDojo);
    if (item.id === 'meydan-duel') return location.pathname.startsWith(appShellRoutes.meydanDuel);
    if (item.id === 'quiz-kanji') return location.pathname.startsWith(appShellRoutes.quizKanji);
    if (item.id === 'quiz-kana') return location.pathname.startsWith(appShellRoutes.quizKana);
    if (item.id === 'quiz-japanese') return location.pathname.startsWith(appShellRoutes.quizJapanese);
    return location.pathname === item.href;
  };

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${
      isDark
        ? 'border-[rgba(255,255,255,0.07)] bg-[rgba(18,12,22,0.52)] shadow-[0_4px_24px_rgba(0,0,0,0.22)]'
        : 'border-[rgba(180,120,90,0.13)] bg-[rgba(255,250,244,0.52)] shadow-[0_4px_18px_rgba(132,82,62,0.04)]'
    }`}>
      <div className="mx-auto flex h-[92px] max-w-[1800px] items-center gap-8 px-8">
        <Link to={appShellRoutes.learn} className="flex shrink-0 items-center gap-3">
          <LanternMark />
          <span className={`text-[26px] font-extrabold tracking-[-0.02em] ${isDark ? 'text-white' : 'text-[#1f2b3b]'}`}>Kototsuna</span>
        </Link>

        <nav ref={navMenuRef} className="scrollbar-hide flex min-w-0 flex-1 items-center gap-8 overflow-visible">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.id);
            const isOpen = openNavMenu === item.id;

            if (item.children || item.groups) {
              return (
                <div
                  key={item.id}
                  className="relative shrink-0"
                  onMouseEnter={() => setOpenNavMenu(item.id)}
                  onMouseLeave={() => setOpenNavMenu(null)}
                  onFocus={() => setOpenNavMenu(item.id)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setOpenNavMenu(null);
                    }
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenNavMenu((current) => (current === item.id ? null : item.id))}
                    className={`relative flex items-center gap-2.5 py-4 text-[15px] font-semibold transition ${
                      isActive ? 'text-[#f04d72]' : isDark ? 'text-slate-200 hover:text-[#ff88a2]' : 'text-[#4d5968] hover:text-[#f04d72]'
                    }`}
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                  >
                    <Icon size={24} strokeWidth={isActive ? 2.4 : 2.1} />
                    <span>{item.label}</span>
                    <ChevronDown size={15} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    {isActive && <span className="absolute bottom-1 left-9 right-0 h-0.5 rounded-full bg-[#f04d72]" />}
                  </button>

                  {isOpen && (
                    <div className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 ${
                      item.groups ? item.groups.length >= 3 ? 'min-w-[640px]' : 'min-w-[420px]' : 'min-w-[220px]'
                    }`}>
                      <div className={`overflow-hidden rounded-xl border py-2 shadow-lg backdrop-blur-xl ${
                        isDark
                          ? 'border-[rgba(255,255,255,0.08)] bg-[rgba(18,12,22,0.88)]'
                          : 'border-[rgba(180,120,90,0.13)] bg-[rgba(255,250,244,0.95)]'
                      }`}>
                        {item.children?.map((child) => {
                          const ChildIcon = child.icon;
                          const childActive = isDropdownItemActive(child);

                          return (
                            <Link
                              key={child.id}
                              to={child.href}
                              onClick={() => setOpenNavMenu(null)}
                              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold transition ${
                                childActive
                                  ? isDark
                                    ? 'bg-[rgba(255,255,255,0.1)] text-white'
                                    : 'bg-[rgba(240,77,114,0.08)] text-[#f04d72]'
                                  : isDark
                                    ? 'text-slate-300 hover:bg-[rgba(255,255,255,0.06)] hover:text-white'
                                    : 'text-[#4d5968] hover:bg-[rgba(180,120,90,0.07)] hover:text-[#f04d72]'
                              }`}
                            >
                              <ChildIcon size={18} strokeWidth={2.2} />
                              <span>{child.label}</span>
                            </Link>
                          );
                        })}
                        {item.groups && (
                          <div className={`grid gap-2 px-2 ${item.groups.length >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                            {item.groups.map((group, index) => (
                              <div
                                key={group.id}
                                className={`${index > 0 ? 'border-l pl-2' : ''} ${
                                  isDark ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(180,120,90,0.13)]'
                                }`}
                              >
                                <div className={`px-3 pb-1 pt-2 text-[11px] font-black uppercase tracking-[0.16em] ${
                                  isDark ? 'text-slate-400' : 'text-[#8a6470]'
                                }`}>
                                  {group.title}
                                </div>
                                {group.children.map((child) => {
                                  const ChildIcon = child.icon;
                                  const childActive = isDropdownItemActive(child);

                                  return (
                                    <Link
                                      key={child.id}
                                      to={child.href}
                                      onClick={() => setOpenNavMenu(null)}
                                      className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                                        childActive
                                          ? isDark
                                            ? 'bg-[rgba(255,255,255,0.1)] text-white'
                                            : 'bg-[rgba(240,77,114,0.08)] text-[#f04d72]'
                                          : isDark
                                            ? 'text-slate-300 hover:bg-[rgba(255,255,255,0.06)] hover:text-white'
                                            : 'text-[#4d5968] hover:bg-[rgba(180,120,90,0.07)] hover:text-[#f04d72]'
                                      }`}
                                    >
                                      <ChildIcon size={18} strokeWidth={2.2} />
                                      <span>{child.label}</span>
                                    </Link>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.href ?? appShellRoutes.learn}
                className={`relative flex shrink-0 items-center gap-2.5 py-4 text-[15px] font-semibold transition ${
                  isActive ? 'text-[#f04d72]' : isDark ? 'text-slate-200 hover:text-[#ff88a2]' : 'text-[#4d5968] hover:text-[#f04d72]'
                }`}
              >
                <Icon size={24} strokeWidth={isActive ? 2.4 : 2.1} />
                <span>{item.label}</span>
                {isActive && <span className="absolute bottom-1 left-9 right-0 h-0.5 rounded-full bg-[#f04d72]" />}
              </Link>
            );
          })}
        </nav>

        <div className={`hidden shrink-0 items-center gap-5 text-[16px] font-bold md:flex ${isDark ? 'text-slate-100' : 'text-[#263344]'}`}>

          {/* Language selector */}
          <div ref={langMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsLangOpen((v) => !v)}
              className={`flex items-center gap-2 text-sm font-semibold transition ${
                isDark ? 'text-slate-200 hover:text-white' : 'text-[#4d5968] hover:text-[#f04d72]'
              }`}
              aria-haspopup="listbox"
              aria-expanded={isLangOpen}
            >
              <img
                src={languageOptions.find((o) => o.id === language)?.flag}
                alt=""
                className="h-4 w-4 rounded-full object-cover"
              />
              <span className="uppercase tracking-wide">{language}</span>
              <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className={`absolute right-0 top-[calc(100%+8px)] z-50 min-w-[140px] overflow-hidden rounded-xl border shadow-lg backdrop-blur-xl ${
                isDark
                  ? 'border-[rgba(255,255,255,0.08)] bg-[rgba(18,12,22,0.82)]'
                  : 'border-[rgba(180,120,90,0.13)] bg-[rgba(255,250,244,0.92)]'
              }`}>
                {languageOptions.map((option) => {
                  const isActive = option.id === language;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => { onLanguageChange(option.id); setIsLangOpen(false); }}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition ${
                        isActive
                          ? isDark
                            ? 'bg-[rgba(255,255,255,0.1)] text-white'
                            : 'bg-[rgba(240,77,114,0.08)] text-[#f04d72]'
                          : isDark
                            ? 'text-slate-300 hover:bg-[rgba(255,255,255,0.06)]'
                            : 'text-[#4d5968] hover:bg-[rgba(180,120,90,0.07)]'
                      }`}
                    >
                      <img src={option.flag} alt="" className="h-4 w-4 rounded-full object-cover" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onThemeModeChange(isDark ? 'light' : 'dark')}
            className={`flex items-center justify-center transition ${
              isDark ? 'text-yellow-200 hover:text-white' : 'text-[#d94872] hover:text-[#f04d72]'
            }`}
            aria-label={isDark ? 'Light mode' : 'Dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link
            to={appShellRoutes.learn}
            className="flex items-center gap-1.5 text-[#df6c20]"
            title={`${copy.streak}: ${streakDays}`}
            aria-label={`${copy.streak}: ${streakDays}`}
          >
            <Flame size={20} fill="currentColor" />
            <span className="text-[#f07b21]">灯</span>
            <span>{Math.max(streakDays, 12)}</span>
          </Link>

          <div
            className="flex items-center gap-1.5 text-[#d94872]"
            title={`${copy.hanabira}: ${hanabira}`}
            aria-label={`${copy.hanabira}: ${hanabira}`}
          >
            <span className="text-[21px] leading-none">花</span>
            <span>{hanabira}</span>
          </div>

          <div
            className="flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-[#ffd8c2] bg-[#fff0e4] text-[27px] font-extrabold text-[#8f3a2a] shadow-[inset_0_0_0_6px_rgba(255,255,255,0.36)]"
            title={`${copy.dan}: ${kyu} kyu`}
            aria-label={`${copy.dan}: ${kyu} kyu`}
          >
            {kyu}°
          </div>
        </div>
      </div>
    </header>
  );
};
