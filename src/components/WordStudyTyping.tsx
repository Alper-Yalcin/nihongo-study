import React, { useState, useEffect, useRef } from 'react';
import { WordItem, RunStats } from '../types';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { studyContent } from '../data/studyContent';
import { getLocalizedWordMeaning, useMeaningTranslations } from '../utils/wordMeaning';

interface Props {
  language: AppLanguage;
  words: WordItem[];
  onFinish: (stats: RunStats) => void;
  onCancel: () => void;
}

export const WordStudyTyping: React.FC<Props> = ({ language, words, onFinish, onCancel }) => {
  const copy = studyContent[language];
  const meaningTranslations = useMeaningTranslations(language);
  const [pool, setPool] = useState<WordItem[]>(words);
  const [currentWord, setCurrentWord] = useState<WordItem | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeSeconds, setTimeSeconds] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pool.length > 0 && !currentWord) {
      pickRandomWord(pool);
    }
  }, [pool]);

  useEffect(() => {
    const timer = setInterval(() => setTimeSeconds(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (feedback === 'idle') {
      inputRef.current?.focus();
    }
  }, [feedback, currentWord]);

  const pickRandomWord = (currentPool: WordItem[]) => {
    const randomIndex = Math.floor(Math.random() * currentPool.length);
    setCurrentWord(currentPool[randomIndex]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWord || feedback !== 'idle' || !inputValue.trim()) return;

    setAttempts(a => a + 1);
    const isCorrect = inputValue.trim().toLowerCase() === currentWord.romaji.toLowerCase();

    if (isCorrect) {
      setFeedback('correct');
      setCorrectCount(c => c + 1);
      
      setTimeout(() => {
        const newPool = pool.filter(w => w.id !== currentWord.id);
        if (newPool.length === 0) {
          onFinish({
            completed: words.length,
            totalAttempts: attempts + 1,
            correct: correctCount + 1,
            wrong: wrongCount,
            accuracy: Math.round(((correctCount + 1) / (attempts + 1)) * 100),
            timeSeconds: timeSeconds
          });
        } else {
          setPool(newPool);
          pickRandomWord(newPool);
          setInputValue('');
          setFeedback('idle');
        }
      }, 400);
    } else {
      setFeedback('wrong');
      setWrongCount(w => w + 1);
      setTimeout(() => {
        setInputValue('');
        setFeedback('idle');
      }, 800);
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
            <span>{words.length - pool.length} / {words.length}</span>
          </div>
        </div>

        {/* Target Info */}
        <div className="text-center mb-12">
          <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold mb-2">{copy.wordTyping.prompt}</div>
          <div className="text-6xl font-bold text-slate-800 font-jp tracking-wider">{currentWord?.kana}</div>
          {currentWord && getLocalizedWordMeaning(currentWord.meaning, language, meaningTranslations) && (
            <div className="text-slate-400 mt-4 text-sm">{getLocalizedWordMeaning(currentWord.meaning, language, meaningTranslations)}</div>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="mb-12 relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={feedback !== 'idle'}
            className={`w-full text-center text-3xl font-mono py-4 px-6 rounded-2xl border-2 outline-none transition-all shadow-sm ${
              feedback === 'correct' 
                ? 'bg-emerald-50 border-emerald-400 text-emerald-700' 
                : feedback === 'wrong'
                  ? 'bg-rose-50 border-rose-400 text-rose-700'
                  : 'bg-white border-slate-200 text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
            }`}
            placeholder={copy.wordTyping.placeholder}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {feedback === 'wrong' && (
            <div className="absolute -bottom-8 left-0 right-0 text-center text-rose-500 font-medium animate-pulse">
              {copy.wordTyping.tryAgain}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-6">
          <button
            onClick={onCancel}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft size={16} className="mr-1" /> {copy.wordTyping.backToDictionary}
          </button>
          <button
            onClick={() => {
              setPool(words);
              setCorrectCount(0);
              setWrongCount(0);
              setAttempts(0);
              setTimeSeconds(0);
              setFeedback('idle');
              setInputValue('');
              pickRandomWord(words);
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
