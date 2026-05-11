import React, { useEffect, useState } from 'react';
import { Volume2, ChevronDown } from 'lucide-react';
import { createAudioPlayer } from '../../lessonAudio';
import type { ListeningBuildExercise } from '../../lessonTypes';

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
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => audio.play(), 400);
    const t2 = setTimeout(() => setTokensActive(true), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
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
    <section className="mx-auto max-w-2xl">
      <p className="mb-5 text-sm font-black uppercase tracking-wider text-[var(--kt-ink-muted)]">
        Duyduğun cümleyi kur
      </p>

      {/* Audio controls */}
      <div className="mb-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => audio.play()}
          className="flex h-16 w-16 items-center justify-center rounded-[1.1rem] bg-[var(--kt-accent-info)] text-white shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-accent-info)_70%,black)] transition hover:scale-105"
        >
          <Volume2 size={30} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => audio.playSlower()}
          className="flex h-10 w-10 items-center justify-center rounded-[0.75rem] bg-[var(--kt-accent-info)] text-white opacity-70 shadow-[inset_0_-3px_0_color-mix(in_srgb,var(--kt-accent-info)_70%,black)]"
        >
          <Volume2 size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Answer area */}
      <div
        className={`min-h-14 rounded-[1.1rem] border-2 p-3 transition ${
          checked === 'correct'
            ? 'border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)]'
            : checked === 'wrong'
            ? 'border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)]'
            : 'border-[var(--kt-border-standard)] bg-[var(--kt-surface)]'
        }`}
      >
        <div className="flex min-h-9 flex-wrap gap-2">
          {selected.map((token, i) => (
            <button
              key={`sel-${i}`}
              type="button"
              onClick={() => !checked && setSelected((prev) => prev.filter((_, idx) => idx !== i))}
              disabled={!!checked}
              className={`rounded-[0.7rem] border-2 px-4 py-2 font-jp text-base font-black shadow-[inset_0_-3px_0_var(--kt-border-subtle)] transition ${
                checked === 'correct'
                  ? 'border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)]'
                  : checked === 'wrong'
                  ? 'border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)]'
                  : 'border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] hover:-translate-y-0.5'
              }`}
            >
              {token}
            </button>
          ))}
          {selected.length === 0 && (
            <span className="text-sm font-bold text-[var(--kt-ink-subtle)]">
              {tokensActive ? 'Token seç...' : 'Dinleniyor...'}
            </span>
          )}
        </div>
      </div>

      {/* Token bank */}
      {tokensActive && (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {remainingBank.map((token, i) => (
            <button
              key={`bank-${token}-${i}`}
              type="button"
              onClick={() => !checked && setSelected((prev) => [...prev, token])}
              disabled={!!checked}
              className="rounded-[0.8rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-3 font-jp text-base font-black text-[var(--kt-ink-strong)] shadow-[inset_0_-3px_0_var(--kt-border-subtle)] transition hover:-translate-y-0.5 disabled:opacity-40"
            >
              {token}
            </button>
          ))}
        </div>
      )}

      {exercise.explanation && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowExplanation((v) => !v)}
            className="flex items-center gap-1 text-xs font-bold text-[var(--kt-ink-subtle)] underline"
          >
            Neden bu cevap?
            <ChevronDown size={14} className={`transition-transform ${showExplanation ? 'rotate-180' : ''}`} />
          </button>
          {showExplanation && (
            <div className="mt-2 rounded-[0.8rem] bg-[var(--kt-surface-muted)] px-4 py-3 text-sm font-bold text-[var(--kt-ink-muted)]">
              {exercise.explanation}
            </div>
          )}
        </div>
      )}

      {tokensActive && !checked && (
        <button
          type="button"
          onClick={handleCheck}
          disabled={selected.length === 0}
          className="mt-6 w-full rounded-[0.95rem] bg-[var(--kt-brand)] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] text-[var(--kt-brand-on)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-brand)_76%,black)] disabled:opacity-50"
        >
          Kontrol et
        </button>
      )}
    </section>
  );
};
