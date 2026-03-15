import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { ScriptStudyLayout } from '../components/ScriptStudyLayout';
import { AppLanguage } from '../data/appPreferences';
import { getLocalizedHiraganaSections } from '../data/studyContent';
import { hiraganaDictionaryWords } from '../data/words';

interface Props {
  language: AppLanguage;
}

export const Hiragana: React.FC<Props> = ({ language }) => {
  return (
    <PageContainer title="Hiragana">
      <ScriptStudyLayout
        title="Hiragana"
        language={language}
        script="hiragana"
        kanaSections={getLocalizedHiraganaSections(language)}
        dictionaryWords={hiraganaDictionaryWords}
      />
    </PageContainer>
  );
};
