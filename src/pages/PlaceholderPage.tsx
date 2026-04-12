import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';

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
}) => {
  return (
    <PageContainer title={title}>
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Router Skeleton
          </div>
          <p className="text-lg leading-8 text-slate-600">{description}</p>
          <Link
            to={actionHref}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            {actionLabel}
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};
