import { NextResponse } from 'next/server'
import { DATABASE_PATH } from '@/lib/db'

export const runtime = 'nodejs'

export function GET() {
  return NextResponse.json({ ok: true, databasePath: DATABASE_PATH })
}
