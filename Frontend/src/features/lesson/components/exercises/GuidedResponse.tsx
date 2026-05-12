import React, { useEffect, useState } from 'react';
import { createAudioPlayer } from '../../lessonAudio';
import type { GuidedResponseExercise } from '../../lessonTypes';
import { DialogueBubble } from '../ui/DialogueBubble';
import { deriveChoiceState } from '../ui/ChoicePill';

interface Props {
  exercise: GuidedResponseExercise;
  onAnswerSelect: (correct: boolean) => void;
  checked: boolean;
}

function replyBubbleCls(
  i: number,
  correct: boolean,
  selected: number | null,
  checked: boolean,
): string {
  const base =
    'rounded-[1rem] rounded-tr-sm px-4 py-3 font-jp text-base font-black text-right transition-all duration-150';
  const state = deriveChoiceState(i, correct, selected, checked);

  const stateMap: Record<string, string> = {
    idle: 'border border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] hover:-translate-y-0.5 hover:border-[var(--kt-brand)] cursor-pointer',
    selected:
      'border-2 border-[var(--kt-brand)] bg-[var(--kt-brand-soft,var(--kt-surface-muted))] text-[var(--kt-brand)] pointer-events-none',
    correct:
      'border-2 border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)] pointer-events-none',
    wrong: 'border-2 border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)] pointer-events-none',
    dimmed: 'border border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-muted)] opacity-30 pointer-events-none',
  };
  return `${base} ${stateMap[state]}`;
}

export const GuidedResponse: React.FC<Props> = ({ exercise, onAnswerSelect, checked }) => {
  const audio = createAudioPlayer(exercise.audioText);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => audio.play(), 500);
    return () => clearTimeout(t);
  }, [exercise.id]);

  const handleSelect = (index: number, correct: boolean) => {
    if (selected !== null) return;
    setSelected(index);
    onAnswerSelect(correct);
  };

  return (
    <section className="mx-auto max-w-lg space-y-5">
      {/* NPC dialogue bubble */}
      <DialogueBubble
        speaker="npc"
        japanese={exercise.npcJapanese}
        meaning={exercise.npcMeaning}
        onAudio={() => audio.play()}
      />

      {/* Reply options — right-aligned chat bubble style */}
      <div className="mt-4">
        <p className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--kt-ink-subtle)]">
          Nasıl cevap verirsin?
        </p>
        <div className="flex flex-col items-end gap-2.5">
          {exercise.options.map((option, i) => (
            <button
              key={i}
              type="button"
              className={replyBubbleCls(i, option.correct, selected, checked)}
              onClick={() => handleSelect(i, option.correct)}
            >
              {option.japanese}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
