import React from 'react';

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
  <div className={`sticky top-0 z-20 rounded-[1rem] ${accentClassName}`}>
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0 text-white">
        <div className="text-[10px] font-black uppercase tracking-[0.14em] text-white/65">
          {eyebrow}
        </div>
        <div className="mt-0.5 truncate text-sm font-black leading-tight">{title}</div>
      </div>
      <button
        type="button"
        className="shrink-0 rounded-[0.65rem] border border-white/30 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-white transition hover:bg-white/20"
      >
        {guideLabel}
      </button>
    </div>
  </div>
);
