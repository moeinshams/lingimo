import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/dbSession'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const slots = await prisma.availability.findMany({
    where: user.role === 'TEACHER' ? { teacherId: user.id } : { booked: false },
    include: { teacher: { select: { id: true, name: true, email: true, phone: true } } },
    orderBy: { startTime: 'asc' },
  })

  return NextResponse.json({ slots })
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'TEACHER') return NextResponse.json({ error: 'Only teachers can add slots.' }, { status: 403 })

  const { startTime, durationMinutes, focus, level, price } = await req.json()
  const start = new Date(startTime)
  const end = new Date(start)
  end.setMinutes(end.getMinutes() + Number(durationMinutes || 45))

  if (Number.isNaN(start.getTime()) || end <= start) {
    return NextResponse.json({ error: 'Choose a valid date and duration.' }, { status: 400 })
  }

  const slot = await prisma.availability.create({
    data: {
      teacherId: user.id,
      startTime: start,
      endTime: end,
      focus: String(focus ?? 'Conversation'),
      level: String(level ?? 'Beginner'),
      price: Number(price ?? 18),
    },
  })

  return NextResponse.json({ slot }, { status: 201 })
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'TEACHER') return NextResponse.json({ error: 'Only teachers can remove slots.' }, { status: 403 })

  const { id } = await req.json()
  await prisma.availability.deleteMany({ where: { id, teacherId: user.id, booked: false } })
  return NextResponse.json({ ok: true })
}
