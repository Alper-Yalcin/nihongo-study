import React, { useEffect, useMemo, useState } from 'react';
import { KanaSection, WordItem, RunStats, Character } from '../../types';
import { CharacterListeningTable } from './CharacterListeningTable';
import { ListeningStudyPanel } from './ListeningStudyPanel';
import { SectionCard } from '../SectionCard';
import { StudyResultPanel } from '../StudyResultPanel';
import { StudyNavigator } from '../StudyNavigator';
import { Play, Headphones } from 'lucide-react';

interface Props {
  title: string;
  sections: KanaSection[];
  words: WordItem[];
  script: 'hiragana' | 'katakana';
}

type View = 'table' | 'practice-run' | 'test-run' | 'result';
type DatasetType = 'character' | 'word';
type RunMode = 'practice' | 'test';

export const ListeningStudyContainer: React.FC<Props> = ({ title, sections, words, script }) => {
  const [view, setView] = useState<View>('table');
  const [datasetType, setDatasetType] = useState<DatasetType>('character');
  const [questionCount, setQuestionCount] = useState(10);
  const [quizItems, setQuizItems] = useState<{ id: string; symbol: string; label: string; audioSrc: string }[]>([]);
  const [runStats, setRunStats] = useState<RunStats | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [lastRunMode, setLastRunMode] = useState<RunMode>('practice');

  const allCharacters = useMemo(
    () =>
      sections.flatMap(section =>
        section.matrix.flatMap(row => row.filter((char): char is Character => char !== null))
      ),
    [sections]
  );

  const currentSection = sections[currentSectionIndex];
  const maxCount = datasetType === 'character' ? allCharacters.length : words.length;
  const safeMaxCount = Math.max(maxCount, 1);

  useEffect(() => {
    setQuestionCount(prev => Math.min(Math.max(prev, 1), safeMaxCount));
  }, [safeMaxCount]);

  const handleStart = (mode: RunMode) => {
    let pool: { id: string; symbol: string; label: string; audioSrc: string }[] = [];

    if (datasetType === 'character') {
      pool = allCharacters.map(char => ({
        id: char.id,
        symbol: char.symbol,
        label: char.label,
        audioSrc: `/audio/${script}/${char.id}.mp3`
      }));
    } else {
      pool = words.map(word => ({
        id: word.id,
        symbol: word.kana,
        label: word.romaji,
        audioSrc: `/audio/words/${word.id}.mp3`
      }));
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setQuizItems(shuffled.slice(0, Math.min(questionCount, pool.length)));
    setLastRunMode(mode);
    setView(mode === 'practice' ? 'practice-run' : 'test-run');
  };

  if (!currentSection) {
    return null;
  }

  return (
    <SectionCard title={`${title} Listening`} description={`Improve your listening skills for ${title}.`}>
      {view === 'table' && (
        <>
          <StudyNavigator
            title={currentSection.title}
            currentIndex={currentSectionIndex}
            totalItems={sections.length}
            onNext={() => setCurrentSectionIndex(prev => Math.min(prev + 1, sections.length - 1))}
            onPrev={() => setCurrentSectionIndex(prev => Math.max(prev - 1, 0))}
          />

          <div className="mb-2 text-center text-sm text-slate-500">
            Click on any character to open its listening card.
          </div>

          <CharacterListeningTable section={currentSection} script={script} />

          <div className="mt-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setDatasetType('character')}
                className={`flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  datasetType === 'character'
                    ? 'border border-indigo-200 bg-indigo-100 text-indigo-700'
                    : 'border border-transparent text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                Characters
              </button>
              <button
                onClick={() => setDatasetType('word')}
                className={`flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  datasetType === 'word'
                    ? 'border border-indigo-200 bg-indigo-100 text-indigo-700'
                    : 'border border-transparent text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                Words
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <label className="text-sm font-medium text-slate-500" htmlFor={`${script}-listening-count`}>
                Questions
              </label>
              <input
                id={`${script}-listening-count`}
                type="number"
                min="1"
                max={safeMaxCount}
                value={questionCount}
                onChange={(e) => setQuestionCount(Math.min(safeMaxCount, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                className="w-20 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none transition-colors focus:border-indigo-400"
              />
              <div className="text-sm font-medium text-slate-500">
                <span className="text-slate-700">{questionCount}</span> items / <span className="text-slate-700">{maxCount}</span> total
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStart('practice')}
                  disabled={maxCount === 0}
                  className="flex items-center rounded-lg bg-emerald-600 px-3 py-2 font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Listening Practice"
                >
                  <Headphones size={16} className="mr-1.5" />
                  Practice
                </button>
                <button
                  onClick={() => handleStart('test')}
                  disabled={maxCount === 0}
                  className="flex items-center rounded-lg bg-amber-500 px-3 py-2 font-medium text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Listening Test"
                >
                  <Play size={16} className="mr-1.5" />
                  Test
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {view === 'practice-run' && (
        <ListeningStudyPanel
          items={quizItems}
          mode="practice"
          onFinish={(stats) => {
            setRunStats(stats);
            setView('result');
          }}
          onCancel={() => setView('table')}
        />
      )}

      {view === 'test-run' && (
        <ListeningStudyPanel
          items={quizItems}
          mode="test"
          onFinish={(stats) => {
            setRunStats(stats);
            setView('result');
          }}
          onCancel={() => setView('table')}
        />
      )}

      {view === 'result' && runStats && (
        <StudyResultPanel
          section={{ id: `listening-${script}`, title: 'Listening', description: '', matrix: [], groups: [] }}
          stats={runStats}
          onRestart={() => handleStart(lastRunMode)}
          onBack={() => setView('table')}
          isDrawing={false}
        />
      )}
    </SectionCard>
  );
};
