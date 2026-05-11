import React, { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import type { TeachCardExercise } from '../../lessonTypes';
import { playJapaneseAudio } from '../../lessonAudio';

interface Props {
  exercise: TeachCardExercise;
  onContinue: () => void;
}

export const TeachCard: React.FC<Props> = ({ exercise, onContinue }) => {
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      playJapaneseAudio(exercise.audioText);
      setPlayed(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [exercise.audioText]);

  const handlePlay = () => {
    playJapaneseAudio(exercise.audioText);
    setPlayed(true);
  };

  return (
    <div className="flex flex-col items-center gap-6 px-2 pt-4 text-center">
      {/* New word badge */}
      <span className="rounded-full bg-[var(--kt-brand)] px-3 py-1 text-xs font-black uppercase tracking-widest text-[var(--kt-brand-on)]">
        Yeni Kelime
      </span>

      {/* Main word */}
      <div className="flex flex-col items-center gap-2">
        <span className="font-jp text-6xl font-black text-[var(--kt-ink-strong)] leading-none">
          {exercise.japanese}
        </span>
        <span className="text-base font-bold text-[var(--kt-ink-muted)]">
          {exercise.romaji}
        </span>
      </div>

      {/* Audio button */}
      <button
        type="button"
        onClick={handlePlay}
        className="flex items-center gap-2 rounded-full border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-5 py-2.5 text-sm font-black text-[var(--kt-ink-strong)] shadow-[var(--kt-shadow-sm)] transition hover:bg-[var(--kt-surface-muted)]"
      >
        <Volume2 size={18} className="text-[var(--kt-brand)]" />
        Dinle
      </button>

      {/* Meaning card */}
      <div className="w-full max-w-sm rounded-[1.2rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-6 py-5 shadow-[var(--kt-shadow-md)]">
        <p className="text-xs font-black uppercase tracking-wider text-[var(--kt-ink-muted)] mb-2">
          Anlamı
        </p>
        <p className="text-2xl font-black text-[var(--kt-ink-strong)]">
          {exercise.meaning}
        </p>

        {exercise.exampleJapanese && (
          <div className="mt-4 border-t border-[var(--kt-border)] pt-4">
            <p className="text-xs font-bold text-[var(--kt-ink-subtle)] mb-1">Örnek</p>
            <p className="font-jp text-lg font-black text-[var(--kt-ink-strong)]">
              {exercise.exampleJapanese}
            </p>
            {exercise.exampleMeaning && (
              <p className="mt-0.5 text-sm font-bold text-[var(--kt-ink-muted)]">
                {exercise.exampleMeaning}
              </p>
            )}
          </div>
        )}

        {exercise.usageNote && (
          <p className="mt-3 text-xs font-bold text-[var(--kt-ink-subtle)] italic">
            {exercise.usageNote}
          </p>
        )}
      </div>

      {/* Continue button — only after audio played */}
      <button
        type="button"
        onClick={onContinue}
        disabled={!played}
        className={`w-full max-w-sm rounded-[0.95rem] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] transition ${
          played
            ? 'bg-[var(--kt-brand)] text-[var(--kt-brand-on)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-brand)_76%,black)]'
            : 'cursor-not-allowed bg-[var(--kt-surface-muted)] text-[var(--kt-ink-subtle)]'
        }`}
      >
        Devam et →
      </button>
    </div>
  );
};
