import React, { useState, useEffect, useRef, useMemo } from 'react';
import { KanaSection, Character, RunStats } from '../types';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { studyContent } from '../data/studyContent';

interface Props {
  section: KanaSection;
  language: AppLanguage;
  selectedGroupIds: Set<string>;
  onFinish: (stats: RunStats) => void;
  onCancel: () => void;
}

export const StudyRunPanel: React.FC<Props> = ({ section, language, selectedGroupIds, onFinish, onCancel }) => {
  const copy = studyContent[language];
  const initialPool = useMemo(() => {
    const chars: Character[] = [];
    section.groups.forEach(g => {
      if (selectedGroupIds.has(g.id)) {
        chars.push(...g.characters);
      }
    });
    return chars;
  }, [section, selectedGroupIds]);

  const [pool, setPool] = useState<Character[]>(initialPool);
  const [currentChar, setCurrentChar] = useState<Character | null>(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pool.length > 0 && !currentChar) {
      pickRandomChar(pool);
    }
  }, [pool]);

  useEffect(() => {
    const timer = setInterval(() => setTimeSeconds(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentChar, feedback]);

  const pickRandomChar = (currentPool: Character[]) => {
    const randomIndex = Math.floor(Math.random() * currentPool.length);
    setCurrentChar(currentPool[randomIndex]);
  };

  const checkAnswer = (val: string, label: string) => {
    const normalized = val.trim().toLowerCase();
    if (normalized === label.toLowerCase()) return true;
    
    // Simple alias map for common alternative romanizations
    const aliases: Record<string, string[]> = {
      'shi': ['si'], 'chi': ['ti'], 'tsu': ['tu'], 'fu': ['hu'],
      'ji': ['zi', 'dji'], 'zu': ['dzu'], 'ja': ['zya'], 'ju': ['zyu'], 'jo': ['zyo'],
      'sha': ['sya'], 'shu': ['syu'], 'sho': ['syo'],
      'cha': ['tya'], 'chu': ['tyu'], 'cho': ['tyo'],
      'o': ['wo']
    };
    
    if (aliases[label] && aliases[label].includes(normalized)) return true;
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentChar || feedback !== 'idle' || !input.trim()) return;

    setAttempts(a => a + 1);
    const isCorrect = checkAnswer(input, currentChar.label);

    if (isCorrect) {
      setFeedback('correct');
      setCorrectCount(c => c + 1);
      
      setTimeout(() => {
        const newPool = pool.filter(c => c.id !== currentChar.id);
        if (newPool.length === 0) {
          onFinish({
            completed: initialPool.length,
            totalAttempts: attempts + 1,
            correct: correctCount + 1,
            wrong: wrongCount,
            accuracy: Math.round(((correctCount + 1) / (attempts + 1)) * 100),
            timeSeconds: timeSeconds
          });
        } else {
          setPool(newPool);
          pickRandomChar(newPool);
          setInput('');
          setFeedback('idle');
        }
      }, 300);
    } else {
      setFeedback('wrong');
      setWrongCount(w => w + 1);
      setTimeout(() => {
        setFeedback('idle');
        setInput('');
      }, 500);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center py-6">
      <div className="w-full max-w-md">
        {/* Header / Stats */}
        <div className="flex items-center justify-between mb-8 text-sm font-medium text-slate-500">
          <div className="flex space-x-4">
            <span className="text-emerald-600">{copy.common.correct}: {correctCount}</span>
            <span className="text-rose-600">{copy.common.wrong}: {wrongCount}</span>
          </div>
          <div className="flex space-x-4">
            <span>{formatTime(timeSeconds)}</span>
            <span>{initialPool.length - pool.length} / {initialPool.length}</span>
          </div>
        </div>

        {/* Character Display */}
        <div className="flex justify-center mb-8">
          <div className={`w-40 h-40 flex items-center justify-center rounded-2xl border-2 transition-colors ${
            feedback === 'correct' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
            feedback === 'wrong' ? 'bg-rose-50 border-rose-200 text-rose-600' :
            'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <span className="text-7xl font-jp">{currentChar?.symbol}</span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={feedback !== 'idle'}
            placeholder={copy.studyRun.placeholder}
            className={`w-full text-center text-xl py-3 px-4 rounded-xl border-2 outline-none transition-colors ${
              feedback === 'correct' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' :
              feedback === 'wrong' ? 'border-rose-400 bg-rose-50 text-rose-700' :
              'border-slate-200 focus:border-indigo-500 text-slate-800'
            }`}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </form>

        {/* Controls */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-6">
          <button
            onClick={onCancel}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft size={16} className="mr-1" /> {copy.studyRun.backToSelection}
          </button>
          <button
            onClick={() => {
              setPool(initialPool);
              setCorrectCount(0);
              setWrongCount(0);
              setAttempts(0);
              setTimeSeconds(0);
              setFeedback('idle');
              setInput('');
              pickRandomChar(initialPool);
            }}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <RotateCcw size={16} className="mr-1" /> {copy.common.restartRun}
          </button>
        </div>
      </div>
    </div>
  );
};
