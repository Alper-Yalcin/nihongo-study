import React, { useEffect, useRef, useState } from 'react';
import { AppLanguage } from '../../data/appPreferences';
import { studyContent } from '../../data/studyContent';
import { ListeningItem, RunStats } from '../../types';
import {
  buildListeningRunStats,
  isCorrectListeningTypingAnswer
} from '../../utils/listening';
import { ArrowLeft, CheckCircle2, SkipForward, XCircle } from 'lucide-react';
import { AudioButton } from './AudioButton';

interface Props {
  language: AppLanguage;
  items: ListeningItem[];
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

export const ListeningTypingPanel: React.FC<Props> = ({
  language,
  items,
  onFinish,
  onCancel
}) => {
  const copy = studyContent[language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [sessionStats, setSessionStats] = useState<SessionStats>(initialSessionStats);
  const [questionToken, setQuestionToken] = useState(0);
  const [startedAt] = useState(() => Date.now());
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionStatsRef = useRef(initialSessionStats);
  const questionStartedAtRef = useRef(Date.now());
  const transitionTimeoutRef = useRef<number | null>(null);

  const currentItem = items[currentIndex];

  useEffect(() => {
    if (!currentItem) {
      return;
    }

    questionStartedAtRef.current = Date.now();
    setQuestionToken((previousToken) => previousToken + 1);
    setInput('');
    setFeedback('idle');
    inputRef.current?.focus();
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
        mode: 'typing',
        modeLabel: copy.listening.typingMode,
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
  };

  const recordAnswer = (isCorrect: boolean) => {
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
    setFeedback(isCorrect ? 'correct' : 'wrong');

    transitionTimeoutRef.current = window.setTimeout(() => {
      goToNextQuestion();
    }, isCorrect ? 650 : 1050);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!currentItem || !input.trim() || feedback !== 'idle') {
      return;
    }

    recordAnswer(isCorrectListeningTypingAnswer(currentItem, input));
  };

  const handleSkip = () => {
    if (feedback !== 'idle') {
      return;
    }

    recordAnswer(false);
  };

  if (!currentItem) {
    return null;
  }

  const acceptedKana = (currentItem.acceptedCharacters?.map((character) => character.symbol) ?? [currentItem.kana]).join(' / ');

  const progressPercent = items.length > 0 ? ((currentIndex + 1) / items.length) * 100 : 0;
  const liveAccuracy = sessionStats.attempts > 0 ? Math.round((sessionStats.correct / sessionStats.attempts) * 100) : 0;

  return (
    <div className="flex flex-col items-center py-6">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
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
          <span>{copy.common.accuracy}: {liveAccuracy}%</span>
        </div>

        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            {copy.listening.typeRomaji}
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

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={feedback !== 'idle'}
              placeholder={copy.listening.placeholder}
              className={`w-full rounded-2xl border-2 px-5 py-4 pr-14 text-center text-2xl outline-none transition-all ${
                feedback === 'correct'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                  : feedback === 'wrong'
                    ? 'border-rose-300 bg-rose-50 text-rose-700'
                    : 'border-slate-200 bg-slate-50 text-slate-800 focus:border-rose-300 focus:bg-white'
              }`}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
              {feedback === 'correct' && <CheckCircle2 size={24} className="text-emerald-500" />}
              {feedback === 'wrong' && <XCircle size={24} className="text-rose-500" />}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={handleSkip}
              disabled={feedback !== 'idle'}
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SkipForward size={16} className="mr-2" /> {copy.listening.skip}
            </button>
            <button
              type="submit"
              disabled={feedback !== 'idle' || !input.trim()}
              className="rounded-xl bg-rose-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copy.listening.submit}
            </button>
          </div>
        </form>

        <div className="mt-6 min-h-14 text-center text-sm font-medium">
          {feedback === 'correct' && (
            <span className="inline-flex items-center text-emerald-600">
              <CheckCircle2 size={18} className="mr-2" />
              {copy.common.correct}
            </span>
          )}
          {feedback === 'wrong' && (
            <span className="inline-flex items-center text-rose-600">
              <XCircle size={18} className="mr-2" />
              {copy.common.wrong}: {acceptedKana} ({currentItem.romaji})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
