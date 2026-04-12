import { AppLanguage } from './appPreferences';

export const appShellRoutes = {
  home: '/',
  hiraganaOverview: '/kana/hiragana/overview',
  hiraganaLearn: '/kana/hiragana/learn',
  hiraganaReview: '/kana/hiragana/review',
  hiraganaWeak: '/kana/hiragana/weak',
  hiraganaConfusable: '/kana/hiragana/confusable',
  hiraganaWords: '/kana/hiragana/words',
  hiraganaStats: '/kana/hiragana/stats',
  katakanaOverview: '/kana/katakana/overview',
  katakanaLearn: '/kana/katakana/learn',
  katakanaReview: '/kana/katakana/review',
  katakanaWeak: '/kana/katakana/weak',
  katakanaConfusable: '/kana/katakana/confusable',
  katakanaWords: '/kana/katakana/words',
  katakanaStats: '/kana/katakana/stats',
  kanjiOverview: '/kanji/overview',
  search: '/search',
  account: '/account',
  settings: '/account/settings'
} as const;

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
              id: 'kana',
              title: 'Kana',
              links: [
                {
                  id: 'kana-mixed-review',
                  label: 'Mixed Review',
                  description: 'Kana genel tekrar ve kontrol akisi.',
                  href: appShellRoutes.hiraganaReview
                },
                {
                  id: 'kana-weak-items',
                  label: 'Weak Items',
                  description: 'En cok zorlanilan karakterleri ayri test et.',
                  href: appShellRoutes.hiraganaWeak
                },
                {
                  id: 'kana-confusables',
                  label: 'Confusables',
                  description: 'Karistirilan kana ciftlerini ayri calis.',
                  href: appShellRoutes.hiraganaConfusable
                }
              ]
            },
            {
              id: 'hiragana',
              title: 'Hiragana',
              links: [
                {
                  id: 'hiragana-weak-test',
                  label: 'Weak Review',
                  description: 'Hiragana tarafindaki zayif itemleri kontrol et.',
                  href: appShellRoutes.hiraganaWeak
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
                  id: 'katakana-weak-test',
                  label: 'Weak Review',
                  description: 'Katakana tarafindaki zayif itemleri kontrol et.',
                  href: appShellRoutes.katakanaWeak
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
          label: 'Play',
          groups: [
            {
              id: 'hiragana',
              title: 'Hiragana',
              links: [
                {
                  id: 'hiragana-play-overview',
                  label: 'Quick Start',
                  description: 'Hiragana icin hizli drill ve oyun benzeri giris.',
                  href: appShellRoutes.hiraganaOverview
                }
              ]
            },
            {
              id: 'katakana',
              title: 'Katakana',
              links: [
                {
                  id: 'katakana-play-overview',
                  label: 'Quick Start',
                  description: 'Katakana icin hizli drill ve oyun benzeri giris.',
                  href: appShellRoutes.katakanaOverview
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
        },
        {
          id: 'search',
          label: 'Search',
          href: appShellRoutes.search
        },
        {
          id: 'account',
          label: 'Account',
          href: appShellRoutes.account
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
              id: 'kana',
              title: 'Kana',
              links: [
                {
                  id: 'kana-mixed-review',
                  label: 'Mixed Review',
                  description: 'Open the combined kana review entry.',
                  href: appShellRoutes.hiraganaReview
                },
                {
                  id: 'kana-weak-items',
                  label: 'Weak Items',
                  description: 'Focus on the items that need extra work.',
                  href: appShellRoutes.hiraganaWeak
                },
                {
                  id: 'kana-confusables',
                  label: 'Confusables',
                  description: 'Practice commonly confused kana pairs.',
                  href: appShellRoutes.hiraganaConfusable
                }
              ]
            },
            {
              id: 'hiragana',
              title: 'Hiragana',
              links: [
                {
                  id: 'hiragana-weak-test',
                  label: 'Weak Review',
                  description: 'Check the weakest hiragana items.',
                  href: appShellRoutes.hiraganaWeak
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
                  id: 'katakana-weak-test',
                  label: 'Weak Review',
                  description: 'Check the weakest katakana items.',
                  href: appShellRoutes.katakanaWeak
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
          label: 'Play',
          groups: [
            {
              id: 'hiragana',
              title: 'Hiragana',
              links: [
                {
                  id: 'hiragana-play-overview',
                  label: 'Quick Start',
                  description: 'Enter the lightweight hiragana drill entry.',
                  href: appShellRoutes.hiraganaOverview
                }
              ]
            },
            {
              id: 'katakana',
              title: 'Katakana',
              links: [
                {
                  id: 'katakana-play-overview',
                  label: 'Quick Start',
                  description: 'Enter the lightweight katakana drill entry.',
                  href: appShellRoutes.katakanaOverview
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
        },
        {
          id: 'search',
          label: 'Search',
          href: appShellRoutes.search
        },
        {
          id: 'account',
          label: 'Account',
          href: appShellRoutes.account
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
