import { getDatabase } from '../db';

export interface TranslationRow {
  sourceText: string;
  translation: string;
}

export const findTranslationsByLanguage = (language: string): TranslationRow[] =>
  getDatabase()
    .prepare(
      `
        SELECT source_text AS sourceText, translation
        FROM meaning_translations
        WHERE language = ?
      `
    )
    .all(language) as TranslationRow[];
