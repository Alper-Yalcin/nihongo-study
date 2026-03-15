import { KanaSection } from '../types';
import { AppLanguage } from './appPreferences';
import { hiraganaSections, katakanaSections } from './kana';

type StudyVariant = 'typing' | 'drawing' | 'listening';
type WordMode = 'typing' | 'test';

interface StudyContent {
  views: Record<'typing' | 'drawing' | 'listening' | 'dictionary', string>;
  common: {
    previous: string;
    next: string;
    close: string;
    correct: string;
    wrong: string;
    accuracy: string;
    time: string;
    best: string;
    playAgain: string;
    restartRun: string;
    newBestScore: string;
    correctWrongSummary: (correct: number, wrong: number) => string;
  };
  selection: {
    instruction: string;
    all: string;
    none: string;
    summary: (groups: number, characters: number) => string;
    startTyping: string;
    startDrawing: string;
    typingStudyTitle: string;
    drawingStudyTitle: string;
    backToSelection: string;
  };
  studyRun: {
    placeholder: string;
    backToSelection: string;
  };
  drawing: {
    practiceMode: string;
    testMode: string;
    practice: string;
    draw: string;
    correctFeedback: string;
    wrongFeedback: string;
    clear: string;
    check: string;
    numbers: string;
    arrows: string;
    template: string;
    backToSelection: string;
  };
  result: {
    runCompleted: string;
    completedSummary: (variant: StudyVariant, count: number) => string;
  };
  dictionary: {
    sectionDescription: (title: string) => string;
    jlptLevels: string;
    filterDescription: string;
    wordCount: (count: number) => string;
    all: string;
    searchPlaceholder: string;
    showingResults: (from: number, to: number, total: number) => string;
    pageLabel: (current: number, total: number) => string;
    questions: string;
    maxLabel: (count: number) => string;
    startTyping: string;
    startTest: string;
    needAtLeastWords: (count: number) => string;
  };
  wordTable: {
    level: string;
    kana: string;
    romaji: string;
    meaning: string;
    empty: string;
  };
  wordTyping: {
    prompt: string;
    placeholder: string;
    tryAgain: string;
    backToDictionary: string;
  };
  wordTest: {
    selectRomaji: string;
    selectKana: string;
    backToDictionary: string;
  };
  wordResult: {
    completedSummary: (count: number, mode: WordMode) => string;
  };
  listening: {
    sectionDescription: (title: string) => string;
    clickHint: string;
    characters: string;
    words: string;
    questions: string;
    itemsSummary: (selected: number, total: number) => string;
    practice: string;
    test: string;
    practiceTitle: string;
    testTitle: string;
    placeholder: string;
    tryAgain: string;
    showAnswer: string;
    correctAnswer: string;
    back: string;
  };
  audio: {
    play: string;
    unavailable: string;
  };
}

interface KanjiSectionCopy {
  id: string;
  title: string;
  description: string;
}

interface KanjiPageContent {
  pageTitle: string;
  cardTitle: string;
  cardDescription: string;
  placeholder: string;
  sections: KanjiSectionCopy[];
}

const kanaSectionCopy: Record<
  'hiragana' | 'katakana',
  Record<string, Record<AppLanguage, { title: string; description: string }>>
> = {
  hiragana: {
    'hiragana-single': {
      tr: {
        title: 'Tekli Karakterler',
        description: 'Japoncada yerel kelimelerde kullanılan temel fonetik yazı sistemi.'
      },
      en: {
        title: 'Single Characters',
        description: 'The basic Japanese phonetic script, used for native Japanese words.'
      }
    },
    'hiragana-double': {
      tr: {
        title: 'Birleşik Karakterler',
        description: 'Ya, yu ve yo ile kurulan birleşik karakterler.'
      },
      en: {
        title: 'Double Characters',
        description: 'Combinations of characters with ya, yu, yo.'
      }
    }
  },
  katakana: {
    'katakana-single': {
      tr: {
        title: 'Tekli Karakterler',
        description: 'Yabancı kökenli kelimeler, yansıma sözcükler ve vurgu için sık kullanılır.'
      },
      en: {
        title: 'Single Characters',
        description: 'Used primarily for foreign loanwords, onomatopoeia, and emphasis.'
      }
    },
    'katakana-double': {
      tr: {
        title: 'Birleşik Karakterler',
        description: 'Ya, yu ve yo ile kurulan birleşik karakterler.'
      },
      en: {
        title: 'Double Characters',
        description: 'Combinations of characters with ya, yu, yo.'
      }
    },
    'katakana-extended': {
      tr: {
        title: 'Genişletilmiş Karakterler',
        description: 'Yabancı sesleri daha doğru yazmak için kullanılan modern ek karakterler.'
      },
      en: {
        title: 'Extended Characters',
        description: 'Modern additions for more accurate foreign sound representation.'
      }
    }
  }
};

const localizeSections = (
  sections: KanaSection[],
  scope: 'hiragana' | 'katakana',
  language: AppLanguage
) =>
  sections.map((section) => {
    const copy = kanaSectionCopy[scope][section.id]?.[language];

    if (!copy) {
      return section;
    }

    return {
      ...section,
      title: copy.title,
      description: copy.description
    };
  });

export const getLocalizedHiraganaSections = (language: AppLanguage): KanaSection[] =>
  localizeSections(hiraganaSections, 'hiragana', language);

export const getLocalizedKatakanaSections = (language: AppLanguage): KanaSection[] =>
  localizeSections(katakanaSections, 'katakana', language);

export const studyContent: Record<AppLanguage, StudyContent> = {
  tr: {
    views: {
      typing: 'Yazma',
      drawing: 'Çizim',
      listening: 'Dinleme',
      dictionary: 'Sözlük'
    },
    common: {
      previous: 'Önceki',
      next: 'Sonraki',
      close: 'Kapat',
      correct: 'Doğru',
      wrong: 'Yanlış',
      accuracy: 'Doğruluk',
      time: 'Süre',
      best: 'En iyi',
      playAgain: 'Tekrar Oyna',
      restartRun: 'Turu Yeniden Başlat',
      newBestScore: 'Yeni En İyi Skor!',
      correctWrongSummary: (correct, wrong) => `${correct} doğru, ${wrong} yanlış`
    },
    selection: {
      instruction: 'Çalışmak için bir sütundaki herhangi bir karaktere tıklayıp seçimi açıp kapat.',
      all: 'Tümü',
      none: 'Hiçbiri',
      summary: (groups, characters) => `${groups} sütun / ${characters} karakter`,
      startTyping: 'Yazma',
      startDrawing: 'Çizim',
      typingStudyTitle: 'Yazma Çalışması',
      drawingStudyTitle: 'Çizim Çalışması',
      backToSelection: 'Seçime Dön'
    },
    studyRun: {
      placeholder: 'Romaji yaz...',
      backToSelection: 'Seçime Dön'
    },
    drawing: {
      practiceMode: 'Pratik Modu',
      testMode: 'Test Modu',
      practice: 'Pratik',
      draw: 'Çiz',
      correctFeedback: 'Doğru!',
      wrongFeedback: 'Tekrar Dene',
      clear: 'Temizle',
      check: 'Kontrol Et',
      numbers: 'Numaralar',
      arrows: 'Oklar',
      template: 'Şablon',
      backToSelection: 'Seçime Dön'
    },
    result: {
      runCompleted: 'Tur Tamamlandı!',
      completedSummary: (variant, count) => {
        if (variant === 'drawing') return `${count} karakter çizildi.`;
        if (variant === 'listening') return `${count} dinleme öğesi tamamlandı.`;
        return `${count} karakter tamamlandı.`;
      }
    },
    dictionary: {
      sectionDescription: (title) => `${title} kelimelerini JLPT seviyesine göre incele ve çalış.`,
      jlptLevels: 'JLPT Seviyeleri',
      filterDescription: 'Sözlüğü ve çalışma modlarını seviyeye göre filtrele.',
      wordCount: (count) => `${count} kelime`,
      all: 'Tümü',
      searchPlaceholder: 'Kana, romaji, anlam veya seviye ara...',
      showingResults: (from, to, total) => `${from} - ${to} / ${total} kelime gösteriliyor`,
      pageLabel: (current, total) => `Sayfa ${current} / ${total}`,
      questions: 'Soru Sayısı',
      maxLabel: (count) => `/ ${count} maks`,
      startTyping: 'Yazmayı Başlat',
      startTest: 'Testi Başlat',
      needAtLeastWords: (count) => `En az ${count} kelime gerekli`
    },
    wordTable: {
      level: 'Seviye',
      kana: 'Kana',
      romaji: 'Romaji',
      meaning: 'Anlam',
      empty: 'Kelime bulunamadı.'
    },
    wordTyping: {
      prompt: 'Romajiyi Yaz',
      placeholder: 'romaji',
      tryAgain: 'Tekrar dene!',
      backToDictionary: 'Sözlüğe Dön'
    },
    wordTest: {
      selectRomaji: 'Romajiyi Seç',
      selectKana: 'Kana Seç',
      backToDictionary: 'Sözlüğe Dön'
    },
    wordResult: {
      completedSummary: (count, mode) =>
        `${mode === 'typing' ? 'Yazma' : 'Test'} modunda ${count} kelime tamamlandı.`
    },
    listening: {
      sectionDescription: (title) => `${title} için dinleme pratiğini geliştir.`,
      clickHint: 'Dinleme kartını açmak için herhangi bir karaktere tıkla.',
      characters: 'Karakterler',
      words: 'Kelimeler',
      questions: 'Sorular',
      itemsSummary: (selected, total) => `${selected} öğe / ${total} toplam`,
      practice: 'Pratik',
      test: 'Test',
      practiceTitle: 'Dinleme Pratiği',
      testTitle: 'Dinleme Testi',
      placeholder: 'Romaji yaz...',
      tryAgain: 'Tekrar Dene',
      showAnswer: 'Cevabı Göster',
      correctAnswer: 'Doğru Cevap',
      back: 'Dinleme listesine dön'
    },
    audio: {
      play: 'Sesi oynat',
      unavailable: 'Ses mevcut değil'
    }
  },
  en: {
    views: {
      typing: 'Typing',
      drawing: 'Drawing',
      listening: 'Listening',
      dictionary: 'Dictionary'
    },
    common: {
      previous: 'Previous',
      next: 'Next',
      close: 'Close',
      correct: 'Correct',
      wrong: 'Wrong',
      accuracy: 'Accuracy',
      time: 'Time',
      best: 'Best',
      playAgain: 'Play Again',
      restartRun: 'Restart Run',
      newBestScore: 'New Best Score!',
      correctWrongSummary: (correct, wrong) => `${correct} correct, ${wrong} wrong`
    },
    selection: {
      instruction: 'Click on any character in a column to select or deselect it for study.',
      all: 'All',
      none: 'None',
      summary: (groups, characters) => `${groups} cols / ${characters} chars`,
      startTyping: 'Typing',
      startDrawing: 'Drawing',
      typingStudyTitle: 'Typing Study',
      drawingStudyTitle: 'Drawing Study',
      backToSelection: 'Back to Selection'
    },
    studyRun: {
      placeholder: 'Type romaji...',
      backToSelection: 'Back to Selection'
    },
    drawing: {
      practiceMode: 'Practice Mode',
      testMode: 'Test Mode',
      practice: 'Practice',
      draw: 'Draw',
      correctFeedback: 'Correct!',
      wrongFeedback: 'Try Again',
      clear: 'Clear',
      check: 'Check',
      numbers: 'Numbers',
      arrows: 'Arrows',
      template: 'Template',
      backToSelection: 'Back to Selection'
    },
    result: {
      runCompleted: 'Run Completed!',
      completedSummary: (variant, count) => {
        if (variant === 'drawing') return `You drew ${count} characters.`;
        if (variant === 'listening') return `You completed ${count} listening items.`;
        return `You studied ${count} characters.`;
      }
    },
    dictionary: {
      sectionDescription: (title) => `Browse and study ${title} vocabulary by JLPT level.`,
      jlptLevels: 'JLPT Levels',
      filterDescription: 'Filter the dictionary and study modes by level.',
      wordCount: (count) => `${count} words`,
      all: 'All',
      searchPlaceholder: 'Search kana, romaji, meaning, or level...',
      showingResults: (from, to, total) => `Showing ${from} to ${to} of ${total} words`,
      pageLabel: (current, total) => `Page ${current} / ${total}`,
      questions: 'Questions',
      maxLabel: (count) => `/ ${count} max`,
      startTyping: 'Start Typing',
      startTest: 'Start Test',
      needAtLeastWords: (count) => `Need at least ${count} words`
    },
    wordTable: {
      level: 'Level',
      kana: 'Kana',
      romaji: 'Romaji',
      meaning: 'Meaning',
      empty: 'No words found.'
    },
    wordTyping: {
      prompt: 'Type the Romaji',
      placeholder: 'romaji',
      tryAgain: 'Try again!',
      backToDictionary: 'Back to Dictionary'
    },
    wordTest: {
      selectRomaji: 'Select Romaji',
      selectKana: 'Select Kana',
      backToDictionary: 'Back to Dictionary'
    },
    wordResult: {
      completedSummary: (count, mode) => `You studied ${count} words in ${mode} mode.`
    },
    listening: {
      sectionDescription: (title) => `Improve your listening skills for ${title}.`,
      clickHint: 'Click on any character to open its listening card.',
      characters: 'Characters',
      words: 'Words',
      questions: 'Questions',
      itemsSummary: (selected, total) => `${selected} items / ${total} total`,
      practice: 'Practice',
      test: 'Test',
      practiceTitle: 'Listening Practice',
      testTitle: 'Listening Test',
      placeholder: 'Type romaji...',
      tryAgain: 'Try Again',
      showAnswer: 'Show Answer',
      correctAnswer: 'Correct Answer',
      back: 'Back to listening list'
    },
    audio: {
      play: 'Play audio',
      unavailable: 'Audio not available'
    }
  }
};

export const kanjiContent: Record<AppLanguage, KanjiPageContent> = {
  tr: {
    pageTitle: 'Kanji',
    cardTitle: 'Kanji Çalışması',
    cardDescription: 'Japoncada kullanılan Çince kökenli karakterleri çalış.',
    placeholder: 'Kanji verileri burada gösterilecek',
    sections: [
      {
        id: 'beginner',
        title: 'Başlangıç Kanji',
        description: 'Günlük kullanım için temel karakterler (JLPT N5-N4).'
      },
      {
        id: 'intermediate',
        title: 'Orta Seviye Kanji',
        description: 'Okuma ve yazma için daha karmaşık karakterler (JLPT N3-N2).'
      },
      {
        id: 'advanced',
        title: 'İleri Seviye Kanji',
        description: 'Akıcılık için ileri düzey karakterler (JLPT N1).'
      }
    ]
  },
  en: {
    pageTitle: 'Kanji',
    cardTitle: 'Kanji Study',
    cardDescription: 'Study Chinese characters used in Japanese.',
    placeholder: 'Kanji data will be added here',
    sections: [
      {
        id: 'beginner',
        title: 'Beginner Kanji',
        description: 'Essential characters for everyday use (JLPT N5-N4).'
      },
      {
        id: 'intermediate',
        title: 'Intermediate Kanji',
        description: 'More complex characters for reading and writing (JLPT N3-N2).'
      },
      {
        id: 'advanced',
        title: 'Advanced Kanji',
        description: 'Advanced characters for fluency (JLPT N1).'
      }
    ]
  }
};
