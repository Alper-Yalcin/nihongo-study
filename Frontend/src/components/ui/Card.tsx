import React from 'react';

type CardTone = 'default' | 'muted' | 'brand';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  tone?: CardTone;
  padding?: CardPadding;
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
  as?: 'div' | 'section' | 'article';
}

const toneClass: Record<CardTone, string> = {
  default:
    'bg-[var(--kt-surface)] border border-[var(--kt-border-subtle)]',
  muted:
    'bg-[var(--kt-surface-muted)] border border-[var(--kt-border-subtle)]',
  brand:
    'bg-[var(--kt-brand-soft)] border border-[color:var(--kt-brand)]/30'
};

const paddingClass: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

export const Card: React.FC<CardProps> = ({
  tone = 'default',
  padding = 'md',
  interactive = false,
  className = '',
  children,
  as: As = 'div'
}) => {
  const interactiveClass = interactive
    ? 'transition-shadow transition-colors hover:border-[var(--kt-border)] hover:shadow-[var(--kt-shadow)]'
    : '';
  return (
    <As
      className={`rounded-[var(--kt-radius-md)] shadow-[var(--kt-shadow-sm)] text-[var(--kt-ink)] ${toneClass[tone]} ${paddingClass[padding]} ${interactiveClass} ${className}`}
    >
      {children}
    </As>
  );
};

interface CardHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  description,
  actions,
  className = ''
}) => (
  <div
    className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}
  >
    <div className="space-y-1">
      <h3 className="text-lg font-semibold text-[var(--kt-ink-strong)]">{title}</h3>
      {description && (
        <p className="text-sm leading-6 text-[var(--kt-ink-muted)]">{description}</p>
      )}
    </div>
    {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
  </div>
);
