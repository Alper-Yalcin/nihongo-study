import React from 'react';
import { Link } from 'react-router-dom';
import { ProgressRing } from '../shared/ProgressRing';

interface CharacterCellProps {
  id: string;
  char: string;
  romaji: string;
  href: string;
  masteryValue: number;
  tracked: boolean;
  mastered: boolean;
}

export const CharacterCell: React.FC<CharacterCellProps> = ({
  id,
  char,
  romaji,
  href,
  masteryValue,
  tracked,
  mastered
}) => (
  <Link
    to={href}
    aria-label={`${id} ${romaji}`}
    className={`group relative overflow-hidden rounded-[1.35rem] border p-4 shadow-[var(--kt-shadow-sm)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[var(--kt-shadow)] ${
      mastered
        ? 'border-[color:var(--kt-accent-success)]/55 bg-[var(--kt-accent-success-soft)]/35'
        : tracked
          ? 'border-[var(--kt-border)] bg-[var(--kt-surface)]'
          : 'border-[var(--kt-border-subtle)] bg-[rgba(255,255,255,0.04)] opacity-80'
    }`}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="font-jp text-4xl font-bold text-[var(--kt-ink-strong)]">{char}</div>
        <div className="mt-2 text-sm font-medium uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
          {romaji}
        </div>
      </div>
      <ProgressRing
        value={masteryValue}
        size={42}
        strokeWidth={4}
        tone={mastered ? 'success' : 'brand'}
        label={<span className="text-[10px] font-bold text-[var(--kt-ink-strong)]">{masteryValue}</span>}
      />
    </div>
    <div className="mt-4 h-2 rounded-full bg-[rgba(255,255,255,0.06)]">
      <div
        className={`h-2 rounded-full ${mastered ? 'bg-[var(--kt-accent-success)]' : 'bg-[var(--kt-brand)]'}`}
        style={{ width: `${Math.max(tracked ? 10 : 4, masteryValue)}%` }}
      />
    </div>
  </Link>
);
