import { create } from 'zustand'
import { format } from 'date-fns'
import { mockTodayLog } from '@/mocks/todayLog'
import type { RitualId, Rituals } from '@/types/models'

const todayKey = format(new Date(), 'yyyy-MM-dd')

// Phase 6: swap mockTodayLog with useDailyLog(today).log.rituals
interface RitualsState {
  dates: Record<string, Rituals>
  rituals: Rituals
  toggle: (id: RitualId) => void
  completedCount: () => number
  completedCountForDate: (date: string) => number
}

export const useRitualsStore = create<RitualsState>((set, get) => ({
  dates: { [todayKey]: { ...mockTodayLog.rituals } },
  rituals: { ...mockTodayLog.rituals },
  toggle: (id) =>
    set((s) => {
      const updated = { ...s.rituals, [id]: !s.rituals[id] }
      return { rituals: updated, dates: { ...s.dates, [todayKey]: updated } }
    }),
  completedCount: () => Object.values(get().rituals).filter(Boolean).length,
  completedCountForDate: (date) => {
    const r = get().dates[date]
    return r ? Object.values(r).filter(Boolean).length : 0
  },
}))
