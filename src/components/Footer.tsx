import React from 'react';
import { AppLanguage, ThemeMode } from '../data/appPreferences';

interface FooterProps {
  language: AppLanguage;
  themeMode: ThemeMode;
}

const footerCopy: Record<AppLanguage, {
  description: string;
  features: string[];
  bottomLine: string;
  roadmap: string;
}> = {
  tr: {
    description: 'Hiragana, katakana ve kelime pratiğini typing, drawing, listening ve dictionary modlarıyla tek yerde sürdür.',
    features: ['Typing', 'Çizim', 'Dinleme', 'Sözlük'],
    bottomLine: `© ${new Date().getFullYear()} Nihongo Study`,
    roadmap: 'Sıradaki hedef: Kanji çalışma modülü'
  },
  en: {
    description: 'Practice hiragana, katakana, and vocabulary in one place with typing, drawing, listening, and dictionary modes.',
    features: ['Typing', 'Drawing', 'Listening', 'Dictionary'],
    bottomLine: `© ${new Date().getFullYear()} Nihongo Study`,
    roadmap: 'Next milestone: Kanji study module'
  }
};

export const Footer: React.FC<FooterProps> = ({ language, themeMode }) => {
  const copy = footerCopy[language];
  const isDark = themeMode === 'dark';

  return (
    <footer
      className={`mt-16 border-t ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white/90'}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Nihongo Study
            </p>
            <p
              className={`max-w-2xl text-sm leading-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
            >
              {copy.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {copy.features.map(feature => (
              <span
                key={feature}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  isDark
                    ? 'border-slate-800 bg-slate-900 text-slate-300'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div
          className={`mt-6 flex flex-col gap-2 border-t pt-4 text-sm md:flex-row md:items-center md:justify-between ${
            isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
          }`}
        >
          <p>{copy.bottomLine}</p>
          <p>{copy.roadmap}</p>
        </div>
      </div>
    </footer>
  );
};
