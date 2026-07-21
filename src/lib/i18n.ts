'use client'

import { useEffect, useMemo, useState } from 'react'

export type Lang = 'en' | 'fa'

const langKey = 'lingimo.lang'

const copy = {
  en: {
    appName: 'Lingimo app',
    home: 'Home',
    dashboard: 'Dashboard',
    book: 'Book',
    database: 'Database',
    logout: 'Log out',
    login: 'Log in',
    signup: 'Sign up',
    start: 'Start',
    startLearning: 'Start learning',
    createAccount: 'Create account',
    bookClass: 'Book a class',
    student: 'Student',
    teacher: 'Teacher',
    admin: 'Admin',
    roleStudent: 'Student',
    roleTeacher: 'Teacher',
    roleAdmin: 'Admin',
    homeTitle: 'Home',
    homeHeroTitle: 'Learn languages in tiny happy sessions',
    homeHeroText: 'Book teachers, follow your calendar, and keep the whole app calm, simple, and friendly.',
    homeDashboard: 'Dashboard',
    homeDatabase: 'Database',
    loginTitle: 'Welcome back to Lingimo',
    loginText: 'Your tiny language world is waiting.',
    email: 'Email',
    sms: 'SMS',
    password: 'Password',
    phone: 'Phone',
    dummyCode: 'Dummy code',
    noAccount: 'No account?',
    haveAccount: 'Already have an account?',
    signupTitle: 'Create your Lingimo account',
    signupText: 'Choose whether this account is for learning or teaching.',
    name: 'Name',
    studentHelp: 'Book teachers and follow sessions.',
    teacherHelp: 'Set availability and manage bookings.',
    studentDashboard: 'Student dashboard',
    teacherDashboard: 'Teacher dashboard',
    upcomingSessions: 'Upcoming sessions',
    dayStreak: 'Day streak',
    bookTeacher: 'Book a teacher',
    nextLessons: 'Next lessons',
    noSessions: 'No sessions yet. Book your first tiny lesson.',
    withTeacher: 'With',
    bookedSessions: 'Booked sessions',
    openSlots: 'Open slots',
    estimatedEarnings: 'Estimated earnings',
    setAvailability: 'Set availability',
    saveSlot: 'Save slot',
    remove: 'Remove',
    noOpenSlots: 'No open slots yet.',
    bookSession: 'Book a session',
    searchTeacher: 'Search teacher or focus',
    all: 'All',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    noMatchingSlots: 'No matching slots yet.',
    bookedMessage: 'Booked! It is waiting on your dashboard calendar.',
    calendar: 'Calendar',
    calendarHint: 'Tap a day or a session for details.',
    details: 'Details',
    nothingBooked: 'Nothing booked on this day.',
    tapForDetails: 'Tap an item to open its details here.',
    databaseTitle: 'Database',
    databaseHeroTitle: 'Users database',
    databaseHeroText: 'Manage students and teachers. Changes are saved directly to the database.',
    savedDb: 'Saved to database.',
    removedDb: 'User removed from database.',
    save: 'Save',
    delete: 'Delete',
    slots: 'Slots',
    studentSessions: 'Student sessions',
    teacherSessions: 'Teacher sessions',
    focusConversation: 'Conversation',
    focusPronunciation: 'Pronunciation',
    focusExam: 'Exam prep',
    english: 'EN',
    persian: 'FA',
  },
  fa: {
    appName: 'اپلیکیشن لینگیمو',
    home: 'خانه',
    dashboard: 'داشبورد',
    book: 'رزرو',
    database: 'دیتابیس',
    logout: 'خروج',
    login: 'ورود',
    signup: 'ثبت نام',
    start: 'شروع',
    startLearning: 'شروع یادگیری',
    createAccount: 'ساخت حساب',
    bookClass: 'رزرو کلاس',
    student: 'زبان آموز',
    teacher: 'مدرس',
    admin: 'مدیر',
    roleStudent: 'زبان آموز',
    roleTeacher: 'مدرس',
    roleAdmin: 'مدیر',
    homeTitle: 'خانه',
    homeHeroTitle: 'زبان را با جلسه های کوتاه و دوست داشتنی یاد بگیر',
    homeHeroText: 'مدرس رزرو کن، برنامه ات را توی تقویم ببین، و همه چیز را ساده و دلنشین جلو ببر.',
    homeDashboard: 'داشبورد',
    homeDatabase: 'دیتابیس',
    loginTitle: 'خوش برگشتی به لینگیمو',
    loginText: 'دنیای کوچک زبان تو منتظرته.',
    email: 'ایمیل',
    sms: 'پیامک',
    password: 'رمز عبور',
    phone: 'شماره موبایل',
    dummyCode: 'کد آزمایشی',
    noAccount: 'هنوز حساب نداری؟',
    haveAccount: 'قبلا حساب ساختی؟',
    signupTitle: 'حساب لینگیموی خودت را بساز',
    signupText: 'مشخص کن این حساب برای یادگیری است یا تدریس.',
    name: 'نام',
    studentHelp: 'مدرس رزرو کن و جلسه هایت را دنبال کن.',
    teacherHelp: 'زمان های آزاد را ثبت کن و رزروها را مدیریت کن.',
    studentDashboard: 'داشبورد زبان آموز',
    teacherDashboard: 'داشبورد مدرس',
    upcomingSessions: 'جلسه های پیش رو',
    dayStreak: 'روز پشت سر هم',
    bookTeacher: 'رزرو مدرس',
    nextLessons: 'کلاس های بعدی',
    noSessions: 'هنوز جلسه ای نداری. اولین کلاس کوتاهت را رزرو کن.',
    withTeacher: 'با',
    bookedSessions: 'جلسه های رزروشده',
    openSlots: 'زمان های آزاد',
    estimatedEarnings: 'درآمد تخمینی',
    setAvailability: 'ثبت زمان آزاد',
    saveSlot: 'ذخیره زمان',
    remove: 'حذف',
    noOpenSlots: 'فعلا زمان آزادی ثبت نشده.',
    bookSession: 'رزرو جلسه',
    searchTeacher: 'جستجوی مدرس یا موضوع',
    all: 'همه',
    beginner: 'مقدماتی',
    intermediate: 'متوسط',
    advanced: 'پیشرفته',
    noMatchingSlots: 'زمانی مطابق جستجو پیدا نشد.',
    bookedMessage: 'رزرو شد! توی تقویم داشبوردت می بینیش.',
    calendar: 'تقویم',
    calendarHint: 'روی روز یا جلسه بزن تا جزئیاتش باز شود.',
    details: 'جزئیات',
    nothingBooked: 'برای این روز چیزی ثبت نشده.',
    tapForDetails: 'روی یک مورد بزن تا جزئیاتش اینجا نمایش داده شود.',
    databaseTitle: 'دیتابیس',
    databaseHeroTitle: 'دیتابیس کاربران',
    databaseHeroText: 'زبان آموزها و مدرس ها را مدیریت کن. تغییرات مستقیم در دیتابیس ذخیره می شوند.',
    savedDb: 'در دیتابیس ذخیره شد.',
    removedDb: 'کاربر از دیتابیس حذف شد.',
    save: 'ذخیره',
    delete: 'حذف',
    slots: 'زمان ها',
    studentSessions: 'جلسه های زبان آموز',
    teacherSessions: 'جلسه های مدرس',
    focusConversation: 'مکالمه',
    focusPronunciation: 'تلفظ',
    focusExam: 'آمادگی آزمون',
    english: 'EN',
    persian: 'FA',
  },
} as const

export type CopyKey = keyof typeof copy.en

export function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  return (window.localStorage.getItem(langKey) as Lang | null) ?? 'en'
}

export function setStoredLang(lang: Lang) {
  window.localStorage.setItem(langKey, lang)
  window.dispatchEvent(new CustomEvent('lingimo-lang-change', { detail: lang }))
}

export function useI18n() {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    setLang(getInitialLang())
    const onChange = (event: Event) => {
      setLang((event as CustomEvent<Lang>).detail)
    }
    window.addEventListener('lingimo-lang-change', onChange)
    return () => window.removeEventListener('lingimo-lang-change', onChange)
  }, [])

  return useMemo(() => {
    const t = (key: CopyKey) => copy[lang][key]
    const switchLang = (nextLang: Lang) => {
      setLang(nextLang)
      setStoredLang(nextLang)
    }
    return { lang, dir: lang === 'fa' ? 'rtl' : 'ltr', t, switchLang }
  }, [lang])
}
