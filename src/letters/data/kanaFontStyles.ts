import { AppLanguage } from '../../data/appPreferences';

export type KanaFontStyleId =
  | 'noto-sans-jp'
  | 'noto-serif-jp'
  | 'zen-maru-gothic'
  | 'kaisei-opti'
  | 'yomogi';

export interface KanaFontStyle {
  id: KanaFontStyleId;
  name: string;
  description: Record<AppLanguage, string>;
  fontFamily: string;
  preview: string;
}

export const kanaFontStyles: KanaFontStyle[] = [
  {
    id: 'noto-sans-jp',
    name: 'Noto Sans JP',
    description: {
      tr: 'G\u00fcnl\u00fck \u00e7al\u0131\u015fma i\u00e7in temiz ve ders kitab\u0131 hissi veren varsay\u0131lan stil.',
      en: 'Clean textbook-style default for everyday study.'
    },
    fontFamily: '"Noto Sans JP", sans-serif',
    preview: 'あ き さ ひ め り'
  },
  {
    id: 'noto-serif-jp',
    name: 'Noto Serif JP',
    description: {
      tr: 'Daha belirgin \u00e7izgi kontrast\u0131na sahip geleneksel serif formlar.',
      en: 'Traditional serif shapes with stronger stroke contrast.'
    },
    fontFamily: '"Noto Serif JP", serif',
    preview: 'あ き さ ひ め り'
  },
  {
    id: 'zen-maru-gothic',
    name: 'Zen Maru Gothic',
    description: {
      tr: 'Kana \u015fekillerini yumu\u015fatan yuvarlak ve yal\u0131n \u00e7izgiler.',
      en: 'Rounded strokes that soften the kana shapes.'
    },
    fontFamily: '"Zen Maru Gothic", sans-serif',
    preview: 'あ き さ ひ め り'
  },
  {
    id: 'kaisei-opti',
    name: 'Kaisei Opti',
    description: {
      tr: 'Bask\u0131 hissi veren, daha keskin kaligrafik gerilime sahip mincho stili.',
      en: 'Print-like mincho style with sharper calligraphic tension.'
    },
    fontFamily: '"Kaisei Opti", serif',
    preview: 'あ き さ ひ め り'
  },
  {
    id: 'yomogi',
    name: 'Yomogi',
    description: {
      tr: 'Daha g\u00fcndelik karakter formlar\u0131n\u0131 kar\u015f\u0131la\u015ft\u0131rmak i\u00e7in el yaz\u0131s\u0131 g\u00f6r\u00fcn\u00fcm\u00fc.',
      en: 'Handwritten look for comparing more casual glyph forms.'
    },
    fontFamily: '"Yomogi", cursive',
    preview: 'あ き さ ひ め り'
  }
];

export const defaultKanaFontStyleId: KanaFontStyleId = 'noto-sans-jp';
