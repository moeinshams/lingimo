import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user }: { user: { email?: string | null; name?: string | null; image?: string | null } }) {
      if (!user.email) return false

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      })

      if (!existingUser) {
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name ?? '',
            image: user.image ?? '',
            role: 'STUDENT',
          },
        })
      }

      return true
    },

    async session({
      session,
      token,
    }: {
      session: { user?: { id?: string; email?: string | null; name?: string | null; image?: string | null; role?: string | null } }
      token: { sub?: string }
    }) {
      if (session?.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        })

        session.user.id = token.sub ?? ''
        session.user.name = dbUser?.name ?? ''
        session.user.image = dbUser?.image ?? ''
        session.user.role = dbUser?.role ?? null
      }

      return session
    },
  },
}
