import React from 'react';

interface SpeechBubbleProps {
  children: React.ReactNode;
  accent?: 'brand' | 'warning' | 'success' | 'plum' | 'sunset' | 'info';
  className?: string;
}

const accentClass = {
  brand: 'border-[color:var(--kt-brand)]/35',
  warning: 'border-[color:var(--kt-accent-warning)]/35',
  success: 'border-[color:var(--kt-accent-success)]/35',
  plum: 'border-[color:var(--kt-accent-plum)]/35',
  sunset: 'border-[color:var(--kt-accent-sunset)]/35',
  info: 'border-[color:var(--kt-accent-info)]/35'
} as const;

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  children,
  accent = 'brand',
  className = ''
}) => (
  <div className={`relative inline-flex ${className}`}>
    <div
      className={`rounded-[1.4rem] border bg-[rgba(10,16,24,0.72)] px-5 py-4 text-sm font-semibold text-white shadow-[var(--kt-shadow-sm)] ${accentClass[accent]}`}
    >
      {children}
    </div>
    <span
      className={`absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 border-b border-l bg-[rgba(10,16,24,0.72)] ${accentClass[accent]}`}
    />
  </div>
);
