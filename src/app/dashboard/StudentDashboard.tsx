'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BookOpenCheck, CalendarHeart, Sparkles } from 'lucide-react'
import InteractiveCalendar, { CalendarEvent } from '@/components/InteractiveCalendar'
import type { AppUser, LingimoSession } from '@/lib/appTypes'
import { formatDateTime } from '@/lib/appTypes'
import { useI18n } from '@/lib/i18n'

export default function StudentDashboard({ user }: { user: AppUser }) {
  const [sessions, setSessions] = useState<LingimoSession[]>([])
  const { t } = useI18n()

  useEffect(() => {
    fetch('/api/sessions/upcoming').then(async (res) => {
      if (res.ok) setSessions((await res.json()).sessions)
    })
  }, [])

  const events: CalendarEvent[] = sessions.map((session) => ({
    id: session.id,
    title: session.focus,
    subtitle: `${t('withTeacher')} ${session.teacher?.name ?? t('teacher')}`,
    startTime: session.startTime,
    endTime: session.endTime,
    tone: 'blue',
  }))

  return (
    <div className="grid gap-4">
      <section className="grid gap-3 md:grid-cols-3">
        <div className="mini-card p-5">
          <CalendarHeart className="mb-3 text-indigo-500" />
          <p className="text-3xl font-black">{sessions.length}</p>
          <p className="font-bold text-slate-500">{t('upcomingSessions')}</p>
        </div>
        <div className="mini-card p-5">
          <Sparkles className="mb-3 text-emerald-500" />
          <p className="text-3xl font-black">7</p>
          <p className="font-bold text-slate-500">{t('dayStreak')}</p>
        </div>
        <Link href="/booking" className="green-button min-h-[132px] text-lg">
          <BookOpenCheck />
          {t('bookTeacher')}
        </Link>
      </section>

      <InteractiveCalendar events={events} />

      <section className="blob-card p-5">
        <h2 className="mb-4 text-2xl font-black">{t('nextLessons')}</h2>
        {sessions.length ? (
          <div className="grid gap-3">
            {sessions.map((session) => (
              <article key={session.id} className="mini-card p-4">
                <p className="text-lg font-black">{session.focus}</p>
                <p className="font-bold text-slate-500">{t('withTeacher')} {session.teacher?.name ?? t('teacher')} · {formatDateTime(session.startTime)}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mini-card p-5 font-bold text-slate-500">{t('noSessions')} {user.name}</p>
        )}
      </section>
    </div>
  )
}
