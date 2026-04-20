import { useState } from 'react'
import { format, subDays } from 'date-fns'
import { EXERCISE_GOAL_MIN, INTENSITY_LEVELS } from '@/lib/exerciseConfig'
import { useExerciseStore } from '@/stores/useExerciseStore'
import { useWeekData } from '@/hooks/useWeekData'
import { WeekStrip } from '@/components/WeekStrip'
import { WorkoutForm } from './WorkoutForm'
import { ExerciseChart } from './ExerciseChart'

function PastDayView({ exerciseMin, intensity }: { exerciseMin: number; intensity: number | null }) {
  const didWorkout = exerciseMin > 0
  const intensityLevel = intensity != null
    ? INTENSITY_LEVELS.find((l) => l.v === intensity) ?? null
    : null

  return (
    <div className="bg-card rounded-3xl p-5 shadow-card border border-black/[.03] mb-4">
      <h3 className="text-[16px] font-bold text-ink mb-1">Movement that day 🏃‍♀️</h3>
      <p className="text-ink-soft text-[13px] mb-5">Read-only — past days can't be edited</p>

      {didWorkout ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-3 bg-bg rounded-2xl">
            <span className="text-2xl">💪</span>
            <div>
              <p className="text-[13px] font-bold text-ink">Worked out</p>
              <p className="text-[12px] text-ink-soft">{exerciseMin} minutes</p>
            </div>
          </div>
          {intensityLevel && (
            <div className="flex items-center gap-3 p-3 bg-bg rounded-2xl">
              <span className="text-2xl">{intensityLevel.emoji}</span>
              <div>
                <p className="text-[13px] font-bold text-ink">Intensity</p>
                <p className="text-[12px] text-ink-soft">{intensityLevel.label}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-bg rounded-2xl">
          <span className="text-2xl">😴</span>
          <div>
            <p className="text-[13px] font-bold text-ink">Rest day</p>
            <p className="text-[12px] text-ink-soft">Recovery is part of progress</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ExerciseScreen() {
  const { didWorkout } = useExerciseStore()
  const weekData = useWeekData()
  const [selectedOffset, setSelectedOffset] = useState(0)

  function isDone(dayOffset: number) {
    if (dayOffset === 0) return didWorkout
    return (weekData[6 + dayOffset]?.exerciseMin ?? 0) >= EXERCISE_GOAL_MIN
  }

  const isToday = selectedOffset === 0
  const selectedDate = format(subDays(new Date(), -selectedOffset), 'EEEE, MMM d')
  const pastDay = weekData[6 + selectedOffset]

  return (
    <div className="flex flex-col px-4 pt-5 min-h-full">
      <h1 className="text-[22px] font-black tracking-tight text-ink mb-4">Exercise</h1>

      <WeekStrip
        isDone={isDone}
        selectedOffset={selectedOffset}
        onSelect={setSelectedOffset}
      />

      {!isToday && (
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-[13px] font-semibold text-ink-soft">
            📅 Viewing {selectedDate}
          </span>
          <button
            onClick={() => setSelectedOffset(0)}
            className="text-[12px] font-bold text-coral"
          >
            Back to today
          </button>
        </div>
      )}

      {isToday
        ? <WorkoutForm />
        : <PastDayView exerciseMin={pastDay?.exerciseMin ?? 0} intensity={pastDay?.intensity ?? null} />
      }

      <div className="bg-card rounded-3xl p-5 shadow-card border border-black/[.03]">
        <ExerciseChart weekData={weekData} />
      </div>
    </div>
  )
}
