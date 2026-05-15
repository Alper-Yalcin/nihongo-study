import React from 'react';

type StatPillTone = 'default' | 'brand' | 'info' | 'success' | 'warning' | 'danger' | 'gold';

interface StatPillProps {
  label: React.ReactNode;
  value: React.ReactNode;
  icon?: React.ReactNode;
  tone?: StatPillTone;
  className?: string;
}

const toneClass: Record<StatPillTone, string> = {
  default: 'bg-transparent text-[var(--kt-ink-strong)]',
  brand: 'bg-[var(--kt-brand-soft)] text-[var(--kt-brand)]',
  info: 'bg-[var(--kt-accent-info-soft)] text-[var(--kt-accent-info)]',
  success: 'bg-[var(--kt-accent-success-soft)] text-[var(--kt-accent-success)]',
  warning: 'bg-[var(--kt-accent-warning-soft)] text-[var(--kt-accent-warning)]',
  danger: 'bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)]',
  gold: 'bg-[var(--kt-dan-gold-soft)] text-[var(--kt-dan-ink)]'
};

export const StatPill: React.FC<StatPillProps> = ({
  label,
  value,
  icon,
  tone = 'default',
  className = ''
}) => (
  <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${toneClass[tone]} ${className}`}>
    {icon ? <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/45">{icon}</span> : null}
    <div className="leading-tight">
      <div className="text-sm font-black tabular-nums">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-[0.13em] opacity-70">{label}</div>
    </div>
  </div>
);
