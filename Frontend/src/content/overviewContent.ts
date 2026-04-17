import { AppLanguage } from '../data/appPreferences';

interface OverviewFeatureCardCopy {
  title: string;
  description: string;
}

interface OverviewFeatureSectionCopy {
  badge: string;
  title: string;
  description: string;
  features: string[];
  imageAlt: string;
  fallbackTitle: string;
  fallbackPath: string;
}

type OverviewDictionarySectionCopy = OverviewFeatureSectionCopy;
type OverviewTypingSectionCopy = OverviewFeatureSectionCopy;
type OverviewDrawingSectionCopy = OverviewFeatureSectionCopy;
type OverviewListeningSectionCopy = OverviewFeatureSectionCopy;

interface OverviewContent {
  pageTitle: string;
  hero: {
    title: string;
    lead: string;
    copy: string;
    primaryAction: string;
    secondaryAction: string;
  };
  featureCards: OverviewFeatureCardCopy[];
  typingSection: OverviewTypingSectionCopy;
  drawingSection: OverviewDrawingSectionCopy;
  listeningSection: OverviewListeningSectionCopy;
  dictionarySection: OverviewDictionarySectionCopy;
}

export const overviewContent: Record<AppLanguage, OverviewContent> = {
  tr: {
    pageTitle: 'Genel Bakış',
    hero: {
      title: 'Japonca Kana Çalışma Uygulaması',
      lead: 'Hiragana ve katakana pratiğini typing, drawing, listening ve dictionary egzersizleriyle yap.',
      copy:
        'Bu uygulama, yazma alıştırmaları, el yazısı pratiği, dinleme çalışmaları ve kelime quizleri dahil olmak üzere birden fazla etkileşimli çalışma yöntemiyle Japonca kana öğrenmene yardımcı olur.',
      primaryAction: 'Hiragana Çalışmasına Başla',
      secondaryAction: 'Katakana Çalışmasına Başla'
    },
    featureCards: [
      {
        title: 'Kana Typing',
        description:
          'Romaji karşılıklarını yazarak kana okuma pratiği yap. Tanıma hızını ve doğruluğunu geliştir.'
      },
      {
        title: 'Çizim Pratiği',
        description:
          'Etkileşimli tuval üzerinde kana karakterlerini çizerek doğru stroke sırasını öğren.'
      },
      {
        title: 'Dinleme Pratiği',
        description:
          'Karakter ve kelime seslerini dinleyerek romaji eşleştirme ve ayırt etme becerini geliştir.'
      },
      {
        title: 'Sözlük ve Kelime Testi',
        description:
          'Aranabilir sözlükler üzerinden kelime çalış ve typing ile çoktan seçmeli test modlarında kendini dene.'
      }
    ],
    typingSection: {
      badge: 'Çalışma Modu',
      title: 'Kana Typing Pratiği',
      description:
        'Japonca karakterleri romaji karşılıklarını yazarak tanıma pratiği yap. Karakter gruplarını seç ve tanıma hızını test et.',
      features: [
        'Rastgele sorular',
        'Anlık yazım doğrulaması',
        'Doğruluk istatistikleri',
        'Sayaç ve en iyi skor takibi'
      ],
      imageAlt: 'Typing pratiği demosu',
      fallbackTitle: 'Typing Demo GIF',
      fallbackPath: '/public/gifs/typing-demo.gif'
    },
    drawingSection: {
      badge: 'Çalışma Modu',
      title: 'Kana Çizim Pratiği',
      description:
        'Etkileşimli tuval üzerinde Japonca kana yazma pratiği yap. Stroke sırasını öğrenmek için karakterlerin üzerinden geç veya test modunda hafızadan çiz.',
      features: [
        'Kılavuz üzerinden çizim',
        'Stroke sırası rehberi',
        'Alıştırma modu',
        'Hafızadan test modu'
      ],
      imageAlt: 'Çizim pratiği demosu',
      fallbackTitle: 'Drawing Demo GIF',
      fallbackPath: '/public/gifs/drawing-demo.gif'
    },
    listeningSection: {
      badge: 'Çalışma Modu',
      title: 'Kana Dinleme Pratiği',
      description:
        'Kana karakterlerini ve kelimeleri dinleyerek romaji karşılıklarını tahmin et. Karakter ve kelime veri setleri arasında geçiş yaparak duyduğunu daha hızlı ayırt et.',
      features: [
        'Karakter ve kelime modu',
        'Pratik ve test akışı',
        'Ses tekrar oynatma',
        'Romaji cevap doğrulaması'
      ],
      imageAlt: 'Dinleme pratiği demosu',
      fallbackTitle: 'Listening Demo GIF',
      fallbackPath: '/public/gifs/listening-demo.gif'
    },
    dictionarySection: {
      badge: 'Çalışma Modu',
      title: 'Kana Kelime Sözlüğü',
      description:
        'Hiragana ve katakana kelime listelerini gez. Kelime ara, romaji okumalarını incele ve typing ile test modlarında kendini dene.',
      features: [
        'Aranabilir sözlük',
        'Sayfalama',
        'Typing testi',
        'Çoktan seçmeli test'
      ],
      imageAlt: 'Sözlük çalışma demosu',
      fallbackTitle: 'Dictionary Demo GIF',
      fallbackPath: '/public/gifs/dictionary-demo.gif'
    }
  },
  en: {
    pageTitle: 'Overview',
    hero: {
      title: 'Japanese Kana Study App',
      lead: 'Practice Hiragana and Katakana with typing, drawing, listening, and dictionary exercises.',
      copy:
        'This application helps you learn Japanese kana through multiple interactive study methods including typing exercises, handwriting practice, listening drills, and vocabulary quizzes.',
      primaryAction: 'Start Hiragana Study',
      secondaryAction: 'Start Katakana Study'
    },
    featureCards: [
      {
        title: 'Kana Typing',
        description:
          'Practice reading kana by typing their romaji equivalents. Improve your recognition speed and accuracy.'
      },
      {
        title: 'Drawing Practice',
        description:
          'Learn the correct stroke order by tracing and drawing kana characters on an interactive canvas.'
      },
      {
        title: 'Listening Practice',
        description:
          'Improve recognition by listening to kana characters and words, then matching them to romaji.'
      },
      {
        title: 'Dictionary & Word Quiz',
        description:
          'Study vocabulary using searchable dictionaries and test yourself with typing and multiple-choice quiz modes.'
      }
    ],
    typingSection: {
      badge: 'Study Mode',
      title: 'Kana Typing Practice',
      description:
        'Practice identifying Japanese characters by typing their romaji equivalents. Select character groups and test your recognition speed.',
      features: [
        'Randomized questions',
        'Real-time typing validation',
        'Accuracy statistics',
        'Timer and best score tracking'
      ],
      imageAlt: 'Typing practice demo',
      fallbackTitle: 'Typing Demo GIF',
      fallbackPath: '/public/gifs/typing-demo.gif'
    },
    drawingSection: {
      badge: 'Study Mode',
      title: 'Kana Drawing Practice',
      description:
        'Practice writing Japanese kana using the interactive canvas. Trace characters to learn stroke order or draw them from memory in test mode.',
      features: [
        'Guided tracing practice',
        'Stroke order support',
        'Practice mode',
        'Memory-based test mode'
      ],
      imageAlt: 'Drawing practice demo',
      fallbackTitle: 'Drawing Demo GIF',
      fallbackPath: '/public/gifs/drawing-demo.gif'
    },
    listeningSection: {
      badge: 'Study Mode',
      title: 'Kana Listening Practice',
      description:
        'Listen to kana characters and vocabulary, then type the romaji you hear. Switch between character and word datasets to sharpen recognition.',
      features: [
        'Character and word modes',
        'Practice and test flows',
        'Replayable audio prompts',
        'Romaji answer validation'
      ],
      imageAlt: 'Listening practice demo',
      fallbackTitle: 'Listening Demo GIF',
      fallbackPath: '/public/gifs/listening-demo.gif'
    },
    dictionarySection: {
      badge: 'Study Mode',
      title: 'Kana Vocabulary Dictionary',
      description:
        'Browse hiragana and katakana vocabulary lists. Search words, explore romaji readings, and test yourself with typing and quiz modes.',
      features: [
        'Searchable dictionary',
        'Pagination',
        'Typing quiz',
        'Multiple choice test'
      ],
      imageAlt: 'Dictionary study demo',
      fallbackTitle: 'Dictionary Demo GIF',
      fallbackPath: '/public/gifs/dictionary-demo.gif'
    }
  }
};
