import React, { useState } from 'react';
import { PracticeQuestion } from '../../../data/jlearn/jlearnTypes';
import { isAnswerCorrect } from './answerNormalizer';

interface ContextSelectProps {
  question: PracticeQuestion;
  retryCount: number;
  onCorrect: () => void;
  onRetry: () => void;
}

type State = 'idle' | 'wrong' | 'correct';

export const ContextSelect: React.FC<ContextSelectProps> = ({
  question, retryCount, onCorrect, onRetry,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<State>('idle');

  const options = question.options ?? [];

  const handleSubmit = () => {
    if (!selected) return;
    if (isAnswerCorrect(selected, question.correctAnswer, question.acceptedAnswers)) {
      setState('correct');
      setTimeout(onCorrect, 600);
    } else {
      setState('wrong');
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setState('idle');
    onRetry();
  };

  return (
    <div>
      {/* Scenario card — prominent display */}
      <div className="mb-6 rounded-[1.4rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-5">
        <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
          Situation
        </div>
        <p className="text-base leading-7 text-[var(--kt-ink-strong)]">{question.prompt}</p>
        {question.promptJapanese && (
          <p className="mt-3 font-jp text-xl text-[var(--kt-ink)]">{question.promptJapanese}</p>
        )}
      </div>

      <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
        What do you say?
      </div>

      <div className="space-y-2">
        {options.map((opt) => {
          const isSelected = selected === opt;
          const isCorrectOpt = isAnswerCorrect(opt, question.correctAnswer, question.acceptedAnswers);
          let border = 'border-[var(--kt-border-subtle)]';
          let bg = 'bg-[var(--kt-surface-raised)]';
          let text = 'text-[var(--kt-ink)]';

          if (state === 'correct' && isSelected) {
            border = 'border-[var(--kt-accent-info)]';
            bg = 'bg-[var(--kt-accent-info)] bg-opacity-10';
            text = 'text-[var(--kt-accent-info)]';
          } else if (state === 'wrong') {
            if (isSelected) {
              border = 'border-red-500';
              bg = 'bg-red-500 bg-opacity-10';
              text = 'text-red-500';
            } else if (isCorrectOpt) {
              border = 'border-[var(--kt-accent-info)]';
              bg = 'bg-[var(--kt-accent-info)] bg-opacity-10';
              text = 'text-[var(--kt-accent-info)]';
            }
          } else if (isSelected) {
            border = 'border-[var(--kt-accent-info)]';
          }

          return (
            <button
              key={opt}
              type="button"
              disabled={state !== 'idle'}
              onClick={() => setSelected(opt)}
              className={`w-full rounded-[1rem] border px-4 py-3.5 text-left font-jp text-base transition ${border} ${bg} ${text}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {state === 'idle' && (
        <button
          type="button"
          disabled={!selected}
          onClick={handleSubmit}
          className="mt-5 rounded-[1.2rem] bg-[var(--kt-accent-info)] px-8 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:opacity-40"
        >
          Check
        </button>
      )}

      {state === 'wrong' && (
        <div className="mt-5 rounded-[1.2rem] border border-red-500 bg-red-500 bg-opacity-10 p-4">
          {question.explanation ? (
            <p className="mb-3 text-sm text-[var(--kt-ink)]">{question.explanation}</p>
          ) : (
            <p className="mb-3 text-sm text-[var(--kt-ink-muted)]">
              Correct answer:{' '}
              <span className="font-jp font-black text-[var(--kt-ink-strong)]">{question.correctAnswer}</span>
            </p>
          )}
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-[1rem] border border-[var(--kt-border)] px-5 py-2.5 text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink)] transition hover:bg-[var(--kt-nav-item-hover)]"
          >
            Try again {retryCount > 0 ? `(${retryCount})` : ''}
          </button>
        </div>
      )}
    </div>
  );
};
