import React from 'react';

type StatTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

interface StatCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  trend?: React.ReactNode;
  helper?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: StatTone;
  className?: string;
}

const accentClass: Record<StatTone, string> = {
  neutral: 'text-[var(--kt-ink-muted)]',
  brand: 'text-[var(--kt-brand)]',
  success: 'text-[var(--kt-accent-success)]',
  warning: 'text-[var(--kt-accent-warning)]',
  danger: 'text-[var(--kt-accent-danger)]',
  info: 'text-[var(--kt-accent-info)]'
};

const iconBackground: Record<StatTone, string> = {
  neutral: 'bg-[var(--kt-surface-muted)]',
  brand: 'bg-[var(--kt-brand-soft)]',
  success: 'bg-[var(--kt-accent-success-soft)]',
  warning: 'bg-[var(--kt-accent-warning-soft)]',
  danger: 'bg-[var(--kt-accent-danger-soft)]',
  info: 'bg-[var(--kt-accent-info-soft)]'
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  helper,
  icon,
  tone = 'neutral',
  className = ''
}) => (
  <div
    className={`flex flex-col gap-3 rounded-[var(--kt-radius-md)] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-5 shadow-[var(--kt-shadow-sm)] ${className}`}
  >
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--kt-ink-subtle)]">
        {label}
      </span>
      {icon && (
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBackground[tone]} ${accentClass[tone]}`}>
          {icon}
        </span>
      )}
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold text-[var(--kt-ink-strong)] sm:text-3xl">{value}</span>
      {trend && <span className={`text-xs font-semibold ${accentClass[tone]}`}>{trend}</span>}
    </div>
    {helper && <p className="text-xs leading-5 text-[var(--kt-ink-muted)]">{helper}</p>}
  </div>
);
