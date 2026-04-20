export interface WaterLog {
  glasses: number
  goal: number
  completedAt?: Date
}

export interface ExerciseLog {
  didWorkout: boolean
  types: string[]
  durationMin: number
  intensity: 1 | 2 | 3 | 4 | 5
  notes: string
}

export type RitualId = 'study' | 'read' | 'meditate' | 'gratitude' | 'skincare' | 'call'
export type Rituals = Record<RitualId, boolean>

export const DEFAULT_RITUALS: Rituals = {
  study: false,
  read: false,
  meditate: false,
  gratitude: false,
  skincare: false,
  call: false,
}

export interface DailyLog {
  date: string // yyyy-MM-dd
  water: WaterLog
  exercise: ExerciseLog | null
  rituals: Rituals
  mood: 1 | 2 | 3 | 4 | 5 | null
}

export interface Streak {
  count: number
  lastCompletedDate: string // yyyy-MM-dd
  best: number
}

export interface UserProfile {
  displayName: string
  avatarInitial: string
  waterGoal: number
}

export interface WeekDay {
  day: string // e.g. "Mon"
  water: number // glasses
  exerciseMin: number // minutes
  ritualsCompleted: number // count of rituals done
  mood: number | null
  intensity: number | null
}

export interface WeightEntry {
  date: string // yyyy-MM-dd
  kg: number
}

export interface Task {
  id: string
  title: string
  dueAt: Date
  color: 'coral' | 'lilac' | 'sky' | 'accent'
  repeat: 'none' | 'daily' | 'weekly'
  done: boolean
}

export interface FirestoreUser {
  displayName: string
  photoURL: string | null
  email: string | null
  createdAt: unknown // Firestore Timestamp
  timezone: string
  waterGoal: number
  fcmTokens: string[]
  preferences: { reminders: boolean; theme: 'light' | 'dark' }
}
