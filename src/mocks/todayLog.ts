import { format } from 'date-fns'
import type { DailyLog } from '@/types/models'

// Phase 6: replaced by a real Firestore `dailyLogs/{yyyy-MM-dd}` document via useDailyLog()
export const mockTodayLog: DailyLog = {
  date: format(new Date(), 'yyyy-MM-dd'),
  water: {
    glasses: 2,
    goal: 10,
  },
  exercise: {
    didWorkout: true,
    types: ['walk'],
    durationMin: 25,
    intensity: 3 as 1 | 2 | 3 | 4 | 5,
    notes: '',
  },
  rituals: {
    study: true,
    read: true,
    meditate: false,
    gratitude: false,
    skincare: false,
    call: false,
  },
  mood: 4,
}
