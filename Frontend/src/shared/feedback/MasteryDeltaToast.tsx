import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  MasteryDeltaEventDetail,
  subscribeMasteryDelta
} from './masterySession';
import { masteryBucket } from '../../data/masterySystem';
import { getKanaItemById } from '../../features/kana/data/kanaInventory';

const TOAST_VISIBLE_MS = 9000;
const MAX_ROWS = 8;

const bucketColor = (mastery: number): string => {
  switch (masteryBucket(mastery)) {
    case 'mastered':
      return 'var(--kt-accent-success)';
    case 'strong':
      return 'var(--kt-brand)';
    case 'warm':
      return 'var(--kt-accent-warning)';
    case 'learning':
      return 'var(--kt-accent-plum)';
    case 'cold':
    default:
      return 'var(--kt-ink-subtle)';
  }
};

export const MasteryDeltaToast: React.FC = () => {
  const [detail, setDetail] = useState<MasteryDeltaEventDetail | null>(null);

  useEffect(() => {
    const unsub = subscribeMasteryDelta((next) => {
      // Hiç delta yoksa veya hepsi 0 ise gösterme
      if (!next.deltas.length || next.totalDelta === 0) return;
      setDetail(next);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!detail) return;
    const t = window.setTimeout(() => setDetail(null), TOAST_VISIBLE_MS);
    return () => window.clearTimeout(t);
  }, [detail]);

  if (!detail) return null;

  const visible = detail.deltas.slice(0, MAX_ROWS);
  const hidden = detail.deltas.length - visible.length;

  return (
    <div
      className="kt-mastery-toast pointer-events-auto fixed inset-x-4 bottom-6 z-[55] mx-auto max-w-md rounded-[1.4rem] border p-4 shadow-[var(--kt-shadow-lg)] backdrop-blur"
      style={{
        borderColor: 'color-mix(in srgb, var(--kt-brand) 32%, transparent)',
        background: 'color-mix(in srgb, var(--kt-surface-raised) 92%, transparent)'
      }}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div
            className="text-[10px] font-black uppercase tracking-[0.18em]"
            style={{ color: 'var(--kt-ink-muted)' }}
          >
            Ustalık
          </div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span
              className="text-lg font-black"
              style={{ color: 'var(--kt-ink-strong)' }}
            >
              {detail.improvedCount} kana ilerledi
            </span>
            {detail.totalDelta > 0 && (
              <span
                className="text-sm font-bold"
                style={{ color: 'var(--kt-brand)' }}
              >
                +{detail.totalDelta}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDetail(null)}
          className="rounded-full p-1 transition hover:bg-[var(--kt-nav-item-hover)]"
          aria-label="Kapat"
        >
          <X size={16} />
        </button>
      </div>

      <ul className="mt-3 space-y-1.5">
        {visible.map((d) => {
          const item = getKanaItemById(d.kanaId);
          const char = item?.char ?? d.kanaId;
          const sign = d.delta > 0 ? '+' : '';
          return (
            <li
              key={d.kanaId}
              className="flex items-center justify-between gap-2 rounded-[0.7rem] px-2 py-1"
              style={{ background: 'var(--kt-surface-muted)' }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="font-black"
                  style={{
                    fontSize: '1.4rem',
                    lineHeight: 1,
                    fontFamily: 'var(--font-jp-current, inherit)',
                    color: 'var(--kt-ink-strong)'
                  }}
                >
                  {char}
                </span>
                <span
                  className="text-[10px] font-bold tabular-nums"
                  style={{ color: 'var(--kt-ink-muted)' }}
                >
                  {d.before} → {d.after}
                </span>
              </div>
              <span
                className="text-xs font-black tabular-nums"
                style={{
                  color: d.delta > 0 ? bucketColor(d.after) : 'var(--kt-ink-subtle)'
                }}
              >
                {sign}
                {d.delta}
              </span>
            </li>
          );
        })}
      </ul>

      {hidden > 0 && (
        <div
          className="mt-2 text-[11px] font-semibold"
          style={{ color: 'var(--kt-ink-muted)' }}
        >
          + {hidden} kana daha
        </div>
      )}

      <style>{`
        @keyframes kt-mastery-toast-in {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .kt-mastery-toast {
          animation: kt-mastery-toast-in 220ms ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .kt-mastery-toast { animation: none; }
        }
      `}</style>
    </div>
  );
};
