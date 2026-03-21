import React from 'react';
import { Trophy, Clock, Target, RotateCcw, ArrowLeft } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { wordStudyContent } from '../data/wordStudyContent';
import { studyContent } from '../data/studyContent';
import { RunStats, WordStudyMode } from '../types';
import { useBestScore } from '../hooks/useBestScore';
import { formatDuration } from '../utils/formatDuration';

interface Props {
  title: string;
  language: AppLanguage;
  stats: RunStats;
  onRestart: () => void;
  onBack: () => void;
  mode: WordStudyMode;
}

const isBetterWordRun = (candidate: RunStats, incumbent: RunStats) =>
  candidate.timeSeconds < incumbent.timeSeconds ||
  (candidate.timeSeconds === incumbent.timeSeconds && candidate.accuracy > incumbent.accuracy);

export const WordResultPanel: React.FC<Props> = ({
  title,
  language,
  stats,
  onRestart,
  onBack,
  mode
}) => {
  const copy = studyContent[language];
  const wordCopy = wordStudyContent[language];
  const { bestScore, isNewBest } = useBestScore<RunStats>({
    storageKey: `best-score-word-${title.toLowerCase()}-${mode}`,
    candidate: stats,
    isBetter: isBetterWordRun
  });

  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <Trophy size={32} />
        </div>

        <h2 className="mb-2 text-2xl font-bold text-slate-800">{copy.result.runCompleted}</h2>
        <p className="mb-8 text-slate-500">
          {wordCopy.completedSummary(stats.completed, stats.modeLabel || wordCopy.modes[mode])}
        </p>

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
            <div className="text-2xl font-bold text-slate-700">{formatDuration(stats.timeSeconds)}</div>
            {bestScore && !isNewBest && (
              <div className="mt-1 text-xs text-slate-500">{copy.common.best}: {formatDuration(bestScore.timeSeconds)}</div>
            )}
          </div>
        </div>

        <div className="grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-2">
          <button
            onClick={onRestart}
            className="flex w-full items-center justify-center rounded-xl bg-indigo-600 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <RotateCcw size={18} className="mr-2" /> {copy.common.playAgain}
          </button>
          <button
            onClick={onBack}
            className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-3 font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft size={18} className="mr-2" /> {wordCopy.backToDictionary}
          </button>
        </div>
      </div>
    </div>
  );
};
