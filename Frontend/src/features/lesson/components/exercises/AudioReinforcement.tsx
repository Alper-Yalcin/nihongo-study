import React, { useEffect, useState } from 'react';
import { createAudioPlayer } from '../../lessonAudio';
import type { AudioReinforcementExercise } from '../../lessonTypes';
import { AudioOrb } from '../ui/AudioOrb';
import { ChoicePill, deriveChoiceState } from '../ui/ChoicePill';

interface Props {
  exercise: AudioReinforcementExercise;
  onCorrect: () => void;
}

export const AudioReinforcement: React.FC<Props> = ({ exercise, onCorrect }) => {
  const audio = createAudioPlayer(exercise.audioText);
  const [questionAnswered, setQuestionAnswered] = useState<boolean | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => audio.play(), 350);
    return () => clearTimeout(t);
  }, [exercise.id]);

  const handleOptionSelect = (index: number, correct: boolean) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(index);
    setQuestionAnswered(correct);
  };

  const canContinue = !exercise.contextQuestion || questionAnswered !== null;

  return (
    <section className="mx-auto max-w-lg text-center">
      <p className="mb-7 text-xs font-black uppercase tracking-widest text-[var(--kt-ink-subtle)]">
        Dinle ve Öğren
      </p>

      {/* AudioOrb is the visual hero */}
      <AudioOrb onPlay={() => audio.play()} onPlaySlow={() => audio.playSlower()} />

      {/* Japanese floats below orb */}
      <div className="mt-6">
        <div className="font-jp text-5xl font-black leading-none text-[var(--kt-ink-strong)]">
          {exercise.japanese}
        </div>
        <div className="mt-1.5 text-xs font-bold tracking-[0.16em] text-[var(--kt-ink-subtle)]">
          {exercise.romaji}
        </div>
        <div className="mt-3 text-lg font-black text-[var(--kt-ink-muted)]">
          {exercise.meaning}
        </div>
      </div>

      {/* Context question as light pills */}
      {exercise.contextQuestion && (
        <div className="mt-8">
          <p className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--kt-ink-muted)]">
            {exercise.contextQuestion.prompt}
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {exercise.contextQuestion.options.map((opt, i) => (
              <ChoicePill
                key={i}
                state={deriveChoiceState(i, opt.correct, selectedIdx, questionAnswered !== null)}
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
          className="mt-8 w-full rounded-[0.95rem] bg-[var(--kt-brand)] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-brand-on)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-brand)_76%,black)] transition hover:opacity-90"
        >
          Devam et →
        </button>
      )}
    </section>
  );
};
