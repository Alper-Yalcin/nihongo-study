import React from 'react';
import { AppLanguage } from '../data/appPreferences';
import { PracticePage } from './PracticePage';

interface PracticeConfusablePageProps {
  language: AppLanguage;
}

export const PracticeConfusablePage: React.FC<PracticeConfusablePageProps> = ({ language }) => (
  <PracticePage language={language} focusDrill="confusable" pageVariant="drill" />
);
