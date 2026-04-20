import { create } from 'zustand'
import type { Streak } from '@/types/models'

type StreakState = Streak & {
  hydrate: (streak: Streak) => void
}

export const useStreakStore = create<StreakState>((set) => ({
  count: 0,
  lastCompletedDate: '',
  best: 0,
  hydrate: (streak) => set(streak),
}))
