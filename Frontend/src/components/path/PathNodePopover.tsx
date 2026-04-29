import React from 'react';
import { Button } from '../ui';

interface PathNodePopoverProps {
  title: string;
  description: string;
  actionLabel: string;
  secondaryLabel: string;
  onStart: () => void;
  onClose: () => void;
}

export const PathNodePopover: React.FC<PathNodePopoverProps> = ({
  title,
  description,
  actionLabel,
  secondaryLabel,
  onStart,
  onClose
}) => (
  <div className="w-full max-w-sm rounded-[1.5rem] border border-[var(--kt-border)] bg-[var(--kt-surface)] p-5 shadow-[var(--kt-shadow-lg)]">
    <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--kt-ink-subtle)]">{secondaryLabel}</div>
    <h3 className="mt-2 text-xl font-black text-[var(--kt-ink-strong)]">{title}</h3>
    <p className="mt-3 text-sm leading-7 text-[var(--kt-ink-muted)]">{description}</p>
    <div className="mt-5 flex flex-wrap gap-3">
      <Button as="button" type="button" onClick={onStart}>
        {actionLabel}
      </Button>
      <Button as="button" type="button" variant="secondary" onClick={onClose}>
        Kapat
      </Button>
    </div>
  </div>
);
