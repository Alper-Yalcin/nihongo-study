import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  selectedTokens: string[];
  bankTokens: string[];
  checked: 'correct' | 'wrong' | null;
  onBankTap: (token: string) => void;
  onSelectedTap: (index: number) => void;
  explanation?: string;
  placeholder?: string;
}

export const TokenTray: React.FC<Props> = ({
  selectedTokens,
  bankTokens,
  checked,
  onBankTap,
  onSelectedTap,
  explanation,
  placeholder = 'Parçaları yerleştir...',
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  const trayBorder =
    checked === 'correct'
      ? 'border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)]'
      : checked === 'wrong'
        ? 'border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)]'
        : 'border-[var(--kt-border)] bg-[var(--kt-surface)]';

  const chipClasses =
    checked === 'correct'
      ? 'border-[var(--kt-accent-success)] text-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)]'
      : checked === 'wrong'
        ? 'border-[var(--kt-accent-danger)] text-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)]'
        : 'border-[var(--kt-border)] text-[var(--kt-ink-strong)] bg-[var(--kt-surface)] hover:-translate-y-0.5';

  return (
    <div className="space-y-3">
      {/* Answer tray */}
      <div className={`min-h-[3.25rem] rounded-[1rem] border-2 px-3 py-2.5 transition-colors duration-200 ${trayBorder}`}>
        <div className="flex min-h-8 flex-wrap gap-2">
          {selectedTokens.map((token, i) => (
            <button
              key={`sel-${i}`}
              type="button"
              onClick={() => onSelectedTap(i)}
              disabled={!!checked}
              className={`rounded-[0.6rem] border px-3 py-1.5 font-jp text-base font-black transition-all duration-100 ${chipClasses}`}
            >
              {token}
            </button>
          ))}
          {selectedTokens.length === 0 && (
            <span className="self-center text-sm text-[var(--kt-ink-subtle)]">
              {placeholder}
            </span>
          )}
        </div>
      </div>

      {/* Token bank */}
      <div className="flex flex-wrap justify-center gap-2 pt-1">
        {bankTokens.map((token, i) => (
          <button
            key={`bank-${token}-${i}`}
            type="button"
            onClick={() => onBankTap(token)}
            disabled={!!checked}
            className="rounded-[0.7rem] border border-[var(--kt-border)] bg-[var(--kt-surface-muted)] px-3 py-2 font-jp text-base font-black text-[var(--kt-ink-strong)] transition hover:-translate-y-0.5 disabled:opacity-25"
          >
            {token}
          </button>
        ))}
      </div>

      {/* Explanation toggle */}
      {explanation && (
        <div className="mt-1">
          <button
            type="button"
            onClick={() => setShowExplanation((v) => !v)}
            className="flex items-center gap-1 text-xs font-bold text-[var(--kt-ink-subtle)] underline"
          >
            Neden bu cevap?
            <ChevronDown
              size={12}
              className={`transition-transform ${showExplanation ? 'rotate-180' : ''}`}
            />
          </button>
          {showExplanation && (
            <div className="mt-2 rounded-[0.75rem] bg-[var(--kt-surface-muted)] px-4 py-3 text-sm font-bold text-[var(--kt-ink-muted)]">
              {explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
