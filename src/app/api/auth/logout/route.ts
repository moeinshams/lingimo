import { NextResponse } from 'next/server'
import { clearUserSession } from '@/lib/dbSession'

export async function POST() {
  await clearUserSession()
  return NextResponse.json({ ok: true })
}
