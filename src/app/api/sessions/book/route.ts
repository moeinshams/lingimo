import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/dbSession'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'STUDENT') return NextResponse.json({ error: 'Only students can book sessions.' }, { status: 403 })

  const { slotId } = await req.json()
  const slot = await prisma.availability.findFirst({
    where: { id: slotId, booked: false },
    include: { teacher: true },
  })

  if (!slot) return NextResponse.json({ error: 'This slot is not available.' }, { status: 404 })

  const session = await prisma.$transaction(async (tx) => {
    await tx.availability.update({
      where: { id: slot.id },
      data: { booked: true },
    })

    return tx.session.create({
      data: {
        studentId: user.id,
        teacherId: slot.teacherId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        focus: slot.focus,
      },
      include: {
        teacher: { select: { id: true, name: true, email: true, phone: true } },
        student: { select: { id: true, name: true, email: true, phone: true } },
      },
    })
  })

  return NextResponse.json({ session }, { status: 201 })
}
