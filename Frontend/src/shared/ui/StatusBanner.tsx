import React from 'react';

type BannerTone = 'info' | 'success' | 'warning' | 'danger';

interface StatusBannerProps {
  tone?: BannerTone;
  title?: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const toneClass: Record<BannerTone, { bg: string; border: string; text: string; icon: string }> = {
  info: {
    bg: 'bg-[var(--kt-surface-muted)]',
    border: 'border-[var(--kt-border-subtle)]',
    text: 'text-[var(--kt-ink)]',
    icon: 'text-[var(--kt-ink-muted)]'
  },
  success: {
    bg: 'bg-[var(--kt-accent-success-soft)]',
    border: 'border-[color:var(--kt-accent-success)]/30',
    text: 'text-[var(--kt-ink)]',
    icon: 'text-[var(--kt-accent-success)]'
  },
  warning: {
    bg: 'bg-[var(--kt-accent-warning-soft)]',
    border: 'border-[color:var(--kt-accent-warning)]/30',
    text: 'text-[var(--kt-ink)]',
    icon: 'text-[var(--kt-accent-warning)]'
  },
  danger: {
    bg: 'bg-[var(--kt-accent-danger-soft)]',
    border: 'border-[color:var(--kt-accent-danger)]/30',
    text: 'text-[var(--kt-ink)]',
    icon: 'text-[var(--kt-accent-danger)]'
  }
};

export const StatusBanner: React.FC<StatusBannerProps> = ({
  tone = 'info',
  title,
  children,
  icon,
  actions,
  className = ''
}) => {
  const t = toneClass[tone];
  return (
    <div
      role="status"
      className={`flex flex-col gap-3 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${t.bg} ${t.border} ${t.text} ${className}`}
    >
      <div className="flex items-start gap-3">
        {icon && <span className={`mt-0.5 shrink-0 ${t.icon}`}>{icon}</span>}
        <div className="space-y-1 text-sm leading-6">
          {title && <div className="font-semibold">{title}</div>}
          <div className="text-[var(--kt-ink-muted)]">{children}</div>
        </div>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
};
