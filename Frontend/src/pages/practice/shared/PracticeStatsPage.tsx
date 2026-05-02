import React from 'react';
import { AppLanguage } from '../../../data/appPreferences';
import { PracticePage } from '../../../features/practice/shared/PracticePage';

interface PracticeStatsPageProps {
  language: AppLanguage;
}

export const PracticeStatsPage: React.FC<PracticeStatsPageProps> = ({ language }) => (
  <PracticePage language={language} pageVariant="stats" />
);
