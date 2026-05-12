import { useCallback, useMemo, useRef, useState } from 'react';
import type {
  ConfidenceScores,
  ConversationMemory,
  LessonExercise,
  LessonPhase,
  LessonResult,
  SkillTag,
} from './lessonTypes';
import {
  PROGRESS_GAIN_BY_TYPE,
  WRONG_GAIN_MULTIPLIER,
  RETRY_GAIN_MULTIPLIER,
} from './lessonTypes';
import { saveLessonResult, updateAdaptiveData } from './lessonStorage';

// ── Constants ──────────────────────────────────────────────────────────────

const MAX_TOTAL_REVIEWS = 4;    // max wrong-answer re-insertions per lesson
const REINSERT_AHEAD = 3;       // insert wrong exercise N positions ahead

// ── Helpers ────────────────────────────────────────────────────────────────

function originalId(id: string): string {
  return id.replace(/__review$/, '');
}

const NON_INTERACTIVE_TYPES = new Set([
  'teach_card',
  'audio_reinforcement',
  'visual_context',
  'npc_reaction',
]);

export function isNonInteractive(type: string): boolean {
  return NON_INTERACTIVE_TYPES.has(type);
}

// ── Skill → confidence mapping ─────────────────────────────────────────────

const SKILL_CONFIDENCE_MAP: Record<SkillTag, keyof ConfidenceScores | null> = {
  listening: 'listening',
  kana: 'kana',
  recognition: 'kana',
  conversation: 'production',
  particle: 'particles',
  grammar: 'particles',
  recall: 'kana',
  production: 'production',
  sentence_order: 'production',
};

const CONFIDENCE_WEIGHT = 8;

// ── Phase determination ────────────────────────────────────────────────────

function resolvePhase(pct: number, isReview: boolean): LessonPhase {
  if (isReview) return 'review';
  if (pct < 20) return 'easy';
  if (pct < 40) return 'listening';
  if (pct < 60) return 'guided';
  if (pct < 75) return 'production';
  if (pct < 90) return 'conversation';
  return 'recall';
}

// ── Skill breakdown ────────────────────────────────────────────────────────

type SkillBreakdown = Partial<Record<SkillTag, { correct: number; total: number }>>;

function updateSkillBreakdown(
  bd: SkillBreakdown,
  tags: SkillTag[],
  correct: boolean
): SkillBreakdown {
  const next = { ...bd };
  for (const tag of tags) {
    const entry = next[tag] ?? { correct: 0, total: 0 };
    next[tag] = { correct: entry.correct + (correct ? 1 : 0), total: entry.total + 1 };
  }
  return next;
}

// ── Public interface ───────────────────────────────────────────────────────

export interface UseLessonFlowReturn {
  currentExercise: LessonExercise | null;
  exerciseIndex: number;
  totalBaseExercises: number;
  progressPct: number;
  phase: LessonPhase;
  isReviewPhase: boolean;
  isComplete: boolean;
  conversationMemory: ConversationMemory;
  updateMemory: (key: string, value: string) => void;
  onCorrect: () => void;
  onWrong: () => void;
  onNext: () => void;
  result: LessonResult | null;
}

// ── Hook ───────────────────────────────────────────────────────────────────

export function useLessonFlow(
  lessonId: string,
  baseExercises: LessonExercise[]
): UseLessonFlowReturn {
  // Single mutable exercise list — review exercises are injected inline
  const [exercises, setExercises] = useState<LessonExercise[]>(() => [...baseExercises]);
  const [currentIdx, setCurrentIdx] = useState(0);

  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<LessonResult | null>(null);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [memory, setMemory] = useState<ConversationMemory>({});

  // Refs — mutations don't trigger re-render
  const reviewedOriginalIds = useRef(new Set<string>());
  const totalReviewsAdded = useRef(0);
  const wrongCounts = useRef<Record<string, number>>({});
  const correctFirstTry = useRef(0);
  const interactiveAnswered = useRef(0);
  const skillBreakdown = useRef<SkillBreakdown>({});
  const confidenceRef = useRef<ConfidenceScores>({
    listening: 50,
    kana: 50,
    particles: 50,
    production: 50,
  });

  // ── Derived values ────────────────────────────────────────────────────────

  const maxPoints = useMemo(
    () => baseExercises.reduce((sum, ex) => sum + PROGRESS_GAIN_BY_TYPE[ex.type], 0),
    [baseExercises]
  );

  const currentExercise: LessonExercise | null = isComplete
    ? null
    : (exercises[currentIdx] ?? null);

  const isReviewExercise = currentExercise?.id.endsWith('__review') ?? false;

  const progressPct = isComplete
    ? 100
    : maxPoints > 0
      ? Math.min(99, Math.round((earnedPoints / maxPoints) * 100))
      : 0;

  const phase = resolvePhase(progressPct, isReviewExercise);

  // ── Memory ────────────────────────────────────────────────────────────────

  const updateMemory = useCallback((key: string, value: string) => {
    setMemory((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ── Complete lesson ───────────────────────────────────────────────────────

  const completeLesson = useCallback(() => {
    const accuracy = interactiveAnswered.current > 0
      ? correctFirstTry.current / interactiveAnswered.current
      : 0;
    const xp = Math.max(10, Math.round(accuracy * 100));

    const finalResult: LessonResult = {
      lessonId,
      totalExercises: interactiveAnswered.current,
      correctFirstTry: correctFirstTry.current,
      confidenceScores: { ...confidenceRef.current },
      skillBreakdown: skillBreakdown.current,
      xpEarned: xp,
      completedAt: Date.now(),
    };

    saveLessonResult(finalResult);
    setResult(finalResult);
    setIsComplete(true);
  }, [lessonId]);

  // ── Confidence ────────────────────────────────────────────────────────────

  const applyConfidence = useCallback((tags: SkillTag[], correct: boolean) => {
    const delta = (correct ? 1 : -1) * CONFIDENCE_WEIGHT;
    const scores = { ...confidenceRef.current };
    for (const tag of tags) {
      const key = SKILL_CONFIDENCE_MAP[tag];
      if (key) scores[key] = Math.max(0, Math.min(100, scores[key] + delta));
    }
    confidenceRef.current = scores;
  }, []);

  // ── onCorrect ─────────────────────────────────────────────────────────────

  const onCorrect = useCallback(() => {
    if (!currentExercise) return;

    const oid = originalId(currentExercise.id);
    const hadWrong = (wrongCounts.current[oid] ?? 0) > 0;
    const gain = PROGRESS_GAIN_BY_TYPE[currentExercise.type] *
      (hadWrong ? RETRY_GAIN_MULTIPLIER : 1.0);

    setEarnedPoints((prev) => Math.min(maxPoints, prev + gain));

    if (!isNonInteractive(currentExercise.type)) {
      if (!hadWrong) correctFirstTry.current += 1;
      interactiveAnswered.current += 1;
      skillBreakdown.current = updateSkillBreakdown(
        skillBreakdown.current,
        currentExercise.skillTags,
        true
      );
      applyConfidence(currentExercise.skillTags, true);
    }

    updateAdaptiveData(oid, true);
  }, [currentExercise, maxPoints, applyConfidence]);

  // ── onWrong ───────────────────────────────────────────────────────────────

  const onWrong = useCallback(() => {
    if (!currentExercise) return;

    const oid = originalId(currentExercise.id);

    const gain = PROGRESS_GAIN_BY_TYPE[currentExercise.type] * WRONG_GAIN_MULTIPLIER;
    setEarnedPoints((prev) => Math.min(maxPoints, prev + gain));

    if (!isNonInteractive(currentExercise.type)) {
      interactiveAnswered.current += 1;
      skillBreakdown.current = updateSkillBreakdown(
        skillBreakdown.current,
        currentExercise.skillTags,
        false
      );
      applyConfidence(currentExercise.skillTags, false);
    }

    updateAdaptiveData(oid, false);
    wrongCounts.current[oid] = (wrongCounts.current[oid] ?? 0) + 1;

    // Inject the wrong exercise back into the live list REINSERT_AHEAD positions ahead.
    // This means the user will face the same question again before the lesson ends.
    const alreadyQueued = reviewedOriginalIds.current.has(oid);
    const atLimit = totalReviewsAdded.current >= MAX_TOTAL_REVIEWS;

    if (!alreadyQueued && !atLimit) {
      reviewedOriginalIds.current.add(oid);
      totalReviewsAdded.current += 1;
      const reviewEx: LessonExercise = {
        ...currentExercise,
        id: `${oid}__review`,
      };
      setExercises((prev) => {
        const insertPos = Math.min(currentIdx + REINSERT_AHEAD, prev.length);
        const next = [...prev];
        next.splice(insertPos, 0, reviewEx);
        return next;
      });
    }
  }, [currentExercise, maxPoints, currentIdx, applyConfidence]);

  // ── onNext ────────────────────────────────────────────────────────────────

  const onNext = useCallback(() => {
    if (isComplete) return;
    const nextIdx = currentIdx + 1;
    setCurrentIdx(nextIdx);
    if (nextIdx >= exercises.length) {
      completeLesson();
    }
  }, [isComplete, currentIdx, exercises.length, completeLesson]);

  // ── Return ────────────────────────────────────────────────────────────────

  return {
    currentExercise,
    exerciseIndex: currentIdx,
    totalBaseExercises: baseExercises.length,
    progressPct,
    phase,
    isReviewPhase: isReviewExercise,
    isComplete,
    conversationMemory: memory,
    updateMemory,
    onCorrect,
    onWrong,
    onNext,
    result,
  };
}
