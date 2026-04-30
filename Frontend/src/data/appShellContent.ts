import { AppLanguage } from './appPreferences';

type KanaRouteScript = 'hiragana' | 'katakana';
export type KanaAppScope = 'study' | 'play';
type KanaPlayNavView =
  | 'overview'
  | 'kana-match'
  | 'meaning-match'
  | 'speed-tap'
  | 'memory-flip';

export const appShellRoutes = {
  home: '/',
  learn: '/learn',
  learnReview: '/learn/review',
  learnStatistic: '/learn/staticstic',
  learnStatisticAlias: '/learn/statistic',
  learnJapanese: '/learn/japanese',
  learnJapaneseMissionBase: '/learn/japanese/mission',
  learnJapaneseChallengeBase: '/learn/japanese/challenge',
  learnUnitBase: '/learn/unit',
  learnGuideBase: '/learn/guide',
  letters: '/letters',
  practice: '/practice',
  practiceReview: '/practice/review',
  practiceWeak: '/practice/weak',
  practiceConfusable: '/practice/confusable',
  practiceCustom: '/practice/custom',
  practiceStats: '/practice/stats',
  practiceKanaDrawing: '/practice/kana/drawing',
  practiceKanaAnswerType: '/practice/kana/answer-type',
  practiceKanaListening: '/practice/kana/listening',
  practiceKanaReading: '/practice/kana/reading',
  practiceKanaWritingRecall: '/practice/kana/writing-recall',
  practiceKanaFlashcards: '/practice/kana/flashcards',
  practiceKanaQuickStudy: '/practice/kana/quick-study',
  practiceKanaPop: '/practice/kana-pop',
  practiceJapaneseQuickStudy: '/practice/japanese/quick-study',
  practiceJapaneseTopicLessons: '/practice/japanese/topic-lessons',
  practiceJapaneseReading: '/practice/japanese/reading',
  practiceJapaneseFillBlank: '/practice/japanese/fill-blank',
  practiceJapaneseTranslation: '/practice/japanese/translation',
  practiceJapaneseSentenceWriting: '/practice/japanese/sentence-writing',
  practiceJapaneseFlashcards: '/practice/japanese/flashcards',
  practiceKanjiDrawing: '/practice/kanji/drawing',
  practiceKanjiReading: '/practice/kanji/reading',
  practiceKanjiListening: '/practice/kanji/listening',
  practiceKanjiWritingRecall: '/practice/kanji/writing-recall',
  practiceKanjiUsage: '/practice/kanji/usage',
  practiceKanjiChallenge: '/practice/kanji/challenge',
  practiceKanjiMatch: '/practice/kanji/match',
  practiceKanjiPop: '/practice/kanji/pop',
  practiceRun: '/practice/run',
  quiz: '/quiz',
  quizKanji: '/quiz/kanji',
  quizKana: '/quiz/kana',
  quizJapanese: '/quiz/japanese',
  forge: '/practice/forge',
  meydan: '/meydan',
  meydanLobby: '/meydan/lobby',
  meydanSpeed: '/meydan/speed',
  meydanTimed: '/meydan/timed',
  meydanDojo: '/meydan/dojo-boss',
  meydanDuel: '/meydan/duel',
  quests: '/quests',
  hiraganaOverview: '/kana/hiragana/overview',
  hiraganaLearn: '/kana/hiragana/learn',
  hiraganaPlay: '/kana/hiragana/play',
  hiraganaReview: '/kana/hiragana/review',
  hiraganaWeak: '/kana/hiragana/weak',
  hiraganaConfusable: '/kana/hiragana/confusable',
  hiraganaWords: '/kana/hiragana/words',
  hiraganaStats: '/kana/hiragana/stats',
  hiraganaPlayStats: '/kana/hiragana/play/stats',
  hiraganaPlayItemBase: '/kana/hiragana/play/item',
  hiraganaPlaySessionBase: '/kana/hiragana/play/session',
  katakanaOverview: '/kana/katakana/overview',
  katakanaLearn: '/kana/katakana/learn',
  katakanaPlay: '/kana/katakana/play',
  katakanaReview: '/kana/katakana/review',
  katakanaWeak: '/kana/katakana/weak',
  katakanaConfusable: '/kana/katakana/confusable',
  katakanaWords: '/kana/katakana/words',
  katakanaStats: '/kana/katakana/stats',
  katakanaPlayStats: '/kana/katakana/play/stats',
  katakanaPlayItemBase: '/kana/katakana/play/item',
  katakanaPlaySessionBase: '/kana/katakana/play/session',
  kanjiOverview: '/kana/kanji/overview',
  search: '/search',
  account: '/account',
  settings: '/account/settings'
} as const;

export const getLearnUnitRoute = (unitId: string) => `${appShellRoutes.learnUnitBase}/${unitId}`;
export const getLearnGuideRoute = (unitId: string) => `${appShellRoutes.learnGuideBase}/${unitId}`;

const studyLearnRouteByScript: Record<KanaRouteScript, string> = {
  hiragana: appShellRoutes.hiraganaLearn,
  katakana: appShellRoutes.katakanaLearn
};

const playRouteByScript: Record<KanaRouteScript, string> = {
  hiragana: appShellRoutes.hiraganaPlay,
  katakana: appShellRoutes.katakanaPlay
};

const getKanaPlayViewRoute = (script: KanaRouteScript, view: KanaPlayNavView): string => {
  const baseRoute = playRouteByScript[script];

  if (view === 'overview') {
    return baseRoute;
  }

  return `${baseRoute}?game=${view}`;
};

const studyStatsRouteByScript: Record<KanaRouteScript, string> = {
  hiragana: appShellRoutes.hiraganaStats,
  katakana: appShellRoutes.katakanaStats
};

export const getPracticeRoute = (
  script: KanaRouteScript,
  tab?: 'overview' | 'review' | 'weak' | 'confusable' | 'free' | 'stats'
) => {
  const routeByTab = {
    overview: appShellRoutes.practiceReview,
    review: appShellRoutes.practiceReview,
    weak: appShellRoutes.practiceWeak,
    confusable: appShellRoutes.practiceConfusable,
    free: appShellRoutes.practiceCustom,
    stats: appShellRoutes.practiceStats
  } as const;
  const searchParams = new URLSearchParams();
  searchParams.set('script', script);

  return `${routeByTab[tab ?? 'overview']}?${searchParams.toString()}`;
};

const playStatsRouteByScript: Record<KanaRouteScript, string> = {
  hiragana: appShellRoutes.hiraganaPlayStats,
  katakana: appShellRoutes.katakanaPlayStats
};

const playItemBaseByScript: Record<KanaRouteScript, string> = {
  hiragana: appShellRoutes.hiraganaPlayItemBase,
  katakana: appShellRoutes.katakanaPlayItemBase
};

const playSessionBaseByScript: Record<KanaRouteScript, string> = {
  hiragana: appShellRoutes.hiraganaPlaySessionBase,
  katakana: appShellRoutes.katakanaPlaySessionBase
};

export const getKanaEntryRoute = (
  script: KanaRouteScript,
  scope: KanaAppScope = 'study'
) => (scope === 'play' ? playRouteByScript[script] : studyLearnRouteByScript[script]);

export const getKanaStatsRoute = (
  script: KanaRouteScript,
  scope: KanaAppScope = 'study'
) => (scope === 'play' ? playStatsRouteByScript[script] : studyStatsRouteByScript[script]);

export const getKanaItemRoute = (
  script: KanaRouteScript,
  kanaId: string,
  scope: KanaAppScope = 'study'
) =>
  scope === 'play'
    ? `${playItemBaseByScript[script]}/${kanaId}`
    : `/kana/item/${kanaId}`;

export const getKanaSessionRoute = (
  script: KanaRouteScript,
  sessionId: string,
  scope: KanaAppScope = 'study'
) =>
  scope === 'play'
    ? `${playSessionBaseByScript[script]}/${sessionId}`
    : `/kana/session/${sessionId}`;

export type AppShellNavItemId =
  | 'home'
  | 'study'
  | 'test'
  | 'play'
  | 'search'
  | 'account';

export type AppShellGroupId = 'hiragana' | 'katakana' | 'kanji' | 'kana';

export interface AppShellLink {
  id: string;
  label: string;
  description: string;
  href: string;
  badge?: string;
}

export interface AppShellGroup {
  id: AppShellGroupId;
  title: string;
  links: AppShellLink[];
}

export interface AppShellNavItem {
  id: AppShellNavItemId;
  label: string;
  href?: string;
  groups?: AppShellGroup[];
}

export interface AppShellFooterColumn {
  id: string;
  title: string;
  links: AppShellLink[];
}

export interface AppShellContent {
  navbar: {
    items: AppShellNavItem[];
  };
  footer: {
    columns: AppShellFooterColumn[];
  };
}

export const appShellContent: Record<AppLanguage, AppShellContent> = {
  tr: {
    navbar: {
      items: [
        {
          id: 'home',
          label: 'Home',
          href: appShellRoutes.home
        },
        {
          id: 'study',
          label: 'Study',
          groups: [
            {
              id: 'hiragana',
              title: 'Hiragana',
              links: [
                {
                  id: 'hiragana-overview',
                  label: 'Overview',
                  description: 'Hiragana genel durumu ve giris noktasi.',
                  href: appShellRoutes.hiraganaOverview
                },
                {
                  id: 'hiragana-learn',
                  label: 'Learn Path',
                  description: 'Yeni hiragana karakterlerini sirali ac.',
                  href: appShellRoutes.hiraganaLearn
                },
                {
                  id: 'hiragana-review',
                  label: 'Review Queue',
                  description: 'Due review ve tekrar bekleyen hiragana akisi.',
                  href: appShellRoutes.hiraganaReview
                }
              ]
            },
            {
              id: 'katakana',
              title: 'Katakana',
              links: [
                {
                  id: 'katakana-overview',
                  label: 'Overview',
                  description: 'Katakana genel durumu ve giris noktasi.',
                  href: appShellRoutes.katakanaOverview
                },
                {
                  id: 'katakana-learn',
                  label: 'Learn Path',
                  description: 'Yeni katakana karakterlerini sirali ac.',
                  href: appShellRoutes.katakanaLearn
                },
                {
                  id: 'katakana-review',
                  label: 'Review Queue',
                  description: 'Due review ve tekrar bekleyen katakana akisi.',
                  href: appShellRoutes.katakanaReview
                }
              ]
            },
            {
              id: 'kanji',
              title: 'Kanji',
              links: [
                {
                  id: 'kanji-overview',
                  label: 'Overview',
                  description: 'Yeni shell ile uyumlu kanji placeholder girisi.',
                  href: appShellRoutes.kanjiOverview,
                  badge: 'Soon'
                }
              ]
            }
          ]
        },
        {
          id: 'test',
          label: 'Test',
          groups: [
            {
              id: 'hiragana',
              title: 'Hiragana',
              links: [
                {
                  id: 'hiragana-review-test',
                  label: 'Review Queue',
                  description: 'Hiragana due review akisini ac.',
                  href: appShellRoutes.hiraganaReview
                },
                {
                  id: 'hiragana-weak-test',
                  label: 'Weak Review',
                  description: 'Hiragana tarafindaki zayif itemleri kontrol et.',
                  href: appShellRoutes.hiraganaWeak
                },
                {
                  id: 'hiragana-confusable-test',
                  label: 'Confusable Drill',
                  description: 'Hiragana karisma ciftlerini ayri test et.',
                  href: appShellRoutes.hiraganaConfusable
                },
                {
                  id: 'hiragana-stats',
                  label: 'Stats',
                  description: 'Hiragana progress ve test sonuclarini gor.',
                  href: appShellRoutes.hiraganaStats
                }
              ]
            },
            {
              id: 'katakana',
              title: 'Katakana',
              links: [
                {
                  id: 'katakana-review-test',
                  label: 'Review Queue',
                  description: 'Katakana due review akisini ac.',
                  href: appShellRoutes.katakanaReview
                },
                {
                  id: 'katakana-weak-test',
                  label: 'Weak Review',
                  description: 'Katakana tarafindaki zayif itemleri kontrol et.',
                  href: appShellRoutes.katakanaWeak
                },
                {
                  id: 'katakana-confusable-test',
                  label: 'Confusable Drill',
                  description: 'Katakana karisma ciftlerini ayri test et.',
                  href: appShellRoutes.katakanaConfusable
                },
                {
                  id: 'katakana-stats',
                  label: 'Stats',
                  description: 'Katakana progress ve test sonuclarini gor.',
                  href: appShellRoutes.katakanaStats
                }
              ]
            }
          ]
        },
        {
          id: 'play',
          label: 'Meydan',
          groups: [
            {
              id: 'hiragana',
              title: 'Hiragana',
              links: [
                {
                  id: 'hiragana-play-overview',
                  label: 'Overview',
                  description: 'Hiragana play ozetini ac.',
                  href: getKanaPlayViewRoute('hiragana', 'overview')
                },
                {
                  id: 'hiragana-play-kana-match',
                  label: 'Kana Match',
                  description: 'Gosterilen karakterin dogru okunuusunu sec.',
                  href: getKanaPlayViewRoute('hiragana', 'kana-match')
                },
                {
                  id: 'hiragana-play-meaning-match',
                  label: 'Meaning Match',
                  description: 'Kelimeyi gor ve dogru anlami sec.',
                  href: getKanaPlayViewRoute('hiragana', 'meaning-match')
                },
                {
                  id: 'hiragana-play-speed-tap',
                  label: 'Speed Tap',
                  description: 'Hiz odakli secim modu (yakinda).',
                  href: getKanaPlayViewRoute('hiragana', 'speed-tap')
                },
                {
                  id: 'hiragana-play-memory-flip',
                  label: 'Memory Flip',
                  description: 'Kart eslestirme modu (yakinda).',
                  href: getKanaPlayViewRoute('hiragana', 'memory-flip')
                }
              ]
            },
            {
              id: 'katakana',
              title: 'Katakana',
              links: [
                {
                  id: 'katakana-play-overview',
                  label: 'Overview',
                  description: 'Katakana play ozetini ac.',
                  href: getKanaPlayViewRoute('katakana', 'overview')
                },
                {
                  id: 'katakana-play-kana-match',
                  label: 'Kana Match',
                  description: 'Gosterilen karakterin dogru okunuusunu sec.',
                  href: getKanaPlayViewRoute('katakana', 'kana-match')
                },
                {
                  id: 'katakana-play-meaning-match',
                  label: 'Meaning Match',
                  description: 'Kelimeyi gor ve dogru anlami sec.',
                  href: getKanaPlayViewRoute('katakana', 'meaning-match')
                },
                {
                  id: 'katakana-play-speed-tap',
                  label: 'Speed Tap',
                  description: 'Hiz odakli secim modu (yakinda).',
                  href: getKanaPlayViewRoute('katakana', 'speed-tap')
                },
                {
                  id: 'katakana-play-memory-flip',
                  label: 'Memory Flip',
                  description: 'Kart eslestirme modu (yakinda).',
                  href: getKanaPlayViewRoute('katakana', 'memory-flip')
                }
              ]
            },
            {
              id: 'kanji',
              title: 'Kanji',
              links: [
                {
                  id: 'kanji-play-overview',
                  label: 'Overview',
                  description: 'Kanji tarafinda daha sonra doldurulacak giris.',
                  href: appShellRoutes.kanjiOverview,
                  badge: 'Soon'
                }
              ]
            }
          ]
        }
      ]
    },
    footer: {
      columns: [
        {
          id: 'information-help',
          title: 'Information and Help',
          links: [
            {
              id: 'footer-home',
              label: 'Home',
              description: 'Urunun genel giris sayfasina don.',
              href: appShellRoutes.home
            },
            {
              id: 'footer-study-guide',
              label: 'How to Study',
              description: 'Study akisini ve temel kullanim mantigini oku.',
              href: appShellRoutes.home
            },
            {
              id: 'footer-search',
              label: 'Search',
              description: 'Arama alanina gec.',
              href: appShellRoutes.search
            }
          ]
        },
        {
          id: 'kana',
          title: 'Kana',
          links: [
            {
              id: 'footer-hiragana',
              label: 'Hiragana Overview',
              description: 'Hiragana giris ekranina git.',
              href: appShellRoutes.hiraganaOverview
            },
            {
              id: 'footer-katakana',
              label: 'Katakana Overview',
              description: 'Katakana giris ekranina git.',
              href: appShellRoutes.katakanaOverview
            },
            {
              id: 'footer-kana-confusable',
              label: 'Confusable Kana',
              description: 'Karistirilan kana ciftlerini ayri calis.',
              href: appShellRoutes.hiraganaConfusable
            }
          ]
        },
        {
          id: 'words',
          title: 'Words',
          links: [
            {
              id: 'footer-hiragana-words',
              label: 'Hiragana Words',
              description: 'Hiragana kelime havuzuna git.',
              href: appShellRoutes.hiraganaWords
            },
            {
              id: 'footer-katakana-words',
              label: 'Katakana Words',
              description: 'Katakana kelime havuzuna git.',
              href: appShellRoutes.katakanaWords
            },
            {
              id: 'footer-word-search',
              label: 'Word Search',
              description: 'Kelime aramasi icin ayrilan giris.',
              href: appShellRoutes.search
            }
          ]
        },
        {
          id: 'study',
          title: 'Study',
          links: [
            {
              id: 'footer-hiragana-learn',
              label: 'Hiragana Learn',
              description: 'Sirali hiragana ogrenme akisi.',
              href: appShellRoutes.hiraganaLearn
            },
            {
              id: 'footer-katakana-learn',
              label: 'Katakana Learn',
              description: 'Sirali katakana ogrenme akisi.',
              href: appShellRoutes.katakanaLearn
            },
            {
              id: 'footer-review',
              label: 'Review Queue',
              description: 'Due review alanina gec.',
              href: appShellRoutes.hiraganaReview
            }
          ]
        },
        {
          id: 'review-progress',
          title: 'Review and Progress',
          links: [
            {
              id: 'footer-weak-items',
              label: 'Weak Items',
              description: 'Zorlanilan karakterleri tekrar gor.',
              href: appShellRoutes.hiraganaWeak
            },
            {
              id: 'footer-hiragana-stats',
              label: 'Hiragana Stats',
              description: 'Hiragana progress durumunu gor.',
              href: appShellRoutes.hiraganaStats
            },
            {
              id: 'footer-katakana-stats',
              label: 'Katakana Stats',
              description: 'Katakana progress durumunu gor.',
              href: appShellRoutes.katakanaStats
            }
          ]
        },
        {
          id: 'account',
          title: 'Account',
          links: [
            {
              id: 'footer-account',
              label: 'Dashboard',
              description: 'Hesap ve ileride dashboard icin giris noktasi.',
              href: appShellRoutes.account
            },
            {
              id: 'footer-settings',
              label: 'Settings',
              description: 'Uygulama ayarlarina git.',
              href: appShellRoutes.settings
            }
          ]
        },
        {
          id: 'search',
          title: 'Search',
          links: [
            {
              id: 'footer-search-quick',
              label: 'Quick Search',
              description: 'Hizli arama alanina git.',
              href: appShellRoutes.search
            },
            {
              id: 'footer-search-items',
              label: 'Item Search',
              description: 'Kana veya item odakli arama alani.',
              href: appShellRoutes.search
            }
          ]
        }
      ]
    }
  },
  en: {
    navbar: {
      items: [
        {
          id: 'home',
          label: 'Home',
          href: appShellRoutes.home
        },
        {
          id: 'study',
          label: 'Study',
          groups: [
            {
              id: 'hiragana',
              title: 'Hiragana',
              links: [
                {
                  id: 'hiragana-overview',
                  label: 'Overview',
                  description: 'Open the hiragana entry and overview screen.',
                  href: appShellRoutes.hiraganaOverview
                },
                {
                  id: 'hiragana-learn',
                  label: 'Learn Path',
                  description: 'Open the guided hiragana learning flow.',
                  href: appShellRoutes.hiraganaLearn
                },
                {
                  id: 'hiragana-review',
                  label: 'Review Queue',
                  description: 'Return to due review items for hiragana.',
                  href: appShellRoutes.hiraganaReview
                }
              ]
            },
            {
              id: 'katakana',
              title: 'Katakana',
              links: [
                {
                  id: 'katakana-overview',
                  label: 'Overview',
                  description: 'Open the katakana entry and overview screen.',
                  href: appShellRoutes.katakanaOverview
                },
                {
                  id: 'katakana-learn',
                  label: 'Learn Path',
                  description: 'Open the guided katakana learning flow.',
                  href: appShellRoutes.katakanaLearn
                },
                {
                  id: 'katakana-review',
                  label: 'Review Queue',
                  description: 'Return to due review items for katakana.',
                  href: appShellRoutes.katakanaReview
                }
              ]
            },
            {
              id: 'kanji',
              title: 'Kanji',
              links: [
                {
                  id: 'kanji-overview',
                  label: 'Overview',
                  description: 'Placeholder kanji entry aligned with the new shell.',
                  href: appShellRoutes.kanjiOverview,
                  badge: 'Soon'
                }
              ]
            }
          ]
        },
        {
          id: 'test',
          label: 'Test',
          groups: [
            {
              id: 'hiragana',
              title: 'Hiragana',
              links: [
                {
                  id: 'hiragana-review-test',
                  label: 'Review Queue',
                  description: 'Open the hiragana due review flow.',
                  href: appShellRoutes.hiraganaReview
                },
                {
                  id: 'hiragana-weak-test',
                  label: 'Weak Review',
                  description: 'Check the weakest hiragana items.',
                  href: appShellRoutes.hiraganaWeak
                },
                {
                  id: 'hiragana-confusable-test',
                  label: 'Confusable Drill',
                  description: 'Practice the most confused hiragana pairs.',
                  href: appShellRoutes.hiraganaConfusable
                },
                {
                  id: 'hiragana-stats',
                  label: 'Stats',
                  description: 'View hiragana learning progress.',
                  href: appShellRoutes.hiraganaStats
                }
              ]
            },
            {
              id: 'katakana',
              title: 'Katakana',
              links: [
                {
                  id: 'katakana-review-test',
                  label: 'Review Queue',
                  description: 'Open the katakana due review flow.',
                  href: appShellRoutes.katakanaReview
                },
                {
                  id: 'katakana-weak-test',
                  label: 'Weak Review',
                  description: 'Check the weakest katakana items.',
                  href: appShellRoutes.katakanaWeak
                },
                {
                  id: 'katakana-confusable-test',
                  label: 'Confusable Drill',
                  description: 'Practice the most confused katakana pairs.',
                  href: appShellRoutes.katakanaConfusable
                },
                {
                  id: 'katakana-stats',
                  label: 'Stats',
                  description: 'View katakana learning progress.',
                  href: appShellRoutes.katakanaStats
                }
              ]
            }
          ]
        },
        {
          id: 'play',
          label: 'Meydan',
          groups: [
            {
              id: 'hiragana',
              title: 'Hiragana',
              links: [
                {
                  id: 'hiragana-play-overview',
                  label: 'Overview',
                  description: 'Open the hiragana play overview.',
                  href: getKanaPlayViewRoute('hiragana', 'overview')
                },
                {
                  id: 'hiragana-play-kana-match',
                  label: 'Kana Match',
                  description: 'Pick the correct reading for the shown character.',
                  href: getKanaPlayViewRoute('hiragana', 'kana-match')
                },
                {
                  id: 'hiragana-play-meaning-match',
                  label: 'Meaning Match',
                  description: 'Read a word and pick the correct meaning.',
                  href: getKanaPlayViewRoute('hiragana', 'meaning-match')
                },
                {
                  id: 'hiragana-play-speed-tap',
                  label: 'Speed Tap',
                  description: 'Fast selection mode (coming soon).',
                  href: getKanaPlayViewRoute('hiragana', 'speed-tap')
                },
                {
                  id: 'hiragana-play-memory-flip',
                  label: 'Memory Flip',
                  description: 'Matching-card mode (coming soon).',
                  href: getKanaPlayViewRoute('hiragana', 'memory-flip')
                }
              ]
            },
            {
              id: 'katakana',
              title: 'Katakana',
              links: [
                {
                  id: 'katakana-play-overview',
                  label: 'Overview',
                  description: 'Open the katakana play overview.',
                  href: getKanaPlayViewRoute('katakana', 'overview')
                },
                {
                  id: 'katakana-play-kana-match',
                  label: 'Kana Match',
                  description: 'Pick the correct reading for the shown character.',
                  href: getKanaPlayViewRoute('katakana', 'kana-match')
                },
                {
                  id: 'katakana-play-meaning-match',
                  label: 'Meaning Match',
                  description: 'Read a word and pick the correct meaning.',
                  href: getKanaPlayViewRoute('katakana', 'meaning-match')
                },
                {
                  id: 'katakana-play-speed-tap',
                  label: 'Speed Tap',
                  description: 'Fast selection mode (coming soon).',
                  href: getKanaPlayViewRoute('katakana', 'speed-tap')
                },
                {
                  id: 'katakana-play-memory-flip',
                  label: 'Memory Flip',
                  description: 'Matching-card mode (coming soon).',
                  href: getKanaPlayViewRoute('katakana', 'memory-flip')
                }
              ]
            },
            {
              id: 'kanji',
              title: 'Kanji',
              links: [
                {
                  id: 'kanji-play-overview',
                  label: 'Overview',
                  description: 'Reserved kanji entry for a later phase.',
                  href: appShellRoutes.kanjiOverview,
                  badge: 'Soon'
                }
              ]
            }
          ]
        }
      ]
    },
    footer: {
      columns: [
        {
          id: 'information-help',
          title: 'Information and Help',
          links: [
            {
              id: 'footer-home',
              label: 'Home',
              description: 'Return to the main entry screen.',
              href: appShellRoutes.home
            },
            {
              id: 'footer-study-guide',
              label: 'How to Study',
              description: 'Read the core study guidance entry.',
              href: appShellRoutes.home
            },
            {
              id: 'footer-search',
              label: 'Search',
              description: 'Go to the search entry point.',
              href: appShellRoutes.search
            }
          ]
        },
        {
          id: 'kana',
          title: 'Kana',
          links: [
            {
              id: 'footer-hiragana',
              label: 'Hiragana Overview',
              description: 'Open the hiragana overview screen.',
              href: appShellRoutes.hiraganaOverview
            },
            {
              id: 'footer-katakana',
              label: 'Katakana Overview',
              description: 'Open the katakana overview screen.',
              href: appShellRoutes.katakanaOverview
            },
            {
              id: 'footer-kana-confusable',
              label: 'Confusable Kana',
              description: 'Open the kana confusion drill entry.',
              href: appShellRoutes.hiraganaConfusable
            }
          ]
        },
        {
          id: 'words',
          title: 'Words',
          links: [
            {
              id: 'footer-hiragana-words',
              label: 'Hiragana Words',
              description: 'Open the hiragana word pool.',
              href: appShellRoutes.hiraganaWords
            },
            {
              id: 'footer-katakana-words',
              label: 'Katakana Words',
              description: 'Open the katakana word pool.',
              href: appShellRoutes.katakanaWords
            },
            {
              id: 'footer-word-search',
              label: 'Word Search',
              description: 'Jump to the planned search entry.',
              href: appShellRoutes.search
            }
          ]
        },
        {
          id: 'study',
          title: 'Study',
          links: [
            {
              id: 'footer-hiragana-learn',
              label: 'Hiragana Learn',
              description: 'Open the guided hiragana flow.',
              href: appShellRoutes.hiraganaLearn
            },
            {
              id: 'footer-katakana-learn',
              label: 'Katakana Learn',
              description: 'Open the guided katakana flow.',
              href: appShellRoutes.katakanaLearn
            },
            {
              id: 'footer-review',
              label: 'Review Queue',
              description: 'Return to the due review entry.',
              href: appShellRoutes.hiraganaReview
            }
          ]
        },
        {
          id: 'review-progress',
          title: 'Review and Progress',
          links: [
            {
              id: 'footer-weak-items',
              label: 'Weak Items',
              description: 'Focus on the weakest items first.',
              href: appShellRoutes.hiraganaWeak
            },
            {
              id: 'footer-hiragana-stats',
              label: 'Hiragana Stats',
              description: 'View hiragana progress details.',
              href: appShellRoutes.hiraganaStats
            },
            {
              id: 'footer-katakana-stats',
              label: 'Katakana Stats',
              description: 'View katakana progress details.',
              href: appShellRoutes.katakanaStats
            }
          ]
        },
        {
          id: 'account',
          title: 'Account',
          links: [
            {
              id: 'footer-account',
              label: 'Dashboard',
              description: 'Reserved account and dashboard entry.',
              href: appShellRoutes.account
            },
            {
              id: 'footer-settings',
              label: 'Settings',
              description: 'Open application settings.',
              href: appShellRoutes.settings
            }
          ]
        },
        {
          id: 'search',
          title: 'Search',
          links: [
            {
              id: 'footer-search-quick',
              label: 'Quick Search',
              description: 'Open the future quick search entry.',
              href: appShellRoutes.search
            },
            {
              id: 'footer-search-items',
              label: 'Item Search',
              description: 'Search planned kana or item entries.',
              href: appShellRoutes.search
            }
          ]
        }
      ]
    }
  }
};
