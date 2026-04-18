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
      ? 'bg-[var(--kt-accent-success)] text-white border-[var(--kt-accent-success)]'
      : state === 'locked'
        ? 'bg-[var(--kt-surface-sunken)] text-[var(--kt-ink-subtle)] border-[var(--kt-border-subtle)]'
        : state === 'checkpoint'
          ? 'bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] border-[var(--kt-border)] shadow-[var(--kt-shadow)]'
          : state === 'active'
            ? 'bg-[var(--kt-surface)] text-[var(--kt-ink-strong)] border-[var(--kt-brand)] shadow-[var(--kt-shadow-lg)]'
            : 'bg-[var(--kt-surface)] text-[var(--kt-ink)] border-[var(--kt-border)] shadow-[var(--kt-shadow-sm)]';

  const circleSize = state === 'checkpoint' ? 'h-16 w-16' : 'h-14 w-14';

  return (
    <div
      className="relative flex w-full max-w-[12rem] flex-col items-center"
      style={{ transform: `translateX(${offset}px)` }}
    >
      {activeLabel && (
        <div className="mb-2 rounded-[0.8rem] border border-[var(--kt-border)] bg-[var(--kt-ink-strong)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-[var(--kt-ink-inverse)]">
          {activeLabel}
        </div>
      )}
      <button
        type="button"
        onClick={onClick}
        disabled={!isClickable}
        className={`relative flex ${circleSize} items-center justify-center rounded-full border-[3px] transition ${baseStateClass} ${isClickable ? 'hover:-translate-y-0.5' : 'cursor-default'}`}
        style={{
          boxShadow: state === 'active' || state === 'checkpoint' ? `0 8px 24px ${accent}` : undefined
        }}
      >
        <span
          className="absolute inset-[7px] rounded-full opacity-90"
          style={{ background: state === 'locked' ? 'transparent' : accent }}
        />
        <span className="relative z-10 flex items-center justify-center text-white">
          {state === 'completed' ? (
            <Check size={20} />
          ) : state === 'locked' ? (
            <Lock size={16} />
          ) : state === 'checkpoint' ? (
            <Star size={20} />
          ) : (
            <span className="font-jp text-base font-black">{glyph ?? title}</span>
          )}
        </span>
      </button>
      <div className="mt-2 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--kt-ink-subtle)]">{subtitle}</div>
        <div className="mt-0.5 text-sm font-bold text-[var(--kt-ink-strong)]">{title}</div>
      </div>
    </div>
  );
};
