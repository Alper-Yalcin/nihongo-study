import React from 'react';

type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const toneClass: Record<BadgeTone, string> = {
  neutral:
    'bg-[var(--kt-surface-muted)] text-[var(--kt-ink-muted)] border border-[var(--kt-border-subtle)]',
  brand:
    'bg-[var(--kt-brand-soft)] text-[var(--kt-brand)] border border-[color:var(--kt-brand)]/25',
  success:
    'bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)] border border-[color:var(--kt-accent-success)]/25',
  warning:
    'bg-[var(--kt-accent-warning-soft)] text-[var(--kt-accent-warning)] border border-[color:var(--kt-accent-warning)]/25',
  danger:
    'bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)] border border-[color:var(--kt-accent-danger)]/25'
};

export const Badge: React.FC<BadgeProps> = ({ children, tone = 'neutral', className = '' }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${toneClass[tone]} ${className}`}
  >
    {children}
  </span>
);
