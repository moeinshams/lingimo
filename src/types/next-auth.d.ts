declare module 'next-auth' {
    interface Session {
        user: {
            id: string
            name?: string | null
            email?: string | null
            image?: string | null
            role?: 'STUDENT' | 'TEACHER' | null
            surname?: string | null
            age?: number | null
            gender?: string | null
            dateOfBirth?: Date | null
        }
    }

    interface User {
        id: string
        name?: string | null
        email?: string | null
        image?: string | null
        role?: 'STUDENT' | 'TEACHER' | null
        surname?: string | null
        age?: number | null
        gender?: string | null
        dateOfBirth?: Date | null
    }
}
