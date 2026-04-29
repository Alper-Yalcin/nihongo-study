import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const JLPT_LEVEL_ORDER = ['N5', 'N4', 'N3', 'N2', 'N1'];

export type LegacyDictionaryScript = 'hiragana' | 'katakana' | 'kanji';

export interface LegacyDictionaryWordRecord {
  id: string;
  script: LegacyDictionaryScript;
  expression: string;
  kana: string;
  romaji: string;
  meaning?: string;
  tags?: string;
  jlptLevel: string;
  sourceFile: string;
}

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

const createWordId = (
  script: LegacyDictionaryScript,
  jlptLevel: string,
  expression: string,
  kana: string,
  romaji: string,
  meaning: string
) => {
  let hash = 5381;
  const base =
    script === 'kanji'
      ? `${expression}|${kana}|${romaji}|${meaning}`
      : `${kana}|${romaji}|${meaning}`;

  for (const character of base) {
    hash = ((hash << 5) + hash + character.codePointAt(0)!) >>> 0;
  }

  return `${script}-${jlptLevel.toLowerCase()}-${hash.toString(36)}`;
};

const getJlptLevelFromFileName = (fileName: string) => {
  const match = fileName.match(/n([1-5])_/i);

  if (!match) {
    throw new Error(`JLPT level could not be inferred from file name: ${fileName}`);
  }

  return `N${match[1]}`;
};

const sortRecords = (records: LegacyDictionaryWordRecord[]) =>
  records.sort((a, b) => {
    const levelDiff = JLPT_LEVEL_ORDER.indexOf(a.jlptLevel) - JLPT_LEVEL_ORDER.indexOf(b.jlptLevel);

    if (levelDiff !== 0) {
      return levelDiff;
    }

    return a.romaji.localeCompare(b.romaji);
  });

export const loadLegacyDictionaryRecords = (script: LegacyDictionaryScript): LegacyDictionaryWordRecord[] => {
  const directory = path.join(ROOT, 'Backend', 'csv', script);
  const fileNames = fs.readdirSync(directory).filter((fileName) => fileName.endsWith('.csv')).sort();
  const uniqueWords = new Map<string, LegacyDictionaryWordRecord>();

  for (const fileName of fileNames) {
    const filePath = path.join(directory, fileName);
    const content = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    const rows = parseCsv(content);
    const jlptLevel = getJlptLevelFromFileName(fileName);

    for (const row of rows.slice(1)) {
      const [
        rawExpression = '',
        rawKana = '',
        rawRomaji = '',
        rawMeaning = '',
        rawTags = ''
      ] = row;

      const expression = rawExpression.trim();
      const kana = (script === 'kanji' ? rawKana : rawExpression).trim();
      const romaji = (script === 'kanji' ? rawRomaji : rawKana).trim();
      const meaning = (script === 'kanji' ? rawMeaning : rawRomaji).trim();
      const tags = (script === 'kanji' ? rawTags : rawMeaning).trim();

      if (!expression || !kana || !romaji) {
        continue;
      }

      const dedupeKey =
        script === 'kanji'
          ? `${expression}\u0000${kana}\u0000${romaji}\u0000${meaning}`
          : `${kana}\u0000${romaji}\u0000${meaning}`;

      if (uniqueWords.has(dedupeKey)) {
        continue;
      }

      uniqueWords.set(dedupeKey, {
        id: createWordId(script, jlptLevel, expression, kana, romaji, meaning),
        script,
        expression,
        kana,
        romaji,
        meaning: meaning || undefined,
        tags: tags || undefined,
        jlptLevel,
        sourceFile: path.relative(ROOT, filePath).replace(/\\/g, '/')
      });
    }
  }

  return sortRecords([...uniqueWords.values()]);
};

export const loadAllLegacyDictionaryRecords = () => [
  ...loadLegacyDictionaryRecords('hiragana'),
  ...loadLegacyDictionaryRecords('katakana'),
  ...loadLegacyDictionaryRecords('kanji')
];
