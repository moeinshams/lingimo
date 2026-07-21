import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/dbSession'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, role } = await req.json()
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: String(name ?? user.name),
      role: role === 'TEACHER' ? 'TEACHER' : 'STUDENT',
    },
  })

  return NextResponse.json({ user: updated })
}
