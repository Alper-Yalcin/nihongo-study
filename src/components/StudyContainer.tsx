import React, { useState, useMemo } from 'react';
import { KanaSection, RunStats, TypingMode, DrawingMode } from '../types';
import { StudyNavigator } from './StudyNavigator';
import { SectionCard } from './SectionCard';
import { StudySelectionPanel } from './StudySelectionPanel';
import { StudyRunPanel } from './StudyRunPanel';
import { StudyResultPanel } from './StudyResultPanel';
import { DrawingStudyPanel } from './DrawingStudyPanel';
import { AppLanguage } from '../data/appPreferences';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import { getSessionConfigString } from '../features/kana/session/sessionEngine';

interface StudyContainerProps {
  title: string;
  language: AppLanguage;
  script: 'hiragana' | 'katakana';
  sections: KanaSection[];
  mode: 'typing' | 'drawing';
  autoStart?: boolean;
}

export const StudyContainer: React.FC<StudyContainerProps> = ({
  title,
  language,
  script,
  sections,
  mode,
  autoStart = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [view, setView] = useState<'selection' | 'run' | 'result'>(autoStart ? 'run' : 'selection');
  const [selectedGroupsBySection, setSelectedGroupsBySection] = useState<Record<string, Set<string>>>({});
  const [runStats, setRunStats] = useState<RunStats | null>(null);
  const [typingMode, setTypingMode] = useState<TypingMode>('current');
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('practice');
  const { activeSession } = useKanaProgressStore();

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
      const selectedSet = autoStart ? new Set(sec.groups.map((group) => group.id)) : selectedGroupsBySection[sec.id] || new Set<string>();
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
  }, [autoStart, sections, selectedGroupsBySection, title]);

  const isAllSelected = totalSelectedGroups === totalSelectableGroups && totalSelectableGroups > 0;
  const isNoneSelected = totalSelectedGroups === 0;
  const matchingActiveSession =
    activeSession &&
    activeSession.script === script &&
    activeSession.mode === mode &&
    activeSession.status === 'active'
      ? activeSession
      : null;
  const resumeModeVariant = getSessionConfigString(matchingActiveSession, 'variant');
  const resumeCopy =
    language === 'tr'
      ? {
          title: 'Devam eden oturum bulundu',
          description: 'Yarim birakilan calismayi kaldigin yerden acabilirsin.',
          action: 'Oturumu surdur'
        }
      : {
          title: 'Active session found',
          description: 'You can reopen the interrupted run from where you left off.',
          action: 'Resume session'
        };

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

  const handleResumeSession = () => {
    if (!matchingActiveSession) {
      return;
    }

    if (mode === 'typing') {
      setTypingMode(
        resumeModeVariant === 'current' || resumeModeVariant === 'reverse' || resumeModeVariant === 'timed'
          ? resumeModeVariant
          : 'current'
      );
    }

    if (mode === 'drawing') {
      setDrawingMode(
        resumeModeVariant === 'practice' ||
          resumeModeVariant === 'test' ||
          resumeModeVariant === 'speed' ||
          resumeModeVariant === 'memory'
          ? resumeModeVariant
          : 'practice'
      );
    }

    setView('run');
  };

  return (
    <SectionCard title={title} description={currentSection.description}>
      {!autoStart && view === 'selection' && (
        <>
          <StudyNavigator
            title={currentSection.title}
            currentIndex={currentIndex}
            totalItems={sections.length}
            onNext={handleNext}
            onPrev={handlePrev}
            language={language}
          />
          {matchingActiveSession && (
            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-sm font-semibold text-amber-900">{resumeCopy.title}</div>
                  <p className="mt-1 text-sm text-amber-800">{resumeCopy.description}</p>
                </div>
                <button
                  type="button"
                  onClick={handleResumeSession}
                  className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
                >
                  {resumeCopy.action}
                </button>
              </div>
            </div>
          )}
          <StudySelectionPanel
            section={currentSection}
            language={language}
            selectedGroupIds={selectedGroupIds}
            onChangeSelection={handleSelectionChange}
            onStart={() => setView('run')}
            typingMode={typingMode}
            onTypingModeChange={setTypingMode}
            drawingMode={drawingMode}
            onDrawingModeChange={setDrawingMode}
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
          script={script}
          section={mergedSection}
          language={language}
          selectedGroupIds={mergedSelectedGroupIds}
          typingMode={typingMode}
          onFinish={(stats) => {
            setRunStats(stats);
            setView('result');
          }}
          onCancel={() => setView(autoStart ? 'run' : 'selection')}
        />
      )}
      {view === 'run' && mode === 'drawing' && (
        <DrawingStudyPanel
          script={script}
          section={mergedSection}
          language={language}
          selectedGroupIds={mergedSelectedGroupIds}
          drawingMode={drawingMode}
          onFinish={(stats) => {
            setRunStats(stats);
            setView('result');
          }}
          onCancel={() => setView(autoStart ? 'run' : 'selection')}
        />
      )}
      {view === 'result' && runStats && (
        <StudyResultPanel
          section={mergedSection}
          language={language}
          stats={runStats}
          onRestart={() => setView('run')}
          onBack={() => setView(autoStart ? 'run' : 'selection')}
          variant={mode}
        />
      )}
    </SectionCard>
  );
};
