import { useMemo } from 'react';
import { usePersistentState } from './usePersistentState';

interface LearnCourseProgressState {
  completedUnitIds: string[];
}

const LEARN_COURSE_PROGRESS_STORAGE_KEY = 'kototsuna.learn-course-progress';

const serializeProgress = (value: LearnCourseProgressState) => JSON.stringify(value);

const deserializeProgress = (value: string): LearnCourseProgressState => {
  try {
    const parsed = JSON.parse(value) as Partial<LearnCourseProgressState>;

    if (!Array.isArray(parsed.completedUnitIds)) {
      return { completedUnitIds: [] };
    }

    return {
      completedUnitIds: parsed.completedUnitIds.filter(
        (entry): entry is string => typeof entry === 'string'
      )
    };
  } catch {
    return { completedUnitIds: [] };
  }
};

export const useLearnCourseProgress = (orderedUnitIds: string[]) => {
  const [progress, setProgress] = usePersistentState<LearnCourseProgressState>(
    LEARN_COURSE_PROGRESS_STORAGE_KEY,
    { completedUnitIds: [] },
    {
      serialize: serializeProgress,
      deserialize: deserializeProgress
    }
  );

  const completedUnitIds = useMemo(
    () => orderedUnitIds.filter((unitId) => progress.completedUnitIds.includes(unitId)),
    [orderedUnitIds, progress.completedUnitIds]
  );

  const completedSet = useMemo(() => new Set(completedUnitIds), [completedUnitIds]);
  const currentUnitId =
    orderedUnitIds.find((unitId) => !completedSet.has(unitId)) ??
    orderedUnitIds[orderedUnitIds.length - 1] ??
    null;
  const currentUnitIndex = currentUnitId ? orderedUnitIds.indexOf(currentUnitId) : orderedUnitIds.length;

  const getUnitState = (unitId: string) => {
    const unitIndex = orderedUnitIds.indexOf(unitId);

    if (unitIndex === -1) {
      return 'locked' as const;
    }

    if (completedSet.has(unitId)) {
      return 'completed' as const;
    }

    if (unitIndex === currentUnitIndex) {
      return 'active' as const;
    }

    if (unitIndex < currentUnitIndex) {
      return 'available' as const;
    }

    return 'locked' as const;
  };

  const setUnitCompleted = (unitId: string, completed: boolean) => {
    setProgress((current) => {
      const nextCompletedIds = completed
        ? Array.from(new Set([...current.completedUnitIds, unitId]))
        : current.completedUnitIds.filter((entry) => entry !== unitId);

      return {
        completedUnitIds: nextCompletedIds
      };
    });
  };

  return {
    completedCount: completedUnitIds.length,
    completedUnitIds,
    completedSet,
    currentUnitId,
    progressPercent:
      orderedUnitIds.length > 0
        ? Math.round((completedUnitIds.length / orderedUnitIds.length) * 100)
        : 0,
    getUnitState,
    isUnitCompleted: (unitId: string) => completedSet.has(unitId),
    setUnitCompleted
  };
};
