import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

export const DATABASE_PATH = path.join(ROOT, 'database', 'kotonoha.sqlite');

let database: Database.Database | null = null;

export const getDatabase = () => {
  if (database) {
    return database;
  }

  if (!fs.existsSync(DATABASE_PATH)) {
    throw new Error(
      `Database file not found at ${DATABASE_PATH}. Run "npm run db:build" first.`
    );
  }

  database = new Database(DATABASE_PATH, {
    fileMustExist: true
  });
  database.pragma('foreign_keys = ON');

  return database;
};
