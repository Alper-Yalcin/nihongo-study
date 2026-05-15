import React, { useEffect, useState } from 'react';
import type { TapImageMatchExercise } from '../lessonTypes';

interface Props {
  exercise: TapImageMatchExercise;
  locked: boolean;
  onSelectionChange: (answer: string | null) => void;
}

export const TapImageMatchWidget: React.FC<Props> = ({ exercise, locked, onSelectionChange }) => {
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
    <div className="flex flex-col items-center gap-6 px-4 py-6">
      <div
        className="flex h-36 w-36 items-center justify-center rounded-[2rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface-raised)] text-7xl"
        aria-label={exercise.imageAlt}
        role="img"
      >
        {exercise.imageEmoji}
      </div>

      <div className="grid w-full max-w-sm grid-cols-2 gap-3">
        {exercise.options.map((opt) => (
          <button
            key={opt}
            type="button"
            disabled={locked}
            onClick={() => handleSelect(opt)}
            className={`rounded-[1.2rem] border-2 px-4 py-4 font-jp text-xl font-semibold transition-all ${
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
