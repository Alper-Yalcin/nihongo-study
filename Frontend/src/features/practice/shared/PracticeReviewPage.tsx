import React from 'react';
import { AppLanguage } from '../../../data/appPreferences';
import { PracticePage } from './PracticePage';

interface PracticeReviewPageProps {
  language: AppLanguage;
}

export const PracticeReviewPage: React.FC<PracticeReviewPageProps> = ({ language }) => (
  <PracticePage language={language} focusDrill="review" pageVariant="drill" />
);
