import React from 'react';
import { AppLanguage } from '../data/appPreferences';
import { getLocalizedKatakanaSections } from '../data/studyContent';
import { ScriptPage } from './ScriptPage';

interface Props {
  language: AppLanguage;
}

export const Katakana: React.FC<Props> = ({ language }) => {
  return (
    <ScriptPage
      title="Katakana"
      script="katakana"
      language={language}
      getSections={getLocalizedKatakanaSections}
    />
  );
};
