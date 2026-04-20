import { create } from 'zustand'
import { format } from 'date-fns'
import { writeDaily } from '@/lib/storeSync'
import { DEFAULT_RITUALS } from '@/types/models'
import type { RitualId, Rituals } from '@/types/models'

const todayKey = format(new Date(), 'yyyy-MM-dd')

interface RitualsState {
  dates: Record<string, Rituals>
  rituals: Rituals
  hydrate: (date: string, rituals: Rituals) => void
  toggle: (id: RitualId) => void
  completedCount: () => number
  completedCountForDate: (date: string) => number
}

export const useRitualsStore = create<RitualsState>((set, get) => ({
  dates: { [todayKey]: { ...DEFAULT_RITUALS } },
  rituals: { ...DEFAULT_RITUALS },
  hydrate: (date, rituals) =>
    set((s) => ({ rituals, dates: { ...s.dates, [date]: rituals } })),
  toggle: (id) =>
    set((s) => {
      const updated = { ...s.rituals, [id]: !s.rituals[id] }
      writeDaily({ rituals: updated })
      return { rituals: updated, dates: { ...s.dates, [todayKey]: updated } }
    }),
  completedCount: () => Object.values(get().rituals).filter(Boolean).length,
  completedCountForDate: (date) => {
    const r = get().dates[date]
    return r ? Object.values(r).filter(Boolean).length : 0
  },
}))
