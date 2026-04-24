import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { getJLearnLevel } from '../data/jlearn/jlearnContent';
import { appShellRoutes } from '../data/appShellContent';
import { DebugPanel } from '../features/jlearn/debug/DebugPanel';
import { MissionRunner } from '../features/jlearn/mission/MissionRunner';
import { isLevelCheckpointPassed } from '../features/jlearn/challenge/challengeReadiness';
import { readProgress } from '../data/jlearn/jlearnStorage';

const LEVEL_PRIMARY_CHARACTER: Record<string, string> = {
  JL1: 'mrs-tanaka',
  JL2: 'yuki',
  JL3: 'obaasan',
  JL4: 'yuki',
  JL5: 'mrs-tanaka',
  JL6: 'mrs-tanaka',
  JL7: 'yuki',
  JL8: 'mrs-tanaka',
  JL9: 'yuki',
  JL10: 'yuki',
  JL11: 'yuki',
  JL12: 'yuki',
  JL13: 'yuki',
  JL14: 'mrs-tanaka',
};

export const ChallengeMissionPage: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const level = levelId ? getJLearnLevel(levelId) : undefined;

  if (!level || !level.challengeMission) {
    return <Navigate to={appShellRoutes.learnJapanese} replace />;
  }

  const progress = readProgress();
  const checkpointPassed = isLevelCheckpointPassed(level, progress);

  if (!checkpointPassed) {
    return (
      <div className="mx-auto w-full max-w-xl px-6 py-16 text-center">
        <div className="rounded-[2rem] border border-[var(--kt-border-subtle)] bg-[var(--kt-surface-raised)] p-8 shadow-[var(--kt-shadow-md)]">
          <div className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--kt-accent-warning)]">
            Challenge locked
          </div>
          <h1 className="text-2xl font-black text-[var(--kt-ink-strong)]">
            {level.title} Challenge
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--kt-ink-muted)]">
            Complete the Level {level.id} checkpoint with at least 80% to unlock this challenge.
          </p>
          <Link
            to={appShellRoutes.learnJapanese}
            className="mt-6 inline-block rounded-[1.2rem] bg-[var(--kt-accent-info)] px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:opacity-90"
          >
            Back to map
          </Link>
        </div>
        <DebugPanel />
      </div>
    );
  }

  const primaryCharacterId = LEVEL_PRIMARY_CHARACTER[level.id];

  return (
    <>
      <MissionRunner
        step={level.challengeMission}
        mode="challenge"
        primaryCharacterId={primaryCharacterId}
      />
      <DebugPanel />
    </>
  );
};

export default ChallengeMissionPage;
