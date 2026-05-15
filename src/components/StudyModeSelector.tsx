import React from 'react';

interface ModeOption<T extends string> {
  id: T;
  label: string;
  disabled?: boolean;
}

interface Props<T extends string> {
  label: string;
  value: T;
  options: ModeOption<T>[];
  onChange: (value: T) => void;
  gridClassName?: string;
}

export const StudyModeSelector = <T extends string>({
  label,
  value,
  options,
  onChange,
  gridClassName = ''
}: Props<T>) => (
  <div className="space-y-2">
    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
      {label}
    </div>
    <div className={`grid gap-2 rounded-xl bg-slate-100 p-1 ${gridClassName}`.trim()}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => !option.disabled && onChange(option.id)}
          disabled={option.disabled}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            value === option.id
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          } ${option.disabled ? 'cursor-not-allowed opacity-50 hover:text-slate-500' : ''}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);
