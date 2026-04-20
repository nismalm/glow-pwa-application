import { addDays, subDays, setHours, setMinutes, startOfDay } from 'date-fns'
import type { Task } from '@/types/models'

const d = (offset: number) => startOfDay(addDays(new Date(), offset))
const at = (offset: number, h: number, m = 0) => setMinutes(setHours(d(offset), h), m)

// Phase 6: replaced by Firestore users/{uid}/tasks collection
export const mockTasks: Task[] = [
  // yesterday
  { id: 'y1', title: 'Morning run', dueAt: at(-1, 6, 30), color: 'coral', repeat: 'daily', done: true },
  { id: 'y2', title: 'Call mom', dueAt: at(-1, 19, 0), color: 'lilac', repeat: 'none', done: true },

  // today
  { id: 't1', title: 'Morning meditation', dueAt: at(0, 7, 0), color: 'lilac', repeat: 'daily', done: false },
  { id: 't2', title: 'Drink 10 glasses', dueAt: at(0, 20, 0), color: 'sky', repeat: 'daily', done: false },
  { id: 't3', title: 'Evening walk', dueAt: at(0, 18, 30), color: 'accent', repeat: 'daily', done: true },

  // tomorrow
  { id: 'tm1', title: 'Read 20 pages', dueAt: at(1, 21, 0), color: 'sky', repeat: 'daily', done: false },
  { id: 'tm2', title: 'Skincare routine', dueAt: at(1, 22, 0), color: 'lilac', repeat: 'daily', done: false },

  // day after tomorrow
  { id: 'd2', title: 'Grocery shopping', dueAt: at(2, 10, 0), color: 'coral', repeat: 'none', done: false },

  // 4 days out
  { id: 'd4', title: 'Weekly review', dueAt: at(4, 19, 0), color: 'accent', repeat: 'weekly', done: false },

  // next week
  { id: 'nw1', title: 'Doctor appointment', dueAt: at(7, 11, 0), color: 'coral', repeat: 'none', done: false },
  { id: 'nw2', title: 'Journal session', dueAt: at(7, 20, 30), color: 'lilac', repeat: 'weekly', done: false },

  // past week
  { id: 'p1', title: 'Stretch session', dueAt: at(-3, 8, 0), color: 'accent', repeat: 'daily', done: true },
  { id: 'p2', title: 'Gratitude journal', dueAt: at(-5, 21, 0), color: 'sky', repeat: 'daily', done: true },
]

// Convenience: start-of-day Date for offset
export { subDays, d as dayAt }
