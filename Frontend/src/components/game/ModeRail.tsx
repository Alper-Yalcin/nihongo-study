import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ModeRailItem<T extends string> {
  id: T;
  label: string;
  count?: React.ReactNode;
  icon: LucideIcon;
  tone?: string;
}

interface ModeRailProps<T extends string> {
  items: ModeRailItem<T>[];
  activeId: T;
  onSelect: (id: T) => void;
  className?: string;
}

export const ModeRail = <T extends string>({
  items,
  activeId,
  onSelect,
  className = ''
}: ModeRailProps<T>) => (
  <div className={`flex gap-2 overflow-x-auto border-y border-[var(--kt-border-subtle)] py-3 ${className}`}>
    {items.map((item) => {
      const Icon = item.icon;
      const active = item.id === activeId;

      return (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className={`group flex min-w-max items-center gap-3 rounded-full px-3 py-2 transition ${
            active ? 'bg-[var(--kt-brand-soft)] text-[var(--kt-brand)]' : 'text-[var(--kt-ink-muted)] hover:bg-[var(--kt-surface-muted)]'
          }`}
        >
          <span className={`flex h-9 w-9 items-center justify-center rounded-full text-white ${item.tone ?? 'bg-[var(--kt-brand)]'}`}>
            <Icon size={18} />
          </span>
          <span className="text-left">
            <span className="block text-sm font-black text-[var(--kt-ink-strong)]">{item.label}</span>
            {item.count !== undefined ? <span className="block text-xs font-bold uppercase tracking-[0.12em] opacity-70">{item.count}</span> : null}
          </span>
        </button>
      );
    })}
  </div>
);
