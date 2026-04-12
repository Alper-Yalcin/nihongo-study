import React from 'react';
import { AppLanguage } from '../data/appPreferences';
import { getLocalizedHiraganaSections } from '../data/studyContent';
import { ScriptPage } from './ScriptPage';
import { ScriptLayoutView } from '../types';

interface Props {
  language: AppLanguage;
  initialView?: ScriptLayoutView;
}

export const Hiragana: React.FC<Props> = ({ language, initialView = 'overview' }) => {
  return (
    <ScriptPage
      title="Hiragana"
      script="hiragana"
      language={language}
      getSections={getLocalizedHiraganaSections}
      initialView={initialView}
    />
  );
};
