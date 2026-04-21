export const WORKOUT_TYPES = [
  { id: 'walk', label: '🚶 Walk' },
  { id: 'yoga', label: '🧘 Yoga' },
  { id: 'strength', label: '💪 Strength' },
  { id: 'run', label: '🏃 Run' },
  { id: 'dance', label: '🩰 Dance' },
  { id: 'cycle', label: '🚴 Cycle' },
  { id: 'home', label: '🏠 Home workout' },
  { id: 'crossfit', label: '🏋️ Crossfit' },
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
