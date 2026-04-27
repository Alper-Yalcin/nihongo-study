/**
 * SeasonalBackdrop — sayfanın arkasında ay/saat reaktif atmosfer.
 * Plana göre mevsim:
 *   ilkbahar (3-5)   → sakura yaprak parçacıkları, açık pembe
 *   yaz (6-8)        → matsuri lambası tonları, sıcak kehribar
 *   sonbahar (9-11)  → kırmızı yaprak partikülleri, zengin ekru
 *   kış (12-2)       → kar partikülleri, gümüşi-mavi
 *
 * Saat tonu (gün içi): erken/geç saatte ek bir overlay, paleti yumuşatır.
 * `prefers-reduced-motion` saygılı: partiküller tamamen kapatılır.
 */
import React, { useEffect, useState } from 'react';

type Season = 'spring' | 'summer' | 'autumn' | 'winter';

const seasonOf = (d: Date): Season => {
  const m = d.getMonth() + 1;
  if (m >= 3 && m <= 5) return 'spring';
  if (m >= 6 && m <= 8) return 'summer';
  if (m >= 9 && m <= 11) return 'autumn';
  return 'winter';
};

interface DaypartTone {
  label: 'asa' | 'hiru' | 'yugata' | 'yoru';
  vignette: string;
}

const daypartOf = (d: Date): DaypartTone => {
  const h = d.getHours();
  if (h >= 5 && h < 11)
    return {
      label: 'asa',
      vignette: 'radial-gradient(circle at 70% 0%, rgba(255, 220, 240, 0.18), transparent 60%)'
    };
  if (h >= 11 && h < 17)
    return { label: 'hiru', vignette: 'radial-gradient(circle at 50% 0%, rgba(255, 240, 220, 0.10), transparent 70%)' };
  if (h >= 17 && h < 21)
    return {
      label: 'yugata',
      vignette: 'radial-gradient(circle at 30% 100%, rgba(255, 180, 140, 0.18), transparent 60%)'
    };
  return {
    label: 'yoru',
    vignette: 'radial-gradient(circle at 50% 100%, rgba(80, 100, 160, 0.22), transparent 70%)'
  };
};

const seasonPalette: Record<Season, { tint: string; particle: string; emoji?: string }> = {
  spring: { tint: 'rgba(255, 200, 220, 0.06)', particle: 'var(--kt-hanabira)', emoji: '🌸' },
  summer: { tint: 'rgba(255, 220, 130, 0.05)', particle: '#f0c34a', emoji: '🏮' },
  autumn: { tint: 'rgba(216, 100, 60, 0.06)', particle: '#cf6438', emoji: '🍁' },
  winter: { tint: 'rgba(160, 200, 230, 0.06)', particle: '#cfe6ff', emoji: '❄' }
};

interface Particle {
  id: number;
  x: number;       // % across viewport
  startY: number;  // px from top, negative
  duration: number; // s for full fall
  drift: number;   // px sway amplitude
  size: number;    // px
  delay: number;   // s
}

const buildParticles = (count: number, seed: number): Particle[] => {
  const list: Particle[] = [];
  for (let i = 0; i < count; i++) {
    list.push({
      id: seed + i,
      x: Math.random() * 100,
      startY: -40 - Math.random() * 200,
      duration: 22 + Math.random() * 26,
      drift: 30 + Math.random() * 60,
      size: 10 + Math.random() * 8,
      delay: -Math.random() * 30
    });
  }
  return list;
};

const usePrefersReducedMotion = (): boolean => {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return reduce;
};

export interface SeasonalBackdropProps {
  density?: 'sparse' | 'normal';
  fixed?: boolean;
}

export const SeasonalBackdrop: React.FC<SeasonalBackdropProps> = ({ density = 'sparse', fixed = true }) => {
  const reduce = usePrefersReducedMotion();
  const now = new Date();
  const season = seasonOf(now);
  const { vignette } = daypartOf(now);
  const palette = seasonPalette[season];
  const count = reduce ? 0 : density === 'sparse' ? 14 : 28;
  const particles = React.useMemo(() => buildParticles(count, season.length * 1000), [count, season]);

  return (
    <div
      aria-hidden="true"
      className={`${fixed ? 'fixed' : 'absolute'} pointer-events-none inset-0 z-0 overflow-hidden`}
      style={{ background: palette.tint }}
    >
      <div className="absolute inset-0" style={{ background: vignette }} />
      {particles.map((p) => (
        <span
          key={p.id}
          className="kt-season-particle"
          style={
            {
              left: `${p.x}%`,
              top: `${p.startY}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              ['--drift' as string]: `${p.drift}px`,
              fontSize: `${p.size}px`,
              color: palette.particle
            } as React.CSSProperties
          }
        >
          {palette.emoji ?? '·'}
        </span>
      ))}
      <style>{`
        @keyframes kt-season-fall {
          0%   { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.85; }
          50%  { transform: translate3d(var(--drift), 50vh, 0) rotate(180deg); }
          90%  { opacity: 0.6; }
          100% { transform: translate3d(calc(var(--drift) * -0.4), 110vh, 0) rotate(360deg); opacity: 0; }
        }
        .kt-season-particle {
          position: absolute;
          will-change: transform, opacity;
          animation: kt-season-fall linear infinite;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.05));
          user-select: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .kt-season-particle { animation: none; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export const getCurrentSeason = (): Season => seasonOf(new Date());
