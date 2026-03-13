import React, { useState } from 'react';
import { PageContainer } from '../components/PageContainer';
import { SectionCard } from '../components/SectionCard';
import { StudyNavigator } from '../components/StudyNavigator';

const kanjiSections = [
  { id: 'beginner', title: 'Beginner Kanji', desc: 'Essential characters for everyday use (JLPT N5-N4).' },
  { id: 'intermediate', title: 'Intermediate Kanji', desc: 'More complex characters for reading and writing (JLPT N3-N2).' },
  { id: 'advanced', title: 'Advanced Kanji', desc: 'Advanced characters for fluency (JLPT N1).' },
];

export const Kanji: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSection = kanjiSections[currentIndex];

  return (
    <PageContainer title="Kanji">
      <SectionCard 
        title="Kanji Study" 
        description="Study Chinese characters used in Japanese."
      >
        <StudyNavigator
          title={currentSection.title}
          currentIndex={currentIndex}
          totalItems={kanjiSections.length}
          onNext={() => setCurrentIndex(prev => Math.min(prev + 1, kanjiSections.length - 1))}
          onPrev={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
        />
        <div className="h-64 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center bg-slate-50">
          <p className="text-slate-500 font-medium mb-2">{currentSection.desc}</p>
          <p className="text-slate-400 text-sm">Kanji data will be added here</p>
        </div>
      </SectionCard>
    </PageContainer>
  );
};
