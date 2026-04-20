import { create } from 'zustand'
import { format, differenceInDays, parseISO } from 'date-fns'
import { writeWeight } from '@/lib/storeSync'
import type { WeightEntry } from '@/types/models'

const todayKey = format(new Date(), 'yyyy-MM-dd')

interface WeightState {
  entries: WeightEntry[]
  joinedDate: string | null
  setJoinedDate: (d: string) => void
  hydrateEntries: (entries: WeightEntry[]) => void
  logWeight: (kg: number) => void
  todayEntry: () => WeightEntry | null
  isWeighInDay: () => boolean
}

export const useWeightStore = create<WeightState>((set, get) => ({
  entries: [],
  joinedDate: null,

  setJoinedDate: (joinedDate) => set({ joinedDate }),

  hydrateEntries: (entries) => set({ entries }),

  logWeight: (kg) => {
    writeWeight(todayKey, kg)
    set((s) => {
      const filtered = s.entries.filter((e) => e.date !== todayKey)
      return {
        entries: [...filtered, { date: todayKey, kg }].sort((a, b) =>
          a.date.localeCompare(b.date),
        ),
      }
    })
  },

  todayEntry: () => get().entries.find((e) => e.date === todayKey) ?? null,

  isWeighInDay: () => {
    const { joinedDate } = get()
    if (!joinedDate) return false
    const days = differenceInDays(parseISO(todayKey), parseISO(joinedDate))
    return days >= 0 && days % 7 === 0
  },
}))
