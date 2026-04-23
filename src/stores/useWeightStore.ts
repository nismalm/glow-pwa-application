import { create } from 'zustand'
import { differenceInDays, parseISO } from 'date-fns'
import { writeWeight } from '@/lib/storeSync'
import { todayKey } from '@/lib/dates'
import type { WeightEntry } from '@/types/models'

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
    // No optimistic update — persistentLocalCache fires the Firestore snapshot
    // from local IndexedDB within milliseconds, driving the UI correctly.
    // Optimistic updates caused a race where hydrateEntries() would overwrite
    // a locally-staged entry with a stale snapshot.
    writeWeight(todayKey(), kg)
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
