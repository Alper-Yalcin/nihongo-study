import { getDatabase } from '../db';

const JLPT_SORT_SQL = `
  CASE jlpt_level
    WHEN 'N5' THEN 1
    WHEN 'N4' THEN 2
    WHEN 'N3' THEN 3
    WHEN 'N2' THEN 4
    WHEN 'N1' THEN 5
    ELSE 99
  END
`;

export interface DictionaryWordRow {
  id: string;
  script: string;
  kana: string;
  romaji: string;
  meaning: string | null;
  jlptLevel: string;
}

export const findWordsByScript = (script: string): DictionaryWordRow[] =>
  getDatabase()
    .prepare(
      `
        SELECT
          id,
          script,
          kana,
          romaji,
          meaning,
          jlpt_level AS jlptLevel
        FROM dictionary_words
        WHERE script = ?
        ORDER BY ${JLPT_SORT_SQL}, romaji COLLATE NOCASE, kana COLLATE NOCASE
      `
    )
    .all(script) as DictionaryWordRow[];
