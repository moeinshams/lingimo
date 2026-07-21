import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const url = new URL(req.url)
    const email = url.searchParams.get('email')

    if (!email) {
        return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    const appUrl = process.env.APP_URL ?? process.env.NEXTAUTH_URL ?? new URL(req.url).origin
    const redirectUri = `${appUrl}/api/calendar/oauth/callback`

    const oauthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    oauthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!)
    oauthUrl.searchParams.set('redirect_uri', redirectUri)
    oauthUrl.searchParams.set('response_type', 'code')
    oauthUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/calendar.events')
    oauthUrl.searchParams.set('access_type', 'offline')
    oauthUrl.searchParams.set('prompt', 'consent')
    oauthUrl.searchParams.set('state', email)

    return NextResponse.redirect(oauthUrl.toString())
}
