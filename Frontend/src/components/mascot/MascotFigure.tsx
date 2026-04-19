import React from 'react';

type MascotPose = 'wave' | 'cheer' | 'study' | 'sleep';
type MascotTone = 'brand' | 'warning' | 'success' | 'plum' | 'sunset' | 'info';

interface MascotFigureProps {
  pose?: MascotPose;
  tone?: MascotTone;
  size?: number;
  className?: string;
}

const tonePalette: Record<MascotTone, { primary: string; secondary: string; detail: string }> = {
  brand: {
    primary: 'var(--kt-brand)',
    secondary: 'var(--kt-brand-soft-strong)',
    detail: 'var(--kt-brand-on)'
  },
  warning: {
    primary: 'var(--kt-accent-warning)',
    secondary: 'var(--kt-accent-warning-soft)',
    detail: '#fff6f1'
  },
  success: {
    primary: 'var(--kt-accent-success)',
    secondary: 'var(--kt-accent-success-soft)',
    detail: '#fff7f8'
  },
  plum: {
    primary: 'var(--kt-accent-plum)',
    secondary: 'var(--kt-accent-plum-soft)',
    detail: '#fff7fb'
  },
  sunset: {
    primary: 'var(--kt-accent-sunset)',
    secondary: 'var(--kt-accent-sunset-soft)',
    detail: '#fff8f3'
  },
  info: {
    primary: 'var(--kt-accent-info)',
    secondary: 'var(--kt-accent-info-soft)',
    detail: '#fff7f8'
  }
};

const armByPose: Record<MascotPose, { left: string; right: string }> = {
  wave: { left: 'M40 66c-10 4-16 10-18 18', right: 'M92 54c10-10 18-12 26-10' },
  cheer: { left: 'M42 54c-8-10-16-14-24-16', right: 'M92 54c8-10 16-14 24-16' },
  study: { left: 'M44 74c8-8 20-10 30-8', right: 'M86 74c-8-8-20-10-30-8' },
  sleep: { left: 'M46 78c10 0 18 2 24 8', right: 'M84 78c-10 0-18 2-24 8' }
};

export const MascotFigure: React.FC<MascotFigureProps> = ({
  pose = 'wave',
  tone = 'brand',
  size = 132,
  className = ''
}) => {
  const palette = tonePalette[tone];
  const arms = armByPose[pose];
  const lineColor = 'var(--kt-ink-strong)';
  const eyeHighlightColor = 'var(--kt-surface-page)';
  const beakColor = 'var(--kt-accent-warning)';

  return (
    <svg
      viewBox="0 0 140 140"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Hanabi mascot"
    >
      <ellipse cx="70" cy="118" rx="34" ry="10" fill="var(--kt-ink-subtle)" opacity={0.32} />
      <path d="M43 34l18-18 10 24z" fill={palette.primary} />
      <path d="M97 34L79 16 69 40z" fill={palette.primary} />
      <path d="M48 40c0-18 15-32 34-32s34 14 34 32v24c0 23-16 42-40 42S36 87 36 64V54c0-8 5-14 12-14z" fill={palette.primary} />
      <path d="M47 66c5 16 16 28 29 28 18 0 29-13 34-29-6 7-12 10-21 10-15 0-27-3-42-9z" fill={palette.secondary} />
      <circle cx="58" cy="56" r="12" fill={palette.detail} />
      <circle cx="89" cy="56" r="12" fill={palette.detail} />
      <circle cx="62" cy="58" r="5" fill={lineColor} />
      <circle cx="85" cy="58" r="5" fill={lineColor} />
      <circle cx="59" cy="56" r="2" fill={eyeHighlightColor} />
      <circle cx="82" cy="56" r="2" fill={eyeHighlightColor} />
      <path d="M70 62l7 5-7 8-7-8z" fill={beakColor} />
      <path d="M60 81c7 6 18 6 26 0" fill="none" stroke={lineColor} strokeLinecap="round" strokeWidth="4" />
      <path d={arms.left} fill="none" stroke={palette.primary} strokeLinecap="round" strokeWidth="9" />
      <path d={arms.right} fill="none" stroke={palette.primary} strokeLinecap="round" strokeWidth="9" />
      <path d="M62 97c-8 10-11 20-9 29" fill="none" stroke={palette.primary} strokeLinecap="round" strokeWidth="9" />
      <path d="M86 97c8 10 11 20 9 29" fill="none" stroke={palette.primary} strokeLinecap="round" strokeWidth="9" />
      {pose === 'study' && (
        <rect x="46" y="72" width="48" height="18" rx="8" fill="rgba(18,24,32,0.75)" />
      )}
      {pose === 'sleep' && (
        <>
          <path d="M102 28c7-4 9-11 6-18 6 4 10 10 8 18-1 4-5 7-14 9z" fill={palette.secondary} />
          <path d="M114 18c5-2 7-6 5-11 4 3 6 7 5 12-1 3-4 5-10 6z" fill={palette.secondary} />
        </>
      )}
    </svg>
  );
};
