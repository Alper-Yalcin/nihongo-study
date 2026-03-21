import React from 'react';
import { AppLanguage } from '../data/appPreferences';
import { getLocalizedHiraganaSections } from '../data/studyContent';
import { ScriptPage } from './ScriptPage';

interface Props {
  language: AppLanguage;
}

export const Hiragana: React.FC<Props> = ({ language }) => {
  return (
    <ScriptPage
      title="Hiragana"
      script="hiragana"
      language={language}
      getSections={getLocalizedHiraganaSections}
    />
  );
};
