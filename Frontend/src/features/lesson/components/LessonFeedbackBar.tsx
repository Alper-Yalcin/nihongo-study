import React, { useState } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';
import type { LearnedWord } from '../lessonTypes';

interface LessonFeedbackBarProps {
  tone: 'correct' | 'wrong';
  smartFeedback?: string;
  explanation?: string;
  continueLabel: string;
  echoWord?: LearnedWord;
  onContinue: () => void;
}

export const LessonFeedbackBar: React.FC<LessonFeedbackBarProps> = ({
  tone,
  smartFeedback,
  explanation,
  continueLabel,
  echoWord,
  onContinue,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  const isCorrect = tone === 'correct';

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t px-4 py-4 shadow-[0_-18px_40px_rgba(0,0,0,0.25)] ${
        isCorrect
          ? 'border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)]'
          : 'border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)]'
      }`}
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-2 text-lg font-black">
              {isCorrect ? (
                <Check size={22} strokeWidth={3} />
              ) : (
                <X size={22} strokeWidth={3} />
              )}
              {isCorrect ? 'Doğru!' : 'Tekrar dene'}
            </div>
            {isCorrect && echoWord && (
              <div className="flex items-center gap-2 rounded-full bg-[var(--kt-surface)] px-3 py-1 text-xs font-black text-[var(--kt-ink-strong)] shadow-[var(--kt-shadow-sm)]">
                <span className="font-jp text-sm">{echoWord.japanese}</span>
                <span className="text-[var(--kt-ink-muted)]">·</span>
                <span>{echoWord.meaning}</span>
              </div>
            )}
            {!isCorrect && smartFeedback && (
              <p className="text-sm font-bold opacity-90">{smartFeedback}</p>
            )}
            {explanation && (
              <button
                type="button"
                onClick={() => setShowExplanation((v) => !v)}
                className="flex items-center gap-1 text-xs font-bold underline opacity-80"
              >
                Neden bu cevap?
                <ChevronDown
                  size={12}
                  className={`transition-transform ${showExplanation ? 'rotate-180' : ''}`}
                />
              </button>
            )}
            {showExplanation && explanation && (
              <p className="text-xs font-bold opacity-80">{explanation}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onContinue}
            className={`shrink-0 rounded-[0.85rem] px-5 py-3 text-sm font-black uppercase tracking-[0.08em] shadow-[var(--kt-shadow-sm)] ${
              isCorrect
                ? 'bg-[var(--kt-surface)] text-[var(--kt-ink-strong)]'
                : 'bg-[var(--kt-surface)] text-[var(--kt-ink-strong)]'
            }`}
          >
            {continueLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
