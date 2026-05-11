import React, { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';
import type { TeachCardExercise } from '../../lessonTypes';
import { playJapaneseAudio } from '../../lessonAudio';

interface Props {
  exercise: TeachCardExercise;
  onContinue: () => void;
}

export const TeachCard: React.FC<Props> = ({ exercise, onContinue }) => {
  const [revealed, setRevealed] = useState(false);

  // Auto-play audio when meaning is revealed
  useEffect(() => {
    if (revealed) {
      const timer = setTimeout(() => playJapaneseAudio(exercise.audioText), 250);
      return () => clearTimeout(timer);
    }
  }, [revealed, exercise.audioText]);

  const handleReveal = () => setRevealed(true);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-5 px-2 pt-2">

      {/* Scene background + NPC speech bubble */}
      {(exercise.sceneBg || exercise.npcLine || exercise.sceneContext) && (
        <div className="rounded-[1.4rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-5 py-4 shadow-[var(--kt-shadow-sm)]">
          {exercise.sceneBg && (
            <div className="mb-3 text-5xl leading-none">{exercise.sceneBg}</div>
          )}
          {exercise.npcLine && (
            <div className="mb-2 inline-block rounded-[1rem] rounded-tl-sm bg-[var(--kt-surface-muted)] px-4 py-2.5">
              <span className="font-jp text-xl font-black text-[var(--kt-ink-strong)]">
                「{exercise.npcLine}」
              </span>
            </div>
          )}
          {exercise.sceneContext && (
            <p className="text-sm font-bold text-[var(--kt-ink-subtle)] italic">
              {exercise.sceneContext}
            </p>
          )}
        </div>
      )}

      {/* Main word card */}
      <div className={`rounded-[1.6rem] border-2 p-8 text-center shadow-[var(--kt-shadow-md)] transition-colors duration-300 ${
        revealed
          ? 'border-[var(--kt-brand)] bg-[var(--kt-brand-soft,var(--kt-surface-muted))]'
          : 'border-[var(--kt-border)] bg-[var(--kt-surface)]'
      }`}>
        {/* New word badge */}
        <span className="mb-4 inline-block rounded-full bg-[var(--kt-brand)] px-3 py-1 text-xs font-black uppercase tracking-widest text-[var(--kt-brand-on)]">
          Yeni Kelime
        </span>

        {/* Japanese — always visible, large and primary */}
        <div className="font-jp text-7xl font-black text-[var(--kt-ink-strong)] leading-none">
          {exercise.japanese}
        </div>

        {/* Romaji — always visible but secondary */}
        <div className="mt-3 text-sm font-bold tracking-widest text-[var(--kt-ink-subtle)]">
          {exercise.romaji}
        </div>

        {/* Meaning + details — only after reveal */}
        {revealed && (
          <div className="mt-5 border-t border-[var(--kt-border)] pt-5">
            <p className="text-2xl font-black text-[var(--kt-ink-strong)]">
              {exercise.meaning}
            </p>

            {exercise.exampleJapanese && (
              <div className="mt-4 rounded-[0.8rem] bg-[var(--kt-surface)] px-4 py-3 text-left">
                <p className="text-xs font-black uppercase tracking-wider text-[var(--kt-ink-subtle)] mb-1">
                  Örnek
                </p>
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
                💡 {exercise.usageNote}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!revealed ? (
        <button
          type="button"
          onClick={handleReveal}
          className="w-full rounded-[0.95rem] bg-[var(--kt-brand)] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-brand-on)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-brand)_76%,black)] transition hover:opacity-90"
        >
          Anlamını Gör →
        </button>
      ) : (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => playJapaneseAudio(exercise.audioText)}
            className="flex items-center gap-2 rounded-[0.95rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-5 py-4 text-sm font-black text-[var(--kt-ink-strong)] shadow-[var(--kt-shadow-sm)] transition hover:bg-[var(--kt-surface-muted)]"
          >
            <Volume2 size={18} className="text-[var(--kt-brand)]" />
            Dinle
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="flex-1 rounded-[0.95rem] bg-[var(--kt-brand)] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-brand-on)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-brand)_76%,black)] transition hover:opacity-90"
          >
            Devam et →
          </button>
        </div>
      )}
    </div>
  );
};
