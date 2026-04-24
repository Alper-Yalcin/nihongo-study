import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  jlearnTrack,
  getAllJLearnGrammarPoints,
  getAllJLearnSteps,
  getAllJLearnVocabItems,
} from '../../../data/jlearn/jlearnContent';
import {
  readProgress,
  writeProgress,
  readVocab,
  writeVocab,
  validateVocabProgress,
} from '../../../data/jlearn/jlearnStorage';
import { completeStep } from '../../../data/jlearn/jlearnGating';
import {
  getJLearnUserState,
  getJLearnFeatureFlags,
  setJLearnFeatureFlags,
  setJLearnUserState,
  resetJLearnUserState,
  jumpToStep,
  forceConfidence,
  forceRelationship,
  forceMissedDays,
  JLEARN_USER_STATE_KEY,
  JLEARN_ACTIVE_STEP_KEY,
  JLEARN_RELATIONSHIP_CHARACTER_IDS,
  JLearnUserState,
  defaultUserState
} from './debugStore';

export const DebugPanel: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isDev = Boolean((import.meta as unknown as { env?: { DEV?: boolean } }).env?.DEV);
  const enabled = isDev && params.get('debug') === '1';

  const [tick, setTick] = useState(0);
  const refresh = () => setTick((n) => n + 1);

  const state = useMemo<JLearnUserState>(() => getJLearnUserState(), [tick]);
  const featureFlags = useMemo(() => getJLearnFeatureFlags(), [tick]);
  const progress = useMemo(() => readProgress(), [tick]);
  const activeStepId = useMemo<string | null>(() => {
    try {
      return window.localStorage.getItem(JLEARN_ACTIVE_STEP_KEY);
    } catch {
      return null;
    }
  }, [tick]);

  const allSteps = useMemo(() => getAllJLearnSteps(), []);
  const vocabById = useMemo(
    () => new Map(getAllJLearnVocabItems().map((item) => [item.id, item])),
    []
  );
  const grammarById = useMemo(
    () => new Map(getAllJLearnGrammarPoints().map((item) => [item.id, item])),
    []
  );
  const l1CheckpointStep = useMemo(() => {
    const level = jlearnTrack.levels.find((item) => item.id === 'JL1');
    const checkpointUnit = level?.units.find((unit) => unit.id === level.checkpointUnitId);
    return checkpointUnit?.steps.find((step) => step.isCheckpoint) ?? checkpointUnit?.steps.at(-1) ?? null;
  }, []);

  if (!enabled) return null;

  const onReset = () => {
    resetJLearnUserState();
    refresh();
  };

  const onJump = (stepId: string) => {
    jumpToStep(stepId);
    refresh();
  };

  const onConfidence = (value: JLearnUserState['confidenceLevel']) => {
    forceConfidence(value);
    refresh();
  };

  const onRelationship = (characterId: string, value: 0 | 1 | 2 | 3) => {
    forceRelationship(characterId, value);
    refresh();
  };

  const onMissedDays = (value: number) => {
    forceMissedDays(value);
    refresh();
  };

  const onRawEdit = (next: Partial<JLearnUserState>) => {
    setJLearnUserState({ ...state, ...next });
    refresh();
  };

  const onFakeTomorrow = () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    onRawEdit({
      lastSessionAt: yesterday,
      missedDays: 0,
      streakDays: Math.max(1, state.streakDays),
    });
  };

  const onChallengeFlag = (enabledFlag: boolean) => {
    setJLearnFeatureFlags({ ...featureFlags, challengeCta: enabledFlag });
    refresh();
  };

  const onMarkL1Checkpoint = () => {
    if (!l1CheckpointStep) return;
    writeProgress(completeStep(l1CheckpointStep.id, readProgress(), jlearnTrack));
    setJLearnFeatureFlags(featureFlags);
    refresh();
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] w-[22rem] max-h-[80vh] overflow-auto rounded-xl border border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-4 text-xs shadow-[var(--kt-shadow-lg)]">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-black uppercase tracking-[0.16em] text-[var(--kt-accent-info)]">
          JLearn Debug
        </span>
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-[var(--kt-border)] px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink)] hover:bg-[var(--kt-nav-item-hover)]"
        >
          Reset
        </button>
      </div>

      <section className="mb-3">
        <div className="mb-1 font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">State</div>
        <pre className="rounded-md bg-[var(--kt-surface-page)] p-2 text-[10px] leading-4 text-[var(--kt-ink)] whitespace-pre-wrap break-all">
{JSON.stringify({ activeStepId, ...state }, null, 2)}
        </pre>
      </section>

      <section className="mb-3">
        <div className="mb-1 font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">Challenge CTA</div>
        <div className="rounded-md bg-[var(--kt-surface-page)] p-2 text-[10px] leading-4 text-[var(--kt-ink)]">
          <div>Flag: {featureFlags.challengeCta ? 'on' : 'off'}</div>
          <div>L1 checkpoint: {l1CheckpointStep?.id ?? 'missing'}</div>
          <div>L1 passed: {progress.completedLevelIds.includes('JL1') ? 'yes' : 'no'}</div>
        </div>
        <div className="mt-1 grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => onChallengeFlag(!featureFlags.challengeCta)}
            className={`rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
              featureFlags.challengeCta
                ? 'border-[var(--kt-accent-warning)] text-[var(--kt-accent-warning)]'
                : 'border-[var(--kt-border)] text-[var(--kt-ink)] hover:bg-[var(--kt-nav-item-hover)]'
            }`}
          >
            {featureFlags.challengeCta ? 'Flag on' : 'Flag off'}
          </button>
          <button
            type="button"
            onClick={onMarkL1Checkpoint}
            disabled={!l1CheckpointStep}
            className="rounded-md border border-[var(--kt-border)] px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink)] hover:bg-[var(--kt-nav-item-hover)] disabled:opacity-40"
          >
            Pass L1 CP
          </button>
        </div>
      </section>

      <section className="mb-3">
        <div className="mb-1 font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">Vocab Progress</div>
        <pre className="rounded-md bg-[var(--kt-surface-page)] p-2 text-[10px] leading-4 text-[var(--kt-ink)] whitespace-pre-wrap break-all">
{JSON.stringify(readVocab(), null, 2)}
        </pre>
      </section>

      <section className="mb-3">
        <div className="mb-1 font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">Jump to Mission</div>
        <select
          value={activeStepId ?? ''}
          onChange={(e) => onJump(e.target.value)}
          className="w-full rounded-md border border-[var(--kt-border)] bg-[var(--kt-surface-page)] p-1 text-[11px]"
        >
          <option value="">(none)</option>
          {allSteps.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id} — {s.title}
            </option>
          ))}
        </select>
      </section>

      <section className="mb-3">
        <label
          htmlFor="jlearn-debug-confidence"
          className="mb-1 block font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]"
        >
          Confidence
        </label>
        <select
          id="jlearn-debug-confidence"
          value={state.confidenceLevel}
          onChange={(e) => onConfidence(e.target.value as JLearnUserState['confidenceLevel'])}
          className="w-full rounded-md border border-[var(--kt-border)] bg-[var(--kt-surface-page)] p-1 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--kt-ink)]"
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
      </section>

      <section className="mb-3">
        <div className="mb-1 font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">Relationships</div>
        {JLEARN_RELATIONSHIP_CHARACTER_IDS.map((charId) => (
          <div key={charId} className="mb-1 flex items-center justify-between gap-2">
            <span className="truncate text-[11px]">{charId}</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onRelationship(charId, n as 0 | 1 | 2 | 3)}
                  className={`h-6 w-6 rounded-md border text-[10px] font-black ${
                    (state.relationshipLevels[charId] ?? 0) === n
                      ? 'border-[var(--kt-accent-info)] text-[var(--kt-accent-info)]'
                      : 'border-[var(--kt-border)] text-[var(--kt-ink)]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mb-3">
        <div className="mb-1 font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">Missed Days</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onMissedDays(Math.max(0, state.missedDays - 1))}
            className="rounded-md border border-[var(--kt-border)] px-2 py-1 text-[10px] font-black"
          >
            −
          </button>
          <span className="flex-1 text-center font-mono text-[12px]">{state.missedDays}</span>
          <button
            type="button"
            onClick={() => onMissedDays(state.missedDays + 1)}
            className="rounded-md border border-[var(--kt-border)] px-2 py-1 text-[10px] font-black"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => onMissedDays(3)}
            className="rounded-md border border-[var(--kt-border)] px-2 py-1 text-[10px] font-black"
          >
            3
          </button>
          <button
            type="button"
            onClick={() => onMissedDays(7)}
            className="rounded-md border border-[var(--kt-border)] px-2 py-1 text-[10px] font-black"
          >
            7
          </button>
        </div>
      </section>

      <section className="mb-3">
        <div className="mb-1 font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">Session Timing</div>
        <div className="rounded-md bg-[var(--kt-surface-page)] p-2 text-[10px] leading-4 text-[var(--kt-ink)]">
          <div>Streak: {state.streakDays}</div>
          <div>Last: {state.lastSessionAt ?? 'none'}</div>
        </div>
        <button
          type="button"
          onClick={onFakeTomorrow}
          className="mt-1 w-full rounded-md border border-[var(--kt-border)] px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink)] hover:bg-[var(--kt-nav-item-hover)]"
        >
          Fake tomorrow for streak
        </button>
      </section>

      <section className="mb-3">
        <div className="mb-1 font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">Formality</div>
        <div className="flex gap-1">
          {(['casual', 'neutral', 'polite'] as const).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => onRawEdit({ formalityPreference: fmt })}
              className={`flex-1 rounded-md border px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                state.formalityPreference === fmt
                  ? 'border-[var(--kt-accent-info)] text-[var(--kt-accent-info)]'
                  : 'border-[var(--kt-border)] text-[var(--kt-ink)] hover:bg-[var(--kt-nav-item-hover)]'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-3">
        <div className="mb-1 font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">Recovery Flags</div>
        {state.recoveryFlags.length === 0 ? (
          <div className="rounded-md bg-[var(--kt-surface-page)] p-2 text-[10px] text-[var(--kt-ink-muted)]">
            none
          </div>
        ) : (
          <div className="space-y-1">
            {state.recoveryFlags.map((flag) => {
              const vocab = vocabById.get(flag.targetId);
              const grammar = grammarById.get(flag.targetId);
              const label = vocab?.japanese ?? grammar?.pattern ?? flag.targetId;

              return (
                <div
                  key={`${flag.targetId}-${flag.createdAt}`}
                  className="rounded-md bg-[var(--kt-surface-page)] p-2 text-[10px] leading-4 text-[var(--kt-ink)]"
                >
                  <div className="font-black text-[var(--kt-ink-strong)]">{label}</div>
                  <div>ID: {flag.targetId}</div>
                  <div>Missions left: {flag.missionsRemaining}</div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="mb-3">
        <div className="mb-1 font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)]">Storage</div>
        <button
          type="button"
          onClick={() => {
            const fixture = readProgress();
            writeProgress(fixture);
            const roundTrip = readProgress();
            const ok = JSON.stringify(fixture) === JSON.stringify(roundTrip);
            console.log('[jlearnStorage] progress round-trip:', ok ? 'PASS' : 'FAIL', roundTrip);
            refresh();
          }}
          className="mb-1 w-full rounded-md border border-[var(--kt-border)] px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink)] hover:bg-[var(--kt-nav-item-hover)]"
        >
          Test progress round-trip (console)
        </button>
        <button
          type="button"
          onClick={() => {
            const fixture = readVocab();
            writeVocab(fixture);
            const roundTrip = readVocab();
            const ok = JSON.stringify(fixture) === JSON.stringify(roundTrip);
            console.log('[jlearnStorage] vocab round-trip:', ok ? 'PASS' : 'FAIL', roundTrip);
          }}
          className="w-full rounded-md border border-[var(--kt-border)] px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink)] hover:bg-[var(--kt-nav-item-hover)]"
        >
          Test vocab round-trip (console)
        </button>
        <button
          type="button"
          onClick={() => {
            const issues = validateVocabProgress(readVocab());
            console.log('[jlearnStorage] validateVocabProgress:', issues.length === 0 ? 'PASS' : 'FAIL', issues);
          }}
          className="mt-1 w-full rounded-md border border-[var(--kt-border)] px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--kt-ink)] hover:bg-[var(--kt-nav-item-hover)]"
        >
          Validate vocab progress (console)
        </button>
      </section>

      <section className="text-[10px] text-[var(--kt-ink-muted)]">
        <div>Levels: {jlearnTrack.levels.length}</div>
        <div>Steps: {allSteps.length}</div>
        <div>Store: {JLEARN_USER_STATE_KEY}</div>
        <div>Defaults match baseline: {JSON.stringify(state) === JSON.stringify(defaultUserState) ? 'yes' : 'no'}</div>
      </section>
    </div>
  );
};

export default DebugPanel;
