import React, { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { createAudioPlayer } from '../../lessonAudio';
import type { AudioToKanaExercise } from '../../lessonTypes';

interface Props {
  exercise: AudioToKanaExercise;
  onAnswerSelect: (correct: boolean) => void;
  checked: boolean;
}

function optionCls(i: number, correct: boolean, selected: number | null, checked: boolean): string {
  const base = 'rounded-[0.9rem] border-2 px-5 py-5 font-jp text-2xl font-black transition';

  if (selected === null) {
    return `${base} border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] shadow-[inset_0_-4px_0_var(--kt-border-subtle)] hover:-translate-y-0.5 cursor-pointer`;
  }
  if (!checked) {
    if (i === selected) {
      return `${base} border-[var(--kt-brand)] bg-[var(--kt-brand-soft,var(--kt-surface-muted))] text-[var(--kt-brand)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-brand)_25%,transparent)]`;
    }
    return `${base} border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-muted)] opacity-40`;
  }
  if (correct) {
    return `${base} border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-accent-success)_30%,transparent)]`;
  }
  if (i === selected) {
    return `${base} border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-accent-danger)_30%,transparent)]`;
  }
  return `${base} border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-muted)] opacity-40`;
}

export const AudioToKana: React.FC<Props> = ({ exercise, onAnswerSelect, checked }) => {
  const audio = createAudioPlayer(exercise.audioText);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => audio.play(), 400);
    return () => clearTimeout(timer);
  }, [exercise.id]);

  const handleSelect = (index: number, correct: boolean) => {
    if (selected !== null) return;
    setSelected(index);
    onAnswerSelect(correct);
  };

  return (
    <section className="mx-auto max-w-2xl text-center">
      <p className="mb-6 text-sm font-black uppercase tracking-wider text-[var(--kt-ink-muted)]">
        Duyduğun kana'yı seç
      </p>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => audio.play()}
          className="flex h-20 w-20 items-center justify-center rounded-[1.3rem] bg-[var(--kt-accent-info)] text-white shadow-[inset_0_-5px_0_color-mix(in_srgb,var(--kt-accent-info)_70%,black)] transition hover:scale-105"
          aria-label="Sesi çal"
        >
          <Volume2 size={38} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => audio.playSlower()}
          className="flex h-12 w-12 items-center justify-center rounded-[0.85rem] bg-[var(--kt-accent-info)] text-white opacity-70 shadow-[inset_0_-3px_0_color-mix(in_srgb,var(--kt-accent-info)_70%,black)]"
          aria-label="Yavaş çal"
        >
          <Volume2 size={22} strokeWidth={2.5} />
        </button>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4">
        {exercise.options.map((option, i) => (
          <button
            key={i}
            type="button"
            className={optionCls(i, option.correct, selected, checked)}
            onClick={() => handleSelect(i, option.correct)}
          >
            {option.japanese}
          </button>
        ))}
      </div>
    </section>
  );
};
