export type Role = 'ADMIN' | 'STUDENT' | 'TEACHER'

export type AppUser = {
  id: string
  email?: string | null
  phone?: string | null
  name: string
  role: Role
  createdAt?: string
  _count?: {
    availabilities: number
    sessionsAsStudent: number
    sessionsAsTeacher: number
  }
}

export type AvailabilitySlot = {
  id: string
  teacherId: string
  focus: string
  level: string
  price: number
  startTime: string
  endTime: string
  booked: boolean
  teacher?: AppUser
}

export type LingimoSession = {
  id: string
  studentId: string
  teacherId: string
  focus: string
  startTime: string
  endTime: string
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELED'
  teacher?: AppUser
  student?: AppUser
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(value))
}

export function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date(value))
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
