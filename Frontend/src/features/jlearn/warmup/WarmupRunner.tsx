import React, { useMemo, useState } from 'react';
import { PracticeQuestion, VocabItem } from '../../../data/jlearn/jlearnTypes';
import { readUserState, readVocab, VocabProgressMap } from '../../../data/jlearn/jlearnStorage';
import { getAllJLearnVocabItems } from '../../../data/jlearn/jlearnContent';
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
    .map((entry) => {
      const vocab = vocabById.get(entry.vocabId);
      if (!vocab) return null;

      return {
        vocab,
        nextReviewAt: entry.nextReviewAt,
        errorCount: entry.errorCount,
      };
    })
    .filter((entry): entry is DueVocabEntry => entry !== null)
    .sort((left, right) => {
      const dueDelta = Date.parse(left.nextReviewAt) - Date.parse(right.nextReviewAt);
      if (dueDelta !== 0) return dueDelta;
      return right.errorCount - left.errorCount;
    });
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
