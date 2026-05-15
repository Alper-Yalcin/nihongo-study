import React from 'react';
import { BranchingChoice } from '../../../learn/data/jlearn/jlearnTypes';
import { BranchingPickResult, useBranchingChoice } from './useBranchingChoice';

interface BranchingChoicePanelProps {
  branchingChoice: BranchingChoice;
  compact?: boolean;
  onContinue: () => void;
  onPicked?: (pick: BranchingPickResult) => void;
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
  branchingChoice, compact = false, onContinue, onPicked,
}) => {
  const { picked, isPicked, onPick, reset } = useBranchingChoice(branchingChoice);
  const shellClass = compact
    ? 'rounded-[1.35rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-3 shadow-[var(--kt-shadow-sm)] sm:p-4'
    : 'rounded-[1.8rem] border border-[var(--kt-border-subtle)] bg-[linear-gradient(180deg,var(--kt-surface-raised),var(--kt-surface))] p-4 shadow-[var(--kt-shadow-sm)] sm:p-5';
  const headerClass = compact
    ? 'mb-3 flex items-center justify-between gap-3 rounded-[1rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] px-3 py-2'
    : 'mb-4 flex items-center justify-between gap-4 rounded-[1.2rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] px-4 py-3';
  const optionClass = compact
    ? 'w-full rounded-[0.95rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] px-3 py-2.5 text-left font-jp text-sm text-[var(--kt-ink)] transition hover:border-[var(--kt-accent-info)] hover:bg-[var(--kt-nav-item-hover)]'
    : 'w-full rounded-[1.15rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] px-4 py-3.5 text-left font-jp text-base text-[var(--kt-ink)] shadow-[var(--kt-shadow-sm)] transition hover:-translate-y-0.5 hover:border-[var(--kt-accent-info)] hover:bg-[var(--kt-nav-item-hover)]';
  const pickedOptionClass = compact
    ? 'rounded-[0.95rem] border px-3 py-2.5 font-jp text-sm transition'
    : 'rounded-[1.15rem] border px-4 py-3.5 font-jp text-base shadow-[var(--kt-shadow-sm)] transition';

  if (!isPicked) {
    return (
      <div className={shellClass}>
        <div className={headerClass}>
          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
            What do you do?
          </span>
          <span className="rounded-full bg-[var(--kt-accent-info-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-accent-info)]">
            Choice
          </span>
        </div>

        {branchingChoice.promptJapanese && (
          <div
            className={`mb-4 rounded-[1.4rem] border border-[var(--kt-border-subtle)] bg-[radial-gradient(circle_at_top_left,var(--kt-accent-info-soft),transparent_38%),var(--kt-surface)] shadow-[var(--kt-shadow-sm)] ${
              compact ? 'p-3' : 'p-4'
            }`}
          >
            <p className={`font-jp text-[var(--kt-ink-strong)] ${compact ? 'text-lg' : 'text-xl'}`}>
              {branchingChoice.promptJapanese}
            </p>
          </div>
        )}

        <p className={`${compact ? 'mb-4 text-sm' : 'mb-5 text-base'} font-semibold text-[var(--kt-ink-strong)]`}>
          {branchingChoice.prompt}
        </p>

        <div className="space-y-2">
          {branchingChoice.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                const nextPick = onPick(opt.id);
                if (nextPick) {
                  onPicked?.(nextPick);
                }
              }}
              className={optionClass}
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
    <div className={shellClass}>
      <div className="mb-4 space-y-2">
        {branchingChoice.options.map((opt) => {
          const isChosen = opt.id === picked!.option.id;
          return (
            <div
              key={opt.id}
              className={`${pickedOptionClass} ${
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

      <div className={`rounded-[1.5rem] border shadow-[var(--kt-shadow-sm)] ${compact ? 'p-4' : 'p-5'} ${styles.border} ${styles.bg}`}>
        <div className={`mb-2 text-[11px] font-black uppercase tracking-[0.16em] ${styles.label}`}>
          {styles.badge}
        </div>
        <p className={`mb-1 font-semibold text-[var(--kt-ink-strong)] ${compact ? 'text-sm' : 'text-base'}`}>
          {picked!.outcomeText}
        </p>
        {picked!.explanation && (
          <p className={`mt-2 text-sm text-[var(--kt-ink-muted)] ${compact ? 'leading-5' : 'leading-6'}`}>{picked!.explanation}</p>
        )}

        <div className="mt-4 flex gap-3">
          {picked!.result === 'wrong' ? (
            <button
              type="button"
              onClick={reset}
              className={`rounded-[1.2rem] border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink)] transition hover:bg-[var(--kt-nav-item-hover)] ${
                compact ? 'px-5 py-2.5' : 'px-6 py-3'
              }`}
            >
              Try again
            </button>
          ) : (
            <button
              type="button"
              onClick={onContinue}
              className={`rounded-[1.2rem] bg-[var(--kt-accent-info)] text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90 ${
                compact ? 'px-6 py-2.5' : 'px-8 py-3'
              }`}
            >
              Continue →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
