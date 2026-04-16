import React from 'react';
import { Link } from 'react-router-dom';
import { AppLanguage, ThemeMode } from '../data/appPreferences';
import { appShellContent, appShellRoutes } from '../data/appShellContent';

interface FooterProps {
  language: AppLanguage;
  themeMode: ThemeMode;
}

const footerIntroCopy: Record<AppLanguage, { description: string; supportLine: string }> = {
  tr: {
    description: 'Kototsuna, kana odakli calisma akisini tek yerde toplayan ve giderek daha yonlendirilmis bir ogrenme sistemi haline gelen bir platformdur.',
    supportLine: 'Study, test, play ve arama alanlari yeni shell icinde birbirine baglandi.'
  },
  en: {
    description: 'Kototsuna is evolving into a guided learning platform that brings kana-focused study, testing, play, and discovery into one shell.',
    supportLine: 'Study, test, play, and search now connect through the new navigation shell.'
  }
};

export const Footer: React.FC<FooterProps> = ({ language, themeMode }) => {
  const isDark = themeMode === 'dark';
  const content = appShellContent[language];
  const intro = footerIntroCopy[language];
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`mt-16 border-t ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white/95'}`}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-b pb-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,2fr)] md:items-start lg:gap-12">
          <div className="space-y-4">
            <Link
              to={appShellRoutes.home}
              className={`inline-flex text-xl font-semibold transition-colors ${isDark ? 'text-white hover:text-sky-200' : 'text-slate-900 hover:text-sky-600'}`}
            >
              Kototsuna
            </Link>
            <p className={`text-sm leading-7 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {intro.description}
            </p>
            <p className={`text-sm leading-7 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {intro.supportLine}
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {content.footer.columns.map((column) => (
              <div key={column.id} className="space-y-3">
                <h2 className={`text-sm font-semibold uppercase tracking-[0.16em] ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  {column.title}
                </h2>
                <div className="space-y-2">
                  {column.links.map((link) => (
                    <Link
                      key={link.id}
                      to={link.href}
                      className={`block text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-sky-200' : 'text-slate-600 hover:text-sky-600'}`}
                      title={link.description}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`flex flex-col gap-2 pt-4 text-sm md:flex-row md:items-center md:justify-between ${
            isDark ? 'text-slate-500' : 'text-slate-500'
          }`}
        >
          <p>{`(c) ${currentYear} Kototsuna`}</p>
          <p>{intro.supportLine}</p>
        </div>
      </div>
    </footer>
  );
};
