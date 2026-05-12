import React from 'react';

export type ChoiceState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed';

export function deriveChoiceState(
  index: number,
  correct: boolean,
  selected: number | null,
  checked: boolean,
): ChoiceState {
  if (selected === null) return 'idle';
  if (!checked) return index === selected ? 'selected' : 'dimmed';
  if (correct) return 'correct';
  if (index === selected) return 'wrong';
  return 'dimmed';
}

interface Props {
  state: ChoiceState;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const STATE_CLASSES: Record<ChoiceState, string> = {
  idle: [
    'border border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-strong)]',
    'shadow-[0_2px_0_var(--kt-border)]',
    'hover:-translate-y-0.5 hover:border-[var(--kt-brand)] cursor-pointer',
  ].join(' '),
  selected: [
    'border-2 border-[var(--kt-brand)] bg-[var(--kt-brand-soft,var(--kt-surface-muted))] text-[var(--kt-brand)]',
    'pointer-events-none',
  ].join(' '),
  correct: [
    'border-2 border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)]',
    'pointer-events-none',
  ].join(' '),
  wrong: [
    'border-2 border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)]',
    'pointer-events-none',
  ].join(' '),
  dimmed: [
    'border border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-muted)] opacity-30',
    'pointer-events-none',
  ].join(' '),
};

export const ChoicePill: React.FC<Props> = ({ state, onClick, children, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-[0.85rem] px-4 py-3 font-black transition-all duration-150 ${STATE_CLASSES[state]} ${className}`}
  >
    {children}
  </button>
);
