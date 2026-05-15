import React from 'react';
import { ThemeMode } from '../../data/appPreferences';

interface FallingFlower {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  spin: number;
  opacity: number;
}

const fallingFlowers: FallingFlower[] = [
  { id: 1, left: 4, size: 18, duration: 24, delay: -18, drift: 82, spin: 320, opacity: 0.62 },
  { id: 2, left: 8, size: 12, duration: 19, delay: -7, drift: -54, spin: -260, opacity: 0.42 },
  { id: 3, left: 13, size: 20, duration: 27, delay: -24, drift: 96, spin: 380, opacity: 0.56 },
  { id: 4, left: 18, size: 14, duration: 22, delay: -11, drift: -72, spin: -340, opacity: 0.46 },
  { id: 5, left: 23, size: 17, duration: 25, delay: -4, drift: 68, spin: 300, opacity: 0.54 },
  { id: 6, left: 28, size: 11, duration: 18, delay: -16, drift: -44, spin: -220, opacity: 0.38 },
  { id: 7, left: 33, size: 19, duration: 29, delay: -27, drift: 112, spin: 420, opacity: 0.6 },
  { id: 8, left: 38, size: 13, duration: 21, delay: -9, drift: -64, spin: -300, opacity: 0.44 },
  { id: 9, left: 44, size: 16, duration: 24, delay: -21, drift: 78, spin: 360, opacity: 0.52 },
  { id: 10, left: 49, size: 12, duration: 20, delay: -2, drift: -50, spin: -240, opacity: 0.4 },
  { id: 11, left: 54, size: 21, duration: 30, delay: -14, drift: 118, spin: 460, opacity: 0.58 },
  { id: 12, left: 59, size: 15, duration: 23, delay: -29, drift: -80, spin: -360, opacity: 0.48 },
  { id: 13, left: 64, size: 18, duration: 26, delay: -6, drift: 86, spin: 340, opacity: 0.55 },
  { id: 14, left: 69, size: 12, duration: 19, delay: -20, drift: -58, spin: -280, opacity: 0.4 },
  { id: 15, left: 74, size: 20, duration: 28, delay: -13, drift: 104, spin: 400, opacity: 0.6 },
  { id: 16, left: 79, size: 14, duration: 22, delay: -25, drift: -76, spin: -330, opacity: 0.45 },
  { id: 17, left: 84, size: 17, duration: 25, delay: -8, drift: 70, spin: 310, opacity: 0.53 },
  { id: 18, left: 89, size: 11, duration: 18, delay: -17, drift: -46, spin: -230, opacity: 0.36 },
  { id: 19, left: 94, size: 19, duration: 27, delay: -1, drift: 92, spin: 390, opacity: 0.57 },
  { id: 20, left: 97, size: 13, duration: 21, delay: -23, drift: -66, spin: -310, opacity: 0.42 }
];

const FlowerSvg: React.FC<{ size: number; isDark: boolean }> = ({ size, isDark }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="block">
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

export const LearnFallingFlowers: React.FC<{ themeMode: ThemeMode }> = ({ themeMode }) => {
  const isDark = themeMode === 'dark';

  return (
    <div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden" aria-hidden="true">
      {fallingFlowers.map((flower) => (
        <span
          key={flower.id}
          className="kt-learn-flower"
          style={
            {
              left: `${flower.left}%`,
              animationDuration: `${flower.duration}s`,
              animationDelay: `${flower.delay}s`,
              opacity: flower.opacity,
              ['--kt-learn-flower-opacity' as string]: flower.opacity,
              ['--kt-learn-flower-drift' as string]: `${flower.drift}px`,
              ['--kt-learn-flower-mid-spin' as string]: `${flower.spin * 0.48}deg`,
              ['--kt-learn-flower-spin' as string]: `${flower.spin}deg`
            } as React.CSSProperties
          }
        >
          <FlowerSvg size={flower.size} isDark={isDark} />
        </span>
      ))}
      <style>{`
        @keyframes kt-learn-flower-fall {
          0% {
            transform: translate3d(0, -9rem, 0) rotate(0deg);
            opacity: 0;
          }
          8% {
            opacity: var(--kt-learn-flower-opacity, 0.58);
          }
          42% {
            transform: translate3d(var(--kt-learn-flower-drift), 44vh, 0) rotate(var(--kt-learn-flower-mid-spin));
          }
          78% {
            opacity: var(--kt-learn-flower-opacity, 0.58);
          }
          100% {
            transform: translate3d(calc(var(--kt-learn-flower-drift) * -0.35), 1180px, 0) rotate(var(--kt-learn-flower-spin));
            opacity: 0;
          }
        }

        .kt-learn-flower {
          position: absolute;
          top: 0;
          display: block;
          filter: drop-shadow(0 4px 7px ${isDark ? 'rgba(0,0,0,0.28)' : 'rgba(190,70,95,0.14)'});
          transform: translate3d(0, -9rem, 0);
          animation: kt-learn-flower-fall linear infinite;
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .kt-learn-flower {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
