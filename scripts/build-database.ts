import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { turkishMeaningTranslations } from '../src/data/meaningTranslations';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DATABASE_DIR = path.join(ROOT, 'database');
const DATABASE_PATH = path.join(DATABASE_DIR, 'nihongo-study.sqlite');
const JLPT_LEVEL_ORDER = ['N5', 'N4', 'N3', 'N2', 'N1'];

type DictionaryScript = 'hiragana' | 'katakana' | 'kanji';

interface DictionaryWordRecord {
  id: string;
  script: DictionaryScript;
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
  script: DictionaryScript,
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

const sortRecords = (records: DictionaryWordRecord[]) =>
  records.sort((a, b) => {
    const levelDiff = JLPT_LEVEL_ORDER.indexOf(a.jlptLevel) - JLPT_LEVEL_ORDER.indexOf(b.jlptLevel);

    if (levelDiff !== 0) {
      return levelDiff;
    }

    return a.romaji.localeCompare(b.romaji);
  });

const loadDictionaryRecords = (script: DictionaryScript): DictionaryWordRecord[] => {
  const directory = path.join(ROOT, 'csv', script);
  const fileNames = fs.readdirSync(directory).filter((fileName) => fileName.endsWith('.csv')).sort();
  const uniqueWords = new Map<string, DictionaryWordRecord>();

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

const ensureDatabaseDirectory = () => {
  fs.mkdirSync(DATABASE_DIR, { recursive: true });
};

const rebuildDatabase = () => {
  ensureDatabaseDirectory();

  if (fs.existsSync(DATABASE_PATH)) {
    fs.rmSync(DATABASE_PATH, { force: true });
  }

  const database = new Database(DATABASE_PATH);
  database.pragma('foreign_keys = ON');

  database.exec(`
    CREATE TABLE dictionary_words (
      id TEXT PRIMARY KEY,
      script TEXT NOT NULL,
      expression TEXT NOT NULL,
      kana TEXT NOT NULL,
      romaji TEXT NOT NULL,
      meaning TEXT,
      tags TEXT,
      jlpt_level TEXT NOT NULL,
      source_file TEXT NOT NULL
    );

    CREATE INDEX idx_dictionary_words_script_jlpt_romaji
      ON dictionary_words (script, jlpt_level, romaji);

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

  const dictionaryInsert = database.prepare(`
    INSERT INTO dictionary_words (
      id,
      script,
      expression,
      kana,
      romaji,
      meaning,
      tags,
      jlpt_level,
      source_file
    ) VALUES (
      @id,
      @script,
      @expression,
      @kana,
      @romaji,
      @meaning,
      @tags,
      @jlptLevel,
      @sourceFile
    )
  `);

  const translationInsert = database.prepare(`
    INSERT INTO meaning_translations (source_text, language, translation)
    VALUES (@sourceText, @language, @translation)
  `);

  const metadataInsert = database.prepare(`
    INSERT INTO metadata (key, value)
    VALUES (?, ?)
  `);

  const allWords = [
    ...loadDictionaryRecords('hiragana'),
    ...loadDictionaryRecords('katakana'),
    ...loadDictionaryRecords('kanji')
  ];

  const insertWords = database.transaction((records: DictionaryWordRecord[]) => {
    records.forEach((record) => dictionaryInsert.run(record));
  });

  const insertTranslations = database.transaction((entries: Array<[string, string]>) => {
    entries.forEach(([sourceText, translation]) => {
      translationInsert.run({
        sourceText,
        language: 'tr',
        translation
      });
    });
  });

  insertWords(allWords);
  insertTranslations(Object.entries(turkishMeaningTranslations));

  metadataInsert.run('built_at', new Date().toISOString());
  metadataInsert.run('word_count', String(allWords.length));
  metadataInsert.run('translation_count', String(Object.keys(turkishMeaningTranslations).length));

  const summary = database
    .prepare(`
      SELECT script, COUNT(*) AS count
      FROM dictionary_words
      GROUP BY script
      ORDER BY script
    `)
    .all() as Array<{ script: string; count: number }>;

  database.close();

  console.log(`SQLite database created at ${DATABASE_PATH}`);
  summary.forEach(({ script, count }) => {
    console.log(`- ${script}: ${count} words`);
  });
  console.log(`- tr translations: ${Object.keys(turkishMeaningTranslations).length}`);
};

rebuildDatabase();
