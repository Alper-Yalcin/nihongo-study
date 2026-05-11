import React, { useState } from 'react';
import type { InstantRecognitionExercise } from '../../lessonTypes';

interface Props {
  exercise: InstantRecognitionExercise;
  onAnswerSelect: (correct: boolean) => void;
  checked: boolean;
}

function optionCls(i: number, correct: boolean, selected: number | null, checked: boolean): string {
  const base = 'rounded-[0.9rem] border-2 px-5 py-4 text-left text-base font-black transition';

  if (selected === null) {
    return `${base} border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] shadow-[inset_0_-4px_0_var(--kt-border-subtle)] hover:-translate-y-0.5 cursor-pointer`;
  }
  if (!checked) {
    if (i === selected) {
      return `${base} border-[var(--kt-brand)] bg-[var(--kt-brand-soft,var(--kt-surface-muted))] text-[var(--kt-brand)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-brand)_25%,transparent)]`;
    }
    return `${base} border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-muted)] opacity-40`;
  }
  if (correct) {
    return `${base} border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-accent-success)_30%,transparent)]`;
  }
  if (i === selected) {
    return `${base} border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-accent-danger)_30%,transparent)]`;
  }
  return `${base} border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-muted)] opacity-40`;
}

export const InstantRecognition: React.FC<Props> = ({ exercise, onAnswerSelect, checked }) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number, correct: boolean) => {
    if (selected !== null) return;
    setSelected(index);
    onAnswerSelect(correct);
  };

  return (
    <section className="mx-auto max-w-2xl">
      <p className="mb-4 text-sm font-black uppercase tracking-wider text-[var(--kt-ink-muted)]">
        Ne anlama gelir?
      </p>

      <div className="rounded-[1.6rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] p-8 text-center shadow-[var(--kt-shadow-md)]">
        <div className="font-jp text-6xl font-black text-[var(--kt-ink-strong)] leading-none">
          {exercise.japanese}
        </div>
        <div className="mt-3 text-base font-bold text-[var(--kt-ink-subtle)]">
          {exercise.romaji}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {exercise.options.map((option, i) => (
          <button
            key={i}
            type="button"
            className={optionCls(i, option.correct, selected, checked)}
            onClick={() => handleSelect(i, option.correct)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </section>
  );
};
