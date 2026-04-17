import React from 'react';
import { KanaScript } from '../../features/kana/domain/kanaItem';

interface ScriptSwitcherProps {
  activeScript: KanaScript;
  onChange: (script: KanaScript) => void;
}

const scriptMeta: Record<KanaScript, { label: string; symbol: string }> = {
  hiragana: { label: 'Hiragana', symbol: 'あ' },
  katakana: { label: 'Katakana', symbol: 'ア' }
};

export const ScriptSwitcher: React.FC<ScriptSwitcherProps> = ({ activeScript, onChange }) => (
  <div className="rounded-[1.3rem] border border-[var(--kt-border-subtle)] bg-[rgba(255,255,255,0.03)] p-2">
    <div className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--kt-ink-subtle)]">
      Aktif Script
    </div>
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(scriptMeta).map(([script, meta]) => {
        const isActive = activeScript === script;

        return (
          <button
            key={script}
            type="button"
            onClick={() => onChange(script as KanaScript)}
            className={`rounded-[1rem] px-3 py-2 text-left transition ${
              isActive
                ? 'bg-[var(--kt-brand-soft)] text-[var(--kt-brand)]'
                : 'bg-transparent text-[var(--kt-ink-muted)] hover:bg-[rgba(255,255,255,0.04)]'
            }`}
          >
            <div className="font-jp text-xl font-black">{meta.symbol}</div>
            <div className="mt-1 text-xs font-bold uppercase tracking-[0.14em]">{meta.label}</div>
          </button>
        );
      })}
    </div>
  </div>
);
