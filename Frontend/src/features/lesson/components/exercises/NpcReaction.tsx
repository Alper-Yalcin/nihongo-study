import React, { useEffect } from 'react';
import type { NpcCharacter, NpcReactionExercise } from '../../lessonTypes';

interface Props {
  exercise: NpcReactionExercise;
  onCorrect: () => void;
  npc?: NpcCharacter;
}

export const NpcReaction: React.FC<Props> = ({ exercise, onCorrect, npc }) => {
  useEffect(() => {
    const timer = setTimeout(() => onCorrect(), 1400);
    return () => clearTimeout(timer);
  }, [exercise.id]);

  // Message may be "JP！ Turkish." — split on first space after Japanese part
  const lines = exercise.message.split(' ');
  const firstWord = lines[0] ?? '';
  const rest = lines.slice(1).join(' ');
  const hasJapanese = /[぀-ヿ一-鿿]/.test(firstWord);

  return (
    <div className="mx-auto flex max-w-xs flex-col items-center justify-center py-12 text-center">
      <div className="relative">
        <div className="text-6xl animate-bounce">{npc?.emoji ?? '⭐'}</div>
      </div>

      <div className="mt-5 rounded-[1.2rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-6 py-4 shadow-[var(--kt-shadow-md)]">
        {hasJapanese ? (
          <>
            <p className="font-jp text-2xl font-black text-[var(--kt-brand)]">{firstWord}</p>
            {rest && <p className="mt-1 text-base font-bold text-[var(--kt-ink-muted)]">{rest}</p>}
          </>
        ) : (
          <p className="text-lg font-black text-[var(--kt-ink-strong)]">{exercise.message}</p>
        )}
        {npc && (
          <p className="mt-2 text-xs font-bold text-[var(--kt-ink-subtle)]">— {npc.name}</p>
        )}
      </div>
    </div>
  );
};
