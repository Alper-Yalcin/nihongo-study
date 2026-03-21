import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { DATABASE_PATH, getDatabase } from './db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT || 3001);

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

const app = express();

app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({
    ok: true,
    databasePath: DATABASE_PATH
  });
});

app.get('/api/words', (request, response) => {
  try {
    const script = typeof request.query.script === 'string' ? request.query.script : '';

    if (!script) {
      response.status(400).json({
        error: 'The "script" query parameter is required.'
      });
      return;
    }

    const rows = getDatabase()
      .prepare(`
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
      `)
      .all(script) as Array<{
      id: string;
      script: string;
      kana: string;
      romaji: string;
      meaning: string | null;
      jlptLevel: string;
    }>;

    response.json({
      items: rows.map((row) => ({
        ...row,
        meaning: row.meaning ?? undefined
      }))
    });
  } catch (error) {
    response.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to load words.'
    });
  }
});

app.get('/api/translations/:language', (request, response) => {
  try {
    const language = request.params.language.toLowerCase();

    if (language !== 'tr') {
      response.json({
        language,
        entries: {}
      });
      return;
    }

    const rows = getDatabase()
      .prepare(`
        SELECT source_text AS sourceText, translation
        FROM meaning_translations
        WHERE language = ?
      `)
      .all(language) as Array<{ sourceText: string; translation: string }>;

    response.json({
      language,
      entries: Object.fromEntries(rows.map((row) => [row.sourceText, row.translation]))
    });
  } catch (error) {
    response.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to load translations.'
    });
  }
});

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));

  app.get('*', (request, response, next) => {
    if (request.path.startsWith('/api/')) {
      next();
      return;
    }

    response.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Nihongo Study backend listening on http://localhost:${PORT}`);
  console.log(`SQLite database: ${DATABASE_PATH}`);
});
