import React, { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { createAudioPlayer } from '../../lessonAudio';
import type { ListeningConversationExercise } from '../../lessonTypes';

interface Props {
  exercise: ListeningConversationExercise;
  onCorrect: () => void;
  onWrong: () => void;
}

export const ListeningConversation: React.FC<Props> = ({ exercise, onCorrect, onWrong }) => {
  const audio = createAudioPlayer(exercise.audioText);
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => audio.play(), 400);
    return () => clearTimeout(timer);
  }, [exercise.id]);

  const handleSelect = (index: number, correct: boolean) => {
    if (selected !== null) return;
    setSelected(index);
    if (correct) onCorrect();
    else onWrong();
  };

  return (
    <section className="mx-auto max-w-2xl text-center">
      <p className="mb-6 text-sm font-black uppercase tracking-wider text-[var(--kt-ink-muted)]">
        Önce dinle, sonra cevapla
      </p>

      <div className="rounded-[1.4rem] border-2 border-[var(--kt-accent-info)] bg-[var(--kt-accent-info-soft)] p-8 shadow-[var(--kt-shadow-md)]">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => audio.play()}
              className="flex h-18 w-18 h-16 w-16 items-center justify-center rounded-[1.1rem] bg-[var(--kt-accent-info)] text-white shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-accent-info)_70%,black)] transition hover:scale-105"
            >
              <Volume2 size={32} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => audio.playSlower()}
              className="flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-[var(--kt-accent-info)] text-white opacity-70"
            >
              <Volume2 size={20} strokeWidth={2.5} />
            </button>
          </div>

          {revealed ? (
            <div>
              <div className="font-jp text-2xl font-black text-[var(--kt-ink-strong)]">
                {exercise.hiddenJapanese}
              </div>
              <div className="mt-1 text-sm font-bold text-[var(--kt-ink-muted)]">
                {exercise.hiddenMeaning}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="text-sm font-bold text-[var(--kt-ink-subtle)] underline"
            >
              Japonca'yı göster (ipucu)
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 mb-3 text-sm font-black uppercase tracking-wider text-[var(--kt-ink-muted)]">
        Ne dedi?
      </p>

      <div className="grid grid-cols-2 gap-3">
        {exercise.options.map((option, i) => {
          let cls =
            'rounded-[0.9rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-5 py-4 font-jp text-lg font-black text-[var(--kt-ink-strong)] shadow-[inset_0_-4px_0_var(--kt-border-subtle)] transition';

          if (selected !== null) {
            if (option.correct) {
              cls =
                'rounded-[0.9rem] border-2 border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] px-5 py-4 font-jp text-lg font-black text-[var(--kt-accent-success)] shadow-none';
            } else if (i === selected) {
              cls =
                'rounded-[0.9rem] border-2 border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)] px-5 py-4 font-jp text-lg font-black text-[var(--kt-accent-danger)] shadow-none';
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
              onClick={() => handleSelect(i, option.correct)}
            >
              {option.japanese}
            </button>
          );
        })}
      </div>
    </section>
  );
};
