import React from 'react';

type ProgressTone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'plum' | 'info';

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  tone?: ProgressTone;
  label?: React.ReactNode;
  className?: string;
}

const toneToColor: Record<ProgressTone, string> = {
  neutral: 'var(--kt-ink-subtle)',
  brand: 'var(--kt-brand)',
  success: 'var(--kt-accent-success)',
  warning: 'var(--kt-accent-warning)',
  danger: 'var(--kt-accent-danger)',
  plum: 'var(--kt-accent-plum)',
  info: 'var(--kt-accent-info)'
};

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 72,
  strokeWidth = 8,
  tone = 'brand',
  label,
  className = ''
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (clamped / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--kt-progress-track)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={toneToColor[tone]}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        {label ?? (
          <span className="text-sm font-bold text-[var(--kt-ink-strong)]">{`${clamped}%`}</span>
        )}
      </div>
    </div>
  );
};
