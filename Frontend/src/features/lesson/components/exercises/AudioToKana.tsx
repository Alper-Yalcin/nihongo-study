import React, { useEffect, useState } from 'react';
import { createAudioPlayer } from '../../lessonAudio';
import type { AudioToKanaExercise } from '../../lessonTypes';
import { AudioOrb } from '../ui/AudioOrb';
import { deriveChoiceState } from '../ui/ChoicePill';

interface Props {
  exercise: AudioToKanaExercise;
  onAnswerSelect: (correct: boolean) => void;
  checked: boolean;
}

function kanaOptionCls(
  i: number,
  correct: boolean,
  selected: number | null,
  checked: boolean,
): string {
  const base = 'rounded-[0.95rem] py-5 font-jp text-3xl font-black text-center transition-all duration-150';
  const state = deriveChoiceState(i, correct, selected, checked);

  const stateMap: Record<string, string> = {
    idle: 'border border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] shadow-[0_2px_0_var(--kt-border)] hover:-translate-y-0.5 hover:border-[var(--kt-brand)] cursor-pointer',
    selected: 'border-2 border-[var(--kt-brand)] bg-[var(--kt-brand-soft,var(--kt-surface-muted))] text-[var(--kt-brand)] pointer-events-none',
    correct: 'border-2 border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)] pointer-events-none',
    wrong: 'border-2 border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)] pointer-events-none',
    dimmed: 'border border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-muted)] opacity-30 pointer-events-none',
  };
  return `${base} ${stateMap[state]}`;
}

export const AudioToKana: React.FC<Props> = ({ exercise, onAnswerSelect, checked }) => {
  const audio = createAudioPlayer(exercise.audioText);
  const [selected, setSelected] = useState<number | null>(null);

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
        Duyduğun kana'yı seç
      </p>

      {/* AudioOrb as hero */}
      <AudioOrb onPlay={() => audio.play()} onPlaySlow={() => audio.playSlower()} />

      {/* 2×2 large kana tiles */}
      <div className="mt-10 grid grid-cols-2 gap-3">
        {exercise.options.map((option, i) => (
          <button
            key={i}
            type="button"
            className={kanaOptionCls(i, option.correct, selected, checked)}
            onClick={() => handleSelect(i, option.correct)}
          >
            {option.japanese}
          </button>
        ))}
      </div>
    </section>
  );
};
