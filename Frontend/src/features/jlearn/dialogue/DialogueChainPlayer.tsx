import React, { useEffect, useRef, useState } from 'react';
import { DialogueChain } from '../../../data/jlearn/jlearnTypes';
import { useDialogueChain } from './useDialogueChain';
import { isAnswerCorrect } from '../tasks/answerNormalizer';

interface DialogueChainPlayerProps {
  chain: DialogueChain;
  onComplete: (missedCount: number) => void;
}

const AVATAR_COLORS: Record<string, string> = {
  'mrs-tanaka': 'bg-rose-400',
  'tanaka-sensei': 'bg-slate-500',
  yuki: 'bg-violet-400',
  keita: 'bg-orange-400',
  sora: 'bg-teal-400',
  obaasan: 'bg-amber-400',
};

function avatarColor(speaker: string): string {
  const key = speaker.toLowerCase().replace(/\s+/g, '-');
  return AVATAR_COLORS[key] ?? 'bg-[var(--kt-accent-info)]';
}

function speakerInitial(speaker: string): string {
  return speaker.charAt(0).toUpperCase();
}

interface BubbleProps {
  speaker: string;
  line: string;
  lineRomaji?: string;
  translation?: string;
}

const SpeakerBubble: React.FC<BubbleProps> = ({ speaker, line, lineRomaji, translation }) => (
  <div className="flex items-start gap-3">
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${avatarColor(speaker)}`}
    >
      {speakerInitial(speaker)}
    </div>
    <div className="max-w-[80%]">
      <div className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
        {speaker}
      </div>
      <div className="rounded-[1rem] rounded-tl-none border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] px-4 py-3">
        <p className="font-jp text-lg text-[var(--kt-ink-strong)]">{line}</p>
        {lineRomaji && (
          <p className="mt-0.5 text-xs text-[var(--kt-ink-muted)]">{lineRomaji}</p>
        )}
        {translation && (
          <p className="mt-1 text-xs italic text-[var(--kt-ink-muted)]">{translation}</p>
        )}
      </div>
    </div>
  </div>
);

interface LearnerInputProps {
  expectedAnswer: string;
  acceptedAnswers?: string[];
  onSubmit: (given: string) => void;
}

const LearnerInput: React.FC<LearnerInputProps> = ({ expectedAnswer, acceptedAnswers, onSubmit }) => {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim() || submitted) return;
    const correct = isAnswerCorrect(value, expectedAnswer, acceptedAnswers);
    setWasCorrect(correct);
    setSubmitted(true);
    setTimeout(() => onSubmit(value), 700);
  };

  return (
    <div className="flex justify-end">
      <div className="w-full max-w-[80%]">
        <div className="mb-1 text-right text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
          You
        </div>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type your response…"
              className="flex-1 rounded-[1rem] border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] px-4 py-2.5 font-jp text-base text-[var(--kt-ink)] outline-none transition focus:border-[var(--kt-accent-info)] placeholder:text-[var(--kt-ink-muted)]"
            />
            <button
              type="submit"
              disabled={!value.trim()}
              className="rounded-[1rem] bg-[var(--kt-accent-info)] px-4 py-2.5 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-40"
            >
              →
            </button>
          </form>
        ) : (
          <div
            className={`rounded-[1rem] rounded-tr-none border px-4 py-3 ${
              wasCorrect
                ? 'border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)] bg-opacity-10'
                : 'border-red-400 bg-red-500 bg-opacity-10'
            }`}
          >
            <p className="font-jp text-lg text-[var(--kt-ink-strong)]">{value}</p>
            {!wasCorrect && (
              <p className="mt-1 text-xs text-[var(--kt-ink-muted)]">
                ✓ {expectedAnswer}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const DialogueChainPlayer: React.FC<DialogueChainPlayerProps> = ({ chain, onComplete }) => {
  const { currentTurn, turnIndex, isDone, missedTurns, advance } = useDialogueChain(chain);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [history, setHistory] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isDone]);

  useEffect(() => {
    if (isDone) {
      onComplete(missedTurns.length);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone]);

  const commitSpeakerTurn = () => {
    if (!currentTurn || currentTurn.isLearnerTurn) return;
    const node = (
      <SpeakerBubble
        key={`turn-${turnIndex}`}
        speaker={currentTurn.speaker}
        line={currentTurn.line ?? ''}
        lineRomaji={currentTurn.lineRomaji}
        translation={currentTurn.translation}
      />
    );
    setHistory((h) => [...h, node]);
    advance();
  };

  const commitLearnerTurn = (given: string) => {
    if (!currentTurn || !currentTurn.isLearnerTurn) return;
    const correct = currentTurn.expectedAnswer
      ? isAnswerCorrect(given, currentTurn.expectedAnswer, currentTurn.acceptedAnswers)
      : true;
    const node = (
      <div
        key={`turn-${turnIndex}`}
        className={`flex justify-end`}
      >
        <div className="max-w-[80%]">
          <div className="mb-1 text-right text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">You</div>
          <div
            className={`rounded-[1rem] rounded-tr-none border px-4 py-3 ${
              correct
                ? 'border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)] bg-opacity-10'
                : 'border-red-400 bg-red-500 bg-opacity-10'
            }`}
          >
            <p className="font-jp text-lg text-[var(--kt-ink-strong)]">{given}</p>
            {!correct && currentTurn.expectedAnswer && (
              <p className="mt-1 text-xs text-[var(--kt-ink-muted)]">✓ {currentTurn.expectedAnswer}</p>
            )}
          </div>
        </div>
      </div>
    );
    setHistory((h) => [...h, node]);
    advance(given);
  };

  return (
    <div>
      {chain.title && (
        <div className="mb-4 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
          {chain.title}
        </div>
      )}

      <div className="space-y-4 rounded-[1.4rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-page)] p-5">
        {/* History */}
        {history}

        {/* Current turn */}
        {!isDone && currentTurn && (
          <>
            {!currentTurn.isLearnerTurn && (
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${avatarColor(currentTurn.speaker)}`}
                >
                  {speakerInitial(currentTurn.speaker)}
                </div>
                <div className="max-w-[80%]">
                  <div className="mb-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
                    {currentTurn.speaker}
                  </div>
                  <div className="rounded-[1rem] rounded-tl-none border border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)] bg-opacity-5 px-4 py-3">
                    <p className="font-jp text-lg text-[var(--kt-ink-strong)]">{currentTurn.line}</p>
                    {currentTurn.lineRomaji && (
                      <p className="mt-0.5 text-xs text-[var(--kt-ink-muted)]">{currentTurn.lineRomaji}</p>
                    )}
                    {currentTurn.translation && (
                      <p className="mt-1 text-xs italic text-[var(--kt-ink-muted)]">{currentTurn.translation}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={commitSpeakerTurn}
                    className="mt-2 rounded-[0.8rem] border border-[var(--kt-border)] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)] transition hover:bg-[var(--kt-nav-item-hover)]"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {currentTurn.isLearnerTurn && (
              <LearnerInput
                key={`input-${turnIndex}`}
                expectedAnswer={currentTurn.expectedAnswer ?? ''}
                acceptedAnswers={currentTurn.acceptedAnswers}
                onSubmit={commitLearnerTurn}
              />
            )}
          </>
        )}

        {isDone && (
          <div className="rounded-[1rem] border border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)] bg-opacity-10 p-3 text-center text-sm font-black text-[var(--kt-accent-info)]">
            Conversation complete
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
