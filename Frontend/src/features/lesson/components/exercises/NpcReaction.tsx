import React, { useEffect } from 'react';
import type { NpcCharacter, NpcReactionExercise } from '../../lessonTypes';

interface Props {
  exercise: NpcReactionExercise;
  onCorrect: () => void;
  npc?: NpcCharacter;
}

export const NpcReaction: React.FC<Props> = ({ exercise, onCorrect, npc }) => {
  useEffect(() => {
    const t = setTimeout(() => onCorrect(), 1400);
    return () => clearTimeout(t);
  }, [exercise.id]);

  const lines = exercise.message.split(' ');
  const firstWord = lines[0] ?? '';
  const rest = lines.slice(1).join(' ');
  const hasJapanese = /[぀-ヿ一-鿿]/.test(firstWord);

  return (
    <div className="mx-auto flex max-w-xs flex-col items-center justify-center py-16 text-center">
      {/* Floating emoji — no card */}
      <div className="text-6xl animate-bounce">{npc?.emoji ?? '⭐'}</div>

      {/* Floating message — minimal container */}
      <div className="mt-5">
        {hasJapanese ? (
          <>
            <p className="font-jp text-3xl font-black text-[var(--kt-brand)]">{firstWord}</p>
            {rest && (
              <p className="mt-1.5 text-sm font-bold text-[var(--kt-ink-muted)]">{rest}</p>
            )}
          </>
        ) : (
          <p className="text-xl font-black text-[var(--kt-ink-strong)]">{exercise.message}</p>
        )}
        {npc && (
          <p className="mt-2 text-xs font-bold text-[var(--kt-ink-subtle)]">— {npc.name}</p>
        )}
      </div>
    </div>
  );
};
