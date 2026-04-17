import React from 'react';

interface EyebrowProps {
  children: React.ReactNode;
  tone?: 'muted' | 'brand' | 'success' | 'warning' | 'danger';
  className?: string;
}

const toneColor: Record<NonNullable<EyebrowProps['tone']>, string> = {
  muted: 'text-[var(--kt-ink-subtle)]',
  brand: 'text-[var(--kt-brand)]',
  success: 'text-[var(--kt-accent-success)]',
  warning: 'text-[var(--kt-accent-warning)]',
  danger: 'text-[var(--kt-accent-danger)]'
};

export const Eyebrow: React.FC<EyebrowProps> = ({ children, tone = 'muted', className = '' }) => (
  <div
    className={`text-xs font-semibold uppercase tracking-[0.24em] ${toneColor[tone]} ${className}`}
  >
    {children}
  </div>
);
