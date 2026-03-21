import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { ScriptStudyLayout } from '../components/ScriptStudyLayout';
import { AppLanguage } from '../data/appPreferences';
import { getLocalizedHiraganaSections } from '../data/studyContent';
import { useDictionaryWords } from '../data/words';

interface Props {
  language: AppLanguage;
}

export const Hiragana: React.FC<Props> = ({ language }) => {
  const { words, loading, error } = useDictionaryWords('hiragana');
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
    <PageContainer title="Hiragana">
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
        title="Hiragana"
        language={language}
        script="hiragana"
        kanaSections={getLocalizedHiraganaSections(language)}
        dictionaryWords={words}
      />
    </PageContainer>
  );
};
