import React from 'react';
import { Button } from '../../shared/ui';

interface SectionBannerProps {
  eyebrow: string;
  title: string;
  accentClassName: string;
  guideLabel: string;
}

export const SectionBanner: React.FC<SectionBannerProps> = ({
  eyebrow,
  title,
  accentClassName,
  guideLabel
}) => (
  <div className={`sticky top-0 z-20 rounded-[1.7rem] p-6 shadow-[var(--kt-shadow)] ${accentClassName}`}>
    <div className="flex items-center justify-between gap-4">
      <div className="text-white">
        <div className="text-sm font-black uppercase tracking-[0.12em] text-white/70">{eyebrow}</div>
        <h2 className="mt-2 text-3xl font-black leading-tight">{title}</h2>
      </div>
      <Button as="button" type="button" variant="secondary" size="sm">
        {guideLabel}
      </Button>
    </div>
  </div>
);
