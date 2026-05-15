import React, { useEffect, useMemo, useState } from 'react';
import type { ArrangeConversationExercise } from '../lessonTypes';

interface Props {
  exercise: ArrangeConversationExercise;
  locked: boolean;
  onSelectionChange: (answer: string | null) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const ArrangeConversationWidget: React.FC<Props> = ({
  exercise,
  locked,
  onSelectionChange,
}) => {
  const shuffledIndices = useMemo(
    () => shuffle(exercise.turns.map((_, i) => i)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exercise.id]
  );

  const [orderedIndices, setOrderedIndices] = useState<number[]>([]);
  const [bankIndices, setBankIndices] = useState<number[]>(shuffledIndices);

  useEffect(() => {
    setOrderedIndices([]);
    setBankIndices(shuffledIndices);
    onSelectionChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  useEffect(() => {
    if (orderedIndices.length === exercise.turns.length) {
      onSelectionChange(orderedIndices.join(','));
    } else {
      onSelectionChange(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderedIndices]);

  const addToOrder = (idx: number) => {
    if (locked) return;
    setBankIndices((b) => b.filter((i) => i !== idx));
    setOrderedIndices((o) => [...o, idx]);
  };

  const removeFromOrder = (idx: number) => {
    if (locked) return;
    setOrderedIndices((o) => o.filter((i) => i !== idx));
    setBankIndices((b) => [...b, idx]);
  };

  return (
    <div className="flex flex-col gap-5 px-4 py-6">
      <p className="text-sm font-semibold text-[var(--kt-ink-muted)]">{exercise.prompt}</p>

      {/* Answer area */}
      <div className="min-h-[64px] rounded-[1.2rem] border-2 border-dashed border-[var(--kt-border)] p-3">
        {orderedIndices.length === 0 ? (
          <span className="text-sm text-[var(--kt-ink-muted)]">Satırları doğru sıraya koy…</span>
        ) : (
          <div className="flex flex-col gap-2">
            {orderedIndices.map((idx, pos) => (
              <button
                key={`order-${idx}`}
                type="button"
                onClick={() => removeFromOrder(idx)}
                disabled={locked}
                className="w-full rounded-[0.8rem] border border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)] bg-opacity-10 px-3 py-2 text-left font-jp text-sm text-[var(--kt-ink)] transition hover:bg-opacity-20 disabled:cursor-default"
              >
                <span className="mr-2 text-xs font-bold text-[var(--kt-accent-info)]">{pos + 1}.</span>
                {exercise.turns[idx]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bank */}
      <div className="flex flex-col gap-2">
        {bankIndices.map((idx) => (
          <button
            key={`bank-${idx}`}
            type="button"
            onClick={() => addToOrder(idx)}
            disabled={locked}
            className="w-full rounded-[0.8rem] border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] px-3 py-2 text-left font-jp text-sm text-[var(--kt-ink)] transition hover:border-[var(--kt-accent-info)] hover:bg-[var(--kt-nav-item-hover)] disabled:cursor-default disabled:opacity-50"
          >
            {exercise.turns[idx]}
          </button>
        ))}
      </div>
    </div>
  );
};
