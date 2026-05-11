import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Lesson, LearnedWord } from '../lessonTypes';
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

// No footer — these handle their own continue
const AUTO_ADVANCE_TYPES = new Set([
  'teach_card',
  'audio_reinforcement',
  'visual_context',
  'npc_reaction',
]);

type FeedbackState = {
  tone: 'correct' | 'wrong';
  smartFeedback?: string;
  explanation?: string;
  echoWord?: LearnedWord;
} | null;

const MAX_LIVES = 5;

export const LessonRunner: React.FC<Props> = ({ lesson, themeMode }) => {
  const navigate = useNavigate();
  const flow = useLessonFlow(lesson.id, lesson.exercises);
  const [feedback, setFeedback] = React.useState<FeedbackState>(null);
  const [pendingCorrect, setPendingCorrect] = React.useState<boolean | null>(null);
  const [checked, setChecked] = React.useState(false);
  const [lives, setLives] = React.useState(MAX_LIVES);
  const [streak, setStreak] = React.useState(0);

  const { currentExercise, progressPct, isComplete, result } = flow;

  // Reset interaction state on each new exercise
  useEffect(() => {
    setPendingCorrect(null);
    setChecked(false);
  }, [currentExercise?.id]);

  useEffect(() => () => stopAudio(), []);

  if (isComplete && result) {
    return (
      <LessonComplete
        result={result}
        themeMode={themeMode}
        learnedWords={lesson.learnedWords}
      />
    );
  }

  const isAutoAdvance = currentExercise ? AUTO_ADVANCE_TYPES.has(currentExercise.type) : false;
  const isKontrolEt = currentExercise ? KONTROL_ET_TYPES.has(currentExercise.type) : false;

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

    setFeedback({ tone: 'correct', smartFeedback: ex.smartFeedback, explanation: ex.explanation, echoWord });
  };

  const handleWrong = () => {
    flow.onWrong();
    const ex = currentExercise;
    if (!ex) return;

    setStreak(0);
    setLives((l) => Math.max(0, l - 1));
    setFeedback({ tone: 'wrong', smartFeedback: ex.smartFeedback, explanation: ex.explanation });
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
        return <TeachCard key={currentExercise.id} exercise={currentExercise} onContinue={handleCorrect} />;
      case 'instant_recognition':
        return <InstantRecognition key={currentExercise.id} exercise={currentExercise} {...kontrolEtProps} />;
      case 'audio_reinforcement':
        return <AudioReinforcement key={currentExercise.id} exercise={currentExercise} onCorrect={handleCorrect} />;
      case 'kana_recognition':
        return <KanaRecognition key={currentExercise.id} exercise={currentExercise} {...kontrolEtProps} />;
      case 'audio_to_kana':
        return <AudioToKana key={currentExercise.id} exercise={currentExercise} {...kontrolEtProps} />;
      case 'audio_to_meaning':
        return <AudioToMeaning key={currentExercise.id} exercise={currentExercise} {...kontrolEtProps} />;
      case 'visual_context':
        return <VisualContext key={currentExercise.id} exercise={currentExercise} onCorrect={handleCorrect} />;
      case 'guided_response':
        return <GuidedResponse key={currentExercise.id} exercise={currentExercise} {...kontrolEtProps} />;
      case 'token_build':
        return <TokenBuild key={currentExercise.id} exercise={currentExercise} {...directProps} />;
      case 'listening_build':
        return <ListeningBuild key={currentExercise.id} exercise={currentExercise} {...directProps} />;
      case 'fill_blank':
        return <FillBlank key={currentExercise.id} exercise={currentExercise} {...kontrolEtProps} />;
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
        return <ListeningConversation key={currentExercise.id} exercise={currentExercise} {...directProps} />;
      case 'fast_recall':
        return <FastRecall key={currentExercise.id} exercise={currentExercise} {...directProps} />;
      case 'npc_reaction':
        return <NpcReaction key={currentExercise.id} exercise={currentExercise} onCorrect={handleCorrect} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden px-5 py-5 text-[var(--kt-ink)]">
      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-3xl items-center gap-3">
        <button
          type="button"
          onClick={() => { stopAudio(); navigate('/learn'); }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--kt-ink-subtle)] transition hover:bg-[var(--kt-surface-muted)]"
          aria-label="Dersi kapat"
        >
          <X size={22} />
        </button>

        <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-[var(--kt-surface-muted)]">
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
              className={`text-lg leading-none transition ${i < lives ? 'text-[var(--kt-accent-danger)]' : 'text-[var(--kt-border)]'}`}
            >
              ♥
            </span>
          ))}
        </div>
      </header>

      {/* Streak badge */}
      {streak >= 3 && !feedback && (
        <div className="mx-auto mt-3 max-w-3xl">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--kt-accent-success-soft)] px-3 py-1 text-xs font-black uppercase tracking-wider text-[var(--kt-accent-success)]">
            🔥 {streak} üst üste doğru
          </span>
        </div>
      )}

      {flow.isReviewPhase && (
        <div className="mx-auto mt-3 max-w-3xl rounded-[0.8rem] bg-[var(--kt-accent-warning-soft,var(--kt-surface-muted))] px-4 py-2 text-center text-xs font-black uppercase tracking-wider text-[var(--kt-accent-warning,var(--kt-ink-muted))]">
          Tekrar turu — zorlandıkların geliyor
        </div>
      )}

      <main className="relative z-10 mx-auto mt-10 max-w-3xl pb-36">
        {renderExercise()}
      </main>

      {/* Sticky footer — not shown for auto-advance types */}
      {!isAutoAdvance && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          {feedback ? (
            /* Feedback state */
            <div
              className={`border-t-4 px-5 pb-8 pt-5 ${
                feedback.tone === 'correct'
                  ? 'border-[var(--kt-accent-success)] bg-[var(--kt-accent-success-soft)]'
                  : 'border-[var(--kt-accent-danger)] bg-[var(--kt-accent-danger-soft)]'
              }`}
            >
              <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
                {/* Icon + message */}
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-black text-white ${
                      feedback.tone === 'correct'
                        ? 'bg-[var(--kt-accent-success)]'
                        : 'bg-[var(--kt-accent-danger)]'
                    }`}
                  >
                    {feedback.tone === 'correct' ? '✓' : '✗'}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`font-black ${
                        feedback.tone === 'correct'
                          ? 'text-[var(--kt-accent-success)]'
                          : 'text-[var(--kt-accent-danger)]'
                      }`}
                    >
                      {feedback.tone === 'correct' ? 'Aferin!' : 'Doğru cevap:'}
                    </p>
                    {feedback.tone === 'correct' && feedback.echoWord && (
                      <p className="mt-0.5 text-sm font-bold text-[var(--kt-accent-success)]">
                        <span className="font-jp">{feedback.echoWord.japanese}</span>
                        {' — '}
                        {feedback.echoWord.meaning}
                      </p>
                    )}
                    {feedback.tone === 'wrong' && feedback.smartFeedback && (
                      <p className="mt-0.5 text-sm font-bold text-[var(--kt-accent-danger)]">
                        {feedback.smartFeedback}
                      </p>
                    )}
                  </div>
                </div>
                {/* DEVAM ET */}
                <button
                  type="button"
                  onClick={handleContinue}
                  className={`shrink-0 rounded-[0.95rem] px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.20)] transition hover:opacity-90 ${
                    feedback.tone === 'correct'
                      ? 'bg-[var(--kt-accent-success)]'
                      : 'bg-[var(--kt-accent-danger)]'
                  }`}
                >
                  Devam et
                </button>
              </div>
            </div>
          ) : isKontrolEt ? (
            /* KONTROL ET state */
            <div className="border-t-2 border-[var(--kt-border)] bg-[var(--kt-surface)] px-5 pb-8 pt-4">
              <div className="mx-auto max-w-3xl">
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
