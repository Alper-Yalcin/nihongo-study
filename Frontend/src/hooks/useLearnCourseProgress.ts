import { useMemo } from 'react';
import { usePersistentState } from './usePersistentState';

interface LearnCourseProgressState {
  completedUnitIds: string[];
  unitProgressById: Record<string, number>;
}

const LEARN_COURSE_PROGRESS_STORAGE_KEY = 'kototsuna.learn-course-progress';

const serializeProgress = (value: LearnCourseProgressState) => JSON.stringify(value);

const deserializeProgress = (value: string): LearnCourseProgressState => {
  try {
    const parsed = JSON.parse(value) as Partial<LearnCourseProgressState>;

    const unitProgressById =
      parsed.unitProgressById && typeof parsed.unitProgressById === 'object'
        ? Object.fromEntries(
            Object.entries(parsed.unitProgressById)
              .filter((entry): entry is [string, number] => typeof entry[0] === 'string' && typeof entry[1] === 'number')
              .map(([unitId, progressValue]) => [unitId, Math.max(0, Math.min(100, Math.round(progressValue)))])
          )
        : {};

    return {
      completedUnitIds: Array.isArray(parsed.completedUnitIds)
        ? parsed.completedUnitIds.filter((entry): entry is string => typeof entry === 'string')
        : [],
      unitProgressById
    };
  } catch {
    return { completedUnitIds: [], unitProgressById: {} };
  }
};

export const useLearnCourseProgress = (orderedUnitIds: string[]) => {
  const [progress, setProgress] = usePersistentState<LearnCourseProgressState>(
    LEARN_COURSE_PROGRESS_STORAGE_KEY,
    { completedUnitIds: [], unitProgressById: {} },
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

    // Units AFTER the first incomplete unit are always locked, regardless of completedSet.
    // This prevents out-of-order completions (e.g. stale test data) from unlocking nodes.
    if (unitIndex > currentUnitIndex) {
      return 'locked' as const;
    }

    if (unitIndex < currentUnitIndex) {
      return completedSet.has(unitId) ? 'completed' as const : 'available' as const;
    }

    // unitIndex === currentUnitIndex
    return 'active' as const;
  };

  const setUnitCompleted = (unitId: string, completed: boolean) => {
    setProgress((current) => {
      const nextCompletedIds = completed
        ? Array.from(new Set([...current.completedUnitIds, unitId]))
        : current.completedUnitIds.filter((entry) => entry !== unitId);

      return {
        completedUnitIds: nextCompletedIds,
        unitProgressById: {
          ...current.unitProgressById,
          [unitId]: completed ? 100 : Math.min(current.unitProgressById[unitId] ?? 0, 99)
        }
      };
    });
  };

  const setUnitProgress = (unitId: string, progressPercent: number) => {
    if (!orderedUnitIds.includes(unitId)) {
      return;
    }

    const nextProgress = Math.max(0, Math.min(100, Math.round(progressPercent)));

    setProgress((current) => {
      const currentProgress = current.completedUnitIds.includes(unitId)
        ? 100
        : current.unitProgressById[unitId] ?? 0;

      if (currentProgress === nextProgress) {
        return current;
      }

      return {
        ...current,
        unitProgressById: {
          ...current.unitProgressById,
          [unitId]: nextProgress
        }
      };
    });
  };

  const getUnitProgress = (unitId: string) => {
    if (completedSet.has(unitId)) {
      return 100;
    }

    return Math.max(0, Math.min(100, Math.round(progress.unitProgressById[unitId] ?? 0)));
  };

  const resetProgress = () => {
    setProgress({ completedUnitIds: [], unitProgressById: {} });
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
    getUnitProgress,
    isUnitCompleted: (unitId: string) => completedSet.has(unitId),
    setUnitCompleted,
    setUnitProgress,
    resetProgress
  };
};
