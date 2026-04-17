import React from 'react';

interface JumpHereButtonProps {
  label: string;
  onClick: () => void;
}

export const JumpHereButton: React.FC<JumpHereButtonProps> = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-[1rem] border border-dashed border-[var(--kt-brand)]/45 bg-[rgba(255,255,255,0.03)] px-5 py-2 text-sm font-black uppercase tracking-[0.12em] text-[var(--kt-brand)] transition hover:border-[var(--kt-brand)] hover:bg-[var(--kt-brand-soft)]/20"
  >
    {label}
  </button>
);
