import React from 'react';

interface RewardTrackProps {
  percent: number;
  label?: React.ReactNode;
  description?: React.ReactNode;
  milestones?: string[];
  className?: string;
}

export const RewardTrack: React.FC<RewardTrackProps> = ({
  percent,
  label,
  description,
  milestones = ['Sakura', 'Tea', 'Card', 'Gate'],
  className = ''
}) => {
  const safePercent = Math.max(0, Math.min(100, percent));

  return (
    <div className={className}>
      {(label || description) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-dan-ink)]">{label}</div>
          <div className="text-xs font-bold text-[var(--kt-dan-ink)]/80">{description}</div>
        </div>
      )}
      <div className="relative h-3 rounded-full bg-[rgba(0,0,0,0.08)]">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,var(--kt-dan-gold),var(--kt-brand))]" style={{ width: `${safePercent}%` }} />
        {milestones.map((milestone, index) => {
          const point = milestones.length <= 1 ? 0 : (index / (milestones.length - 1)) * 100;
          const unlocked = safePercent >= point;
          return (
            <div key={milestone} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${point}%` }}>
              <div className={`h-5 w-5 rounded-full border-2 ${unlocked ? 'border-[var(--kt-dan-gold)] bg-[var(--kt-surface)]' : 'border-black/10 bg-[var(--kt-dan-gold-soft)]'}`} />
              <div className="mt-2 w-16 -translate-x-[38%] text-center text-[10px] font-black uppercase tracking-[0.08em] text-[var(--kt-dan-ink)]/70">
                {milestone}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
