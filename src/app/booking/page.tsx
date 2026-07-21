'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BadgeDollarSign, CalendarClock, CheckCircle2, Search } from 'lucide-react'
import AppChrome from '@/components/AppChrome'
import type { AppUser, AvailabilitySlot } from '@/lib/appTypes'
import { formatDateTime, formatTime } from '@/lib/appTypes'
import { useI18n } from '@/lib/i18n'

export default function BookingPage() {
  const router = useRouter()
  const [user, setUser] = useState<AppUser | null>(null)
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('All')
  const [message, setMessage] = useState('')
  const { t } = useI18n()

  const loadSlots = async () => {
    const res = await fetch('/api/teachers/available')
    if (res.ok) setSlots((await res.json()).slots)
  }

  useEffect(() => {
    fetch('/api/me').then(async (res) => {
      if (!res.ok) {
        router.replace('/login')
        return
      }
      setUser((await res.json()).user)
    })
    loadSlots()
  }, [router])

  const book = async (slotId: string) => {
    setMessage('')
    const res = await fetch('/api/sessions/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slotId }),
    })
    const data = await res.json()
    if (!res.ok) {
      setMessage(data.error ?? 'Could not book.')
      return
    }
    setMessage(t('bookedMessage'))
    loadSlots()
  }

  if (!user) return <main className="app-shell" />

  const filtered = slots.filter((slot) => {
    const text = `${slot.teacher?.name ?? ''} ${slot.focus} ${slot.level}`.toLowerCase()
    return (level === 'All' || slot.level === level) && text.includes(query.toLowerCase())
  })

  return (
    <AppChrome user={user} title="bookSession">
      <div className="grid gap-4">
        <section className="blob-card grid gap-3 p-4 md:grid-cols-[1fr_190px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={19} />
            <input className="field pl-12" placeholder={t('searchTeacher')} value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
          <select className="field" value={level} onChange={(event) => setLevel(event.target.value)}>
            <option value="All">{t('all')}</option>
            <option value="Beginner">{t('beginner')}</option>
            <option value="Intermediate">{t('intermediate')}</option>
            <option value="Advanced">{t('advanced')}</option>
          </select>
        </section>

        {message ? <p className="mini-card p-4 font-black text-indigo-700">{message}</p> : null}

        <section className="grid gap-3">
          {filtered.map((slot) => (
            <article key={slot.id} className="blob-card grid gap-4 p-5 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">{slot.level === 'Beginner' ? t('beginner') : slot.level === 'Intermediate' ? t('intermediate') : slot.level === 'Advanced' ? t('advanced') : slot.level}</span>
                  <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-black text-indigo-700">{slot.focus}</span>
                </div>
                <h2 className="text-2xl font-black">{slot.teacher?.name ?? t('teacher')}</h2>
                <div className="mt-3 grid gap-2 font-bold text-slate-600 sm:grid-cols-3">
                  <span className="flex items-center gap-2"><CalendarClock size={17} /> {formatDateTime(slot.startTime)}</span>
                  <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                  <span className="flex items-center gap-2 text-slate-900"><BadgeDollarSign size={17} /> ${slot.price}</span>
                </div>
              </div>
              <button className="green-button self-center" disabled={user.role !== 'STUDENT'} onClick={() => book(slot.id)}>
                <CheckCircle2 size={18} />
                {t('book')}
              </button>
            </article>
          ))}
          {!filtered.length ? <p className="blob-card p-8 text-center font-black text-slate-500">{t('noMatchingSlots')}</p> : null}
        </section>
      </div>
    </AppChrome>
  )
}
