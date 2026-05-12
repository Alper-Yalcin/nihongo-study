import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

interface Props {
  onPlay: () => void;
  onPlaySlow?: () => void;
}

export const AudioOrb: React.FC<Props> = ({ onPlay, onPlaySlow }) => {
  const [pulsing, setPulsing] = useState(false);

  const trigger = (fn: () => void, duration = 1600) => {
    setPulsing(true);
    fn();
    setTimeout(() => setPulsing(false), duration);
  };

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative">
        {pulsing && (
          <span className="absolute inset-0 rounded-full bg-[var(--kt-accent-info)] opacity-20 animate-ping" />
        )}
        <button
          type="button"
          onClick={() => trigger(onPlay)}
          className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-[var(--kt-accent-info)] text-white shadow-[0_6px_24px_color-mix(in_srgb,var(--kt-accent-info)_38%,transparent)] transition hover:scale-105 active:scale-95"
          aria-label="Sesi çal"
        >
          <Volume2 size={34} strokeWidth={2} />
        </button>
      </div>
      {onPlaySlow && (
        <button
          type="button"
          onClick={() => trigger(onPlaySlow, 2200)}
          className="flex items-center gap-1 rounded-full bg-[var(--kt-surface-muted)] px-3 py-1 text-xs font-black text-[var(--kt-ink-subtle)] transition hover:text-[var(--kt-ink-muted)]"
          aria-label="Yavaş çal"
        >
          <Volume2 size={11} />
          Yavaş
        </button>
      )}
    </div>
  );
};
