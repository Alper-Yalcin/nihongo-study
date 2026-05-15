import React, { useEffect, useRef, useState } from 'react';
import { subscribeFeedbackPulse, FeedbackPulseDetail } from '../../hooks/useFeedback';

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

// Düşük-end heuristik: küçük viewport veya az hardwareConcurrency
const lowEndHeuristic = (): boolean => {
  if (typeof window === 'undefined') return false;
  const cores = (navigator as unknown as { hardwareConcurrency?: number }).hardwareConcurrency ?? 4;
  const narrow = window.innerWidth < 480;
  return cores <= 4 && narrow;
};

const PETAL_HARD_CAP = 80;

interface Petal {
  id: number;
  x: number;        // viewport baseline x (px)
  y: number;        // viewport baseline y (px)
  vx: number;       // px / sec
  vy: number;       // px / sec (negative = up)
  rot: number;      // deg
  vrot: number;     // deg / sec
  spawnedAt: number;
  ttl: number;      // ms
  size: number;     // px
}

const VIEW_W = () => (typeof window !== 'undefined' ? window.innerWidth : 1024);
const VIEW_H = () => (typeof window !== 'undefined' ? window.innerHeight : 768);

const spawnPetals = (count: number, opts: { rain?: boolean }): Petal[] => {
  const now = performance.now();
  const petals: Petal[] = [];
  for (let i = 0; i < count; i++) {
    if (opts.rain) {
      // Üstten yağmur — tüm ekrana yayılır
      petals.push({
        id: now + i + Math.random(),
        x: Math.random() * VIEW_W(),
        y: -20 - Math.random() * 60,
        vx: (Math.random() - 0.5) * 60,
        vy: 90 + Math.random() * 80,
        rot: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 220,
        spawnedAt: now,
        ttl: 3200,
        size: 14 + Math.random() * 10
      });
    } else {
      // Hanabira flyUp — alttan yukarı doğru patlama
      const cx = VIEW_W() * 0.5 + (Math.random() - 0.5) * 60;
      const cy = VIEW_H() * 0.78;
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
      const speed = 240 + Math.random() * 160;
      petals.push({
        id: now + i + Math.random(),
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rot: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 360,
        spawnedAt: now,
        ttl: 1200,
        size: 14 + Math.random() * 8
      });
    }
  }
  return petals;
};

const SakuraSvg: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  // 5 yapraklı stilize sakura — minimal SVG
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <g fill={color}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="12"
          cy="6"
          rx="3.4"
          ry="5"
          transform={`rotate(${a} 12 12)`}
          opacity="0.92"
        />
      ))}
      <circle cx="12" cy="12" r="1.6" fill="#ffeef2" opacity="0.9" />
    </g>
  </svg>
);

export const HanabiraFly: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    const onPulse = (detail: FeedbackPulseDetail) => {
      if (prefersReducedMotion()) return;
      const lowEnd = lowEndHeuristic();
      const scale = lowEnd ? 0.5 : 1;
      const append = (count: number, rain: boolean) =>
        setPetals((prev) => {
          const room = Math.max(0, PETAL_HARD_CAP - prev.length);
          const final = Math.min(room, Math.round(count * scale));
          if (final <= 0) return prev;
          return [...prev, ...spawnPetals(final, { rain })];
        });

      if (detail.kind === 'correct') {
        const base = Math.min(8, Math.max(2, Math.round((detail.hanabiraAwarded ?? 10) / 4)));
        append(base, false);
      } else if (detail.kind === 'milestone' && (detail.milestoneThreshold ?? 0) >= 10) {
        append(36, true);
      } else if (detail.kind === 'mushin') {
        append(60, true);
      }
    };
    const unsub = subscribeFeedbackPulse(onPulse);
    return unsub;
  }, []);

  useEffect(() => {
    if (petals.length === 0) {
      lastTickRef.current = null;
      return;
    }
    const tick = (t: number) => {
      const last = lastTickRef.current ?? t;
      const dt = Math.min(0.05, (t - last) / 1000);
      lastTickRef.current = t;
      setPetals((prev) => {
        const now = performance.now();
        const next: Petal[] = [];
        for (const p of prev) {
          if (now - p.spawnedAt > p.ttl) continue;
          next.push({
            ...p,
            x: p.x + p.vx * dt,
            y: p.y + p.vy * dt,
            // Hafif gravity + drag
            vy: p.vy + 220 * dt,
            vx: p.vx * (1 - 0.6 * dt),
            rot: p.rot + p.vrot * dt
          });
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [petals.length]);

  if (petals.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
      {petals.map((p) => {
        const age = (performance.now() - p.spawnedAt) / p.ttl;
        const opacity = age < 0.2 ? age / 0.2 : 1 - Math.max(0, (age - 0.7) / 0.3);
        return (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              transform: `translate3d(${p.x}px, ${p.y}px, 0) rotate(${p.rot}deg)`,
              opacity: Math.max(0, Math.min(1, opacity)),
              willChange: 'transform, opacity'
            }}
          >
            <SakuraSvg size={p.size} color="var(--kt-hanabira)" />
          </div>
        );
      })}
    </div>
  );
};
