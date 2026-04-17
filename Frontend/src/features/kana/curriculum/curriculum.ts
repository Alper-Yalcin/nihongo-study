import { KanaSection } from '../../../types';
import { KanaProgress } from '../domain/kanaProgress';
import { KanaScript } from '../domain/kanaItem';

export interface KanaCurriculumGroup {
  script: KanaScript;
  sectionId: string;
  sectionTitle: string;
  groupId: string;
  groupLabel: string;
  itemIds: string[];
  totalItems: number;
}

export const buildKanaCurriculumGroups = (
  script: KanaScript,
  sections: KanaSection[]
): KanaCurriculumGroup[] =>
  sections.flatMap((section) =>
    section.groups.map((group) => ({
      script,
      sectionId: section.id,
      sectionTitle: section.title,
      groupId: group.id,
      groupLabel: group.label,
      itemIds: group.characters.map((character) => character.id),
      totalItems: group.characters.length
    }))
  );

const isKnownEnough = (entry: KanaProgress | undefined) =>
  entry && (entry.state === 'known' || entry.state === 'mastered');

export const getNextKanaCurriculumGroup = (
  script: KanaScript,
  sections: KanaSection[],
  progressEntries: KanaProgress[]
): KanaCurriculumGroup | null => {
  const groups = buildKanaCurriculumGroups(script, sections);
  const progressMap = new Map(progressEntries.map((entry) => [entry.kanaId, entry]));

  const firstNewGroup = groups.find((group) =>
    group.itemIds.some((itemId) => (progressMap.get(itemId)?.state ?? 'new') === 'new')
  );

  if (firstNewGroup) {
    return firstNewGroup;
  }

  const firstIncompleteGroup = groups.find((group) =>
    group.itemIds.some((itemId) => !isKnownEnough(progressMap.get(itemId)))
  );

  return firstIncompleteGroup ?? groups[0] ?? null;
};
