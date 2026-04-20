import { create } from 'zustand'

// Phase 6: swap with useDailyLog(today).log.mood
interface MoodState {
  mood: 1 | 2 | 3 | 4 | 5 | null
  setMood: (mood: 1 | 2 | 3 | 4 | 5) => void
}

export const useMoodStore = create<MoodState>((set) => ({
  mood: null,
  setMood: (mood) => set({ mood }),
}))
