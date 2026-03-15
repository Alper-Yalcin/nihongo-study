import React, { useEffect, useMemo, useState } from 'react';
import {
  Character,
  KanaSection,
  ListeningItem,
  ListeningMode,
  RunStats,
  WordItem
} from '../../types';
import { CharacterListeningTable } from './CharacterListeningTable';
import { ListeningStudyPanel } from './ListeningStudyPanel';
import { SectionCard } from '../SectionCard';
import { StudyResultPanel } from '../StudyResultPanel';
import { StudyNavigator } from '../StudyNavigator';
import { StudyModeSelector } from '../StudyModeSelector';
import { Play } from 'lucide-react';
import { AppLanguage } from '../../data/appPreferences';
import { studyContent } from '../../data/studyContent';
import { getAcceptedRomajiAnswers } from '../../utils/typing';
import { shuffleArray } from '../../utils/listening';

interface Props {
  title: string;
  language: AppLanguage;
  sections: KanaSection[];
  words: WordItem[];
  script: 'hiragana' | 'katakana';
}

type View = 'table' | 'run' | 'result';
type DatasetType = 'character' | 'word';

export const ListeningStudyContainer: React.FC<Props> = ({
  title,
  language,
  sections,
  words,
  script
}) => {
  const copy = studyContent[language];
  const [view, setView] = useState<View>('table');
  const [datasetType, setDatasetType] = useState<DatasetType>('character');
  const [listeningMode, setListeningMode] = useState<ListeningMode>('recognition');
  const [questionCount, setQuestionCount] = useState(10);
  const [quizItems, setQuizItems] = useState<ListeningItem[]>([]);
  const [sourceItems, setSourceItems] = useState<ListeningItem[]>([]);
  const [runStats, setRunStats] = useState<RunStats | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [lastRunMode, setLastRunMode] = useState<ListeningMode>('recognition');
  const [lastRunDatasetType, setLastRunDatasetType] = useState<DatasetType>('character');

  const allCharacters = useMemo(
    () =>
      sections.flatMap((section) =>
        section.matrix.flatMap((row) => row.filter((char): char is Character => char !== null))
      ),
    [sections]
  );

  const characterItems = useMemo<ListeningItem[]>(
    () =>
      allCharacters.map((character) => ({
        id: character.id,
        script,
        kana: character.symbol,
        romaji: character.label,
        acceptedRomaji: getAcceptedRomajiAnswers(character.label),
        audioSrc: `/audio/${script}/${character.id}.mp3`,
        datasetType: 'character',
        character
      })),
    [allCharacters, script]
  );

  const wordItems = useMemo<ListeningItem[]>(
    () =>
      words.map((word) => ({
        id: word.id,
        script: word.script ?? script,
        kana: word.kana,
        romaji: word.romaji,
        acceptedRomaji: [word.romaji],
        audioSrc: `/audio/words/${word.id}.mp3`,
        datasetType: 'word'
      })),
    [script, words]
  );

  const currentSection = sections[currentSectionIndex];
  const activePool = datasetType === 'character' ? characterItems : wordItems;
  const maxCount = activePool.length;
  const safeMaxCount = Math.max(maxCount, 1);
  const isWritingDisabled = datasetType === 'word';

  useEffect(() => {
    setQuestionCount((previousCount) => Math.min(Math.max(previousCount, 1), safeMaxCount));
  }, [safeMaxCount]);

  useEffect(() => {
    if (datasetType === 'word' && listeningMode === 'writing') {
      setListeningMode('recognition');
    }
  }, [datasetType, listeningMode]);

  const getModeLabel = (mode: ListeningMode) => {
    switch (mode) {
      case 'recognition':
        return copy.listening.recognitionMode;
      case 'typing':
        return copy.listening.typingMode;
      case 'writing':
        return copy.listening.writingMode;
      default:
        return copy.listening.recognitionMode;
    }
  };

  const handleStart = (targetMode = listeningMode) => {
    const resolvedMode = datasetType === 'word' && targetMode === 'writing' ? 'recognition' : targetMode;
    const nextSourceItems = datasetType === 'character' ? characterItems : wordItems;
    const nextQuizItems = shuffleArray(nextSourceItems).slice(0, Math.min(questionCount, nextSourceItems.length));

    setSourceItems(nextSourceItems);
    setQuizItems(nextQuizItems);
    setRunStats(null);
    setLastRunMode(resolvedMode);
    setLastRunDatasetType(datasetType);
    setView('run');
  };

  if (!currentSection) {
    return null;
  }

  const modeOptions: {
    id: ListeningMode;
    label: string;
    disabled?: boolean;
  }[] = [
    {
      id: 'recognition',
      label: copy.listening.recognitionMode
    },
    {
      id: 'typing',
      label: copy.listening.typingMode
    },
    {
      id: 'writing',
      label: copy.listening.writingMode,
      disabled: isWritingDisabled
    }
  ];

  return (
    <SectionCard title={`${title} ${copy.views.listening}`} description={copy.listening.sectionDescription(title)}>
      {view === 'table' && (
        <>
          <StudyNavigator
            title={currentSection.title}
            currentIndex={currentSectionIndex}
            totalItems={sections.length}
            onNext={() => setCurrentSectionIndex((previousIndex) => Math.min(previousIndex + 1, sections.length - 1))}
            onPrev={() => setCurrentSectionIndex((previousIndex) => Math.max(previousIndex - 1, 0))}
            language={language}
          />

          <div className="mb-2 text-center text-sm text-slate-500">
            {copy.listening.clickHint}
          </div>

          <CharacterListeningTable section={currentSection} script={script} language={language} />

          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setDatasetType('character')}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  datasetType === 'character'
                    ? 'border border-rose-200 bg-rose-100 text-rose-700'
                    : 'border border-transparent text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                {copy.listening.characters}
              </button>
              <button
                onClick={() => setDatasetType('word')}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  datasetType === 'word'
                    ? 'border border-rose-200 bg-rose-100 text-rose-700'
                    : 'border border-transparent text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                {copy.listening.words}
              </button>
            </div>

            <StudyModeSelector
              label={copy.listening.modeLabel}
              value={listeningMode}
              options={modeOptions}
              onChange={setListeningMode}
              gridClassName="grid-cols-3"
            />

            {isWritingDisabled && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {copy.listening.writingOnlyCharacters}
              </div>
            )}

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-slate-500" htmlFor={`${script}-listening-count`}>
                  {copy.listening.questions}
                </label>
                <input
                  id={`${script}-listening-count`}
                  type="number"
                  min="1"
                  max={safeMaxCount}
                  value={questionCount}
                  onChange={(event) =>
                    setQuestionCount(
                      Math.min(safeMaxCount, Math.max(1, parseInt(event.target.value, 10) || 1))
                    )
                  }
                  className="w-20 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none transition-colors focus:border-rose-400"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-slate-500">
                  {copy.listening.itemsSummary(questionCount, maxCount)}
                </div>
              </div>

              <button
                onClick={() => handleStart()}
                disabled={maxCount === 0}
                className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                title={getModeLabel(listeningMode)}
              >
                <Play size={16} className="mr-2" />
                {copy.listening.start}: {getModeLabel(listeningMode)}
              </button>
            </div>
          </div>
        </>
      )}

      {view === 'run' && (
        <ListeningStudyPanel
          language={language}
          items={quizItems}
          sourceItems={sourceItems}
          mode={lastRunMode}
          onFinish={(stats) => {
            setRunStats(stats);
            setView('result');
          }}
          onCancel={() => setView('table')}
        />
      )}

      {view === 'result' && runStats && (
        <StudyResultPanel
          section={{
            id: `listening-${script}-${lastRunDatasetType}`,
            title: copy.views.listening,
            description: '',
            matrix: [],
            groups: []
          }}
          language={language}
          stats={runStats}
          onRestart={() => handleStart(lastRunMode)}
          onBack={() => setView('table')}
          variant="listening"
        />
      )}
    </SectionCard>
  );
};
