import React, { useState, useEffect, useRef } from 'react';
import { Character, WordItem, RunStats } from '../../types';
import { AudioButton } from './AudioButton';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, ArrowLeft } from 'lucide-react';

interface Props {
  items: { id: string; symbol: string; label: string; audioSrc: string }[];
  mode: 'practice' | 'test';
  onFinish: (stats: RunStats) => void;
  onCancel: () => void;
}

export const ListeningStudyPanel: React.FC<Props> = ({ items, mode, onFinish, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [stats, setStats] = useState({ correct: 0, wrong: 0, attempts: 0 });
  const [startTime] = useState<number>(Date.now());
  const [showAnswer, setShowAnswer] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentItem = items[currentIndex];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex, status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== 'idle') return;

    const isCorrect = input.toLowerCase().trim() === currentItem.label.toLowerCase();
    
    setStats(prev => ({
      ...prev,
      attempts: prev.attempts + 1,
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      wrong: !isCorrect ? prev.wrong + 1 : prev.wrong
    }));

    setStatus(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setTimeout(() => {
        handleNext();
      }, 500);
    }
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setInput('');
      setStatus('idle');
      setShowAnswer(false);
    } else {
      const timeSeconds = Math.floor((Date.now() - startTime) / 1000);
      const accuracy = Math.round((stats.correct / (stats.attempts || 1)) * 100);
      onFinish({
        completed: items.length,
        totalAttempts: stats.attempts,
        correct: stats.correct,
        wrong: stats.wrong,
        accuracy,
        timeSeconds
      });
    }
  };

  const handleReveal = () => {
    setShowAnswer(true);
  };

  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="text-sm font-medium text-slate-500">
            {currentIndex + 1} / {items.length}
          </div>
          <div className="w-6" /> {/* Spacer */}
        </div>

        <div className="flex flex-col items-center mb-10">
          <AudioButton 
            src={currentItem.audioSrc} 
            autoPlay={true}
            size={48}
            className="w-24 h-24 mb-8"
          />

          {mode === 'practice' && (
            <div className="text-8xl font-jp text-slate-800 mb-4">
              {currentItem.symbol}
            </div>
          )}

          {mode === 'test' && showAnswer && (
            <div className="text-6xl font-jp text-slate-800 mb-4 animate-fade-in">
              {currentItem.symbol}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="w-full relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={status === 'correct'}
            placeholder="Type romaji..."
            className={`w-full text-center text-2xl py-4 px-6 rounded-2xl border-2 outline-none transition-all ${
              status === 'correct' 
                ? 'bg-emerald-50 border-emerald-400 text-emerald-700' 
                : status === 'wrong'
                  ? 'bg-rose-50 border-rose-400 text-rose-700'
                  : 'bg-slate-50 border-slate-200 focus:border-indigo-400 focus:bg-white text-slate-800'
            }`}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {status === 'correct' && <CheckCircle2 className="text-emerald-500" size={28} />}
            {status === 'wrong' && <XCircle className="text-rose-500" size={28} />}
          </div>
        </form>

        {status === 'wrong' && (
          <div className="mt-6 flex justify-between items-center animate-fade-in">
            <button
              onClick={() => {
                setInput('');
                setStatus('idle');
                inputRef.current?.focus();
              }}
              className="text-slate-500 hover:text-slate-700 font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleReveal}
              className="text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Show Answer
            </button>
          </div>
        )}

        {showAnswer && (
          <div className="mt-6 text-center animate-fade-in">
            <div className="text-sm text-slate-500 mb-1">Correct Answer</div>
            <div className="text-2xl font-bold text-indigo-600">{currentItem.label}</div>
            <button
              onClick={handleNext}
              className="mt-4 w-full flex items-center justify-center py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
            >
              Next <ArrowRight size={18} className="ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
