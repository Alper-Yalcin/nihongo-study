import React from 'react';

interface ProgressRailProps {
  label?: React.ReactNode;
  value: number;
  max: number;
  description?: React.ReactNode;
  className?: string;
}

export const ProgressRail: React.FC<ProgressRailProps> = ({
  label,
  value,
  max,
  description,
  className = ''
}) => {
  const percent = max > 0 ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0;

  return (
    <div className={className}>
      {(label || description) && (
        <div className="mb-2 flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
          <span>{label}</span>
          <span>{description ?? `${value}/${max}`}</span>
        </div>
      )}
      <div className="h-3 overflow-hidden rounded-full bg-[var(--kt-progress-track)]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--kt-brand),var(--kt-dan-gold))] transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
