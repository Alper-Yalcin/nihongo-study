import React, { useEffect, useRef, useState } from 'react';
import { createAudioPlayer } from '../../lessonAudio';
import type { ConversationChainExercise, ConversationMemory } from '../../lessonTypes';
import { DialogueBubble } from '../ui/DialogueBubble';
import { deriveChoiceState } from '../ui/ChoicePill';

interface Props {
  exercise: ConversationChainExercise;
  memory?: ConversationMemory;
  onMemoryUpdate?: (key: string, value: string) => void;
  onCorrect: () => void;
  onWrong: () => void;
}

function resolveTemplate(template: string, memory: ConversationMemory): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => memory[key] ?? _);
}

function replyBubbleCls(
  i: number,
  correct: boolean,
  selected: number | null,
): string {
  const base =
    'rounded-[1rem] rounded-tr-sm px-4 py-3 font-jp text-base font-black text-right transition-all duration-150';
  const state = deriveChoiceState(i, correct, selected, true);

  if (selected === null) {
    return `${base} border border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] hover:-translate-y-0.5 hover:border-[var(--kt-brand)] cursor-pointer`;
  }
  const stateMap: Record<string, string> = {
    selected: 'border-2 border-[var(--kt-brand)] bg-[var(--kt-brand-soft,var(--kt-surface-muted))] text-[var(--kt-brand)] pointer-events-none',
    correct: 'border-2 border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)] pointer-events-none',
    wrong: 'border-2 border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)] pointer-events-none',
    dimmed: 'border border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-muted)] opacity-30 pointer-events-none',
  };
  return `${base} ${stateMap[state] ?? stateMap.dimmed}`;
}

export const ConversationChain: React.FC<Props> = ({
  exercise,
  memory = {},
  onMemoryUpdate,
  onCorrect,
  onWrong,
}) => {
  const [turnIdx, setTurnIdx] = useState(0);
  const [wrongOnce, setWrongOnce] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const currentTurn = exercise.turns[turnIdx] ?? null;
  const isDone = !currentTurn;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turnIdx]);

  useEffect(() => {
    if (isDone) {
      if (wrongOnce) onWrong();
      else onCorrect();
    }
  }, [isDone]);

  useEffect(() => {
    if (!currentTurn || currentTurn.speaker !== 'npc' || !currentTurn.audioText) return;
    const audio = createAudioPlayer(currentTurn.audioText);
    const t = setTimeout(() => audio.play(), 300);
    return () => clearTimeout(t);
  }, [turnIdx]);

  const handleAdvance = () => {
    setSelectedOption(null);
    setTurnIdx((prev) => prev + 1);
  };

  const handleUserSelect = (index: number, correct: boolean, japanese: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (!correct) setWrongOnce(true);

    if (currentTurn?.memoryKey && onMemoryUpdate) {
      const cleaned = japanese.replace(/です$/, '').trim();
      onMemoryUpdate(currentTurn.memoryKey, cleaned);
    }

    setTimeout(() => {
      setSelectedOption(null);
      setTurnIdx((prev) => prev + 1);
    }, 700);
  };

  return (
    <section className="mx-auto max-w-lg">
      <div className="space-y-3">
        {/* Past turns — dimmed */}
        {exercise.turns.slice(0, turnIdx).map((turn, i) => {
          if (turn.speaker === 'npc') {
            return (
              <DialogueBubble
                key={i}
                speaker="npc"
                japanese={resolveTemplate(turn.npcJapanese ?? '', memory)}
                meaning={turn.npcMeaning ? resolveTemplate(turn.npcMeaning, memory) : undefined}
                dimmed
              />
            );
          }
          return (
            <DialogueBubble
              key={i}
              speaker="user"
              japanese={turn.userOptions?.find((o) => o.correct)?.japanese ?? '...'}
              dimmed
            />
          );
        })}

        {/* Current NPC turn */}
        {currentTurn?.speaker === 'npc' && (
          <DialogueBubble
            speaker="npc"
            japanese={resolveTemplate(currentTurn.npcJapanese ?? '', memory)}
            meaning={
              currentTurn.npcMeaning
                ? resolveTemplate(currentTurn.npcMeaning, memory)
                : undefined
            }
            onAudio={
              currentTurn.audioText
                ? () => createAudioPlayer(currentTurn.audioText!).play()
                : undefined
            }
          />
        )}

        {/* Current NPC — advance button */}
        {currentTurn?.speaker === 'npc' && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAdvance}
              className="rounded-[0.85rem] bg-[var(--kt-brand)] px-5 py-2.5 text-sm font-black text-[var(--kt-brand-on)] shadow-[inset_0_-3px_0_color-mix(in_srgb,var(--kt-brand)_76%,black)] transition hover:opacity-90"
            >
              Devam →
            </button>
          </div>
        )}

        {/* Current user turn — right-aligned reply bubbles */}
        {currentTurn?.speaker === 'user' && currentTurn.userOptions && (
          <div className="mt-2">
            <p className="mb-2 text-right text-xs font-black uppercase tracking-wider text-[var(--kt-ink-subtle)]">
              Cevabını seç:
            </p>
            <div className="flex flex-col items-end gap-2">
              {currentTurn.userOptions.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  className={replyBubbleCls(i, opt.correct, selectedOption)}
                  onClick={() => handleUserSelect(i, opt.correct, opt.japanese)}
                >
                  {opt.japanese}
                </button>
              ))}
            </div>
          </div>
        )}

        {isDone && (
          <div className="rounded-[0.9rem] bg-[var(--kt-accent-success-soft)] px-4 py-3 text-center">
            <span className="font-black text-[var(--kt-accent-success)]">
              ✓ Konuşma tamamlandı!
            </span>
          </div>
        )}
      </div>
      <div ref={bottomRef} />
    </section>
  );
};
