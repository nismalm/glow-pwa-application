import { create } from 'zustand'
import { writeDaily } from '@/lib/storeSync'

interface MoodState {
  mood: 1 | 2 | 3 | 4 | 5 | null
  hydrate: (mood: 1 | 2 | 3 | 4 | 5 | null) => void
  setMood: (mood: 1 | 2 | 3 | 4 | 5) => void
}

export const useMoodStore = create<MoodState>((set) => ({
  mood: null,
  hydrate: (mood) => set({ mood }),
  setMood: (mood) => {
    set({ mood })
    writeDaily({ mood })
  },
}))
