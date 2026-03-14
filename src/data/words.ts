import { WordItem } from '../types';

type JlptLevel = NonNullable<WordItem['jlptLevel']>;
type ScriptType = NonNullable<WordItem['script']>;

const jlptLevelOrder: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

const hiraganaCsvModules = import.meta.glob('../../csv/hiragana/*.csv', {
  eager: true,
  import: 'default',
  query: '?raw'
}) as Record<string, string>;

const katakanaCsvModules = import.meta.glob('../../csv/katakana/*.csv', {
  eager: true,
  import: 'default',
  query: '?raw'
}) as Record<string, string>;

const sortDictionaryWords = (words: WordItem[]) =>
  [...words].sort((a, b) => {
    const levelDiff =
      jlptLevelOrder.indexOf(a.jlptLevel as JlptLevel) -
      jlptLevelOrder.indexOf(b.jlptLevel as JlptLevel);

    if (levelDiff !== 0) {
      return levelDiff;
    }

    return a.romaji.localeCompare(b.romaji);
  });

// Minimal CSV parser that keeps quoted commas and line breaks intact.
const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (inQuotes) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          currentCell += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        currentCell += character;
      }

      continue;
    }

    if (character === '"') {
      inQuotes = true;
      continue;
    }

    if (character === ',') {
      currentRow.push(currentCell);
      currentCell = '';
      continue;
    }

    if (character === '\n') {
      currentRow.push(currentCell.replace(/\r$/, ''));
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
      continue;
    }

    currentCell += character;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.replace(/\r$/, ''));
    rows.push(currentRow);
  }

  return rows;
};

const getJlptLevelFromPath = (path: string): JlptLevel | null => {
  const match = path.match(/n([1-5])_(hiragana|katakana)\.csv$/i);

  if (!match) {
    return null;
  }

  return `N${match[1]}` as JlptLevel;
};

const createWordId = (
  script: ScriptType,
  jlptLevel: JlptLevel,
  kana: string,
  romaji: string,
  meaning: string
) => {
  let hash = 5381;

  for (const character of `${kana}|${romaji}|${meaning}`) {
    hash = ((hash << 5) + hash + character.codePointAt(0)!) >>> 0;
  }

  return `${script}-${jlptLevel.toLowerCase()}-${hash.toString(36)}`;
};

const buildDictionaryWords = (
  csvModules: Record<string, string>,
  script: ScriptType
): WordItem[] => {
  const uniqueWords = new Map<string, WordItem>();

  const files = Object.entries(csvModules)
    .map(([path, content]) => ({
      path,
      content,
      jlptLevel: getJlptLevelFromPath(path)
    }))
    .filter(
      (entry): entry is { path: string; content: string; jlptLevel: JlptLevel } =>
        entry.jlptLevel !== null
    )
    .sort((a, b) => {
      const levelDiff = jlptLevelOrder.indexOf(a.jlptLevel) - jlptLevelOrder.indexOf(b.jlptLevel);

      if (levelDiff !== 0) {
        return levelDiff;
      }

      return a.path.localeCompare(b.path);
    });

  for (const file of files) {
    const rows = parseCsv(file.content.replace(/^\uFEFF/, ''));

    for (const row of rows.slice(1)) {
      const [rawKana = '', rawRomaji = '', rawMeaning = ''] = row;
      const kana = rawKana.trim();
      const romaji = rawRomaji.trim();
      const meaning = rawMeaning.trim();

      if (!kana || !romaji) {
        continue;
      }

      const dedupeKey = `${kana}\u0000${romaji}\u0000${meaning}`;

      if (uniqueWords.has(dedupeKey)) {
        continue;
      }

      uniqueWords.set(dedupeKey, {
        id: createWordId(script, file.jlptLevel, kana, romaji, meaning),
        kana,
        romaji,
        meaning: meaning || undefined,
        script,
        jlptLevel: file.jlptLevel
      });
    }
  }

  return sortDictionaryWords([...uniqueWords.values()]);
};

export const hiraganaDictionaryWords: WordItem[] = buildDictionaryWords(hiraganaCsvModules, 'hiragana');

export const katakanaDictionaryWords: WordItem[] = buildDictionaryWords(katakanaCsvModules, 'katakana');
