import React from 'react';

interface StatPillProps {
  icon: React.ReactNode;
  value: React.ReactNode;
  label?: React.ReactNode;
  tone?: 'brand' | 'warning' | 'success' | 'danger' | 'neutral' | 'info';
}

const toneClass = {
  brand: 'border-[color:var(--kt-brand)]/35 bg-[var(--kt-brand-soft)] text-[var(--kt-brand)]',
  warning: 'border-[color:var(--kt-accent-warning)]/35 bg-[var(--kt-accent-warning-soft)] text-[var(--kt-accent-warning)]',
  success: 'border-[color:var(--kt-accent-success)]/35 bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)]',
  danger: 'border-[color:var(--kt-accent-danger)]/35 bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)]',
  neutral: 'border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] text-[var(--kt-ink-muted)]',
  info: 'border-[color:var(--kt-accent-info)]/35 bg-[var(--kt-accent-info-soft)] text-[var(--kt-accent-info)]'
} as const;

export const StatPill: React.FC<StatPillProps> = ({
  icon,
  value,
  label,
  tone = 'neutral'
}) => (
  <div className={`flex items-center gap-3 rounded-full border px-4 py-2 shadow-[var(--kt-shadow-sm)] ${toneClass[tone]}`}>
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(255,255,255,0.78)]">
      {icon}
    </span>
    <div className="leading-tight">
      <div className="text-sm font-black">{value}</div>
      {label && <div className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-70">{label}</div>}
    </div>
  </div>
);
