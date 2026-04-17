import React from 'react';
import { Badge } from '../../shared/ui';

interface QuestCardProps {
  title: string;
  progress: number;
  goal: number;
  reward: string;
  completed?: boolean;
  accent?: 'brand' | 'warning' | 'success' | 'plum' | 'sunset' | 'info';
  action?: React.ReactNode;
}

const accentClass = {
  brand: 'bg-[var(--kt-brand)]',
  warning: 'bg-[var(--kt-accent-warning)]',
  success: 'bg-[var(--kt-accent-success)]',
  plum: 'bg-[var(--kt-accent-plum)]',
  sunset: 'bg-[var(--kt-accent-sunset)]',
  info: 'bg-[var(--kt-accent-info)]'
} as const;

export const QuestCard: React.FC<QuestCardProps> = ({
  title,
  progress,
  goal,
  reward,
  completed = false,
  accent = 'brand',
  action
}) => {
  const percent = goal > 0 ? Math.round((progress / goal) * 100) : 0;

  return (
    <article className="rounded-[1.4rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-5 shadow-[var(--kt-shadow-sm)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--kt-ink-strong)]">{title}</h3>
          <p className="mt-1 text-sm text-[var(--kt-ink-muted)]">{reward}</p>
        </div>
        <Badge tone={completed ? 'success' : 'neutral'}>
          {completed ? 'Tamam' : `${progress} / ${goal}`}
        </Badge>
      </div>
      <div className="mt-4 h-3 rounded-full bg-[var(--kt-surface-sunken)]">
        <div
          className={`h-3 rounded-full ${accentClass[accent]}`}
          style={{ width: `${Math.max(completed ? 100 : 6, Math.min(100, percent))}%` }}
        />
      </div>
      {action && <div className="mt-4">{action}</div>}
    </article>
  );
};
