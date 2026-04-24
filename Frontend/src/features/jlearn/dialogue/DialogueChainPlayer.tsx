import React, { useEffect, useRef, useState } from 'react';
import { DialogueChain, DialogueLineVariant } from '../../../data/jlearn/jlearnTypes';
import { useDialogueChain } from './useDialogueChain';
import { isAnswerCorrect } from '../tasks/answerNormalizer';
import { getJLearnUserState, RelationshipStage, subscribeJLearnUserState } from '../debug/debugStore';

interface DialogueChainPlayerProps {
  chain: DialogueChain;
  onComplete: (missedCount: number) => void;
}

const AVATAR_COLORS: Record<string, string> = {
  'mrs-tanaka': 'bg-rose-400',
  'mr-tanaka': 'bg-cyan-500',
  'tanaka-sensei': 'bg-slate-500',
  'yamada-sensei': 'bg-indigo-500',
  yuki: 'bg-violet-400',
  keita: 'bg-orange-400',
  sora: 'bg-teal-400',
  obaasan: 'bg-amber-400',
};

export function normalizeSpeakerCharacterId(speaker: string): string | null {
  const normalized = speaker.trim().toLowerCase();
  if (normalized === 'mrs. tanaka' || normalized === 'mrs tanaka') return 'mrs-tanaka';
  if (normalized === 'mr. tanaka' || normalized === 'mr tanaka') return 'mr-tanaka';
  if (normalized === 'tanaka-sensei') return 'tanaka-sensei';
  if (normalized === 'yamada-sensei') return 'yamada-sensei';
  if (normalized === 'yuki') return 'yuki';
  if (normalized === 'keita') return 'keita';
  if (normalized === 'sora') return 'sora';
  if (normalized === 'obaasan') return 'obaasan';
  return null;
}

function avatarColor(speaker: string): string {
  const key = normalizeSpeakerCharacterId(speaker);
  return (key && AVATAR_COLORS[key]) ?? 'bg-[var(--kt-accent-info)]';
}

function speakerInitial(speaker: string): string {
  return speaker.charAt(0).toUpperCase();
}

function relationshipStageForSpeaker(
  speaker: string,
  relationshipLevels: Record<string, RelationshipStage>
): RelationshipStage | null {
  const characterId = normalizeSpeakerCharacterId(speaker);
  return characterId !== null ? (relationshipLevels[characterId] ?? 0) : null;
}

export function resolveDialogueLineForStage(
  line: DialogueLineVariant | undefined,
  relationshipStage: RelationshipStage | null
): string {
  if (!line) return '';
  if (typeof line === 'string') return line;
  if (relationshipStage !== null && line[relationshipStage]) {
    return line[relationshipStage] ?? '';
  }
  return line[0] ?? line[1] ?? line[2] ?? line[3] ?? '';
}

interface BubbleProps {
  speaker: string;
  line: string;
  lineRomaji?: string;
  translation?: string;
  relationshipStage: RelationshipStage | null;
  active?: boolean;
}

type SpeakerBubbleStyle = {
  avatar: string;
  bubble: string;
  name: string;
  sticker?: string;
};

function speakerBubbleStyle(
  relationshipStage: RelationshipStage | null,
  active = false
): SpeakerBubbleStyle {
  const activeRing = active ? 'shadow-[var(--kt-shadow-md)]' : 'shadow-[var(--kt-shadow-sm)]';

  if (relationshipStage === 0) {
    return {
      avatar: `rounded-[0.65rem] ring-2 ring-[var(--kt-ink-muted)] ${activeRing}`,
      bubble: `rounded-[0.9rem] border-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-4 py-3 ${activeRing}`,
      name: 'tracking-[0.2em] text-[var(--kt-ink-muted)]',
    };
  }

  if (relationshipStage === 2) {
    return {
      avatar: `rounded-full ring-4 ring-[var(--kt-accent-warning-soft)] ${activeRing}`,
      bubble: `rounded-[1.65rem] rounded-tl-[0.5rem] border border-[color:var(--kt-accent-warning)]/35 bg-[radial-gradient(circle_at_top_left,var(--kt-accent-warning-soft),transparent_45%),var(--kt-surface)] px-4 py-3 ${activeRing}`,
      name: 'tracking-[0.14em] text-[var(--kt-accent-warning)]',
    };
  }

  if (relationshipStage === 3) {
    return {
      avatar: `rotate-3 rounded-[1rem] ring-4 ring-[var(--kt-brand-soft)] ${activeRing}`,
      bubble: `relative -rotate-1 rounded-[1.85rem] rounded-tl-[0.7rem] border border-[color:var(--kt-accent-info)]/45 bg-[radial-gradient(circle_at_top_right,var(--kt-brand-soft),transparent_42%),var(--kt-surface)] px-4 py-3 ${activeRing}`,
      name: 'tracking-[0.12em] text-[var(--kt-accent-info)]',
      sticker: 'spark',
    };
  }

  return {
    avatar: `rounded-full ring-4 ring-[var(--kt-surface)] ${activeRing}`,
    bubble: `rounded-[1.25rem] rounded-tl-none border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] px-4 py-3 ${activeRing}`,
    name: 'tracking-[0.14em] text-[var(--kt-ink-muted)]',
  };
}

const SpeakerBubble: React.FC<BubbleProps> = ({
  speaker,
  line,
  lineRomaji,
  translation,
  relationshipStage,
  active = false,
}) => {
  const styles = speakerBubbleStyle(relationshipStage, active);

  return (
  <div className="flex items-start gap-4">
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center text-sm font-black text-white transition ${avatarColor(speaker)} ${styles.avatar}`}
    >
      {speakerInitial(speaker)}
    </div>
    <div className="max-w-[min(82%,34rem)]">
      <div className={`mb-1 text-[10px] font-black uppercase ${styles.name}`}>
        {speaker}
        {relationshipStage !== null && (
          <span className="ml-2 rounded-full border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] px-2 py-0.5 text-[9px] tracking-[0.12em] text-[var(--kt-ink-muted)]">
            stage {relationshipStage}
          </span>
        )}
      </div>
      <div className={styles.bubble}>
        {styles.sticker && (
          <span className="absolute -right-2 -top-2 rotate-6 rounded-full bg-[var(--kt-accent-info)] px-2 py-1 text-[10px] font-black text-white">
            *
          </span>
        )}
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
};

type DialogueHistoryEntry =
  | {
      kind: 'speaker';
      turnIndex: number;
      speaker: string;
      line: DialogueLineVariant | undefined;
      lineRomaji?: string;
      translation?: string;
    }
  | {
      kind: 'learner';
      turnIndex: number;
      given: string;
      correct: boolean;
      expectedAnswer?: string;
    };

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
      <div className="w-full max-w-[min(82%,34rem)]">
        <div className="mb-1 text-right text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
          You
        </div>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex gap-2 rounded-[1.25rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-2 shadow-[var(--kt-shadow-sm)]">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Type your response..."
              className="flex-1 rounded-[1rem] border border-transparent bg-[var(--kt-surface)] px-4 py-2.5 font-jp text-base text-[var(--kt-ink)] outline-none transition focus:border-[var(--kt-accent-info)] placeholder:text-[var(--kt-ink-muted)]"
            />
            <button
              type="submit"
              disabled={!value.trim()}
              className="rounded-[1rem] bg-[var(--kt-accent-info)] px-4 py-2.5 text-sm font-black text-white transition hover:opacity-90 disabled:opacity-40"
            >
              Send
            </button>
          </form>
        ) : (
          <div
            className={`rounded-[1.25rem] rounded-tr-none border px-4 py-3 shadow-[var(--kt-shadow-sm)] ${
              wasCorrect
                ? 'border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)] bg-opacity-10'
                : 'border-red-400 bg-red-500 bg-opacity-10'
            }`}
          >
            <p className="font-jp text-lg text-[var(--kt-ink-strong)]">{value}</p>
            {!wasCorrect && (
              <p className="mt-1 text-xs text-[var(--kt-ink-muted)]">
                Expected: {expectedAnswer}
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
  const [history, setHistory] = useState<DialogueHistoryEntry[]>([]);
  const [relationshipLevels, setRelationshipLevels] = useState(
    () => getJLearnUserState().relationshipLevels
  );
  const currentSpeakerRelationshipStage =
    currentTurn && !currentTurn.isLearnerTurn
      ? relationshipStageForSpeaker(currentTurn.speaker, relationshipLevels)
      : null;

  useEffect(
    () => subscribeJLearnUserState(() => setRelationshipLevels(getJLearnUserState().relationshipLevels)),
    []
  );

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
    const entry: DialogueHistoryEntry = {
      kind: 'speaker',
      turnIndex,
      speaker: currentTurn.speaker,
      line: currentTurn.line,
      lineRomaji: currentTurn.lineRomaji,
      translation: currentTurn.translation,
    };
    setHistory((h) => [...h, entry]);
    advance();
  };

  const renderHistoryEntry = (entry: DialogueHistoryEntry) => {
    if (entry.kind === 'speaker') {
      const relationshipStage = relationshipStageForSpeaker(entry.speaker, relationshipLevels);

      return (
        <SpeakerBubble
        key={`turn-${entry.turnIndex}`}
        speaker={entry.speaker}
        line={resolveDialogueLineForStage(entry.line, relationshipStage)}
        lineRomaji={entry.lineRomaji}
        translation={entry.translation}
        relationshipStage={relationshipStage}
        />
      );
    }

    return (
      <div
        key={`turn-${entry.turnIndex}`}
        className="flex justify-end"
      >
        <div className="max-w-[80%]">
          <div className="mb-1 text-right text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
            You
          </div>
          <div
            className={`rounded-[1rem] rounded-tr-none border px-4 py-3 ${
              entry.correct
                ? 'border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)] bg-opacity-10'
                : 'border-red-400 bg-red-500 bg-opacity-10'
            }`}
          >
            <p className="font-jp text-lg text-[var(--kt-ink-strong)]">{entry.given}</p>
            {!entry.correct && entry.expectedAnswer && (
              <p className="mt-1 text-xs text-[var(--kt-ink-muted)]">Expected: {entry.expectedAnswer}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const commitLearnerTurn = (given: string) => {
    if (!currentTurn || !currentTurn.isLearnerTurn) return;
    const correct = currentTurn.expectedAnswer
      ? isAnswerCorrect(given, currentTurn.expectedAnswer, currentTurn.acceptedAnswers)
      : true;
    const entry: DialogueHistoryEntry = {
      kind: 'learner',
      turnIndex,
      given,
      correct,
      expectedAnswer: currentTurn.expectedAnswer,
    };
    setHistory((h) => [...h, entry]);
    advance(given);
  };

  return (
    <div className="rounded-[1.8rem] border border-[var(--kt-border-subtle)] bg-[linear-gradient(180deg,var(--kt-surface-raised),var(--kt-surface))] p-4 shadow-[var(--kt-shadow-sm)] sm:p-5">
      {chain.title && (
        <div className="mb-4 flex items-center justify-between gap-4 rounded-[1.2rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] px-4 py-3">
          <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
          {chain.title}
          </span>
          <span className="rounded-full bg-[var(--kt-accent-info-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-accent-info)]">
            Dialogue
          </span>
        </div>
      )}

      <div className="space-y-4 rounded-[1.5rem] border border-[var(--kt-border-subtle)] bg-[radial-gradient(circle_at_top_right,var(--kt-accent-info-soft),transparent_32%),var(--kt-surface-page)] p-4 sm:p-5">
        {history.map(renderHistoryEntry)}

        {!isDone && currentTurn && (
          <>
            {!currentTurn.isLearnerTurn && (
              <div>
                <SpeakerBubble
                  speaker={currentTurn.speaker}
                  line={resolveDialogueLineForStage(currentTurn.line, currentSpeakerRelationshipStage)}
                  lineRomaji={currentTurn.lineRomaji}
                  translation={currentTurn.translation}
                  relationshipStage={currentSpeakerRelationshipStage}
                  active
                />
                <div className="ml-14">
                  <button
                    type="button"
                    onClick={commitSpeakerTurn}
                    className="mt-2 rounded-[0.8rem] border border-[var(--kt-border)] px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)] transition hover:bg-[var(--kt-nav-item-hover)]"
                  >
                    Continue
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
