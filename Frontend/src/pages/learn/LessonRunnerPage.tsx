import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { LessonRunner } from '../../features/lesson/components/LessonRunner';
import { getLessonUnit } from '../../features/lesson/data/greetingsUnit';
import type { AppLanguage, ThemeMode } from '../../data/appPreferences';

interface Props {
  language: AppLanguage;
  themeMode: ThemeMode;
}

export const LessonRunnerPage: React.FC<Props> = ({ themeMode }) => {
  const { unitId = '', lessonId = '' } = useParams();

  const unit = getLessonUnit(unitId);
  if (!unit) return <Navigate to="/learn" replace />;

  const lesson = unit.lessons.find((l) => l.id === lessonId);
  if (!lesson) return <Navigate to="/learn" replace />;

  return (
    <LessonRunner
      lesson={lesson}
      themeMode={themeMode}
    />
  );
};
