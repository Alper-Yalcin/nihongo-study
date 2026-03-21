import React from 'react';
import { AppLanguage } from '../../data/appPreferences';

export const getBackToOverviewLabel = (language: AppLanguage) =>
  language === 'tr' ? "Overview'a don" : 'Back to overview';

export const handleLandingSectionKeyDown = (
  event: React.KeyboardEvent<HTMLElement>,
  onActivate: () => void
) => {
  if (event.target !== event.currentTarget) {
    return;
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onActivate();
  }
};

export const handleLandingInnerButtonClick = (
  event: React.MouseEvent<HTMLButtonElement>,
  action: () => void
) => {
  event.stopPropagation();
  action();
};
