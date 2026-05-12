import React, { useState } from 'react';
import type { VisualContextExercise } from '../../lessonTypes';
import { ChoicePill, deriveChoiceState } from '../ui/ChoicePill';

interface Props {
  exercise: VisualContextExercise;
  onCorrect: () => void;
}

export const VisualContext: React.FC<Props> = ({ exercise, onCorrect }) => {
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handleOptionSelect = (index: number, correct: boolean) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(index);
    setAnswered(correct);
  };

  const canContinue = !exercise.contextQuestion || answered !== null;

  return (
    <section className="mx-auto max-w-lg">
      {/* Scene — large emoji, no container */}
      <div className="mb-5 text-center text-7xl leading-none">{exercise.scene}</div>

      {/* NPC line as floating dialogue bubble */}
      <div className="mb-5">
        <div className="inline-block rounded-[1.1rem] rounded-tl-sm bg-[var(--kt-surface)] px-5 py-3.5 shadow-[0_2px_14px_rgba(0,0,0,0.07)]">
          <div className="font-jp text-2xl font-black text-[var(--kt-ink-strong)]">
            {exercise.npcJapanese}
          </div>
          <div className="mt-0.5 text-sm font-bold text-[var(--kt-ink-muted)]">
            {exercise.npcMeaning}
          </div>
        </div>
      </div>

      {/* Context question as light pills */}
      {exercise.contextQuestion && (
        <div className="mt-6">
          <p className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--kt-ink-muted)]">
            {exercise.contextQuestion.prompt}
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {exercise.contextQuestion.options.map((opt, i) => (
              <ChoicePill
                key={i}
                state={deriveChoiceState(i, opt.correct, selectedIdx, answered !== null)}
                onClick={() => handleOptionSelect(i, opt.correct)}
                className="text-sm"
              >
                {opt.label}
              </ChoicePill>
            ))}
          </div>
        </div>
      )}

      {canContinue && (
        <button
          type="button"
          onClick={onCorrect}
          className="mt-7 w-full rounded-[0.95rem] bg-[var(--kt-brand)] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-brand-on)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-brand)_76%,black)] transition hover:opacity-90"
        >
          Devam et →
        </button>
      )}
    </section>
  );
};
