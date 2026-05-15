import React, { useEffect, useState } from 'react';
import type { ShopInteractionExercise } from '../lessonTypes';

interface Props {
  exercise: ShopInteractionExercise;
  locked: boolean;
  onSelectionChange: (answer: string | null) => void;
}

export const ShopInteractionWidget: React.FC<Props> = ({ exercise, locked, onSelectionChange }) => {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
    onSelectionChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  const handleSelect = (opt: string) => {
    if (locked) return;
    setSelected(opt);
    onSelectionChange(opt);
  };

  return (
    <div className="flex flex-col gap-5 px-4 py-6">
      <div className="w-full rounded-[1.4rem] border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-2xl">🏪</span>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--kt-ink-muted)]">
            Mağaza
          </p>
        </div>
        <p className="text-base text-[var(--kt-ink)]">{exercise.scenario}</p>
        {exercise.scenarioJapanese && (
          <p className="mt-2 font-jp text-sm text-[var(--kt-ink-muted)]">{exercise.scenarioJapanese}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {exercise.options.map((opt) => (
          <button
            key={opt}
            type="button"
            disabled={locked}
            onClick={() => handleSelect(opt)}
            className={`w-full rounded-[1.2rem] border-2 px-5 py-3.5 text-left font-jp text-base font-semibold transition-all ${
              selected === opt
                ? 'border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)] bg-opacity-15 text-[var(--kt-ink-strong)]'
                : 'border-[var(--kt-border)] bg-[var(--kt-surface-raised)] text-[var(--kt-ink)] hover:border-[var(--kt-accent-info)] hover:bg-[var(--kt-nav-item-hover)]'
            } disabled:cursor-default`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
