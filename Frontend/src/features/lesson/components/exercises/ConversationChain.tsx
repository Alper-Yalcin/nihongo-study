import React, { useEffect, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';
import { createAudioPlayer } from '../../lessonAudio';
import type { ConversationChainExercise, ConversationMemory } from '../../lessonTypes';

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

  // Auto-play NPC audio when NPC turn advances
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

    // Memory capture
    if (currentTurn?.memoryKey && onMemoryUpdate) {
      // Extract the name from "アリです" → "アリ"
      const cleaned = japanese.replace(/です$/, '').trim();
      onMemoryUpdate(currentTurn.memoryKey, cleaned);
    }

    setTimeout(() => {
      setSelectedOption(null);
      setTurnIdx((prev) => prev + 1);
    }, 700);
  };

  return (
    <section className="mx-auto max-w-2xl">
      <div className="space-y-3">
        {/* Render past turns as static bubbles */}
        {exercise.turns.slice(0, turnIdx).map((turn, i) => {
          if (turn.speaker === 'npc') {
            const resolved = resolveTemplate(turn.npcJapanese ?? '', memory);
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--kt-accent-info)] text-sm font-black text-white">
                  NPC
                </div>
                <div className="rounded-[1rem] rounded-tl-sm border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-3">
                  <div className="font-jp text-lg font-black text-[var(--kt-ink-strong)]">{resolved}</div>
                  {turn.npcMeaning && (
                    <div className="mt-0.5 text-xs font-bold text-[var(--kt-ink-muted)]">{resolveTemplate(turn.npcMeaning, memory)}</div>
                  )}
                </div>
              </div>
            );
          } else {
            return (
              <div key={i} className="flex items-start justify-end gap-3">
                <div className="rounded-[1rem] rounded-tr-sm border-2 border-[var(--kt-brand)] bg-[var(--kt-brand-soft,var(--kt-accent-success-soft))] px-4 py-3">
                  <div className="font-jp text-lg font-black text-[var(--kt-ink-strong)]">
                    {turn.userOptions?.find((o) => o.correct)?.japanese ?? '...'}
                  </div>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--kt-brand)] text-sm font-black text-[var(--kt-brand-on)]">
                  Sen
                </div>
              </div>
            );
          }
        })}

        {/* Current NPC turn */}
        {currentTurn?.speaker === 'npc' && (
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--kt-accent-info)] text-sm font-black text-white">
              NPC
            </div>
            <div className="rounded-[1rem] rounded-tl-sm border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-3 shadow-[var(--kt-shadow-sm)]">
              <div className="font-jp text-lg font-black text-[var(--kt-ink-strong)]">
                {resolveTemplate(currentTurn.npcJapanese ?? '', memory)}
              </div>
              {currentTurn.npcMeaning && (
                <div className="mt-0.5 text-xs font-bold text-[var(--kt-ink-muted)]">
                  {resolveTemplate(currentTurn.npcMeaning, memory)}
                </div>
              )}
              <div className="mt-2 flex gap-2">
                {currentTurn.audioText && (
                  <button
                    type="button"
                    onClick={() => createAudioPlayer(currentTurn.audioText!).play()}
                    className="flex h-7 w-7 items-center justify-center rounded-[0.5rem] bg-[var(--kt-accent-info)] text-white"
                  >
                    <Volume2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Current user turn */}
        {currentTurn?.speaker === 'user' && currentTurn.userOptions && (
          <div className="mt-2 flex flex-col gap-2 pl-0 pr-0">
            <p className="text-xs font-black uppercase tracking-wider text-[var(--kt-ink-muted)]">
              Cevabını seç:
            </p>
            {currentTurn.userOptions.map((opt, i) => {
              let cls =
                'rounded-[0.85rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-3 text-right font-jp text-base font-black text-[var(--kt-ink-strong)] shadow-[inset_0_-3px_0_var(--kt-border-subtle)] transition';

              if (selectedOption !== null) {
                if (opt.correct) {
                  cls =
                    'rounded-[0.85rem] border-2 border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] px-4 py-3 text-right font-jp text-base font-black text-[var(--kt-accent-success)] shadow-none';
                } else if (i === selectedOption) {
                  cls =
                    'rounded-[0.85rem] border-2 border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)] px-4 py-3 text-right font-jp text-base font-black text-[var(--kt-accent-danger)] shadow-none';
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
                  onClick={() => handleUserSelect(i, opt.correct, opt.japanese)}
                >
                  {opt.japanese}
                </button>
              );
            })}
          </div>
        )}

        {/* NPC turn — continue button */}
        {currentTurn?.speaker === 'npc' && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAdvance}
              className="rounded-[0.85rem] bg-[var(--kt-brand)] px-5 py-2.5 text-sm font-black text-[var(--kt-brand-on)] shadow-[inset_0_-3px_0_color-mix(in_srgb,var(--kt-brand)_76%,black)]"
            >
              Devam →
            </button>
          </div>
        )}

        {isDone && (
          <div className="rounded-[1rem] border-2 border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] p-4 text-center">
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
