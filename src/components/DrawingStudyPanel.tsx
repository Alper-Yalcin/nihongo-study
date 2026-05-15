import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KanaSection, Character, RunStats, DrawingMode } from '../types';
import { ArrowLeft, RotateCcw, Eraser, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { DrawingCanvas, DrawingCanvasRef } from './DrawingCanvas';
import { evaluateDrawing } from '../utils/DrawingEvaluator';
import { AppLanguage } from '../data/appPreferences';
import { getNhkKanaGuideImageSrc } from '../letters/data/nhkKanaGuideImages';
import { studyContent } from '../learn/data/studyContent';
import { calculateAccuracy, calculateSpeed } from '../utils/typing';
import { formatDuration } from '../utils/formatDuration';
import { useKanaProgressStore } from '../features/kana/progress/progressStore';
import { StudySession } from '../features/kana/domain/studySession';
import {
  createStudySession,
  getSessionConfigBoolean,
  getSessionConfigNumber,
  isSessionKeyMatch
} from '../features/kana/session/sessionEngine';
import {
  completeAndPersistSession,
  persistSessionState,
  recordAnswerAndPersistSession,
  syncProgressFromSessionAnswer,
  updateSessionConfigAndPersist,
  updateSessionCursorAndPersist
} from '../features/kana/session/sessionRunCoordinator';

interface Props {
  script: 'hiragana' | 'katakana';
  section: KanaSection;
  language: AppLanguage;
  selectedGroupIds: Set<string>;
  drawingMode: DrawingMode;
  onFinish: (stats: RunStats) => void;
  onCancel: () => void;
}

interface SessionStats {
  correctCount: number;
  wrongCount: number;
  attempts: number;
  currentStreak: number;
  bestStreak: number;
}

const SPEED_MODE_DURATION_SECONDS = 60;
const MEMORY_PREVIEW_MS = 1800;

const initialSessionStats: SessionStats = {
  correctCount: 0,
  wrongCount: 0,
  attempts: 0,
  currentStreak: 0,
  bestStreak: 0
};

const resolveSessionType = (mode: DrawingMode) => {
  if (mode === 'speed') {
    return 'speed';
  }

  if (mode === 'test' || mode === 'memory') {
    return 'test';
  }

  return 'learn';
};

const findCharacterIndex = (items: Character[], characterId: string | null) => {
  if (!characterId) {
    return 0;
  }

  const index = items.findIndex((item) => item.id === characterId);
  return index >= 0 ? index : 0;
};

export const DrawingStudyPanel: React.FC<Props> = ({
  script,
  section,
  language,
  selectedGroupIds,
  drawingMode,
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

  const [pool, setPool] = useState<Character[]>(initialPool);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentChar, setCurrentChar] = useState<Character | null>(initialPool[0] ?? null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [sessionStats, setSessionStats] = useState<SessionStats>(initialSessionStats);
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isMemoryPreviewVisible, setIsMemoryPreviewVisible] = useState(false);

  const [showStrokeOrder, setShowStrokeOrder] = useState(true);
  const [showDirectionArrows, setShowDirectionArrows] = useState(true);
  const [showTemplate, setShowTemplate] = useState(true);

  const canvasRef = useRef<DrawingCanvasRef>(null);
  const sessionStatsRef = useRef(sessionStats);
  const sessionActiveRef = useRef(isSessionActive);
  const timeSecondsRef = useRef(timeSeconds);
  const transitionTimeoutRef = useRef<number | null>(null);
  const previewTimeoutRef = useRef<number | null>(null);
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

  const isPracticeMode = drawingMode === 'practice';
  const isTestMode = drawingMode === 'test';
  const isSpeedMode = drawingMode === 'speed';
  const isMemoryMode = drawingMode === 'memory';
  const sessionKey = `kana:${scope}:${script}:drawing:${drawingMode}`;
  const activeRunSession = isSessionKeyMatch(activeSession, sessionKey) ? activeSession : null;

  useEffect(() => {
    sessionStatsRef.current = sessionStats;
  }, [sessionStats]);

  useEffect(() => {
    sessionActiveRef.current = isSessionActive;
  }, [isSessionActive]);

  useEffect(() => {
    timeSecondsRef.current = timeSeconds;
  }, [timeSeconds]);

  const clearCanvas = () => {
    canvasRef.current?.clear();
  };

  const clearScheduledWork = () => {
    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }

    if (previewTimeoutRef.current !== null) {
      window.clearTimeout(previewTimeoutRef.current);
      previewTimeoutRef.current = null;
    }
  };

  const pickRandomChar = (source: Character[]) => {
    if (source.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * source.length);
    return source[randomIndex];
  };

  const getModeLabel = (targetMode: DrawingMode) => {
    switch (targetMode) {
      case 'practice':
        return copy.drawing.practiceMode;
      case 'test':
        return copy.drawing.testMode;
      case 'speed':
        return copy.drawing.speedMode;
      case 'memory':
        return copy.drawing.memoryMode;
      default:
        return copy.drawing.testMode;
    }
  };

  const buildSessionConfig = (stats: SessionStats, elapsed: number) => ({
    sessionKey,
    variant: drawingMode,
    sectionId: section.id,
    selectedGroupIds: [...selectedGroupIds],
    timeSeconds: elapsed,
    correctCount: stats.correctCount,
    wrongCount: stats.wrongCount,
    attempts: stats.attempts,
    currentStreak: stats.currentStreak,
    bestStreak: stats.bestStreak,
    showStrokeOrder,
    showDirectionArrows,
    showTemplate
  });

  const startMemoryPreview = (nextChar: Character | null) => {
    clearScheduledWork();
    clearCanvas();
    setFeedback('idle');
    setCurrentChar(nextChar);

    if (!nextChar) {
      setIsMemoryPreviewVisible(false);
      return;
    }

    setIsMemoryPreviewVisible(true);
    previewTimeoutRef.current = window.setTimeout(() => {
      setIsMemoryPreviewVisible(false);
    }, MEMORY_PREVIEW_MS);
  };

  const finalizeRun = (finalMode: DrawingMode, resolvedTime = timeSecondsRef.current) => {
    if (!sessionActiveRef.current && !isPracticeMode) {
      return;
    }

    clearScheduledWork();
    sessionActiveRef.current = false;
    setIsSessionActive(false);
    setIsMemoryPreviewVisible(false);

    completeAndPersistSession(sessionPersistenceContext);

    const snapshot = sessionStatsRef.current;

    onFinish({
      completed: finalMode === 'test' ? initialPool.length : snapshot.correctCount,
      totalAttempts: snapshot.attempts,
      correct: snapshot.correctCount,
      wrong: snapshot.wrongCount,
      accuracy: calculateAccuracy(snapshot.correctCount, snapshot.attempts),
      timeSeconds: resolvedTime,
      mode: finalMode,
      modeLabel: getModeLabel(finalMode),
      speed: finalMode === 'speed' ? calculateSpeed(snapshot.correctCount, resolvedTime) : undefined,
      bestStreak: finalMode === 'memory' ? snapshot.bestStreak : undefined,
      timeLimitSeconds: finalMode === 'speed' ? SPEED_MODE_DURATION_SECONDS : undefined
    });
  };

  const restoreSession = (session: StudySession) => {
    clearScheduledWork();

    const restoredPool = session.itemIds
      .map((itemId) => characterMap.get(itemId) ?? null)
      .filter((item): item is Character => item !== null);

    const fallbackPool = restoredPool.length > 0 ? restoredPool : initialPool;

    if (fallbackPool.length === 0) {
      sessionRef.current = null;
      return false;
    }

    const restoredIndex = Math.min(Math.max(session.currentIndex, 0), fallbackPool.length - 1);
    const restoredStats: SessionStats = {
      correctCount: getSessionConfigNumber(session, 'correctCount') ?? 0,
      wrongCount: getSessionConfigNumber(session, 'wrongCount') ?? 0,
      attempts: getSessionConfigNumber(session, 'attempts') ?? 0,
      currentStreak: getSessionConfigNumber(session, 'currentStreak') ?? 0,
      bestStreak: getSessionConfigNumber(session, 'bestStreak') ?? 0
    };

    sessionRef.current = session;
    sessionStatsRef.current = restoredStats;
    sessionActiveRef.current = !isPracticeMode;
    setIsSessionActive(!isPracticeMode);
    setPool(fallbackPool);
    setCurrentIndex(restoredIndex);
    setCurrentChar(fallbackPool[restoredIndex] ?? fallbackPool[0]);
    setFeedback('idle');
    setSessionStats(restoredStats);
    setTimeSeconds(getSessionConfigNumber(session, 'timeSeconds') ?? 0);
    setIsMemoryPreviewVisible(false);
    setShowStrokeOrder(getSessionConfigBoolean(session, 'showStrokeOrder') ?? true);
    setShowDirectionArrows(getSessionConfigBoolean(session, 'showDirectionArrows') ?? true);
    setShowTemplate(getSessionConfigBoolean(session, 'showTemplate') ?? true);
    clearCanvas();

    return true;
  };

  const startNewSession = () => {
    clearScheduledWork();
    clearCanvas();
    setPool(initialPool);
    setCurrentIndex(0);
    setFeedback('idle');
    setSessionStats(initialSessionStats);
    sessionStatsRef.current = initialSessionStats;
    setTimeSeconds(0);
    timeSecondsRef.current = 0;
    setIsMemoryPreviewVisible(false);

    if (initialPool.length === 0) {
      setCurrentChar(null);
      sessionActiveRef.current = false;
      setIsSessionActive(false);
      sessionRef.current = null;
      return;
    }

    const initialChar = drawingMode === 'practice' ? initialPool[0] : pickRandomChar(initialPool);
    const initialIndex = drawingMode === 'practice' ? 0 : findCharacterIndex(initialPool, initialChar?.id ?? null);
    const nextSession = createStudySession({
      script,
      type: resolveSessionType(drawingMode),
      mode: 'drawing',
      itemIds: initialPool.map((character) => character.id),
      currentIndex: initialIndex,
      config: buildSessionConfig(initialSessionStats, 0)
    });

    persistSessionState(sessionPersistenceContext, nextSession);

    if (drawingMode === 'practice') {
      sessionActiveRef.current = false;
      setIsSessionActive(false);
      setCurrentChar(initialPool[0]);
      return;
    }

    sessionActiveRef.current = true;
    setIsSessionActive(true);

    if (drawingMode === 'memory') {
      startMemoryPreview(initialChar);
      return;
    }

    setCurrentChar(initialChar);
    setCurrentIndex(initialIndex);
  };

  useEffect(() => {
    if (activeRunSession && restoreSession(activeRunSession)) {
      return () => {
        clearScheduledWork();
      };
    }

    startNewSession();

    return () => {
      clearScheduledWork();
    };
  }, [activeRunSession?.id, drawingMode, initialPool]);

  useEffect(() => {
    if (!isSessionActive) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setTimeSeconds((previousSeconds) => previousSeconds + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isSessionActive]);

  useEffect(() => {
    if (isSpeedMode && isSessionActive && timeSeconds >= SPEED_MODE_DURATION_SECONDS) {
      finalizeRun('speed', SPEED_MODE_DURATION_SECONDS);
    }
  }, [isSpeedMode, isSessionActive, timeSeconds]);

  useEffect(() => {
    if (!sessionRef.current || !sessionActiveRef.current) {
      return;
    }

    updateSessionConfigAndPersist(sessionPersistenceContext, {
      config: buildSessionConfig(sessionStatsRef.current, timeSeconds)
    });
  }, [timeSeconds]);

  const handleClear = () => {
    if (feedback !== 'idle' || isMemoryPreviewVisible) {
      return;
    }

    clearCanvas();
  };

  const handleNextPractice = () => {
    if (initialPool.length === 0 || !sessionRef.current) {
      return;
    }

    clearCanvas();
    setFeedback('idle');
    setCurrentIndex((previousIndex) => {
      const nextIndex = (previousIndex + 1) % initialPool.length;
      const nextChar = initialPool[nextIndex];
      setCurrentChar(nextChar);
      updateSessionCursorAndPersist(sessionPersistenceContext, {
        itemIds: initialPool.map((character) => character.id),
        currentIndex: nextIndex,
        config: buildSessionConfig(sessionStatsRef.current, timeSecondsRef.current)
      });
      return nextIndex;
    });
  };

  const handlePrevPractice = () => {
    if (initialPool.length === 0 || !sessionRef.current) {
      return;
    }

    clearCanvas();
    setFeedback('idle');
    setCurrentIndex((previousIndex) => {
      const nextIndex = (previousIndex - 1 + initialPool.length) % initialPool.length;
      const nextChar = initialPool[nextIndex];
      setCurrentChar(nextChar);
      updateSessionCursorAndPersist(sessionPersistenceContext, {
        itemIds: initialPool.map((character) => character.id),
        currentIndex: nextIndex,
        config: buildSessionConfig(sessionStatsRef.current, timeSecondsRef.current)
      });
      return nextIndex;
    });
  };

  const handleCheck = () => {
    if (!currentChar || feedback !== 'idle' || isMemoryPreviewVisible || !sessionRef.current) {
      return;
    }

    const strokes = canvasRef.current?.getStrokes() || [];

    if (strokes.length === 0) {
      return;
    }

    const isCorrect = evaluateDrawing(strokes, currentChar, {
      tolerance: isPracticeMode ? 'practice' : 'standard',
      guideImageLayout: isPracticeMode ? canvasRef.current?.getGuideImageLayout() : null,
    });
    const answeredAt = new Date().toISOString();
    const nextStats: SessionStats = {
      attempts: sessionStatsRef.current.attempts + 1,
      correctCount: sessionStatsRef.current.correctCount + (isCorrect ? 1 : 0),
      wrongCount: sessionStatsRef.current.wrongCount + (isCorrect ? 0 : 1),
      currentStreak: isMemoryMode
        ? isCorrect
          ? sessionStatsRef.current.currentStreak + 1
          : 0
        : sessionStatsRef.current.currentStreak,
      bestStreak:
        isMemoryMode && isCorrect
          ? Math.max(sessionStatsRef.current.bestStreak, sessionStatsRef.current.currentStreak + 1)
          : sessionStatsRef.current.bestStreak
    };
    const answerRecord = {
      itemId: currentChar.id,
      mode: 'drawing' as const,
      correct: isCorrect,
      answeredAt,
      latencyMs: 0,
      hintsUsed: isPracticeMode ? 1 : 0,
      retries: 0,
      variant: drawingMode,
      responseItemId: null
    };
    syncProgressFromSessionAnswer(progressSyncContext, answerRecord, { sessionId: sessionRef.current?.id });

    setFeedback(isCorrect ? 'correct' : 'wrong');
    setSessionStats(nextStats);
    clearScheduledWork();

    if (isCorrect) {
      if (isPracticeMode) {
        recordAnswerAndPersistSession(sessionPersistenceContext, answerRecord, {
          itemIds: initialPool.map((character) => character.id),
          currentIndex,
          config: buildSessionConfig(nextStats, timeSecondsRef.current)
        });
        transitionTimeoutRef.current = window.setTimeout(() => {
          setFeedback('idle');
        }, 900);
        return;
      }

      if (isTestMode) {
        const nextPool = pool.filter((character) => character.id !== currentChar.id);
        const nextChar = pickRandomChar(nextPool);
        const nextIndex = findCharacterIndex(nextPool, nextChar?.id ?? null);
        recordAnswerAndPersistSession(sessionPersistenceContext, answerRecord, {
          itemIds: nextPool.map((character) => character.id),
          currentIndex: nextIndex,
          config: buildSessionConfig(nextStats, timeSecondsRef.current)
        });

        transitionTimeoutRef.current = window.setTimeout(() => {
          if (!sessionActiveRef.current) {
            return;
          }

          if (nextPool.length === 0) {
            finalizeRun('test');
            return;
          }

          setPool(nextPool);
          setCurrentIndex(nextIndex);
          setFeedback('idle');
          clearCanvas();
          setCurrentChar(nextChar);
        }, 900);
        return;
      }

      if (isSpeedMode) {
        const nextChar = pickRandomChar(initialPool);
        const nextIndex = findCharacterIndex(initialPool, nextChar?.id ?? null);
        recordAnswerAndPersistSession(sessionPersistenceContext, answerRecord, {
          itemIds: initialPool.map((character) => character.id),
          currentIndex: nextIndex,
          config: buildSessionConfig(nextStats, timeSecondsRef.current)
        });

        transitionTimeoutRef.current = window.setTimeout(() => {
          if (!sessionActiveRef.current) {
            return;
          }

          setFeedback('idle');
          clearCanvas();
          setPool(initialPool);
          setCurrentIndex(nextIndex);
          setCurrentChar(nextChar);
        }, 320);
        return;
      }

      if (isMemoryMode) {
        const nextChar = pickRandomChar(initialPool);
        const nextIndex = findCharacterIndex(initialPool, nextChar?.id ?? null);
        recordAnswerAndPersistSession(sessionPersistenceContext, answerRecord, {
          itemIds: initialPool.map((character) => character.id),
          currentIndex: nextIndex,
          config: buildSessionConfig(nextStats, timeSecondsRef.current)
        });

        transitionTimeoutRef.current = window.setTimeout(() => {
          if (!sessionActiveRef.current) {
            return;
          }

          setFeedback('idle');
          setCurrentIndex(nextIndex);
          startMemoryPreview(nextChar);
        }, 700);
      }

      return;
    }

    recordAnswerAndPersistSession(sessionPersistenceContext, answerRecord, {
      itemIds: pool.map((character) => character.id),
      currentIndex: findCharacterIndex(pool, currentChar.id),
      config: buildSessionConfig(nextStats, timeSecondsRef.current)
    });

    if (isPracticeMode) {
      transitionTimeoutRef.current = window.setTimeout(() => {
        setFeedback('idle');
        clearCanvas();
      }, 900);
      return;
    }

    if (isMemoryMode) {
      transitionTimeoutRef.current = window.setTimeout(() => {
        finalizeRun('memory');
      }, 900);
      return;
    }

    if (isSpeedMode) {
      const nextChar = pickRandomChar(initialPool);
      const nextIndex = findCharacterIndex(initialPool, nextChar?.id ?? null);
      transitionTimeoutRef.current = window.setTimeout(() => {
        if (!sessionActiveRef.current) {
          return;
        }

        setFeedback('idle');
        clearCanvas();
        setPool(initialPool);
        setCurrentIndex(nextIndex);
        setCurrentChar(nextChar);
      }, 550);
      return;
    }

    transitionTimeoutRef.current = window.setTimeout(() => {
      if (!sessionActiveRef.current) {
        return;
      }

      setFeedback('idle');
      clearCanvas();
    }, 900);
  };

  const headerPrompt = isMemoryMode
    ? isMemoryPreviewVisible
      ? copy.drawing.memorize
      : copy.drawing.drawFromMemory
    : copy.drawing.draw;
  const guideImageSrc = isPracticeMode ? getNhkKanaGuideImageSrc(currentChar?.id) : undefined;
  const isPinnedGuideTemplate = Boolean(guideImageSrc);
  const isNhkTemplateVisible = Boolean(guideImageSrc);
  const headerDisplay = isMemoryMode
    ? isMemoryPreviewVisible
      ? currentChar?.symbol
      : '...'
    : currentChar?.label;
  const liveSpeed = calculateSpeed(sessionStats.correctCount, timeSeconds);

  return (
    <div className="flex flex-col items-center py-6">
      <div className="w-full max-w-2xl">
        {isPracticeMode ? (
          <div className="mb-4 flex items-center justify-between text-sm font-medium text-slate-500">
            <span>{copy.drawing.practice}</span>
            <span>{currentIndex + 1} / {initialPool.length}</span>
          </div>
        ) : (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm font-medium text-slate-500">
            <div className="flex flex-wrap gap-4">
              <span className="text-emerald-600">{copy.common.correct}: {sessionStats.correctCount}</span>
              <span className="text-rose-600">{copy.common.wrong}: {sessionStats.wrongCount}</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <span>
                {isSpeedMode
                  ? `${copy.drawing.timeLeft}: ${formatDuration(SPEED_MODE_DURATION_SECONDS - timeSeconds)}`
                  : formatDuration(timeSeconds)}
              </span>
              {isTestMode && <span>{initialPool.length - pool.length} / {initialPool.length}</span>}
              {isSpeedMode && <span>{copy.common.speed}: {liveSpeed}/min</span>}
              {isMemoryMode && <span>{copy.common.streak}: {sessionStats.correctCount}</span>}
            </div>
          </div>
        )}

        <div className="mb-4 text-center">
          <div className="mb-1 text-sm font-semibold uppercase tracking-widest text-slate-500">{headerPrompt}</div>
          <div
            className={`font-bold ${
              isMemoryMode && isMemoryPreviewVisible
                ? 'font-jp text-6xl text-slate-800'
                : isMemoryMode
                  ? 'text-4xl text-slate-300'
                  : 'text-4xl text-slate-800'
            }`}
          >
            {headerDisplay}
          </div>
        </div>

        <div className="relative mb-6 flex justify-center">
          <DrawingCanvas
            ref={canvasRef}
            guideSymbol={isPracticeMode ? currentChar?.symbol : undefined}
            guideImageSrc={guideImageSrc}
            drawingData={isPracticeMode ? currentChar?.drawingData : undefined}
            showStrokeOrder={isPracticeMode ? showStrokeOrder : false}
            showDirectionArrows={isPracticeMode ? showDirectionArrows : false}
            showTemplate={isPracticeMode ? (isPinnedGuideTemplate || showTemplate) : false}
            width={280}
            height={280}
            disabled={feedback !== 'idle' || isMemoryPreviewVisible}
          />

          {feedback !== 'idle' && (
            <div
              className={`absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm transition-all ${
                feedback === 'correct' ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              <div className="flex flex-col items-center">
                {feedback === 'correct' ? <Check size={48} /> : <RotateCcw size={48} />}
                <span className="mt-2 text-xl font-bold">
                  {feedback === 'correct' ? copy.drawing.correctFeedback : copy.drawing.wrongFeedback}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6 flex justify-center space-x-3">
          <button
            onClick={handleClear}
            disabled={feedback !== 'idle' || isMemoryPreviewVisible}
            className="flex items-center rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Eraser size={18} className="mr-2" /> {copy.drawing.clear}
          </button>

          {isPracticeMode ? (
            <>
              <button
                onClick={handleCheck}
                disabled={feedback !== 'idle' || isMemoryPreviewVisible}
                className="flex items-center rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={18} className="mr-2" /> {copy.drawing.check}
              </button>
              <button
                onClick={handlePrevPractice}
                className="flex items-center rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-200"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNextPractice}
                className="flex items-center rounded-lg bg-slate-100 px-4 py-2 font-medium text-slate-700 transition-colors hover:bg-slate-200"
              >
                <ChevronRight size={18} />
              </button>
            </>
          ) : (
            <button
              onClick={handleCheck}
              disabled={feedback !== 'idle' || isMemoryPreviewVisible}
              className="flex items-center rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={18} className="mr-2" /> {copy.drawing.check}
            </button>
          )}
        </div>

        {isPracticeMode && (
          <div className="mb-8 flex flex-wrap justify-center gap-3">
            <label
              className={`flex items-center space-x-2 text-sm text-slate-600 ${
                isNhkTemplateVisible ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
            >
              <input
                type="checkbox"
                checked={showStrokeOrder}
                onChange={() => setShowStrokeOrder(!showStrokeOrder)}
                disabled={isNhkTemplateVisible}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>{copy.drawing.numbers}</span>
            </label>
            <label
              className={`flex items-center space-x-2 text-sm text-slate-600 ${
                isNhkTemplateVisible ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
            >
              <input
                type="checkbox"
                checked={showDirectionArrows}
                onChange={() => setShowDirectionArrows(!showDirectionArrows)}
                disabled={isNhkTemplateVisible}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>{copy.drawing.arrows}</span>
            </label>
            <label
              className={`flex items-center space-x-2 text-sm text-slate-600 ${
                isPinnedGuideTemplate ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
            >
              <input
                type="checkbox"
                checked={isPinnedGuideTemplate || showTemplate}
                onChange={() => setShowTemplate(!showTemplate)}
                disabled={isPinnedGuideTemplate}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>{copy.drawing.template}</span>
            </label>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 pt-6">
          <button
            onClick={onCancel}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft size={16} className="mr-1" /> {copy.drawing.backToSelection}
          </button>
          <button
            onClick={startNewSession}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            <RotateCcw size={16} className="mr-1" /> {copy.common.restartRun}
          </button>
        </div>
      </div>
    </div>
  );
};
