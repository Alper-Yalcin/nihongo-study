import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getLessonConcept } from '../data/lessonContent';
import { getSessionStatus, markSessionComplete } from '../lessonStorage';
import type { LessonSessionNumber, LessonSessionResult } from '../lessonTypes';
import { LessonExerciseRunner } from '../LessonExerciseRunner';

export const LessonSessionPage: React.FC = () => {
  const { conceptId, sessionNumber } = useParams<{
    conceptId: string;
    sessionNumber: string;
  }>();
  const navigate = useNavigate();

  const concept = getLessonConcept(conceptId ?? '');
  const sessionNum = Number(sessionNumber) as LessonSessionNumber;

  // Validate params
  if (
    !concept ||
    !conceptId ||
    isNaN(sessionNum) ||
    sessionNum < 1 ||
    sessionNum > 4
  ) {
    return <Navigate to="/lessons" replace />;
  }

  const status = getSessionStatus(conceptId, sessionNum);

  if (status === 'locked') {
    return <Navigate to="/lessons" replace />;
  }

  const handleComplete = (result: LessonSessionResult) => {
    markSessionComplete(result.conceptId, result.sessionNumber);
    navigate('/lessons', { state: { justCompleted: result } });
  };

  const handleExit = () => {
    navigate('/lessons');
  };

  return (
    <LessonExerciseRunner
      concept={concept}
      sessionNumber={sessionNum}
      onSessionComplete={handleComplete}
      onExit={handleExit}
    />
  );
};
