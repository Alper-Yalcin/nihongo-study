import { NextRequest, NextResponse } from 'next/server'
import { DictionaryQueryError, getDictionaryWords } from '@/lib/services/dictionaryService'

export const runtime = 'nodejs'

const asOptionalString = (value: string | null) => {
  if (!value) return undefined
  const normalized = value.trim()
  return normalized || undefined
}

const asOptionalInteger = (value: string | null, paramName: string) => {
  if (value === null || value === '') return undefined
  const parsed = Number.parseInt(value, 10)
  if (!Number.isFinite(parsed)) throw new DictionaryQueryError(`Invalid "${paramName}" query parameter.`)
  return parsed
}

export function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const result = getDictionaryWords({
      script: asOptionalString(searchParams.get('script')),
      query: asOptionalString(searchParams.get('query')),
      mode: asOptionalString(searchParams.get('mode')),
      level: asOptionalString(searchParams.get('level')),
      packId: asOptionalString(searchParams.get('packId')),
      limit: asOptionalInteger(searchParams.get('limit'), 'limit'),
      offset: asOptionalInteger(searchParams.get('offset'), 'offset'),
    })
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof DictionaryQueryError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load words.' },
      { status: 500 }
    )
  }
}
