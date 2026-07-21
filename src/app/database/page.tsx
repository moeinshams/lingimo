'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Database, Save, Trash2 } from 'lucide-react'
import AppChrome from '@/components/AppChrome'
import ReactiveLetters from '@/components/ReactiveLetters'
import type { AppUser, Role } from '@/lib/appTypes'
import { useI18n } from '@/lib/i18n'

export default function DatabasePage() {
  const router = useRouter()
  const [current, setCurrent] = useState<AppUser | null>(null)
  const [users, setUsers] = useState<AppUser[]>([])
  const [message, setMessage] = useState('')
  const { t } = useI18n()

  const load = useCallback(async () => {
    const meRes = await fetch('/api/me')
    if (!meRes.ok) {
      router.replace('/login')
      return
    }
    setCurrent((await meRes.json()).user)
    const usersRes = await fetch('/api/users')
    if (usersRes.ok) setUsers((await usersRes.json()).users)
  }, [router])

  useEffect(() => {
    load()
  }, [load])

  const updateUser = (id: string, patch: Partial<AppUser>) => {
    setUsers((items) => items.map((user) => (user.id === id ? { ...user, ...patch } : user)))
  }

  const save = async (user: AppUser) => {
    setMessage('')
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
    setMessage(res.ok ? t('savedDb') : 'Could not save user.')
    load()
  }

  const remove = async (id: string) => {
    setMessage('')
    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setMessage(res.ok ? t('removedDb') : 'Could not remove user.')
    load()
  }

  if (!current) return <main className="app-shell" />

  return (
    <AppChrome user={current} title="databaseTitle">
      <div className="grid gap-4">
        <section className="hero-pod p-6 md:p-8">
          <ReactiveLetters />
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black text-indigo-500">Postgres</p>
              <h2 className="text-4xl font-black">{t('databaseHeroTitle')}</h2>
              <p className="mt-2 max-w-xl font-bold text-slate-500">{t('databaseHeroText')}</p>
            </div>
            <span className="grid size-20 place-items-center rounded-[28px] bg-white text-indigo-700 shadow-xl">
              <Database size={34} />
            </span>
          </div>
        </section>

        {message ? <p className="mini-card p-4 font-black text-indigo-700">{message}</p> : null}

        <section className="grid gap-3">
          {users.map((user) => (
            <article key={user.id} className="blob-card grid gap-3 p-4 xl:grid-cols-[1fr_1fr_160px_180px]">
              <input className="field" value={user.name} onChange={(event) => updateUser(user.id, { name: event.target.value })} />
              <input className="field" value={user.email ?? user.phone ?? ''} onChange={(event) => {
                const value = event.target.value
                updateUser(user.id, value.includes('@') ? { email: value, phone: null } : { phone: value, email: null })
              }} />
              <select className="field" value={user.role} onChange={(event) => updateUser(user.id, { role: event.target.value as Role })}>
                <option value="STUDENT">{t('student')}</option>
                <option value="TEACHER">{t('teacher')}</option>
                <option value="ADMIN">{t('admin')}</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <button className="green-button min-h-0 px-3 py-2" onClick={() => save(user)}>
                  <Save size={16} />
                  {t('save')}
                </button>
                <button className="peach-button min-h-0 px-3 py-2" disabled={user.id === current.id} onClick={() => remove(user.id)}>
                  <Trash2 size={16} />
                  {t('delete')}
                </button>
              </div>
              <p className="xl:col-span-4 rounded-[20px] bg-white/70 p-3 text-sm font-bold text-slate-500">
                {t('slots')}: {user._count?.availabilities ?? 0} · {t('studentSessions')}: {user._count?.sessionsAsStudent ?? 0} · {t('teacherSessions')}: {user._count?.sessionsAsTeacher ?? 0}
              </p>
            </article>
          ))}
        </section>
      </div>
    </AppChrome>
  )
}
