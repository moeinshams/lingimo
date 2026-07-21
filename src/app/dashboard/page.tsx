'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppChrome from '@/components/AppChrome'
import type { AppUser } from '@/lib/appTypes'
import StudentDashboard from './StudentDashboard'
import TeacherDashboard from './TeacherDashboard'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<AppUser | null>(null)

  useEffect(() => {
    fetch('/api/me').then(async (res) => {
      if (!res.ok) {
        router.replace('/login')
        return
      }
      setUser((await res.json()).user)
    })
  }, [router])

  if (!user) return <main className="app-shell" />

  return (
    <AppChrome user={user} title={user.role === 'TEACHER' ? 'teacherDashboard' : 'studentDashboard'}>
      {user.role === 'TEACHER' ? <TeacherDashboard user={user} /> : <StudentDashboard user={user} />}
    </AppChrome>
  )
}
