import { Character, KanaSection } from '../../../types';
import { hiraganaSections, katakanaSections } from '../../../letters/data/kana';
import { KanaItem, KanaItemType, KanaScript } from '../domain/kanaItem';

const smallCharacterPattern = /[\u3041\u3043\u3045\u3047\u3049\u3063\u3083\u3085\u3087\u30a1\u30a3\u30a5\u30a7\u30a9\u30c3\u30e3\u30e5\u30e7\u30fc]/;

const resolveKanaItemType = (sectionId: string, character: Character): KanaItemType => {
  if (sectionId.includes('extended')) {
    return 'extended';
  }

  if (sectionId.includes('double')) {
    return 'yoon';
  }

  if (smallCharacterPattern.test(character.symbol)) {
    return 'small';
  }

  return 'base';
};

const buildKanaInventoryForScript = (
  script: KanaScript,
  sections: KanaSection[]
): KanaItem[] =>
  sections.flatMap((section) =>
    section.groups.flatMap((group) =>
      group.characters.map((character) => ({
        id: character.id,
        script,
        char: character.symbol,
        romaji: [character.label],
        type: resolveKanaItemType(section.id, character),
        sectionId: section.id,
        sectionTitle: section.title,
        groupId: group.id,
        groupLabel: group.label,
        strokeCount: character.drawingData?.strokeCount ?? null,
        drawingMetadata: character.drawingData,
        audioKey: character.id,
        guideImageKey: character.id,
        exampleWordIds: []
      }))
    )
  );

export const kanaInventory: KanaItem[] = [
  ...buildKanaInventoryForScript('hiragana', hiraganaSections),
  ...buildKanaInventoryForScript('katakana', katakanaSections)
];

export const kanaInventoryById = new Map(kanaInventory.map((item) => [item.id, item]));

export const kanaInventoryByScript: Record<KanaScript, KanaItem[]> = {
  hiragana: kanaInventory.filter((item) => item.script === 'hiragana'),
  katakana: kanaInventory.filter((item) => item.script === 'katakana')
};

export const getKanaItemById = (id: string) => kanaInventoryById.get(id) ?? null;
