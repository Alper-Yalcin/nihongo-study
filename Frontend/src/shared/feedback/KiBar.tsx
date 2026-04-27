import React, { useEffect, useState } from 'react';
import { getFeedbackState, subscribeFeedback, subscribeFeedbackPulse } from '../hooks/useFeedback';

interface KiBarProps {
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export const KiBar: React.FC<KiBarProps> = ({ size = 'sm', showLabel = false }) => {
  const [snapshot, setSnapshot] = useState(() => getFeedbackState());
  const [shake, setShake] = useState(0);

  useEffect(() => {
    const unsub = subscribeFeedback(() => setSnapshot(getFeedbackState()));
    const unsubPulse = subscribeFeedbackPulse((detail) => {
      if (detail.kind === 'wrong' || detail.kind === 'shield') {
        setShake((s) => s + 1);
      }
    });
    return () => {
      unsub();
      unsubPulse();
    };
  }, []);

  const dotSize = size === 'sm' ? 7 : 10;
  const gap = size === 'sm' ? 4 : 6;
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < snapshot.kiMax; i++) {
    const filled = i < snapshot.ki;
    dots.push(
      <span
        key={i}
        aria-hidden="true"
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          background: filled ? 'var(--kt-ki)' : 'var(--kt-ki-dim)',
          boxShadow: filled ? '0 0 6px color-mix(in srgb, var(--kt-ki) 70%, transparent)' : 'none',
          transition: 'background 220ms ease, box-shadow 220ms ease',
          display: 'inline-block'
        }}
      />
    );
  }

  return (
    <div
      key={shake}
      className="kt-ki-shake flex items-center gap-1.5 rounded-[0.85rem] border px-2 py-1.5"
      style={{
        borderColor: 'color-mix(in srgb, var(--kt-ki) 35%, transparent)',
        background: 'var(--kt-ki-soft)'
      }}
      aria-label={`Ki ${snapshot.ki}/${snapshot.kiMax}`}
      title={`気 ${snapshot.ki}/${snapshot.kiMax}`}
    >
      {showLabel && (
        <span
          className="text-[10px] font-black uppercase tracking-[0.18em]"
          style={{ color: 'var(--kt-ki)' }}
          aria-hidden="true"
        >
          気
        </span>
      )}
      <span style={{ display: 'inline-flex', gap }}>{dots}</span>
      <style>{`
        @keyframes kt-ki-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }
        .kt-ki-shake {
          animation: kt-ki-shake 220ms ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .kt-ki-shake { animation: none; }
        }
      `}</style>
    </div>
  );
};
