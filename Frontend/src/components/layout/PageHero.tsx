import React from 'react';

interface PageHeroProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  visual?: React.ReactNode;
  stats?: React.ReactNode;
  className?: string;
  backgroundGlyph?: React.ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  title,
  description,
  actions,
  visual,
  stats,
  className = '',
  backgroundGlyph
}) => (
  <section
    className={`relative overflow-hidden border-b border-[var(--kt-border-subtle)] bg-[linear-gradient(135deg,var(--kt-surface-page),var(--kt-accent-info-soft))] px-1 pb-8 pt-4 ${className}`}
  >
    {backgroundGlyph ? (
      <div className="pointer-events-none absolute bottom-3 right-8 font-jp text-[8rem] font-black leading-none opacity-10">
        {backgroundGlyph}
      </div>
    ) : null}
    <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="min-w-0">
        {eyebrow ? <div className="mb-4">{eyebrow}</div> : null}
        <h1 className="text-4xl font-black tracking-[-0.01em] text-[var(--kt-ink-strong)] md:text-6xl">
          {title}
        </h1>
        {description ? (
          <div className="mt-4 max-w-2xl text-sm font-medium leading-7 text-[var(--kt-ink-muted)] md:text-base md:leading-8">
            {description}
          </div>
        ) : null}
        {stats ? <div className="mt-5 flex flex-wrap gap-3">{stats}</div> : null}
        {actions ? <div className="mt-5 flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
      {visual ? <div className="relative justify-self-start lg:justify-self-end">{visual}</div> : null}
    </div>
  </section>
);
