import { create } from 'zustand'
import { mockTodayLog } from '@/mocks/todayLog'
import type { RitualId, Rituals } from '@/types/models'

// Phase 6: swap mockTodayLog with useDailyLog(today).log.rituals
interface RitualsState {
  rituals: Rituals
  toggle: (id: RitualId) => void
  completedCount: () => number
}

export const useRitualsStore = create<RitualsState>((set, get) => ({
  rituals: { ...mockTodayLog.rituals },
  toggle: (id) => set((s) => ({ rituals: { ...s.rituals, [id]: !s.rituals[id] } })),
  completedCount: () => Object.values(get().rituals).filter(Boolean).length,
}))
