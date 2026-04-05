import fs from 'node:fs/promises';
import path from 'node:path';
import Database from 'better-sqlite3';

const ROOT = process.cwd();
const DATABASE_PATH = path.join(ROOT, 'database', 'nihongo-study.sqlite');
const BASE_TRANSLATIONS_PATH = path.join(ROOT, 'scripts', 'data', 'meaningTranslations.ts');
const GENERATED_TRANSLATIONS_PATH = path.join(ROOT, 'scripts', 'data', 'meaningTranslations.generated.json');
const TARGET_LANGUAGE = 'tr';
const SEP = '\n[[[NIHONGO_STUDY_SEP_3D9D1D]]]\n';
const TABLES = ['hiragana_words', 'katakana_words', 'kanji_words', 'kanji_characters'];

const DEFAULT_BATCH_ITEM_LIMIT = 20;
const DEFAULT_BATCH_CHAR_LIMIT = 1000;
const DEFAULT_CONCURRENCY = 2;
const DEFAULT_RETRY_LIMIT = 4;
const DEFAULT_PROGRESS_EVERY = 20;

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    databasePath: DATABASE_PATH,
    outputPath: GENERATED_TRANSLATIONS_PATH,
    batchItemLimit: DEFAULT_BATCH_ITEM_LIMIT,
    batchCharLimit: DEFAULT_BATCH_CHAR_LIMIT,
    concurrency: DEFAULT_CONCURRENCY,
    retryLimit: DEFAULT_RETRY_LIMIT,
    progressEvery: DEFAULT_PROGRESS_EVERY,
    limit: null,
    updateDb: true,
    syncDbOnly: false
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--database') {
      options.databasePath = args[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--output') {
      options.outputPath = args[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--batch-size') {
      options.batchItemLimit = Number(args[index + 1]);
      index += 1;
      continue;
    }

    if (arg === '--batch-char-limit') {
      options.batchCharLimit = Number(args[index + 1]);
      index += 1;
      continue;
    }

    if (arg === '--concurrency') {
      options.concurrency = Number(args[index + 1]);
      index += 1;
      continue;
    }

    if (arg === '--retry-limit') {
      options.retryLimit = Number(args[index + 1]);
      index += 1;
      continue;
    }

    if (arg === '--progress-every') {
      options.progressEvery = Number(args[index + 1]);
      index += 1;
      continue;
    }

    if (arg === '--limit') {
      options.limit = Number(args[index + 1]);
      index += 1;
      continue;
    }

    if (arg === '--no-update-db') {
      options.updateDb = false;
      continue;
    }

    if (arg === '--sync-db-only') {
      options.syncDbOnly = true;
      continue;
    }
  }

  return options;
};

const normalizeMeaning = (value) => (typeof value === 'string' ? value.trim() : '');
const hasOwnTranslation = (map, key) => Object.prototype.hasOwnProperty.call(map, key);

async function loadBaseMap() {
  try {
    const source = await fs.readFile(BASE_TRANSLATIONS_PATH, 'utf8');
    const match = source.match(/= (\{[\s\S]*\});\s*$/);

    if (!match) {
      return {};
    }

    return JSON.parse(match[1]);
  } catch {
    return {};
  }
}

async function loadGeneratedMap(outputPath) {
  try {
    return JSON.parse(await fs.readFile(outputPath, 'utf8'));
  } catch {
    return {};
  }
}

function collectMeanings(databasePath) {
  const database = new Database(databasePath, { readonly: true });
  const meanings = new Set();

  try {
    for (const tableName of TABLES) {
      const rows = database.prepare(`SELECT meanings FROM ${tableName}`).iterate();

      for (const row of rows) {
        try {
          const parsed = JSON.parse(row.meanings);

          if (!Array.isArray(parsed)) {
            continue;
          }

          const joined = parsed
            .filter((item) => typeof item === 'string')
            .map((item) => item.trim())
            .filter(Boolean)
            .join('; ');

          if (joined) {
            meanings.add(joined);
          }
        } catch {
          continue;
        }
      }
    }
  } finally {
    database.close();
  }

  return [...meanings].sort((left, right) => left.localeCompare(right));
}

function createBatches(values, itemLimit, charLimit) {
  const batches = [];
  let currentBatch = [];
  let currentCharCount = 0;

  for (const value of values) {
    const nextCount = currentCharCount + value.length + SEP.length;
    const shouldFlush =
      currentBatch.length > 0 &&
      (currentBatch.length >= itemLimit || nextCount > charLimit);

    if (shouldFlush) {
      batches.push(currentBatch);
      currentBatch = [];
      currentCharCount = 0;
    }

    currentBatch.push(value);
    currentCharCount += value.length + SEP.length;
  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  return batches;
}

async function translateJoinedText(text) {
  const params = new URLSearchParams({
    client: 'gtx',
    sl: 'en',
    tl: TARGET_LANGUAGE,
    dt: 't',
    q: text
  });

  const response = await fetch(`https://translate.googleapis.com/translate_a/single?${params.toString()}`, {
    headers: {
      'user-agent': 'Mozilla/5.0'
    }
  });

  if (!response.ok) {
    throw new Error(`Translation request failed with ${response.status}`);
  }

  const payload = await response.json();
  const translated = Array.isArray(payload?.[0]) ? payload[0].map((item) => item[0]).join('') : '';

  if (!translated) {
    throw new Error('Translation payload was empty.');
  }

  return translated;
}

async function translateBatch(batch, retryLimit) {
  let lastError = null;

  for (let attempt = 1; attempt <= retryLimit; attempt += 1) {
    try {
      const translated = await translateJoinedText(batch.join(SEP));
      const parts = translated.split(SEP).map((item) => normalizeMeaning(item));

      if (parts.length !== batch.length) {
        throw new Error(`Separator mismatch: expected ${batch.length}, got ${parts.length}`);
      }

      return parts;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
    }
  }

  if (batch.length === 1) {
    throw lastError;
  }

  const midpoint = Math.ceil(batch.length / 2);
  const left = await translateBatch(batch.slice(0, midpoint), retryLimit);
  const right = await translateBatch(batch.slice(midpoint), retryLimit);
  return [...left, ...right];
}

async function writeGeneratedMap(outputPath, generatedMap) {
  const sortedEntries = Object.entries(generatedMap).sort(([left], [right]) => left.localeCompare(right));
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(Object.fromEntries(sortedEntries), null, 2)}\n`, 'utf8');
}

function upsertTranslations(databasePath, translations) {
  const database = new Database(databasePath);
  const insert = database.prepare(`
    INSERT INTO meaning_translations (source_text, language, translation)
    VALUES (@sourceText, @language, @translation)
    ON CONFLICT(source_text, language) DO UPDATE SET
      translation = excluded.translation
  `);

  try {
    const run = database.transaction((entries) => {
      entries.forEach(([sourceText, translation]) => {
        insert.run({
          sourceText,
          language: TARGET_LANGUAGE,
          translation
        });
      });
    });

    run(translations);
  } finally {
    database.close();
  }
}

function readDatabaseTranslationCount(databasePath) {
  const database = new Database(databasePath, { readonly: true });

  try {
    const row = database.prepare(`SELECT COUNT(*) AS count FROM meaning_translations WHERE language = ?`).get(TARGET_LANGUAGE);
    return Number(row.count || 0);
  } finally {
    database.close();
  }
}

async function main() {
  const options = parseArgs();
  const baseMap = await loadBaseMap();
  const generatedMap = await loadGeneratedMap(options.outputPath);
  const existingMap = {
    ...baseMap,
    ...generatedMap
  };

  const allMeanings = collectMeanings(options.databasePath);

  if (options.syncDbOnly) {
    if (options.updateDb) {
      const deltaEntries = Object.entries(generatedMap);
      upsertTranslations(options.databasePath, deltaEntries);
      console.log(`db_translation_count=${readDatabaseTranslationCount(options.databasePath)}`);
    }
    console.log(`generated_output=${options.outputPath}`);
    return;
  }

  const missing = allMeanings.filter((meaning) => !hasOwnTranslation(existingMap, meaning));
  const targetMeanings = options.limit ? missing.slice(0, options.limit) : missing;
  const batches = createBatches(targetMeanings, options.batchItemLimit, options.batchCharLimit);

  console.log(`distinct_meanings=${allMeanings.length}`);
  console.log(`already_translated=${allMeanings.length - missing.length}`);
  console.log(`missing_total=${missing.length}`);
  console.log(`run_target=${targetMeanings.length}`);
  console.log(`batches=${batches.length}`);

  if (targetMeanings.length === 0) {
    console.log('No missing meanings found.');
    return;
  }

  let translatedCount = 0;
  let completedBatches = 0;
  const queue = [...batches];
  const pendingDbEntries = [];

  const flushProgress = async () => {
    await writeGeneratedMap(options.outputPath, generatedMap);

    if (options.updateDb && pendingDbEntries.length > 0) {
      upsertTranslations(options.databasePath, pendingDbEntries.splice(0, pendingDbEntries.length));
    }
  };

  async function worker() {
    while (queue.length > 0) {
      const batch = queue.shift();

      if (!batch) {
        return;
      }

      const translations = await translateBatch(batch, options.retryLimit);

      batch.forEach((meaning, index) => {
        generatedMap[meaning] = translations[index];
        pendingDbEntries.push([meaning, translations[index]]);
      });

      translatedCount += batch.length;
      completedBatches += 1;

      if (completedBatches % options.progressEvery === 0 || completedBatches === batches.length) {
        await flushProgress();
        console.log(`translated_batches=${completedBatches}/${batches.length} translated_meanings=${translatedCount}/${targetMeanings.length}`);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(options.concurrency, Math.max(batches.length, 1)) }, () => worker())
  );

  await flushProgress();
  console.log(`db_translation_count=${readDatabaseTranslationCount(options.databasePath)}`);

  console.log(`generated_output=${options.outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
