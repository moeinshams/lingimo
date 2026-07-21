import { NextResponse } from 'next/server'
import { hashPassword, publicUser, setUserSession, verifyPassword } from '@/lib/dbSession'
import { prisma } from '@/lib/prisma'
import type { Role } from '@prisma/client'

export async function POST(req: Request) {
  const { mode, email, password, name, role } = await req.json()
  const normalizedEmail = String(email ?? '').trim().toLowerCase()
  const safePassword = String(password ?? '')

  if (!normalizedEmail || safePassword.length < 4) {
    return NextResponse.json({ error: 'Email and a 4+ character password are required.' }, { status: 400 })
  }

  if (mode === 'signup') {
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      return NextResponse.json({ error: 'This email already exists. Please log in.' }, { status: 409 })
    }

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: String(name ?? '').trim() || normalizedEmail.split('@')[0],
        passwordHash: hashPassword(safePassword),
        role: role === 'TEACHER' ? 'TEACHER' : ('STUDENT' as Role),
      },
    })
    await setUserSession(user.id)
    return NextResponse.json({ user: publicUser(user) })
  }

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } })
  if (!user || !verifyPassword(safePassword, user.passwordHash)) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  await setUserSession(user.id)
  return NextResponse.json({ user: publicUser(user) })
}
