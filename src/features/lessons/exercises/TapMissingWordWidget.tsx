import React, { useEffect, useState } from 'react';
import type { TapMissingWordExercise } from '../lessonTypes';

interface Props {
  exercise: TapMissingWordExercise;
  locked: boolean;
  onSelectionChange: (answer: string | null) => void;
}

export const TapMissingWordWidget: React.FC<Props> = ({ exercise, locked, onSelectionChange }) => {
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

  const displaySentence = selected
    ? exercise.sentenceWithBlank.replace(exercise.gapMarker, selected)
    : exercise.sentenceWithBlank;

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6">
      <div className="w-full max-w-sm rounded-[1.4rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5 text-center">
        <p className="font-jp text-2xl leading-relaxed text-[var(--kt-ink-strong)]">
          {displaySentence.split(exercise.gapMarker).map((part, i, arr) =>
            i < arr.length - 1 ? (
              <React.Fragment key={i}>
                {part}
                <span className="inline-block min-w-[4rem] rounded-[0.6rem] border-b-2 border-dashed border-[var(--kt-brand)] bg-[var(--kt-brand)] bg-opacity-10 px-2 py-0.5 align-middle font-bold text-[var(--kt-brand)]">
                  {selected ?? '　'}
                </span>
              </React.Fragment>
            ) : (
              part
            )
          )}
        </p>
      </div>

      <div className="grid w-full max-w-sm grid-cols-2 gap-3">
        {exercise.options.map((opt) => (
          <button
            key={opt}
            type="button"
            disabled={locked}
            onClick={() => handleSelect(opt)}
            className={`rounded-[1.2rem] border-2 px-4 py-4 font-jp text-lg font-semibold transition-all ${
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
