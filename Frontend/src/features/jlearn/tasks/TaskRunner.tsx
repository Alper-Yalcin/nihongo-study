import React, { useState } from 'react';
import { PracticeQuestion } from '../../../data/jlearn/jlearnTypes';
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
  questions: PracticeQuestion[];
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

export const TaskRunner: React.FC<TaskRunnerProps> = ({ questions, onComplete }) => {
  const eligible = questions.filter((q) => SUPPORTED_TYPES.has(q.type));
  const [idx, setIdx] = useState(0);
  const [retries, setRetries] = useState<Record<string, number>>({});

  if (eligible.length === 0) {
    return (
      <div className="rounded-[1.2rem] border border-dashed border-[var(--kt-border)] p-8 text-center">
        <div className="mb-2 text-2xl">📝</div>
        <p className="text-sm text-[var(--kt-ink-muted)]">No supported tasks in this mission yet.</p>
        <button
          type="button"
          onClick={() => onComplete({ total: 0, correctFirstTry: 0, totalRetries: 0, retriesByQuestion: {} })}
          className="mt-4 rounded-[1.2rem] bg-[var(--kt-accent-info)] px-8 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90"
        >
          Continue →
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

  const handleCorrect = () => setIdx((i) => i + 1);

  const handleRetry = () => {
    setRetries((prev) => ({
      ...prev,
      [question.id]: (prev[question.id] ?? 0) + 1,
    }));
  };

  const progress = `${idx + 1} / ${eligible.length}`;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
          Question {progress}
        </span>
        <div className="flex gap-1">
          {eligible.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full ${
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

      {question.type === 'multiple-choice' && (
        <MultipleChoice
          key={question.id + questionRetries}
          question={question}
          retryCount={questionRetries}
          onCorrect={handleCorrect}
          onRetry={handleRetry}
        />
      )}

      {question.type === 'fill-in-blank' && (
        <FillInBlank
          key={question.id + questionRetries}
          question={question}
          retryCount={questionRetries}
          onCorrect={handleCorrect}
          onRetry={handleRetry}
        />
      )}

      {(question.type === 'translation-en-jp' || question.type === 'translation-jp-en') && (
        <TranslationTask
          key={question.id + questionRetries}
          question={question}
          retryCount={questionRetries}
          onCorrect={handleCorrect}
          onRetry={handleRetry}
        />
      )}

      {question.type === 'sentence-build' && (
        <SentenceBuild
          key={question.id + questionRetries}
          question={question}
          retryCount={questionRetries}
          onCorrect={handleCorrect}
          onRetry={handleRetry}
        />
      )}

      {question.type === 'context-select' && (
        <ContextSelect
          key={question.id + questionRetries}
          question={question}
          retryCount={questionRetries}
          onCorrect={handleCorrect}
          onRetry={handleRetry}
        />
      )}

      {question.type === 'listening-recognition' && (
        <ListeningRecognition
          key={question.id + questionRetries}
          question={question}
          retryCount={questionRetries}
          onCorrect={handleCorrect}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
};
