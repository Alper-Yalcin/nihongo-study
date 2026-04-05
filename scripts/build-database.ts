import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { importNormalizedDatasets, printNormalizedImportReport } from './import-normalized-dataset';
import { loadAllLegacyDictionaryRecords } from './legacy-dictionary';
import { loadTurkishMeaningTranslations } from './load-meaning-translations';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DATABASE_DIR = path.join(ROOT, 'database');
const DATABASE_PATH = path.join(DATABASE_DIR, 'nihongo-study.sqlite');

const ensureDatabaseDirectory = () => {
  fs.mkdirSync(DATABASE_DIR, { recursive: true });
};

const removeExistingDatabase = () => {
  if (!fs.existsSync(DATABASE_PATH)) {
    return;
  }

  try {
    fs.rmSync(DATABASE_PATH, { force: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'EPERM') {
      throw new Error(
        `Database file is locked at ${DATABASE_PATH}. Stop the running backend or dev server, then run "npm run db:build" again.`
      );
    }

    throw error;
  }
};

const rebuildDatabase = async () => {
  ensureDatabaseDirectory();
  removeExistingDatabase();
  const turkishMeaningTranslations = loadTurkishMeaningTranslations();

  const database = new Database(DATABASE_PATH);
  database.pragma('foreign_keys = ON');

  database.exec(`
    CREATE TABLE meaning_translations (
      source_text TEXT NOT NULL,
      language TEXT NOT NULL,
      translation TEXT NOT NULL,
      PRIMARY KEY (source_text, language)
    );

    CREATE TABLE metadata (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  const translationInsert = database.prepare(`
    INSERT INTO meaning_translations (source_text, language, translation)
    VALUES (@sourceText, @language, @translation)
  `);

  const metadataInsert = database.prepare(`
    INSERT OR REPLACE INTO metadata (key, value)
    VALUES (?, ?)
  `);

  const insertTranslations = database.transaction((entries: Array<[string, string]>) => {
    entries.forEach(([sourceText, translation]) => {
      translationInsert.run({
        sourceText,
        language: 'tr',
        translation
      });
    });
  });

  insertTranslations(Object.entries(turkishMeaningTranslations));

  const legacyWords = loadAllLegacyDictionaryRecords();
  const normalizedImportSummary = await importNormalizedDatasets(database, {
    truncate: true,
    legacyWords
  });

  metadataInsert.run('built_at', new Date().toISOString());
  metadataInsert.run('translation_count', String(Object.keys(turkishMeaningTranslations).length));
  metadataInsert.run('legacy_dictionary_word_count', String(legacyWords.length));
  normalizedImportSummary.forEach((summary) => {
    metadataInsert.run(`${summary.tableName}_count`, String(summary.dbCount));
    metadataInsert.run(`${summary.tableName}_ndjson_lines`, String(summary.ndjsonLines));
    metadataInsert.run(`${summary.tableName}_legacy_merged`, String(summary.legacyMerged));
    metadataInsert.run(`${summary.tableName}_legacy_inserted`, String(summary.legacyInserted));
  });

  database.close();

  console.log(`SQLite database created at ${DATABASE_PATH}`);
  console.log(`- tr translations: ${Object.keys(turkishMeaningTranslations).length}`);
  console.log(`- legacy dictionary records merged from csv/: ${legacyWords.length}`);
  printNormalizedImportReport(normalizedImportSummary);
};

void rebuildDatabase().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
