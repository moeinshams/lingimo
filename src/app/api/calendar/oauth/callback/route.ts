import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const url = new URL(req.url)
    const appUrl = process.env.APP_URL ?? process.env.NEXTAUTH_URL ?? url.origin
    const code = url.searchParams.get('code')
    const email = url.searchParams.get('state') // passed as 'state' from the previous step

    if (!code || !email) {
        return NextResponse.json({ error: 'Missing code or email' }, { status: 400 })
    }

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: `${appUrl}/api/calendar/oauth/callback`,
            grant_type: 'authorization_code',
        }),
    })

    const tokenData = await tokenRes.json()

    if (!tokenData.access_token) {
        console.error('[GOOGLE TOKEN ERROR]', tokenData)
        return NextResponse.json({ error: 'Failed to retrieve token' }, { status: 500 })
    }

    // Optional debug
    console.log('[GOOGLE TOKEN]', tokenData)

    await prisma.user.update({
        where: { email },
        data: {
            calendarAccessToken: tokenData.access_token,
            calendarRefreshToken: tokenData.refresh_token ?? '',
            calendarTokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        },
    })

    return NextResponse.redirect(`${appUrl}/dashboard?calendar=connected`)

}
