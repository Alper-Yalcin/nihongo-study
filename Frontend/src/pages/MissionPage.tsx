import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getJLearnStep } from '../data/jlearn/jlearnContent';
import { MissionRunner } from '../features/jlearn/mission/MissionRunner';
import { appShellRoutes } from '../data/appShellContent';

export const MissionPage: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const step = stepId ? getJLearnStep(stepId) : undefined;

  if (!step) {
    return <Navigate to={appShellRoutes.learnJapanese} replace />;
  }

  return <MissionRunner step={step} />;
};

export default MissionPage;
