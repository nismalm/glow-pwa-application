import { create } from 'zustand'
import { writeDaily, notifyGoalHit } from '@/lib/storeSync'

interface WaterState {
  glasses: number
  goal: number
  hydrate: (data: { glasses: number; goal: number }) => void
  increment: () => void
  decrement: () => void
  setGlasses: (n: number) => void
}

export const useWaterStore = create<WaterState>((set, get) => ({
  glasses: 0,
  goal: 12,
  hydrate: (data) => set(data),
  increment: () => {
    const { glasses, goal } = get()
    const next = Math.min(20, glasses + 1)
    set({ glasses: next })
    writeDaily({ water: { glasses: next, goal } })
    if (next === goal) notifyGoalHit()
  },
  decrement: () => {
    const { glasses, goal } = get()
    const next = Math.max(0, glasses - 1)
    set({ glasses: next })
    writeDaily({ water: { glasses: next, goal } })
  },
  setGlasses: (n) => {
    const { goal } = get()
    const clamped = Math.max(0, Math.min(20, n))
    set({ glasses: clamped })
    writeDaily({ water: { glasses: clamped, goal } })
    if (clamped === goal) notifyGoalHit()
  },
}))
