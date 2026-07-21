// src/lib/prisma.ts

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ['query'], // You can change to 'error' or remove for production
    })

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}
