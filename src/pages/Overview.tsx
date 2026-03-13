import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { OverviewHero } from '../components/overview/OverviewHero';
import { FeatureCards } from '../components/overview/FeatureCards';
import { TypingFeatureSection } from '../components/overview/TypingFeatureSection';
import { DrawingFeatureSection } from '../components/overview/DrawingFeatureSection';
import { DictionaryFeatureSection } from '../components/overview/DictionaryFeatureSection';
import { TabType } from '../types';

interface Props {
  onNavigate?: (tab: TabType) => void;
}

export const Overview: React.FC<Props> = ({ onNavigate = () => {} }) => {
  return (
    <PageContainer title="Overview">
      <div className="max-w-6xl mx-auto">
        <OverviewHero onNavigate={onNavigate} />
        <FeatureCards />
        
        <div className="mt-32 space-y-32">
          <TypingFeatureSection />
          <DrawingFeatureSection />
          <DictionaryFeatureSection />
        </div>
      </div>
    </PageContainer>
  );
};
