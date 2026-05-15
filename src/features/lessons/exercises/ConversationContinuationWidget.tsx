import React, { useEffect, useState } from 'react';
import type { ConversationContinuationExercise } from '../lessonTypes';

interface Props {
  exercise: ConversationContinuationExercise;
  locked: boolean;
  onSelectionChange: (answer: string | null) => void;
}

export const ConversationContinuationWidget: React.FC<Props> = ({
  exercise,
  locked,
  onSelectionChange,
}) => {
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
      {/* Conversation history */}
      <div className="flex flex-col gap-2">
        {exercise.conversationSoFar.map((turn, i) => {
          const isEven = i % 2 === 0;
          return (
            <div
              key={i}
              className={`flex ${isEven ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-[1.2rem] px-4 py-2.5 ${
                  isEven
                    ? 'rounded-tl-none border border-[var(--kt-border)] bg-[var(--kt-surface-raised)]'
                    : 'bg-[var(--kt-accent-info)] bg-opacity-20'
                }`}
              >
                <p className="mb-0.5 text-xs font-semibold text-[var(--kt-ink-muted)]">
                  {turn.speaker}
                </p>
                <p className="font-jp text-base text-[var(--kt-ink-strong)]">{turn.line}</p>
              </div>
            </div>
          );
        })}
        {/* Placeholder for user's reply */}
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-[1.2rem] rounded-tr-none border-2 border-dashed border-[var(--kt-border)] px-4 py-2.5">
            <p className="font-jp text-base text-[var(--kt-ink-muted)]">
              {selected ?? '？'}
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm font-semibold text-[var(--kt-ink-muted)]">Konuşmayı nasıl sürdürürsün?</p>

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
