export type AppLanguage = 'tr' | 'en';
export type ThemeMode = 'light' | 'dark';

export const navbarLabels: Record<AppLanguage, Record<'overview' | 'hiragana' | 'katakana' | 'kanji' | 'settings', string>> = {
  tr: {
    overview: 'Genel Bak\u0131\u015f',
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
    label: 'T\u00fcrk\u00e7e',
    shortLabel: 'TR'
  },
  en: {
    label: 'English',
    shortLabel: 'EN'
  }
};

export const themeLabels: Record<AppLanguage, Record<ThemeMode, string>> = {
  tr: {
    light: 'G\u00fcnd\u00fcz',
    dark: 'Gece'
  },
  en: {
    light: 'Day',
    dark: 'Night'
  }
};
