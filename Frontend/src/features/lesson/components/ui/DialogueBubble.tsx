import React from 'react';
import { Volume2 } from 'lucide-react';

interface NpcProps {
  speaker: 'npc';
  emoji?: string;
  japanese: string;
  meaning?: string;
  onAudio?: () => void;
  dimmed?: boolean;
}

interface UserProps {
  speaker: 'user';
  japanese: string;
  dimmed?: boolean;
}

type Props = NpcProps | UserProps;

export const DialogueBubble: React.FC<Props> = (props) => {
  if (props.speaker === 'npc') {
    return (
      <div className={`flex items-start gap-2.5 transition-opacity ${props.dimmed ? 'opacity-45' : ''}`}>
        {props.emoji && (
          <div className="mt-1 shrink-0 text-2xl leading-none">{props.emoji}</div>
        )}
        <div className="max-w-[88%]">
          <div className="inline-block rounded-[1.1rem] rounded-tl-sm bg-[var(--kt-surface)] px-4 py-3 shadow-[0_2px_14px_rgba(0,0,0,0.07)]">
            <div className="font-jp text-xl font-black leading-snug text-[var(--kt-ink-strong)]">
              {props.japanese}
            </div>
            {props.meaning && (
              <div className="mt-0.5 text-sm font-bold text-[var(--kt-ink-muted)]">
                {props.meaning}
              </div>
            )}
          </div>
          {props.onAudio && (
            <button
              type="button"
              onClick={props.onAudio}
              className="mt-1 ml-1 flex items-center gap-1 text-xs font-bold text-[var(--kt-accent-info)] opacity-65 hover:opacity-100 transition-opacity"
            >
              <Volume2 size={11} />
              Dinle
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex justify-end transition-opacity ${props.dimmed ? 'opacity-45' : ''}`}>
      <div className="max-w-[72%] rounded-[1.1rem] rounded-tr-sm bg-[var(--kt-brand-soft,var(--kt-surface-muted))] px-4 py-3 shadow-[0_2px_10px_color-mix(in_srgb,var(--kt-brand)_12%,transparent)]">
        <div className="font-jp text-base font-black text-[var(--kt-brand)]">
          {props.japanese}
        </div>
      </div>
    </div>
  );
};
