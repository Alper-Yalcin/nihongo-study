import React, { useEffect, useState } from 'react';
import { createAudioPlayer } from '../../lessonAudio';
import type { ListeningBuildExercise } from '../../lessonTypes';
import { AudioOrb } from '../ui/AudioOrb';
import { TokenTray } from '../ui/TokenTray';

interface Props {
  exercise: ListeningBuildExercise;
  onCorrect: () => void;
  onWrong: () => void;
}

export const ListeningBuild: React.FC<Props> = ({ exercise, onCorrect, onWrong }) => {
  const audio = createAudioPlayer(exercise.audioText);
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState<'correct' | 'wrong' | null>(null);
  const [tokensActive, setTokensActive] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => audio.play(), 400);
    const t2 = setTimeout(() => setTokensActive(true), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [exercise.id]);

  const remainingBank = exercise.bankTokens.filter((token, index) => {
    const usedCount = selected.filter((t) => t === token).length;
    const bankCountUpToHere = exercise.bankTokens
      .slice(0, index + 1)
      .filter((t) => t === token).length;
    return usedCount < bankCountUpToHere;
  });

  const handleCheck = () => {
    const isCorrect = selected.join('') === exercise.answerTokens.join('');
    setChecked(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) onCorrect();
    else onWrong();
  };

  return (
    <section className="mx-auto max-w-lg">
      <p className="mb-6 text-xs font-black uppercase tracking-widest text-[var(--kt-ink-subtle)]">
        Duyduğun cümleyi kur
      </p>

      {/* AudioOrb is the hero */}
      <div className="mb-7 flex justify-center">
        <AudioOrb onPlay={() => audio.play()} onPlaySlow={() => audio.playSlower()} />
      </div>

      <TokenTray
        selectedTokens={selected}
        bankTokens={tokensActive ? remainingBank : []}
        checked={checked}
        onBankTap={(token) => { if (!checked) setSelected((prev) => [...prev, token]); }}
        onSelectedTap={(i) => { if (!checked) setSelected((prev) => prev.filter((_, idx) => idx !== i)); }}
        explanation={exercise.explanation}
        placeholder={tokensActive ? 'Parçaları yerleştir...' : 'Dinleniyor...'}
      />

      {tokensActive && !checked && (
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
