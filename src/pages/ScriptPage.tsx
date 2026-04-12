import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { ScriptStudyLayout } from '../components/ScriptStudyLayout';
import { AppLanguage } from '../data/appPreferences';
import { useDictionaryWords } from '../data/words';
import { KanaSection } from '../types';

interface ScriptPageProps {
  title: string;
  script: 'hiragana' | 'katakana';
  language: AppLanguage;
  getSections: (language: AppLanguage) => KanaSection[];
}

export const ScriptPage: React.FC<ScriptPageProps> = ({
  title,
  script,
  language,
  getSections
}) => {
  const { words, loading, error } = useDictionaryWords(script);
  const statusText = error
    ? language === 'tr'
      ? 'Kelime verisi yuklenemedi. Backend ve veritabani baglantisini kontrol et.'
      : 'Failed to load word data. Check the backend and database connection.'
    : loading
      ? language === 'tr'
        ? 'Kelime verisi yukleniyor...'
        : 'Loading word data...'
      : null;

  return (
    <PageContainer>
      {statusText && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            error
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-slate-200 bg-slate-50 text-slate-600'
          }`}
        >
          {statusText}
        </div>
      )}
      <ScriptStudyLayout
        title={title}
        language={language}
        script={script}
        kanaSections={getSections(language)}
        dictionaryWords={words}
      />
    </PageContainer>
  );
};
