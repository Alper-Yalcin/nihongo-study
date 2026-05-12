import React, { useRef, useState } from 'react';
import { PracticeQuestion } from '../../../learn/data/jlearn/jlearnTypes';
import { isAnswerCorrect } from './answerNormalizer';

interface TranslationTaskProps {
  question: PracticeQuestion;
  retryCount: number;
  lowConfidence?: boolean;
  onCorrect: () => void;
  onIncorrect: () => void;
}

type State = 'idle' | 'wrong' | 'correct';

const DIRECTION_LABEL: Record<string, string> = {
  'translation-en-jp': 'Translate to Japanese',
  'translation-jp-en': 'Translate to English',
};

export const TranslationTask: React.FC<TranslationTaskProps> = ({
  question, retryCount, lowConfidence = false, onCorrect, onIncorrect,
}) => {
  const [value, setValue] = useState('');
  const [state, setState] = useState<State>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const wrongBorder = lowConfidence ? 'border-[color:var(--kt-accent-warning)]/55' : 'border-red-500';
  const wrongBg = lowConfidence ? 'bg-[var(--kt-accent-warning-soft)]' : 'bg-red-500 bg-opacity-10';

  const isJpTarget = question.type === 'translation-en-jp';
  const dirLabel = DIRECTION_LABEL[question.type] ?? 'Translate';

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim()) return;
    if (isAnswerCorrect(value, question.correctAnswer, question.acceptedAnswers)) {
      setState('correct');
      setTimeout(onCorrect, 600);
    } else {
      setState('wrong');
      onIncorrect();
    }
  };

  const handleRetry = () => {
    setValue('');
    setState('idle');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const borderColor =
    state === 'correct'
      ? 'border-[var(--kt-accent-info)]'
      : state === 'wrong'
      ? wrongBorder
      : 'border-[var(--kt-border)]';

  return (
    <div>
      <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
        {dirLabel}
      </div>

      <div className="mb-5 rounded-[1.2rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-4">
        {question.promptJapanese ? (
          <p className="font-jp text-xl text-[var(--kt-ink-strong)]">{question.promptJapanese}</p>
        ) : (
          <p className={`text-base font-semibold text-[var(--kt-ink-strong)] ${!isJpTarget ? 'font-jp text-xl' : ''}`}>
            {question.prompt}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={state !== 'idle'}
          placeholder={isJpTarget ? 'Type in Japanese…' : 'Type in English…'}
          autoFocus
          className={`w-full rounded-[1rem] border px-4 py-3.5 text-sm text-[var(--kt-ink)] outline-none transition placeholder:text-[var(--kt-ink-muted)] focus:border-[var(--kt-accent-info)] bg-[var(--kt-surface-raised)] ${borderColor} ${isJpTarget ? 'font-jp text-lg' : ''}`}
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

      {state === 'correct' && (
        <div className="mt-4 rounded-[1.2rem] border border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)] bg-opacity-10 p-4">
          <p className="text-sm font-semibold text-[var(--kt-accent-info)]">Correct!</p>
        </div>
      )}

      {state === 'wrong' && (
        <div className={`mt-4 rounded-[1.2rem] border p-4 ${wrongBorder} ${wrongBg}`}>
          {question.explanation ? (
            <p className="mb-3 text-sm text-[var(--kt-ink)]">{question.explanation}</p>
          ) : (
            <p className="mb-3 text-sm text-[var(--kt-ink-muted)]">
              Correct answer:{' '}
              <span className={`font-black text-[var(--kt-ink-strong)] ${isJpTarget ? 'font-jp' : ''}`}>
                {question.correctAnswer}
              </span>
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
