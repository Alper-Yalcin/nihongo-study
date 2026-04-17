import React from 'react';
import { AppLanguage } from '../data/appPreferences';
import { getLocalizedKatakanaSections } from '../data/studyContent';
import { ScriptPage } from './ScriptPage';
import { ScriptLayoutView } from '../types';

interface Props {
  language: AppLanguage;
  initialView?: ScriptLayoutView;
}

export const Katakana: React.FC<Props> = ({ language, initialView = 'overview' }) => {
  return (
    <ScriptPage
      title="Katakana"
      script="katakana"
      language={language}
      getSections={getLocalizedKatakanaSections}
      initialView={initialView}
    />
  );
};
