// Extracted from normal logo assets in public/logo (light and dark variants).
// Values are grouped as raw swatches and semantic tokens for project theming.

export const logoPalette = {
  raw: {
    sakuraPink: '#D06070',
    sakuraPinkDeep: '#C05060',
    sakuraPinkSoft: '#D07080',
    sakuraBlush: '#FFE0E0',
    sakuraMist: '#FFF0F0',
    inkCharcoal: '#343432',
    inkSoft: '#404040',
    logoLight: '#F1F2F6',
    pureWhite: '#FFFFFF'
  },
  scale: {
    ink: {
      50: '#FDFCFC',
      100: '#F6F3F4',
      200: '#ECE5E7',
      300: '#DCD0D3',
      400: '#B8A9AE',
      500: '#8A7F85',
      600: '#6F6368',
      700: '#564C51',
      800: '#41393D',
      900: '#343432',
      950: '#242325'
    },
    sakura: {
      50: '#FFF5F6',
      100: '#FFE8EC',
      200: '#FFD4DC',
      300: '#F8B3BF',
      400: '#E88B9C',
      500: '#D06070',
      600: '#C05060',
      700: '#A54553',
      800: '#863946',
      900: '#652F38'
    }
  },
  semantic: {
    brandPrimary: '#D06070',
    brandPrimaryHover: '#C05060',
    brandPrimarySoft: '#FFE0E0',
    accent: '#D07080',
    textOnLight: '#343432',
    textOnDark: '#F1F2F6',
    darkBackground: '#1F1B20',
    darkSurface: '#2A252B',
    darkElevated: '#352F37',
    darkBorder: '#4A414C',
    strokeGuidePrimary: '#D06070',
    strokeGuideSecondary: '#C05060',
    strokeGuideTertiary: '#A8616F',
    strokeGuideQuaternary: '#E08B97',
    borderSubtle: '#F1F2F6',
    surfaceTint: '#FFF0F0'
  }
} as const;
