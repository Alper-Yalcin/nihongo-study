import React, { useState } from 'react';
import { PageContainer } from '../components/PageContainer';
import { OverviewHero } from '../components/overview/OverviewHero';
import { FeatureCards } from '../components/overview/FeatureCards';
import { OverviewFeatureSection } from '../components/overview/OverviewFeatureSection';
import { TabType } from '../types';
import { AppLanguage } from '../data/appPreferences';
import { overviewContent } from '../content/overviewContent';
import { OverviewStudyAreaId } from '../content/overviewModalContent';
import { OverviewStudyDetailModal } from '../components/overview/OverviewStudyDetailModal';

interface Props {
  language: AppLanguage;
  onNavigate?: (tab: TabType) => void;
}

export const Overview: React.FC<Props> = ({ language, onNavigate = () => {} }) => {
  const copy = overviewContent[language];
  const [activeStudyArea, setActiveStudyArea] = useState<OverviewStudyAreaId | null>(null);
  const sections: Array<{
    id: OverviewStudyAreaId;
    accent: 'indigo' | 'emerald' | 'rose' | 'amber';
    reverseLayout?: boolean;
    previewSrc: string;
    section: typeof copy.typingSection;
  }> = [
    {
      id: 'typing',
      accent: 'indigo',
      previewSrc: '/gifs/typing-demo.gif',
      section: copy.typingSection
    },
    {
      id: 'drawing',
      accent: 'emerald',
      reverseLayout: true,
      previewSrc: '/gifs/drawing-demo.gif',
      section: copy.drawingSection
    },
    {
      id: 'listening',
      accent: 'rose',
      previewSrc: '/gifs/listening-demo.gif',
      section: copy.listeningSection
    },
    {
      id: 'dictionary',
      accent: 'amber',
      reverseLayout: true,
      previewSrc: '/gifs/dictionary-demo.gif',
      section: copy.dictionarySection
    }
  ];

  return (
    <PageContainer title={copy.pageTitle}>
      <div className="max-w-6xl mx-auto">
        <OverviewHero language={language} onNavigate={onNavigate} />
        <FeatureCards language={language} />
        
        <div className="mt-32 space-y-32">
          {sections.map((item) => (
            <OverviewFeatureSection
              key={item.id}
              badge={item.section.badge}
              title={item.section.title}
              description={item.section.description}
              features={item.section.features}
              imageAlt={item.section.imageAlt}
              fallbackTitle={item.section.fallbackTitle}
              fallbackPath={item.section.fallbackPath}
              previewSrc={item.previewSrc}
              accent={item.accent}
              reverseLayout={item.reverseLayout}
              onOpenDetails={() => setActiveStudyArea(item.id)}
            />
          ))}
        </div>
      </div>

      {activeStudyArea && (
        <OverviewStudyDetailModal
          language={language}
          studyArea={activeStudyArea}
          onClose={() => setActiveStudyArea(null)}
        />
      )}
    </PageContainer>
  );
};
