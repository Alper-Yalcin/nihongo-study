import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Lesson, LearnedWord, NpcCharacter } from '../lessonTypes';
import { useLessonFlow } from '../useLessonFlow';
import { stopAudio } from '../lessonAudio';
import { LessonComplete } from './LessonComplete';
import { TeachCard } from './exercises/TeachCard';
import { InstantRecognition } from './exercises/InstantRecognition';
import { AudioReinforcement } from './exercises/AudioReinforcement';
import { KanaRecognition } from './exercises/KanaRecognition';
import { AudioToKana } from './exercises/AudioToKana';
import { AudioToMeaning } from './exercises/AudioToMeaning';
import { VisualContext } from './exercises/VisualContext';
import { GuidedResponse } from './exercises/GuidedResponse';
import { TokenBuild } from './exercises/TokenBuild';
import { ListeningBuild } from './exercises/ListeningBuild';
import { FillBlank } from './exercises/FillBlank';
import { ConversationChain } from './exercises/ConversationChain';
import { ListeningConversation } from './exercises/ListeningConversation';
import { FastRecall } from './exercises/FastRecall';
import { NpcReaction } from './exercises/NpcReaction';
import { LessonCorrectBurst } from './LessonCorrectBurst';
import { FloatingFeedback } from './ui/FloatingFeedback';
import type { ThemeMode } from '../../../data/appPreferences';

interface Props {
  lesson: Lesson;
  themeMode: ThemeMode;
}

// Two-step select → check pattern
const KONTROL_ET_TYPES = new Set([
  'instant_recognition',
  'kana_recognition',
  'audio_to_kana',
  'audio_to_meaning',
  'guided_response',
  'fill_blank',
]);

// No sticky footer — these handle their own flow
const AUTO_ADVANCE_TYPES = new Set([
  'teach_card',
  'audio_reinforcement',
  'visual_context',
  'npc_reaction',
]);

const EXERCISE_PHASE: Record<string, string> = {
  teach_card: '🔍 Keşif',
  audio_reinforcement: '👂 Dinleme',
  audio_to_kana: '👂 Dinleme',
  audio_to_meaning: '👂 Dinleme',
  instant_recognition: '🧠 Tanıma',
  kana_recognition: '🧠 Tanıma',
  guided_response: '✏️ Pratik',
  fill_blank: '✏️ Pratik',
  token_build: '✏️ Pratik',
  listening_build: '✏️ Pratik',
  conversation_chain: '💬 Konuşma',
  listening_conversation: '💬 Konuşma',
  fast_recall: '⚡ Hatırlama',
};

const NPC_CORRECT = [
  'すごい！ Harika!',
  'やった！ Başardın!',
  'いいね！ Güzel!',
  '完璧！ Mükemmel!',
  'よし！ Evet!',
];
const NPC_WRONG = ['惜しい！ Neredeyse.', 'もう一度！ Bir daha.', 'ゆっくり。 Sabırlı ol.'];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const DEFAULT_NPC: NpcCharacter = { name: 'Hana', emoji: '🦊' };
const MAX_LIVES = 5;

type FeedbackState = {
  tone: 'correct' | 'wrong';
  npcMessage: string;
  smartFeedback?: string;
  explanation?: string;
  echoWord?: LearnedWord;
} | null;

export const LessonRunner: React.FC<Props> = ({ lesson, themeMode }) => {
  const navigate = useNavigate();
  const flow = useLessonFlow(lesson.id, lesson.exercises);
  const [feedback, setFeedback] = React.useState<FeedbackState>(null);
  const [pendingCorrect, setPendingCorrect] = React.useState<boolean | null>(null);
  const [checked, setChecked] = React.useState(false);
  const [lives, setLives] = React.useState(MAX_LIVES);
  const [streak, setStreak] = React.useState(0);
  const [showBurst, setShowBurst] = React.useState(false);
  const burstTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const npc = lesson.npc ?? DEFAULT_NPC;
  const { currentExercise, progressPct, isComplete, result } = flow;

  useEffect(() => {
    setPendingCorrect(null);
    setChecked(false);
  }, [currentExercise?.id]);

  useEffect(() => () => stopAudio(), []);

  useEffect(
    () => () => {
      if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
    },
    [],
  );

  if (isComplete && result) {
    return (
      <LessonComplete
        result={result}
        themeMode={themeMode}
        learnedWords={lesson.learnedWords}
        npc={npc}
      />
    );
  }

  const isAutoAdvance = currentExercise ? AUTO_ADVANCE_TYPES.has(currentExercise.type) : false;
  const isKontrolEt = currentExercise ? KONTROL_ET_TYPES.has(currentExercise.type) : false;
  const phaseLabel = currentExercise ? (EXERCISE_PHASE[currentExercise.type] ?? '') : '';

  const handleCorrect = () => {
    flow.onCorrect();
    const ex = currentExercise;
    if (!ex) return;

    if (AUTO_ADVANCE_TYPES.has(ex.type)) {
      flow.onNext();
      return;
    }

    setStreak((s) => s + 1);

    const exJapanese = 'japanese' in ex ? (ex as { japanese: string }).japanese : undefined;
    const echoWord = exJapanese
      ? lesson.learnedWords.find((w) => exJapanese.includes(w.japanese))
      : undefined;

    if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
    setShowBurst(true);
    burstTimerRef.current = setTimeout(() => setShowBurst(false), 1400);

    setFeedback({
      tone: 'correct',
      npcMessage: pickRandom(NPC_CORRECT),
      smartFeedback: ex.smartFeedback,
      explanation: ex.explanation,
      echoWord,
    });
  };

  const handleWrong = () => {
    flow.onWrong();
    const ex = currentExercise;
    if (!ex) return;

    setStreak(0);
    setLives((l) => Math.max(0, l - 1));
    setFeedback({
      tone: 'wrong',
      npcMessage: pickRandom(NPC_WRONG),
      smartFeedback: ex.smartFeedback,
      explanation: ex.explanation,
    });
  };

  const handleContinue = () => {
    setFeedback(null);
    flow.onNext();
  };

  const handleKontrolEt = () => {
    if (pendingCorrect === null) return;
    setChecked(true);
    if (pendingCorrect) handleCorrect();
    else handleWrong();
  };

  const renderExercise = () => {
    if (!currentExercise) return null;
    const directProps = { onCorrect: handleCorrect, onWrong: handleWrong };
    const kontrolEtProps = { onAnswerSelect: setPendingCorrect, checked };

    switch (currentExercise.type) {
      case 'teach_card':
        return (
          <TeachCard key={currentExercise.id} exercise={currentExercise} onContinue={handleCorrect} />
        );
      case 'instant_recognition':
        return (
          <InstantRecognition key={currentExercise.id} exercise={currentExercise} {...kontrolEtProps} />
        );
      case 'audio_reinforcement':
        return (
          <AudioReinforcement key={currentExercise.id} exercise={currentExercise} onCorrect={handleCorrect} />
        );
      case 'kana_recognition':
        return (
          <KanaRecognition key={currentExercise.id} exercise={currentExercise} {...kontrolEtProps} />
        );
      case 'audio_to_kana':
        return (
          <AudioToKana key={currentExercise.id} exercise={currentExercise} {...kontrolEtProps} />
        );
      case 'audio_to_meaning':
        return (
          <AudioToMeaning key={currentExercise.id} exercise={currentExercise} {...kontrolEtProps} />
        );
      case 'visual_context':
        return (
          <VisualContext key={currentExercise.id} exercise={currentExercise} onCorrect={handleCorrect} />
        );
      case 'guided_response':
        return (
          <GuidedResponse key={currentExercise.id} exercise={currentExercise} {...kontrolEtProps} />
        );
      case 'token_build':
        return (
          <TokenBuild key={currentExercise.id} exercise={currentExercise} {...directProps} />
        );
      case 'listening_build':
        return (
          <ListeningBuild key={currentExercise.id} exercise={currentExercise} {...directProps} />
        );
      case 'fill_blank':
        return (
          <FillBlank key={currentExercise.id} exercise={currentExercise} {...kontrolEtProps} />
        );
      case 'conversation_chain':
        return (
          <ConversationChain
            key={currentExercise.id}
            exercise={currentExercise}
            memory={flow.conversationMemory}
            onMemoryUpdate={flow.updateMemory}
            onCorrect={handleCorrect}
            onWrong={handleWrong}
          />
        );
      case 'listening_conversation':
        return (
          <ListeningConversation key={currentExercise.id} exercise={currentExercise} {...directProps} />
        );
      case 'fast_recall':
        return (
          <FastRecall key={currentExercise.id} exercise={currentExercise} {...directProps} />
        );
      case 'npc_reaction':
        return (
          <NpcReaction
            key={currentExercise.id}
            exercise={currentExercise}
            onCorrect={handleCorrect}
            npc={npc}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden px-5 py-5 text-[var(--kt-ink)]">
      {showBurst && <LessonCorrectBurst themeMode={themeMode} />}

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex max-w-2xl items-center gap-3">
        <button
          type="button"
          onClick={() => {
            stopAudio();
            navigate('/learn');
          }}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--kt-ink-subtle)] transition hover:bg-[var(--kt-surface-muted)]"
          aria-label="Dersi kapat"
        >
          <X size={20} />
        </button>

        {/* Progress bar — slightly thicker, softer */}
        <div className="relative h-3.5 flex-1 overflow-hidden rounded-full bg-[var(--kt-surface-muted)]">
          <div
            className="h-full rounded-full bg-[var(--kt-brand)] transition-all duration-500"
            style={{ width: `${Math.max(2, progressPct)}%` }}
          />
        </div>

        {/* Hearts */}
        <div className="flex shrink-0 items-center gap-0.5">
          {Array.from({ length: MAX_LIVES }, (_, i) => (
            <span
              key={i}
              className={`text-base leading-none transition ${
                i < lives ? 'text-[var(--kt-accent-danger)]' : 'text-[var(--kt-border)]'
              }`}
            >
              ♥
            </span>
          ))}
        </div>
      </header>

      {/* Scene / phase row */}
      <div className="mx-auto mt-2 max-w-2xl flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-base leading-none">{npc.emoji}</span>
          {lesson.location && (
            <span className="text-xs font-bold text-[var(--kt-ink-subtle)]">{lesson.location}</span>
          )}
        </div>
        {phaseLabel && (
          <span className="rounded-full bg-[var(--kt-surface-muted)] px-2.5 py-0.5 text-[0.65rem] font-black uppercase tracking-widest text-[var(--kt-ink-subtle)]">
            {phaseLabel}
          </span>
        )}
      </div>

      {/* Streak badge */}
      {streak >= 3 && !feedback && (
        <div className="mx-auto mt-2 max-w-2xl">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--kt-accent-success-soft)] px-3 py-0.5 text-xs font-black uppercase tracking-wider text-[var(--kt-accent-success)]">
            🔥 {streak} üst üste
          </span>
        </div>
      )}

      {flow.isReviewPhase && (
        <div className="mx-auto mt-2 max-w-2xl rounded-[0.7rem] bg-[var(--kt-surface-muted)] px-4 py-1.5 text-center text-[0.65rem] font-black uppercase tracking-widest text-[var(--kt-ink-subtle)]">
          Tekrar turu — zorlandıkların geliyor
        </div>
      )}

      {/* Exercise content */}
      <main className="relative z-10 mx-auto mt-8 max-w-2xl pb-36">
        {renderExercise()}
      </main>

      {/* Bottom dock */}
      {!isAutoAdvance && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          {feedback ? (
            <FloatingFeedback
              tone={feedback.tone}
              npcMessage={feedback.npcMessage}
              npcEmoji={npc.emoji}
              smartFeedback={feedback.smartFeedback}
              echoWord={feedback.echoWord}
              onContinue={handleContinue}
            />
          ) : isKontrolEt ? (
            <div className="bg-[var(--kt-surface)] px-5 pb-8 pt-3 shadow-[0_-1px_0_var(--kt-border)]">
              <div className="mx-auto max-w-2xl">
                <button
                  type="button"
                  onClick={handleKontrolEt}
                  disabled={pendingCorrect === null}
                  className={`w-full rounded-[0.95rem] px-5 py-4 text-sm font-black uppercase tracking-[0.08em] transition ${
                    pendingCorrect !== null
                      ? 'bg-[var(--kt-accent-success)] text-white shadow-[inset_0_-4px_0_color-mix(in_srgb,var(--kt-accent-success)_70%,black)] hover:opacity-90'
                      : 'cursor-not-allowed bg-[var(--kt-surface-muted)] text-[var(--kt-ink-subtle)]'
                  }`}
                >
                  Kontrol et
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
