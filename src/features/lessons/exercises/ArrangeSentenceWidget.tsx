import React, { useEffect, useMemo, useState } from 'react';
import type { ArrangeSentenceExercise } from '../lessonTypes';

interface Props {
  exercise: ArrangeSentenceExercise;
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

export const ArrangeSentenceWidget: React.FC<Props> = ({ exercise, locked, onSelectionChange }) => {
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
    const current = answer.map((t) => t.text).join(' ');
    onSelectionChange(answer.length > 0 ? current : null);
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
      <div>
        <p className="mb-1 text-sm font-semibold text-[var(--kt-ink-muted)]">{exercise.prompt}</p>
        {exercise.englishHint && (
          <p className="text-xs text-[var(--kt-ink-muted)] opacity-70">{exercise.englishHint}</p>
        )}
      </div>

      {/* Answer tray */}
      <div className="min-h-[60px] rounded-[1.2rem] border-2 border-dashed border-[var(--kt-border)] p-3">
        {answer.length === 0 ? (
          <span className="text-sm text-[var(--kt-ink-muted)]">Kelimeleri buraya taşı…</span>
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

      {/* Token bank */}
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
