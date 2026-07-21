import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, publicUser } from '@/lib/dbSession'

export async function GET() {
  const current = await getCurrentUser()
  if (!current) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          availabilities: true,
          sessionsAsStudent: true,
          sessionsAsTeacher: true,
        },
      },
    },
  })

  return NextResponse.json({ users: users.map(publicUser) })
}

export async function PATCH(req: Request) {
  const current = await getCurrentUser()
  if (!current) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, name, email, phone, role } = await req.json()
  if (!id) return NextResponse.json({ error: 'User id is required.' }, { status: 400 })

  const user = await prisma.user.update({
    where: { id },
    data: {
      name,
      email: email || null,
      phone: phone || null,
      role: role === 'TEACHER' ? 'TEACHER' : 'STUDENT',
    },
  })

  return NextResponse.json({ user: publicUser(user) })
}

export async function DELETE(req: Request) {
  const current = await getCurrentUser()
  if (!current) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  if (!id || id === current.id) {
    return NextResponse.json({ error: 'Choose another user to delete.' }, { status: 400 })
  }

  await prisma.session.deleteMany({
    where: { OR: [{ studentId: id }, { teacherId: id }] },
  })
  await prisma.availability.deleteMany({ where: { teacherId: id } })
  await prisma.user.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
