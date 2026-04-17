import React from 'react';

interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, description, children }) => {
  return (
    <section className="section-card overflow-hidden rounded-[var(--kt-radius-md)] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] shadow-[var(--kt-shadow-sm)]">
      <div className="section-card-header border-b border-[var(--kt-border-subtle)] bg-[var(--kt-surface-muted)] px-4 py-3">
        <h2 className="text-base font-semibold text-[var(--kt-ink-strong)]">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-[var(--kt-ink-muted)]">{description}</p>}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
};
