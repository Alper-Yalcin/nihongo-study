import React from 'react';

interface Props {
  tone: 'correct' | 'wrong';
  npcMessage: string;
  npcEmoji?: string;
  smartFeedback?: string;
  echoWord?: { japanese: string; meaning: string };
  onContinue: () => void;
}

const NpcLine: React.FC<{ message: string; tone: 'correct' | 'wrong' }> = ({ message, tone }) => {
  const spaceIdx = message.indexOf(' ');
  const hasJP = spaceIdx > 0 && /[぀-ヿ一-鿿！。、]/.test(message.slice(0, spaceIdx));
  const color =
    tone === 'correct' ? 'text-[var(--kt-accent-success)]' : 'text-[var(--kt-accent-danger)]';

  if (hasJP) {
    return (
      <span>
        <span className={`font-jp text-lg font-black ${color}`}>
          {message.slice(0, spaceIdx)}
        </span>{' '}
        <span className={`text-sm font-bold ${color} opacity-80`}>
          {message.slice(spaceIdx + 1)}
        </span>
      </span>
    );
  }
  return <span className={`font-black ${color}`}>{message}</span>;
};

export const FloatingFeedback: React.FC<Props> = ({
  tone,
  npcMessage,
  npcEmoji,
  smartFeedback,
  echoWord,
  onContinue,
}) => {
  const isCorrect = tone === 'correct';

  return (
    <div
      className={`border-t-[3px] px-5 pb-8 pt-4 transition-colors ${
        isCorrect
          ? 'border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)]'
          : 'border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)]'
      }`}
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        {/* NPC message */}
        <div className="flex min-w-0 flex-1 items-start gap-2.5">
          {npcEmoji && (
            <span className="mt-0.5 shrink-0 text-xl leading-none">{npcEmoji}</span>
          )}
          <div className="min-w-0">
            <NpcLine message={npcMessage} tone={tone} />
            {isCorrect && echoWord && (
              <p className="mt-0.5 text-sm font-bold text-[var(--kt-accent-success)]">
                <span className="font-jp">{echoWord.japanese}</span>
                {' — '}
                {echoWord.meaning}
              </p>
            )}
            {!isCorrect && smartFeedback && (
              <p className="mt-0.5 text-sm font-bold text-[var(--kt-accent-danger)] opacity-90">
                {smartFeedback}
              </p>
            )}
          </div>
        </div>
        {/* Continue button */}
        <button
          type="button"
          onClick={onContinue}
          className={`shrink-0 rounded-[0.9rem] px-6 py-3 text-sm font-black uppercase tracking-[0.07em] text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)] transition hover:opacity-90 ${
            isCorrect ? 'bg-[var(--kt-accent-success)]' : 'bg-[var(--kt-accent-danger)]'
          }`}
        >
          Devam et
        </button>
      </div>
    </div>
  );
};
