import { create } from 'zustand'
import { format, subDays } from 'date-fns'
import type { Streak } from '@/types/models'

// Phase 6: swap with Firestore users/{uid}/streaks/current via runTransaction
const mockStreak: Streak = {
  count: 5,
  lastCompletedDate: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
  best: 11,
}

type StreakState = Streak & {
  increment: () => void
}

export const useStreakStore = create<StreakState>((set) => ({
  ...mockStreak,
  increment: () =>
    set((s) => {
      const next = s.count + 1
      return {
        count: next,
        lastCompletedDate: format(new Date(), 'yyyy-MM-dd'),
        best: Math.max(s.best, next),
      }
    }),
}))
