import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, name, role, image } = body

        if (!email || !name || !role) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: { name, role, image },
        })

        return NextResponse.json({ success: true, user: updatedUser })
    } catch (err) {
        console.error('[SIGNUP ERROR]', err)
        return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
    }
}