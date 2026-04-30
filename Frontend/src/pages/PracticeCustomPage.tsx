import React from 'react';
import { AppLanguage } from '../data/appPreferences';
import { PracticePage } from './PracticePage';

interface PracticeCustomPageProps {
  language: AppLanguage;
}

export const PracticeCustomPage: React.FC<PracticeCustomPageProps> = ({ language }) => (
  <PracticePage language={language} focusDrill="free" pageVariant="drill" />
);
