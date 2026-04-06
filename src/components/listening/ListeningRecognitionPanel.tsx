import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AppLanguage } from '../../data/appPreferences';
import { studyContent } from '../../data/studyContent';
import { ListeningItem, RunStats } from '../../types';
import {
  buildListeningRunStats,
  buildRecognitionOptions,
  getAcceptedListeningCharacterIds,
  isCorrectListeningRecognitionAnswer
} from '../../utils/listening';
import { ArrowLeft, CheckCircle2, SkipForward, XCircle } from 'lucide-react';
import { AudioButton } from './AudioButton';

interface Props {
  language: AppLanguage;
  items: ListeningItem[];
  sourceItems: ListeningItem[];
  onFinish: (stats: RunStats) => void;
  onCancel: () => void;
}

interface SessionStats {
  attempts: number;
  correct: number;
  wrong: number;
  currentStreak: number;
  bestStreak: number;
  totalResponseMs: number;
}

const initialSessionStats: SessionStats = {
  attempts: 0,
  correct: 0,
  wrong: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalResponseMs: 0
};

export const ListeningRecognitionPanel: React.FC<Props> = ({
  language,
  items,
  sourceItems,
  onFinish,
  onCancel
}) => {
  const copy = studyContent[language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [sessionStats, setSessionStats] = useState<SessionStats>(initialSessionStats);
  const [questionToken, setQuestionToken] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const sessionStatsRef = useRef(initialSessionStats);
  const questionStartedAtRef = useRef(Date.now());
  const transitionTimeoutRef = useRef<number | null>(null);

  const currentItem = items[currentIndex];

  const options = useMemo(() => {
    if (!currentItem) {
      return [];
    }

    return buildRecognitionOptions(currentItem, sourceItems, Math.min(4, sourceItems.length || 1));
  }, [currentItem, sourceItems]);

  useEffect(() => {
    if (!currentItem) {
      return;
    }

    questionStartedAtRef.current = Date.now();
    setQuestionToken((previousToken) => previousToken + 1);
  }, [currentItem]);

  useEffect(
    () => () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    },
    []
  );

  const finishRun = (snapshot: SessionStats) => {
    const timeSeconds = Math.max(1, Math.floor((Date.now() - startedAt) / 1000));

    onFinish(
      buildListeningRunStats({
        attempts: snapshot.attempts,
        correct: snapshot.correct,
        wrong: snapshot.wrong,
        completed: items.length,
        timeSeconds,
        mode: 'recognition',
        modeLabel: copy.listening.recognitionMode,
        bestStreak: snapshot.bestStreak,
        totalResponseMs: snapshot.totalResponseMs
      })
    );
  };

  const goToNextQuestion = () => {
    if (currentIndex >= items.length - 1) {
      finishRun(sessionStatsRef.current);
      return;
    }

    setCurrentIndex((previousIndex) => previousIndex + 1);
    setSelectedId(null);
    setFeedback('idle');
  };

  const recordAnswer = (isCorrect: boolean, resolvedSelectedId: string | null) => {
    if (!currentItem || feedback !== 'idle') {
      return;
    }

    const responseMs = Date.now() - questionStartedAtRef.current;
    const nextStats: SessionStats = {
      attempts: sessionStatsRef.current.attempts + 1,
      correct: sessionStatsRef.current.correct + (isCorrect ? 1 : 0),
      wrong: sessionStatsRef.current.wrong + (isCorrect ? 0 : 1),
      currentStreak: isCorrect ? sessionStatsRef.current.currentStreak + 1 : 0,
      bestStreak: isCorrect
        ? Math.max(sessionStatsRef.current.bestStreak, sessionStatsRef.current.currentStreak + 1)
        : sessionStatsRef.current.bestStreak,
      totalResponseMs: sessionStatsRef.current.totalResponseMs + responseMs
    };

    sessionStatsRef.current = nextStats;
    setSessionStats(nextStats);
    setSelectedId(resolvedSelectedId);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    transitionTimeoutRef.current = window.setTimeout(() => {
      goToNextQuestion();
    }, isCorrect ? 650 : 1000);
  };

  if (!currentItem) {
    return null;
  }

  const acceptedCharacterIds = new Set(getAcceptedListeningCharacterIds(currentItem));
  const acceptedKana = sourceItems
    .filter((item) => acceptedCharacterIds.has(item.id))
    .map((item) => item.kana)
    .join(' / ');

  const progressPercent = items.length > 0 ? ((currentIndex + 1) / items.length) * 100 : 0;

  return (
    <div className="flex flex-col items-center py-6">
      <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
          >
            <ArrowLeft size={16} className="mr-1" /> {copy.listening.back}
          </button>
          <div className="text-sm font-medium text-slate-500">
            {currentIndex + 1} / {items.length}
          </div>
        </div>

        <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-rose-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
          <span>{copy.listening.score}: {sessionStats.correct}</span>
          <span>{copy.common.streak}: {sessionStats.currentStreak}</span>
          <span>{copy.common.accuracy}: {sessionStats.attempts > 0 ? Math.round((sessionStats.correct / sessionStats.attempts) * 100) : 0}%</span>
        </div>

        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            {copy.listening.chooseKana}
          </div>
          <AudioButton
            src={currentItem.audioSrc}
            language={language}
            autoPlay={true}
            autoPlayToken={questionToken}
            size={40}
            className="mb-3 h-20 w-20"
          />
          <div className="text-sm text-slate-500">{copy.listening.replayHint}</div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const isSelected = selectedId === option.id;
            const isCorrectOption = acceptedCharacterIds.has(option.id);
            const showCorrect = feedback !== 'idle' && isCorrectOption;
            const showWrong = feedback === 'wrong' && isSelected && !isCorrectOption;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => recordAnswer(isCorrectListeningRecognitionAnswer(currentItem, option.id), option.id)}
                disabled={feedback !== 'idle'}
                className={`rounded-2xl border px-4 py-5 text-center transition-all ${
                  showCorrect
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : showWrong
                      ? 'border-rose-300 bg-rose-50 text-rose-700'
                      : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-rose-200 hover:bg-rose-50'
                } ${feedback !== 'idle' ? 'cursor-default' : ''}`}
              >
                <div className="mb-1 text-4xl font-jp">{option.kana}</div>
                <div className="text-sm font-medium text-slate-500">{option.romaji}</div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex min-h-14 items-center justify-between gap-3">
          <div className="text-sm font-medium">
            {feedback === 'correct' && (
              <span className="inline-flex items-center text-emerald-600">
                <CheckCircle2 size={18} className="mr-2" />
                {copy.common.correct}
              </span>
            )}
            {feedback === 'wrong' && (
              <span className="inline-flex items-center text-rose-600">
                <XCircle size={18} className="mr-2" />
                {copy.common.wrong}: {acceptedKana || currentItem.kana} ({currentItem.romaji})
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => recordAnswer(false, null)}
            disabled={feedback !== 'idle'}
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SkipForward size={16} className="mr-2" /> {copy.listening.skip}
          </button>
        </div>
      </div>
    </div>
  );
};
