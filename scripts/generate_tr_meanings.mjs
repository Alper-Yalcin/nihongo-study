import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SEP = '\n@@__SEP__@@\n';
const BATCH_SIZE = 50;
const CONCURRENCY = 4;
const RETRY_LIMIT = 3;
const OUTPUT_PATH = path.join(ROOT, 'src', 'data', 'meaningTranslations.ts');
const CSV_DIRS = [
  path.join(ROOT, 'csv', 'hiragana'),
  path.join(ROOT, 'csv', 'katakana')
];

function parseCsv(text) {
  const rows = [];
  let currentRow = [];
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
}

async function collectMeanings() {
  const meanings = new Set();

  for (const dir of CSV_DIRS) {
    const entries = await fs.readdir(dir);

    for (const entry of entries) {
      if (!entry.endsWith('.csv')) {
        continue;
      }

      const content = await fs.readFile(path.join(dir, entry), 'utf8');
      const rows = parseCsv(content.replace(/^\uFEFF/, ''));

      for (const row of rows.slice(1)) {
        const meaning = (row[2] || '').trim();

        if (meaning) {
          meanings.add(meaning);
        }
      }
    }
  }

  return [...meanings].sort((a, b) => a.localeCompare(b));
}

async function loadExistingMap() {
  try {
    const source = await fs.readFile(OUTPUT_PATH, 'utf8');
    const match = source.match(/= (\{[\s\S]*\});\s*$/);

    if (!match) {
      return {};
    }

    return JSON.parse(match[1]);
  } catch {
    return {};
  }
}

async function translateBatch(batch) {
  const query = encodeURIComponent(batch.join(SEP));
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tr&dt=t&q=${query}`;
  const response = await fetch(url, {
    headers: {
      'user-agent': 'Mozilla/5.0'
    }
  });

  if (!response.ok) {
    throw new Error(`Translation request failed with ${response.status}`);
  }

  const payload = await response.json();
  const translated = payload[0].map((item) => item[0]).join('');
  const parts = translated.split(SEP).map((item) => item.trim());

  if (parts.length !== batch.length) {
    throw new Error(`Separator mismatch: expected ${batch.length}, got ${parts.length}`);
  }

  return parts;
}

async function translateWithRetry(batch) {
  let lastError;

  for (let attempt = 1; attempt <= RETRY_LIMIT; attempt += 1) {
    try {
      return await translateBatch(batch);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
  }

  throw lastError;
}

async function writeMap(map) {
  const sortedEntries = Object.entries(map).sort(([left], [right]) => left.localeCompare(right));
  const jsonBody = JSON.stringify(Object.fromEntries(sortedEntries), null, 2);
  const source = `export const turkishMeaningTranslations: Record<string, string> = ${jsonBody};\n`;
  await fs.writeFile(OUTPUT_PATH, source, 'utf8');
}

async function main() {
  const meanings = await collectMeanings();
  const existingMap = await loadExistingMap();
  const untranslated = meanings.filter((meaning) => !existingMap[meaning]);
  const batches = [];

  for (let index = 0; index < untranslated.length; index += BATCH_SIZE) {
    batches.push(untranslated.slice(index, index + BATCH_SIZE));
  }

  console.log(`total meanings: ${meanings.length}`);
  console.log(`already translated: ${meanings.length - untranslated.length}`);
  console.log(`remaining batches: ${batches.length}`);

  let completedBatches = 0;
  const queue = [...batches];

  async function worker() {
    while (queue.length > 0) {
      const batch = queue.shift();

      if (!batch) {
        return;
      }

      const translations = await translateWithRetry(batch);

      batch.forEach((meaning, index) => {
        existingMap[meaning] = translations[index];
      });

      completedBatches += 1;
      if (completedBatches % 5 === 0 || completedBatches === batches.length) {
        console.log(`translated batches: ${completedBatches}/${batches.length}`);
        await writeMap(existingMap);
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, Math.max(batches.length, 1)) }, () => worker())
  );

  await writeMap(existingMap);
  console.log(`written: ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
