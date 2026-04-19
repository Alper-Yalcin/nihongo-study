import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { JLearnStep } from '../../../data/jlearn/jlearnTypes';
import { appShellRoutes } from '../../../data/appShellContent';
import { TaskRunner, TaskSummary } from '../tasks/TaskRunner';
import { DialogueChainPlayer } from '../dialogue/DialogueChainPlayer';
import { BranchingChoicePanel } from '../branching/BranchingChoicePanel';
import { readProgress, writeProgress } from '../../../data/jlearn/jlearnStorage';
import { completeStep } from '../../../data/jlearn/jlearnGating';
import { jlearnTrack } from '../../../data/jlearn/jlearnContent';

type Phase = 'scenario' | 'vocab' | 'grammar' | 'examples' | 'branching' | 'dialogue' | 'tasks' | 'complete';

interface MissionRunnerProps {
  step: JLearnStep;
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

interface NavBarProps {
  phases: Phase[];
  current: Phase;
}

const PhaseNavBar: React.FC<NavBarProps> = ({ phases, current }) => {
  const visiblePhases = phases.filter((p) => p !== 'complete');
  return (
    <div className="mb-8 flex items-center gap-1.5">
      {visiblePhases.map((p, i) => (
        <React.Fragment key={p}>
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              p === current
                ? 'bg-[var(--kt-accent-info)]'
                : visiblePhases.indexOf(current) > i
                ? 'bg-[var(--kt-accent-info)] opacity-40'
                : 'bg-[var(--kt-border)]'
            }`}
          />
        </React.Fragment>
      ))}
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
          ← Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        className="rounded-[1.2rem] bg-[var(--kt-accent-info)] px-8 py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90"
      >
        {nextLabel} →
      </button>
    </div>
  );
};

export const MissionRunner: React.FC<MissionRunnerProps> = ({ step }) => {
  const phases = useMemo(() => buildPhaseList(step), [step]);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [tasksDone, setTasksDone] = useState(false);
  const [dialogueChainIdx, setDialogueChainIdx] = useState(0);
  const phase = phases[phaseIdx];

  const chains = step.dialogueChains ?? [];
  const persistedRef = useRef(false);
  const passThreshold = step.minPassScore ?? 80;
  type TaskPhaseState = 'running' | 'passed' | 'failed';
  const [taskPhaseState, setTaskPhaseState] = useState<TaskPhaseState>('running');
  const [lastSummary, setLastSummary] = useState<TaskSummary | null>(null);

  useEffect(() => {
    if (phase === 'complete' && !persistedRef.current) {
      persistedRef.current = true;
      const updated = completeStep(step.id, readProgress(), jlearnTrack);
      writeProgress(updated);
    }
  }, [phase, step.id]);

  const goNext = () => setPhaseIdx((i) => Math.min(i + 1, phases.length - 1));
  const goBack = () => setPhaseIdx((i) => Math.max(i - 1, 0));

  const header = (
    <div className="mb-6">
      <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[var(--kt-accent-info)]">
        {step.id} · {PHASE_LABELS[phase]}
      </span>
      <h1 className="mt-1 text-2xl font-black text-[var(--kt-ink-strong)]">{step.title}</h1>
    </div>
  );

  if (phase === 'complete') {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-10">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--kt-accent-info)] text-3xl text-white">
            ✓
          </div>
          <h2 className="text-2xl font-black text-[var(--kt-ink-strong)]">Mission Complete</h2>
          {step.successMessage && (
            <p className="max-w-md text-base leading-7 text-[var(--kt-ink-muted)]">
              {step.successMessage}
            </p>
          )}
        </div>
        <div className="flex justify-center">
          <Link
            to={appShellRoutes.learnJapanese}
            className="rounded-[1.2rem] border border-[var(--kt-border)] px-8 py-4 text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink)] transition hover:bg-[var(--kt-nav-item-hover)]"
          >
            ← Back to Japanese
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      {header}
      <PhaseNavBar phases={phases} current={phase} />

      {phase === 'scenario' && (
        <>
          {step.scenario && (
            <div className="mb-5 rounded-[1.2rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-5">
              <div className="mb-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                Scenario
              </div>
              <p className="text-base leading-7 text-[var(--kt-ink)]">{step.scenario}</p>
            </div>
          )}
          {step.goal && (
            <div className="rounded-[1.2rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-5">
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

      {phase === 'vocab' && (
        <div className="overflow-hidden rounded-[1.2rem] border border-[var(--kt-border-subtle)]">
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
              className="rounded-[1.2rem] border-l-4 border-[var(--kt-accent-info)] bg-[var(--kt-surface-raised)] p-5"
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
              className="rounded-[1.2rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-4"
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
          onContinue={goNext}
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
          questions={step.questions}
          onComplete={(summary: TaskSummary) => {
            setLastSummary(summary);
            setTasksDone(true);
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
        const badge = jlearnTrack.levels
          .flatMap((l) => (l.badge ? [l.badge] : []))
          .find((b) => step.id.startsWith(b.id.split('-')[0]) || true);
        const earnedBadge = (() => {
          for (const lvl of jlearnTrack.levels) {
            const hasStep = lvl.units.some((u) => u.steps.some((s) => s.id === step.id));
            if (hasStep) return lvl.badge;
          }
          return null;
        })();
        return (
          <div className="space-y-5">
            <div className="rounded-[1.4rem] border border-[var(--kt-accent-info)] bg-[var(--kt-accent-info)] bg-opacity-10 p-6 text-center">
              <div className="mb-2 text-4xl font-black text-[var(--kt-accent-info)]">{pct}%</div>
              <div className="text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-accent-info)]">
                Checkpoint Passed
              </div>
              <p className="mt-2 text-sm text-[var(--kt-ink-muted)]">
                {lastSummary.correctFirstTry} of {lastSummary.total} correct on first try
              </p>
            </div>
            {earnedBadge && (
              <div className="rounded-[1.2rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-4 text-center">
                <div className="mb-1 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                  Badge Earned
                </div>
                <div className="text-lg font-black text-[var(--kt-ink-strong)]">{earnedBadge.name}</div>
                <p className="mt-1 text-xs text-[var(--kt-ink-muted)]">{earnedBadge.description}</p>
              </div>
            )}
            <button
              type="button"
              onClick={goNext}
              className="w-full rounded-[1.2rem] bg-[var(--kt-accent-info)] px-8 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90"
            >
              Continue →
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
            <div className="rounded-[1.4rem] border border-red-400 bg-red-500 bg-opacity-10 p-6 text-center">
              <div className="mb-2 text-4xl font-black text-red-500">{pct}%</div>
              <div className="text-sm font-black uppercase tracking-[0.14em] text-red-500">
                Need {passThreshold}% to pass
              </div>
              <p className="mt-2 text-sm text-[var(--kt-ink-muted)]">
                {lastSummary.correctFirstTry} of {lastSummary.total} correct on first try
              </p>
            </div>
            {missedQuestions.length > 0 && (
              <div className="rounded-[1.2rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-4">
                <div className="mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-ink-muted)]">
                  Review these
                </div>
                <ul className="space-y-2">
                  {missedQuestions.map((q) => (
                    <li key={q.id} className="text-sm text-[var(--kt-ink)]">
                      <span className="font-semibold">{q.prompt}</span>
                      <span className="ml-2 font-jp text-[var(--kt-ink-muted)]">→ {q.correctAnswer}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
          </div>
        );
      })()}

      {phase !== 'tasks' && phase !== 'dialogue' && phase !== 'branching' && phase !== 'complete' && (
        <NavButtons phases={phases} current={phase} onNext={goNext} onBack={goBack} />
      )}
    </div>
  );
};
