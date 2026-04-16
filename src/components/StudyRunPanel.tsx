import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KanaSection, Character, RunStats, TypingMode } from '../types';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { AppLanguage } from '../data/appPreferences';
import { studyContent } from '../data/studyContent';
import {
  calculateAccuracy,
  calculateSpeed,
  isAcceptedKanaAnswer,
  isAcceptedRomajiAnswer,
  TIMED_MODE_DURATION_SECONDS
} from '../utils/typing';
import { formatDuration } from '../utils/formatDuration';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import { StudySession } from '../features/kana/domain/studySession';
import {
  createStudySession,
  getSessionConfigNumber,
  isSessionKeyMatch
} from '../features/kana/session/sessionEngine';
import {
  completeAndPersistSession,
  persistSessionState,
  recordAnswerAndPersistSession,
  syncProgressFromSessionAnswer,
  updateSessionConfigAndPersist
} from '../features/kana/session/sessionRunCoordinator';

interface Props {
  script: 'hiragana' | 'katakana';
  section: KanaSection;
  language: AppLanguage;
  selectedGroupIds: Set<string>;
  typingMode: TypingMode;
  onFinish: (stats: RunStats) => void;
  onCancel: () => void;
}

interface SessionStats {
  correctCount: number;
  wrongCount: number;
  attempts: number;
  currentStreak: number;
  bestStreak: number;
  totalAnswerMs: number;
}

const initialSessionStats: SessionStats = {
  correctCount: 0,
  wrongCount: 0,
  attempts: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalAnswerMs: 0
};

const resolveSessionType = (mode: TypingMode) => (mode === 'timed' ? 'speed' : 'learn');

const findCharacterIndex = (items: Character[], characterId: string | null) => {
  if (!characterId) {
    return 0;
  }

  const index = items.findIndex((item) => item.id === characterId);
  return index >= 0 ? index : 0;
};

export const StudyRunPanel: React.FC<Props> = ({
  script,
  section,
  language,
  selectedGroupIds,
  typingMode,
  onFinish,
  onCancel
}) => {
  const copy = studyContent[language];
  const {
    scope,
    activeSession,
    getProgress,
    saveProgress,
    saveSession,
    setActiveSession
  } = useKanaProgressStore();
  const initialPool = useMemo(() => {
    const chars: Character[] = [];
    section.groups.forEach((group) => {
      if (selectedGroupIds.has(group.id)) {
        chars.push(...group.characters);
      }
    });
    return chars;
  }, [section, selectedGroupIds]);
  const characterMap = useMemo(
    () => new Map(section.groups.flatMap((group) => group.characters).map((character) => [character.id, character])),
    [section]
  );

  const isReverseMode = typingMode === 'reverse';
  const isTimedMode = typingMode === 'timed';
  const sessionKey = `kana:${scope}:${script}:typing:${typingMode}`;
  const activeRunSession = isSessionKeyMatch(activeSession, sessionKey) ? activeSession : null;

  const [pool, setPool] = useState<Character[]>(initialPool);
  const [currentChar, setCurrentChar] = useState<Character | null>(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [sessionStats, setSessionStats] = useState<SessionStats>(initialSessionStats);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [roundStartedAt, setRoundStartedAt] = useState(() => Date.now());
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const sessionStatsRef = useRef(sessionStats);
  const sessionCompleteRef = useRef(isSessionComplete);
  const transitionTimeoutRef = useRef<number | null>(null);
  const sessionRef = useRef<StudySession | null>(null);
  const sessionPersistenceContext = {
    sessionRef,
    saveSession,
    setActiveSession
  };
  const progressSyncContext = {
    getProgress,
    saveProgress
  };

  useEffect(() => {
    sessionStatsRef.current = sessionStats;
  }, [sessionStats]);

  useEffect(() => {
    sessionCompleteRef.current = isSessionComplete;
  }, [isSessionComplete]);

  const focusInput = () => {
    window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const clearTransitionTimeout = () => {
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
  };

  const pickRandomChar = (source: Character[]) => {
    if (source.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * source.length);
    return source[randomIndex];
  };

  const buildSessionConfig = (stats: SessionStats, timeSeconds: number) => ({
    sessionKey,
    variant: typingMode,
    sectionId: section.id,
    selectedGroupIds: [...selectedGroupIds],
    elapsedSeconds: timeSeconds,
    correctCount: stats.correctCount,
    wrongCount: stats.wrongCount,
    attempts: stats.attempts,
    currentStreak: stats.currentStreak,
    bestStreak: stats.bestStreak,
    totalAnswerMs: stats.totalAnswerMs
  });

  const finalizeRun = (timeSeconds: number) => {
    if (sessionCompleteRef.current) {
      return;
    }

    clearTransitionTimeout();
    sessionCompleteRef.current = true;
    setIsSessionComplete(true);

    completeAndPersistSession(sessionPersistenceContext);

    const snapshot = sessionStatsRef.current;
    const completed = isTimedMode ? snapshot.correctCount : initialPool.length;
    const accuracy = calculateAccuracy(snapshot.correctCount, snapshot.attempts);
    const averageAnswerMs =
      snapshot.attempts > 0 ? Math.round(snapshot.totalAnswerMs / snapshot.attempts) : 0;

    onFinish({
      completed,
      totalAttempts: snapshot.attempts,
      correct: snapshot.correctCount,
      wrong: snapshot.wrongCount,
      accuracy,
      timeSeconds,
      mode: typingMode,
      modeLabel,
      speed: calculateSpeed(snapshot.correctCount, timeSeconds),
      bestStreak: snapshot.bestStreak,
      averageAnswerMs,
      timeLimitSeconds: isTimedMode ? TIMED_MODE_DURATION_SECONDS : undefined
    });
  };

  const restoreSession = (session: StudySession) => {
    clearTransitionTimeout();

    const restoredPool = session.itemIds
      .map((itemId) => characterMap.get(itemId) ?? null)
      .filter((item): item is Character => item !== null);

    if (restoredPool.length === 0) {
      sessionRef.current = null;
      return false;
    }

    const restoredCurrentChar = restoredPool[session.currentIndex] ?? restoredPool[0];
    const restoredStats: SessionStats = {
      correctCount: getSessionConfigNumber(session, 'correctCount') ?? 0,
      wrongCount: getSessionConfigNumber(session, 'wrongCount') ?? 0,
      attempts: getSessionConfigNumber(session, 'attempts') ?? 0,
      currentStreak: getSessionConfigNumber(session, 'currentStreak') ?? 0,
      bestStreak: getSessionConfigNumber(session, 'bestStreak') ?? 0,
      totalAnswerMs: getSessionConfigNumber(session, 'totalAnswerMs') ?? 0
    };

    sessionRef.current = session;
    sessionStatsRef.current = restoredStats;
    sessionCompleteRef.current = false;
    setIsSessionComplete(false);
    setPool(restoredPool);
    setCurrentChar(restoredCurrentChar);
    setInput('');
    setFeedback('idle');
    setSessionStats(restoredStats);
    setElapsedSeconds(getSessionConfigNumber(session, 'elapsedSeconds') ?? 0);
    setRoundStartedAt(Date.now());
    focusInput();

    return true;
  };

  const startNewSession = () => {
    clearTransitionTimeout();
    sessionCompleteRef.current = false;
    setIsSessionComplete(false);
    setInput('');
    setFeedback('idle');
    sessionStatsRef.current = initialSessionStats;
    setSessionStats(initialSessionStats);
    setElapsedSeconds(0);
    setRoundStartedAt(Date.now());

    if (initialPool.length === 0) {
      setPool([]);
      setCurrentChar(null);
      sessionRef.current = null;
      return;
    }

    const initialChar = pickRandomChar(initialPool);
    const initialIndex = findCharacterIndex(initialPool, initialChar?.id ?? null);
    const nextSession = createStudySession({
      script,
      type: resolveSessionType(typingMode),
      mode: 'typing',
      itemIds: initialPool.map((character) => character.id),
      currentIndex: initialIndex,
      config: buildSessionConfig(initialSessionStats, 0)
    });

    persistSessionState(sessionPersistenceContext, nextSession);
    setPool(initialPool);
    setCurrentChar(initialChar ?? initialPool[0]);
    focusInput();
  };

  useEffect(() => {
    if (activeRunSession && restoreSession(activeRunSession)) {
      return () => {
        clearTransitionTimeout();
      };
    }

    startNewSession();

    return () => {
      clearTransitionTimeout();
    };
  }, [activeRunSession?.id, initialPool, typingMode]);

  useEffect(() => {
    if (isSessionComplete) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((previousSeconds) => previousSeconds + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isSessionComplete]);

  useEffect(() => {
    if (isTimedMode && elapsedSeconds >= TIMED_MODE_DURATION_SECONDS) {
      finalizeRun(TIMED_MODE_DURATION_SECONDS);
    }
  }, [elapsedSeconds, isTimedMode]);

  useEffect(() => {
    if (!isSessionComplete) {
      focusInput();
    }
  }, [currentChar, feedback, isSessionComplete]);

  useEffect(() => {
    if (!isTimedMode || !sessionRef.current || sessionCompleteRef.current) {
      return;
    }

    updateSessionConfigAndPersist(sessionPersistenceContext, {
      config: buildSessionConfig(sessionStatsRef.current, elapsedSeconds)
    });
  }, [elapsedSeconds, isTimedMode]);

  const isCorrectAnswer = (value: string, character: Character) =>
    isReverseMode
      ? isAcceptedKanaAnswer(value, character.symbol)
      : isAcceptedRomajiAnswer(value, character.label);

  const modeLabel =
    typingMode === 'current'
      ? copy.studyRun.currentMode
      : typingMode === 'reverse'
        ? copy.studyRun.reverseMode
        : copy.studyRun.timedMode;

  const evaluateAnswer = (rawValue: string) => {
    if (!currentChar || !rawValue.trim() || feedback !== 'idle' || isSessionComplete || !sessionRef.current) {
      return;
    }

    const answerDuration = Date.now() - roundStartedAt;
    const isCorrect = isCorrectAnswer(rawValue, currentChar);
    const answeredAt = new Date().toISOString();
    const nextStats: SessionStats = {
      correctCount: sessionStatsRef.current.correctCount + (isCorrect ? 1 : 0),
      wrongCount: sessionStatsRef.current.wrongCount + (isCorrect ? 0 : 1),
      attempts: sessionStatsRef.current.attempts + 1,
      currentStreak: isCorrect ? sessionStatsRef.current.currentStreak + 1 : 0,
      bestStreak: isCorrect
        ? Math.max(sessionStatsRef.current.bestStreak, sessionStatsRef.current.currentStreak + 1)
        : sessionStatsRef.current.bestStreak,
      totalAnswerMs: sessionStatsRef.current.totalAnswerMs + answerDuration
    };

    const answerRecord = {
      itemId: currentChar.id,
      mode: 'typing' as const,
      correct: isCorrect,
      answeredAt,
      latencyMs: answerDuration,
      hintsUsed: 0,
      retries: 0,
      variant: typingMode,
      responseItemId: null
    };
    syncProgressFromSessionAnswer(progressSyncContext, answerRecord);

    setFeedback(isCorrect ? 'correct' : 'wrong');
    setSessionStats(nextStats);
    clearTransitionTimeout();

    if (isCorrect) {
      if (isTimedMode) {
        const nextChar = pickRandomChar(initialPool);
        const nextIndex = findCharacterIndex(initialPool, nextChar?.id ?? null);
        recordAnswerAndPersistSession(sessionPersistenceContext, answerRecord, {
          itemIds: initialPool.map((character) => character.id),
          currentIndex: nextIndex,
          config: buildSessionConfig(nextStats, elapsedSeconds)
        });
        transitionTimeoutRef.current = window.setTimeout(() => {
          if (sessionCompleteRef.current) {
            return;
          }

          setFeedback('idle');
          setInput('');
          setPool(initialPool);
          setCurrentChar(nextChar);
          setRoundStartedAt(Date.now());
        }, 220);
        return;
      }

      const nextPool = pool.filter((character) => character.id !== currentChar.id);
      const nextChar = pickRandomChar(nextPool);
      const nextIndex = findCharacterIndex(nextPool, nextChar?.id ?? null);
      recordAnswerAndPersistSession(sessionPersistenceContext, answerRecord, {
        itemIds: nextPool.map((character) => character.id),
        currentIndex: nextIndex,
        config: buildSessionConfig(nextStats, elapsedSeconds)
      });
      transitionTimeoutRef.current = window.setTimeout(() => {
        if (sessionCompleteRef.current) {
          return;
        }

        if (nextPool.length === 0) {
          finalizeRun(elapsedSeconds);
          return;
        }

        setPool(nextPool);
        setFeedback('idle');
        setInput('');
        setCurrentChar(nextChar);
        setRoundStartedAt(Date.now());
      }, 280);
      return;
    }

    const currentIndex = findCharacterIndex(pool, currentChar.id);
    recordAnswerAndPersistSession(sessionPersistenceContext, answerRecord, {
      itemIds: pool.map((character) => character.id),
      currentIndex,
      config: buildSessionConfig(nextStats, elapsedSeconds)
    });
    transitionTimeoutRef.current = window.setTimeout(() => {
      if (sessionCompleteRef.current) {
        return;
      }

      setFeedback('idle');
      setInput('');
      setRoundStartedAt(Date.now());
    }, isTimedMode ? 260 : 480);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    evaluateAnswer(input);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setInput(nextValue);

    if (!currentChar || feedback !== 'idle' || isSessionComplete || !nextValue.trim()) {
      return;
    }

    if (isCorrectAnswer(nextValue, currentChar)) {
      evaluateAnswer(nextValue);
    }
  };

  const handleRestart = () => {
    startNewSession();
  };

  const liveAccuracy = calculateAccuracy(sessionStats.correctCount, sessionStats.attempts);
  const liveSpeed = calculateSpeed(sessionStats.correctCount, elapsedSeconds);
  const liveTime = isTimedMode
    ? formatDuration(TIMED_MODE_DURATION_SECONDS - elapsedSeconds)
    : formatDuration(elapsedSeconds);
  const promptTitle = isReverseMode ? copy.studyRun.typeKana : copy.studyRun.typeRomaji;

  return (
    <div className="flex flex-col items-center py-6" onClick={focusInput}>
      <div className="w-full max-w-2xl">
        <div className="mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {copy.common.accuracy}
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-800">{liveAccuracy}%</div>
            <div className="mt-1 text-sm text-slate-500">
              {copy.common.correct}: {sessionStats.correctCount} / {copy.common.wrong}: {sessionStats.wrongCount}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {copy.common.speed}
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-800">{liveSpeed}/min</div>
            <div className="mt-1 text-sm text-slate-500">
              {copy.common.correct}: {sessionStats.correctCount}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {copy.common.streak}
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-800">{sessionStats.currentStreak}</div>
            <div className="mt-1 text-sm text-slate-500">
              {copy.common.best}: {sessionStats.bestStreak}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {copy.common.time}
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-800">{liveTime}</div>
            <div className="mt-1 text-sm text-slate-500">
              {isTimedMode
                ? `${copy.common.correct}: ${sessionStats.correctCount}`
                : `${initialPool.length - pool.length} / ${initialPool.length}`}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              {promptTitle}
            </div>
            <div
              className={`mt-5 flex min-h-52 items-center justify-center rounded-[1.75rem] border-2 transition-colors ${
                feedback === 'correct'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                  : feedback === 'wrong'
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-slate-200 bg-slate-50 text-slate-800'
              }`}
            >
              <span
                className={
                  isReverseMode
                    ? 'px-6 text-5xl font-semibold tracking-widest text-center font-mono lowercase'
                    : 'px-6 text-7xl font-jp'
                }
              >
                {isReverseMode ? currentChar?.label : currentChar?.symbol}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mb-8">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              disabled={feedback !== 'idle' || isSessionComplete}
              placeholder={isReverseMode ? copy.studyRun.reversePlaceholder : copy.studyRun.placeholder}
              className={`w-full rounded-2xl border-2 px-5 py-4 text-center text-2xl outline-none transition-all ${
                isReverseMode ? 'font-jp tracking-wider' : 'font-mono'
              } ${
                feedback === 'correct'
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                  : feedback === 'wrong'
                    ? 'border-rose-400 bg-rose-50 text-rose-700'
                    : 'border-slate-200 bg-white text-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
              }`}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </form>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6">
            <button
              onClick={onCancel}
              className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft size={16} className="mr-1" /> {copy.studyRun.backToSelection}
            </button>
            <button
              onClick={handleRestart}
              className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              <RotateCcw size={16} className="mr-1" /> {copy.common.restartRun}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
