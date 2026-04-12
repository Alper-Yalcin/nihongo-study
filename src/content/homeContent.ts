import { AppLanguage } from '../data/appPreferences';

type HomeShellAreaId = 'study' | 'test' | 'play';
type HomeCurrentSystemId = 'typing' | 'drawing' | 'listening' | 'dictionary';
type HomeFoundationId = 'learnPath' | 'reviewQueue' | 'weakItems' | 'confusables' | 'wordBridge';
type HomeScriptId = 'hiragana' | 'katakana' | 'kanji';

interface HomeShellArea {
  id: HomeShellAreaId;
  title: string;
  description: string;
  bullets: string[];
}

interface HomeCurrentSystem {
  id: HomeCurrentSystemId;
  title: string;
  description: string;
}

interface HomeFoundation {
  id: HomeFoundationId;
  title: string;
  description: string;
  badge: string;
}

interface HomeScriptCard {
  id: HomeScriptId;
  title: string;
  description: string;
  actionLabel: string;
  secondaryLabel: string;
}

interface HomeQuickStep {
  title: string;
  description: string;
}

interface HomeContent {
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    copy: string;
    primaryAction: string;
    secondaryAction: string;
  };
  shellSection: {
    eyebrow: string;
    title: string;
    description: string;
    areas: HomeShellArea[];
  };
  currentSystemsSection: {
    eyebrow: string;
    title: string;
    description: string;
    systems: HomeCurrentSystem[];
  };
  foundationSection: {
    eyebrow: string;
    title: string;
    description: string;
    items: HomeFoundation[];
  };
  scriptsSection: {
    eyebrow: string;
    title: string;
    description: string;
    cards: HomeScriptCard[];
  };
  quickStartSection: {
    eyebrow: string;
    title: string;
    description: string;
    steps: HomeQuickStep[];
  };
}

export const homeContent: Record<AppLanguage, HomeContent> = {
  tr: {
    hero: {
      eyebrow: 'Kotonoha Home',
      title: 'Kana calismasini urun gibi hissettiren giris katmani',
      lead: 'Typing, drawing, listening ve dictionary araclarini tek tek gostermek yerine; neye sahip oldugunu, nasil kullanacagini ve nereden baslaman gerektigini daha net anlatan yeni home sayfasi.',
      copy:
        'Bu ana sayfa sadece buton koleksiyonu degil. Study, Test ve Play alanlarini birbirine baglayan ust kabugu gosterir; hiragana, katakana ve ileride genisleyecek kanji alanlarina acik giris verir.',
      primaryAction: 'Hiragana ile basla',
      secondaryAction: 'Katakana alanini ac'
    },
    shellSection: {
      eyebrow: 'Urun Yapisi',
      title: 'Study, Test ve Play ayni shell icinde calisir',
      description:
        'Yeni navigation yapisi script sekmeleri yerine urun alanlari kullaniyor. Boylesi, kullanicinin once ne yapmak istedigini secmesini, sonra ilgili script alanina gecmesini sagliyor.',
      areas: [
        {
          id: 'study',
          title: 'Study',
          description: 'Genel girisler, overview ekranlari ve yonlendirilmis calisma alanlari burada toplanir.',
          bullets: ['overview girisleri', 'learn path girisleri', 'review queue girisleri']
        },
        {
          id: 'test',
          title: 'Test',
          description: 'Zayif itemler, confusable ciftleri ve ilerleme odakli kontrol alanlari bu kategoriye girer.',
          bullets: ['weak items', 'confusable drills', 'stats ve kontrol ekranlari']
        },
        {
          id: 'play',
          title: 'Play',
          description: 'Hafif, hizli ve tekrar agirlikli girisler buradan acilir. Sistem burada daha akiskan hissettirilir.',
          bullets: ['quick start girisleri', 'hafif drill akisleri', 'gelecek oyunlastirilmis yapilar']
        }
      ]
    },
    currentSystemsSection: {
      eyebrow: 'Bugun Elinde Olanlar',
      title: 'Mevcut araclar tek yerde toplanmis durumda',
      description:
        'Kotonoha zaten bos degil. Asil sorun arac eksikligi degil; bunlarin daha iyi anlatilmasi ve dogru giris noktalarina baglanmasi.',
      systems: [
        {
          id: 'typing',
          title: 'Typing',
          description: 'Kana tanima ve romaji uretme calismasi icin hizli, tekrarli ve olculebilir bir alan.'
        },
        {
          id: 'drawing',
          title: 'Drawing',
          description: 'Stroke rehberi, cizim evaluator ve hafizadan yazma akislari ile degerli teknik temel.'
        },
        {
          id: 'listening',
          title: 'Listening',
          description: 'Karakter ve kelime seslerine dayali tanima akisi. Kana calismasini sadece gorsele bagli bir egzersiz olmaktan cikarir.'
        },
        {
          id: 'dictionary',
          title: 'Dictionary',
          description: 'Kelime havuzlari, arama ve quiz akislarini besleyen referans katmani.'
        }
      ]
    },
    foundationSection: {
      eyebrow: 'Rebuild Omurgasi',
      title: 'Sadece arac degil, yonlendiren ogrenme sistemi',
      description:
        'Bu rebuild ile hedeflenen esas fark burada. Home sayfasi, yalnizca mevcut modlari gostermek yerine urunun hangi ogrenme mantigina dogru gittigini de aciklamali.',
      items: [
        {
          id: 'learnPath',
          title: 'Learn Path',
          description: 'Yeni karakterleri kontrollu sirayla acan ve kullaniciya ilk adimi veren katman.',
          badge: 'Next'
        },
        {
          id: 'reviewQueue',
          title: 'Review Queue',
          description: 'Due item mantigi ile tekrar bekleyen karakterleri geri getiren ana review omurgasi.',
          badge: 'Next'
        },
        {
          id: 'weakItems',
          title: 'Weak Items',
          description: 'Hangi karakterde ve hangi modda zorlandigini ayrik sekilde gosteren katman.',
          badge: 'Next'
        },
        {
          id: 'confusables',
          title: 'Confusables',
          description: 'Birbirine benzeyen kana ciftlerini ayri drill olarak ele alan hedefli test alanlari.',
          badge: 'Next'
        },
        {
          id: 'wordBridge',
          title: 'Word Bridge',
          description: 'Tek tek karakter bilgisini kolay kelimelere baglayarak soyut ezberi kirar.',
          badge: 'Next'
        }
      ]
    },
    scriptsSection: {
      eyebrow: 'Script Girisleri',
      title: 'Hangi script ile calisacagini sec, sonra ilgili akisa gir',
      description:
        'Home, script secimini saklamaz. Aksine, hiragana ve katakana icin acik giris verir; kanji icin de shell icinde placeholder bir alan sunar.',
      cards: [
        {
          id: 'hiragana',
          title: 'Hiragana',
          description: 'Temel kana calismasi, tablo girisi ve mevcut modlara erisim icin ana giris.',
          actionLabel: 'Hiragana overview',
          secondaryLabel: 'Study girisine git'
        },
        {
          id: 'katakana',
          title: 'Katakana',
          description: 'Ozellikle loanword ve hizli tanima calismalari icin ikinci ana script alani.',
          actionLabel: 'Katakana overview',
          secondaryLabel: 'Play girisine git'
        },
        {
          id: 'kanji',
          title: 'Kanji',
          description: 'Yeni shell ile uyumlu placeholder alan. Ayrintili urun akisi daha sonra genisleyecek.',
          actionLabel: 'Kanji placeholder',
          secondaryLabel: 'Sonraki fazlara hazir'
        }
      ]
    },
    quickStartSection: {
      eyebrow: 'Hizli Baslangic',
      title: 'Bugun ilk kez giren biri ne yapmali?',
      description:
        'Ana sayfa, kullaniciyi rastgele moda atmak yerine mantikli bir ilk rota verebilmeli.',
      steps: [
        {
          title: '1. Script sec',
          description: 'Hiragana veya katakana overview girisine gecerek tabloyu ve mevcut araclari ayni yerden gor.'
        },
        {
          title: '2. Study ile basla',
          description: 'Ilk oturum icin overview veya study girislerini kullan; bilgi alani ile aksiyon alani ayri kalsin.'
        },
        {
          title: '3. Sonra test et',
          description: 'Zamanla weak items, confusables ve review queue alanlari bu shell icinde daha net rol alacak.'
        }
      ]
    }
  },
  en: {
    hero: {
      eyebrow: 'Kotonoha Home',
      title: 'A real entry layer for kana study',
      lead: 'Instead of exposing typing, drawing, listening, and dictionary as isolated tools, this home page explains what the product has, how it is organized, and where to begin.',
      copy:
        'The goal is not another button grid. It is a clearer shell for Study, Test, and Play, with direct entry points into hiragana, katakana, and the placeholder kanji area.',
      primaryAction: 'Start with hiragana',
      secondaryAction: 'Open katakana'
    },
    shellSection: {
      eyebrow: 'Product Shell',
      title: 'Study, Test, and Play now sit inside one shell',
      description:
        'The new navigation model uses product areas instead of raw script tabs. That helps users decide what they want to do first, then move into the right script area.',
      areas: [
        {
          id: 'study',
          title: 'Study',
          description: 'Primary entries, overview screens, and guided study routes belong here.',
          bullets: ['overview entries', 'learn path entries', 'review queue entries']
        },
        {
          id: 'test',
          title: 'Test',
          description: 'Weak items, confusable pairs, and progress-focused checks belong in this category.',
          bullets: ['weak items', 'confusable drills', 'stats and control screens']
        },
        {
          id: 'play',
          title: 'Play',
          description: 'Lighter and faster repeat-heavy entries live here. This category keeps the product feeling more fluid.',
          bullets: ['quick start entries', 'light drill flows', 'future gamified layers']
        }
      ]
    },
    currentSystemsSection: {
      eyebrow: 'What Exists Today',
      title: 'The current toolset already has substance',
      description:
        'Kotonoha is not empty. The main problem is not missing tools; it is that the tools need better explanation and better entry points.',
      systems: [
        {
          id: 'typing',
          title: 'Typing',
          description: 'A fast and measurable area for kana recognition and romaji production.'
        },
        {
          id: 'drawing',
          title: 'Drawing',
          description: 'A valuable technical foundation with stroke guidance, evaluator logic, and memory-based writing.'
        },
        {
          id: 'listening',
          title: 'Listening',
          description: 'An audio-based recognition flow that keeps kana study from becoming purely visual.'
        },
        {
          id: 'dictionary',
          title: 'Dictionary',
          description: 'The reference layer that feeds word pools, search, and quiz flows.'
        }
      ]
    },
    foundationSection: {
      eyebrow: 'Rebuild Direction',
      title: 'The product is moving toward guided learning',
      description:
        'The real upgrade is not another mode. It is a clearer learning system. This home page should explain that direction as well as the current tools.',
      items: [
        {
          id: 'learnPath',
          title: 'Learn Path',
          description: 'A layer that opens new characters in a controlled sequence and gives the user an actual first step.',
          badge: 'Next'
        },
        {
          id: 'reviewQueue',
          title: 'Review Queue',
          description: 'A due-item system that brings forgotten items back into the study loop.',
          badge: 'Next'
        },
        {
          id: 'weakItems',
          title: 'Weak Items',
          description: 'A layer that makes it clear which characters are weak and in which mode they are weak.',
          badge: 'Next'
        },
        {
          id: 'confusables',
          title: 'Confusables',
          description: 'Targeted drills for kana pairs that users repeatedly mix up.',
          badge: 'Next'
        },
        {
          id: 'wordBridge',
          title: 'Word Bridge',
          description: 'A bridge from isolated character knowledge into actual easy vocabulary.',
          badge: 'Next'
        }
      ]
    },
    scriptsSection: {
      eyebrow: 'Script Entry',
      title: 'Pick the script first, then move into the right flow',
      description:
        'Home should not hide script choice. It should make hiragana and katakana obvious while still exposing kanji as a shell-aligned placeholder.',
      cards: [
        {
          id: 'hiragana',
          title: 'Hiragana',
          description: 'Primary entry for the core kana table, script overview, and current learning tools.',
          actionLabel: 'Hiragana overview',
          secondaryLabel: 'Go to Study entry'
        },
        {
          id: 'katakana',
          title: 'Katakana',
          description: 'The second main script area, especially useful for loanwords and fast recognition work.',
          actionLabel: 'Katakana overview',
          secondaryLabel: 'Go to Play entry'
        },
        {
          id: 'kanji',
          title: 'Kanji',
          description: 'A placeholder area that already fits the new shell and will be expanded later.',
          actionLabel: 'Kanji placeholder',
          secondaryLabel: 'Reserved for later phases'
        }
      ]
    },
    quickStartSection: {
      eyebrow: 'Quick Start',
      title: 'What should a first-time user do today?',
      description:
        'The home page should not drop the user into a random mode. It should provide a sane first path.',
      steps: [
        {
          title: '1. Choose a script',
          description: 'Open the hiragana or katakana overview to see the table and the current toolset from one place.'
        },
        {
          title: '2. Start through Study',
          description: 'Use the overview or study entries first so explanation and action stay separate.'
        },
        {
          title: '3. Move into testing later',
          description: 'Over time, weak items, confusables, and review queue entries will become the cleaner testing layer.'
        }
      ]
    }
  }
};
