# Kototsuna

React + Vite frontend and Express + SQLite backend for kana, kanji, listening, drawing, and dictionary study flows.

- `Frontend/`: React + Vite source tree
- `Backend/`: Express server plus raw/normalized dictionary source files

## Local development

1. Install dependencies with `npm install`.
2. Build the SQLite database with `npm run db:build`.
   This rebuilds the SQLite database and imports the full normalized NDJSON dataset into:
   `hiragana_words`, `katakana_words`, `kanji_words`, and `kanji_characters`.
3. Start the backend with `npm run dev:server`.
4. In a second terminal, start the frontend with `npm run dev`.

## Normalized Dataset Import

- Refresh only the normalized NDJSON tables in the existing SQLite database:
  `npm run data:import-db`
- The old `dictionary_words` table is no longer created. Dictionary word data now lives in:
  `hiragana_words`, `katakana_words`, `kanji_words`, and `kanji_characters`
- Source files imported:
  `Backend/data-sources/normalized/hiragana_words.ndjson`
  `Backend/data-sources/normalized/katakana_words.ndjson`
  `Backend/data-sources/normalized/kanji_words.ndjson`
  `Backend/data-sources/normalized/kanji_characters.ndjson`
- Verification:
  After import, the command prints NDJSON line count, inserted/upserted count, duplicate count, skipped count, failed count, and final DB row count for each table.

## Environment variables

- `PORT`: Backend port. Defaults to `3001`.
- `VITE_API_PROXY_TARGET`: Frontend proxy target. Defaults to `http://localhost:3001`.
