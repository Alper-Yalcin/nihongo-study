import { kanaInventoryByScript } from '../data/kanaInventory';
import { KanaProgress, KanaProgressSummary } from '../domain/kanaProgress';
import { KanaScript } from '../domain/kanaItem';

export const buildKanaProgressSummary = (
  script: KanaScript,
  progressEntries: KanaProgress[],
  now = new Date()
): KanaProgressSummary => {
  const inventory = kanaInventoryByScript[script];
  const inventoryIds = new Set(inventory.map((item) => item.id));
  const scopedEntries = progressEntries.filter(
    (entry) => entry.script === script && inventoryIds.has(entry.kanaId)
  );

  const learningCount = scopedEntries.filter((entry) => entry.state === 'learning').length;
  const weakCount = scopedEntries.filter((entry) => entry.state === 'weak').length;
  const knownCount = scopedEntries.filter((entry) => entry.state === 'known').length;
  const masteredCount = scopedEntries.filter((entry) => entry.state === 'mastered').length;
  const tracked = learningCount + weakCount + knownCount + masteredCount;
  const totalCount = inventory.length;
  const dueCount = scopedEntries.filter((entry) => {
    if (!entry.nextReviewAt) {
      return false;
    }

    const dueAt = new Date(entry.nextReviewAt);
    return !Number.isNaN(dueAt.getTime()) && dueAt <= now;
  }).length;

  return {
    script,
    totalCount,
    tracked,
    newCount: Math.max(totalCount - tracked, 0),
    learningCount,
    weakCount,
    knownCount,
    masteredCount,
    dueCount
  };
};

const clampPercent = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export const getMasteryPercentFromProgressEntries = (progressEntries: KanaProgress[]) => {
  if (progressEntries.length === 0) {
    return 0;
  }

  const averageScore =
    progressEntries.reduce((total, entry) => total + entry.masteryScore, 0) /
    progressEntries.length;

  return clampPercent((averageScore / 4) * 100);
};

export const getLessonMasteryPercent = (
  lessonKanaIds: string[],
  progressEntries: KanaProgress[]
) => {
  const lessonKanaIdSet = new Set(lessonKanaIds);
  const lessonEntries = progressEntries.filter((entry) => lessonKanaIdSet.has(entry.kanaId));

  return getMasteryPercentFromProgressEntries(lessonEntries);
};

const getOverdueDays = (entry: KanaProgress, now: Date) => {
  if (!entry.nextReviewAt) {
    return 0;
  }

  const dueAt = new Date(entry.nextReviewAt);

  if (Number.isNaN(dueAt.getTime()) || dueAt > now) {
    return 0;
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((now.getTime() - dueAt.getTime()) / millisecondsPerDay);
};

interface AdaptiveWeakCarryoverOptions {
  excludedKanaIds?: string[];
  maxCount?: number;
  now?: Date;
}

export const buildAdaptiveWeakCarryover = (
  progressEntries: KanaProgress[],
  options: AdaptiveWeakCarryoverOptions = {}
) => {
  const {
    excludedKanaIds = [],
    maxCount = 8,
    now = new Date()
  } = options;
  const excludedKanaIdSet = new Set(excludedKanaIds);

  return progressEntries
    .filter((entry) => !excludedKanaIdSet.has(entry.kanaId))
    .filter((entry) => {
      const overdueDays = getOverdueDays(entry, now);
      return (
        entry.state === 'weak' ||
        entry.timesWrong > entry.timesCorrect ||
        overdueDays > 0
      );
    })
    .sort((left, right) => {
      const leftOverdueDays = getOverdueDays(left, now);
      const rightOverdueDays = getOverdueDays(right, now);

      if (rightOverdueDays !== leftOverdueDays) {
        return rightOverdueDays - leftOverdueDays;
      }

      const leftWeakDelta = left.timesWrong - left.timesCorrect;
      const rightWeakDelta = right.timesWrong - right.timesCorrect;

      if (rightWeakDelta !== leftWeakDelta) {
        return rightWeakDelta - leftWeakDelta;
      }

      if (right.timesWrong !== left.timesWrong) {
        return right.timesWrong - left.timesWrong;
      }

      if (left.masteryScore !== right.masteryScore) {
        return left.masteryScore - right.masteryScore;
      }

      const leftLastWrong = left.lastWrongAt ? new Date(left.lastWrongAt).getTime() : 0;
      const rightLastWrong = right.lastWrongAt ? new Date(right.lastWrongAt).getTime() : 0;

      return rightLastWrong - leftLastWrong;
    })
    .slice(0, Math.max(maxCount, 0))
    .map((entry) => entry.kanaId);
};
