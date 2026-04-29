import React from 'react';
import { Button } from '../ui';

interface UnlockCTAProps {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

export const UnlockCTA: React.FC<UnlockCTAProps> = ({
  title,
  description,
  actionLabel,
  actionHref
}) => (
  <section className="rounded-[1.8rem] border border-[var(--kt-border-subtle)] bg-[radial-gradient(circle_at_top_left,var(--kt-accent-info-soft),transparent_42%),var(--kt-surface)] p-5 shadow-[var(--kt-shadow-sm)]">
    <h3 className="text-2xl font-black leading-tight text-[var(--kt-ink-strong)]">{title}</h3>
    <p className="mt-3 text-sm leading-7 text-[var(--kt-ink-muted)]">{description}</p>
    <div className="mt-5">
      <Button as="link" to={actionHref} fullWidth>
        {actionLabel}
      </Button>
    </div>
  </section>
);
