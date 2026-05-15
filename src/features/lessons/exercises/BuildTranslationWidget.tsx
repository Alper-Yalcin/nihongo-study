import React, { useEffect, useMemo, useState } from 'react';
import type { BuildTranslationExercise } from '../lessonTypes';

interface Props {
  exercise: BuildTranslationExercise;
  locked: boolean;
  onSelectionChange: (answer: string | null) => void;
}

interface Token { id: string; text: string }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const BuildTranslationWidget: React.FC<Props> = ({ exercise, locked, onSelectionChange }) => {
  const sourceTokens = useMemo<Token[]>(
    () => shuffle(exercise.tiles.map((t, i) => ({ id: `${i}-${t}`, text: t }))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exercise.id]
  );

  const [bank, setBank] = useState<Token[]>(sourceTokens);
  const [answer, setAnswer] = useState<Token[]>([]);

  useEffect(() => {
    setBank(sourceTokens);
    setAnswer([]);
    onSelectionChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  useEffect(() => {
    onSelectionChange(answer.length > 0 ? answer.map((t) => t.text).join(' ') : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer]);

  const addToken = (token: Token) => {
    if (locked) return;
    setBank((b) => b.filter((t) => t.id !== token.id));
    setAnswer((a) => [...a, token]);
  };

  const removeToken = (token: Token) => {
    if (locked) return;
    setAnswer((a) => a.filter((t) => t.id !== token.id));
    setBank((b) => [...b, token]);
  };

  return (
    <div className="flex flex-col gap-5 px-4 py-6">
      <div className="w-full max-w-sm rounded-[1.4rem] border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--kt-ink-muted)]">
          Japonca çevir
        </p>
        <p className="mt-1 text-lg font-bold text-[var(--kt-ink-strong)]">{exercise.englishPrompt}</p>
      </div>

      {/* Answer tray */}
      <div className="min-h-[56px] rounded-[1.2rem] border-2 border-dashed border-[var(--kt-border)] p-3">
        {answer.length === 0 ? (
          <span className="text-sm text-[var(--kt-ink-muted)]">Tile'ları buraya ekle…</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {answer.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => removeToken(t)}
                disabled={locked}
                className="rounded-[0.8rem] border border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)] bg-opacity-15 px-3 py-1.5 font-jp text-base text-[var(--kt-ink-strong)] transition hover:bg-opacity-25 disabled:cursor-default"
              >
                {t.text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bank */}
      <div className="flex flex-wrap gap-2">
        {bank.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => addToken(t)}
            disabled={locked}
            className="rounded-[0.8rem] border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] px-3 py-1.5 font-jp text-base text-[var(--kt-ink)] transition hover:border-[var(--kt-accent-info)] hover:bg-[var(--kt-nav-item-hover)] disabled:cursor-default disabled:opacity-50"
          >
            {t.text}
          </button>
        ))}
      </div>
    </div>
  );
};
