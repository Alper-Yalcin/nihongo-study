import { useEffect, useMemo } from 'react';
import { usePersistentState } from '../../../hooks/usePersistentState';
import { KanaScript } from '../../kana/domain/kanaItem';
import {
  LessonStatus,
  LessonUnlockBlocker,
  StudyLessonCompletionPayload,
  StudyLessonDefinition,
  StudyLessonRecord,
  StudyRoadmapProgressState,
  StudyScriptRoadmapProgress
} from '../domain/roadmapTypes';

const STUDY_ROADMAP_STORAGE_KEY = 'kototsuna.study-roadmap.v1';
const LEGACY_STUDY_ROADMAP_STORAGE_KEY = 'kotonoha.study-roadmap.v1';

const defaultMinPassScore = 70;
const defaultMinMasteryRequired = 80;

const clampPercent = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

const createEmptyScriptProgress = (): StudyScriptRoadmapProgress => ({
  unlockedLessonIds: [],
  completedLessonIds: [],
  lessonRecords: {}
});

const createInitialState = (): StudyRoadmapProgressState => ({
  version: 2,
  scripts: {
    hiragana: createEmptyScriptProgress(),
    katakana: createEmptyScriptProgress()
  }
});

const asNumber = (value: unknown, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];

const normalizeLessonRecord = (lessonId: string, value: unknown): StudyLessonRecord | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const raw = value as Partial<StudyLessonRecord> & Record<string, unknown>;
  const fallbackBestScore = clampPercent(asNumber(raw.bestScore, 0));
  const fallbackLastScore = clampPercent(asNumber(raw.lastScore, fallbackBestScore));

  return {
    lessonId,
    attempts: Math.max(0, Math.floor(asNumber(raw.attempts, 0))),
    bestScore: fallbackBestScore,
    lastScore: fallbackLastScore,
    bestMasteryScore: clampPercent(
      asNumber(raw.bestMasteryScore, asNumber(raw.lastMasteryScore, fallbackBestScore))
    ),
    lastMasteryScore: clampPercent(
      asNumber(raw.lastMasteryScore, asNumber(raw.bestMasteryScore, fallbackLastScore))
    ),
    passedAt: typeof raw.passedAt === 'string' ? raw.passedAt : null,
    masteredAt: typeof raw.masteredAt === 'string' ? raw.masteredAt : null,
    lastAttemptAt: typeof raw.lastAttemptAt === 'string' ? raw.lastAttemptAt : null,
    weakKanaIds: asStringArray(raw.weakKanaIds).slice(0, 20)
  };
};

const normalizeScriptProgress = (value: unknown): StudyScriptRoadmapProgress => {
  if (!value || typeof value !== 'object') {
    return createEmptyScriptProgress();
  }

  const raw = value as Partial<StudyScriptRoadmapProgress> & {
    lessonRecords?: Record<string, unknown>;
  };

  const lessonRecords: Record<string, StudyLessonRecord> = {};

  if (raw.lessonRecords && typeof raw.lessonRecords === 'object') {
    Object.entries(raw.lessonRecords).forEach(([lessonId, lessonRecord]) => {
      const normalizedRecord = normalizeLessonRecord(lessonId, lessonRecord);

      if (!normalizedRecord) {
        return;
      }

      lessonRecords[lessonId] = normalizedRecord;
    });
  }

  return {
    unlockedLessonIds: asStringArray(raw.unlockedLessonIds),
    completedLessonIds: asStringArray(raw.completedLessonIds),
    lessonRecords
  };
};

const deserializeRoadmapState = (value: string): StudyRoadmapProgressState => {
  try {
    const parsed = JSON.parse(value) as {
      version?: unknown;
      scripts?: Record<string, unknown>;
    };

    if (!parsed || typeof parsed !== 'object' || !parsed.scripts) {
      return createInitialState();
    }

    return {
      version: 2,
      scripts: {
        hiragana: normalizeScriptProgress(parsed.scripts.hiragana),
        katakana: normalizeScriptProgress(parsed.scripts.katakana)
      }
    };
  } catch {
    return createInitialState();
  }
};

const ensureScriptProgress = (
  progress: StudyScriptRoadmapProgress | undefined,
  lessonOrder: string[]
): StudyScriptRoadmapProgress => {
  const fallback = progress ?? createEmptyScriptProgress();
  const firstLessonId = lessonOrder[0] ?? null;
  const unlocked = new Set(fallback.unlockedLessonIds.filter((lessonId) => lessonOrder.includes(lessonId)));
  const completed = new Set(fallback.completedLessonIds.filter((lessonId) => lessonOrder.includes(lessonId)));

  completed.forEach((lessonId) => unlocked.add(lessonId));

  if (firstLessonId) {
    unlocked.add(firstLessonId);
  }

  const lessonRecords = Object.fromEntries(
    Object.entries(fallback.lessonRecords).filter(([lessonId]) => lessonOrder.includes(lessonId))
  ) as Record<string, StudyLessonRecord>;

  return {
    unlockedLessonIds: lessonOrder.filter((lessonId) => unlocked.has(lessonId)),
    completedLessonIds: lessonOrder.filter((lessonId) => completed.has(lessonId)),
    lessonRecords
  };
};

const getNextLessonId = (lessonOrder: string[], currentLessonId: string) => {
  const index = lessonOrder.indexOf(currentLessonId);

  if (index < 0) {
    return null;
  }

  return lessonOrder[index + 1] ?? null;
};

const getPreviousLessonId = (lessonOrder: string[], lessonId: string) => {
  const index = lessonOrder.indexOf(lessonId);

  if (index <= 0) {
    return null;
  }

  return lessonOrder[index - 1] ?? null;
};

const uniqueWeakKanaIds = (weakKanaIds: string[]) =>
  Array.from(new Set(weakKanaIds.filter(Boolean))).slice(0, 20);

const getLessonUnlockBlockersForState = (
  lessonId: string,
  lessonById: Map<string, StudyLessonDefinition>,
  lessonOrder: string[],
  unlockedLessonIds: Set<string>,
  completedLessonIds: Set<string>,
  lessonRecords: Record<string, StudyLessonRecord>
): LessonUnlockBlocker[] => {
  if (completedLessonIds.has(lessonId) || unlockedLessonIds.has(lessonId)) {
    return [];
  }

  const blockers: LessonUnlockBlocker[] = [];
  const lessonDefinition = lessonById.get(lessonId);
  const previousLessonId = getPreviousLessonId(lessonOrder, lessonId);

  if (previousLessonId) {
    const previousLessonDefinition = lessonById.get(previousLessonId);
    const previousLessonRecord = lessonRecords[previousLessonId];
    const requiredScore = previousLessonDefinition?.minPassScore ?? defaultMinPassScore;
    const requiredMastery = previousLessonDefinition?.minMasteryRequired ?? defaultMinMasteryRequired;
    const currentScore = previousLessonRecord?.bestScore ?? 0;
    const currentMastery =
      previousLessonRecord?.bestMasteryScore ?? previousLessonRecord?.lastMasteryScore ?? 0;
    const hasPass = Boolean(previousLessonRecord?.passedAt) && currentScore >= requiredScore;

    if (!hasPass) {
      blockers.push({
        type: 'needs-pass',
        sourceLessonId: previousLessonId,
        requiredScore,
        currentScore
      });
    } else if (currentMastery < requiredMastery) {
      blockers.push({
        type: 'needs-mastery',
        sourceLessonId: previousLessonId,
        requiredMastery,
        currentMastery
      });
    }
  }

  const prerequisiteLessonIds = lessonDefinition?.prerequisiteLessonIds ?? [];

  prerequisiteLessonIds.forEach((prerequisiteLessonId) => {
    const prerequisiteLessonDefinition = lessonById.get(prerequisiteLessonId);
    const prerequisiteLessonRecord = lessonRecords[prerequisiteLessonId];
    const requiredMastery =
      prerequisiteLessonDefinition?.minMasteryRequired ?? defaultMinMasteryRequired;
    const currentMastery =
      prerequisiteLessonRecord?.bestMasteryScore ?? prerequisiteLessonRecord?.lastMasteryScore ?? 0;

    if (!completedLessonIds.has(prerequisiteLessonId) || currentMastery < requiredMastery) {
      blockers.push({
        type: 'needs-prerequisite',
        sourceLessonId: prerequisiteLessonId,
        requiredMastery,
        currentMastery
      });
    }
  });

  const uniqueBlockers = new Map<string, LessonUnlockBlocker>();
  blockers.forEach((blocker) => {
    uniqueBlockers.set(`${blocker.type}:${blocker.sourceLessonId}`, blocker);
  });

  return Array.from(uniqueBlockers.values());
};

export const useStudyRoadmapStore = (
  script: KanaScript,
  lessonOrder: string[],
  lessonDefinitions: StudyLessonDefinition[]
) => {
  const [state, setState] = usePersistentState<StudyRoadmapProgressState>(
    STUDY_ROADMAP_STORAGE_KEY,
    createInitialState,
    {
      serialize: JSON.stringify,
      deserialize: deserializeRoadmapState,
      legacyKeys: [LEGACY_STUDY_ROADMAP_STORAGE_KEY]
    }
  );

  const lessonOrderKey = lessonOrder.join('|');
  const lessonById = useMemo(
    () => new Map(lessonDefinitions.map((lessonDefinition) => [lessonDefinition.id, lessonDefinition])),
    [lessonDefinitions]
  );

  useEffect(() => {
    setState((previous) => {
      const currentScriptProgress = ensureScriptProgress(previous.scripts[script], lessonOrder);
      const previousScriptProgress = ensureScriptProgress(previous.scripts[script], lessonOrder);
      const unlockedLessonIds = new Set(currentScriptProgress.unlockedLessonIds);
      const completedLessonIds = new Set(currentScriptProgress.completedLessonIds);

      lessonOrder.forEach((lessonId) => {
        if (unlockedLessonIds.has(lessonId)) {
          return;
        }

        const blockers = getLessonUnlockBlockersForState(
          lessonId,
          lessonById,
          lessonOrder,
          unlockedLessonIds,
          completedLessonIds,
          currentScriptProgress.lessonRecords
        );

        if (blockers.length === 0) {
          unlockedLessonIds.add(lessonId);
        }
      });

      const nextUnlockedLessonIds = lessonOrder.filter((lessonId) => unlockedLessonIds.has(lessonId));
      const nextCompletedLessonIds = lessonOrder.filter((lessonId) => completedLessonIds.has(lessonId));

      const unlockedUnchanged =
        nextUnlockedLessonIds.length === previousScriptProgress.unlockedLessonIds.length &&
        nextUnlockedLessonIds.every((lessonId) => previousScriptProgress.unlockedLessonIds.includes(lessonId));

      const completedUnchanged =
        nextCompletedLessonIds.length === previousScriptProgress.completedLessonIds.length &&
        nextCompletedLessonIds.every((lessonId) => previousScriptProgress.completedLessonIds.includes(lessonId));

      if (unlockedUnchanged && completedUnchanged) {
        return previous;
      }

      return {
        ...previous,
        scripts: {
          ...previous.scripts,
          [script]: {
            ...currentScriptProgress,
            unlockedLessonIds: nextUnlockedLessonIds,
            completedLessonIds: nextCompletedLessonIds
          }
        }
      };
    });
  }, [lessonById, lessonOrder, lessonOrderKey, script, setState]);

  const scriptProgress = useMemo(
    () => ensureScriptProgress(state.scripts[script], lessonOrder),
    [lessonOrder, script, state.scripts]
  );

  const getLessonStatus = (lessonId: string): LessonStatus => {
    if (scriptProgress.completedLessonIds.includes(lessonId)) {
      return 'completed';
    }

    if (scriptProgress.unlockedLessonIds.includes(lessonId)) {
      return 'available';
    }

    return 'locked';
  };

  const getLessonRecord = (lessonId: string): StudyLessonRecord | null =>
    scriptProgress.lessonRecords[lessonId] ?? null;

  const getLessonUnlockBlockers = (lessonId: string) =>
    getLessonUnlockBlockersForState(
      lessonId,
      lessonById,
      lessonOrder,
      new Set(scriptProgress.unlockedLessonIds),
      new Set(scriptProgress.completedLessonIds),
      scriptProgress.lessonRecords
    );

  const getLessonPassRequirement = (lessonId: string) =>
    lessonById.get(lessonId)?.minPassScore ?? defaultMinPassScore;

  const getLessonMasteryRequirement = (lessonId: string) =>
    lessonById.get(lessonId)?.minMasteryRequired ?? defaultMinMasteryRequired;

  const getRecommendedLessonId = () => {
    const available = lessonOrder.find((lessonId) => getLessonStatus(lessonId) === 'available');

    if (available) {
      return available;
    }

    return lessonOrder.find((lessonId) => getLessonStatus(lessonId) === 'completed') ?? null;
  };

  const recordLessonCompletion = ({
    lessonId,
    score,
    passed,
    masteryScore,
    weakKanaIds
  }: StudyLessonCompletionPayload) => {
    setState((previous) => {
      const currentScriptProgress = ensureScriptProgress(previous.scripts[script], lessonOrder);
      const existingRecord = currentScriptProgress.lessonRecords[lessonId];
      const lessonDefinition = lessonById.get(lessonId);
      const minPassScore = lessonDefinition?.minPassScore ?? defaultMinPassScore;
      const minMasteryRequired = lessonDefinition?.minMasteryRequired ?? defaultMinMasteryRequired;
      const now = new Date().toISOString();
      const boundedScore = clampPercent(score);
      const boundedMasteryScore = clampPercent(masteryScore);
      const metPass = passed && boundedScore >= minPassScore;
      const metMastery = boundedMasteryScore >= minMasteryRequired;

      const nextRecord: StudyLessonRecord = {
        lessonId,
        attempts: (existingRecord?.attempts ?? 0) + 1,
        bestScore: Math.max(existingRecord?.bestScore ?? 0, boundedScore),
        lastScore: boundedScore,
        bestMasteryScore: Math.max(existingRecord?.bestMasteryScore ?? 0, boundedMasteryScore),
        lastMasteryScore: boundedMasteryScore,
        passedAt: metPass ? now : existingRecord?.passedAt ?? null,
        masteredAt: metPass && metMastery ? now : existingRecord?.masteredAt ?? null,
        lastAttemptAt: now,
        weakKanaIds: uniqueWeakKanaIds(weakKanaIds)
      };

      const unlocked = new Set(currentScriptProgress.unlockedLessonIds);
      const completed = new Set(currentScriptProgress.completedLessonIds);
      const lessonRecords = {
        ...currentScriptProgress.lessonRecords,
        [lessonId]: nextRecord
      };

      unlocked.add(lessonId);

      if (metPass && metMastery) {
        completed.add(lessonId);

        const nextLessonId = getNextLessonId(lessonOrder, lessonId);

        if (nextLessonId && !unlocked.has(nextLessonId)) {
          const nextLessonBlockers = getLessonUnlockBlockersForState(
            nextLessonId,
            lessonById,
            lessonOrder,
            unlocked,
            completed,
            lessonRecords
          );

          if (nextLessonBlockers.length === 0) {
            unlocked.add(nextLessonId);
          }
        }
      }

      return {
        ...previous,
        scripts: {
          ...previous.scripts,
          [script]: {
            unlockedLessonIds: lessonOrder.filter((id) => unlocked.has(id)),
            completedLessonIds: lessonOrder.filter((id) => completed.has(id)),
            lessonRecords
          }
        }
      };
    });
  };

  const completionRatio =
    lessonOrder.length > 0 ? scriptProgress.completedLessonIds.length / lessonOrder.length : 0;

  const resetScriptProgress = () => {
    setState((previous) => ({
      ...previous,
      scripts: {
        ...previous.scripts,
        [script]: ensureScriptProgress(createEmptyScriptProgress(), lessonOrder)
      }
    }));
  };

  return {
    scriptProgress,
    completionRatio,
    getLessonStatus,
    getLessonRecord,
    getLessonUnlockBlockers,
    getLessonPassRequirement,
    getLessonMasteryRequirement,
    getRecommendedLessonId,
    recordLessonCompletion,
    resetScriptProgress
  };
};
