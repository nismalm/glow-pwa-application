import { create } from 'zustand'
import { mockTodayLog } from '@/mocks/todayLog'
import type { ExerciseLog } from '@/types/models'

// Phase 6: swap mockTodayLog with useDailyLog(today).log.exercise
type ExerciseState = ExerciseLog & {
  setLog: (log: ExerciseLog) => void
}

const initial: ExerciseLog = mockTodayLog.exercise ?? {
  didWorkout: false,
  types: [],
  durationMin: 30,
  intensity: 3 as 1 | 2 | 3 | 4 | 5,
  notes: '',
}

export const useExerciseStore = create<ExerciseState>((set) => ({
  ...initial,
  setLog: (log) => set(log),
}))
