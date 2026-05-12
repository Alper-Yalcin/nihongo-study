import React, { useEffect, useState } from 'react';
import { createAudioPlayer } from '../../lessonAudio';
import type { ListeningConversationExercise } from '../../lessonTypes';
import { AudioOrb } from '../ui/AudioOrb';
import { DialogueBubble } from '../ui/DialogueBubble';
import { deriveChoiceState } from '../ui/ChoicePill';

interface Props {
  exercise: ListeningConversationExercise;
  onCorrect: () => void;
  onWrong: () => void;
}

function replyBubbleCls(
  i: number,
  correct: boolean,
  selected: number | null,
): string {
  const base =
    'rounded-[1rem] rounded-tr-sm px-4 py-3 font-jp text-lg font-black text-right transition-all duration-150';
  const state = deriveChoiceState(i, correct, selected, selected !== null);

  const stateMap: Record<string, string> = {
    idle: 'border border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] hover:-translate-y-0.5 hover:border-[var(--kt-brand)] cursor-pointer',
    selected: 'border-2 border-[var(--kt-brand)] bg-[var(--kt-brand-soft,var(--kt-surface-muted))] text-[var(--kt-brand)] pointer-events-none',
    correct: 'border-2 border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)] pointer-events-none',
    wrong: 'border-2 border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)] pointer-events-none',
    dimmed: 'border border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-muted)] opacity-30 pointer-events-none',
  };
  return `${base} ${stateMap[state] ?? stateMap.dimmed}`;
}

export const ListeningConversation: React.FC<Props> = ({ exercise, onCorrect, onWrong }) => {
  const audio = createAudioPlayer(exercise.audioText);
  const [revealed, setRevealed] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => audio.play(), 400);
    return () => clearTimeout(t);
  }, [exercise.id]);

  const handleSelect = (index: number, correct: boolean) => {
    if (selected !== null) return;
    setSelected(index);
    if (correct) onCorrect();
    else onWrong();
  };

  return (
    <section className="mx-auto max-w-lg">
      <p className="mb-6 text-center text-xs font-black uppercase tracking-widest text-[var(--kt-ink-subtle)]">
        Önce dinle, sonra cevapla
      </p>

      {/* AudioOrb as hero */}
      <div className="mb-7 flex justify-center">
        <AudioOrb onPlay={() => audio.play()} onPlaySlow={() => audio.playSlower()} />
      </div>

      {/* Hidden text / reveal */}
      {!revealed ? (
        <div className="mb-6 text-center">
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="text-xs font-bold text-[var(--kt-ink-subtle)] underline"
          >
            Japonca'yı göster (ipucu)
          </button>
        </div>
      ) : (
        <div className="mb-6">
          <DialogueBubble
            speaker="npc"
            japanese={exercise.hiddenJapanese}
            meaning={exercise.hiddenMeaning}
          />
        </div>
      )}

      {/* Reply options */}
      <p className="mb-3 text-right text-xs font-black uppercase tracking-wider text-[var(--kt-ink-subtle)]">
        Ne dedi?
      </p>
      <div className="flex flex-col items-end gap-2.5">
        {exercise.options.map((option, i) => (
          <button
            key={i}
            type="button"
            className={replyBubbleCls(i, option.correct, selected)}
            onClick={() => handleSelect(i, option.correct)}
          >
            {option.japanese}
          </button>
        ))}
      </div>
    </section>
  );
};
