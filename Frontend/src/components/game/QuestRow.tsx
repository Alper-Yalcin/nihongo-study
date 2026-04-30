import React from 'react';
import { CheckCircle2, Gift, Circle } from 'lucide-react';

interface QuestRowProps {
  title: string;
  reward: string;
  progress: number;
  goal: number;
  completed: boolean;
  claimed?: boolean;
  claimLabel: string;
  claimedLabel: string;
  onClaim?: () => void;
  accent?: string;
}

export const QuestRow: React.FC<QuestRowProps> = ({
  title,
  reward,
  progress,
  goal,
  completed,
  claimed = false,
  claimLabel,
  claimedLabel,
  onClaim,
  accent = 'var(--kt-brand)'
}) => {
  const percent = goal > 0 ? Math.max(6, Math.min(100, Math.round((progress / goal) * 100))) : 0;

  return (
    <article className="grid gap-3 border-b border-[var(--kt-border-subtle)] py-4 md:grid-cols-[auto_minmax(0,1fr)_12rem_auto] md:items-center">
      <div className="text-[var(--kt-accent-success)]">
        {completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
      </div>
      <div>
        <h3 className="text-base font-black text-[var(--kt-ink-strong)]">{title}</h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--kt-ink-muted)]">{reward}</p>
      </div>
      <div>
        <div className="h-2.5 overflow-hidden rounded-full bg-[var(--kt-progress-track)]">
          <div className="h-full rounded-full transition-all" style={{ width: `${completed ? 100 : percent}%`, background: accent }} />
        </div>
        <div className="mt-1 text-right text-[10px] font-black uppercase tracking-[0.12em] text-[var(--kt-ink-subtle)]">
          {progress}/{goal}
        </div>
      </div>
      {completed ? (
        <button
          type="button"
          disabled={claimed || !onClaim}
          onClick={onClaim}
          className="justify-self-start rounded-full bg-[var(--kt-brand-soft)] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[var(--kt-brand)] transition hover:bg-[var(--kt-brand-soft-strong)] disabled:opacity-45 md:justify-self-end"
        >
          <Gift size={13} className="mr-1 inline" />
          {claimed ? claimedLabel : claimLabel}
        </button>
      ) : null}
    </article>
  );
};
