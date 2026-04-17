import React from 'react';
import { KanaSection, RunStats } from '../types';
import { Trophy, Clock, Target, RotateCcw, ArrowLeft, Zap, Flame } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { studyContent } from '../data/studyContent';
import { getTypingModeStorageKey, isBetterTypingRun } from '../utils/typing';
import { isBetterListeningRun } from '../utils/listening';
import { useBestScore } from '../hooks/useBestScore';
import { formatDuration } from '../utils/formatDuration';

interface Props {
  section: KanaSection;
  language: AppLanguage;
  stats: RunStats;
  onRestart: () => void;
  onBack: () => void;
  variant: 'typing' | 'drawing' | 'listening';
}

const isBetterDrawingRun = (candidate: RunStats, incumbent: RunStats) => {
  const mode = candidate.mode ?? 'test';

  if (mode === 'speed') {
    if (candidate.correct !== incumbent.correct) {
      return candidate.correct > incumbent.correct;
    }

    if ((candidate.speed ?? 0) !== (incumbent.speed ?? 0)) {
      return (candidate.speed ?? 0) > (incumbent.speed ?? 0);
    }

    if (candidate.accuracy !== incumbent.accuracy) {
      return candidate.accuracy > incumbent.accuracy;
    }

    return candidate.timeSeconds < incumbent.timeSeconds;
  }

  if (mode === 'memory') {
    if (candidate.correct !== incumbent.correct) {
      return candidate.correct > incumbent.correct;
    }

    if ((candidate.bestStreak ?? 0) !== (incumbent.bestStreak ?? 0)) {
      return (candidate.bestStreak ?? 0) > (incumbent.bestStreak ?? 0);
    }

    return candidate.timeSeconds < incumbent.timeSeconds;
  }

  return (
    candidate.timeSeconds < incumbent.timeSeconds ||
    (candidate.timeSeconds === incumbent.timeSeconds && candidate.accuracy > incumbent.accuracy)
  );
};

export const StudyResultPanel: React.FC<Props> = ({
  section,
  language,
  stats,
  onRestart,
  onBack,
  variant
}) => {
  const copy = studyContent[language];
  const storageKey =
    variant === 'drawing'
      ? `best-score-drawing-${section.id}-${stats.mode ?? 'test'}`
      : variant === 'listening'
        ? `best-score-listening-${section.id}-${stats.mode ?? 'recognition'}`
        : getTypingModeStorageKey(section.id, (stats.mode as 'current' | 'reverse' | 'timed') ?? 'current');
  const bestScoreComparator =
    variant === 'typing'
      ? isBetterTypingRun
      : variant === 'drawing'
        ? isBetterDrawingRun
        : isBetterListeningRun;
  const { bestScore, isNewBest } = useBestScore<RunStats>({
    storageKey,
    candidate: stats,
    isBetter: bestScoreComparator
  });

  const resultCards = [
    {
      key: 'accuracy',
      icon: <Target size={16} className="mr-1" />,
      label: copy.common.accuracy,
      value: `${stats.accuracy}%`,
      detail: copy.common.correctWrongSummary(stats.correct, stats.wrong)
    },
    {
      key: 'time',
      icon: <Clock size={16} className="mr-1" />,
      label: copy.common.time,
      value: formatDuration(stats.timeSeconds),
      detail:
        stats.timeLimitSeconds
          ? `${copy.common.time}: ${formatDuration(stats.timeLimitSeconds)}`
          : bestScore && !isNewBest
            ? `${copy.common.best}: ${formatDuration(bestScore.timeSeconds)}`
            : undefined
    }
  ];

  if ((variant === 'typing' || variant === 'drawing' || variant === 'listening') && typeof stats.speed === 'number') {
    resultCards.push({
      key: 'speed',
      icon: <Zap size={16} className="mr-1" />,
      label: copy.common.speed,
      value: `${stats.speed}/min`,
      detail:
        bestScore && !isNewBest && typeof bestScore.speed === 'number'
          ? `${copy.common.best}: ${bestScore.speed}/min`
          : undefined
    });
  }

  if ((variant === 'typing' || variant === 'drawing' || variant === 'listening') && typeof stats.bestStreak === 'number') {
    resultCards.push({
      key: 'streak',
      icon: <Flame size={16} className="mr-1" />,
      label: copy.common.streak,
      value: `${stats.bestStreak}`,
      detail: undefined
    });
  }

  if (variant === 'listening' && typeof stats.averageScore === 'number') {
    resultCards.push({
      key: 'score',
      icon: <Target size={16} className="mr-1" />,
      label: copy.listening.score,
      value: `${stats.averageScore}%`,
      detail: undefined
    });
  }

  return (
    <div className="flex flex-col items-center py-8">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <Trophy size={32} />
        </div>

        <h2 className="mb-2 text-2xl font-bold text-slate-800">{copy.result.runCompleted}</h2>
        <p className="mb-4 text-slate-500">{copy.result.completedSummary(variant, stats.completed)}</p>

        {(variant === 'typing' || variant === 'drawing' || variant === 'listening') && stats.modeLabel && (
          <div className="mb-8 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
            {variant === 'typing'
              ? copy.studyRun.modeLabel
              : variant === 'drawing'
                ? copy.drawing.modeLabel
                : copy.listening.modeLabel}
            {`: ${stats.modeLabel}`}
          </div>
        )}

        {isNewBest && (
          <div className="mb-6 inline-block rounded-lg bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800 animate-pulse">
            {copy.common.newBestScore}
          </div>
        )}

        <div className="mb-8 grid grid-cols-2 gap-4">
          {resultCards.map((card) => (
            <div key={card.key} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-1 flex items-center justify-center text-slate-400">
                {card.icon}
                <span className="text-xs font-medium uppercase tracking-wider">{card.label}</span>
              </div>
              <div className="text-2xl font-bold text-slate-700">{card.value}</div>
              {card.detail && <div className="mt-1 text-xs text-slate-500">{card.detail}</div>}
            </div>
          ))}
        </div>

        <div className="flex flex-col space-y-3">
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
            <ArrowLeft size={18} className="mr-2" /> {copy.selection.backToSelection}
          </button>
        </div>
      </div>
    </div>
  );
};
