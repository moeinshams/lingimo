import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const slots = await prisma.availability.findMany({
    where: { booked: false, startTime: { gte: new Date() } },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: { startTime: 'asc' },
  })

  return NextResponse.json({ slots })
}
