'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, Mail, Phone, School, UserRound } from 'lucide-react'
import type { Role } from '@/lib/appTypes'
import { useI18n } from '@/lib/i18n'

export default function SignupPage() {
  const router = useRouter()
  const { lang, dir, t, switchLang } = useI18n()
  const [mode, setMode] = useState<'email' | 'sms'>('email')
  const [role, setRole] = useState<Role>('STUDENT')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('123456')
  const [error, setError] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const endpoint = mode === 'email' ? '/api/auth/email' : '/api/auth/sms/verify'
    const body = mode === 'email' ? { mode: 'signup', name, email, password, role } : { name, phone, code, role }
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Signup failed.')
      return
    }
    router.replace('/dashboard')
  }

  return (
    <main className="app-frame grid min-h-screen place-items-center" dir={dir}>
      <form onSubmit={submit} className="auth-card w-full max-w-3xl p-6 md:p-8">
        <div className="text-center">
          <div className="mascot mx-auto mb-5 text-3xl font-black">Yo</div>
          <h1 className="text-4xl font-black">{t('signupTitle')}</h1>
          <p className="mt-2 font-bold text-slate-500">{t('signupText')}</p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <button type="button" className={`mini-card p-5 text-left ${role === 'STUDENT' ? 'ring-4 ring-teal-200/30' : ''}`} onClick={() => setRole('STUDENT')}>
            <GraduationCap className="mb-3 text-emerald-500" size={28} />
            <p className="text-xl font-black">{t('student')}</p>
            <p className="font-bold text-slate-500">{t('studentHelp')}</p>
          </button>
          <button type="button" className={`mini-card p-5 text-left ${role === 'TEACHER' ? 'ring-4 ring-teal-200/30' : ''}`} onClick={() => setRole('TEACHER')}>
            <School className="mb-3 text-indigo-500" size={28} />
            <p className="text-xl font-black">{t('teacher')}</p>
            <p className="font-bold text-slate-500">{t('teacherHelp')}</p>
          </button>
        </div>

        <div className="language-toggle mt-5">
          <button className={lang === 'en' ? 'active' : ''} type="button" onClick={() => switchLang('en')}>{t('english')}</button>
          <button className={lang === 'fa' ? 'active' : ''} type="button" onClick={() => switchLang('fa')}>{t('persian')}</button>
        </div>

        <div className="segmented mt-5">
          <button type="button" className={mode === 'email' ? 'active' : ''} onClick={() => setMode('email')}>{t('email')}</button>
          <button type="button" className={mode === 'sms' ? 'active' : ''} onClick={() => setMode('sms')}>{t('sms')}</button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 flex items-center gap-2 font-black"><UserRound size={17} /> {t('name')}</span>
            <input className="field" value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          {mode === 'email' ? (
            <>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 font-black"><Mail size={17} /> {t('email')}</span>
                <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </label>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 font-black">{t('password')}</span>
                <input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </label>
            </>
          ) : (
            <>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 font-black"><Phone size={17} /> {t('phone')}</span>
                <input className="field" value={phone} onChange={(event) => setPhone(event.target.value)} required />
              </label>
              <label className="block">
                <span className="mb-2 block font-black">{t('dummyCode')}</span>
                <input className="field" value={code} onChange={(event) => setCode(event.target.value)} required />
              </label>
            </>
          )}
        </div>

        {error ? <p className="mt-4 rounded-[20px] bg-rose-100 p-3 font-black text-rose-700">{error}</p> : null}
        <button className="green-button mt-6 w-full" type="submit">{t('start')}</button>
        <p className="mt-5 text-center font-bold text-slate-500">{t('haveAccount')} <Link className="text-indigo-700 underline" href="/login">{t('login')}</Link></p>
      </form>
    </main>
  )
}
