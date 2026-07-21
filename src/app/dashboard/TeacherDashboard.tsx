'use client'

import { FormEvent, useEffect, useState } from 'react'
import { CalendarPlus, Clock, UsersRound } from 'lucide-react'
import InteractiveCalendar, { CalendarEvent } from '@/components/InteractiveCalendar'
import type { AppUser, AvailabilitySlot, LingimoSession } from '@/lib/appTypes'
import { formatDateTime } from '@/lib/appTypes'
import { useI18n } from '@/lib/i18n'

export default function TeacherDashboard({ user }: { user: AppUser }) {
  const [sessions, setSessions] = useState<LingimoSession[]>([])
  const [slots, setSlots] = useState<AvailabilitySlot[]>([])
  const [startTime, setStartTime] = useState('')
  const [durationMinutes, setDurationMinutes] = useState(45)
  const [focus, setFocus] = useState('Conversation')
  const [level, setLevel] = useState('Beginner')
  const [price, setPrice] = useState(18)
  const { t } = useI18n()

  const load = async () => {
    const [sessionRes, slotRes] = await Promise.all([fetch('/api/sessions/upcoming'), fetch('/api/availability')])
    if (sessionRes.ok) setSessions((await sessionRes.json()).sessions)
    if (slotRes.ok) setSlots((await slotRes.json()).slots)
  }

  useEffect(() => {
    load()
  }, [])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const res = await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startTime, durationMinutes, focus, level, price }),
    })
    if (res.ok) {
      setStartTime('')
      load()
    }
  }

  const remove = async (id: string) => {
    await fetch('/api/availability', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    load()
  }

  const events: CalendarEvent[] = [
    ...sessions.map((session) => ({
      id: session.id,
      title: session.focus,
      subtitle: `${t('withTeacher')} ${session.student?.name ?? t('student')}`,
      startTime: session.startTime,
      endTime: session.endTime,
      tone: 'green' as const,
    })),
    ...slots.filter((slot) => !slot.booked).map((slot) => ({
      id: slot.id,
      title: slot.focus,
      subtitle: `${slot.level} · ${t('openSlots')}`,
      startTime: slot.startTime,
      endTime: slot.endTime,
      tone: 'peach' as const,
    })),
  ]

  return (
    <div className="grid gap-4">
      <section className="grid gap-3 md:grid-cols-3">
        <div className="mini-card p-5">
          <UsersRound className="mb-3 text-indigo-500" />
          <p className="text-3xl font-black">{sessions.length}</p>
          <p className="font-bold text-slate-500">{t('bookedSessions')}</p>
        </div>
        <div className="mini-card p-5">
          <Clock className="mb-3 text-emerald-500" />
          <p className="text-3xl font-black">{slots.filter((slot) => !slot.booked).length}</p>
          <p className="font-bold text-slate-500">{t('openSlots')}</p>
        </div>
        <div className="mini-card p-5">
          <CalendarPlus className="mb-3 text-rose-400" />
          <p className="text-3xl font-black">${sessions.length * 18}</p>
          <p className="font-bold text-slate-500">{t('estimatedEarnings')}</p>
        </div>
      </section>

      <InteractiveCalendar events={events} />

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={submit} className="blob-card p-5">
          <h2 className="mb-4 text-2xl font-black">{t('setAvailability')}</h2>
          <div className="grid gap-3">
            <input className="field" type="datetime-local" value={startTime} onChange={(event) => setStartTime(event.target.value)} required />
            <div className="grid grid-cols-2 gap-3">
              <select className="field" value={durationMinutes} onChange={(event) => setDurationMinutes(Number(event.target.value))}>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
              <input className="field" type="number" value={price} onChange={(event) => setPrice(Number(event.target.value))} />
            </div>
            <input className="field" value={focus} onChange={(event) => setFocus(event.target.value)} />
            <select className="field" value={level} onChange={(event) => setLevel(event.target.value)}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            <button className="green-button" type="submit">{t('saveSlot')}</button>
          </div>
        </form>

        <div className="blob-card p-5">
          <h2 className="mb-4 text-2xl font-black">{t('openSlots')}</h2>
          <div className="grid gap-3">
            {slots.filter((slot) => !slot.booked).map((slot) => (
              <article key={slot.id} className="mini-card flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-black">{slot.focus}</p>
                  <p className="font-bold text-slate-500">{slot.level} · {formatDateTime(slot.startTime)}</p>
                </div>
                <button className="peach-button min-h-0 px-4 py-2" onClick={() => remove(slot.id)}>{t('remove')}</button>
              </article>
            ))}
            {!slots.filter((slot) => !slot.booked).length ? <p className="mini-card p-5 font-bold text-slate-500">{t('noOpenSlots')} {user.name}</p> : null}
          </div>
        </div>
      </section>
    </div>
  )
}
