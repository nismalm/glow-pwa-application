import { subDays, format } from 'date-fns'
import type { WeekDay } from '@/types/models'

// Simulated past-6-day history; today's values come from mockTodayLog
// Phase 6: replaced by a Firestore range query via useWeekData(weekStart)
const PAST_WATER = [8, 10, 6, 9, 7, 5]
const PAST_EXERCISE_MIN = [30, 45, 0, 20, 35, 60]
const PAST_RITUALS_DONE = [5, 6, 4, 5, 3, 6]

const today = new Date()

export const mockWeekLogs: WeekDay[] = Array.from({ length: 7 }, (_, i) => {
  const date = subDays(today, 6 - i)
  const isToday = i === 6
  return {
    day: format(date, 'EEE'),
    water: isToday ? 3 : PAST_WATER[i],
    exerciseMin: isToday ? 25 : PAST_EXERCISE_MIN[i],
    ritualsCompleted: isToday ? 2 : PAST_RITUALS_DONE[i],
  }
})
