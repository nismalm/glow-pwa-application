import { create } from 'zustand'
import { differenceInDays, parseISO } from 'date-fns'
import { writeWeight } from '@/lib/storeSync'
import { todayKey } from '@/lib/dates'
import type { WeightEntry } from '@/types/models'

interface WeightState {
  entries: WeightEntry[]
  loaded: boolean
  joinedDate: string | null
  setJoinedDate: (d: string) => void
  hydrateEntries: (entries: WeightEntry[]) => void
  logWeight: (kg: number) => void
  todayEntry: () => WeightEntry | null
  isWeighInDay: () => boolean
}

export const useWeightStore = create<WeightState>((set, get) => ({
  entries: [],
  loaded: false,
  joinedDate: null,

  setJoinedDate: (joinedDate) => set({ joinedDate }),

  // `loaded: true` flips on first snapshot so the UI can avoid flashing the
  // prompt / hiding the chart before Firestore has responded.
  hydrateEntries: (entries) => set({ entries, loaded: true }),

  logWeight: (kg) => {
    // Optimistic update keyed by date: replace any existing entry for today,
    // then re-sort. The snapshot listener will later overwrite with server
    // truth via hydrateEntries — since the date key matches, the entry is
    // replaced in place (no flicker, no duplicate). This keeps the UI
    // responsive when the cache snapshot is delayed (offline, cold PWA
    // relaunch, or tabs that lost the IndexedDB lease before the multi-tab
    // manager was introduced).
    const date = todayKey()
    set((s) => ({
      entries: [...s.entries.filter((e) => e.date !== date), { date, kg }].sort(
        (a, b) => a.date.localeCompare(b.date),
      ),
    }))
    writeWeight(date, kg)
  },

  todayEntry: () => {
    // todayKey() called fresh each time — never stale across midnight or tab resume
    return get().entries.find((e) => e.date === todayKey()) ?? null
  },

  isWeighInDay: () => {
    const { joinedDate } = get()
    if (!joinedDate) return false
    const days = differenceInDays(parseISO(todayKey()), parseISO(joinedDate))
    return days >= 0 && days % 7 === 0
  },
}))
