import { useCallback } from 'react';
import { usePersistentState } from './usePersistentState';
import { JLPTLevel, JLPT_LEVEL_ORDER, getNextLevel } from '../data/learnLevels';

interface LearnLevelProgressState {
  currentLevel: JLPTLevel;
  completedLevels: JLPTLevel[];
}

const STORAGE_KEY = 'kototsuna.learn-level-progress';

const serialize = (v: LearnLevelProgressState) => JSON.stringify(v);

const deserialize = (raw: string): LearnLevelProgressState => {
  try {
    const parsed = JSON.parse(raw) as Partial<LearnLevelProgressState>;
    const currentLevel =
      parsed.currentLevel && JLPT_LEVEL_ORDER.includes(parsed.currentLevel as JLPTLevel)
        ? (parsed.currentLevel as JLPTLevel)
        : 'n5';
    const completedLevels = Array.isArray(parsed.completedLevels)
      ? parsed.completedLevels.filter(
          (l): l is JLPTLevel => typeof l === 'string' && JLPT_LEVEL_ORDER.includes(l as JLPTLevel)
        )
      : [];
    return { currentLevel, completedLevels };
  } catch {
    return { currentLevel: 'n5', completedLevels: [] };
  }
};

export const useLearnLevelProgress = () => {
  const [state, setState] = usePersistentState<LearnLevelProgressState>(
    STORAGE_KEY,
    { currentLevel: 'n5', completedLevels: [] },
    { serialize, deserialize }
  );

  const advanceLevel = useCallback(() => {
    setState((prev) => {
      const next = getNextLevel(prev.currentLevel);
      if (!next) return prev;
      const completedLevels = Array.from(new Set([...prev.completedLevels, prev.currentLevel]));
      return { currentLevel: next, completedLevels };
    });
  }, [setState]);

  const isLevelCompleted = useCallback(
    (level: JLPTLevel) => state.completedLevels.includes(level),
    [state.completedLevels]
  );

  return {
    currentLevel: state.currentLevel,
    completedLevels: state.completedLevels,
    advanceLevel,
    isLevelCompleted,
    hasNextLevel: getNextLevel(state.currentLevel) !== null
  };
};
