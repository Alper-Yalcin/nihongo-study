import React, { useState } from 'react';
import { PracticeQuestion } from '../../../data/jlearn/jlearnTypes';
import { isAnswerCorrect } from './answerNormalizer';

interface MultipleChoiceProps {
  question: PracticeQuestion;
  retryCount: number;
  lowConfidence?: boolean;
  onCorrect: () => void;
  onIncorrect: () => void;
}

type State = 'idle' | 'wrong' | 'correct';

export const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  question, retryCount, lowConfidence = false, onCorrect, onIncorrect,
}) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [state, setState] = useState<State>('idle');

  const options = question.options ?? [];
  const wrongBorder = lowConfidence ? 'border-[color:var(--kt-accent-warning)]/55' : 'border-red-500';
  const wrongBg = lowConfidence ? 'bg-[var(--kt-accent-warning-soft)]' : 'bg-red-500 bg-opacity-10';
  const wrongText = lowConfidence ? 'text-[var(--kt-accent-warning)]' : 'text-red-500';

  const handleSubmit = () => {
    if (!selected) return;
    if (isAnswerCorrect(selected, question.correctAnswer, question.acceptedAnswers)) {
      setState('correct');
      setTimeout(onCorrect, 600);
    } else {
      setState('wrong');
      onIncorrect();
    }
  };

  const handleRetry = () => {
    setSelected(null);
    setState('idle');
  };

  return (
    <div>
      <p className="mb-5 text-base font-semibold text-[var(--kt-ink-strong)]">{question.prompt}</p>
      {question.promptJapanese && (
        <p className="mb-5 font-jp text-xl text-[var(--kt-ink)]">{question.promptJapanese}</p>
      )}

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
              border = wrongBorder;
              bg = wrongBg;
              text = wrongText;
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
              className={`w-full rounded-[1rem] border px-4 py-3.5 text-left text-sm font-semibold transition ${border} ${bg} ${text}`}
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
        <div className={`mt-5 rounded-[1.2rem] border p-4 ${wrongBorder} ${wrongBg}`}>
          {question.explanation && (
            <p className="mb-3 text-sm text-[var(--kt-ink)]">{question.explanation}</p>
          )}
          {!question.explanation && (
            <p className="mb-3 text-sm text-[var(--kt-ink-muted)]">
              Correct answer: <span className="font-black text-[var(--kt-ink-strong)]">{question.correctAnswer}</span>
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
