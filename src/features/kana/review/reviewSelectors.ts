import { Character, KanaSection, WordItem } from '../../../types';
import { kanaConfusableSeeds } from '../data/confusables';
import { getKanaItemById } from '../data/kanaInventory';
import { KanaProgress } from '../domain/kanaProgress';
import { KanaScript } from '../domain/kanaItem';
import { ReviewEntry, ReviewSourceMode } from '../domain/reviewEntry';

export interface KanaConfusableSet {
  id: string;
  script: KanaScript;
  kanaIds: string[];
  label: string;
  source: 'seed' | 'progress';
  count: number;
}

export interface KanaGroupProgressStat {
  sectionId: string;
  sectionTitle: string;
  groupId: string;
  groupLabel: string;
  total: number;
  weak: number;
  due: number;
  mastered: number;
  tracked: number;
}

const buildPairKey = (leftId: string, rightId: string) =>
  [leftId, rightId].sort().join(':');

const buildConfusableLabel = (kanaIds: string[]) =>
  kanaIds
    .map((kanaId) => getKanaItemById(kanaId)?.char ?? kanaId)
    .join(' / ');

const deriveReviewReason = (entry: KanaProgress): ReviewEntry['reason'] => {
  if (entry.state === 'weak') {
    return 'weak_item';
  }

  if (entry.timesWrong > 0 && entry.timesCorrect === 0) {
    return 'new_failed';
  }

  return 'overdue';
};

const deriveReviewSourceMode = (entry: KanaProgress): ReviewSourceMode => {
  const weightedScores = [
    { mode: 'typing', score: entry.typingScore },
    { mode: 'drawing', score: entry.drawingScore },
    { mode: 'listening', score: entry.listeningScore }
  ].sort((left, right) => left.score - right.score);

  return weightedScores[0]?.mode as ReviewSourceMode;
};

const isDue = (entry: KanaProgress, now: Date) => {
  if (!entry.nextReviewAt) {
    return false;
  }

  const dueAt = new Date(entry.nextReviewAt);
  return !Number.isNaN(dueAt.getTime()) && dueAt <= now;
};

export const buildKanaReviewQueue = (
  script: KanaScript,
  progressEntries: KanaProgress[],
  now = new Date()
): ReviewEntry[] =>
  progressEntries
    .filter((entry) => entry.script === script && entry.timesSeen > 0 && isDue(entry, now))
    .map((entry) => ({
      kanaId: entry.kanaId,
      script,
      priority:
        (entry.state === 'weak' ? 100 : 50) +
        entry.timesWrong * 5 +
        Math.max(0, 4 - entry.masteryScore) * 3,
      reason: deriveReviewReason(entry),
      dueAt: entry.nextReviewAt ?? now.toISOString(),
      sourceMode: deriveReviewSourceMode(entry),
      createdAt: entry.updatedAt
    }))
    .sort((left, right) => {
      if (right.priority !== left.priority) {
        return right.priority - left.priority;
      }

      return left.dueAt.localeCompare(right.dueAt);
    });

export const getWeakKanaProgressEntries = (
  script: KanaScript,
  progressEntries: KanaProgress[]
): KanaProgress[] =>
  progressEntries
    .filter(
      (entry) =>
        entry.script === script &&
        entry.timesSeen > 0 &&
        (entry.state === 'weak' || entry.timesWrong > 0)
    )
    .sort((left, right) => {
      if (right.timesWrong !== left.timesWrong) {
        return right.timesWrong - left.timesWrong;
      }

      return (right.lastWrongAt ?? '').localeCompare(left.lastWrongAt ?? '');
    });

export const getKanaConfusableSets = (
  script: KanaScript,
  progressEntries: KanaProgress[]
): KanaConfusableSet[] => {
  const sets = new Map<string, KanaConfusableSet>();

  kanaConfusableSeeds[script].forEach((seed) => {
    const key = buildPairKey(seed.kanaIds[0], seed.kanaIds[1]);

    sets.set(key, {
      id: seed.id,
      script,
      kanaIds: [...seed.kanaIds],
      label: buildConfusableLabel(seed.kanaIds),
      source: 'seed',
      count: 1
    });
  });

  progressEntries
    .filter((entry) => entry.script === script && entry.confusedWith.length > 0)
    .forEach((entry) => {
      entry.confusedWith.forEach((otherId) => {
        const otherItem = getKanaItemById(otherId);

        if (!otherItem || otherItem.script !== script) {
          return;
        }

        const kanaIds = [entry.kanaId, otherId].sort();
        const key = buildPairKey(kanaIds[0], kanaIds[1]);
        const existing = sets.get(key);

        if (existing) {
          sets.set(key, {
            ...existing,
            count: existing.count + 1,
            source: 'progress'
          });
          return;
        }

        sets.set(key, {
          id: `progress-${key}`,
          script,
          kanaIds,
          label: buildConfusableLabel(kanaIds),
          source: 'progress',
          count: 1
        });
      });
    });

  return [...sets.values()].sort((left, right) => right.count - left.count);
};

export const buildScopedSectionsFromKanaIds = (
  sections: KanaSection[],
  kanaIds: string[]
): KanaSection[] => {
  const allowedIds = new Set(kanaIds);

  return sections
    .map((section) => {
      const groupByCharacterId = new Map<string, string>();
      const groups = section.groups
        .map((group) => {
          const characters = group.characters.filter((character) => allowedIds.has(character.id));
          characters.forEach((character) => {
            groupByCharacterId.set(character.id, group.id);
          });

          return characters.length > 0
            ? {
                ...group,
                characters
              }
            : null;
        })
        .filter((group): group is NonNullable<typeof group> => group !== null);

      if (groups.length === 0) {
        return null;
      }

      const visibleGroupIds = new Set(groups.map((group) => group.id));
      const matrix = section.matrix
        .map((row) =>
          row.map((character) => {
            if (!character) {
              return null;
            }

            const groupId = groupByCharacterId.get(character.id);
            return allowedIds.has(character.id) && groupId && visibleGroupIds.has(groupId)
              ? character
              : null;
          })
        )
        .filter((row) => row.some((character) => character !== null));

      const scopedSection: KanaSection = {
        ...section,
        groups,
        matrix,
        columnGroupIds: section.columnGroupIds?.map((groupId) =>
          groupId && visibleGroupIds.has(groupId) ? groupId : null
        )
      };

      return scopedSection;
    })
    .filter((section): section is KanaSection => section !== null);
};

export const filterWordsForKanaIds = (words: WordItem[], kanaIds: string[]) => {
  const targetChars = new Set(
    kanaIds
      .map((kanaId) => getKanaItemById(kanaId)?.char ?? null)
      .filter((value): value is string => Boolean(value))
  );

  if (targetChars.size === 0) {
    return [];
  }

  return words.filter((word) => [...targetChars].some((char) => word.kana.includes(char)));
};

export const getKanaGroupProgressStats = (
  sections: KanaSection[],
  progressEntries: KanaProgress[],
  now = new Date()
): KanaGroupProgressStat[] => {
  const progressMap = new Map(progressEntries.map((entry) => [entry.kanaId, entry]));

  return sections
    .flatMap((section) =>
      section.groups.map((group) => {
        const entries = group.characters
          .map((character) => progressMap.get(character.id))
          .filter((entry): entry is KanaProgress => entry !== undefined);

        return {
          sectionId: section.id,
          sectionTitle: section.title,
          groupId: group.id,
          groupLabel: group.label,
          total: group.characters.length,
          weak: entries.filter((entry) => entry.state === 'weak').length,
          due: entries.filter((entry) => isDue(entry, now)).length,
          mastered: entries.filter((entry) => entry.state === 'mastered').length,
          tracked: entries.filter((entry) => entry.timesSeen > 0).length
        };
      })
    )
    .sort((left, right) => {
      const leftRisk = left.weak * 3 + left.due * 2 + (left.total - left.mastered);
      const rightRisk = right.weak * 3 + right.due * 2 + (right.total - right.mastered);
      return rightRisk - leftRisk;
    });
};

export const buildCharacterMap = (sections: KanaSection[]) => {
  const map = new Map<string, Character>();

  sections.forEach((section) => {
    section.groups.forEach((group) => {
      group.characters.forEach((character) => {
        map.set(character.id, character);
      });
    });
  });

  return map;
};
