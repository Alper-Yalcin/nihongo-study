import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BuildListeningExercise } from '../lessonTypes';
import { getJaVoice, speakJapanese } from './listeningUtils';

interface Props {
  exercise: BuildListeningExercise;
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

export const BuildListeningWidget: React.FC<Props> = ({ exercise, locked, onSelectionChange }) => {
  const sourceTokens = useMemo<Token[]>(
    () => shuffle(exercise.tiles.map((t, i) => ({ id: `${i}-${t}`, text: t }))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exercise.id]
  );

  const [bank, setBank] = useState<Token[]>(sourceTokens);
  const [answer, setAnswer] = useState<Token[]>([]);
  const [playing, setPlaying] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);
  const hasAutoPlayed = useRef(false);

  const speak = useCallback(() => {
    setPlaying(true);
    speakJapanese(exercise.spokenText, () => setPlaying(false));
  }, [exercise.spokenText]);

  useEffect(() => {
    setBank(sourceTokens);
    setAnswer([]);
    onSelectionChange(null);
    hasAutoPlayed.current = false;

    const resolve = () => {
      setVoiceReady(getJaVoice() !== null);
      if (!hasAutoPlayed.current) {
        hasAutoPlayed.current = true;
        speak();
      }
    };

    if (typeof window !== 'undefined') {
      if (window.speechSynthesis.getVoices().length > 0) resolve();
      else window.speechSynthesis.onvoiceschanged = resolve;
    }

    return () => {
      if (typeof window !== 'undefined') window.speechSynthesis.cancel();
    };
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
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--kt-ink-muted)]">
          Duyduğunu oluştur
        </p>
        <button
          type="button"
          onClick={speak}
          disabled={!voiceReady || playing}
          className={`flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all ${
            playing
              ? 'border-[var(--kt-brand)] bg-[var(--kt-brand)] bg-opacity-20 text-[var(--kt-brand)]'
              : 'border-[var(--kt-border)] bg-[var(--kt-surface-raised)] text-[var(--kt-ink-muted)] hover:border-[var(--kt-brand)] hover:text-[var(--kt-brand)]'
          } disabled:opacity-40`}
          aria-label="Tekrar dinle"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        </button>
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
