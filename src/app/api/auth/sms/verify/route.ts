import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { publicUser, setUserSession } from '@/lib/dbSession'

export async function POST(req: Request) {
  const { phone, code, name, role } = await req.json()
  const normalizedPhone = String(phone ?? '').replace(/\s/g, '')

  if (!normalizedPhone || code !== '123456') {
    return NextResponse.json({ error: 'Invalid dummy code.' }, { status: 401 })
  }

  const existing = await prisma.user.findFirst({ where: { phone: normalizedPhone } })
  const user = existing
    ? await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: String(name ?? '').trim() || undefined,
        role: role === 'TEACHER' ? 'TEACHER' : 'STUDENT',
      },
    })
    : await prisma.user.create({
      data: {
      phone: normalizedPhone,
      name: String(name ?? '').trim() || `Learner ${normalizedPhone.slice(-4)}`,
      role: role === 'TEACHER' ? 'TEACHER' : 'STUDENT',
      },
    })

  await setUserSession(user.id)
  return NextResponse.json({ user: publicUser(user) })
}
