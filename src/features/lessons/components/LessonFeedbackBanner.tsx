import React from 'react';

type FeedbackState = 'answering' | 'correct' | 'incorrect';

interface Props {
  state: FeedbackState;
  correctAnswer?: string;
  explanation?: string;
}

export const LessonFeedbackBanner: React.FC<Props> = ({ state, correctAnswer, explanation }) => {
  if (state === 'answering') return null;

  const isCorrect = state === 'correct';

  return (
    <div
      className={`border-t-2 px-5 py-4 transition-all ${
        isCorrect
          ? 'border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)] bg-opacity-10'
          : 'border-red-400 bg-red-400 bg-opacity-10'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-xl">{isCorrect ? '✓' : '✗'}</span>
        <div>
          <p
            className={`text-sm font-bold ${
              isCorrect ? 'text-[var(--kt-accent-info)]' : 'text-red-500'
            }`}
          >
            {isCorrect ? 'Doğru!' : 'Yanlış'}
          </p>
          {!isCorrect && correctAnswer && (
            <p className="mt-1 text-sm text-[var(--kt-ink)]">
              Doğru cevap:{' '}
              <span className="font-jp font-bold text-[var(--kt-ink-strong)]">{correctAnswer}</span>
            </p>
          )}
          {explanation && (
            <p className="mt-1 text-sm text-[var(--kt-ink-muted)]">{explanation}</p>
          )}
        </div>
      </div>
    </div>
  );
};
