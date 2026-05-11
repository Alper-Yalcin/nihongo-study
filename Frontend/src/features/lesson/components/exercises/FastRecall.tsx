import React, { useEffect, useRef, useState } from 'react';
import type { FastRecallExercise } from '../../lessonTypes';

interface Props {
  exercise: FastRecallExercise;
  onCorrect: () => void;
  onWrong: () => void;
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

  // Color transition: green → yellow → red
  const timerColor =
    pct > 60
      ? 'var(--kt-accent-success)'
      : pct > 30
      ? 'var(--kt-accent-warning, #f59e0b)'
      : 'var(--kt-accent-danger)';

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - pct / 100);

  return (
    <section className="mx-auto max-w-2xl">
      {/* Timer + prompt */}
      <div className="mb-6 flex items-center gap-5">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
          <svg className="absolute inset-0 -rotate-90" width="56" height="56">
            <circle cx="28" cy="28" r={radius} fill="none" stroke="var(--kt-border)" strokeWidth="4" />
            <circle
              cx="28"
              cy="28"
              r={radius}
              fill="none"
              stroke={timerColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s' }}
            />
          </svg>
          <span className="relative text-xs font-black" style={{ color: timerColor }}>
            {Math.ceil(timeLeft / 1000)}
          </span>
        </div>
        <div className="text-2xl font-black text-[var(--kt-ink-strong)]">
          {exercise.prompt}
        </div>
      </div>

      {expired && !selected && (
        <div className="mb-4 rounded-[0.9rem] bg-[var(--kt-accent-danger-soft)] px-4 py-3 text-sm font-black text-[var(--kt-accent-danger)]">
          Süre doldu! Doğru cevap: <span className="font-jp">{exercise.answerJapanese}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {exercise.options.map((option, i) => {
          let cls =
            'rounded-[0.9rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-5 py-4 font-jp text-xl font-black text-[var(--kt-ink-strong)] shadow-[inset_0_-4px_0_var(--kt-border-subtle)] transition';

          if (selected !== null || expired) {
            if (option.correct) {
              cls =
                'rounded-[0.9rem] border-2 border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)] px-5 py-4 font-jp text-xl font-black text-[var(--kt-accent-success)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-accent-success)_30%,transparent)]';
            } else if (i === selected) {
              cls =
                'rounded-[0.9rem] border-2 border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)] px-5 py-4 font-jp text-xl font-black text-[var(--kt-accent-danger)] shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-accent-danger)_30%,transparent)]';
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
              onClick={() => handleSelect(i, option.correct)}
            >
              {option.japanese}
            </button>
          );
        })}
      </div>
    </section>
  );
};
