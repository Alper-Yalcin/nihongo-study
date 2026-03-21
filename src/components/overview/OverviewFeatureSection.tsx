import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { OverviewDemoFrame } from './OverviewDemoFrame';

type OverviewAccentTone = 'indigo' | 'emerald' | 'rose' | 'amber';

interface OverviewFeatureSectionProps {
  badge: string;
  title: string;
  description: string;
  features: string[];
  imageAlt: string;
  fallbackTitle: string;
  fallbackPath: string;
  previewSrc: string;
  accent: OverviewAccentTone;
  reverseLayout?: boolean;
  onOpenDetails?: () => void;
}

const accentUi: Record<
  OverviewAccentTone,
  {
    badge: string;
    bullet: string;
  }
> = {
  indigo: {
    badge: 'bg-indigo-100 text-indigo-700',
    bullet: 'text-indigo-500'
  },
  emerald: {
    badge: 'bg-emerald-100 text-emerald-700',
    bullet: 'text-emerald-500'
  },
  rose: {
    badge: 'bg-rose-100 text-rose-700',
    bullet: 'text-rose-500'
  },
  amber: {
    badge: 'bg-amber-100 text-amber-700',
    bullet: 'text-amber-500'
  }
};

export const OverviewFeatureSection: React.FC<OverviewFeatureSectionProps> = ({
  badge,
  title,
  description,
  features,
  imageAlt,
  fallbackTitle,
  fallbackPath,
  previewSrc,
  accent,
  reverseLayout = false,
  onOpenDetails
}) => {
  const isInteractive = Boolean(onOpenDetails);
  const ui = accentUi[accent];

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onOpenDetails) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpenDetails();
    }
  };

  return (
    <div
      className={`mb-24 flex flex-col items-center gap-12 ${
        reverseLayout ? 'lg:flex-row-reverse' : 'lg:flex-row'
      } ${isInteractive ? 'cursor-pointer rounded-3xl transition-transform duration-300 hover:-translate-y-1' : ''}`}
      onClick={onOpenDetails}
      onKeyDown={handleKeyDown}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      <div className="flex-1 space-y-6">
        <div className={`mb-2 inline-block rounded-full px-3 py-1 text-sm font-semibold uppercase tracking-wide ${ui.badge}`}>
          {badge}
        </div>
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        <p className="text-lg leading-relaxed text-slate-600">{description}</p>

        <ul className="mt-8 space-y-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-start">
              <CheckCircle2 className={`mr-3 h-6 w-6 flex-shrink-0 ${ui.bullet}`} />
              <span className="font-medium text-slate-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <OverviewDemoFrame
        src={previewSrc}
        alt={imageAlt}
        fallbackTitle={fallbackTitle}
        fallbackPath={fallbackPath}
      />
    </div>
  );
};
