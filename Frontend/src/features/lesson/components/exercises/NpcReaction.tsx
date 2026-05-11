import React, { useEffect } from 'react';
import type { NpcReactionExercise } from '../../lessonTypes';

interface Props {
  exercise: NpcReactionExercise;
  onCorrect: () => void;
}

export const NpcReaction: React.FC<Props> = ({ exercise, onCorrect }) => {
  useEffect(() => {
    const timer = setTimeout(() => onCorrect(), 900);
    return () => clearTimeout(timer);
  }, [exercise.id]);

  return (
    <div className="mx-auto flex max-w-xs flex-col items-center justify-center py-8 text-center">
      <div className="text-5xl">⭐</div>
      <div className="mt-3 text-xl font-black text-[var(--kt-ink-strong)]">
        {exercise.message}
      </div>
    </div>
  );
};
