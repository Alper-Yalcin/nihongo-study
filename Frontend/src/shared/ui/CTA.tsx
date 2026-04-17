import React from 'react';

interface CTABlockProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  align?: 'start' | 'center';
  tone?: 'default' | 'brand';
  className?: string;
}

const toneClass: Record<NonNullable<CTABlockProps['tone']>, string> = {
  default:
    'bg-[var(--kt-surface)] border border-[var(--kt-border-subtle)]',
  brand:
    'bg-[var(--kt-brand-soft)] border border-[color:var(--kt-brand)]/30'
};

export const CTABlock: React.FC<CTABlockProps> = ({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  align = 'start',
  tone = 'default',
  className = ''
}) => {
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start';
  return (
    <div
      className={`flex flex-col gap-5 rounded-[var(--kt-radius-lg)] p-8 shadow-[var(--kt-shadow-sm)] sm:p-10 ${toneClass[tone]} ${alignClass} ${className}`}
    >
      {eyebrow && <div>{eyebrow}</div>}
      <div className={`space-y-3 ${align === 'center' ? 'max-w-2xl' : 'max-w-3xl'}`}>
        <h2 className="text-2xl font-bold tracking-tight text-[var(--kt-ink-strong)] sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="text-base leading-7 text-[var(--kt-ink-muted)] sm:text-lg sm:leading-8">
            {description}
          </p>
        )}
      </div>
      {(primaryAction || secondaryAction) && (
        <div
          className={`flex flex-wrap gap-3 ${align === 'center' ? 'justify-center' : ''}`}
        >
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  );
};
