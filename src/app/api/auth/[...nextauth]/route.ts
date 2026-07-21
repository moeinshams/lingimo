import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ ok: true, mode: 'local-demo' })
}

export async function POST() {
  return NextResponse.json({ ok: true, mode: 'local-demo' })
}
