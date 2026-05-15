import { NextRequest, NextResponse } from 'next/server'
import { DictionaryQueryError, listDictionaryWordPacks } from '@/lib/services/dictionaryService'

export const runtime = 'nodejs'

const asOptionalString = (value: string | null) => {
  if (!value) return undefined
  const normalized = value.trim()
  return normalized || undefined
}

export function GET(request: NextRequest) {
  try {
    const script = asOptionalString(request.nextUrl.searchParams.get('script'))
    const items = listDictionaryWordPacks(script)
    return NextResponse.json({ items })
  } catch (error) {
    if (error instanceof DictionaryQueryError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to load word packs.' },
      { status: 500 }
    )
  }
}
