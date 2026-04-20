import { create } from 'zustand'
import { writeDaily } from '@/lib/storeSync'
import type { ExerciseLog } from '@/types/models'

type ExerciseState = ExerciseLog & {
  hydrate: (log: ExerciseLog | null) => void
  setLog: (log: ExerciseLog) => void
}

const defaults: ExerciseLog = {
  didWorkout: false,
  types: [],
  durationMin: 0,
  intensity: 3,
  notes: '',
}

export const useExerciseStore = create<ExerciseState>((set) => ({
  ...defaults,
  hydrate: (log) => set(log ?? defaults),
  setLog: (log) => {
    set(log)
    writeDaily({ exercise: log })
  },
}))
