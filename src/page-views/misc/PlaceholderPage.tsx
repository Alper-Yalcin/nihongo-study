import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button, Eyebrow, PageHeader, PageShell } from '../../components/ui';

interface PlaceholderPageProps {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  details?: string[];
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  actionLabel,
  actionHref,
  details = []
}) => (
  <PageShell>
    <PageHeader
      eyebrow={<Eyebrow>Mode Notes</Eyebrow>}
      title={title}
    />
    <section
      className="relative mt-8 overflow-hidden rounded-[1.75rem] border border-[color:var(--kt-brand)]/15 p-5 backdrop-blur-md md:p-7"
      style={{
        background:
          'linear-gradient(135deg, color-mix(in srgb, var(--kt-surface) 72%, transparent), color-mix(in srgb, var(--kt-brand-soft) 50%, transparent)), var(--kt-washi-bg)',
        boxShadow: 'rgba(132, 82, 62, 0.10) 0px 18px 46px'
      }}
    >
      <div className="pointer-events-none absolute -right-3 -top-8 font-jp text-[7rem] font-black leading-none text-[var(--kt-brand)]/10">
        案
      </div>
      <div className="relative max-w-3xl space-y-6">
        <p className="text-lg leading-8 text-[var(--kt-ink-muted)]">{description}</p>
        {details.length > 0 ? (
          <div
            className="rounded-[1rem] border border-[var(--kt-border-subtle)] p-4"
            style={{
              background:
                'linear-gradient(135deg, color-mix(in srgb, var(--kt-brand-soft) 55%, transparent), color-mix(in srgb, var(--kt-surface) 42%, transparent))'
            }}
          >
            <div className="text-xs font-black uppercase tracking-[0.16em] text-[var(--kt-ink-subtle)]">
              Implementation notes
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--kt-ink-muted)]">
              {details.map((detail) => (
                <li key={detail} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--kt-brand)]" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <Button as="link" to={actionHref} iconEnd={<ArrowRight size={16} />}>
          {actionLabel}
        </Button>
      </div>
    </section>
  </PageShell>
);
