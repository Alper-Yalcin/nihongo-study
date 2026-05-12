import React from 'react';
import type { ThemeMode } from '../../../data/appPreferences';

interface BurstFlower {
  id: number;
  left: number;
  size: number;
  dur: number;
  delay: number;
  drift: number;
  spin: number;
  opacity: number;
}

const BURST_FLOWERS: BurstFlower[] = [
  { id: 1,  left: 3,  size: 20, dur: 3.8, delay: 0.00, drift:  75, spin:  300, opacity: 0.85 },
  { id: 2,  left: 11, size: 14, dur: 3.2, delay: 0.06, drift: -55, spin: -250, opacity: 0.70 },
  { id: 3,  left: 20, size: 22, dur: 4.0, delay: 0.02, drift:  95, spin:  370, opacity: 0.80 },
  { id: 4,  left: 29, size: 13, dur: 3.5, delay: 0.12, drift: -45, spin: -210, opacity: 0.65 },
  { id: 5,  left: 38, size: 24, dur: 4.2, delay: 0.00, drift:  60, spin:  330, opacity: 0.90 },
  { id: 6,  left: 47, size: 18, dur: 3.6, delay: 0.09, drift: -85, spin: -290, opacity: 0.75 },
  { id: 7,  left: 55, size: 21, dur: 4.0, delay: 0.04, drift: 105, spin:  410, opacity: 0.82 },
  { id: 8,  left: 63, size: 15, dur: 3.4, delay: 0.14, drift: -50, spin: -230, opacity: 0.68 },
  { id: 9,  left: 71, size: 20, dur: 4.1, delay: 0.03, drift:  72, spin:  355, opacity: 0.78 },
  { id: 10, left: 79, size: 13, dur: 3.3, delay: 0.17, drift: -88, spin: -275, opacity: 0.63 },
  { id: 11, left: 87, size: 22, dur: 3.9, delay: 0.07, drift:  88, spin:  415, opacity: 0.83 },
  { id: 12, left: 94, size: 16, dur: 3.7, delay: 0.01, drift: -62, spin: -320, opacity: 0.72 },
  { id: 13, left: 25, size: 12, dur: 3.1, delay: 0.19, drift:-105, spin: -350, opacity: 0.60 },
  { id: 14, left: 60, size: 17, dur: 4.3, delay: 0.11, drift:  50, spin:  280, opacity: 0.76 },
  { id: 15, left: 44, size: 19, dur: 3.6, delay: 0.22, drift: -70, spin: -390, opacity: 0.70 },
];

const FlowerSvg: React.FC<{ size: number; isDark: boolean }> = ({ size, isDark }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <g fill={isDark ? '#ff9eb8' : '#f56f93'}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="12"
          cy="6.4"
          rx="3.2"
          ry="5.2"
          transform={`rotate(${angle} 12 12)`}
          opacity="0.9"
        />
      ))}
    </g>
    <circle cx="12" cy="12" r="1.7" fill={isDark ? '#ffe9f0' : '#fff6d6'} opacity="0.92" />
  </svg>
);

export const LessonCorrectBurst: React.FC<{ themeMode: ThemeMode }> = ({ themeMode }) => {
  const isDark = themeMode === 'dark';

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[200] overflow-hidden"
      aria-hidden="true"
    >
      {BURST_FLOWERS.map((f) => (
        <span
          key={f.id}
          style={
            {
              position: 'absolute',
              top: 0,
              left: `${f.left}%`,
              display: 'block',
              opacity: 0,
              filter: `drop-shadow(0 4px 6px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(190,70,95,0.18)'})`,
              animationName: 'kt-burst-fall',
              animationDuration: `${f.dur}s`,
              animationDelay: `${f.delay}s`,
              animationTimingFunction: 'ease-in',
              animationFillMode: 'forwards',
              willChange: 'transform, opacity',
              ['--burst-drift' as string]: `${f.drift}px`,
              ['--burst-spin' as string]: `${f.spin}deg`,
              ['--burst-opacity' as string]: f.opacity,
            } as React.CSSProperties
          }
        >
          <FlowerSvg size={f.size} isDark={isDark} />
        </span>
      ))}
      <style>{`
        @keyframes kt-burst-fall {
          0% {
            transform: translate3d(0, -120px, 0) scale(0.4) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--burst-opacity, 0.8);
          }
          75% {
            opacity: var(--burst-opacity, 0.8);
          }
          100% {
            transform: translate3d(var(--burst-drift), 100vh, 0) scale(1.1) rotate(var(--burst-spin));
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          [style*="kt-burst-fall"] {
            animation: none !important;
            opacity: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
