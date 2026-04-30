import React from 'react';
import { Trophy } from 'lucide-react';

interface DanHallEntry {
  id: string;
  name: string;
  hanabira: number;
  isYou?: boolean;
}

interface DanHallProps {
  title: string;
  entries: DanHallEntry[];
}

export const DanHall: React.FC<DanHallProps> = ({ title, entries }) => (
  <section className="border-t border-[var(--kt-border-subtle)] pt-5">
    <div className="mb-3 flex items-center gap-2">
      <Trophy size={18} className="text-[var(--kt-dan-gold)]" />
      <h2 className="text-sm font-black uppercase tracking-[0.12em] text-[var(--kt-ink-strong)]">{title}</h2>
    </div>
    <ul>
      {entries.map((entry, index) => (
        <li key={entry.id} className="flex items-center justify-between border-b border-[var(--kt-border-subtle)] py-3">
          <div className="flex items-center gap-3">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black"
              style={{
                background: index < 3 ? 'var(--kt-dan-gold)' : 'var(--kt-surface-muted)',
                color: index < 3 ? 'var(--kt-dan-ink)' : 'var(--kt-ink-muted)'
              }}
            >
              {index + 1}
            </span>
            <span className="text-sm font-bold text-[var(--kt-ink-strong)]">{entry.name}</span>
            {entry.isYou ? <span className="rounded-full bg-[var(--kt-brand)] px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.16em] text-[var(--kt-brand-on)]">you</span> : null}
          </div>
          <span className="text-xs font-bold tabular-nums text-[var(--kt-ink-muted)]">Hanabira {entry.hanabira}</span>
        </li>
      ))}
    </ul>
  </section>
);
