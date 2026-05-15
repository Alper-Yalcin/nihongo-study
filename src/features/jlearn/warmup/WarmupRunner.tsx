import React, { useMemo, useState } from 'react';
import { PracticeQuestion, VocabItem } from '../../../learn/data/jlearn/jlearnTypes';
import { readUserState, readVocab, readWeakTopics, VocabProgressMap, WeakTopicMap } from '../../../learn/data/jlearn/jlearnStorage';
import { getAllJLearnVocabItems } from '../../../learn/data/jlearn/jlearnContent';
import { TaskRunner, TaskSummary } from '../tasks/TaskRunner';
import { ConfidenceLevel, JLearnUserState } from '../debug/debugStore';

interface WarmupRunnerProps {
  levelId: string;
  session: WarmupSession;
  onComplete: () => void;
}

interface DueVocabEntry {
  vocab: VocabItem;
  nextReviewAt: string;
  errorCount: number;
  masteryLevel?: number;
  source?: 'due' | 'weak' | 'recent' | 'fallback';
}

export interface WarmupSession {
  confidenceLevel: ConfidenceLevel;
  targetCount: number;
  dueCount: number;
  questions: PracticeQuestion[];
}

const WARMUP_COUNT_BY_CONFIDENCE: Record<ConfidenceLevel, number> = {
  low: 5,
  medium: 3,
  high: 0,
};

function buildOptionPool(
  current: VocabItem,
  allVocab: VocabItem[],
  selector: (item: VocabItem) => string
): string[] {
  const seen = new Set<string>([selector(current)]);
  const options = [selector(current)];

  for (const candidate of allVocab) {
    const value = selector(candidate);
    if (candidate.id === current.id || seen.has(value)) continue;
    seen.add(value);
    options.push(value);
    if (options.length === 4) break;
  }

  return options.sort((a, b) => a.localeCompare(b));
}

function getDueVocabEntries(vocabProgress: VocabProgressMap, allVocab: VocabItem[]): DueVocabEntry[] {
  const vocabById = new Map(allVocab.map((item) => [item.id, item]));
  const nowMs = Date.now();

  return Object.values(vocabProgress)
    .filter((entry) => Date.parse(entry.nextReviewAt) <= nowMs)
    .map((entry): DueVocabEntry | null => {
      const vocab = vocabById.get(entry.vocabId);
      if (!vocab) return null;

      return {
        vocab,
        nextReviewAt: entry.nextReviewAt,
        errorCount: entry.errorCount,
        masteryLevel: entry.masteryLevel,
        source: 'due',
      };
    })
    .filter((entry): entry is DueVocabEntry => entry !== null)
    .sort((left, right) => {
      const dueDelta = Date.parse(left.nextReviewAt) - Date.parse(right.nextReviewAt);
      if (dueDelta !== 0) return dueDelta;
      return right.errorCount - left.errorCount;
    });
}

function getReEntryVocabEntries(
  vocabProgress: VocabProgressMap,
  allVocab: VocabItem[],
  recentMistakes: string[],
  weakTopics: WeakTopicMap = readWeakTopics()
): DueVocabEntry[] {
  const vocabById = new Map(allVocab.map((item) => [item.id, item]));
  const nowMs = Date.now();
  const scored = new Map<string, DueVocabEntry & { score: number }>();

  for (const entry of Object.values(vocabProgress)) {
    const vocab = vocabById.get(entry.vocabId);
    if (!vocab) continue;

    const dueAtMs = Date.parse(entry.nextReviewAt);
    const overdueDays = Number.isNaN(dueAtMs)
      ? 0
      : Math.max(0, Math.floor((nowMs - dueAtMs) / (24 * 60 * 60 * 1000)));
    const weaknessScore = entry.errorCount * 12 + (4 - entry.masteryLevel) * 4 + overdueDays;

    if (entry.errorCount > 0 || entry.masteryLevel < 4 || dueAtMs <= nowMs) {
      scored.set(entry.vocabId, {
        vocab,
        nextReviewAt: entry.nextReviewAt,
        errorCount: entry.errorCount,
        masteryLevel: entry.masteryLevel,
        source: dueAtMs <= nowMs ? 'due' : 'weak',
        score: weaknessScore,
      });
    }
  }

  recentMistakes.forEach((vocabId, index) => {
    const vocab = vocabById.get(vocabId);
    if (!vocab) return;
    const existing = scored.get(vocabId);
    const recencyBoost = Math.max(1, recentMistakes.length - index);
    scored.set(vocabId, {
      vocab,
      nextReviewAt: existing?.nextReviewAt ?? new Date(0).toISOString(),
      errorCount: existing?.errorCount ?? 1,
      masteryLevel: existing?.masteryLevel ?? 0,
      source: existing?.source ?? 'recent',
      score: (existing?.score ?? 0) + recencyBoost * 20,
    });
  });

  Object.values(weakTopics)
    .filter((topic) => topic.targetType === 'vocab')
    .forEach((topic) => {
      const vocab = vocabById.get(topic.targetId);
      if (!vocab) return;
      const existing = scored.get(topic.targetId);
      scored.set(topic.targetId, {
        vocab,
        nextReviewAt: existing?.nextReviewAt ?? new Date(0).toISOString(),
        errorCount: Math.max(existing?.errorCount ?? 0, topic.severity),
        masteryLevel: existing?.masteryLevel ?? 0,
        source: 'weak',
        score: (existing?.score ?? 0) + topic.severity * 24,
      });
    });

  const sorted = Array.from(scored.values())
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      const errorDelta = right.errorCount - left.errorCount;
      if (errorDelta !== 0) return errorDelta;
      return left.nextReviewAt.localeCompare(right.nextReviewAt);
    })
    .map(({ score: _score, ...entry }) => entry);

  if (sorted.length > 0) return sorted;

  return allVocab.slice(0, 10).map((vocab) => ({
    vocab,
    nextReviewAt: new Date(0).toISOString(),
    errorCount: 0,
    masteryLevel: 0,
    source: 'fallback',
  }));
}

export function buildWarmupQuestions(): PracticeQuestion[] {
  return buildWarmupSession().questions;
}

export function getWarmupQuestionCount(confidenceLevel: ConfidenceLevel): number {
  return WARMUP_COUNT_BY_CONFIDENCE[confidenceLevel];
}

export function buildWarmupSession(
  userState: Pick<JLearnUserState, 'confidenceLevel'> = readUserState()
): WarmupSession {
  const allVocab = getAllJLearnVocabItems();
  const dueEntries = getDueVocabEntries(readVocab(), allVocab);
  const targetCount = dueEntries.length === 0
    ? 0
    : getWarmupQuestionCount(userState.confidenceLevel);

  if (dueEntries.length === 0 || targetCount === 0) {
    return {
      confidenceLevel: userState.confidenceLevel,
      targetCount,
      dueCount: dueEntries.length,
      questions: [],
    };
  }

  const questions: PracticeQuestion[] = [];

  for (let i = 0; i < targetCount; i++) {
    const due = dueEntries[i % dueEntries.length];
    const variant = i % 3;

    if (variant === 0) {
      questions.push({
        id: `warmup-${due.vocab.id}-meaning-${i}`,
        type: 'multiple-choice',
        prompt: `What does ${due.vocab.japanese} mean?`,
        options: buildOptionPool(due.vocab, allVocab, (item) => item.english),
        correctAnswer: due.vocab.english,
        targetVocabId: due.vocab.id,
      });
      continue;
    }

    if (variant === 1) {
      questions.push({
        id: `warmup-${due.vocab.id}-audio-${i}`,
        type: 'listening-recognition',
        prompt: 'Listen and choose the meaning.',
        promptJapanese: due.vocab.japanese,
        options: buildOptionPool(due.vocab, allVocab, (item) => item.english),
        correctAnswer: due.vocab.english,
        targetVocabId: due.vocab.id,
      });
      continue;
    }

    questions.push({
      id: `warmup-${due.vocab.id}-jp-${i}`,
      type: 'multiple-choice',
      prompt: `Which Japanese matches "${due.vocab.english}"?`,
      options: buildOptionPool(due.vocab, allVocab, (item) => item.japanese),
      correctAnswer: due.vocab.japanese,
      targetVocabId: due.vocab.id,
    });
  }

  return {
    confidenceLevel: userState.confidenceLevel,
    targetCount,
    dueCount: dueEntries.length,
    questions,
  };
}

export function buildReEntryRefreshSession(
  userState: Pick<JLearnUserState, 'confidenceLevel' | 'recentMistakes'> = readUserState(),
  targetCount = 10
): WarmupSession {
  const allVocab = getAllJLearnVocabItems();
  const reviewEntries = getReEntryVocabEntries(readVocab(), allVocab, userState.recentMistakes);

  if (reviewEntries.length === 0 || targetCount <= 0) {
    return {
      confidenceLevel: userState.confidenceLevel,
      targetCount: 0,
      dueCount: 0,
      questions: [],
    };
  }

  const questions: PracticeQuestion[] = [];

  for (let i = 0; i < targetCount; i++) {
    const entry = reviewEntries[i % reviewEntries.length];
    const variant = i % 3;

    if (variant === 0) {
      questions.push({
        id: `reentry-${entry.vocab.id}-meaning-${i}`,
        type: 'multiple-choice',
        prompt: `Welcome-back check: what does ${entry.vocab.japanese} mean?`,
        options: buildOptionPool(entry.vocab, allVocab, (item) => item.english),
        correctAnswer: entry.vocab.english,
        targetVocabId: entry.vocab.id,
      });
      continue;
    }

    if (variant === 1) {
      questions.push({
        id: `reentry-${entry.vocab.id}-listen-${i}`,
        type: 'listening-recognition',
        prompt: 'Listen and choose the meaning.',
        promptJapanese: entry.vocab.japanese,
        options: buildOptionPool(entry.vocab, allVocab, (item) => item.english),
        correctAnswer: entry.vocab.english,
        targetVocabId: entry.vocab.id,
      });
      continue;
    }

    questions.push({
      id: `reentry-${entry.vocab.id}-jp-${i}`,
      type: 'multiple-choice',
      prompt: `Which Japanese matches "${entry.vocab.english}"?`,
      options: buildOptionPool(entry.vocab, allVocab, (item) => item.japanese),
      correctAnswer: entry.vocab.japanese,
      targetVocabId: entry.vocab.id,
    });
  }

  return {
    confidenceLevel: userState.confidenceLevel,
    targetCount,
    dueCount: reviewEntries.length,
    questions,
  };
}

function isDebugWarmupTierVisible(): boolean {
  if (typeof window === 'undefined') return false;
  const isDev = Boolean((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV);
  return isDev && new URLSearchParams(window.location.search).get('debug') === '1';
}

export const WarmupRunner: React.FC<WarmupRunnerProps> = ({ levelId, session, onComplete }) => {
  const [summary, setSummary] = useState<TaskSummary | null>(null);
  const questions = useMemo(() => session.questions, [session.questions]);
  const showDebugTier = isDebugWarmupTierVisible();

  if (questions.length === 0) return null;

  if (summary) {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <div className="rounded-[1.4rem] border border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)] bg-opacity-10 p-6 text-center">
          <div className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--kt-accent-info)]">
            Warm-up
          </div>
          <h1 className="text-2xl font-black text-[var(--kt-ink-strong)]">Review complete</h1>
          <p className="mt-2 text-sm text-[var(--kt-ink-muted)]">
            {summary.correctFirstTry} of {summary.total} correct on first try. You can continue into {levelId}.
          </p>
          {showDebugTier && (
            <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
              Adaptive tier: {session.confidenceLevel}
            </p>
          )}
          <button
            type="button"
            onClick={onComplete}
            className="mt-5 rounded-[1.2rem] bg-[var(--kt-accent-info)] px-8 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90"
          >
            Start Mission →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <div className="mb-6">
        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--kt-accent-info)]">
          Warm-up · {levelId}
        </span>
        <h1 className="mt-1 text-2xl font-black text-[var(--kt-ink-strong)]">Quick review before the level</h1>
        <p className="mt-2 text-sm text-[var(--kt-ink-muted)]">
          {questions.length} review question{questions.length === 1 ? '' : 's'} pulled from {session.dueCount} due SRS item{session.dueCount === 1 ? '' : 's'}.
        </p>
      </div>

      <TaskRunner
        missionId={`warmup-${levelId}`}
        questions={questions}
        onComplete={setSummary}
      />
    </div>
  );
};

export default WarmupRunner;
