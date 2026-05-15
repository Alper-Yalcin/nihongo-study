import { NextRequest, NextResponse } from 'next/server'
import { getMeaningTranslations } from '@/lib/services/translationService'

export const runtime = 'nodejs'

export function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ language: string }> }
) {
  return params.then(({ language }) => {
    try {
      const result = getMeaningTranslations(language.toLowerCase())
      return NextResponse.json(result)
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to load translations.' },
        { status: 500 }
      )
    }
  })
}
