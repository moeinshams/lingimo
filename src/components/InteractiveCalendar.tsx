'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, Clock3 } from 'lucide-react'
import { formatDateTime, formatTime } from '@/lib/appTypes'
import { useI18n } from '@/lib/i18n'

export type CalendarEvent = {
  id: string
  title: string
  subtitle: string
  startTime: string
  endTime: string
  tone?: 'blue' | 'green' | 'peach'
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

export default function InteractiveCalendar({ events }: { events: CalendarEvent[] }) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const { lang, t } = useI18n()

  const days = useMemo(() => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    return Array.from({ length: 21 }, (_, index) => {
      const day = new Date(start)
      day.setDate(start.getDate() + index)
      return day
    })
  }, [])

  const dayEvents = events.filter((event) => sameDay(new Date(event.startTime), selectedDate))

  return (
    <section className="blob-card p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">{t('calendar')}</h2>
          <p className="text-sm font-bold text-slate-500">{t('calendarHint')}</p>
        </div>
        <span className="grid size-12 place-items-center rounded-full bg-indigo-100 text-indigo-700">
          <CalendarDays size={22} />
        </span>
      </div>

      <div className="calendar-grid">
        {days.map((day) => {
          const items = events.filter((event) => sameDay(new Date(event.startTime), day))
          const active = sameDay(day, selectedDate)
          return (
            <button
              key={day.toISOString()}
              className={`calendar-cell ${active ? 'active' : ''}`}
              onClick={() => {
                setSelectedDate(day)
                setSelectedEvent(items[0] ?? null)
              }}
            >
              <span className="block text-xs font-black uppercase text-slate-400">
                {new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : undefined, { weekday: 'short' }).format(day)}
              </span>
              <span className="text-xl font-black">{day.getDate()}</span>
              <span className="mt-2 flex gap-1">
                {items.slice(0, 3).map((item) => (
                  <span
                    key={item.id}
                    className={`size-2 rounded-full ${
                      item.tone === 'green' ? 'bg-emerald-400' : item.tone === 'peach' ? 'bg-rose-300' : 'bg-blue-500'
                    }`}
                  />
                ))}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr]">
        <div className="mini-card p-4">
          <p className="mb-3 text-sm font-black text-indigo-500">{new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : undefined, { weekday: 'long', month: 'short', day: 'numeric' }).format(selectedDate)}</p>
          {dayEvents.length ? (
            <div className="space-y-2">
              {dayEvents.map((event) => (
                <button
                  key={event.id}
                  className="w-full rounded-[20px] bg-white p-3 text-left shadow-sm"
                  onClick={() => setSelectedEvent(event)}
                >
                  <p className="font-black">{event.title}</p>
                  <p className="text-sm font-bold text-slate-500">{formatTime(event.startTime)} · {event.subtitle}</p>
                </button>
              ))}
            </div>
          ) : (
            <p className="rounded-[20px] bg-white p-4 text-sm font-bold text-slate-500">{t('nothingBooked')}</p>
          )}
        </div>

        <div className="mini-card p-4">
          <p className="mb-3 text-sm font-black text-indigo-500">{t('details')}</p>
          {selectedEvent ? (
            <div className="rounded-[22px] bg-white p-4">
              <p className="text-xl font-black">{selectedEvent.title}</p>
              <p className="mt-1 font-bold text-slate-500">{selectedEvent.subtitle}</p>
              <p className="mt-4 flex items-center gap-2 text-sm font-black text-slate-700">
                <Clock3 size={16} />
                {formatDateTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}
              </p>
            </div>
          ) : (
            <p className="rounded-[20px] bg-white p-4 text-sm font-bold text-slate-500">{t('tapForDetails')}</p>
          )}
        </div>
      </div>
    </section>
  )
}
