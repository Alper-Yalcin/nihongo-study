import { WordQuizMode, WordStudyMode } from '../../types';
import { AppLanguage } from '../../data/appPreferences';

interface WordStudyCopy {
  panelTitle: string;
  panelDescription: string;
  modes: Record<WordStudyMode, string>;
  modeDescriptions: Record<WordStudyMode, string>;
  prompts: Record<WordQuizMode, string>;
  placeholders: Record<WordQuizMode, string>;
  testPrompts: Record<WordQuizMode, string>;
  wordInputHint: string;
  tryAgain: string;
  backToDictionary: string;
  completedSummary: (count: number, modeLabel: string) => string;
}

export const wordStudyContent: Record<AppLanguage, WordStudyCopy> = {
  tr: {
    panelTitle: 'Cal\u0131\u015fma Modlar\u0131',
    panelDescription: 'Filtrelenen kelimeleri nas\u0131l \u00e7al\u0131\u015fmak istedi\u011fini se\u00e7.',
    modes: {
      wordToRomaji: 'Kelime -> Romaji',
      wordToMeaning: 'Kelime -> Anlam',
      meaningToWord: 'Anlam -> Kelime',
      test: 'Test Modu'
    },
    modeDescriptions: {
      wordToRomaji: 'Kelimeyi g\u00f6r, romajisini yaz.',
      wordToMeaning: 'Kelimeyi g\u00f6r, anlam\u0131n\u0131 yaz.',
      meaningToWord: 'Anlam\u0131 g\u00f6r, kelimeyi kana ya da romaji ile yaz.',
      test: 'Bu \u00fc\u00e7 y\u00f6n\u00fc kar\u0131\u015f\u0131k \u015fekilde \u00e7\u00f6z.'
    },
    prompts: {
      wordToRomaji: 'Romajiyi Yaz',
      wordToMeaning: 'Anlam\u0131 Yaz',
      meaningToWord: 'Kelimeyi Yaz'
    },
    placeholders: {
      wordToRomaji: 'romaji',
      wordToMeaning: 'anlam',
      meaningToWord: 'kana veya romaji'
    },
    testPrompts: {
      wordToRomaji: 'Romajiyi Se\u00e7',
      wordToMeaning: 'Anlam\u0131 Se\u00e7',
      meaningToWord: 'Kelimeyi Se\u00e7'
    },
    wordInputHint: 'Kana veya romaji kabul edilir.',
    tryAgain: 'Tekrar dene!',
    backToDictionary: 'S\u00f6zl\u00fc\u011fe D\u00f6n',
    completedSummary: (count, modeLabel) => `${modeLabel} modunda ${count} kelime tamamland\u0131.`
  },
  en: {
    panelTitle: 'Study Modes',
    panelDescription: 'Choose how to review the filtered words.',
    modes: {
      wordToRomaji: 'Word -> Romaji',
      wordToMeaning: 'Word -> Meaning',
      meaningToWord: 'Meaning -> Word',
      test: 'Test Mode'
    },
    modeDescriptions: {
      wordToRomaji: 'See the word and type its romaji.',
      wordToMeaning: 'See the word and type its meaning.',
      meaningToWord: 'See the meaning and type the word in kana or romaji.',
      test: 'Mix all three directions into one run.'
    },
    prompts: {
      wordToRomaji: 'Type the Romaji',
      wordToMeaning: 'Type the Meaning',
      meaningToWord: 'Type the Word'
    },
    placeholders: {
      wordToRomaji: 'romaji',
      wordToMeaning: 'meaning',
      meaningToWord: 'kana or romaji'
    },
    testPrompts: {
      wordToRomaji: 'Select the Romaji',
      wordToMeaning: 'Select the Meaning',
      meaningToWord: 'Select the Word'
    },
    wordInputHint: 'Kana or romaji is accepted.',
    tryAgain: 'Try again!',
    backToDictionary: 'Back to Dictionary',
    completedSummary: (count, modeLabel) => `You completed ${count} words in ${modeLabel} mode.`
  }
};
