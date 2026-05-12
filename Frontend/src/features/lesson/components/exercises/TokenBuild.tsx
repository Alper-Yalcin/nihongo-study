import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { createAudioPlayer } from '../../lessonAudio';
import type { TokenBuildExercise } from '../../lessonTypes';
import { TokenTray } from '../ui/TokenTray';

interface Props {
  exercise: TokenBuildExercise;
  onCorrect: () => void;
  onWrong: () => void;
}

export const TokenBuild: React.FC<Props> = ({ exercise, onCorrect, onWrong }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState<'correct' | 'wrong' | null>(null);
  const audio = exercise.audioText ? createAudioPlayer(exercise.audioText) : null;

  const remainingBank = exercise.bankTokens.filter((token, index) => {
    const usedCount = selected.filter((t) => t === token).length;
    const bankCountUpToHere = exercise.bankTokens
      .slice(0, index + 1)
      .filter((t) => t === token).length;
    return usedCount < bankCountUpToHere;
  });

  const handleBankTap = (token: string) => {
    if (checked) return;
    setSelected((prev) => [...prev, token]);
  };

  const handleSelectedTap = (index: number) => {
    if (checked) return;
    setSelected((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheck = () => {
    const isCorrect = selected.join('') === exercise.answerTokens.join('');
    setChecked(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) onCorrect();
    else onWrong();
  };

  return (
    <section className="mx-auto max-w-lg">
      {/* Prompt row */}
      <div className="mb-5 flex items-center gap-3">
        <p className="text-xl font-black text-[var(--kt-ink-strong)]">{exercise.prompt}</p>
        {audio && (
          <button
            type="button"
            onClick={() => audio.play()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--kt-accent-info)] text-white shadow-[0_3px_10px_color-mix(in_srgb,var(--kt-accent-info)_35%,transparent)] transition hover:scale-105"
          >
            <Volume2 size={18} strokeWidth={2} />
          </button>
        )}
      </div>

      <TokenTray
        selectedTokens={selected}
        bankTokens={remainingBank}
        checked={checked}
        onBankTap={handleBankTap}
        onSelectedTap={handleSelectedTap}
        explanation={exercise.explanation}
      />

      {!checked && (
        <button
          type="button"
          onClick={handleCheck}
          disabled={selected.length === 0}
          className="mt-6 w-full rounded-[0.95rem] bg-[var(--kt-brand)] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-brand-on)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-brand)_76%,black)] transition hover:opacity-90 disabled:opacity-40"
        >
          Kontrol et
        </button>
      )}
    </section>
  );
};
