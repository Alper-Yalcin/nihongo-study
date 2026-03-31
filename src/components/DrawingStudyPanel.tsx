import React, { useEffect, useMemo, useRef, useState } from 'react';
import { KanaSection, Character, RunStats, DrawingMode } from '../types';
import { ArrowLeft, RotateCcw, Eraser, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { DrawingCanvas, DrawingCanvasRef } from './DrawingCanvas';
import { evaluateDrawing } from '../utils/DrawingEvaluator';
import { AppLanguage } from '../data/appPreferences';
import { getNhkHiraganaGuideImageSrc } from '../data/nhkKanaGuideImages';
import { studyContent } from '../data/studyContent';
import { calculateAccuracy, calculateSpeed } from '../utils/typing';
import { formatDuration } from '../utils/formatDuration';

interface Props {
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

export const DrawingStudyPanel: React.FC<Props> = ({
  section,
  language,
  selectedGroupIds,
  drawingMode,
  onFinish,
  onCancel
}) => {
  const copy = studyContent[language];
  const initialPool = useMemo(() => {
    const chars: Character[] = [];
    section.groups.forEach((group) => {
      if (selectedGroupIds.has(group.id)) {
        chars.push(...group.characters);
      }
    });
    return chars;
  }, [section, selectedGroupIds]);

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

  const isPracticeMode = drawingMode === 'practice';
  const isTestMode = drawingMode === 'test';
  const isSpeedMode = drawingMode === 'speed';
  const isMemoryMode = drawingMode === 'memory';

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
    if (!sessionActiveRef.current) {
      return;
    }

    clearScheduledWork();
    sessionActiveRef.current = false;
    setIsSessionActive(false);
    setIsMemoryPreviewVisible(false);

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

  const initializeMode = (nextMode: DrawingMode) => {
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

    if (nextMode === 'practice') {
      sessionActiveRef.current = false;
      setIsSessionActive(false);
      setCurrentChar(initialPool[0] ?? null);
      return;
    }

    sessionActiveRef.current = true;
    setIsSessionActive(true);

    const nextChar = pickRandomChar(initialPool);

    if (nextMode === 'memory') {
      startMemoryPreview(nextChar);
      return;
    }

    setCurrentChar(nextChar);
  };

  useEffect(() => {
    initializeMode(drawingMode);

    return () => {
      clearScheduledWork();
    };
  }, [initialPool, drawingMode]);

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

  const handleClear = () => {
    if (feedback !== 'idle' || isMemoryPreviewVisible) {
      return;
    }

    clearCanvas();
  };

  const handleNextPractice = () => {
    if (initialPool.length === 0) {
      return;
    }

    clearCanvas();
    setFeedback('idle');
    setCurrentIndex((previousIndex) => {
      const nextIndex = (previousIndex + 1) % initialPool.length;
      setCurrentChar(initialPool[nextIndex]);
      return nextIndex;
    });
  };

  const handlePrevPractice = () => {
    if (initialPool.length === 0) {
      return;
    }

    clearCanvas();
    setFeedback('idle');
    setCurrentIndex((previousIndex) => {
      const nextIndex = (previousIndex - 1 + initialPool.length) % initialPool.length;
      setCurrentChar(initialPool[nextIndex]);
      return nextIndex;
    });
  };

  const handleCheck = () => {
    if (!currentChar || feedback !== 'idle' || isMemoryPreviewVisible) {
      return;
    }

    const strokes = canvasRef.current?.getStrokes() || [];

    if (strokes.length === 0) {
      return;
    }

    const isCorrect = evaluateDrawing(strokes, currentChar);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    setSessionStats((previousStats) => {
      const nextAttempts = previousStats.attempts + 1;
      const nextCorrectCount = previousStats.correctCount + (isCorrect ? 1 : 0);
      const nextWrongCount = previousStats.wrongCount + (isCorrect ? 0 : 1);
      const nextCurrentStreak = isMemoryMode
        ? isCorrect
          ? previousStats.currentStreak + 1
          : 0
        : previousStats.currentStreak;

      return {
        attempts: nextAttempts,
        correctCount: nextCorrectCount,
        wrongCount: nextWrongCount,
        currentStreak: nextCurrentStreak,
        bestStreak:
          isMemoryMode && isCorrect
            ? Math.max(previousStats.bestStreak, nextCurrentStreak)
            : previousStats.bestStreak
      };
    });

    clearScheduledWork();

    if (isCorrect) {
      if (isTestMode) {
        const nextPool = pool.filter((character) => character.id !== currentChar.id);
        transitionTimeoutRef.current = window.setTimeout(() => {
          if (!sessionActiveRef.current) {
            return;
          }

          if (nextPool.length === 0) {
            finalizeRun('test');
            return;
          }

          setPool(nextPool);
          setFeedback('idle');
          clearCanvas();
          setCurrentChar(pickRandomChar(nextPool));
        }, 900);
        return;
      }

      if (isSpeedMode) {
        transitionTimeoutRef.current = window.setTimeout(() => {
          if (!sessionActiveRef.current) {
            return;
          }

          setFeedback('idle');
          clearCanvas();
          setCurrentChar(pickRandomChar(initialPool));
        }, 320);
        return;
      }

      if (isMemoryMode) {
        transitionTimeoutRef.current = window.setTimeout(() => {
          if (!sessionActiveRef.current) {
            return;
          }

          setFeedback('idle');
          startMemoryPreview(pickRandomChar(initialPool));
        }, 700);
      }

      return;
    }

    if (isMemoryMode) {
      transitionTimeoutRef.current = window.setTimeout(() => {
        finalizeRun('memory');
      }, 900);
      return;
    }

    if (isSpeedMode) {
      transitionTimeoutRef.current = window.setTimeout(() => {
        if (!sessionActiveRef.current) {
          return;
        }

        setFeedback('idle');
        clearCanvas();
        setCurrentChar(pickRandomChar(initialPool));
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
  const guideImageSrc = isPracticeMode ? getNhkHiraganaGuideImageSrc(currentChar?.id) : undefined;
  const isNhkTemplateVisible = Boolean(guideImageSrc && showTemplate);
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
            showTemplate={isPracticeMode ? showTemplate : false}
            width={280}
            height={280}
            disabled={feedback !== 'idle' || isMemoryPreviewVisible}
          />

          {!isPracticeMode && feedback !== 'idle' && (
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
            <label className="flex cursor-pointer items-center space-x-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={showTemplate}
                onChange={() => setShowTemplate(!showTemplate)}
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
          {!isPracticeMode && (
            <button
              onClick={() => initializeMode(drawingMode)}
              className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
            >
              <RotateCcw size={16} className="mr-1" /> {copy.common.restartRun}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
