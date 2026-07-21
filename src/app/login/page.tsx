'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { KeyRound, Mail, MessageCircle, Phone } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export default function LoginPage() {
  const router = useRouter()
  const { lang, dir, t, switchLang } = useI18n()
  const [mode, setMode] = useState<'email' | 'sms'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('123456')
  const [error, setError] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const endpoint = mode === 'email' ? '/api/auth/email' : '/api/auth/sms/verify'
    const body = mode === 'email' ? { mode: 'login', email, password } : { phone, code }
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Login failed.')
      return
    }
    router.replace('/dashboard')
  }

  return (
    <main className="app-frame grid min-h-screen place-items-center" dir={dir}>
      <section className="auth-card grid w-full max-w-5xl md:grid-cols-[0.95fr_1.05fr]">
        <div className="hero-pod min-h-[520px] rounded-none p-8">
          <div className="orb left-[12%] top-[18%] size-20 bg-emerald-400/75">EN</div>
          <div className="orb right-[14%] top-[26%] size-24 bg-rose-300/75">FA</div>
          <div className="orb bottom-[18%] left-[20%] size-24 bg-indigo-300/75">ES</div>
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
            <div className="mascot mb-7 text-4xl font-black">Go</div>
            <h1 className="text-4xl font-black leading-tight">{t('loginTitle')}</h1>
            <p className="mt-3 text-lg font-bold text-slate-500">{t('loginText')}</p>
          </div>
        </div>
        <form onSubmit={submit} className="p-6 md:p-9">
          <div className="language-toggle mb-5">
            <button className={lang === 'en' ? 'active' : ''} type="button" onClick={() => switchLang('en')}>{t('english')}</button>
            <button className={lang === 'fa' ? 'active' : ''} type="button" onClick={() => switchLang('fa')}>{t('persian')}</button>
          </div>
          <div className="segmented mb-5">
            <button type="button" className={mode === 'email' ? 'active' : ''} onClick={() => setMode('email')}>{t('email')}</button>
            <button type="button" className={mode === 'sms' ? 'active' : ''} onClick={() => setMode('sms')}>{t('sms')}</button>
          </div>

          {mode === 'email' ? (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 font-black"><Mail size={17} /> {t('email')}</span>
                <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </label>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 font-black"><KeyRound size={17} /> {t('password')}</span>
                <input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 font-black"><Phone size={17} /> {t('phone')}</span>
                <input className="field" value={phone} onChange={(event) => setPhone(event.target.value)} required />
              </label>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 font-black"><MessageCircle size={17} /> {t('dummyCode')}</span>
                <input className="field" value={code} onChange={(event) => setCode(event.target.value)} required />
              </label>
            </div>
          )}

          {error ? <p className="mt-4 rounded-[20px] bg-rose-100 p-3 font-black text-rose-700">{error}</p> : null}
          <button className="green-button mt-6 w-full" type="submit">{t('login')}</button>
          <p className="mt-5 text-center font-bold text-slate-500">{t('noAccount')} <Link className="text-indigo-700 underline" href="/signup">{t('signup')}</Link></p>
        </form>
      </section>
    </main>
  )
}
