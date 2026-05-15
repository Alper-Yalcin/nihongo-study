import React from 'react';

interface SectionBlockProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const SectionBlock: React.FC<SectionBlockProps> = ({
  title,
  description,
  actions,
  children,
  className = ''
}) => (
  <section className={`border-t border-[var(--kt-border-subtle)] py-6 ${className}`}>
    {(title || description || actions) && (
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {title ? <h2 className="text-2xl font-black text-[var(--kt-ink-strong)] md:text-3xl">{title}</h2> : null}
          {description ? <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--kt-ink-muted)]">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    )}
    {children}
  </section>
);
