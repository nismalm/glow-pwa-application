import { create } from 'zustand'
import { mockTodayLog } from '@/mocks/todayLog'

// Phase 6: swap mockTodayLog with useDailyLog(today).log.water
interface WaterState {
  glasses: number
  goal: number
  increment: () => void
  decrement: () => void
  setGlasses: (n: number) => void
}

export const useWaterStore = create<WaterState>((set) => ({
  glasses: mockTodayLog.water.glasses,
  goal: mockTodayLog.water.goal,
  increment: () => set((s) => ({ glasses: Math.min(20, s.glasses + 1) })),
  decrement: () => set((s) => ({ glasses: Math.max(0, s.glasses - 1) })),
  setGlasses: (n) => set({ glasses: Math.max(0, Math.min(20, n)) }),
}))
