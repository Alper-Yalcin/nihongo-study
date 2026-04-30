import React from 'react';
import { AppLanguage } from '../data/appPreferences';
import { PracticePage } from './PracticePage';

interface PracticeWeakPageProps {
  language: AppLanguage;
}

export const PracticeWeakPage: React.FC<PracticeWeakPageProps> = ({ language }) => (
  <PracticePage language={language} focusDrill="weak" pageVariant="drill" />
);
