import React, { useEffect, useState } from 'react';
import {
  COMBO_TIERS,
  getComboMultiplier,
  subscribeFeedback,
  getFeedbackState,
  subscribeFeedbackPulse
} from '../../hooks/useFeedback';

const findTier = (combo: number) => {
  let current = COMBO_TIERS[0];
  for (const tier of COMBO_TIERS) {
    if (combo >= tier.threshold) current = tier;
  }
  return combo >= COMBO_TIERS[0].threshold ? current : null;
};

export const ComboIndicator: React.FC = () => {
  const [combo, setCombo] = useState<number>(() => getFeedbackState().combo);
  const [pulseKey, setPulseKey] = useState<number>(0);
  const [milestone, setMilestone] = useState<number | null>(null);

  useEffect(() => {
    const unsubState = subscribeFeedback(() => {
      setCombo(getFeedbackState().combo);
    });
    const unsubPulse = subscribeFeedbackPulse((detail) => {
      if (detail.kind === 'correct') {
        setPulseKey((k) => k + 1);
      } else if (detail.kind === 'milestone') {
        setMilestone(detail.milestoneThreshold ?? null);
        setTimeout(() => setMilestone(null), 1200);
      }
    });
    return () => {
      unsubState();
      unsubPulse();
    };
  }, []);

  // 2 ve altı combo'da gösterme — sahneyi temiz tut
  if (combo < 2) return null;

  const multiplier = getComboMultiplier(combo);
  const tier = findTier(combo);
  const milestoneActive = milestone != null;

  return (
    <div
      className="pointer-events-none fixed right-4 top-20 z-30 select-none sm:right-6 sm:top-24"
      aria-live="polite"
      aria-label={`Combo ${combo}, ${tier?.label ?? '×1'}`}
    >
      <div
        key={pulseKey}
        className="kt-combo-pop flex flex-col items-end gap-1 rounded-[1rem] border px-3 py-2 backdrop-blur"
        style={{
          borderColor: 'color-mix(in srgb, var(--kt-brand) 40%, transparent)',
          background: 'color-mix(in srgb, var(--kt-surface) 82%, transparent)',
          boxShadow: milestoneActive
            ? '0 0 22px color-mix(in srgb, var(--kt-brand) 60%, transparent)'
            : 'var(--kt-shadow)'
        }}
      >
        <div className="flex items-baseline gap-1.5">
          <span
            className="font-black tabular-nums leading-none"
            style={{
              fontSize: milestoneActive ? '1.6rem' : '1.25rem',
              color: 'var(--kt-brand)',
              transition: 'font-size 200ms ease'
            }}
          >
            {combo}
          </span>
          <span
            className="text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: 'var(--kt-ink-muted)' }}
          >
            連続
          </span>
        </div>
        {tier && (
          <div
            className="text-[11px] font-black uppercase tracking-[0.12em]"
            style={{ color: 'var(--kt-brand)' }}
          >
            {tier.label}
          </div>
        )}
      </div>
      {milestoneActive && (
        <div
          className="mt-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]"
          style={{
            background: 'var(--kt-brand)',
            color: 'var(--kt-brand-on)'
          }}
        >
          {`連続 ×${milestone}`}
        </div>
      )}
      <style>{`
        @keyframes kt-combo-pop {
          0% { transform: scale(0.94); }
          40% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .kt-combo-pop {
          animation: kt-combo-pop 180ms ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .kt-combo-pop { animation: none; }
        }
      `}</style>
    </div>
  );
};
