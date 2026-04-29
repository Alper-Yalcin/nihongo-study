import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button, Card, Eyebrow, PageHeader, PageShell } from '../components/ui';

interface PlaceholderPageProps {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description,
  actionLabel,
  actionHref
}) => (
  <PageShell>
    <PageHeader
      eyebrow={<Eyebrow>Router Skeleton</Eyebrow>}
      title={title}
    />
    <Card className="mt-8" padding="lg">
      <div className="max-w-3xl space-y-6">
        <p className="text-lg leading-8 text-[var(--kt-ink-muted)]">{description}</p>
        <Button as="link" to={actionHref} iconEnd={<ArrowRight size={16} />}>
          {actionLabel}
        </Button>
      </div>
    </Card>
  </PageShell>
);
