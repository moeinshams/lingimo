import { cookies } from 'next/headers'
import { createHash, randomBytes, timingSafeEqual } from 'crypto'
import { prisma } from '@/lib/prisma'

export const sessionCookieName = 'lingimo_user_id'

export function hashPassword(password: string, salt = randomBytes(16).toString('hex')) {
  const hash = createHash('sha256').update(`${salt}:${password}`).digest('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored?: string | null) {
  if (!stored) return false
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const candidate = hashPassword(password, salt).split(':')[1]
  return timingSafeEqual(Buffer.from(candidate), Buffer.from(hash))
}

export async function setUserSession(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set(sessionCookieName, userId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export async function clearUserSession() {
  const cookieStore = await cookies()
  cookieStore.delete(sessionCookieName)
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const userId = cookieStore.get(sessionCookieName)?.value
  if (!userId) return null

  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      phone: true,
      name: true,
      surname: true,
      age: true,
      gender: true,
      dateOfBirth: true,
      image: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export function publicUser<T extends { passwordHash?: string | null }>(user: T) {
  const safeUser = { ...user }
  delete safeUser.passwordHash
  return safeUser
}
