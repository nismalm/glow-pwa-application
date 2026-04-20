// Phase 6: types and intensity levels are static UI config — no Firestore swap needed.
// EXERCISE_GOAL_MIN could move to users/{uid}.preferences in Phase 6.

export const WORKOUT_TYPES = [
  { id: 'walk', label: '🚶 Walk' },
  { id: 'yoga', label: '🧘 Yoga' },
  { id: 'strength', label: '💪 Strength' },
  { id: 'run', label: '🏃 Run' },
  { id: 'dance', label: '🩰 Dance' },
  { id: 'cycle', label: '🚴 Cycle' },
] as const

export type WorkoutTypeId = (typeof WORKOUT_TYPES)[number]['id']

export const INTENSITY_LEVELS = [
  { v: 1 as const, emoji: '😌', label: 'Easy' },
  { v: 2 as const, emoji: '🙂', label: 'Light' },
  { v: 3 as const, emoji: '😤', label: 'Good' },
  { v: 4 as const, emoji: '🥵', label: 'Tough' },
  { v: 5 as const, emoji: '🔥', label: 'Max' },
]

export const EXERCISE_GOAL_MIN = 30
