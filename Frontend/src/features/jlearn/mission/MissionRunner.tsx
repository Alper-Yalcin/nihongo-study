import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { JLearnLevel, JLearnStep, VocabItem } from '../../../data/jlearn/jlearnTypes';
import { appShellRoutes } from '../../../data/appShellContent';
import { TaskRunner, TaskSummary } from '../tasks/TaskRunner';
import { DialogueChainPlayer } from '../dialogue/DialogueChainPlayer';
import { BranchingChoicePanel } from '../branching/BranchingChoicePanel';
import { readProgress, readUserState, writeProgress, writeUserState } from '../../../data/jlearn/jlearnStorage';
import { completeStep } from '../../../data/jlearn/jlearnGating';
import { jlearnTrack } from '../../../data/jlearn/jlearnContent';
import { PracticeQuestion } from '../../../data/jlearn/jlearnTypes';
import { AdaptiveBranchPick, updateUserStateForMission } from '../adaptive/jlearnAdaptive';
import { deriveEmotionalFeedbackTier, EmotionalFeedbackTier } from './emotionalFeedback';
import {
  buildRecoveryCallbackLine,
  prepareRecoveryMission,
  resolveRecoveryTarget,
  upsertRecoveryFlag,
} from '../failForward/failForward';
import { RecoveryFlag, subscribeJLearnUserState } from '../debug/debugStore';

type Phase = 'scenario' | 'vocab' | 'grammar' | 'examples' | 'branching' | 'dialogue' | 'tasks' | 'complete';

interface MissionRunnerProps {
  step: JLearnStep;
  mode?: 'normal' | 'challenge';
  primaryCharacterId?: string;
}

const isDev = Boolean((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV);

const PHASE_LABELS: Record<Phase, string> = {
  scenario: 'Scenario',
  vocab: 'Vocabulary',
  grammar: 'Grammar',
  examples: 'Examples',
  branching: 'Choice',
  dialogue: 'Dialogue',
  tasks: 'Practice',
  complete: 'Complete',
};

const EMOTIONAL_FEEDBACK_STYLES: Record<
  EmotionalFeedbackTier,
  { border: string; bg: string; label: string; badge: string }
> = {
  perfect: {
    border: 'border-[var(--kt-accent-info)]',
    bg: 'bg-[var(--kt-accent-info)] bg-opacity-10',
    label: 'text-[var(--kt-accent-info)]',
    badge: 'Perfect',
  },
  good: {
    border: 'border-amber-400',
    bg: 'bg-amber-400 bg-opacity-10',
    label: 'text-amber-500',
    badge: 'Good',
  },
  struggle: {
    border: 'border-[var(--kt-border)]',
    bg: 'bg-[var(--kt-surface-raised)]',
    label: 'text-[var(--kt-ink-muted)]',
    badge: 'Kept Going',
  },
};

function buildPhaseList(step: JLearnStep): Phase[] {
  const phases: Phase[] = ['scenario'];
  if (step.vocabulary.length > 0) phases.push('vocab');
  if (step.grammar.length > 0) phases.push('grammar');
  if (step.examples.length > 0) phases.push('examples');
  if (step.branchingChoice) phases.push('branching');
  if ((step.dialogueChains?.length ?? 0) > 0) phases.push('dialogue');
  phases.push('tasks');
  phases.push('complete');
  return phases;
}

function getLevelCheckpointStepId(level: JLearnLevel): string | null {
  const checkpointUnit = level.units.find((unit) => unit.id === level.checkpointUnitId);
  if (!checkpointUnit) return null;

  return checkpointUnit.steps.find((candidate) => candidate.isCheckpoint)?.id
    ?? checkpointUnit.steps[checkpointUnit.steps.length - 1]?.id
    ?? null;
}

function getCompletedLevelForStep(stepId: string): JLearnLevel | null {
  return jlearnTrack.levels.find((level) => getLevelCheckpointStepId(level) === stepId) ?? null;
}

interface NavBarProps {
  phases: Phase[];
  current: Phase;
  compact?: boolean;
}

const PhaseNavBar: React.FC<NavBarProps> = ({ phases, current, compact = false }) => {
  const visiblePhases = phases.filter((p) => p !== 'complete');
  const currentIndex = Math.max(visiblePhases.indexOf(current), 0);
  const pct =
    visiblePhases.length > 1
      ? Math.round((currentIndex / (visiblePhases.length - 1)) * 100)
      : 100;

  return (
    <div
      className={`border border-[var(--kt-border-subtle)] bg-[linear-gradient(135deg,var(--kt-surface-raised),var(--kt-surface-muted))] shadow-[var(--kt-shadow-sm)] ${
        compact
          ? 'mb-[var(--kt-space-16)] rounded-[1.2rem] p-3'
          : 'mb-[var(--kt-space-24)] rounded-[1.5rem] p-4'
      }`}
    >
      <div className={`${compact ? 'mb-2' : 'mb-3'} flex items-center justify-between gap-4`}>
        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--kt-ink-muted)]">
          Mission route
        </span>
        <span className="rounded-full border border-[var(--kt-border)] bg-[var(--kt-surface)] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[var(--kt-accent-info)]">
          {pct}%
        </span>
      </div>

      <div className="flex items-center gap-2">
        {visiblePhases.map((p, i) => {
          const isCurrent = p === current;
          const isPast = currentIndex > i;

          return (
            <React.Fragment key={p}>
              <div
                className={`flex shrink-0 items-center justify-center rounded-full border font-black transition ${
                  isCurrent
                    ? 'border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)] text-white shadow-[var(--kt-shadow)]'
                    : isPast
                    ? 'border-[var(--kt-accent-info)] bg-[var(--kt-accent-info-soft)] text-[var(--kt-accent-info)]'
                    : 'border-[var(--kt-border)] bg-[var(--kt-surface)] text-[var(--kt-ink-subtle)]'
                } ${compact ? 'h-6 w-6 text-[10px]' : 'h-8 w-8 text-[11px]'}`}
                aria-label={PHASE_LABELS[p]}
                title={PHASE_LABELS[p]}
              >
                {i + 1}
              </div>
              {i < visiblePhases.length - 1 && (
                <div
                  className={`${compact ? 'h-0.5' : 'h-1'} flex-1 rounded-full transition-colors ${
                    isPast ? 'bg-[var(--kt-accent-info)] opacity-60' : 'bg-[var(--kt-border)]'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {!compact && <div className="mt-3 flex flex-wrap gap-2">
        {visiblePhases.map((p) => (
          <span
            key={p}
            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
              p === current
                ? 'bg-[var(--kt-accent-info-soft)] text-[var(--kt-accent-info)]'
                : 'text-[var(--kt-ink-muted)]'
            }`}
          >
            {PHASE_LABELS[p]}
          </span>
        ))}
      </div>}
    </div>
  );
};

interface NavButtonsProps {
  phases: Phase[];
  current: Phase;
  onNext: () => void;
  onBack: () => void;
}

const NavButtons: React.FC<NavButtonsProps> = ({ phases, current, onNext, onBack }) => {
  const idx = phases.indexOf(current);
  const isFirst = idx === 0;
  const isBeforeComplete = phases[idx + 1] === 'complete';
  const nextLabel = isBeforeComplete ? 'Start Practice' : current === 'scenario' ? 'Begin' : 'Next';

  return (
    <div className="mt-8 flex items-center gap-3">
      {!isFirst && (
        <button
          type="button"
          onClick={onBack}
          className="rounded-[1.2rem] border border-[var(--kt-border)] px-6 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)] transition hover:bg-[var(--kt-nav-item-hover)]"
        >
          Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        className="rounded-[1.2rem] bg-[var(--kt-accent-info)] px-8 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90"
      >
        {nextLabel}
      </button>
    </div>
  );
};

const LowConfidenceVocabPanel: React.FC<{ vocabulary: VocabItem[] }> = ({ vocabulary }) => (
  <aside className="rounded-[1.8rem] border border-[color:var(--kt-accent-warning)]/35 bg-[radial-gradient(circle_at_top_left,var(--kt-accent-warning-soft),transparent_44%),var(--kt-surface)] p-4 shadow-[var(--kt-shadow-sm)] lg:sticky lg:top-6">
    <div className="mb-4">
      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--kt-accent-warning)]">
        Sticky vocab
      </div>
      <h3 className="mt-1 text-lg font-black text-[var(--kt-ink-strong)]">Keep these visible</h3>
      <p className="mt-2 text-xs leading-5 text-[var(--kt-ink-muted)]">
        Low-confidence mode keeps core words nearby during every mission phase.
      </p>
    </div>

    <div className="space-y-2">
      {vocabulary.slice(0, 8).map((vocab) => (
        <div
          key={vocab.id}
          className="rounded-[1.1rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-3"
        >
          <div className="font-jp text-xl font-black text-[var(--kt-ink-strong)]">
            {vocab.japanese}
          </div>
          <div className="mt-1 text-xs font-semibold text-[var(--kt-ink-muted)]">
            {vocab.romaji}
          </div>
          <div className="mt-1 text-sm text-[var(--kt-ink)]">{vocab.english}</div>
        </div>
      ))}
    </div>
  </aside>
);

const HighConfidenceVocabCollapse: React.FC<{ vocabulary: VocabItem[] }> = ({ vocabulary }) => (
  <details className="group rounded-[1.25rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-3 shadow-[var(--kt-shadow-sm)]">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-[1rem] px-2 py-1 text-sm font-black text-[var(--kt-ink-strong)] marker:hidden">
      <span>Vocabulary collapsed</span>
      <span className="rounded-full bg-[var(--kt-accent-info-soft)] px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--kt-accent-info)]">
        {vocabulary.length} terms
      </span>
    </summary>
    <div className="mt-3 grid gap-2 sm:grid-cols-2">
      {vocabulary.map((vocab) => (
        <div
          key={vocab.id}
          className="rounded-[0.95rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] px-3 py-2"
        >
          <div className="font-jp text-base font-black text-[var(--kt-ink-strong)]">
            {vocab.japanese}
          </div>
          <div className="text-xs text-[var(--kt-ink-muted)]">
            {vocab.romaji} / {vocab.english}
          </div>
        </div>
      ))}
    </div>
  </details>
);

export const MissionRunner: React.FC<MissionRunnerProps> = ({ step, mode = 'normal', primaryCharacterId }) => {
  const isChallengeMode = mode === 'challenge';
  const phases = useMemo(() => buildPhaseList(step), [step]);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [tasksDone, setTasksDone] = useState(false);
  const [dialogueChainIdx, setDialogueChainIdx] = useState(0);
  const phase = phases[phaseIdx];

  const chains = step.dialogueChains ?? [];
  const persistedRef = useRef(false);
  const passThreshold = isChallengeMode ? 90 : (step.minPassScore ?? 80);
  type TaskPhaseState = 'running' | 'passed' | 'failed';
  const [taskPhaseState, setTaskPhaseState] = useState<TaskPhaseState>('running');
  const [lastSummary, setLastSummary] = useState<TaskSummary | null>(null);
  const [branchPicks, setBranchPicks] = useState<AdaptiveBranchPick[]>([]);
  const [matchedRecoveryFlags, setMatchedRecoveryFlags] = useState<RecoveryFlag[]>([]);
  const [recoveryQuestions, setRecoveryQuestions] = useState<PracticeQuestion[]>([]);
  const [recoveryCallbackLine, setRecoveryCallbackLine] = useState<string | null>(null);
  const [confidenceLevel, setConfidenceLevel] = useState(() => readUserState().confidenceLevel);

  useEffect(
    () => subscribeJLearnUserState(() => setConfidenceLevel(readUserState().confidenceLevel)),
    []
  );

  useEffect(() => {
    persistedRef.current = false;
    setPhaseIdx(0);
    setTasksDone(false);
    setDialogueChainIdx(0);
    setTaskPhaseState('running');
    setLastSummary(null);
    setBranchPicks([]);
    setMatchedRecoveryFlags([]);
    setRecoveryQuestions([]);
    setRecoveryCallbackLine(null);

    const state = readUserState();
    const recoverySession = prepareRecoveryMission(step, state.recoveryFlags);
    setMatchedRecoveryFlags(recoverySession.matchedFlags);
    setRecoveryQuestions(recoverySession.injectedQuestions);

    if (JSON.stringify(recoverySession.remainingFlags) !== JSON.stringify(state.recoveryFlags)) {
      writeUserState({
        ...state,
        recoveryFlags: recoverySession.remainingFlags,
      });
    }
  }, [step.id]);

  useEffect(() => {
    if (phase === 'complete' && !persistedRef.current) {
      persistedRef.current = true;
      const progress = readProgress();
      const updated = isChallengeMode
        ? { ...progress, earnedBadgeIds: progress.earnedBadgeIds.includes(step.id) ? progress.earnedBadgeIds : [...progress.earnedBadgeIds, step.id] }
        : completeStep(step.id, progress, jlearnTrack);
      writeProgress(updated);
      const userState = updateUserStateForMission(readUserState(), {
        step,
        taskSummary: lastSummary,
        branchPicks,
      });
      const nextState = {
        ...userState,
        recoveryFlags: userState.recoveryFlags.filter(
          (flag) => !matchedRecoveryFlags.some((matched) => matched.targetId === flag.targetId)
        ),
      };
      if (isChallengeMode && primaryCharacterId && lastSummary) {
        const pct = lastSummary.total > 0 ? Math.round((lastSummary.correctFirstTry / lastSummary.total) * 100) : 0;
        if (pct >= passThreshold) {
          nextState.relationshipLevels = { ...nextState.relationshipLevels, [primaryCharacterId]: 3 };
        }
      }
      writeUserState(nextState);
    }
  }, [branchPicks, isChallengeMode, lastSummary, matchedRecoveryFlags, passThreshold, phase, primaryCharacterId, step]);

  const goNext = () => setPhaseIdx((i) => Math.min(i + 1, phases.length - 1));
  const goBack = () => setPhaseIdx((i) => Math.max(i - 1, 0));
  const emotionalFeedbackTier = deriveEmotionalFeedbackTier(lastSummary);
  const emotionalFeedbackCopy =
    emotionalFeedbackTier && step.emotionalFeedback
      ? step.emotionalFeedback[emotionalFeedbackTier]
      : null;
  const completedLevel = useMemo(() => getCompletedLevelForStep(step.id), [step.id]);
  const completedLevelBadge = completedLevel?.badge ?? null;
  const completedLevelStoryHook = completedLevel?.storyHook ?? null;
  const isLowConfidence = confidenceLevel === 'low';
  const isHighConfidence = confidenceLevel === 'high';
  const showLowConfidenceVocab = isLowConfidence && step.vocabulary.length > 0;

  const header = (
    <div
      className={`overflow-hidden border border-[var(--kt-border-subtle)] bg-[radial-gradient(circle_at_top_left,var(--kt-accent-info-soft),transparent_34%),linear-gradient(135deg,var(--kt-surface-raised),var(--kt-surface))] shadow-[var(--kt-shadow-md)] ${
        isHighConfidence
          ? 'mb-[var(--kt-space-16)] rounded-[1.5rem] p-4'
          : 'mb-[var(--kt-space-24)] rounded-[2rem] p-5 sm:p-6'
      }`}
    >
      <div className={`flex flex-col sm:flex-row sm:items-end sm:justify-between ${isHighConfidence ? 'gap-3' : 'gap-5'}`}>
        <div>
          <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--kt-accent-info)]">
            {step.id} / {PHASE_LABELS[phase]}
          </span>
          <h1 className={`mt-2 font-black leading-tight text-[var(--kt-ink-strong)] ${
            isHighConfidence ? 'text-[length:var(--kt-type-2xl)]' : 'text-[length:var(--kt-type-3xl)]'
          }`}>
            {step.title}
          </h1>
          {step.goal && (
            <p className={`mt-3 max-w-xl text-sm text-[var(--kt-ink-muted)] ${isHighConfidence ? 'leading-5' : 'leading-6'}`}>
              {step.goal}
            </p>
          )}
        </div>

        <div className={`rounded-[1.4rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] shadow-[var(--kt-shadow-sm)] ${
          isHighConfidence ? 'px-3 py-2' : 'px-4 py-3'
        }`}>
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
            Phase
          </div>
          <div className="mt-1 text-lg font-black text-[var(--kt-accent-info)]">
            {PHASE_LABELS[phase]}
          </div>
        </div>
      </div>
    </div>
  );
  if (phase === 'complete') {
    if (isHighConfidence) {
      return (
        <div className="kt-phase-fade mx-auto w-full max-w-2xl px-[var(--kt-space-24)] py-[var(--kt-space-32)]">
          <div className="mb-5 rounded-[1.5rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-5 shadow-[var(--kt-shadow-sm)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-accent-info)]">
                  Mission Complete
                </div>
                <h2 className="mt-1 text-2xl font-black text-[var(--kt-ink-strong)]">{step.title}</h2>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--kt-accent-info)] text-sm font-black text-white">
                OK
              </div>
            </div>

            {emotionalFeedbackTier && emotionalFeedbackCopy && (
              <div
                className={`mt-4 rounded-[1rem] border px-4 py-3 ${EMOTIONAL_FEEDBACK_STYLES[emotionalFeedbackTier].border} ${EMOTIONAL_FEEDBACK_STYLES[emotionalFeedbackTier].bg}`}
              >
                <div
                  className={`text-[10px] font-black uppercase tracking-[0.16em] ${EMOTIONAL_FEEDBACK_STYLES[emotionalFeedbackTier].label}`}
                >
                  {EMOTIONAL_FEEDBACK_STYLES[emotionalFeedbackTier].badge}
                </div>
                <p className="mt-1 text-sm leading-5 text-[var(--kt-ink-strong)]">{emotionalFeedbackCopy}</p>
              </div>
            )}

            {completedLevelBadge && (
              <div className="mt-4 flex items-center justify-between gap-3 rounded-[1rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] px-4 py-3">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                    Badge
                  </div>
                  <div className="font-black text-[var(--kt-ink-strong)]">{completedLevelBadge.name}</div>
                </div>
                {completedLevelStoryHook && (
                  <div className="max-w-[14rem] text-right">
                    <div className="font-jp text-base font-black text-[var(--kt-ink-strong)]">
                      {completedLevelStoryHook.japanese}
                    </div>
                    <div className="text-xs text-[var(--kt-ink-muted)]">
                      {completedLevelStoryHook.translation}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Link
              to={appShellRoutes.learnJapanese}
              className="rounded-[1rem] border border-[var(--kt-border)] px-6 py-3 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink)] transition hover:bg-[var(--kt-nav-item-hover)]"
            >
              Back to Japanese
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="kt-phase-fade mx-auto w-full max-w-3xl px-[var(--kt-space-24)] py-[var(--kt-space-48)]">
        <div className="mb-8 flex flex-col items-center gap-4 rounded-[2rem] border border-[var(--kt-border-subtle)] bg-[radial-gradient(circle_at_top,var(--kt-accent-info-soft),transparent_42%),var(--kt-surface-raised)] p-8 text-center shadow-[var(--kt-shadow-md)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--kt-accent-info)] text-3xl font-black text-white shadow-[var(--kt-shadow)]">
            OK
          </div>
          <h2 className="text-2xl font-black text-[var(--kt-ink-strong)]">Mission Complete</h2>
          {emotionalFeedbackTier && emotionalFeedbackCopy && (
            <div
              className={`w-full max-w-lg rounded-[1.2rem] border p-5 text-left ${EMOTIONAL_FEEDBACK_STYLES[emotionalFeedbackTier].border} ${EMOTIONAL_FEEDBACK_STYLES[emotionalFeedbackTier].bg}`}
            >
              <div
                className={`mb-2 text-[11px] font-black uppercase tracking-[0.16em] ${EMOTIONAL_FEEDBACK_STYLES[emotionalFeedbackTier].label}`}
              >
                {EMOTIONAL_FEEDBACK_STYLES[emotionalFeedbackTier].badge}
              </div>
              <p className="text-base leading-7 text-[var(--kt-ink-strong)]">{emotionalFeedbackCopy}</p>
              {recoveryCallbackLine && (
                <p className="mt-3 border-t border-[var(--kt-border-subtle)] pt-3 text-sm leading-6 text-[var(--kt-ink-muted)]">
                  {recoveryCallbackLine}
                </p>
              )}
            </div>
          )}
          {!emotionalFeedbackCopy && recoveryCallbackLine && (
            <div className="w-full max-w-lg rounded-[1.2rem] border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-5 text-left">
              <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                Callback
              </div>
              <p className="text-base leading-7 text-[var(--kt-ink-strong)]">{recoveryCallbackLine}</p>
            </div>
          )}
          {step.successMessage && (
            <p className="max-w-md text-base leading-7 text-[var(--kt-ink-muted)]">
              {step.successMessage}
            </p>
          )}
          {completedLevelBadge && completedLevelStoryHook && (
            <div className="w-full max-w-xl rounded-[1.7rem] border border-[var(--kt-accent-info)] bg-[radial-gradient(circle_at_top_left,var(--kt-brand-soft),transparent_38%),var(--kt-surface)] p-5 text-left shadow-[var(--kt-shadow-sm)]">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                    Badge Earned
                  </div>
                  <div className="mt-1 text-xl font-black text-[var(--kt-ink-strong)]">
                    {completedLevelBadge.name}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[var(--kt-ink-muted)]">
                    {completedLevelBadge.description}
                  </p>
                </div>
                <span className="rounded-full bg-[var(--kt-accent-info-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-accent-info)]">
                  Story Hook
                </span>
              </div>

              <div className="rounded-[1.35rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-4">
                <div className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                  {completedLevelStoryHook.speaker}
                </div>
                <p className="font-jp text-2xl font-black leading-relaxed text-[var(--kt-ink-strong)]">
                  {completedLevelStoryHook.japanese}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--kt-ink-muted)]">
                  {completedLevelStoryHook.translation}
                </p>
              </div>

              <p className="mt-4 text-sm leading-7 text-[var(--kt-ink)]">
                {completedLevelStoryHook.teaser}
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <Link
            to={appShellRoutes.learnJapanese}
            className="rounded-[1.2rem] border border-[var(--kt-border)] px-8 py-4 text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink)] transition hover:bg-[var(--kt-nav-item-hover)]"
          >
            Back to Japanese
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`mx-auto w-full px-[var(--kt-space-16)] sm:px-[var(--kt-space-24)] lg:px-[var(--kt-space-32)] ${
        showLowConfidenceVocab ? 'max-w-6xl' : isHighConfidence ? 'max-w-3xl' : 'max-w-4xl'
      } ${isHighConfidence ? 'py-[var(--kt-space-24)]' : 'py-[var(--kt-space-32)]'}`}
    >
      {header}
      <PhaseNavBar phases={phases} current={phase} compact={isHighConfidence} />

      <div
        className={
          showLowConfidenceVocab
            ? 'grid gap-[var(--kt-space-32)] lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start'
            : ''
        }
      >
      <div
        key={`${phase}-${taskPhaseState}-${dialogueChainIdx}`}
        className={`kt-phase-fade rounded-[2rem] border bg-[var(--kt-surface)] shadow-[var(--kt-shadow)] ${
          isLowConfidence
            ? 'border-[color:var(--kt-accent-warning)]/25 p-5 sm:p-7'
            : isHighConfidence
            ? 'border-[var(--kt-border-subtle)] p-3 sm:p-4'
            : 'border-[var(--kt-border-subtle)] p-4 sm:p-6'
        }`}
      >
      {phase === 'scenario' && (
        <>
          {step.scenario && (
            <div className="mb-5 rounded-[1.5rem] border border-[var(--kt-border-subtle)] bg-[linear-gradient(135deg,var(--kt-surface-raised),var(--kt-surface-muted))] p-5 shadow-[var(--kt-shadow-sm)]">
              <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                Scenario
              </div>
              <p className="text-base leading-7 text-[var(--kt-ink)]">{step.scenario}</p>
            </div>
          )}
          {step.goal && (
            <div className="rounded-[1.5rem] border border-[var(--kt-accent-info)] bg-[var(--kt-accent-info-soft)] p-5">
              <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                Goal
              </div>
              <p className="text-base font-semibold text-[var(--kt-ink-strong)]">{step.goal}</p>
            </div>
          )}
          {isDev && (
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setPhaseIdx(phases.length - 1)}
                className="rounded-[1rem] border border-[var(--kt-border)] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)] transition hover:bg-[var(--kt-nav-item-hover)]"
              >
                Skip to complete
              </button>
            </div>
          )}
        </>
      )}

      {phase === 'vocab' && isHighConfidence && (
        <HighConfidenceVocabCollapse vocabulary={step.vocabulary} />
      )}

      {phase === 'vocab' && !isHighConfidence && (
        <div className="overflow-hidden rounded-[1.5rem] border border-[var(--kt-border-subtle)] shadow-[var(--kt-shadow-sm)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)]">
                <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">Japanese</th>
                <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">Romaji</th>
                <th className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">English</th>
              </tr>
            </thead>
            <tbody>
              {step.vocabulary.map((v, i) => (
                <tr
                  key={v.id}
                  className={`border-b border-[var(--kt-border-subtle)] last:border-0 ${
                    i % 2 === 0 ? 'bg-[var(--kt-surface-page)]' : 'bg-[var(--kt-surface-raised)]'
                  }`}
                >
                  <td className="px-4 py-3 font-jp text-lg text-[var(--kt-ink-strong)]">{v.japanese}</td>
                  <td className="px-4 py-3 text-[var(--kt-ink-muted)]">{v.romaji}</td>
                  <td className="px-4 py-3 text-[var(--kt-ink)]">{v.english}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {phase === 'grammar' && (
        <div className="space-y-4">
          {step.grammar.map((g) => (
            <div
              key={g.id}
              className="rounded-[1.5rem] border border-[var(--kt-border-subtle)] border-l-4 border-l-[var(--kt-accent-info)] bg-[var(--kt-surface-raised)] p-5 shadow-[var(--kt-shadow-sm)]"
            >
              <div className="mb-1 font-jp text-2xl text-[var(--kt-ink-strong)]">{g.pattern}</div>
              <div className="mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                {g.structure}
              </div>
              <p className="text-sm leading-6 text-[var(--kt-ink)]">{g.explanation}</p>
              {g.examples.length > 0 && (
                <ul className="mt-3 space-y-1 border-t border-[var(--kt-border-subtle)] pt-3">
                  {g.examples.map((ex, i) => (
                    <li key={i} className="text-sm text-[var(--kt-ink-muted)]">
                      {ex}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {phase === 'examples' && (
        <ol className="space-y-3">
          {step.examples.map((ex, i) => (
            <li
              key={ex.id}
              className="rounded-[1.5rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-4 shadow-[var(--kt-shadow-sm)]"
            >
              <div className="flex gap-3">
                <span className="mt-0.5 text-[11px] font-black text-[var(--kt-ink-muted)]">{i + 1}.</span>
                <div>
                  <div className="font-jp text-lg text-[var(--kt-ink-strong)]">{ex.japanese}</div>
                  <div className="mt-0.5 text-xs text-[var(--kt-ink-muted)]">{ex.romaji}</div>
                  <div className="mt-1 text-sm text-[var(--kt-ink)]">{ex.english}</div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      {phase === 'branching' && step.branchingChoice && (
        <BranchingChoicePanel
          branchingChoice={step.branchingChoice}
          compact={isHighConfidence}
          onContinue={goNext}
          onPicked={(pick) => {
            setBranchPicks((current) => [
              ...current,
              { label: pick.option.label, result: pick.result },
            ]);
            if (pick.result === 'partial') {
              const target = resolveRecoveryTarget(step, pick);
              if (target) {
                const state = readUserState();
                writeUserState({
                  ...state,
                  recoveryFlags: upsertRecoveryFlag(
                    state.recoveryFlags,
                    target.targetId,
                    new Date().toISOString()
                  ),
                });
              }
            }
          }}
        />
      )}

      {phase === 'dialogue' && chains.length > 0 && dialogueChainIdx < chains.length && (
        <div className="space-y-6">
          <DialogueChainPlayer
            key={`${chains[dialogueChainIdx].id}-${dialogueChainIdx}`}
            chain={chains[dialogueChainIdx]}
            onComplete={() => {
              if (dialogueChainIdx < chains.length - 1) {
                setDialogueChainIdx((i) => i + 1);
              } else {
                goNext();
              }
            }}
          />
          {chains.length > 1 && (
            <div className="text-center text-[11px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
              Dialogue {dialogueChainIdx + 1} of {chains.length}
            </div>
          )}
        </div>
      )}

      {phase === 'tasks' && taskPhaseState === 'running' && (
        <TaskRunner
          missionId={step.id}
          questions={[...step.questions, ...recoveryQuestions]}
          confidenceLevel={confidenceLevel}
          challengeMode={isChallengeMode}
          onComplete={(summary: TaskSummary) => {
            setLastSummary(summary);
            setTasksDone(true);
            if (matchedRecoveryFlags.length > 0) {
              setRecoveryCallbackLine(buildRecoveryCallbackLine(step, matchedRecoveryFlags));
            }
            if (step.isCheckpoint && summary.total > 0) {
              const pct = Math.round((summary.correctFirstTry / summary.total) * 100);
              if (pct >= passThreshold) {
                setTaskPhaseState('passed');
              } else {
                setTaskPhaseState('failed');
              }
            } else {
              goNext();
            }
          }}
        />
      )}

      {phase === 'tasks' && taskPhaseState === 'passed' && lastSummary && (() => {
        const pct = Math.round((lastSummary.correctFirstTry / lastSummary.total) * 100);
        const earnedBadge = (() => {
          for (const lvl of jlearnTrack.levels) {
            const hasStep = lvl.units.some((u) => u.steps.some((s) => s.id === step.id));
            if (hasStep) return lvl.badge;
          }
          return null;
        })();
        return (
          <div className="space-y-5">
            {isChallengeMode ? (
              <div className="rounded-[1.6rem] border-2 border-[var(--kt-accent-warning)] bg-[radial-gradient(circle_at_top,var(--kt-accent-warning-soft),transparent_42%),var(--kt-surface-raised)] p-6 text-center shadow-[0_0_0_1px_var(--kt-accent-warning),var(--kt-shadow-md)]">
                <div className="mb-2 text-4xl font-black text-[var(--kt-accent-warning)]">{pct}%</div>
                <div className="text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-accent-warning)]">
                  Challenge Passed
                </div>
                <p className="mt-2 text-sm text-[var(--kt-ink-muted)]">
                  {lastSummary.correctFirstTry} of {lastSummary.total} correct
                </p>
                {primaryCharacterId && (
                  <p className="mt-3 text-xs text-[var(--kt-ink-muted)]">
                    Your relationship with {primaryCharacterId.replace('-', ' ')} has reached stage 3.
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-[1.6rem] border border-[var(--kt-accent-info)] bg-[var(--kt-accent-info-soft)] p-6 text-center shadow-[var(--kt-shadow-sm)]">
                <div className="mb-2 text-4xl font-black text-[var(--kt-accent-info)]">{pct}%</div>
                <div className="text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-accent-info)]">
                  Checkpoint Passed
                </div>
                <p className="mt-2 text-sm text-[var(--kt-ink-muted)]">
                  {lastSummary.correctFirstTry} of {lastSummary.total} correct on first try
                </p>
              </div>
            )}
            {earnedBadge && !isChallengeMode && (
              <div className="rounded-[1.4rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-4 text-center shadow-[var(--kt-shadow-sm)]">
                <div className="mb-1 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                  Badge Earned
                </div>
                <div className="text-lg font-black text-[var(--kt-ink-strong)]">{earnedBadge.name}</div>
                <p className="mt-1 text-xs text-[var(--kt-ink-muted)]">{earnedBadge.description}</p>
              </div>
            )}
            {isChallengeMode && (
              <div className="rounded-[1.4rem] border border-[var(--kt-accent-warning)] bg-[var(--kt-surface-raised)] p-4 text-center shadow-[var(--kt-shadow-sm)]">
                <div className="mb-1 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-accent-warning)]">
                  Challenge Badge
                </div>
                <div className="text-lg font-black text-[var(--kt-ink-strong)]">{step.title}</div>
                <p className="mt-1 text-xs text-[var(--kt-ink-muted)]">Earned with {pct}% — no hints, no second chances.</p>
              </div>
            )}
            <button
              type="button"
              onClick={isChallengeMode ? goNext : goNext}
              className={`w-full rounded-[1.2rem] px-8 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90 ${isChallengeMode ? 'bg-[var(--kt-accent-warning)]' : 'bg-[var(--kt-accent-info)]'}`}
            >
              {isChallengeMode ? 'Claim reward' : 'Continue'}
            </button>
          </div>
        );
      })()}

      {phase === 'tasks' && taskPhaseState === 'failed' && lastSummary && (() => {
        const pct = Math.round((lastSummary.correctFirstTry / lastSummary.total) * 100);
        const missedIds = Object.keys(lastSummary.retriesByQuestion);
        const missedQuestions = step.questions.filter((q) => missedIds.includes(q.id));
        return (
          <div className="space-y-5">
            <div className={`rounded-[1.6rem] border p-6 text-center shadow-[var(--kt-shadow-sm)] ${isChallengeMode ? 'border-[var(--kt-border)] bg-[var(--kt-surface-raised)]' : 'border-red-400 bg-red-500 bg-opacity-10'}`}>
              <div className={`mb-2 text-4xl font-black ${isChallengeMode ? 'text-[var(--kt-ink-muted)]' : 'text-red-500'}`}>{pct}%</div>
              <div className={`text-sm font-black uppercase tracking-[0.14em] ${isChallengeMode ? 'text-[var(--kt-ink-muted)]' : 'text-red-500'}`}>
                {isChallengeMode ? 'Nice try — this one\'s hard.' : `Need ${passThreshold}% to pass`}
              </div>
              <p className="mt-2 text-sm text-[var(--kt-ink-muted)]">
                {lastSummary.correctFirstTry} of {lastSummary.total} correct on first try
              </p>
            </div>
            {missedQuestions.length > 0 && (
              <div className="rounded-[1.4rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-4 shadow-[var(--kt-shadow-sm)]">
                <div className="mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                  Review these
                </div>
                <ul className="space-y-2">
                  {missedQuestions.map((q) => (
                    <li key={q.id} className="text-sm text-[var(--kt-ink)]">
                      <span className="font-semibold">{q.prompt}</span>
                      <span className="ml-2 font-jp text-[var(--kt-ink-muted)]">Expected: {q.correctAnswer}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!isChallengeMode && (
              <button
                type="button"
                onClick={() => {
                  setTaskPhaseState('running');
                  setTasksDone(false);
                  setLastSummary(null);
                }}
                className="w-full rounded-[1.2rem] border border-[var(--kt-border)] px-8 py-4 text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink)] transition hover:bg-[var(--kt-nav-item-hover)]"
              >
                Try again
              </button>
            )}
            <Link
              to={appShellRoutes.learnJapanese}
              className="block w-full rounded-[1.2rem] border border-[var(--kt-border)] px-8 py-4 text-center text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink)] transition hover:bg-[var(--kt-nav-item-hover)]"
            >
              Back to Japanese
            </Link>
          </div>
        );
      })()}

      {phase !== 'tasks' && phase !== 'dialogue' && phase !== 'branching' && phase !== 'complete' && (
        <NavButtons phases={phases} current={phase} onNext={goNext} onBack={goBack} />
      )}
      </div>
      {showLowConfidenceVocab && <LowConfidenceVocabPanel vocabulary={step.vocabulary} />}
      </div>
    </div>
  );
};
