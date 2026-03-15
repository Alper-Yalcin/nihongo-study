import React, { useState, useMemo } from 'react';
import { KanaSection, RunStats, TypingMode } from '../types';
import { StudyNavigator } from './StudyNavigator';
import { SectionCard } from './SectionCard';
import { StudySelectionPanel } from './StudySelectionPanel';
import { StudyRunPanel } from './StudyRunPanel';
import { StudyResultPanel } from './StudyResultPanel';
import { DrawingStudyPanel } from './DrawingStudyPanel';
import { AppLanguage } from '../data/appPreferences';

interface StudyContainerProps {
  title: string;
  language: AppLanguage;
  sections: KanaSection[];
  mode: 'typing' | 'drawing';
}

export const StudyContainer: React.FC<StudyContainerProps> = ({ title, language, sections, mode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState<'selection' | 'run' | 'result'>('selection');
  const [selectedGroupsBySection, setSelectedGroupsBySection] = useState<Record<string, Set<string>>>({});
  const [runStats, setRunStats] = useState<RunStats | null>(null);
  const [typingMode, setTypingMode] = useState<TypingMode>('current');

  const currentSection = sections[currentIndex];
  const selectedGroupIds = selectedGroupsBySection[currentSection.id] || new Set<string>();

  // Page-level aggregation
  const {
    totalSelectableGroups,
    totalSelectedGroups,
    totalSelectedChars,
    mergedSection,
    mergedSelectedGroupIds
  } = useMemo(() => {
    let selectableGroups = 0;
    let selectedGroups = 0;
    const mergedGroups = [];
    const mergedSelected = new Set<string>();
    const uniqueChars = new Set<string>();

    sections.forEach(sec => {
      selectableGroups += sec.groups.length;
      const selectedSet = selectedGroupsBySection[sec.id] || new Set<string>();
      selectedGroups += selectedSet.size;
      
      sec.groups.forEach(g => {
        mergedGroups.push(g);
        if (selectedSet.has(g.id)) {
          mergedSelected.add(g.id);
          g.characters.forEach(c => uniqueChars.add(c.id));
        }
      });
    });

    const baseId = `${sections[0]?.id.split('-')[0] ?? 'study'}-${mode}`;
    const mergedSec: KanaSection = {
      id: baseId,
      title: `${title} All`,
      description: '',
      matrix: [],
      groups: mergedGroups
    };

    return {
      totalSelectableGroups: selectableGroups,
      totalSelectedGroups: selectedGroups,
      totalSelectedChars: uniqueChars.size,
      mergedSection: mergedSec,
      mergedSelectedGroupIds: mergedSelected
    };
  }, [sections, selectedGroupsBySection, title]);

  const isAllSelected = totalSelectedGroups === totalSelectableGroups && totalSelectableGroups > 0;
  const isNoneSelected = totalSelectedGroups === 0;

  const handleSelectAll = () => {
    const nextState: Record<string, Set<string>> = {};
    sections.forEach(sec => {
      nextState[sec.id] = new Set(sec.groups.map(g => g.id));
    });
    setSelectedGroupsBySection(nextState);
  };

  const handleDeselectAll = () => {
    setSelectedGroupsBySection({});
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(prev + 1, sections.length - 1));
    setView('selection');
  };

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
    setView('selection');
  };

  const handleSelectionChange = (newSelection: Set<string>) => {
    setSelectedGroupsBySection(prev => ({
      ...prev,
      [currentSection.id]: newSelection
    }));
  };

  return (
    <SectionCard title={title} description={currentSection.description}>
      {view === 'selection' && (
        <>
          <StudyNavigator
            title={currentSection.title}
            currentIndex={currentIndex}
            totalItems={sections.length}
            onNext={handleNext}
            onPrev={handlePrev}
            language={language}
          />
          <StudySelectionPanel
            section={currentSection}
            language={language}
            selectedGroupIds={selectedGroupIds}
            onChangeSelection={handleSelectionChange}
            onStart={() => setView('run')}
            typingMode={typingMode}
            onTypingModeChange={setTypingMode}
            isAllSelected={isAllSelected}
            isNoneSelected={isNoneSelected}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            totalSelectedGroups={totalSelectedGroups}
            totalSelectedChars={totalSelectedChars}
            mode={mode}
          />
        </>
      )}
      {view === 'run' && mode === 'typing' && (
        <StudyRunPanel
          section={mergedSection}
          language={language}
          selectedGroupIds={mergedSelectedGroupIds}
          typingMode={typingMode}
          onFinish={(stats) => {
            setRunStats(stats);
            setView('result');
          }}
          onCancel={() => setView('selection')}
        />
      )}
      {view === 'run' && mode === 'drawing' && (
        <DrawingStudyPanel
          section={mergedSection}
          language={language}
          selectedGroupIds={mergedSelectedGroupIds}
          onFinish={(stats) => {
            setRunStats(stats);
            setView('result');
          }}
          onCancel={() => setView('selection')}
        />
      )}
      {view === 'result' && runStats && (
        <StudyResultPanel
          section={mergedSection}
          language={language}
          stats={runStats}
          onRestart={() => setView('run')}
          onBack={() => setView('selection')}
          variant={mode}
        />
      )}
    </SectionCard>
  );
};
