export type KanaFontStyleId =
  | 'noto-sans-jp'
  | 'noto-serif-jp'
  | 'zen-maru-gothic'
  | 'kaisei-opti'
  | 'yomogi';

export interface KanaFontStyle {
  id: KanaFontStyleId;
  name: string;
  description: string;
  fontFamily: string;
  preview: string;
}

export const kanaFontStyles: KanaFontStyle[] = [
  {
    id: 'noto-sans-jp',
    name: 'Noto Sans JP',
    description: 'Clean textbook-style default for everyday study.',
    fontFamily: '"Noto Sans JP", sans-serif',
    preview: 'あ き さ ひ め り'
  },
  {
    id: 'noto-serif-jp',
    name: 'Noto Serif JP',
    description: 'Traditional serif shapes with stronger stroke contrast.',
    fontFamily: '"Noto Serif JP", serif',
    preview: 'あ き さ ひ め り'
  },
  {
    id: 'zen-maru-gothic',
    name: 'Zen Maru Gothic',
    description: 'Rounded strokes that soften the kana shapes.',
    fontFamily: '"Zen Maru Gothic", sans-serif',
    preview: 'あ き さ ひ め り'
  },
  {
    id: 'kaisei-opti',
    name: 'Kaisei Opti',
    description: 'Print-like mincho style with sharper calligraphic tension.',
    fontFamily: '"Kaisei Opti", serif',
    preview: 'あ き さ ひ め り'
  },
  {
    id: 'yomogi',
    name: 'Yomogi',
    description: 'Handwritten look for comparing more casual glyph forms.',
    fontFamily: '"Yomogi", cursive',
    preview: 'あ き さ ひ め り'
  }
];

export const defaultKanaFontStyleId: KanaFontStyleId = 'noto-sans-jp';
