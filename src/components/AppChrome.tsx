'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CalendarDays, Database, Home, LayoutDashboard, LogOut, Sparkles } from 'lucide-react'
import type { AppUser } from '@/lib/appTypes'
import { useI18n, type CopyKey } from '@/lib/i18n'

const navItems = [
  { href: '/home', label: 'home', icon: Home },
  { href: '/dashboard', label: 'dashboard', icon: LayoutDashboard },
  { href: '/booking', label: 'book', icon: CalendarDays },
  { href: '/database', label: 'database', icon: Database },
]

export default function AppChrome({
  user,
  children,
  title,
}: {
  user: AppUser
  children: React.ReactNode
  title: CopyKey
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { lang, dir, t, switchLang } = useI18n()

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/login')
  }

  return (
    <div className="app-shell" dir={dir}>
      <div className="app-frame grid min-h-screen gap-4 md:grid-cols-[230px_1fr]">
        <aside className="side-blob hidden h-[calc(100vh-40px)] sticky top-5 p-4 md:flex md:flex-col">
          <Link href="/home" className="mb-6 flex items-center gap-3">
            <span className="logo-squish">
              <Sparkles size={21} />
            </span>
            <span>
              <span className="block text-2xl font-black leading-6">Lingimo</span>
              <span className="text-xs font-bold text-slate-500">{t('appName')}</span>
            </span>
          </Link>

          <div className="language-toggle mb-5">
            <button className={lang === 'en' ? 'active' : ''} onClick={() => switchLang('en')}>{t('english')}</button>
            <button className={lang === 'fa' ? 'active' : ''} onClick={() => switchLang('fa')}>{t('persian')}</button>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <Link key={item.href} href={item.href} className={`nav-candy ${active ? 'active' : ''}`}>
                  <Icon size={18} />
                  {t(item.label as CopyKey)}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto rounded-[24px] bg-white/70 p-4 text-slate-950 shadow-inner">
            <p className="truncate text-lg font-black">{user.name}</p>
            <p className="text-sm font-bold text-slate-500">{user.role === 'TEACHER' ? t('roleTeacher') : user.role === 'ADMIN' ? t('roleAdmin') : t('roleStudent')}</p>
            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-black text-indigo-700" onClick={signOut}>
              <LogOut className="icon-flip" size={16} />
              {t('logout')}
            </button>
          </div>
        </aside>

        <main className="min-w-0 pb-24 md:pb-4">
          <header className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-indigo-500">{t('appName')}</p>
              <h1 className="text-3xl font-black tracking-normal text-slate-950 md:text-4xl">{t(title)}</h1>
            </div>
            <button className="bubble-button hidden md:inline-flex" onClick={signOut}>
              <LogOut className="icon-flip" size={17} />
              {t('logout')}
            </button>
          </header>
          {children}
        </main>
      </div>

      <nav className="mobile-tabbar grid grid-cols-4 px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className={`mobile-candy ${active ? 'active' : ''}`}>
              <Icon size={19} />
              {t(item.label as CopyKey)}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
