import React, { useEffect, useState } from 'react';
import { readUserState, writeUserState } from '../../../data/jlearn/jlearnStorage';
import {
  getJLearnUserState,
  JLearnUserState,
  subscribeJLearnUserState,
} from '../debug/debugStore';
import { TaskRunner, TaskSummary } from '../tasks/TaskRunner';
import { buildReEntryRefreshSession, WarmupSession } from '../warmup/WarmupRunner';

type ReEntryMode = 'splash' | 'review' | 'complete';

function clearMissedDays(): void {
  const state = readUserState();
  writeUserState({
    ...state,
    missedDays: 0,
    lastSessionAt: new Date().toISOString(),
  });
}

export const ReEntrySplash: React.FC = () => {
  const [userState, setUserState] = useState<JLearnUserState>(() => getJLearnUserState());
  const [mode, setMode] = useState<ReEntryMode>('splash');
  const [dismissed, setDismissed] = useState(false);
  const [session, setSession] = useState<WarmupSession | null>(null);
  const [summary, setSummary] = useState<TaskSummary | null>(null);

  useEffect(
    () => subscribeJLearnUserState(() => setUserState(getJLearnUserState())),
    []
  );

  if (dismissed) return null;
  if (mode === 'splash' && userState.missedDays < 3) return null;

  const close = () => {
    setDismissed(true);
  };

  const startRefresh = () => {
    setSession(buildReEntryRefreshSession(userState, 10));
    setSummary(null);
    setMode('review');
  };

  const finishRefresh = (nextSummary: TaskSummary) => {
    setSummary(nextSummary);
    clearMissedDays();
    setMode('complete');
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/35 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-[var(--kt-border-subtle)] bg-[radial-gradient(circle_at_top_left,var(--kt-accent-warning-soft),transparent_38%),var(--kt-surface)] shadow-[var(--kt-shadow-lg)]">
        {mode === 'splash' && (
          <div className="p-6 sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1rem] bg-rose-400 text-lg font-black text-white shadow-[var(--kt-shadow-sm)] ring-4 ring-[var(--kt-accent-warning-soft)]">
                  T
                </div>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-accent-warning)]">
                    Mrs. Tanaka
                  </div>
                  <h2 className="mt-1 text-2xl font-black text-[var(--kt-ink-strong)]">
                    Welcome back
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                className="rounded-full border border-[var(--kt-border)] bg-[var(--kt-surface)] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)] transition hover:bg-[var(--kt-nav-item-hover)]"
              >
                Later
              </button>
            </div>

            <div className="rounded-[1.5rem] border border-[color:var(--kt-accent-warning)]/35 bg-[var(--kt-surface-raised)] p-5">
              <p className="font-jp text-2xl font-black leading-relaxed text-[var(--kt-ink-strong)]">
                おかえりなさい。少しだけ復習しましょう。
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--kt-ink-muted)]">
                You have been away for {userState.missedDays} days. I prepared a short 10-question vocab refresh from weak and due items.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs leading-5 text-[var(--kt-ink-muted)]">
                This will not move your mission position. It only refreshes SRS vocab progress.
              </div>
              <button
                type="button"
                onClick={startRefresh}
                className="rounded-[1.2rem] bg-[var(--kt-accent-info)] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90"
              >
                Refresh vocab
              </button>
            </div>
          </div>
        )}

        {mode === 'review' && session && (
          <div className="max-h-[88vh] overflow-auto p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-accent-info)]">
                  Welcome-back refresh
                </div>
                <h2 className="mt-1 text-2xl font-black text-[var(--kt-ink-strong)]">
                  10-question vocab review
                </h2>
                <p className="mt-2 text-sm text-[var(--kt-ink-muted)]">
                  Drawn from {session.dueCount} weak, due, or recent vocab item{session.dueCount === 1 ? '' : 's'}.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="rounded-full border border-[var(--kt-border)] bg-[var(--kt-surface)] px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-[var(--kt-ink-muted)] transition hover:bg-[var(--kt-nav-item-hover)]"
              >
                Close
              </button>
            </div>
            {session.questions.length > 0 ? (
              <TaskRunner
                missionId="reentry-refresh"
                questions={session.questions}
                confidenceLevel={session.confidenceLevel}
                onComplete={finishRefresh}
              />
            ) : (
              <div className="rounded-[1.4rem] border border-dashed border-[var(--kt-border)] bg-[var(--kt-surface-raised)] p-6 text-center">
                <div className="text-lg font-black text-[var(--kt-ink-strong)]">No refresh items yet</div>
                <p className="mt-2 text-sm text-[var(--kt-ink-muted)]">
                  Complete a few Japanese missions first so the review queue has vocab to pull from.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-5 rounded-[1.1rem] border border-[var(--kt-border)] px-5 py-2.5 text-sm font-black uppercase tracking-[0.14em] text-[var(--kt-ink)] transition hover:bg-[var(--kt-nav-item-hover)]"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        )}

        {mode === 'complete' && summary && (
          <div className="p-6 text-center sm:p-7">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--kt-accent-info)] text-sm font-black text-white shadow-[var(--kt-shadow-sm)]">
              OK
            </div>
            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-[var(--kt-accent-info)]">
              Refresh complete
            </div>
            <h2 className="mt-1 text-2xl font-black text-[var(--kt-ink-strong)]">
              You are back in rhythm
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--kt-ink-muted)]">
              {summary.correctFirstTry} of {summary.total} correct on first try. Missed-day count has been cleared.
            </p>
            <button
              type="button"
              onClick={close}
              className="mt-6 rounded-[1.2rem] bg-[var(--kt-accent-info)] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReEntrySplash;
