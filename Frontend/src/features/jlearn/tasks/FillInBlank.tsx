import React, { useRef, useState } from 'react';
import { PracticeQuestion } from '../../../data/jlearn/jlearnTypes';
import { isAnswerCorrect } from './answerNormalizer';

interface FillInBlankProps {
  question: PracticeQuestion;
  retryCount: number;
  onCorrect: () => void;
  onRetry: () => void;
}

type State = 'idle' | 'wrong' | 'correct';

export const FillInBlank: React.FC<FillInBlankProps> = ({
  question, retryCount, onCorrect, onRetry,
}) => {
  const [value, setValue] = useState('');
  const [state, setState] = useState<State>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim()) return;
    if (isAnswerCorrect(value, question.correctAnswer, question.acceptedAnswers)) {
      setState('correct');
      setTimeout(onCorrect, 600);
    } else {
      setState('wrong');
    }
  };

  const handleRetry = () => {
    setValue('');
    setState('idle');
    onRetry();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const borderColor =
    state === 'correct'
      ? 'border-[var(--kt-accent-info)]'
      : state === 'wrong'
      ? 'border-red-500'
      : 'border-[var(--kt-border)]';

  return (
    <div>
      <p className="mb-5 text-base font-semibold text-[var(--kt-ink-strong)]">{question.prompt}</p>
      {question.promptJapanese && (
        <p className="mb-5 font-jp text-xl text-[var(--kt-ink)]">{question.promptJapanese}</p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={state !== 'idle'}
          placeholder="Type your answer…"
          autoFocus
          className={`w-full rounded-[1rem] border px-4 py-3.5 text-sm text-[var(--kt-ink)] outline-none transition placeholder:text-[var(--kt-ink-muted)] focus:border-[var(--kt-accent-info)] bg-[var(--kt-surface-raised)] ${borderColor}`}
        />

        {state === 'idle' && (
          <button
            type="submit"
            disabled={!value.trim()}
            className="mt-4 rounded-[1.2rem] bg-[var(--kt-accent-info)] px-8 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:opacity-40"
          >
            Check
          </button>
        )}
      </form>

      {state === 'wrong' && (
        <div className="mt-4 rounded-[1.2rem] border border-red-500 bg-red-500 bg-opacity-10 p-4">
          {question.explanation ? (
            <p className="mb-3 text-sm text-[var(--kt-ink)]">{question.explanation}</p>
          ) : (
            <p className="mb-3 text-sm text-[var(--kt-ink-muted)]">
              Correct answer:{' '}
              <span className="font-black text-[var(--kt-ink-strong)]">{question.correctAnswer}</span>
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
