import React from 'react';

interface EmptyStateProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  variant?: 'empty' | 'error';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actions,
  variant = 'empty',
  className = ''
}) => {
  const iconClass =
    variant === 'error'
      ? 'bg-[var(--kt-accent-danger-soft)] text-[var(--kt-accent-danger)]'
      : 'bg-[var(--kt-surface-muted)] text-[var(--kt-ink-muted)]';
  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-[var(--kt-radius-md)] border border-dashed border-[var(--kt-border)] bg-[var(--kt-surface)] p-10 text-center ${className}`}
    >
      {icon && (
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconClass}`}>
          {icon}
        </div>
      )}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[var(--kt-ink-strong)]">{title}</h3>
        {description && (
          <p className="mx-auto max-w-md text-sm leading-6 text-[var(--kt-ink-muted)]">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center justify-center gap-2">{actions}</div>}
    </div>
  );
};
