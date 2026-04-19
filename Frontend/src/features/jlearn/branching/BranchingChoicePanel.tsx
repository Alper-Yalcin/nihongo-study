import React from 'react';
import { BranchingChoice } from '../../../data/jlearn/jlearnTypes';
import { useBranchingChoice } from './useBranchingChoice';

interface BranchingChoicePanelProps {
  branchingChoice: BranchingChoice;
  onContinue: () => void;
}

const OUTCOME_STYLES = {
  correct: {
    border: 'border-[var(--kt-accent-info)]',
    bg: 'bg-[var(--kt-accent-info)] bg-opacity-10',
    label: 'text-[var(--kt-accent-info)]',
    badge: 'Correct',
  },
  partial: {
    border: 'border-amber-400',
    bg: 'bg-amber-400 bg-opacity-10',
    label: 'text-amber-500',
    badge: 'Close',
  },
  wrong: {
    border: 'border-red-400',
    bg: 'bg-red-500 bg-opacity-10',
    label: 'text-red-500',
    badge: 'Not quite',
  },
} as const;

export const BranchingChoicePanel: React.FC<BranchingChoicePanelProps> = ({
  branchingChoice, onContinue,
}) => {
  const { picked, isPicked, onPick, reset } = useBranchingChoice(branchingChoice);

  if (!isPicked) {
    return (
      <div>
        <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
          What do you do?
        </div>

        {branchingChoice.promptJapanese && (
          <div className="mb-4 rounded-[1.2rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-4">
            <p className="font-jp text-xl text-[var(--kt-ink-strong)]">{branchingChoice.promptJapanese}</p>
          </div>
        )}

        <p className="mb-5 text-base font-semibold text-[var(--kt-ink-strong)]">
          {branchingChoice.prompt}
        </p>

        <div className="space-y-2">
          {branchingChoice.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onPick(opt.id)}
              className="w-full rounded-[1rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] px-4 py-3.5 text-left font-jp text-base text-[var(--kt-ink)] transition hover:border-[var(--kt-accent-info)] hover:bg-[var(--kt-nav-item-hover)]"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const styles = OUTCOME_STYLES[picked!.result];

  return (
    <div>
      <div className="mb-4 space-y-2">
        {branchingChoice.options.map((opt) => {
          const isChosen = opt.id === picked!.option.id;
          return (
            <div
              key={opt.id}
              className={`rounded-[1rem] border px-4 py-3.5 font-jp text-base transition ${
                isChosen
                  ? `${styles.border} ${styles.bg} ${styles.label}`
                  : 'border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] text-[var(--kt-ink-muted)] opacity-50'
              }`}
            >
              {opt.label}
            </div>
          );
        })}
      </div>

      <div className={`rounded-[1.2rem] border p-5 ${styles.border} ${styles.bg}`}>
        <div className={`mb-2 text-[11px] font-black uppercase tracking-[0.16em] ${styles.label}`}>
          {styles.badge}
        </div>
        <p className="mb-1 text-base font-semibold text-[var(--kt-ink-strong)]">
          {picked!.outcomeText}
        </p>
        {picked!.explanation && (
          <p className="mt-2 text-sm leading-6 text-[var(--kt-ink-muted)]">{picked!.explanation}</p>
        )}

        <div className="mt-4 flex gap-3">
          {picked!.result === 'wrong' ? (
            <button
              type="button"
              onClick={reset}
              className="rounded-[1.2rem] border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink)] transition hover:bg-[var(--kt-nav-item-hover)]"
            >
              Try again
            </button>
          ) : (
            <button
              type="button"
              onClick={onContinue}
              className="rounded-[1.2rem] bg-[var(--kt-accent-info)] px-8 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90"
            >
              Continue →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
