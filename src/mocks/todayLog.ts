import { format } from 'date-fns'
import type { DailyLog } from '@/types/models'

// Phase 6: replaced by a real Firestore `dailyLogs/{yyyy-MM-dd}` document via useDailyLog()
export const mockTodayLog: DailyLog = {
  date: format(new Date(), 'yyyy-MM-dd'),
  water: {
    glasses: 0,
    goal: 10,
  },
  exercise: null,
  rituals: {
    study: false,
    read: false,
    meditate: false,
    gratitude: false,
    skincare: false,
    call: false,
  },
  mood: null,
}
