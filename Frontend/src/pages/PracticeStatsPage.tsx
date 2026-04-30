import React from 'react';
import { AppLanguage } from '../data/appPreferences';
import { PracticePage } from './PracticePage';

interface PracticeStatsPageProps {
  language: AppLanguage;
}

export const PracticeStatsPage: React.FC<PracticeStatsPageProps> = ({ language }) => (
  <PracticePage language={language} pageVariant="stats" />
);
