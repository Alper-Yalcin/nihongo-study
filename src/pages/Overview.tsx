import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { OverviewHero } from '../components/overview/OverviewHero';
import { FeatureCards } from '../components/overview/FeatureCards';
import { TypingFeatureSection } from '../components/overview/TypingFeatureSection';
import { DrawingFeatureSection } from '../components/overview/DrawingFeatureSection';
import { ListeningFeatureSection } from '../components/overview/ListeningFeatureSection';
import { DictionaryFeatureSection } from '../components/overview/DictionaryFeatureSection';
import { TabType } from '../types';
import { AppLanguage } from '../data/appPreferences';
import { overviewContent } from '../data/overviewContent';

interface Props {
  language: AppLanguage;
  onNavigate?: (tab: TabType) => void;
}

export const Overview: React.FC<Props> = ({ language, onNavigate = () => {} }) => {
  const copy = overviewContent[language];

  return (
    <PageContainer title={copy.pageTitle}>
      <div className="max-w-6xl mx-auto">
        <OverviewHero language={language} onNavigate={onNavigate} />
        <FeatureCards language={language} />
        
        <div className="mt-32 space-y-32">
          <TypingFeatureSection language={language} />
          <DrawingFeatureSection language={language} />
          <ListeningFeatureSection language={language} />
          <DictionaryFeatureSection language={language} />
        </div>
      </div>
    </PageContainer>
  );
};
