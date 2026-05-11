import React, { useState } from 'react';
import type { VisualContextExercise } from '../../lessonTypes';

interface Props {
  exercise: VisualContextExercise;
  onCorrect: () => void;
}

export const VisualContext: React.FC<Props> = ({ exercise, onCorrect }) => {
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handleOptionSelect = (index: number, correct: boolean) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(index);
    setAnswered(correct);
  };

  const canContinue = !exercise.contextQuestion || answered !== null;

  return (
    <section className="mx-auto max-w-2xl">
      <div className="rounded-[1.6rem] border-2 border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-8 shadow-[var(--kt-shadow-md)]">
        <div className="text-center text-6xl">{exercise.scene}</div>
        <div className="mt-6 rounded-[1rem] bg-[var(--kt-surface-muted)] p-4">
          <div className="font-jp text-2xl font-black text-[var(--kt-ink-strong)]">
            {exercise.npcJapanese}
          </div>
          <div className="mt-1 text-base font-bold text-[var(--kt-ink-muted)]">
            {exercise.npcMeaning}
          </div>
        </div>
      </div>

      {exercise.contextQuestion && (
        <div className="mt-5">
          <p className="mb-3 text-sm font-black uppercase tracking-wider text-[var(--kt-ink-muted)]">
            {exercise.contextQuestion.prompt}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {exercise.contextQuestion.options.map((opt, i) => {
              let cls =
                'rounded-[0.85rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-3 text-sm font-black text-[var(--kt-ink-strong)] shadow-[inset_0_-3px_0_var(--kt-border-subtle)] transition';

              if (selectedIdx !== null) {
                if (opt.correct) {
                  cls =
                    'rounded-[0.85rem] border-2 border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] px-4 py-3 text-sm font-black text-[var(--kt-accent-success)] shadow-[inset_0_-3px_0_color-mix(in_srgb,var(--kt-accent-success)_30%,transparent)]';
                } else if (i === selectedIdx) {
                  cls =
                    'rounded-[0.85rem] border-2 border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)] px-4 py-3 text-sm font-black text-[var(--kt-accent-danger)] shadow-[inset_0_-3px_0_color-mix(in_srgb,var(--kt-accent-danger)_30%,transparent)]';
                } else {
                  cls += ' opacity-40';
                }
              } else {
                cls += ' hover:-translate-y-0.5 cursor-pointer';
              }

              return (
                <button
                  key={i}
                  type="button"
                  className={cls}
                  onClick={() => handleOptionSelect(i, opt.correct)}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {canContinue && (
        <button
          type="button"
          onClick={onCorrect}
          className="mt-6 w-full rounded-[0.95rem] bg-[var(--kt-brand)] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-brand-on)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-brand)_76%,black)]"
        >
          Devam et →
        </button>
      )}
    </section>
  );
};
