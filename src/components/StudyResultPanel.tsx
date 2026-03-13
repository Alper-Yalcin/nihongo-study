import React, { useEffect, useState } from 'react';
import { KanaSection, RunStats } from '../types';
import { Trophy, Clock, Target, RotateCcw, ArrowLeft } from 'lucide-react';

interface Props {
  section: KanaSection;
  stats: RunStats;
  onRestart: () => void;
  onBack: () => void;
  isDrawing?: boolean;
}

export const StudyResultPanel: React.FC<Props> = ({ section, stats, onRestart, onBack, isDrawing = false }) => {
  const [bestScore, setBestScore] = useState<RunStats | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);

  useEffect(() => {
    const key = `best-score-${isDrawing ? 'drawing-' : ''}${section.id}`;
    const saved = localStorage.getItem(key);
    let newBest = false;
    
    if (saved) {
      const parsed = JSON.parse(saved) as RunStats;
      // Best score is determined by shortest time to complete the same pool
      // For simplicity, we just compare time. A more complex app might compare accuracy too.
      if (stats.timeSeconds < parsed.timeSeconds || (stats.timeSeconds === parsed.timeSeconds && stats.accuracy > parsed.accuracy)) {
        newBest = true;
        localStorage.setItem(key, JSON.stringify(stats));
      } else {
        setBestScore(parsed);
      }
    } else {
      newBest = true;
      localStorage.setItem(key, JSON.stringify(stats));
    }
    
    if (newBest) {
      setBestScore(stats);
      setIsNewBest(true);
    }
  }, [stats, section.id, isDrawing]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy size={32} />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Run Completed!</h2>
        <p className="text-slate-500 mb-8">You {isDrawing ? 'drew' : 'studied'} {stats.completed} characters.</p>

        {isNewBest && (
          <div className="bg-amber-100 text-amber-800 text-sm font-bold py-2 px-4 rounded-lg mb-6 inline-block animate-pulse">
            🎉 New Best Score!
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-center text-slate-400 mb-1">
              <Target size={16} className="mr-1" />
              <span className="text-xs font-medium uppercase tracking-wider">Accuracy</span>
            </div>
            <div className="text-2xl font-bold text-slate-700">{stats.accuracy}%</div>
            <div className="text-xs text-slate-500 mt-1">{stats.correct} correct, {stats.wrong} wrong</div>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-center text-slate-400 mb-1">
              <Clock size={16} className="mr-1" />
              <span className="text-xs font-medium uppercase tracking-wider">Time</span>
            </div>
            <div className="text-2xl font-bold text-slate-700">{formatTime(stats.timeSeconds)}</div>
            {bestScore && !isNewBest && (
              <div className="text-xs text-slate-500 mt-1">Best: {formatTime(bestScore.timeSeconds)}</div>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            <RotateCcw size={18} className="mr-2" /> Play Again
          </button>
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" /> Back to Selection
          </button>
        </div>

      </div>
    </div>
  );
};
