import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { ScriptStudyLayout } from '../components/ScriptStudyLayout';
import { AppLanguage } from '../data/appPreferences';
import { getLocalizedKatakanaSections } from '../data/studyContent';
import { katakanaDictionaryWords } from '../data/words';

interface Props {
  language: AppLanguage;
}

export const Katakana: React.FC<Props> = ({ language }) => {
  return (
    <PageContainer title="Katakana">
      <ScriptStudyLayout
        title="Katakana"
        language={language}
        script="katakana"
        kanaSections={getLocalizedKatakanaSections(language)}
        dictionaryWords={katakanaDictionaryWords}
      />
    </PageContainer>
  );
};
