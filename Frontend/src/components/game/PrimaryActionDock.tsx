import React from 'react';

interface PrimaryActionDockProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  action: React.ReactNode;
  className?: string;
}

export const PrimaryActionDock: React.FC<PrimaryActionDockProps> = ({
  title,
  description,
  meta,
  action,
  className = ''
}) => (
  <div className={`relative my-6 rounded-[1.4rem] border border-[color:var(--kt-dan-gold)]/30 px-5 py-5 md:px-6 ${className}`}
    style={{
      background:
        'linear-gradient(135deg, color-mix(in srgb, var(--kt-dan-gold-soft) 78%, transparent), color-mix(in srgb, var(--kt-surface) 44%, transparent))'
    }}
  >
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-2xl font-black text-[var(--kt-ink-strong)]">{title}</div>
        {description ? <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--kt-ink-muted)]">{description}</p> : null}
        {meta ? <div className="mt-3 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.12em] text-[var(--kt-ink-subtle)]">{meta}</div> : null}
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  </div>
);
