import React from 'react';
import { Check, Lock, Star } from 'lucide-react';

type PathNodeState = 'active' | 'completed' | 'locked' | 'available' | 'checkpoint';

interface PathNodeProps {
  title: string;
  subtitle?: string;
  state: PathNodeState;
  accent: string;
  glyph?: React.ReactNode;
  offset?: number;
  onClick?: () => void;
  activeLabel?: string;
}

export const PathNode: React.FC<PathNodeProps> = ({
  title,
  subtitle,
  state,
  accent,
  glyph,
  offset = 0,
  onClick,
  activeLabel
}) => {
  const isClickable = Boolean(onClick);
  const baseStateClass =
    state === 'completed'
      ? 'bg-[var(--kt-accent-success)] text-white border-[rgba(255,255,255,0.2)]'
      : state === 'locked'
        ? 'bg-[var(--kt-surface-sunken)] text-[var(--kt-ink-subtle)] border-[var(--kt-border-subtle)]'
        : state === 'checkpoint'
          ? 'bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] border-white/20 shadow-[var(--kt-shadow)]'
          : state === 'active'
            ? 'bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] border-white/20 shadow-[var(--kt-shadow-lg)]'
            : 'bg-[var(--kt-surface)] text-[var(--kt-ink)] border-[var(--kt-border)] shadow-[var(--kt-shadow-sm)]';

  const circleSize = state === 'checkpoint' ? 'h-28 w-28' : 'h-24 w-24';

  return (
    <div
      className="relative flex w-full max-w-[16rem] flex-col items-center"
      style={{ transform: `translateX(${offset}px)` }}
    >
      {activeLabel && (
        <div className="mb-3 rounded-[1rem] border border-[var(--kt-border)] bg-[rgba(9,14,20,0.75)] px-4 py-2 text-sm font-black uppercase tracking-[0.1em] text-white">
          {activeLabel}
        </div>
      )}
      <button
        type="button"
        onClick={onClick}
        disabled={!isClickable}
        className={`relative flex ${circleSize} items-center justify-center rounded-full border-4 transition ${baseStateClass} ${isClickable ? 'hover:-translate-y-1' : 'cursor-default'} `}
        style={{
          boxShadow: state === 'active' || state === 'checkpoint' ? `0 12px 40px ${accent}` : undefined
        }}
      >
        <span
          className="absolute inset-[10px] rounded-full opacity-90"
          style={{ background: state === 'locked' ? 'rgba(255,255,255,0.03)' : accent }}
        />
        <span className="relative z-10 flex items-center justify-center text-white">
          {state === 'completed' ? (
            <Check size={34} />
          ) : state === 'locked' ? (
            <Lock size={28} />
          ) : state === 'checkpoint' ? (
            <Star size={34} />
          ) : (
            <span className="font-jp text-2xl font-black">{glyph ?? title}</span>
          )}
        </span>
      </button>
      <div className="mt-4 text-center">
        <div className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">{subtitle}</div>
        <div className="mt-1 text-base font-bold text-[var(--kt-ink-strong)]">{title}</div>
      </div>
    </div>
  );
};
