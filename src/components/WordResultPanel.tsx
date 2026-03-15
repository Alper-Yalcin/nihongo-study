import React, { useEffect, useState } from 'react';
import { RunStats } from '../types';
import { Trophy, Clock, Target, RotateCcw, ArrowLeft } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { studyContent } from '../data/studyContent';

interface Props {
  title: string;
  language: AppLanguage;
  stats: RunStats;
  onRestart: () => void;
  onBack: () => void;
  mode: 'typing' | 'test';
}

export const WordResultPanel: React.FC<Props> = ({
  title,
  language,
  stats,
  onRestart,
  onBack,
  mode
}) => {
  const copy = studyContent[language];
  const [bestScore, setBestScore] = useState<RunStats | null>(null);
  const [isNewBest, setIsNewBest] = useState(false);

  useEffect(() => {
    const key = `best-score-word-${title.toLowerCase()}-${mode}`;
    const saved = localStorage.getItem(key);
    let newBest = false;

    if (saved) {
      const parsed = JSON.parse(saved) as RunStats;
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
  }, [stats, title, mode]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <Trophy size={32} />
        </div>

        <h2 className="mb-2 text-2xl font-bold text-slate-800">{copy.result.runCompleted}</h2>
        <p className="mb-8 text-slate-500">{copy.wordResult.completedSummary(stats.completed, mode)}</p>

        {isNewBest && (
          <div className="mb-6 inline-block rounded-lg bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800 animate-pulse">
            {copy.common.newBestScore}
          </div>
        )}

        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="mb-1 flex items-center justify-center text-slate-400">
              <Target size={16} className="mr-1" />
              <span className="text-xs font-medium uppercase tracking-wider">{copy.common.accuracy}</span>
            </div>
            <div className="text-2xl font-bold text-slate-700">{stats.accuracy}%</div>
            <div className="mt-1 text-xs text-slate-500">
              {copy.common.correctWrongSummary(stats.correct, stats.wrong)}
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="mb-1 flex items-center justify-center text-slate-400">
              <Clock size={16} className="mr-1" />
              <span className="text-xs font-medium uppercase tracking-wider">{copy.common.time}</span>
            </div>
            <div className="text-2xl font-bold text-slate-700">{formatTime(stats.timeSeconds)}</div>
            {bestScore && !isNewBest && (
              <div className="mt-1 text-xs text-slate-500">{copy.common.best}: {formatTime(bestScore.timeSeconds)}</div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-slate-100 pt-6">
          <button
            onClick={onRestart}
            className="mb-3 flex w-full items-center justify-center rounded-xl bg-indigo-600 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <RotateCcw size={18} className="mr-2" /> {copy.common.playAgain}
          </button>
          <button
            onClick={onBack}
            className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-3 font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft size={18} className="mr-2" /> {copy.wordTyping.backToDictionary}
          </button>
        </div>
      </div>
    </div>
  );
};
