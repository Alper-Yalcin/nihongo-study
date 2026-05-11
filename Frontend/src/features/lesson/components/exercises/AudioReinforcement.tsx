import React, { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { createAudioPlayer } from '../../lessonAudio';
import type { AudioReinforcementExercise } from '../../lessonTypes';

interface Props {
  exercise: AudioReinforcementExercise;
  onCorrect: () => void;
}

export const AudioReinforcement: React.FC<Props> = ({ exercise, onCorrect }) => {
  const audio = createAudioPlayer(exercise.audioText);
  const [questionAnswered, setQuestionAnswered] = useState<boolean | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => audio.play(), 300);
    return () => clearTimeout(timer);
  }, [exercise.id]);

  const handleOptionSelect = (index: number, correct: boolean) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(index);
    setQuestionAnswered(correct);
  };

  const canContinue = !exercise.contextQuestion || questionAnswered !== null;

  return (
    <section className="mx-auto max-w-2xl">
      <div className="rounded-[1.6rem] border-2 border-[var(--kt-accent-info)] bg-[var(--kt-accent-info-soft)] p-8 text-center shadow-[var(--kt-shadow-md)]">
        <div className="font-jp text-6xl font-black text-[var(--kt-ink-strong)] leading-none">
          {exercise.japanese}
        </div>
        <div className="mt-3 text-base font-bold text-[var(--kt-ink-subtle)]">
          {exercise.romaji}
        </div>
        <div className="mt-4 text-2xl font-black text-[var(--kt-ink-strong)]">
          {exercise.meaning}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => audio.play()}
            className="flex h-16 w-16 items-center justify-center rounded-[1.1rem] bg-[var(--kt-accent-info)] text-white shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-accent-info)_70%,black)]"
            aria-label="Sesi çal"
          >
            <Volume2 size={32} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={() => audio.playSlower()}
            className="flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-[var(--kt-accent-info)] text-white opacity-75 shadow-[inset_0_-3px_0_color-mix(in_srgb,var(--kt-accent-info)_70%,black)]"
            aria-label="Yavaş çal"
          >
            <Volume2 size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {exercise.contextQuestion && (
        <div className="mt-5">
          <p className="mb-3 text-sm font-black uppercase tracking-wider text-[var(--kt-ink-muted)]">
            {exercise.contextQuestion.prompt}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {exercise.contextQuestion.options.map((opt, i) => {
              let cls =
                'rounded-[0.85rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-3 text-sm font-black text-[var(--kt-ink-strong)] shadow-[inset_0_-3px_0_var(--kt-border-subtle)] transition';

              if (selectedIdx !== null) {
                if (opt.correct) {
                  cls =
                    'rounded-[0.85rem] border-2 border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] px-4 py-3 text-sm font-black text-[var(--kt-accent-success)] shadow-[inset_0_-3px_0_color-mix(in_srgb,var(--kt-accent-success)_30%,transparent)]';
                } else if (i === selectedIdx) {
                  cls =
                    'rounded-[0.85rem] border-2 border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)] px-4 py-3 text-sm font-black text-[var(--kt-accent-danger)] shadow-[inset_0_-3px_0_color-mix(in_srgb,var(--kt-accent-danger)_30%,transparent)]';
                } else {
                  cls += ' opacity-40';
                }
              } else {
                cls += ' hover:-translate-y-0.5 cursor-pointer';
              }

              return (
                <button
                  key={i}
                  type="button"
                  className={cls}
                  onClick={() => handleOptionSelect(i, opt.correct)}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {canContinue && (
        <button
          type="button"
          onClick={onCorrect}
          className="mt-6 w-full rounded-[0.95rem] bg-[var(--kt-brand)] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-brand-on)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-brand)_76%,black)]"
        >
          Devam et →
        </button>
      )}
    </section>
  );
};
