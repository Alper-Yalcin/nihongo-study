import React, { useEffect, useState } from 'react';
import type { NpcReplyChoiceExercise } from '../lessonTypes';

interface Props {
  exercise: NpcReplyChoiceExercise;
  locked: boolean;
  onSelectionChange: (answer: string | null) => void;
}

export const NpcReplyChoiceWidget: React.FC<Props> = ({ exercise, locked, onSelectionChange }) => {
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

  const initial = exercise.npcName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col gap-5 px-4 py-6">
      {/* NPC area */}
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--kt-brand)] bg-opacity-20 text-base font-bold text-[var(--kt-brand)]">
          {initial}
        </div>
        <div className="flex-1">
          <p className="mb-0.5 text-xs font-semibold text-[var(--kt-ink-muted)]">{exercise.npcName}</p>
          <div className="rounded-[1.2rem] rounded-tl-none border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] px-4 py-3">
            <p className="font-jp text-lg text-[var(--kt-ink-strong)]">{exercise.npcLine}</p>
            {exercise.npcLineRomaji && (
              <p className="mt-0.5 text-xs text-[var(--kt-ink-muted)]">{exercise.npcLineRomaji}</p>
            )}
            {exercise.npcLineTranslation && (
              <p className="mt-1 text-sm italic text-[var(--kt-ink-muted)]">
                &ldquo;{exercise.npcLineTranslation}&rdquo;
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm font-semibold text-[var(--kt-ink-muted)]">Ne cevap verirsin?</p>

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
