import React, { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { createAudioPlayer } from '../../lessonAudio';
import type { GuidedResponseExercise } from '../../lessonTypes';

interface Props {
  exercise: GuidedResponseExercise;
  onAnswerSelect: (correct: boolean) => void;
  checked: boolean;
}

function optionCls(i: number, correct: boolean, selected: number | null, checked: boolean): string {
  const base = 'rounded-[0.9rem] border-2 px-5 py-4 text-left font-jp text-lg font-black transition';

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

export const GuidedResponse: React.FC<Props> = ({ exercise, onAnswerSelect, checked }) => {
  const audio = createAudioPlayer(exercise.audioText);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => audio.play(), 500);
    return () => clearTimeout(timer);
  }, [exercise.id]);

  const handleSelect = (index: number, correct: boolean) => {
    if (selected !== null) return;
    setSelected(index);
    onAnswerSelect(correct);
  };

  return (
    <section className="mx-auto max-w-2xl">
      <div className="rounded-[1.4rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] p-6 shadow-[var(--kt-shadow-md)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => audio.play()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[0.85rem] bg-[var(--kt-accent-info)] text-white shadow-[inset_0_-3px_0_color-mix(in_srgb,var(--kt-accent-info)_70%,black)]"
          >
            <Volume2 size={24} strokeWidth={2.5} />
          </button>
          <div>
            <div className="font-jp text-2xl font-black text-[var(--kt-ink-strong)]">
              {exercise.npcJapanese}
            </div>
            <div className="mt-0.5 text-sm font-bold text-[var(--kt-ink-muted)]">
              {exercise.npcMeaning}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 mb-3 text-sm font-black uppercase tracking-wider text-[var(--kt-ink-muted)]">
        Nasıl cevap verirsin?
      </p>

      <div className="flex flex-col gap-3">
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
