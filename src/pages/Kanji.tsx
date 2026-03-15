import React, { useState } from 'react';
import { PageContainer } from '../components/PageContainer';
import { SectionCard } from '../components/SectionCard';
import { StudyNavigator } from '../components/StudyNavigator';
import { AppLanguage } from '../data/appPreferences';
import { kanjiContent } from '../data/studyContent';

interface Props {
  language: AppLanguage;
}

export const Kanji: React.FC<Props> = ({ language }) => {
  const copy = kanjiContent[language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSection = copy.sections[currentIndex];

  return (
    <PageContainer title={copy.pageTitle}>
      <SectionCard
        title={copy.cardTitle}
        description={copy.cardDescription}
      >
        <StudyNavigator
          title={currentSection.title}
          currentIndex={currentIndex}
          totalItems={copy.sections.length}
          onNext={() => setCurrentIndex(prev => Math.min(prev + 1, copy.sections.length - 1))}
          onPrev={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
          language={language}
        />
        <div className="h-64 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50">
          <p className="text-slate-500 font-medium mb-2">{currentSection.description}</p>
          <p className="text-slate-400 text-sm">{copy.placeholder}</p>
        </div>
      </SectionCard>
    </PageContainer>
  );
};
