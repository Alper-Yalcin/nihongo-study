import React from 'react';

interface GameTileProps {
  title: string;
  description: string;
  accentClassName: string;
  icon: React.ReactNode;
  meta: string;
  action: React.ReactNode;
}

export const GameTile: React.FC<GameTileProps> = ({
  title,
  description,
  accentClassName,
  icon,
  meta,
  action
}) => (
  <article
    className={`overflow-hidden rounded-[1.8rem] border border-[var(--kt-border-subtle)] p-6 text-white shadow-[var(--kt-shadow)] ${accentClassName}`}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] bg-[rgba(255,255,255,0.18)]">
        {icon}
      </div>
      <span className="rounded-full bg-[rgba(12,18,26,0.2)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
        {meta}
      </span>
    </div>
    <h3 className="mt-6 text-2xl font-bold">{title}</h3>
    <p className="mt-2 max-w-md text-sm leading-7 text-white/84">{description}</p>
    <div className="mt-6">{action}</div>
  </article>
);
