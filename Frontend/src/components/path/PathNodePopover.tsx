import React from 'react';
import { Button } from '../../shared/ui';

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
  <div className="w-full max-w-sm rounded-[1.5rem] border border-[var(--kt-border)] bg-[rgba(10,16,24,0.92)] p-5 text-white shadow-[var(--kt-shadow-lg)]">
    <div className="text-xs font-black uppercase tracking-[0.18em] text-white/60">{secondaryLabel}</div>
    <h3 className="mt-2 text-xl font-black">{title}</h3>
    <p className="mt-3 text-sm leading-7 text-white/72">{description}</p>
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
