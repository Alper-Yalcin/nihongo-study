import { getDatabase } from '../db';

const WORD_TABLE_BY_SCRIPT = {
  hiragana: 'hiragana_words',
  katakana: 'katakana_words',
  kanji: 'kanji_words'
} as const;

export type DictionaryScript = keyof typeof WORD_TABLE_BY_SCRIPT;

interface DictionaryWordDbRow {
  id: string;
  scriptType: string;
  kanji: string | null;
  kana: string | null;
  romaji: string | null;
  meanings: string;
}

export interface DictionaryWordRow {
  id: string;
  script: DictionaryScript;
  kanji?: string;
  kana: string;
  romaji: string;
  meaning?: string;
  meanings: string[];
}

const isDictionaryScript = (script: string): script is DictionaryScript =>
  Object.prototype.hasOwnProperty.call(WORD_TABLE_BY_SCRIPT, script);

const parseMeanings = (raw: string): string[] => {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

const normalizeWordRow = (script: DictionaryScript, row: DictionaryWordDbRow): DictionaryWordRow => {
  const meanings = parseMeanings(row.meanings);

  return {
    id: row.id,
    script,
    kanji: row.kanji ?? undefined,
    kana: row.kana ?? '',
    romaji: row.romaji ?? '',
    meaning: meanings.length > 0 ? meanings.join('; ') : undefined,
    meanings
  };
};

export const findWordsByScript = (script: string): DictionaryWordRow[] => {
  if (!isDictionaryScript(script)) {
    throw new Error(`Unsupported script: ${script}`);
  }

  const tableName = WORD_TABLE_BY_SCRIPT[script];

  return (
    getDatabase()
      .prepare(
        `
          SELECT
            id,
            script_type AS scriptType,
            kanji,
            kana,
            romaji,
            meanings
          FROM ${tableName}
          ORDER BY COALESCE(kanji, kana) COLLATE NOCASE, romaji COLLATE NOCASE
        `
      )
      .all() as DictionaryWordDbRow[]
  ).map((row) => normalizeWordRow(script, row));
};
