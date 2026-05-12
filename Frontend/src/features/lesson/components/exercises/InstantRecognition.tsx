import React, { useState } from 'react';
import type { InstantRecognitionExercise } from '../../lessonTypes';
import { ChoicePill, deriveChoiceState } from '../ui/ChoicePill';

interface Props {
  exercise: InstantRecognitionExercise;
  onAnswerSelect: (correct: boolean) => void;
  checked: boolean;
}

export const InstantRecognition: React.FC<Props> = ({ exercise, onAnswerSelect, checked }) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number, correct: boolean) => {
    if (selected !== null) return;
    setSelected(index);
    onAnswerSelect(correct);
  };

  return (
    <section className="mx-auto max-w-lg">
      <p className="mb-6 text-center text-xs font-black uppercase tracking-widest text-[var(--kt-ink-subtle)]">
        Ne anlama gelir?
      </p>

      {/* Japanese word — floating, no heavy card */}
      <div className="mb-8 text-center">
        <div className="font-jp text-[5.5rem] font-black leading-none tracking-tight text-[var(--kt-ink-strong)]">
          {exercise.japanese}
        </div>
        <div className="mt-2 text-xs font-bold tracking-[0.2em] text-[var(--kt-ink-subtle)]">
          {exercise.romaji}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2.5">
        {exercise.options.map((option, i) => (
          <ChoicePill
            key={i}
            state={deriveChoiceState(i, option.correct, selected, checked)}
            onClick={() => handleSelect(i, option.correct)}
            className="text-sm"
          >
            {option.label}
          </ChoicePill>
        ))}
      </div>
    </section>
  );
};
