import React from 'react';

interface MissionBoardProps {
  title: React.ReactNode;
  summary?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const MissionBoard: React.FC<MissionBoardProps> = ({
  title,
  summary,
  children,
  className = ''
}) => (
  <section className={`relative ${className}`}>
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-black text-[var(--kt-ink-strong)]">{title}</h2>
        {summary ? <div className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)]">{summary}</div> : null}
      </div>
    </div>
    {children}
  </section>
);
