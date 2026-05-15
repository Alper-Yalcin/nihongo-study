import React from 'react';

interface SceneHeaderProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  stats?: React.ReactNode;
  actions?: React.ReactNode;
  visual?: React.ReactNode;
  glyph?: React.ReactNode;
  className?: string;
}

export const SceneHeader: React.FC<SceneHeaderProps> = ({
  eyebrow,
  title,
  description,
  stats,
  actions,
  visual,
  glyph,
  className = ''
}) => (
  <header className={`relative ${className}`}>
    {glyph ? (
      <div className="pointer-events-none absolute -right-2 -top-4 font-jp text-[7rem] font-black leading-none text-[var(--kt-brand)]/10">
        {glyph}
      </div>
    ) : null}
    <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
      <div className="min-w-0">
        {eyebrow ? <div className="mb-3">{eyebrow}</div> : null}
        <h1 className="text-4xl font-black tracking-[-0.01em] text-[var(--kt-ink-strong)] md:text-5xl">
          {title}
        </h1>
        {description ? <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-[var(--kt-ink-muted)]">{description}</p> : null}
        {stats ? <div className="mt-4 flex flex-wrap gap-2">{stats}</div> : null}
        {actions ? <div className="mt-5 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {visual ? <div className="relative">{visual}</div> : null}
    </div>
  </header>
);
