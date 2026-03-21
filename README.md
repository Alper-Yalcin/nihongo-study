# Nihongo Study

React + Vite frontend and Express + SQLite backend for kana, kanji, listening, drawing, and dictionary study flows.

## Local development

1. Install dependencies with `npm install`.
2. Build the SQLite database with `npm run db:build`.
3. Start the backend with `npm run dev:server`.
4. In a second terminal, start the frontend with `npm run dev`.

## Environment variables

- `PORT`: Backend port. Defaults to `3001`.
- `VITE_API_PROXY_TARGET`: Frontend proxy target. Defaults to `http://localhost:3001`.
