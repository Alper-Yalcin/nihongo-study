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

const MAX_REVIEW_PER_EXERCISE = 1; // each exercise can enter review at most once
const MAX_TOTAL_REVIEWS = 3;       // at most 3 review exercises per lesson

// ── Helpers ────────────────────────────────────────────────────────────────

// Strip __review suffix to get the original exercise ID
function originalId(id: string): string {
  return id.replace(/__review$/, '');
}

// Non-interactive types advance automatically — no feedback bar shown, no scoring
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

function resolvePhase(pct: number, inReview: boolean): LessonPhase {
  if (inReview) return 'review';
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
  // ── Phase 1 tracking ─────────────────────────────────────────────────────
  const [baseIdx, setBaseIdx] = useState(0);

  // ── Phase 2 tracking ─────────────────────────────────────────────────────
  const [reviewQueue, setReviewQueue] = useState<LessonExercise[]>([]);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [inReview, setInReview] = useState(false);

  // ── Completion ───────────────────────────────────────────────────────────
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<LessonResult | null>(null);

  // ── Progress ─────────────────────────────────────────────────────────────
  const [earnedPoints, setEarnedPoints] = useState(0);

  // ── Conversation memory ───────────────────────────────────────────────────
  const [memory, setMemory] = useState<ConversationMemory>({});

  // ── Persistent refs (don't trigger re-render) ─────────────────────────────
  // Which original exercise IDs have been added to review (prevents duplicates)
  const reviewedOriginalIds = useRef(new Set<string>());
  // Wrong counts per original exercise ID
  const wrongCounts = useRef<Record<string, number>>({});
  // Stats for result
  const correctFirstTry = useRef(0);
  const interactiveAnswered = useRef(0);
  const skillBreakdown = useRef<SkillBreakdown>({});
  const confidenceRef = useRef<ConfidenceScores>({ listening: 50, kana: 50, particles: 50, production: 50 });

  // ── Derived values ────────────────────────────────────────────────────────

  const totalBase = baseExercises.length;

  // Max progress points = sum of base exercise gains only (fixed denominator)
  const maxPoints = useMemo(
    () => baseExercises.reduce((sum, ex) => sum + PROGRESS_GAIN_BY_TYPE[ex.type], 0),
    [baseExercises]
  );

  const currentExercise: LessonExercise | null = isComplete
    ? null
    : inReview
      ? (reviewQueue[reviewIdx] ?? null)
      : (baseExercises[baseIdx] ?? null);

  // Progress capped at 99 until lesson is explicitly complete, then 100
  const progressPct = isComplete
    ? 100
    : maxPoints > 0
      ? Math.min(99, Math.round((earnedPoints / maxPoints) * 100))
      : 0;

  const phase = resolvePhase(progressPct, inReview);

  // ── Memory helpers ────────────────────────────────────────────────────────

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

  // ── Confidence update ─────────────────────────────────────────────────────

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
      skillBreakdown.current = updateSkillBreakdown(skillBreakdown.current, currentExercise.skillTags, true);
      applyConfidence(currentExercise.skillTags, true);
    }

    updateAdaptiveData(oid, true);
  }, [currentExercise, maxPoints, applyConfidence]);

  // ── onWrong ───────────────────────────────────────────────────────────────

  const onWrong = useCallback(() => {
    if (!currentExercise) return;

    const oid = originalId(currentExercise.id);

    // Partial progress gain
    const gain = PROGRESS_GAIN_BY_TYPE[currentExercise.type] * WRONG_GAIN_MULTIPLIER;
    setEarnedPoints((prev) => Math.min(maxPoints, prev + gain));

    if (!isNonInteractive(currentExercise.type)) {
      interactiveAnswered.current += 1;
      skillBreakdown.current = updateSkillBreakdown(skillBreakdown.current, currentExercise.skillTags, false);
      applyConfidence(currentExercise.skillTags, false);
    }

    updateAdaptiveData(oid, false);

    // Track wrong count by original ID
    wrongCounts.current[oid] = (wrongCounts.current[oid] ?? 0) + 1;

    // Add to review queue if:
    //   - not already in review pool
    //   - review pool not full
    //   - this is not already a review exercise (prevent re-review)
    const alreadyReviewed = reviewedOriginalIds.current.has(oid);
    const poolFull = reviewQueue.length >= MAX_TOTAL_REVIEWS;

    if (!alreadyReviewed && !poolFull && MAX_REVIEW_PER_EXERCISE > 0) {
      reviewedOriginalIds.current.add(oid);
      const reviewExercise: LessonExercise = { ...currentExercise, id: `${oid}__review` };
      setReviewQueue((prev) => [...prev, reviewExercise]);
    }
  }, [currentExercise, maxPoints, reviewQueue.length, applyConfidence]);

  // ── onNext ────────────────────────────────────────────────────────────────

  const onNext = useCallback(() => {
    if (isComplete) return;

    if (!inReview) {
      // Still in base phase
      const nextBase = baseIdx + 1;
      setBaseIdx(nextBase);

      if (nextBase >= totalBase) {
        // Base exercises exhausted — check if review needed
        if (reviewQueue.length === 0) {
          completeLesson();
        } else {
          setInReview(true);
          setReviewIdx(0);
        }
      }
    } else {
      // In review phase
      const nextReview = reviewIdx + 1;
      setReviewIdx(nextReview);

      if (nextReview >= reviewQueue.length) {
        completeLesson();
      }
    }
  }, [isComplete, inReview, baseIdx, totalBase, reviewQueue.length, reviewIdx, completeLesson]);

  // ── Return ────────────────────────────────────────────────────────────────

  return {
    currentExercise,
    exerciseIndex: inReview ? totalBase + reviewIdx : baseIdx,
    totalBaseExercises: totalBase,
    progressPct,
    phase,
    isReviewPhase: inReview,
    isComplete,
    conversationMemory: memory,
    updateMemory,
    onCorrect,
    onWrong,
    onNext,
    result,
  };
}
