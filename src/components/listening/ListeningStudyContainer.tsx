import React, { useState } from 'react';
import { KanaSection, WordItem, RunStats } from '../../types';
import { CharacterListeningTable } from './CharacterListeningTable';
import { ListeningStudyPanel } from './ListeningStudyPanel';
import { SectionCard } from '../SectionCard';
import { StudyResultPanel } from '../StudyResultPanel';
import { Play, Headphones, BookOpen } from 'lucide-react';

interface Props {
  title: string;
  sections: KanaSection[];
  words: WordItem[];
  script: 'hiragana' | 'katakana';
}

type View = 'table' | 'practice-setup' | 'test-setup' | 'practice-run' | 'test-run' | 'result';
type DatasetType = 'character' | 'word';

export const ListeningStudyContainer: React.FC<Props> = ({ title, sections, words, script }) => {
  const [view, setView] = useState<View>('table');
  const [datasetType, setDatasetType] = useState<DatasetType>('character');
  const [questionCount, setQuestionCount] = useState(10);
  const [quizItems, setQuizItems] = useState<{ id: string; symbol: string; label: string; audioSrc: string }[]>([]);
  const [runStats, setRunStats] = useState<RunStats | null>(null);

  const allCharacters = sections.flatMap(s => s.groups.flatMap(g => g.characters));
  
  const handleStart = (mode: 'practice' | 'test') => {
    let pool: { id: string; symbol: string; label: string; audioSrc: string }[] = [];
    
    if (datasetType === 'character') {
      pool = allCharacters.map(c => ({
        id: c.id,
        symbol: c.symbol,
        label: c.label,
        audioSrc: `/audio/${script}/${c.id}.mp3`
      }));
    } else {
      pool = words.map(w => ({
        id: w.id,
        symbol: w.kana,
        label: w.romaji,
        audioSrc: `/audio/words/${w.id}.mp3`
      }));
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setQuizItems(shuffled.slice(0, Math.min(questionCount, pool.length)));
    setView(mode === 'practice' ? 'practice-run' : 'test-run');
  };

  const renderSetup = (mode: 'practice' | 'test') => {
    const maxCount = datasetType === 'character' ? allCharacters.length : words.length;
    
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          {mode === 'practice' ? 'Listening Practice' : 'Listening Test'} Setup
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Dataset</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDatasetType('character')}
                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  datasetType === 'character'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:border-indigo-200'
                }`}
              >
                Characters
              </button>
              <button
                onClick={() => setDatasetType('word')}
                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                  datasetType === 'word'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:border-indigo-200'
                }`}
              >
                Words
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Question Count (Max: {maxCount})
            </label>
            <input
              type="number"
              min="1"
              max={maxCount}
              value={questionCount}
              onChange={(e) => setQuestionCount(Math.min(maxCount, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full py-3 px-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none text-slate-800 font-medium"
            />
          </div>

          <button
            onClick={() => handleStart(mode)}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            <Play size={20} className="mr-2" />
            Start {mode === 'practice' ? 'Practice' : 'Test'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <SectionCard title={`${title} Listening`} description={`Improve your listening skills for ${title}.`}>
      {/* Sub-navigation for Listening */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-slate-100 p-1 rounded-xl shadow-sm border border-slate-200">
          <button
            onClick={() => setView('table')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'table'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <BookOpen size={16} className="mr-2" />
            Character Table
          </button>
          <button
            onClick={() => setView('practice-setup')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'practice-setup' || view === 'practice-run'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <Headphones size={16} className="mr-2" />
            Practice Mode
          </button>
          <button
            onClick={() => setView('test-setup')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              view === 'test-setup' || view === 'test-run'
                ? 'bg-white text-amber-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            <Play size={16} className="mr-2" />
            Test Mode
          </button>
        </div>
      </div>

      {view === 'table' && <CharacterListeningTable sections={sections} script={script} />}
      
      {view === 'practice-setup' && renderSetup('practice')}
      {view === 'test-setup' && renderSetup('test')}

      {view === 'practice-run' && (
        <ListeningStudyPanel
          items={quizItems}
          mode="practice"
          onFinish={(stats) => {
            setRunStats(stats);
            setView('result');
          }}
          onCancel={() => setView('practice-setup')}
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
          onCancel={() => setView('test-setup')}
        />
      )}

      {view === 'result' && runStats && (
        <StudyResultPanel
          section={{ id: `listening-${script}`, title: 'Listening', description: '', matrix: [], groups: [] }}
          stats={runStats}
          onRestart={() => setView('table')}
          onBack={() => setView('table')}
          isDrawing={false}
        />
      )}
    </SectionCard>
  );
};
