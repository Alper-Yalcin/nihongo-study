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

  useEffect(() => {
    if (revealed) {
      const t = setTimeout(() => playJapaneseAudio(exercise.audioText), 280);
      return () => clearTimeout(t);
    }
  }, [revealed, exercise.audioText]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-2 pt-4">

      {/* Scene ambient row — no card */}
      {(exercise.sceneBg || exercise.sceneContext) && (
        <div className="flex w-full items-center gap-3">
          {exercise.sceneBg && (
            <span className="text-4xl leading-none">{exercise.sceneBg}</span>
          )}
          {exercise.sceneContext && (
            <span className="text-sm font-bold italic text-[var(--kt-ink-subtle)]">
              {exercise.sceneContext}
            </span>
          )}
        </div>
      )}

      {/* NPC line as dialogue bubble — no wrapper card */}
      {exercise.npcLine && (
        <div className="w-full">
          <div className="inline-block rounded-[1.1rem] rounded-tl-sm bg-[var(--kt-surface)] px-4 py-3 shadow-[0_2px_14px_rgba(0,0,0,0.07)]">
            <span className="font-jp text-xl font-black text-[var(--kt-ink-strong)]">
              「{exercise.npcLine}」
            </span>
          </div>
        </div>
      )}

      {/* Main focus: Japanese word floating, no heavy card */}
      <div className="w-full text-center">
        <span className="mb-3 inline-block rounded-full bg-[var(--kt-brand)] px-3 py-0.5 text-[0.65rem] font-black uppercase tracking-[0.12em] text-[var(--kt-brand-on)]">
          Yeni Kelime
        </span>

        <div
          className={`font-jp text-7xl font-black leading-none tracking-tight transition-colors duration-300 ${
            revealed ? 'text-[var(--kt-brand)]' : 'text-[var(--kt-ink-strong)]'
          }`}
        >
          {exercise.japanese}
        </div>

        <div className="mt-2.5 text-xs font-bold tracking-[0.18em] text-[var(--kt-ink-subtle)]">
          {exercise.romaji}
        </div>

        {/* Revealed content — fades in below the word, no extra card border */}
        {revealed && (
          <div className="mt-5 space-y-3">
            <p className="text-2xl font-black text-[var(--kt-ink-strong)]">
              {exercise.meaning}
            </p>

            {exercise.exampleJapanese && (
              <div className="mx-auto max-w-xs rounded-[0.9rem] bg-[var(--kt-surface-muted)] px-4 py-3 text-left">
                <p className="mb-1 text-[0.65rem] font-black uppercase tracking-wider text-[var(--kt-ink-subtle)]">
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
              <p className="text-xs font-bold italic text-[var(--kt-ink-subtle)]">
                💡 {exercise.usageNote}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action row */}
      {!revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="w-full rounded-[0.95rem] bg-[var(--kt-brand)] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-brand-on)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-brand)_76%,black)] transition hover:opacity-90"
        >
          Anlamını Gör →
        </button>
      ) : (
        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={() => playJapaneseAudio(exercise.audioText)}
            className="flex items-center gap-2 rounded-[0.95rem] border border-[var(--kt-border)] bg-[var(--kt-surface)] px-5 py-4 text-sm font-black text-[var(--kt-ink-strong)] shadow-sm transition hover:bg-[var(--kt-surface-muted)]"
          >
            <Volume2 size={17} className="text-[var(--kt-brand)]" />
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
