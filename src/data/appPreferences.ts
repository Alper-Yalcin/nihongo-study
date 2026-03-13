export type AppLanguage = 'tr' | 'en';
export type ThemeMode = 'light' | 'dark';

export const navbarLabels: Record<AppLanguage, Record<'overview' | 'hiragana' | 'katakana' | 'kanji' | 'settings', string>> = {
  tr: {
    overview: 'Genel Bakış',
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    kanji: 'Kanji',
    settings: 'Ayarlar'
  },
  en: {
    overview: 'Overview',
    hiragana: 'Hiragana',
    katakana: 'Katakana',
    kanji: 'Kanji',
    settings: 'Settings'
  }
};

export const languageMeta: Record<AppLanguage, { label: string; shortLabel: string }> = {
  tr: {
    label: 'Türkçe',
    shortLabel: 'TR'
  },
  en: {
    label: 'English',
    shortLabel: 'EN'
  }
};

export const themeLabels: Record<AppLanguage, Record<ThemeMode, string>> = {
  tr: {
    light: 'Gündüz',
    dark: 'Gece'
  },
  en: {
    light: 'Day',
    dark: 'Night'
  }
};
