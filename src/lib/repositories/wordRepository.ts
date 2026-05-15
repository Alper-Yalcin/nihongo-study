import { getDatabase } from '@/lib/db'

const WORD_TABLE_BY_SCRIPT = {
  hiragana: 'hiragana_words',
  katakana: 'katakana_words',
  kanji: 'kanji_words'
} as const

export type DictionaryScript = keyof typeof WORD_TABLE_BY_SCRIPT
export type DictionaryQueryMode = 'contains' | 'prefix' | 'exact'
export type DictionaryJlptLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1'

const VALID_QUERY_MODES = new Set<DictionaryQueryMode>(['contains', 'prefix', 'exact'])
const VALID_JLPT_LEVELS = new Set<DictionaryJlptLevel>(['N5', 'N4', 'N3', 'N2', 'N1'])

interface DictionaryWordDbRow {
  id: string
  scriptType: string
  kanji: string | null
  kana: string | null
  romaji: string | null
  meanings: string
}

export interface DictionaryWordRow {
  id: string
  script: DictionaryScript
  kanji?: string
  kana: string
  romaji: string
  meaning?: string
  meanings: string[]
  jlptLevel: DictionaryJlptLevel | null
  tags?: string
}

interface DictionaryWordFilter {
  query?: string
  mode?: DictionaryQueryMode
  level?: DictionaryJlptLevel
}

export interface SearchWordsByScriptInput extends DictionaryWordFilter {
  script: DictionaryScript
  limit: number
  offset: number
}

export interface SearchWordsByScriptResult {
  items: DictionaryWordRow[]
  total: number
}

type SqlParams = Record<string, string | number | null>

export const isDictionaryScript = (script: string): script is DictionaryScript =>
  Object.prototype.hasOwnProperty.call(WORD_TABLE_BY_SCRIPT, script)

export const isDictionaryQueryMode = (mode: string): mode is DictionaryQueryMode =>
  VALID_QUERY_MODES.has(mode as DictionaryQueryMode)

export const isDictionaryJlptLevel = (level: string): level is DictionaryJlptLevel =>
  VALID_JLPT_LEVELS.has(level as DictionaryJlptLevel)

const parseMeanings = (raw: string): string[] => {
  try {
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

const normalizeJlptLevel = (value: string | null): DictionaryJlptLevel | null =>
  value && isDictionaryJlptLevel(value) ? value : null

const normalizeWordRow = (script: DictionaryScript, row: DictionaryWordDbRow): DictionaryWordRow => {
  const meanings = parseMeanings(row.meanings)
  return {
    id: row.id,
    script,
    kanji: row.kanji ?? undefined,
    kana: row.kana ?? '',
    romaji: row.romaji ?? '',
    meaning: meanings.length > 0 ? meanings.join('; ') : undefined,
    meanings,
    jlptLevel: null,
    tags: undefined
  }
}

const normalizeSearchPattern = (query: string, mode: DictionaryQueryMode) => {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return ''
  if (mode === 'exact') return normalizedQuery
  if (mode === 'prefix') return `${normalizedQuery}%`
  return `%${normalizedQuery}%`
}

const buildWordFilterSql = (filter: DictionaryWordFilter): { whereSql: string; params: SqlParams } => {
  const clauses: string[] = []
  const params: SqlParams = {}

  if (filter.level) {
    clauses.push('jlpt_level = @jlptLevel')
    params.jlptLevel = filter.level
  }

  if (filter.query) {
    const mode = filter.mode ?? 'contains'
    const searchPattern = normalizeSearchPattern(filter.query, mode)
    if (searchPattern) {
      clauses.push(`(
        LOWER(COALESCE(kanji, '')) LIKE @searchPattern
        OR LOWER(COALESCE(kana, '')) LIKE @searchPattern
        OR LOWER(COALESCE(romaji, '')) LIKE @searchPattern
        OR LOWER(COALESCE(meanings, '')) LIKE @searchPattern
        OR LOWER(COALESCE(tags, '')) LIKE @searchPattern
      )`)
      params.searchPattern = searchPattern
    }
  }

  return {
    whereSql: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
    params
  }
}

const runWordCountQuery = (script: DictionaryScript, filter: DictionaryWordFilter) => {
  const tableName = WORD_TABLE_BY_SCRIPT[script]
  const { whereSql, params } = buildWordFilterSql(filter)
  const row = getDatabase()
    .prepare(`SELECT COUNT(1) AS total FROM ${tableName} ${whereSql}`)
    .get(params) as { total: number }
  return typeof row?.total === 'number' ? row.total : 0
}

export const countWordsByScript = (script: DictionaryScript, filter: DictionaryWordFilter = {}) =>
  runWordCountQuery(script, filter)

export const searchWordsByScript = ({
  script,
  query,
  mode = 'contains',
  level,
  limit,
  offset
}: SearchWordsByScriptInput): SearchWordsByScriptResult => {
  if (!isDictionaryScript(script)) throw new Error(`Unsupported script: ${script}`)
  if (!isDictionaryQueryMode(mode)) throw new Error(`Unsupported query mode: ${mode}`)

  const tableName = WORD_TABLE_BY_SCRIPT[script]
  const normalizedLimit = Math.max(0, Math.trunc(limit))
  const normalizedOffset = Math.max(0, Math.trunc(offset))
  const filter: DictionaryWordFilter = { query, mode, level }
  const { whereSql, params } = buildWordFilterSql(filter)
  const total = runWordCountQuery(script, filter)

  if (normalizedLimit <= 0 || total <= normalizedOffset) return { items: [], total }

  const rows = getDatabase()
    .prepare(`
      SELECT id, script_type AS scriptType, kanji, kana, romaji, meanings, jlpt_level AS jlptLevel, tags
      FROM ${tableName}
      ${whereSql}
      ORDER BY COALESCE(kanji, kana) COLLATE NOCASE, romaji COLLATE NOCASE
      LIMIT @limit OFFSET @offset
    `)
    .all({ ...params, limit: normalizedLimit, offset: normalizedOffset }) as Array<
      DictionaryWordDbRow & { jlptLevel: string | null; tags: string | null }
    >

  return {
    items: rows.map((row) => ({
      ...normalizeWordRow(script, row),
      jlptLevel: normalizeJlptLevel(row.jlptLevel),
      tags: row.tags ?? undefined
    })),
    total
  }
}

export const findWordById = (wordId: string, script?: DictionaryScript): DictionaryWordRow | null => {
  const scriptsToSearch = script
    ? [script]
    : (Object.keys(WORD_TABLE_BY_SCRIPT) as DictionaryScript[])

  for (const scriptKey of scriptsToSearch) {
    const tableName = WORD_TABLE_BY_SCRIPT[scriptKey]
    const row = getDatabase()
      .prepare(`
        SELECT id, script_type AS scriptType, kanji, kana, romaji, meanings, jlpt_level AS jlptLevel, tags
        FROM ${tableName}
        WHERE id = @wordId
        LIMIT 1
      `)
      .get({ wordId }) as (DictionaryWordDbRow & { jlptLevel: string | null; tags: string | null }) | undefined

    if (!row) continue

    return {
      ...normalizeWordRow(scriptKey, row),
      jlptLevel: normalizeJlptLevel(row.jlptLevel),
      tags: row.tags ?? undefined
    }
  }

  return null
}
