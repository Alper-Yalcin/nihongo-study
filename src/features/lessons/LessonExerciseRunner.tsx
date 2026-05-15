import React, { useEffect, useRef, useState } from 'react';
import type {
  LessonConcept,
  LessonExercise,
  LessonSessionNumber,
  LessonSessionResult,
} from './lessonTypes';
import { recordCorrect, recordWrong, startSession, endSession } from '../../hooks/useFeedback';
import { LessonProgressBar } from './components/LessonProgressBar';
import { LessonHeartsDisplay } from './components/LessonHeartsDisplay';
import { LessonFeedbackBanner } from './components/LessonFeedbackBanner';

// Exercise widgets
import { TapMeaningWidget } from './exercises/TapMeaningWidget';
import { TapJapaneseWidget } from './exercises/TapJapaneseWidget';
import { ListenAndTapWidget } from './exercises/ListenAndTapWidget';
import { TapMissingWordWidget } from './exercises/TapMissingWordWidget';
import { TapImageMatchWidget } from './exercises/TapImageMatchWidget';
import { TapContextAnswerWidget } from './exercises/TapContextAnswerWidget';
import { ArrangeSentenceWidget } from './exercises/ArrangeSentenceWidget';
import { ArrangeConversationWidget } from './exercises/ArrangeConversationWidget';
import { BuildTranslationWidget } from './exercises/BuildTranslationWidget';
import { BuildListeningWidget } from './exercises/BuildListeningWidget';
import { IdentifySpokenWordWidget } from './exercises/IdentifySpokenWordWidget';
import { NpcReplyChoiceWidget } from './exercises/NpcReplyChoiceWidget';
import { ShopInteractionWidget } from './exercises/ShopInteractionWidget';
import { TrainStationChoiceWidget } from './exercises/TrainStationChoiceWidget';
import { ConversationContinuationWidget } from './exercises/ConversationContinuationWidget';

type ExerciseState = 'answering' | 'correct' | 'incorrect';

interface Props {
  concept: LessonConcept;
  sessionNumber: LessonSessionNumber;
  onSessionComplete: (result: LessonSessionResult) => void;
  onExit: () => void;
}

function getCorrectAnswer(exercise: LessonExercise): string {
  if (exercise.kind === 'arrange-conversation') {
    return exercise.correctOrder.join(',');
  }
  return (exercise as { correctAnswer: string }).correctAnswer;
}

function renderWidget(
  exercise: LessonExercise,
  locked: boolean,
  onSelectionChange: (answer: string | null) => void
): React.ReactNode {
  const props = { locked, onSelectionChange };
  switch (exercise.kind) {
    case 'tap-meaning':
      return <TapMeaningWidget exercise={exercise} {...props} />;
    case 'tap-japanese':
      return <TapJapaneseWidget exercise={exercise} {...props} />;
    case 'listen-and-tap':
      return <ListenAndTapWidget exercise={exercise} {...props} />;
    case 'tap-missing-word':
      return <TapMissingWordWidget exercise={exercise} {...props} />;
    case 'tap-image-match':
      return <TapImageMatchWidget exercise={exercise} {...props} />;
    case 'tap-context-answer':
      return <TapContextAnswerWidget exercise={exercise} {...props} />;
    case 'arrange-sentence':
      return <ArrangeSentenceWidget exercise={exercise} {...props} />;
    case 'arrange-conversation':
      return <ArrangeConversationWidget exercise={exercise} {...props} />;
    case 'build-translation':
      return <BuildTranslationWidget exercise={exercise} {...props} />;
    case 'build-listening':
      return <BuildListeningWidget exercise={exercise} {...props} />;
    case 'identify-spoken-word':
      return <IdentifySpokenWordWidget exercise={exercise} {...props} />;
    case 'npc-reply-choice':
      return <NpcReplyChoiceWidget exercise={exercise} {...props} />;
    case 'shop-interaction':
      return <ShopInteractionWidget exercise={exercise} {...props} />;
    case 'train-station-choice':
      return <TrainStationChoiceWidget exercise={exercise} {...props} />;
    case 'conversation-continuation':
      return <ConversationContinuationWidget exercise={exercise} {...props} />;
  }
}

export const LessonExerciseRunner: React.FC<Props> = ({
  concept,
  sessionNumber,
  onSessionComplete,
  onExit,
}) => {
  const session = concept.sessions.find((s) => s.sessionNumber === sessionNumber);
  const exercises = session?.exercises ?? [];

  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [exerciseState, setExerciseState] = useState<ExerciseState>('answering');
  const [heartsRemaining, setHeartsRemaining] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [correctFirstTry, setCorrectFirstTry] = useState(0);
  const hasAnsweredWrongRef = useRef(false);

  const currentExercise = exercises[exerciseIdx] ?? null;
  const isLast = exerciseIdx >= exercises.length - 1;

  useEffect(() => {
    startSession();
    return () => { endSession(); };
  }, []);

  // Reset per-exercise state when moving to next exercise
  useEffect(() => {
    setExerciseState('answering');
    setSelectedAnswer(null);
    hasAnsweredWrongRef.current = false;
  }, [exerciseIdx]);

  const handleCheck = () => {
    if (!selectedAnswer || !currentExercise) return;

    const correctAnswer = getCorrectAnswer(currentExercise);
    const isCorrect = selectedAnswer === correctAnswer;

    if (isCorrect) {
      recordCorrect();
      if (!hasAnsweredWrongRef.current) {
        setCorrectFirstTry((c) => c + 1);
      }
      setExerciseState('correct');
    } else {
      recordWrong();
      hasAnsweredWrongRef.current = true;
      setHeartsRemaining((h) => Math.max(0, h - 1));
      setExerciseState('incorrect');
    }
  };

  const handleContinue = () => {
    if (isLast) {
      // Session complete
      const result: LessonSessionResult = {
        conceptId: concept.id,
        sessionNumber,
        totalExercises: exercises.length,
        correctFirstTry,
        completedAt: new Date().toISOString(),
      };
      onSessionComplete(result);
    } else {
      setExerciseIdx((i) => i + 1);
    }
  };

  if (!currentExercise) return null;

  const locked = exerciseState !== 'answering';
  const canCheck = !!selectedAnswer && exerciseState === 'answering';

  return (
    <div className="relative z-10 flex h-screen flex-col overflow-hidden bg-[var(--kt-surface)]">
      {/* Top bar */}
      <div className="shrink-0 border-b border-[var(--kt-border-subtle)]">
        <div className="flex items-center justify-between px-2">
          <div className="flex-1">
            <LessonProgressBar
              current={exerciseIdx}
              total={exercises.length}
              onExit={onExit}
            />
          </div>
          <div className="pr-4">
            <LessonHeartsDisplay heartsRemaining={heartsRemaining} />
          </div>
        </div>
        {/* Session label */}
        <div className="px-5 pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--kt-ink-muted)]">
            {concept.title} · {session?.label}
          </p>
        </div>
      </div>

      {/* Exercise content area — scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div key={exerciseIdx} className="kt-phase-fade">
          {renderWidget(currentExercise, locked, setSelectedAnswer)}
        </div>
      </div>

      {/* Bottom bar — sticky */}
      <div className="shrink-0">
        <LessonFeedbackBanner
          state={exerciseState}
          correctAnswer={getCorrectAnswer(currentExercise)}
          explanation={currentExercise.explanation}
        />

        <div className="border-t border-[var(--kt-border-subtle)] px-5 py-4">
          {exerciseState === 'answering' ? (
            <button
              type="button"
              disabled={!canCheck}
              onClick={handleCheck}
              className="w-full rounded-[1.4rem] bg-[var(--kt-accent-info)] py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90 disabled:opacity-30"
            >
              Kontrol Et
            </button>
          ) : (
            <button
              type="button"
              onClick={handleContinue}
              className={`w-full rounded-[1.4rem] py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90 ${
                exerciseState === 'correct'
                  ? 'bg-[var(--kt-accent-info)]'
                  : 'bg-[var(--kt-brand)]'
              }`}
            >
              {isLast ? 'Tamamla 🎉' : 'Devam Et'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
