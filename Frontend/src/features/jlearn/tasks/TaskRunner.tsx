import React, { useEffect, useRef, useState } from 'react';
import { LearningEvent, PracticeQuestion, SrsSkill } from '../../../data/jlearn/jlearnTypes';
import { appendLearningEvents, readVocab, updateVocabProgress, writeVocab } from '../../../data/jlearn/jlearnStorage';
import { ConfidenceLevel } from '../debug/debugStore';
import { MultipleChoice } from './MultipleChoice';
import { FillInBlank } from './FillInBlank';
import { TranslationTask } from './TranslationTask';
import { SentenceBuild } from './SentenceBuild';
import { ContextSelect } from './ContextSelect';
import { ListeningRecognition } from './ListeningRecognition';

export interface TaskSummary {
  total: number;
  correctFirstTry: number;
  totalRetries: number;
  retriesByQuestion: Record<string, number>;
}

interface TaskRunnerProps {
  missionId: string;
  questions: PracticeQuestion[];
  confidenceLevel?: ConfidenceLevel;
  challengeMode?: boolean;
  onComplete: (summary: TaskSummary) => void;
}

const SUPPORTED_TYPES = new Set([
  'multiple-choice',
  'fill-in-blank',
  'translation-en-jp',
  'translation-jp-en',
  'sentence-build',
  'context-select',
  'listening-recognition',
]);

const SPEAKING_TYPES = new Set([
  'pronunciation-repeat',
  'dialogue-speak',
  'shadow-read',
]);

function buildQuestionHint(question: PracticeQuestion): string {
  if (question.explanation) return question.explanation;
  if (question.promptJapanese) return `Read the Japanese prompt first: ${question.promptJapanese}`;
  if (question.options?.length) {
    return 'Eliminate choices that do not match the situation, then compare the remaining phrase with the prompt.';
  }
  if (question.acceptedAnswers?.length) {
    return `Aim for the same meaning as: ${question.acceptedAnswers[0]}`;
  }

  const answer = question.correctAnswer.trim();
  const visiblePrefix = answer.slice(0, Math.max(1, Math.min(4, Math.ceil(answer.length / 3))));
  return visiblePrefix
    ? `Start with "${visiblePrefix}" and complete the phrase from memory.`
    : 'Pause, re-read the prompt, and answer with the shortest natural phrase.';
}

function skillForQuestionType(type: PracticeQuestion['type']): SrsSkill {
  if (type === 'listening-recognition') return 'listening';
  if (type === 'translation-en-jp') return 'typing';
  if (type === 'sentence-build' || type === 'dialogue-complete') return 'production';
  if (type === 'translation-jp-en' || type === 'context-select') return 'meaning';
  return 'recognition';
}

function buildLearningEvents(params: {
  missionId: string;
  question: PracticeQuestion;
  wasCorrect: boolean;
  latencyMs: number;
  hintUsed: boolean;
  attemptCount: number;
}): LearningEvent[] {
  const { missionId, question, wasCorrect, latencyMs, hintUsed, attemptCount } = params;
  const now = new Date().toISOString();
  const explicitTargets = question.srsTargets ?? [];
  const fallbackTargets = [
    question.targetVocabId
      ? {
          targetType: 'vocab' as const,
          targetId: question.targetVocabId,
          skills: [skillForQuestionType(question.type)],
          weight: 1,
        }
      : null,
    question.targetGrammarId
      ? {
          targetType: 'grammar' as const,
          targetId: question.targetGrammarId,
          skills: [skillForQuestionType(question.type)],
          weight: 1,
        }
      : null,
  ].filter((target): target is NonNullable<typeof target> => Boolean(target));
  const targets = explicitTargets.length > 0 ? explicitTargets : fallbackTargets;

  return targets.flatMap((target) =>
    target.skills.map((skill) => ({
      missionId,
      taskId: question.id,
      questionType: question.type,
      targetType: target.targetType,
      targetId: target.targetId,
      skill,
      correct: wasCorrect,
      latencyMs,
      hintUsed,
      attemptCount,
      createdAt: now,
    }))
  );
}

export const TaskRunner: React.FC<TaskRunnerProps> = ({
  missionId,
  questions,
  confidenceLevel = 'medium',
  challengeMode = false,
  onComplete,
}) => {
  const eligible = questions.filter((q) => SUPPORTED_TYPES.has(q.type) || SPEAKING_TYPES.has(q.type));
  const [idx, setIdx] = useState(0);
  const [retries, setRetries] = useState<Record<string, number>>({});
  const [openHints, setOpenHints] = useState<Record<string, boolean>>({});
  const [lockedWrong, setLockedWrong] = useState<Record<string, boolean>>({});
  const questionStartedAtRef = useRef(Date.now());
  const isLowConfidence = confidenceLevel === 'low' && !challengeMode;
  const isHighConfidence = confidenceLevel === 'high' || challengeMode;

  useEffect(() => {
    questionStartedAtRef.current = Date.now();
  }, [idx, eligible[idx]?.id]);

  const recordVocabAttempt = (question: PracticeQuestion, wasCorrect: boolean) => {
    if (!question.targetVocabId) return;
    const next = updateVocabProgress(readVocab(), {
      vocabId: question.targetVocabId,
      missionId,
      wasCorrect,
    });
    writeVocab(next);
  };

  const recordLearningAttempt = (question: PracticeQuestion, wasCorrect: boolean) => {
    const latencyMs = Date.now() - questionStartedAtRef.current;
    appendLearningEvents(
      buildLearningEvents({
        missionId,
        question,
        wasCorrect,
        latencyMs,
        hintUsed: openHints[question.id] ?? false,
        attemptCount: (retries[question.id] ?? 0) + 1,
      })
    );
  };

  if (eligible.length === 0) {
    return (
      <div className="rounded-[1.6rem] border border-dashed border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-8 text-center shadow-[var(--kt-shadow-sm)]">
        <div className="mb-2 text-sm font-black uppercase tracking-[0.16em] text-[var(--kt-accent-info)]">Task</div>
        <p className="text-sm text-[var(--kt-ink-muted)]">No supported tasks in this mission yet.</p>
        <button
          type="button"
          onClick={() => onComplete({ total: 0, correctFirstTry: 0, totalRetries: 0, retriesByQuestion: {} })}
          className="mt-4 rounded-[1.2rem] bg-[var(--kt-accent-info)] px-8 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90"
        >
          Continue
        </button>
      </div>
    );
  }
  if (idx >= eligible.length) {
    const totalRetries = Object.values(retries).reduce((s: number, n: number) => s + n, 0);
    const questionsWithRetries = Object.keys(retries).length;
    const correctFirstTry = eligible.length - questionsWithRetries;
    onComplete({ total: eligible.length, correctFirstTry, totalRetries, retriesByQuestion: retries });
    return null;
  }

  const question = eligible[idx];
  const questionRetries = retries[question.id] ?? 0;
  const isQuestionLocked = lockedWrong[question.id] ?? false;
  const showHintButton = isLowConfidence && !challengeMode && questionRetries > 0;
  const hintOpen = openHints[question.id] ?? false;

  const handleCorrect = () => {
    recordVocabAttempt(question, true);
    recordLearningAttempt(question, true);
    setIdx((i) => i + 1);
  };

  const handleIncorrect = () => {
    recordVocabAttempt(question, false);
    recordLearningAttempt(question, false);
    setRetries((prev) => ({
      ...prev,
      [question.id]: (prev[question.id] ?? 0) + 1,
    }));
    if (challengeMode) {
      setLockedWrong((prev) => ({ ...prev, [question.id]: true }));
    }
  };

  const handleLockedAdvance = () => {
    setIdx((i) => i + 1);
  };

  const progress = `${idx + 1} / ${eligible.length}`;
  const progressPct = Math.round(((idx + 1) / eligible.length) * 100);

  return (
    <div
      className={`border bg-[linear-gradient(180deg,var(--kt-surface-raised),var(--kt-surface))] shadow-[var(--kt-shadow-sm)] ${
        isLowConfidence ? 'border-[color:var(--kt-accent-warning)]/35' : 'border-[var(--kt-border-subtle)]'
      } ${isHighConfidence ? 'rounded-[1.35rem] p-3 sm:p-4' : 'rounded-[1.8rem] p-4 sm:p-5'}`}
    >
      <div className={isHighConfidence ? 'mb-4' : 'mb-5'}>
        <div className={`${isHighConfidence ? 'mb-2' : 'mb-3'} flex items-center justify-between gap-4`}>
          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
            Question {progress}
          </span>
          <span className={`rounded-full bg-[var(--kt-accent-info-soft)] font-black uppercase tracking-[0.14em] text-[var(--kt-accent-info)] ${
            isHighConfidence ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-[11px]'
          }`}>
            {progressPct}%
          </span>
        </div>

        <div className={`${isHighConfidence ? 'mb-2 h-1.5' : 'mb-3 h-2'} overflow-hidden rounded-full bg-[var(--kt-progress-track)]`}>
          <div
            className="h-full rounded-full bg-[var(--kt-accent-info)] transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="flex gap-1">
          {eligible.map((_, i) => (
            <div
              key={i}
              className={`${isHighConfidence ? 'h-1 w-5' : 'h-1.5 w-6'} rounded-full ${
                i < idx
                  ? 'bg-[var(--kt-accent-info)] opacity-50'
                  : i === idx
                  ? 'bg-[var(--kt-accent-info)]'
                  : 'bg-[var(--kt-border)]'
              }`}
            />
          ))}
        </div>
      </div>

      {showHintButton && (
        <div className="mb-5 rounded-[1.35rem] border border-[color:var(--kt-accent-warning)]/35 bg-[var(--kt-accent-warning-soft)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--kt-accent-warning)]">
                Scaffold hint
              </div>
              <p className="mt-1 text-xs leading-5 text-[var(--kt-ink-muted)]">
                Use this only after checking the prompt once more.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setOpenHints((current) => ({ ...current, [question.id]: !hintOpen }))
              }
              className="rounded-[1rem] border border-[color:var(--kt-accent-warning)]/45 bg-[var(--kt-surface)] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-accent-warning)] transition hover:bg-[var(--kt-nav-item-hover)]"
            >
              {hintOpen ? 'Hide hint' : 'Show hint'}
            </button>
          </div>
          {hintOpen && (
            <p className="mt-4 rounded-[1rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-3 text-sm leading-6 text-[var(--kt-ink)]">
              {buildQuestionHint(question)}
            </p>
          )}
        </div>
      )}

      {isQuestionLocked && (
        <div className="mb-4 rounded-[1.35rem] border border-red-400/40 bg-red-500/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-red-500">
                Challenge — locked
              </div>
              <p className="mt-1 text-xs leading-5 text-[var(--kt-ink-muted)]">
                Correct answer: <span className="font-jp font-black text-[var(--kt-ink-strong)]">{question.correctAnswer}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={handleLockedAdvance}
              className="shrink-0 rounded-[1rem] border border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)] transition hover:bg-[var(--kt-nav-item-hover)]"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <div
        className={`rounded-[1.5rem] border bg-[var(--kt-surface)] ${
          isHighConfidence ? 'p-3 sm:p-4' : 'p-4 sm:p-5'
        } ${
          isLowConfidence ? 'border-[color:var(--kt-accent-warning)]/25' : 'border-[var(--kt-border-subtle)]'
        } ${isQuestionLocked ? 'pointer-events-none opacity-40' : ''}`}
    >
      {SPEAKING_TYPES.has(question.type) && (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-[var(--kt-border)] bg-[var(--kt-surface-raised)] text-2xl text-[var(--kt-ink-muted)]">
            🎙️
          </div>
          <div>
            <div className="text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
              Speaking mode coming soon
            </div>
            <p className="mt-1 text-xs text-[var(--kt-ink-subtle)]">
              {question.prompt}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCorrect}
            className="rounded-[1rem] border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] px-5 py-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)] transition hover:bg-[var(--kt-nav-item-hover)]"
          >
            Skip (speaking unavailable)
          </button>
        </div>
      )}

      {!SPEAKING_TYPES.has(question.type) && question.type === 'multiple-choice' && (
        <MultipleChoice
          key={question.id}
          question={question}
          retryCount={questionRetries}
          lowConfidence={isLowConfidence}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      )}

      {!SPEAKING_TYPES.has(question.type) && question.type === 'fill-in-blank' && (
        <FillInBlank
          key={question.id}
          question={question}
          retryCount={questionRetries}
          lowConfidence={isLowConfidence}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      )}

      {!SPEAKING_TYPES.has(question.type) && (question.type === 'translation-en-jp' || question.type === 'translation-jp-en') && (
        <TranslationTask
          key={question.id}
          question={question}
          retryCount={questionRetries}
          lowConfidence={isLowConfidence}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      )}

      {!SPEAKING_TYPES.has(question.type) && question.type === 'sentence-build' && (
        <SentenceBuild
          key={question.id}
          question={question}
          retryCount={questionRetries}
          lowConfidence={isLowConfidence}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      )}

      {!SPEAKING_TYPES.has(question.type) && question.type === 'context-select' && (
        <ContextSelect
          key={question.id}
          question={question}
          retryCount={questionRetries}
          lowConfidence={isLowConfidence}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      )}

      {!SPEAKING_TYPES.has(question.type) && question.type === 'listening-recognition' && (
        <ListeningRecognition
          key={question.id}
          question={question}
          retryCount={questionRetries}
          lowConfidence={isLowConfidence}
          onCorrect={handleCorrect}
          onIncorrect={handleIncorrect}
        />
      )}
      </div>
    </div>
  );
};
