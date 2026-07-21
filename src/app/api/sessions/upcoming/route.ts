import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/dbSession'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sessions = await prisma.session.findMany({
    where:
      user.role === 'TEACHER'
        ? { teacherId: user.id, status: 'UPCOMING' }
        : { studentId: user.id, status: 'UPCOMING' },
    orderBy: { startTime: 'asc' },
    include: {
      teacher: { select: { id: true, name: true, email: true, phone: true } },
      student: { select: { id: true, name: true, email: true, phone: true } },
    },
  })

  return NextResponse.json({ sessions })
}
