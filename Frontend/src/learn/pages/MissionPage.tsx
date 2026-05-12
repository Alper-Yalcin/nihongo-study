import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getJLearnLevelForStep, getJLearnStep } from '../data/jlearn/jlearnContent';
import { DebugPanel } from '../../features/jlearn/debug/DebugPanel';
import { MissionRunner } from '../../features/jlearn/mission/MissionRunner';
import { WarmupRunner, buildWarmupSession } from '../../features/jlearn/warmup/WarmupRunner';
import { appShellRoutes } from '../../data/appShellContent';

export const MissionPage: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const step = stepId ? getJLearnStep(stepId) : undefined;
  const level = stepId ? getJLearnLevelForStep(stepId) : undefined;
  const [warmupCompleted, setWarmupCompleted] = useState(false);
  const warmupSession = useMemo(() => buildWarmupSession(), [stepId]);

  useEffect(() => {
    setWarmupCompleted(false);
  }, [stepId]);

  if (!step) {
    return <Navigate to={appShellRoutes.learnJapanese} replace />;
  }

  if (!warmupCompleted && level && warmupSession.questions.length > 0) {
    return (
      <>
        <WarmupRunner
          levelId={level.id}
          session={warmupSession}
          onComplete={() => setWarmupCompleted(true)}
        />
        <DebugPanel />
      </>
    );
  }

  return (
    <>
      <MissionRunner step={step} />
      <DebugPanel />
    </>
  );
};

export default MissionPage;
