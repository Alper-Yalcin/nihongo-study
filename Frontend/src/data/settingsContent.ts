import { AppLanguage } from './appPreferences';

interface SettingsInfoCardContent {
  title: string;
  description: string;
}

interface SettingsPageContent {
  pageTitle: string;
  fontSectionTitle: string;
  fontSectionDescription: string;
  livePreviewTitle: string;
  currentStyleLabel: string;
  appliedGloballyLabel: string;
  howItWorksTitle: string;
  howItWorksDescription: string;
  infoCards: SettingsInfoCardContent[];
}

export const settingsContent: Record<AppLanguage, SettingsPageContent> = {
  tr: {
    pageTitle: 'Ayarlar',
    fontSectionTitle: 'Kana Yaz\u0131 Stili',
    fontSectionDescription: 'Karakter \u015fekillerini kar\u015f\u0131la\u015ft\u0131rmak i\u00e7in farkl\u0131 Japonca yaz\u0131 stilleri aras\u0131nda ge\u00e7i\u015f yap.',
    livePreviewTitle: 'Canl\u0131 \u00d6nizleme',
    currentStyleLabel: 'Ge\u00e7erli stil',
    appliedGloballyLabel: 'T\u00fcm uygulamada aktif',
    howItWorksTitle: 'Nas\u0131l \u00c7al\u0131\u015f\u0131r',
    howItWorksDescription: 'Se\u00e7ti\u011fin kana fontu, uygulamadaki Japonca metin kullanan t\u00fcm alanlar\u0131 g\u00fcnceller.',
    infoCards: [
      {
        title: 'Yazma ve \u00c7izim',
        description: '\u00c7al\u0131\u015fma tablolar\u0131 ve istemler se\u00e7ilen kana stilini kullan\u0131r.'
      },
      {
        title: 'Dinleme',
        description: 'Dinleme kartlar\u0131 ve karakter modal \u00f6nizlemeleri ayn\u0131 stili takip eder.'
      },
      {
        title: 'S\u00f6zl\u00fck',
        description: 'S\u00f6zl\u00fck tablolar\u0131ndaki kana kelimeleri stili de\u011fi\u015ftirdi\u011finde an\u0131nda g\u00fcncellenir.'
      }
    ]
  },
  en: {
    pageTitle: 'Settings',
    fontSectionTitle: 'Kana Writing Style',
    fontSectionDescription: 'Switch between different Japanese type styles to compare glyph shapes, similar to the design selector on RealKana.',
    livePreviewTitle: 'Live Preview',
    currentStyleLabel: 'Current style',
    appliedGloballyLabel: 'Applied globally',
    howItWorksTitle: 'How It Works',
    howItWorksDescription: 'The selected kana font updates every place that uses Japanese text in the app.',
    infoCards: [
      {
        title: 'Typing & Drawing',
        description: 'Study tables and prompts use the selected kana style.'
      },
      {
        title: 'Listening',
        description: 'Listening cards and character modal previews follow the same style.'
      },
      {
        title: 'Dictionary',
        description: 'Kana words in dictionary tables switch instantly when you change the style.'
      }
    ]
  }
};
