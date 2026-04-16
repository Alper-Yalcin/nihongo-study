import { WordItem } from '../../../types';
import { getKanaItemById, kanaInventoryByScript } from '../../kana/data/kanaInventory';
import { KanaItem, KanaScript } from '../../kana/domain/kanaItem';
import { KanaProgress } from '../../kana/domain/kanaProgress';
import { buildAdaptiveWeakCarryover } from '../../kana/progress/progressSelectors';

export interface StudyConnectedKanaPool {
  learned: KanaItem[];
  weak: KanaItem[];
  due: KanaItem[];
  upcoming: KanaItem[];
  prioritized: KanaItem[];
  weighted: KanaItem[];
}

const dedupeKanaItems = (items: KanaItem[]) =>
  Array.from(new Map(items.map((item) => [item.id, item])).values());

const dedupeWords = (words: WordItem[]) =>
  Array.from(new Map(words.map((word) => [word.id, word])).values());

const repeatItems = <T,>(items: T[], times: number) =>
  Array.from({ length: Math.max(times, 0) }).flatMap(() => items);

const isDueEntry = (entry: KanaProgress, now: Date) => {
  if (!entry.nextReviewAt) {
    return false;
  }

  const dueAt = new Date(entry.nextReviewAt);
  return !Number.isNaN(dueAt.getTime()) && dueAt <= now;
};

const hasWordMeaning = (word: WordItem) => {
  if (Array.isArray(word.meanings) && word.meanings.some((meaning) => meaning.trim().length > 0)) {
    return true;
  }

  return typeof word.meaning === 'string' && word.meaning.trim().length > 0;
};

const toKanaItems = (entries: KanaProgress[]) =>
  entries
    .map((entry) => getKanaItemById(entry.kanaId))
    .filter((item): item is KanaItem => item !== null);

export const buildStudyConnectedKanaPool = (
  script: KanaScript,
  progressEntries: KanaProgress[],
  now = new Date()
): StudyConnectedKanaPool => {
  const scriptEntries = progressEntries.filter((entry) => entry.script === script);
  const seenEntries = scriptEntries.filter((entry) => entry.timesSeen > 0);
  const dueEntries = seenEntries.filter((entry) => isDueEntry(entry, now));
  const weakEntries = seenEntries.filter(
    (entry) => entry.state === 'weak' || entry.timesWrong > 0
  );

  const weakCarryoverKanaIds = buildAdaptiveWeakCarryover(scriptEntries, {
    excludedKanaIds: weakEntries.map((entry) => entry.kanaId),
    maxCount: 10,
    now
  });

  const seenItems = toKanaItems(seenEntries);
  const dueItems = toKanaItems(dueEntries);
  const weakItems = toKanaItems(weakEntries);
  const weakCarryoverItems = weakCarryoverKanaIds
    .map((kanaId) => getKanaItemById(kanaId))
    .filter((item): item is KanaItem => item !== null && item.script === script);
  const learnedItems = dedupeKanaItems(
    seenItems.filter((item) => !weakItems.some((weakItem) => weakItem.id === item.id))
  );

  const activeGroupIds = new Set(dedupeKanaItems(seenItems).map((item) => item.groupId));

  const upcomingItems = dedupeKanaItems(
    toKanaItems(scriptEntries.filter((entry) => entry.timesSeen === 0))
      .sort((left, right) => {
        const leftPriority = activeGroupIds.has(left.groupId) ? 0 : 1;
        const rightPriority = activeGroupIds.has(right.groupId) ? 0 : 1;

        if (leftPriority !== rightPriority) {
          return leftPriority - rightPriority;
        }

        return left.id.localeCompare(right.id);
      })
      .slice(0, 32)
  );

  const fallbackItems = kanaInventoryByScript[script].slice(0, 36);

  const prioritized = dedupeKanaItems([
    ...dueItems,
    ...weakItems,
    ...weakCarryoverItems,
    ...learnedItems,
    ...upcomingItems,
    ...fallbackItems
  ]);

  const weighted = [
    ...repeatItems(dueItems, 4),
    ...repeatItems(weakItems, 3),
    ...repeatItems(weakCarryoverItems, 2),
    ...learnedItems,
    ...upcomingItems,
    ...fallbackItems
  ].slice(0, 220);

  return {
    learned: learnedItems,
    weak: weakItems,
    due: dueItems,
    upcoming: upcomingItems,
    prioritized,
    weighted: weighted.length > 0 ? weighted : prioritized
  };
};

const containsAnyChar = (value: string, chars: Set<string>) => {
  if (chars.size === 0 || value.length === 0) {
    return false;
  }

  for (const char of chars) {
    if (value.includes(char)) {
      return true;
    }
  }

  return false;
};

export const buildStudyConnectedWordPool = (
  words: WordItem[],
  kanaPool: StudyConnectedKanaPool,
  maxItems = 140
): WordItem[] => {
  const candidateWords = words.filter(hasWordMeaning);
  const focusChars = new Set(
    [...kanaPool.weak, ...kanaPool.learned]
      .map((item) => item.char)
      .filter((value) => value.length > 0)
  );

  const focusWords = candidateWords.filter((word) => {
    if (focusChars.size === 0) {
      return false;
    }

    return [...focusChars].some((char) => word.kana.includes(char) || (word.kanji ?? '').includes(char));
  });

  return dedupeWords([...focusWords, ...candidateWords]).slice(0, maxItems);
};

export const buildWeightedStudyConnectedWordPool = (
  words: WordItem[],
  kanaPool: StudyConnectedKanaPool,
  maxItems = 180
) => {
  const candidateWords = words.filter(hasWordMeaning);
  const dueChars = new Set(
    kanaPool.due.map((item) => item.char).filter((value) => value.length > 0)
  );
  const weakChars = new Set(
    kanaPool.weak.map((item) => item.char).filter((value) => value.length > 0)
  );
  const focusChars = new Set([
    ...Array.from(dueChars),
    ...Array.from(weakChars),
    ...kanaPool.learned.map((item) => item.char).filter((value) => value.length > 0)
  ]);

  const dueWords = candidateWords.filter((word) =>
    containsAnyChar(word.kana, dueChars) || containsAnyChar(word.kanji ?? '', dueChars)
  );
  const weakWords = candidateWords.filter((word) =>
    containsAnyChar(word.kana, weakChars) || containsAnyChar(word.kanji ?? '', weakChars)
  );
  const focusWords = candidateWords.filter((word) =>
    containsAnyChar(word.kana, focusChars) || containsAnyChar(word.kanji ?? '', focusChars)
  );

  const prioritized = dedupeWords([
    ...dueWords,
    ...weakWords,
    ...focusWords,
    ...candidateWords
  ]).slice(0, maxItems);

  const weighted = [
    ...repeatItems(dueWords, 4),
    ...repeatItems(weakWords, 3),
    ...repeatItems(focusWords, 2),
    ...prioritized
  ].slice(0, maxItems * 2);

  return weighted.length > 0 ? weighted : prioritized;
};
