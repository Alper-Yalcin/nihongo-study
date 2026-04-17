import React from 'react';

type PageShellWidth = 'narrow' | 'default' | 'wide';

interface PageShellProps {
  children: React.ReactNode;
  width?: PageShellWidth;
  className?: string;
}

const widthClass: Record<PageShellWidth, string> = {
  narrow: 'max-w-3xl',
  default: 'max-w-6xl',
  wide: 'max-w-7xl'
};

export const PageShell: React.FC<PageShellProps> = ({
  children,
  width = 'default',
  className = ''
}) => (
  <div
    className={`mx-auto w-full ${widthClass[width]} px-4 py-8 sm:px-6 sm:py-10 lg:px-8 ${className}`}
  >
    {children}
  </div>
);

interface PageHeaderProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  actions,
  meta,
  className = ''
}) => (
  <header className={`space-y-4 ${className}`}>
    {eyebrow && <div>{eyebrow}</div>}
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--kt-ink-strong)] sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-3xl text-base leading-7 text-[var(--kt-ink-muted)] sm:text-lg sm:leading-8">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
    {meta && <div className="pt-1">{meta}</div>}
  </header>
);

interface PageSectionProps {
  children: React.ReactNode;
  spacing?: 'tight' | 'default' | 'loose';
  className?: string;
}

const spacingClass: Record<NonNullable<PageSectionProps['spacing']>, string> = {
  tight: 'space-y-6',
  default: 'space-y-10',
  loose: 'space-y-16'
};

export const PageSection: React.FC<PageSectionProps> = ({
  children,
  spacing = 'default',
  className = ''
}) => <section className={`${spacingClass[spacing]} ${className}`}>{children}</section>;
