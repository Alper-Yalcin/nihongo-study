import fs from 'node:fs'
import path from 'node:path'
import Database from 'better-sqlite3'

export const DATABASE_PATH =
  process.env.DATABASE_PATH ||
  path.join(process.cwd(), 'database', 'kototsuna.sqlite')

let database: Database.Database | null = null

export const getDatabase = () => {
  if (database) {
    return database
  }

  if (!fs.existsSync(DATABASE_PATH)) {
    throw new Error(
      `Database file not found at ${DATABASE_PATH}. ` +
      `Run "npm run db:build" in the original project or set DATABASE_PATH in .env.local.`
    )
  }

  database = new Database(DATABASE_PATH, { fileMustExist: true })
  database.pragma('foreign_keys = ON')

  return database
}
