import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { JLearnLevel, JLearnStep, VocabItem } from '../../../learn/data/jlearn/jlearnTypes';
import { appShellRoutes } from '../../../data/appShellContent';
import { TaskRunner, TaskSummary } from '../tasks/TaskRunner';
import { DialogueChainPlayer } from '../dialogue/DialogueChainPlayer';
import { BranchingChoicePanel } from '../branching/BranchingChoicePanel';
import { readProgress, readUserState, writeProgress, writeUserState } from '../../../learn/data/jlearn/jlearnStorage';
import { completeStep } from '../../../learn/data/jlearn/jlearnGating';
import { jlearnTrack } from '../../../learn/data/jlearn/jlearnContent';
import { PracticeQuestion } from '../../../learn/data/jlearn/jlearnTypes';
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
  scenario: 'Senaryo',
  vocab: 'Kelimeler',
  grammar: 'Dilbilgisi',
  examples: 'Örnekler',
  branching: 'Seçim',
  dialogue: 'Diyalog',
  tasks: 'Pratik',
  complete: 'Tamamlandı',
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
  return checkpointUnit.steps.find((s) => s.isCheckpoint)?.id
    ?? checkpointUnit.steps[checkpointUnit.steps.length - 1]?.id
    ?? null;
}

function getCompletedLevelForStep(stepId: string): JLearnLevel | null {
  return jlearnTrack.levels.find((level) => getLevelCheckpointStepId(level) === stepId) ?? null;
}

// ── Top progress bar ──────────────────────────────────────────────────────────

const MissionTopBar: React.FC<{
  step: JLearnStep;
  phases: Phase[];
  current: Phase;
  isChallengeMode: boolean;
}> = ({ step, phases, current, isChallengeMode }) => {
  const visible: Phase[] = phases.filter((p) => p !== 'complete');
  const idx = Math.max(visible.indexOf(current), 0);
  const pct = visible.length > 1 ? Math.round((idx / (visible.length - 1)) * 100) : 0;

  return (
    <div className="sticky top-0 z-20 border-b border-[var(--kt-border-subtle)] bg-[var(--kt-surface)]/90 backdrop-blur">
      {/* thin line */}
      <div className="h-[3px] bg-[var(--kt-progress-track)]">
        <div
          className="h-full bg-[var(--kt-accent-info)] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-3">
        <Link
          to={appShellRoutes.learnJapanese}
          className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)] transition hover:text-[var(--kt-ink)]"
        >
          ← Geri
        </Link>

        <div className="flex items-center gap-1.5">
          {visible.map((p, i) => (
            <div
              key={p}
              title={PHASE_LABELS[p]}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: p === current ? '1.5rem' : '0.375rem',
                background:
                  i < idx
                    ? 'var(--kt-accent-info)'
                    : p === current
                    ? isChallengeMode ? '#f59e0b' : 'var(--kt-accent-info)'
                    : 'var(--kt-border)',
              }}
            />
          ))}
        </div>

        <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
          {isChallengeMode ? '⚔ Challenge' : PHASE_LABELS[current]}
        </span>
      </div>
    </div>
  );
};

// ── Nav buttons ───────────────────────────────────────────────────────────────

const NavButtons: React.FC<{
  phases: Phase[];
  current: Phase;
  onNext: () => void;
  onBack: () => void;
}> = ({ phases, current, onNext, onBack }) => {
  const idx = phases.indexOf(current);
  const isFirst = idx === 0;
  const isBeforeComplete = phases[idx + 1] === 'complete';
  const nextLabel = isBeforeComplete ? 'Pratiğe Başla →' : current === 'scenario' ? 'Başla →' : 'İleri →';

  return (
    <div className="mt-12 flex items-center gap-4">
      {!isFirst && (
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)] transition hover:text-[var(--kt-ink)]"
        >
          ← Geri
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        className="rounded-full bg-[var(--kt-accent-info)] px-8 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-[0_4px_16px_rgba(99,102,241,0.35)] transition hover:opacity-90 hover:-translate-y-0.5"
      >
        {nextLabel}
      </button>
    </div>
  );
};

// ── Low confidence sticky vocab ───────────────────────────────────────────────

const LowConfidenceVocabPanel: React.FC<{ vocabulary: VocabItem[] }> = ({ vocabulary }) => (
  <aside className="sticky top-[4.5rem] rounded-[1.5rem] border border-amber-400/30 bg-[var(--kt-surface)] p-4 shadow-sm">
    <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-amber-500">Kelimeler</p>
    <div className="space-y-2">
      {vocabulary.slice(0, 8).map((v) => (
        <div key={v.id} className="border-b border-[var(--kt-border-subtle)] pb-2 last:border-0">
          <div className="font-jp text-lg font-black text-[var(--kt-ink-strong)]">{v.japanese}</div>
          <div className="text-[11px] text-[var(--kt-ink-muted)]">{v.romaji} · {v.english}</div>
        </div>
      ))}
    </div>
  </aside>
);

// ── Main component ────────────────────────────────────────────────────────────

export const MissionRunner: React.FC<MissionRunnerProps> = ({ step, mode = 'normal', primaryCharacterId }) => {
  const isChallengeMode = mode === 'challenge';
  const phases = useMemo(() => buildPhaseList(step), [step]);
  const [phaseIdx, setPhaseIdx] = useState(0);
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
    setDialogueChainIdx(0);
    setTaskPhaseState('running');
    setLastSummary(null);
    setBranchPicks([]);
    setMatchedRecoveryFlags([]);
    setRecoveryQuestions([]);
    setRecoveryCallbackLine(null);

    const state = readUserState();
    const session = prepareRecoveryMission(step, state.recoveryFlags);
    setMatchedRecoveryFlags(session.matchedFlags);
    setRecoveryQuestions(session.injectedQuestions);

    if (JSON.stringify(session.remainingFlags) !== JSON.stringify(state.recoveryFlags)) {
      writeUserState({ ...state, recoveryFlags: session.remainingFlags });
    }
  }, [step.id]);

  useEffect(() => {
    if (phase === 'complete' && !persistedRef.current) {
      persistedRef.current = true;
      const progress = readProgress();
      const updated = isChallengeMode
        ? {
            ...progress,
            earnedBadgeIds: progress.earnedBadgeIds.includes(step.id)
              ? progress.earnedBadgeIds
              : [...progress.earnedBadgeIds, step.id],
          }
        : completeStep(step.id, progress, jlearnTrack);
      writeProgress(updated);

      const userState = updateUserStateForMission(readUserState(), { step, taskSummary: lastSummary, branchPicks });
      const nextState = {
        ...userState,
        recoveryFlags: userState.recoveryFlags.filter(
          (f) => !matchedRecoveryFlags.some((m) => m.targetId === f.targetId)
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
    emotionalFeedbackTier && step.emotionalFeedback ? step.emotionalFeedback[emotionalFeedbackTier] : null;
  const completedLevel = useMemo(() => getCompletedLevelForStep(step.id), [step.id]);
  const completedLevelBadge = completedLevel?.badge ?? null;
  const completedLevelStoryHook = completedLevel?.storyHook ?? null;
  const isLowConfidence = confidenceLevel === 'low';
  const isHighConfidence = confidenceLevel === 'high';
  const showStickyVocab = isLowConfidence && step.vocabulary.length > 0;

  // ── COMPLETE screen ───────────────────────────────────────────────────────

  if (phase === 'complete') {
    const tier = emotionalFeedbackTier ?? 'good';
    const tierColor: Record<EmotionalFeedbackTier, string> = {
      perfect: '#60a5fa',
      good: '#4ade80',
      struggle: '#94a3b8',
    };
    const color = isChallengeMode ? '#f59e0b' : tierColor[tier];

    return (
      <div className="flex min-h-screen flex-col">
        <div className="sticky top-0 z-20 h-[3px]" style={{ background: color }} />

        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-16 text-center">
          {/* Big checkmark */}
          <div
            className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full text-3xl text-white shadow-lg"
            style={{ background: color, boxShadow: `0 8px 32px ${color}55` }}
          >
            {isChallengeMode ? '⚔' : '✓'}
          </div>

          <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--kt-ink-muted)]">
            {isChallengeMode ? 'Challenge Tamamlandı' : 'Görev Tamamlandı'}
          </p>
          <h1 className="text-3xl font-black text-[var(--kt-ink-strong)]">{step.title}</h1>

          {/* Emotional feedback */}
          {emotionalFeedbackCopy && (
            <p className="mt-6 text-base leading-8 text-[var(--kt-ink-muted)]">{emotionalFeedbackCopy}</p>
          )}

          {/* Recovery callback */}
          {recoveryCallbackLine && (
            <p className="mt-4 text-sm italic leading-7 text-[var(--kt-ink-muted)]">{recoveryCallbackLine}</p>
          )}

          {/* Success message */}
          {step.successMessage && (
            <p className="mt-4 text-sm leading-7 text-[var(--kt-ink-muted)]">{step.successMessage}</p>
          )}

          {/* Level completion: badge + story hook */}
          {completedLevelBadge && (
            <div className="mt-10 space-y-4">
              <div
                className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-black"
                style={{ background: `${color}22`, color }}
              >
                🏅 {completedLevelBadge.name}
              </div>

              {completedLevelStoryHook && (
                <div className="rounded-[1.5rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-6 text-left">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--kt-ink-muted)]">
                    {completedLevelStoryHook.speaker}
                  </p>
                  <p className="font-jp text-2xl font-black leading-loose text-[var(--kt-ink-strong)]">
                    {completedLevelStoryHook.japanese}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--kt-ink-muted)]">
                    {completedLevelStoryHook.translation}
                  </p>
                  <p className="mt-4 text-xs leading-6 text-[var(--kt-ink-muted)]">
                    {completedLevelStoryHook.teaser}
                  </p>
                </div>
              )}
            </div>
          )}

          <Link
            to={appShellRoutes.learnJapanese}
            className="mt-12 inline-block text-sm font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)] transition hover:text-[var(--kt-ink)]"
          >
            ← Haritaya Dön
          </Link>
        </div>
      </div>
    );
  }

  // ── MAIN layout ───────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen flex-col bg-[var(--kt-surface-page)]">
      <MissionTopBar step={step} phases={phases} current={phase} isChallengeMode={isChallengeMode} />

      <div
        className={`mx-auto w-full flex-1 px-5 py-10 sm:px-8 sm:py-14 ${
          showStickyVocab ? 'grid max-w-5xl gap-12 lg:grid-cols-[1fr_17rem]' : 'max-w-2xl'
        }`}
      >
        <div key={`${phase}-${taskPhaseState}-${dialogueChainIdx}`} className="kt-phase-fade">

          {/* Mission title + goal (always visible except on tasks) */}
          {phase !== 'tasks' && phase !== 'dialogue' && phase !== 'branching' && (
            <div className="mb-10">
              <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--kt-ink-muted)]">
                {step.id} {isChallengeMode && '· ⚔ Challenge'}
              </p>
              <h1 className="text-3xl font-black leading-snug text-[var(--kt-ink-strong)] sm:text-4xl">
                {step.title}
              </h1>
              {step.goal && (
                <p className="mt-3 max-w-xl text-base leading-8 text-[var(--kt-ink-muted)]">{step.goal}</p>
              )}
            </div>
          )}

          {/* ── SCENARIO ── */}
          {phase === 'scenario' && (
            <div className="space-y-6">
              {step.scenario && (
                <div className="relative pl-5">
                  <div className="absolute left-0 top-1 h-full w-[3px] rounded-full bg-[var(--kt-accent-info)]" />
                  <p className="text-lg leading-9 text-[var(--kt-ink)]">{step.scenario}</p>
                </div>
              )}
              {isDev && (
                <button
                  type="button"
                  onClick={() => setPhaseIdx(phases.length - 1)}
                  className="text-[11px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-subtle)] underline"
                >
                  Skip to complete
                </button>
              )}
              <NavButtons phases={phases} current={phase} onNext={goNext} onBack={goBack} />
            </div>
          )}

          {/* ── VOCAB ── */}
          {phase === 'vocab' && (
            <div className="space-y-6">
              {isHighConfidence ? (
                <details className="group">
                  <summary className="cursor-pointer list-none text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)] marker:hidden">
                    Kelimeleri göster ({step.vocabulary.length}) ↓
                  </summary>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {step.vocabulary.map((v) => (
                      <VocabTile key={v.id} vocab={v} />
                    ))}
                  </div>
                </details>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {step.vocabulary.map((v) => (
                    <VocabTile key={v.id} vocab={v} />
                  ))}
                </div>
              )}
              <NavButtons phases={phases} current={phase} onNext={goNext} onBack={goBack} />
            </div>
          )}

          {/* ── GRAMMAR ── */}
          {phase === 'grammar' && (
            <div className="space-y-10">
              {step.grammar.map((g) => (
                <div key={g.id} className="space-y-3">
                  <p className="font-jp text-3xl font-black text-[var(--kt-ink-strong)]">{g.pattern}</p>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                    {g.structure}
                  </p>
                  <p className="text-base leading-8 text-[var(--kt-ink)]">{g.explanation}</p>
                  {g.examples.length > 0 && (
                    <ul className="mt-2 space-y-2 border-l-2 border-[var(--kt-border-subtle)] pl-4">
                      {g.examples.map((ex, i) => (
                        <li key={i} className="text-sm leading-6 text-[var(--kt-ink-muted)]">{ex}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <NavButtons phases={phases} current={phase} onNext={goNext} onBack={goBack} />
            </div>
          )}

          {/* ── EXAMPLES ── */}
          {phase === 'examples' && (
            <div className="space-y-6">
              {step.examples.map((ex, i) => (
                <div key={ex.id} className="flex gap-5">
                  <span className="mt-1 shrink-0 text-[11px] font-black text-[var(--kt-ink-subtle)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-jp text-xl font-black leading-loose text-[var(--kt-ink-strong)]">{ex.japanese}</p>
                    <p className="mt-0.5 text-xs text-[var(--kt-ink-muted)]">{ex.romaji}</p>
                    <p className="mt-1 text-sm text-[var(--kt-ink-muted)]">{ex.english}</p>
                  </div>
                </div>
              ))}
              <NavButtons phases={phases} current={phase} onNext={goNext} onBack={goBack} />
            </div>
          )}

          {/* ── BRANCHING ── */}
          {phase === 'branching' && step.branchingChoice && (
            <BranchingChoicePanel
              branchingChoice={step.branchingChoice}
              compact={isHighConfidence}
              onContinue={goNext}
              onPicked={(pick) => {
                setBranchPicks((cur) => [...cur, { label: pick.option.label, result: pick.result }]);
                if (pick.result === 'partial') {
                  const target = resolveRecoveryTarget(step, pick);
                  if (target) {
                    const state = readUserState();
                    writeUserState({
                      ...state,
                      recoveryFlags: upsertRecoveryFlag(state.recoveryFlags, target.targetId, new Date().toISOString()),
                    });
                  }
                }
              }}
            />
          )}

          {/* ── DIALOGUE ── */}
          {phase === 'dialogue' && chains.length > 0 && dialogueChainIdx < chains.length && (
            <div className="space-y-4">
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
                <p className="text-center text-[11px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">
                  Diyalog {dialogueChainIdx + 1} / {chains.length}
                </p>
              )}
            </div>
          )}

          {/* ── TASKS: running ── */}
          {phase === 'tasks' && taskPhaseState === 'running' && (
            <TaskRunner
              missionId={step.id}
              questions={[...step.questions, ...recoveryQuestions]}
              confidenceLevel={confidenceLevel}
              challengeMode={isChallengeMode}
              onComplete={(summary: TaskSummary) => {
                setLastSummary(summary);
                if (matchedRecoveryFlags.length > 0) {
                  setRecoveryCallbackLine(buildRecoveryCallbackLine(step, matchedRecoveryFlags));
                }
                if (step.isCheckpoint && summary.total > 0) {
                  const pct = Math.round((summary.correctFirstTry / summary.total) * 100);
                  setTaskPhaseState(pct >= passThreshold ? 'passed' : 'failed');
                } else {
                  goNext();
                }
              }}
            />
          )}

          {/* ── TASKS: passed ── */}
          {phase === 'tasks' && taskPhaseState === 'passed' && lastSummary && (() => {
            const pct = Math.round((lastSummary.correctFirstTry / lastSummary.total) * 100);
            const color = isChallengeMode ? '#f59e0b' : '#4ade80';
            const earnedBadge = jlearnTrack.levels.find((l) =>
              l.units.some((u) => u.steps.some((s) => s.id === step.id))
            )?.badge ?? null;

            return (
              <div className="space-y-8 text-center">
                <div>
                  <p
                    className="text-6xl font-black tabular-nums"
                    style={{ color }}
                  >
                    {pct}%
                  </p>
                  <p className="mt-2 text-sm font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                    {isChallengeMode ? 'Challenge Geçildi' : 'Checkpoint Geçildi'}
                  </p>
                  <p className="mt-1 text-xs text-[var(--kt-ink-muted)]">
                    {lastSummary.correctFirstTry} / {lastSummary.total} ilk denemede doğru
                  </p>
                </div>

                {earnedBadge && !isChallengeMode && (
                  <div
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-black"
                    style={{ background: `${color}22`, color }}
                  >
                    🏅 {earnedBadge.name}
                  </div>
                )}

                {isChallengeMode && primaryCharacterId && (
                  <p className="text-xs text-[var(--kt-ink-muted)]">
                    {primaryCharacterId.replace('-', ' ')} ile ilişkin seviye 3'e ulaştı.
                  </p>
                )}

                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-full px-8 py-3 text-sm font-black uppercase tracking-[0.14em] text-white shadow-lg transition hover:opacity-90"
                  style={{ background: color, boxShadow: `0 4px 20px ${color}55` }}
                >
                  Devam Et →
                </button>
              </div>
            );
          })()}

          {/* ── TASKS: failed ── */}
          {phase === 'tasks' && taskPhaseState === 'failed' && lastSummary && (() => {
            const pct = Math.round((lastSummary.correctFirstTry / lastSummary.total) * 100);
            const missedIds = Object.keys(lastSummary.retriesByQuestion);
            const missedQuestions = step.questions.filter((q) => missedIds.includes(q.id));

            return (
              <div className="space-y-8">
                <div className="text-center">
                  <p className="text-6xl font-black tabular-nums text-[var(--kt-ink-muted)]">{pct}%</p>
                  <p className="mt-2 text-sm font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                    {isChallengeMode ? 'Bu sefer olmadı — tekrar dene' : `Geçmek için %${passThreshold} gerekli`}
                  </p>
                  <p className="mt-1 text-xs text-[var(--kt-ink-muted)]">
                    {lastSummary.correctFirstTry} / {lastSummary.total}
                  </p>
                </div>

                {missedQuestions.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                      Tekrar Bak
                    </p>
                    {missedQuestions.map((q) => (
                      <div key={q.id} className="border-l-2 border-[var(--kt-border)] pl-4">
                        <p className="text-sm font-semibold text-[var(--kt-ink)]">{q.prompt}</p>
                        <p className="font-jp text-base text-[var(--kt-ink-muted)]">{q.correctAnswer}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  {!isChallengeMode && (
                    <button
                      type="button"
                      onClick={() => { setTaskPhaseState('running'); setLastSummary(null); }}
                      className="rounded-full bg-[var(--kt-accent-info)] px-8 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90"
                    >
                      Tekrar Dene →
                    </button>
                  )}
                  <Link
                    to={appShellRoutes.learnJapanese}
                    className="text-center text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)] transition hover:text-[var(--kt-ink)]"
                  >
                    ← Haritaya Dön
                  </Link>
                </div>
              </div>
            );
          })()}

        </div>

        {/* Sticky vocab for low confidence */}
        {showStickyVocab && <LowConfidenceVocabPanel vocabulary={step.vocabulary} />}
      </div>
    </div>
  );
};

// ── Vocab tile ────────────────────────────────────────────────────────────────

const VocabTile: React.FC<{ vocab: VocabItem }> = ({ vocab }) => (
  <div className="flex items-start gap-3 rounded-[1.2rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface)] p-4 transition hover:border-[var(--kt-accent-info-soft)]">
    <div className="min-w-0 flex-1">
      <p className="font-jp text-2xl font-black text-[var(--kt-ink-strong)]">{vocab.japanese}</p>
      {vocab.kanji && vocab.kanji !== vocab.japanese && (
        <p className="mt-0.5 font-jp text-sm text-[var(--kt-ink-muted)]">{vocab.kanji}</p>
      )}
      <p className="mt-1 text-[11px] font-semibold text-[var(--kt-ink-muted)]">{vocab.romaji}</p>
    </div>
    <p className="shrink-0 text-right text-sm text-[var(--kt-ink)]">{vocab.english}</p>
  </div>
);
