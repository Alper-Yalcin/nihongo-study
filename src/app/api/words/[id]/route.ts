import { NextRequest, NextResponse } from 'next/server'
import { DictionaryQueryError, getDictionaryWordById } from '@/lib/services/dictionaryService'

export const runtime = 'nodejs'

const asOptionalString = (value: string | null) => {
  if (!value) return undefined
  const normalized = value.trim()
  return normalized || undefined
}

export function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return params.then(({ id }) => {
    try {
      const script = asOptionalString(request.nextUrl.searchParams.get('script'))
      const word = getDictionaryWordById(id, script)
      if (!word) {
        return NextResponse.json({ error: 'Word not found.' }, { status: 404 })
      }
      return NextResponse.json(word)
    } catch (error) {
      if (error instanceof DictionaryQueryError) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to load word detail.' },
        { status: 500 }
      )
    }
  })
}
