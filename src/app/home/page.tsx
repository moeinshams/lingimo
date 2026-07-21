'use client'

import Link from 'next/link'
import { BookOpenCheck, CalendarHeart, Database, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import AppChrome from '@/components/AppChrome'
import type { AppUser } from '@/lib/appTypes'
import { useI18n } from '@/lib/i18n'

export default function HomePage() {
  const [user, setUser] = useState<AppUser | null>(null)
  const { lang, dir, t, switchLang } = useI18n()

  useEffect(() => {
    fetch('/api/me').then(async (res) => {
      if (res.ok) setUser((await res.json()).user)
    })
  }, [])

  const content = (
    <div className="grid gap-4" dir={dir}>
      {!user ? (
        <div className="mb-1 flex items-center justify-between">
          <div>
            <p className="text-2xl font-black">Lingimo</p>
            <p className="font-bold text-slate-500">{t('appName')}</p>
          </div>
          <div className="language-toggle w-36">
            <button className={lang === 'en' ? 'active' : ''} onClick={() => switchLang('en')}>{t('english')}</button>
            <button className={lang === 'fa' ? 'active' : ''} onClick={() => switchLang('fa')}>{t('persian')}</button>
          </div>
        </div>
      ) : null}
      <section className="hero-pod min-h-[520px] p-6 md:p-10">
        <div className="orb left-[8%] top-[20%] size-20 bg-emerald-400/75">Olá</div>
        <div className="orb right-[14%] top-[18%] size-24 bg-rose-300/75">TR</div>
        <div className="orb left-[18%] bottom-[18%] size-28 bg-indigo-300/75">JP</div>
        <div className="orb right-[18%] bottom-[22%] size-20 bg-sky-300/75">FR</div>

        <div className="relative z-10 mx-auto flex h-full max-w-lg flex-col items-center justify-center text-center">
          <div className="mascot mb-7 text-4xl font-black">Hi</div>
          <h1 className="text-4xl font-black leading-tight md:text-6xl">{t('homeHeroTitle')}</h1>
          <p className="mt-4 text-lg font-bold text-slate-500">{t('homeHeroText')}</p>
        </div>
      </section>

      <section className="grid gap-3 -mt-1">
        <div className="grid gap-3 md:grid-cols-3">
          <Link href="/signup" className="green-button min-h-24 text-lg">
            <Sparkles size={22} />
            {t('startLearning')}
          </Link>
          <Link href="/dashboard" className="bubble-button min-h-24 text-lg">
            <CalendarHeart size={22} />
            {t('homeDashboard')}
          </Link>
          <Link href="/database" className="peach-button min-h-24 text-lg">
            <Database size={22} />
            {t('homeDatabase')}
          </Link>
        </div>
      </section>

      <footer className="grid gap-3 pb-4 md:grid-cols-3">
        <Link href="/booking" className="mini-card flex items-center gap-3 p-4 font-black">
          <BookOpenCheck className="text-blue-600" />
          {t('bookClass')}
        </Link>
        <Link href="/login" className="mini-card flex items-center gap-3 p-4 font-black">
          <Sparkles className="text-emerald-500" />
          {t('login')}
        </Link>
        <Link href="/signup" className="mini-card flex items-center gap-3 p-4 font-black">
          <CalendarHeart className="text-rose-400" />
          {t('createAccount')}
        </Link>
      </footer>
    </div>
  )

  if (!user) {
    return <main className="app-frame">{content}</main>
  }

  return (
    <AppChrome user={user} title="homeTitle">
      {content}
    </AppChrome>
  )
}
