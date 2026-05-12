import React, { useEffect, useRef, useState } from 'react';
import type { FastRecallExercise } from '../../lessonTypes';

interface Props {
  exercise: FastRecallExercise;
  onCorrect: () => void;
  onWrong: () => void;
}

function chipCls(
  i: number,
  correct: boolean,
  selected: number | null,
  expired: boolean,
): string {
  const base =
    'rounded-[0.85rem] px-4 py-3 font-jp text-xl font-black text-center transition-all duration-150';

  if (selected !== null || expired) {
    if (correct)
      return `${base} border-2 border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)] pointer-events-none`;
    if (i === selected)
      return `${base} border-2 border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)] pointer-events-none`;
    return `${base} border border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-muted)] opacity-30 pointer-events-none`;
  }
  return `${base} border border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] shadow-[0_2px_0_var(--kt-border)] hover:-translate-y-0.5 hover:border-[var(--kt-brand)] cursor-pointer`;
}

export const FastRecall: React.FC<Props> = ({ exercise, onCorrect, onWrong }) => {
  const [timeLeft, setTimeLeft] = useState(exercise.timerMs);
  const [selected, setSelected] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (selected !== null || expired) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          clearInterval(intervalRef.current!);
          setExpired(true);
          onWrong();
          return 0;
        }
        return prev - 100;
      });
    }, 100);
    return () => clearInterval(intervalRef.current!);
  }, [exercise.id]);

  const handleSelect = (index: number, correct: boolean) => {
    if (selected !== null || expired) return;
    clearInterval(intervalRef.current!);
    setSelected(index);
    if (correct) onCorrect();
    else onWrong();
  };

  const pct = Math.max(0, (timeLeft / exercise.timerMs) * 100);
  const timerColor =
    pct > 60
      ? 'var(--kt-accent-success)'
      : pct > 30
        ? 'var(--kt-accent-warning, #f59e0b)'
        : 'var(--kt-accent-danger)';

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - pct / 100);

  return (
    <section className="mx-auto max-w-lg">
      {/* Timer + prompt — energetic top row */}
      <div className="mb-7 flex items-center gap-5">
        {/* Larger timer ring */}
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" width="64" height="64">
            <circle cx="32" cy="32" r={radius} fill="none" stroke="var(--kt-surface-muted)" strokeWidth="5" />
            <circle
              cx="32"
              cy="32"
              r={radius}
              fill="none"
              stroke={timerColor}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s' }}
            />
          </svg>
          <span className="relative text-sm font-black" style={{ color: timerColor }}>
            {Math.ceil(timeLeft / 1000)}
          </span>
        </div>
        <div className="text-2xl font-black text-[var(--kt-ink-strong)]">
          {exercise.prompt}
        </div>
      </div>

      {expired && !selected && (
        <div className="mb-5 rounded-[0.9rem] bg-[var(--kt-accent-danger-soft)] px-4 py-3 text-sm font-black text-[var(--kt-accent-danger)]">
          Süre doldu! Doğru cevap:{' '}
          <span className="font-jp">{exercise.answerJapanese}</span>
        </div>
      )}

      {/* Fast-tap chips — compact 2×2 */}
      <div className="grid grid-cols-2 gap-2.5">
        {exercise.options.map((option, i) => (
          <button
            key={i}
            type="button"
            className={chipCls(i, option.correct, selected, expired)}
            onClick={() => handleSelect(i, option.correct)}
          >
            {option.japanese}
          </button>
        ))}
      </div>
    </section>
  );
};
