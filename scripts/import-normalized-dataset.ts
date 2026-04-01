import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath, pathToFileURL } from 'node:url';
import Database from 'better-sqlite3';
import { loadAllLegacyDictionaryRecords, LegacyDictionaryWordRecord } from './legacy-dictionary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DATABASE_PATH = path.join(ROOT, 'database', 'nihongo-study.sqlite');
const NORMALIZED_DIR = path.join(ROOT, 'data-sources', 'normalized');

type NormalizedWordScriptType = 'hiragana_word' | 'katakana_word' | 'kanji_word';
type NormalizedScriptType = NormalizedWordScriptType | 'kanji_character';

interface NormalizedDictionaryRecord {
  id: string;
  script_type: NormalizedScriptType;
  kanji: string | null;
  kana: string | null;
  romaji: string | null;
  meanings: string[];
  jlpt_level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | null;
  kanji_components: string[];
  onyomi: string[];
  kunyomi: string[];
  stroke_count: number | null;
  frequency: unknown;
  source: string;
  source_id: string;
  tags?: string | null;
  source_file?: string | null;
}

interface NormalizedImportSpec {
  tableName: 'hiragana_words' | 'katakana_words' | 'kanji_words' | 'kanji_characters';
  expectedScriptType: NormalizedScriptType;
  filePath: string;
}

interface NormalizedImportSummary {
  tableName: string;
  filePath: string;
  ndjsonLines: number;
  upserted: number;
  duplicates: number;
  skipped: number;
  failed: number;
  dbCount: number;
  legacyMerged: number;
  legacyInserted: number;
}

interface ExistingRow {
  id: string;
  meanings: string;
  jlpt_level: string | null;
  romaji: string | null;
  tags: string | null;
  source_file: string | null;
}

type ValidJlptLevel = NormalizedDictionaryRecord['jlpt_level'];

const BATCH_SIZE = 500;

const NORMALIZED_IMPORT_SPECS: readonly NormalizedImportSpec[] = [
  {
    tableName: 'hiragana_words',
    expectedScriptType: 'hiragana_word',
    filePath: path.join(NORMALIZED_DIR, 'hiragana_words.ndjson')
  },
  {
    tableName: 'katakana_words',
    expectedScriptType: 'katakana_word',
    filePath: path.join(NORMALIZED_DIR, 'katakana_words.ndjson')
  },
  {
    tableName: 'kanji_words',
    expectedScriptType: 'kanji_word',
    filePath: path.join(NORMALIZED_DIR, 'kanji_words.ndjson')
  },
  {
    tableName: 'kanji_characters',
    expectedScriptType: 'kanji_character',
    filePath: path.join(NORMALIZED_DIR, 'kanji_characters.ndjson')
  }
] as const;

const JLPT_LEVEL_VALUES = ['N5', 'N4', 'N3', 'N2', 'N1'] as const;
const VALID_JLPT_LEVELS = new Set<string>(JLPT_LEVEL_VALUES);
const JLPT_LEVEL_ORDER = [...JLPT_LEVEL_VALUES];

const pickPreferredJlpt = (currentLevel: ValidJlptLevel, candidateLevel: ValidJlptLevel) => {
  if (!candidateLevel) {
    return currentLevel;
  }

  if (!currentLevel) {
    return candidateLevel;
  }

  const currentIndex = JLPT_LEVEL_ORDER.indexOf(currentLevel);
  const candidateIndex = JLPT_LEVEL_ORDER.indexOf(candidateLevel);

  if (currentIndex === -1) {
    return candidateLevel;
  }

  if (candidateIndex === -1) {
    return currentLevel;
  }

  return candidateIndex < currentIndex ? candidateLevel : currentLevel;
};

const parseJsonArray = (value: string | null): string[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

const toValidJlptLevel = (value: string | null | undefined): ValidJlptLevel =>
  value && VALID_JLPT_LEVELS.has(value) ? (value as ValidJlptLevel) : null;

const mergeUniqueStrings = (left: string[], right: Array<string | undefined | null>) => {
  const seen = new Set(left);
  const merged = [...left];

  right.forEach((value) => {
    if (!value) {
      return;
    }

    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) {
      return;
    }

    seen.add(trimmed);
    merged.push(trimmed);
  });

  return merged;
};

const ensureColumn = (database: Database.Database, tableName: string, columnName: string, columnDefinition: string) => {
  const columns = database.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
  const hasColumn = columns.some((column) => column.name === columnName);

  if (!hasColumn) {
    database.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
  }
};

const ensureNormalizedTable = (database: Database.Database, spec: NormalizedImportSpec) => {
  const isCharacterTable = spec.tableName === 'kanji_characters';

  database.exec(`
    CREATE TABLE IF NOT EXISTS ${spec.tableName} (
      id TEXT PRIMARY KEY,
      script_type TEXT NOT NULL,
      kanji TEXT,
      kana TEXT,
      romaji TEXT,
      meanings TEXT NOT NULL,
      jlpt_level TEXT,
      kanji_components TEXT NOT NULL,
      onyomi TEXT NOT NULL,
      kunyomi TEXT NOT NULL,
      stroke_count INTEGER,
      frequency TEXT,
      source TEXT NOT NULL,
      source_id TEXT NOT NULL,
      tags TEXT,
      source_file TEXT,
      CHECK (
        jlpt_level IS NULL
        OR jlpt_level IN ('N5', 'N4', 'N3', 'N2', 'N1')
      ),
      CHECK (
        script_type = '${spec.expectedScriptType}'
      )
      ${isCharacterTable ? ", CHECK (kanji IS NOT NULL AND length(kanji) = 1)" : ''}
    );
  `);

  ensureColumn(database, spec.tableName, 'tags', 'TEXT');
  ensureColumn(database, spec.tableName, 'source_file', 'TEXT');

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_${spec.tableName}_kana
      ON ${spec.tableName} (kana);

    CREATE INDEX IF NOT EXISTS idx_${spec.tableName}_kanji
      ON ${spec.tableName} (kanji);

    CREATE INDEX IF NOT EXISTS idx_${spec.tableName}_jlpt_level
      ON ${spec.tableName} (jlpt_level);

    CREATE INDEX IF NOT EXISTS idx_${spec.tableName}_source_id
      ON ${spec.tableName} (source_id);
  `);
};

export const ensureNormalizedDatasetTables = (database: Database.Database) => {
  NORMALIZED_IMPORT_SPECS.forEach((spec) => ensureNormalizedTable(database, spec));
};

const createUpsertStatement = (database: Database.Database, tableName: string) =>
  database.prepare(`
    INSERT INTO ${tableName} (
      id,
      script_type,
      kanji,
      kana,
      romaji,
      meanings,
      jlpt_level,
      kanji_components,
      onyomi,
      kunyomi,
      stroke_count,
      frequency,
      source,
      source_id,
      tags,
      source_file
    ) VALUES (
      @id,
      @script_type,
      @kanji,
      @kana,
      @romaji,
      @meanings,
      @jlpt_level,
      @kanji_components,
      @onyomi,
      @kunyomi,
      @stroke_count,
      @frequency,
      @source,
      @source_id,
      @tags,
      @source_file
    )
    ON CONFLICT(id) DO UPDATE SET
      script_type = excluded.script_type,
      kanji = excluded.kanji,
      kana = excluded.kana,
      romaji = excluded.romaji,
      meanings = excluded.meanings,
      jlpt_level = excluded.jlpt_level,
      kanji_components = excluded.kanji_components,
      onyomi = excluded.onyomi,
      kunyomi = excluded.kunyomi,
      stroke_count = excluded.stroke_count,
      frequency = excluded.frequency,
      source = excluded.source,
      source_id = excluded.source_id,
      tags = excluded.tags,
      source_file = excluded.source_file
  `);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const validateNormalizedRecord = (
  value: unknown,
  expectedScriptType: NormalizedScriptType
): { ok: true; record: NormalizedDictionaryRecord } | { ok: false; reason: string } => {
  if (!value || typeof value !== 'object') {
    return { ok: false, reason: 'Record is not an object.' };
  }

  const record = value as Partial<NormalizedDictionaryRecord>;

  if (typeof record.id !== 'string' || !record.id.trim()) {
    return { ok: false, reason: 'Missing id.' };
  }

  if (record.script_type !== expectedScriptType) {
    return { ok: false, reason: `Unexpected script_type: ${String(record.script_type)}` };
  }

  if (!isStringArray(record.meanings) || record.meanings.length === 0) {
    return { ok: false, reason: 'meanings must be a non-empty string array.' };
  }

  if (!isStringArray(record.kanji_components)) {
    return { ok: false, reason: 'kanji_components must be a string array.' };
  }

  if (!isStringArray(record.onyomi)) {
    return { ok: false, reason: 'onyomi must be a string array.' };
  }

  if (!isStringArray(record.kunyomi)) {
    return { ok: false, reason: 'kunyomi must be a string array.' };
  }

  if (record.romaji !== null && typeof record.romaji !== 'string') {
    return { ok: false, reason: 'romaji must be string or null.' };
  }

  if (record.jlpt_level !== null && record.jlpt_level !== undefined && !VALID_JLPT_LEVELS.has(record.jlpt_level)) {
    return { ok: false, reason: `Invalid jlpt_level: ${String(record.jlpt_level)}` };
  }

  if (expectedScriptType === 'kanji_character') {
    if (typeof record.kanji !== 'string' || [...record.kanji].length !== 1) {
      return { ok: false, reason: 'kanji_character record must have a single-character kanji.' };
    }
  } else if (typeof record.kana !== 'string' || !record.kana.trim()) {
    return { ok: false, reason: 'Word record must have non-empty kana.' };
  }

  if (typeof record.source !== 'string' || !record.source.trim()) {
    return { ok: false, reason: 'Missing source.' };
  }

  if (typeof record.source_id !== 'string' || !record.source_id.trim()) {
    return { ok: false, reason: 'Missing source_id.' };
  }

  return {
    ok: true,
    record: record as NormalizedDictionaryRecord
  };
};

const serializeRecord = (record: NormalizedDictionaryRecord) => ({
  id: record.id,
  script_type: record.script_type,
  kanji: record.kanji,
  kana: record.kana,
  romaji: record.romaji,
  meanings: JSON.stringify(record.meanings),
  jlpt_level: record.jlpt_level,
  kanji_components: JSON.stringify(record.kanji_components),
  onyomi: JSON.stringify(record.onyomi),
  kunyomi: JSON.stringify(record.kunyomi),
  stroke_count: record.stroke_count,
  frequency: record.frequency == null ? null : JSON.stringify(record.frequency),
  source: record.source,
  source_id: record.source_id,
  tags: record.tags ?? null,
  source_file: record.source_file ?? null
});

const importSpecIntoTable = async (
  database: Database.Database,
  spec: NormalizedImportSpec,
  truncate: boolean
): Promise<NormalizedImportSummary> => {
  if (!fs.existsSync(spec.filePath)) {
    throw new Error(`Normalized dataset file not found: ${spec.filePath}. Run "npm run data:normalize" first.`);
  }

  ensureNormalizedTable(database, spec);

  if (truncate) {
    database.prepare(`DELETE FROM ${spec.tableName}`).run();
  }

  const upsert = createUpsertStatement(database, spec.tableName);
  const upsertBatch = database.transaction((batch: ReturnType<typeof serializeRecord>[]) => {
    batch.forEach((row) => upsert.run(row));
  });
  const countRows = database.prepare(`SELECT COUNT(*) AS count FROM ${spec.tableName}`);

  const summary: NormalizedImportSummary = {
    tableName: spec.tableName,
    filePath: spec.filePath,
    ndjsonLines: 0,
    upserted: 0,
    duplicates: 0,
    skipped: 0,
    failed: 0,
    dbCount: 0,
    legacyMerged: 0,
    legacyInserted: 0
  };

  const seenIds = new Set<string>();
  const batch: ReturnType<typeof serializeRecord>[] = [];
  const input = fs.createReadStream(spec.filePath, { encoding: 'utf8' });
  const lines = readline.createInterface({
    input,
    crlfDelay: Infinity
  });

  const flushBatch = () => {
    if (batch.length === 0) {
      return;
    }

    try {
      upsertBatch(batch);
      summary.upserted += batch.length;
    } catch {
      batch.forEach((row) => {
        try {
          upsert.run(row);
          summary.upserted += 1;
        } catch {
          summary.failed += 1;
        }
      });
    } finally {
      batch.length = 0;
    }
  };

  for await (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    summary.ndjsonLines += 1;

    let parsed: unknown;
    try {
      parsed = JSON.parse(line);
    } catch {
      summary.failed += 1;
      continue;
    }

    const validation = validateNormalizedRecord(parsed, spec.expectedScriptType);
    if (!validation.ok) {
      summary.skipped += 1;
      continue;
    }

    if (seenIds.has(validation.record.id)) {
      summary.duplicates += 1;
      continue;
    }

    seenIds.add(validation.record.id);
    batch.push(serializeRecord(validation.record));

    if (batch.length >= BATCH_SIZE) {
      flushBatch();
    }
  }

  flushBatch();
  lines.close();

  summary.dbCount = (countRows.get() as { count: number }).count;
  return summary;
};

const createLegacyMatchHelpers = (database: Database.Database) => ({
  hiragana_words: {
    find: database.prepare<{
      kana: string;
      romaji: string;
    }, ExistingRow[]>(`
      SELECT id, meanings, jlpt_level, romaji, tags, source_file
      FROM hiragana_words
      WHERE kana = @kana AND romaji = @romaji
    `),
    update: database.prepare(`
      UPDATE hiragana_words
      SET meanings = @meanings,
          jlpt_level = @jlpt_level,
          romaji = @romaji,
          tags = @tags,
          source_file = @source_file
      WHERE id = @id
    `)
  },
  katakana_words: {
    find: database.prepare<{
      kana: string;
      romaji: string;
    }, ExistingRow[]>(`
      SELECT id, meanings, jlpt_level, romaji, tags, source_file
      FROM katakana_words
      WHERE kana = @kana AND romaji = @romaji
    `),
    update: database.prepare(`
      UPDATE katakana_words
      SET meanings = @meanings,
          jlpt_level = @jlpt_level,
          romaji = @romaji,
          tags = @tags,
          source_file = @source_file
      WHERE id = @id
    `)
  },
  kanji_words: {
    find: database.prepare<{
      kanji: string;
      kana: string;
    }, ExistingRow[]>(`
      SELECT id, meanings, jlpt_level, romaji, tags, source_file
      FROM kanji_words
      WHERE kanji = @kanji AND kana = @kana
    `),
    update: database.prepare(`
      UPDATE kanji_words
      SET meanings = @meanings,
          jlpt_level = @jlpt_level,
          romaji = @romaji,
          tags = @tags,
          source_file = @source_file
      WHERE id = @id
    `)
  }
});

const createLegacyInsertStatements = (database: Database.Database) => ({
  hiragana_words: createUpsertStatement(database, 'hiragana_words'),
  katakana_words: createUpsertStatement(database, 'katakana_words'),
  kanji_words: createUpsertStatement(database, 'kanji_words')
});

const meaningsOverlap = (candidateMeanings: string[], legacyMeaning?: string) => {
  if (!legacyMeaning) {
    return false;
  }

  const normalizedLegacyMeaning = legacyMeaning.trim().toLowerCase();
  return candidateMeanings.some((candidateMeaning) => candidateMeaning.trim().toLowerCase() === normalizedLegacyMeaning);
};

const pickLegacyMatch = (candidates: ExistingRow[], legacyMeaning?: string) => {
  if (candidates.length === 0) {
    return null;
  }

  const exactMeaningMatch = candidates.find((candidate) => meaningsOverlap(parseJsonArray(candidate.meanings), legacyMeaning));
  if (exactMeaningMatch) {
    return exactMeaningMatch;
  }

  return candidates.length === 1 ? candidates[0] : null;
};

const mapLegacyScriptToTable = (script: LegacyDictionaryWordRecord['script']) => {
  switch (script) {
    case 'hiragana':
      return {
        tableName: 'hiragana_words' as const,
        scriptType: 'hiragana_word' as const
      };
    case 'katakana':
      return {
        tableName: 'katakana_words' as const,
        scriptType: 'katakana_word' as const
      };
    case 'kanji':
      return {
        tableName: 'kanji_words' as const,
        scriptType: 'kanji_word' as const
      };
  }
};

const importLegacyDictionaryWords = (
  database: Database.Database,
  summaries: NormalizedImportSummary[],
  legacyRecords: LegacyDictionaryWordRecord[]
) => {
  const matches = createLegacyMatchHelpers(database);
  const inserts = createLegacyInsertStatements(database);

  const insertLegacyRecord = database.transaction(
    (tableName: 'hiragana_words' | 'katakana_words' | 'kanji_words', row: ReturnType<typeof serializeRecord>) => {
      inserts[tableName].run(row);
    }
  );

  for (const record of legacyRecords) {
    const mapping = mapLegacyScriptToTable(record.script);
    const summary = summaries.find((item) => item.tableName === mapping.tableName);

    if (!summary) {
      continue;
    }

    const candidates =
      mapping.tableName === 'kanji_words'
        ? matches.kanji_words.find.all({
            kanji: record.expression,
            kana: record.kana
          })
        : matches[mapping.tableName].find.all({
            kana: record.kana,
            romaji: record.romaji
          });

    const existing = pickLegacyMatch(candidates, record.meaning);

    if (existing) {
      const mergedMeanings = mergeUniqueStrings(parseJsonArray(existing.meanings), [record.meaning]);
      const mergedTags = mergeUniqueStrings(
        existing.tags ? existing.tags.split(/\s*\|\s*/) : [],
        [record.tags]
      );
      const mergedSourceFiles = mergeUniqueStrings(
        existing.source_file ? existing.source_file.split(/\s*\|\s*/) : [],
        [record.sourceFile]
      );

      matches[mapping.tableName].update.run({
        id: existing.id,
        meanings: JSON.stringify(mergedMeanings),
        jlpt_level: pickPreferredJlpt(toValidJlptLevel(existing.jlpt_level), toValidJlptLevel(record.jlptLevel)),
        romaji: existing.romaji || record.romaji,
        tags: mergedTags.length > 0 ? mergedTags.join(' | ') : null,
        source_file: mergedSourceFiles.length > 0 ? mergedSourceFiles.join(' | ') : null
      });
      summary.legacyMerged += 1;
      continue;
    }

    insertLegacyRecord(
      mapping.tableName,
      serializeRecord({
        id: `legacy-${record.id}`,
        script_type: mapping.scriptType,
        kanji: record.script === 'kanji' ? record.expression : null,
        kana: record.kana,
        romaji: record.romaji,
        meanings: record.meaning ? [record.meaning] : [],
        jlpt_level: toValidJlptLevel(record.jlptLevel),
        kanji_components:
          record.script === 'kanji'
            ? [...new Set([...record.expression].filter((character) => /\p{Unified_Ideograph}/u.test(character)))]
            : [],
        onyomi: [],
        kunyomi: [],
        stroke_count: null,
        frequency: null,
        source: 'legacy_csv',
        source_id: `legacy_csv:${record.id}`,
        tags: record.tags ?? null,
        source_file: record.sourceFile
      })
    );
    summary.legacyInserted += 1;
  }

  summaries.forEach((summary) => {
    summary.dbCount = (
      database.prepare(`SELECT COUNT(*) AS count FROM ${summary.tableName}`).get() as { count: number }
    ).count;
  });
};

export const importNormalizedDatasets = async (
  database: Database.Database,
  options: { truncate?: boolean; legacyWords?: LegacyDictionaryWordRecord[] } = {}
): Promise<NormalizedImportSummary[]> => {
  const truncate = options.truncate ?? true;
  const summaries: NormalizedImportSummary[] = [];

  for (const spec of NORMALIZED_IMPORT_SPECS) {
    // eslint-disable-next-line no-await-in-loop
    const summary = await importSpecIntoTable(database, spec, truncate);
    summaries.push(summary);
  }

  importLegacyDictionaryWords(database, summaries, options.legacyWords ?? loadAllLegacyDictionaryRecords());
  return summaries;
};

export const printNormalizedImportReport = (summaries: NormalizedImportSummary[]) => {
  console.log('Normalized dataset import summary:');
  summaries.forEach((summary) => {
    console.log(
      `- ${summary.tableName}: ndjson=${summary.ndjsonLines} db=${summary.dbCount} upserted=${summary.upserted} duplicates=${summary.duplicates} skipped=${summary.skipped} failed=${summary.failed} legacyMerged=${summary.legacyMerged} legacyInserted=${summary.legacyInserted}`
    );
  });
};

const main = async () => {
  if (!fs.existsSync(DATABASE_PATH)) {
    throw new Error(`Database file not found at ${DATABASE_PATH}. Run "npm run db:build" first.`);
  }

  const database = new Database(DATABASE_PATH, {
    fileMustExist: true
  });
  database.pragma('foreign_keys = ON');

  try {
    const summaries = await importNormalizedDatasets(database, { truncate: true });
    printNormalizedImportReport(summaries);
  } finally {
    database.close();
  }
};

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
