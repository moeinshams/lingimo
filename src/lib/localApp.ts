'use client'

export type Role = 'STUDENT' | 'TEACHER'
export type SessionStatus = 'UPCOMING' | 'COMPLETED' | 'CANCELED'

export type LingimoUser = {
  id: string
  name: string
  email?: string
  phone?: string
  role: Role
}

export type AvailabilitySlot = {
  id: string
  teacherId: string
  teacherName: string
  language: string
  level: string
  startTime: string
  endTime: string
  price: number
}

export type LearningSession = {
  id: string
  studentId: string
  teacherId: string
  teacherName: string
  studentName: string
  language: string
  startTime: string
  endTime: string
  status: SessionStatus
}

type LingimoStore = {
  users: LingimoUser[]
  availability: AvailabilitySlot[]
  sessions: LearningSession[]
  currentUserId?: string
}

const storeKey = 'lingimo.app.store.v1'

const addDays = (days: number, hour: number, minute = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

const plusMinutes = (iso: string, minutes: number) => {
  const date = new Date(iso)
  date.setMinutes(date.getMinutes() + minutes)
  return date.toISOString()
}

const seedStore = (): LingimoStore => {
  const teachers: LingimoUser[] = [
    { id: 'teacher-maya', name: 'Maya Chen', email: 'maya@lingimo.test', role: 'TEACHER' },
    { id: 'teacher-omar', name: 'Omar Reyes', email: 'omar@lingimo.test', role: 'TEACHER' },
  ]
  const student: LingimoUser = {
    id: 'student-demo',
    name: 'Demo Student',
    email: 'student@lingimo.test',
    role: 'STUDENT',
  }
  const first = addDays(1, 10)
  const second = addDays(2, 16, 30)
  const third = addDays(3, 12)
  const fourth = addDays(4, 18)

  return {
    users: [student, ...teachers],
    currentUserId: undefined,
    availability: [
      {
        id: 'slot-1',
        teacherId: teachers[0].id,
        teacherName: teachers[0].name,
        language: 'English conversation',
        level: 'Intermediate',
        startTime: first,
        endTime: plusMinutes(first, 45),
        price: 18,
      },
      {
        id: 'slot-2',
        teacherId: teachers[1].id,
        teacherName: teachers[1].name,
        language: 'IELTS speaking',
        level: 'Advanced',
        startTime: second,
        endTime: plusMinutes(second, 45),
        price: 24,
      },
      {
        id: 'slot-3',
        teacherId: teachers[0].id,
        teacherName: teachers[0].name,
        language: 'Travel English',
        level: 'Beginner',
        startTime: third,
        endTime: plusMinutes(third, 30),
        price: 14,
      },
    ],
    sessions: [
      {
        id: 'session-1',
        studentId: student.id,
        teacherId: teachers[1].id,
        teacherName: teachers[1].name,
        studentName: student.name,
        language: 'Pronunciation',
        startTime: fourth,
        endTime: plusMinutes(fourth, 45),
        status: 'UPCOMING',
      },
    ],
  }
}

const readStore = (): LingimoStore => {
  if (typeof window === 'undefined') return seedStore()
  const saved = window.localStorage.getItem(storeKey)
  if (!saved) {
    const seeded = seedStore()
    window.localStorage.setItem(storeKey, JSON.stringify(seeded))
    return seeded
  }

  try {
    return JSON.parse(saved) as LingimoStore
  } catch {
    const seeded = seedStore()
    window.localStorage.setItem(storeKey, JSON.stringify(seeded))
    return seeded
  }
}

const writeStore = (store: LingimoStore) => {
  window.localStorage.setItem(storeKey, JSON.stringify(store))
}

const makeId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`

export function getStore() {
  return readStore()
}

export function getCurrentUser() {
  const store = readStore()
  return store.users.find((user) => user.id === store.currentUserId) ?? null
}

export function loginWithEmail(email: string, password: string) {
  if (!email.trim() || password.length < 4) {
    throw new Error('Use an email and a password with at least 4 characters.')
  }

  const store = readStore()
  const normalized = email.trim().toLowerCase()
  let user = store.users.find((item) => item.email?.toLowerCase() === normalized)

  if (!user) {
    user = {
      id: makeId('user'),
      name: normalized.split('@')[0] || 'Lingimo learner',
      email: normalized,
      role: 'STUDENT',
    }
    store.users.push(user)
  }

  store.currentUserId = user.id
  writeStore(store)
  return user
}

export function loginWithSms(phone: string, code: string) {
  const cleanPhone = phone.replace(/\s/g, '')
  if (!cleanPhone || code !== '123456') {
    throw new Error('Use dummy code 123456 for now.')
  }

  const store = readStore()
  let user = store.users.find((item) => item.phone === cleanPhone)

  if (!user) {
    user = {
      id: makeId('user'),
      name: `Learner ${cleanPhone.slice(-4)}`,
      phone: cleanPhone,
      role: 'STUDENT',
    }
    store.users.push(user)
  }

  store.currentUserId = user.id
  writeStore(store)
  return user
}

export function updateCurrentUserRole(role: Role, name?: string) {
  const store = readStore()
  const user = store.users.find((item) => item.id === store.currentUserId)
  if (!user) throw new Error('Please log in first.')

  user.role = role
  if (name?.trim()) user.name = name.trim()
  writeStore(store)
  return user
}

export function logout() {
  const store = readStore()
  store.currentUserId = undefined
  writeStore(store)
}

export function bookSlot(slotId: string) {
  const store = readStore()
  const user = store.users.find((item) => item.id === store.currentUserId)
  const slot = store.availability.find((item) => item.id === slotId)
  if (!user || user.role !== 'STUDENT') throw new Error('Log in as a student to book.')
  if (!slot) throw new Error('This slot is no longer available.')

  store.availability = store.availability.filter((item) => item.id !== slotId)
  store.sessions.push({
    id: makeId('session'),
    studentId: user.id,
    teacherId: slot.teacherId,
    teacherName: slot.teacherName,
    studentName: user.name,
    language: slot.language,
    startTime: slot.startTime,
    endTime: slot.endTime,
    status: 'UPCOMING',
  })
  writeStore(store)
}

export function addTeacherSlot(startTime: string, durationMinutes: number, language: string, level: string, price: number) {
  const store = readStore()
  const user = store.users.find((item) => item.id === store.currentUserId)
  if (!user || user.role !== 'TEACHER') throw new Error('Log in as a teacher to add availability.')

  const start = new Date(startTime)
  if (Number.isNaN(start.getTime())) throw new Error('Choose a valid date and time.')

  const end = new Date(start)
  end.setMinutes(end.getMinutes() + durationMinutes)

  store.availability.push({
    id: makeId('slot'),
    teacherId: user.id,
    teacherName: user.name,
    language,
    level,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    price,
  })
  writeStore(store)
}

export function removeTeacherSlot(slotId: string) {
  const store = readStore()
  const user = store.users.find((item) => item.id === store.currentUserId)
  if (!user) throw new Error('Please log in first.')
  store.availability = store.availability.filter((slot) => slot.id !== slotId || slot.teacherId !== user.id)
  writeStore(store)
}

export function resetDemoData() {
  const seeded = seedStore()
  writeStore(seeded)
  return seeded
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatTimeRange(start: string, end: string) {
  const time = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' })
  return `${time.format(new Date(start))} - ${time.format(new Date(end))}`
}
