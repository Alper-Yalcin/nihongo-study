import React, { useEffect, useState } from 'react';
import { createAudioPlayer } from '../../lessonAudio';
import type { AudioToMeaningExercise } from '../../lessonTypes';
import { AudioOrb } from '../ui/AudioOrb';
import { ChoicePill, deriveChoiceState } from '../ui/ChoicePill';

interface Props {
  exercise: AudioToMeaningExercise;
  onAnswerSelect: (correct: boolean) => void;
  checked: boolean;
}

export const AudioToMeaning: React.FC<Props> = ({ exercise, onAnswerSelect, checked }) => {
  const audio = createAudioPlayer(exercise.audioText);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => audio.play(), 400);
    return () => clearTimeout(t);
  }, [exercise.id]);

  const handleSelect = (index: number, correct: boolean) => {
    if (selected !== null) return;
    setSelected(index);
    onAnswerSelect(correct);
  };

  return (
    <section className="mx-auto max-w-lg text-center">
      <p className="mb-7 text-xs font-black uppercase tracking-widest text-[var(--kt-ink-subtle)]">
        Ne anlama gelir?
      </p>

      {/* AudioOrb as hero */}
      <AudioOrb onPlay={() => audio.play()} onPlaySlow={() => audio.playSlower()} />

      {/* Optional JP reveal */}
      <div className="mt-4 h-8">
        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="text-xs font-bold text-[var(--kt-ink-subtle)] underline"
          >
            Japonca'yı göster
          </button>
        ) : (
          <span className="font-jp text-2xl font-black text-[var(--kt-ink-muted)]">
            {exercise.japanese}
          </span>
        )}
      </div>

      {/* Meaning options */}
      <div className="mt-6 grid grid-cols-2 gap-2.5">
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
