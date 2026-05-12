import React, { useState } from 'react';
import type { KanaRecognitionExercise } from '../../lessonTypes';
import { ChoicePill, deriveChoiceState } from '../ui/ChoicePill';

interface Props {
  exercise: KanaRecognitionExercise;
  onAnswerSelect: (correct: boolean) => void;
  checked: boolean;
}

export const KanaRecognition: React.FC<Props> = ({ exercise, onAnswerSelect, checked }) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number, correct: boolean) => {
    if (selected !== null) return;
    setSelected(index);
    onAnswerSelect(correct);
  };

  return (
    <section className="mx-auto max-w-lg">
      <p className="mb-6 text-center text-xs font-black uppercase tracking-widest text-[var(--kt-ink-subtle)]">
        Nasıl okunur?
      </p>

      {/* Kana character — floating, no card */}
      <div className="mb-8 text-center">
        <div className="font-jp text-[7rem] font-black leading-none tracking-tight text-[var(--kt-ink-strong)]">
          {exercise.japanese}
        </div>
      </div>

      {/* Romaji options as compact chips */}
      <div className="grid grid-cols-2 gap-2.5">
        {exercise.options.map((option, i) => (
          <ChoicePill
            key={i}
            state={deriveChoiceState(i, option.correct, selected, checked)}
            onClick={() => handleSelect(i, option.correct)}
            className="font-mono text-base text-center"
          >
            {option.label}
          </ChoicePill>
        ))}
      </div>
    </section>
  );
};
