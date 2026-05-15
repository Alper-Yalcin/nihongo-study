import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ListenAndTapExercise } from '../lessonTypes';
import { getJaVoice, speakJapanese } from './listeningUtils';

interface Props {
  exercise: ListenAndTapExercise;
  locked: boolean;
  onSelectionChange: (answer: string | null) => void;
}

export const ListenAndTapWidget: React.FC<Props> = ({ exercise, locked, onSelectionChange }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [voiceReady, setVoiceReady] = useState(false);
  const hasAutoPlayed = useRef(false);

  const speak = useCallback(() => {
    setPlaying(true);
    speakJapanese(exercise.spokenText, () => setPlaying(false));
  }, [exercise.spokenText]);

  useEffect(() => {
    setSelected(null);
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
      if (window.speechSynthesis.getVoices().length > 0) {
        resolve();
      } else {
        window.speechSynthesis.onvoiceschanged = resolve;
      }
    }

    return () => {
      if (typeof window !== 'undefined') window.speechSynthesis.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id]);

  const handleSelect = (opt: string) => {
    if (locked) return;
    setSelected(opt);
    onSelectionChange(opt);
  };

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6">
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--kt-ink-muted)]">
          {exercise.displayPrompt}
        </p>
        <button
          type="button"
          onClick={speak}
          disabled={!voiceReady || playing}
          className={`flex h-20 w-20 items-center justify-center rounded-full border-2 transition-all ${
            playing
              ? 'border-[var(--kt-brand)] bg-[var(--kt-brand)] bg-opacity-20 text-[var(--kt-brand)]'
              : 'border-[var(--kt-border)] bg-[var(--kt-surface-raised)] text-[var(--kt-ink-muted)] hover:border-[var(--kt-brand)] hover:text-[var(--kt-brand)]'
          } disabled:opacity-40`}
          aria-label="Tekrar dinle"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        </button>
      </div>

      <div className="grid w-full max-w-sm grid-cols-2 gap-3">
        {exercise.options.map((opt) => (
          <button
            key={opt}
            type="button"
            disabled={locked}
            onClick={() => handleSelect(opt)}
            className={`rounded-[1.2rem] border-2 px-4 py-4 text-sm font-semibold transition-all ${
              selected === opt
                ? 'border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)] bg-opacity-15 text-[var(--kt-ink-strong)]'
                : 'border-[var(--kt-border)] bg-[var(--kt-surface-raised)] text-[var(--kt-ink)] hover:border-[var(--kt-accent-info)] hover:bg-[var(--kt-nav-item-hover)]'
            } disabled:cursor-default`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
