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
