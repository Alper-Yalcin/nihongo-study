import React from 'react';

interface Props {
  current: number;  // 0-based index of current exercise
  total: number;
  onExit?: () => void;
}

export const LessonProgressBar: React.FC<Props> = ({ current, total, onExit }) => {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {onExit && (
        <button
          type="button"
          onClick={onExit}
          className="shrink-0 rounded-full p-1.5 text-[var(--kt-ink-muted)] transition hover:bg-[var(--kt-nav-item-hover)] hover:text-[var(--kt-ink)]"
          aria-label="Çık"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-[var(--kt-border-subtle)]">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[var(--kt-accent-info)] transition-all duration-500"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <span className="w-10 shrink-0 text-right text-xs font-semibold text-[var(--kt-ink-muted)]">
        {pct}%
      </span>
    </div>
  );
};
