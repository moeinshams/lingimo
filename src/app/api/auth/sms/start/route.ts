import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { phone } = await req.json()

  if (!String(phone ?? '').trim()) {
    return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 })
  }

  return NextResponse.json({
    ok: true,
    code: '123456',
    message: 'Dummy SMS code is 123456.',
  })
}
