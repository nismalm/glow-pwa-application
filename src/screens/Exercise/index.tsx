import { useState } from 'react'
import { format, subDays } from 'date-fns'
import { mockWeekLogs } from '@/mocks/weekLogs'
import { EXERCISE_GOAL_MIN, INTENSITY_LEVELS } from '@/mocks/exerciseConfig'
import { WeekStrip } from '@/components/WeekStrip'
import { WorkoutForm } from './WorkoutForm'
import { ExerciseChart } from './ExerciseChart'

// Past-day read-only summary — data comes from mockWeekLogs (Phase 6: from Firestore dailyLog)
function PastDayView({ exerciseMin }: { exerciseMin: number }) {
  const didWorkout = exerciseMin > 0
  const intensity = INTENSITY_LEVELS[2] // mock past intensity as 'Good' (index 2 = level 3)

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
          <div className="flex items-center gap-3 p-3 bg-bg rounded-2xl">
            <span className="text-2xl">{intensity.emoji}</span>
            <div>
              <p className="text-[13px] font-bold text-ink">Intensity</p>
              <p className="text-[12px] text-ink-soft">{intensity.label}</p>
            </div>
          </div>
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
  const [selectedOffset, setSelectedOffset] = useState(0)

  function isDone(dayOffset: number) {
    const idx = 6 + dayOffset
    return (mockWeekLogs[idx]?.exerciseMin ?? 0) >= EXERCISE_GOAL_MIN
  }

  // offset -1 → mockWeekLogs[5], offset -6 → mockWeekLogs[0]
  function exerciseMinForOffset(offset: number) {
    const idx = 6 + offset
    return mockWeekLogs[idx]?.exerciseMin ?? 0
  }

  const isToday = selectedOffset === 0
  const selectedDate = format(subDays(new Date(), -selectedOffset), 'EEEE, MMM d')

  return (
    <div className="flex flex-col px-4 pt-5 pb-[110px] min-h-full">
      <h1 className="text-[22px] font-black tracking-tight text-ink mb-4">Exercise</h1>

      <WeekStrip
        isDone={isDone}
        selectedOffset={selectedOffset}
        onSelect={setSelectedOffset}
      />

      {/* Day label when viewing history */}
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

      {/* Today: editable form. Past: read-only summary. */}
      {isToday
        ? <WorkoutForm />
        : <PastDayView exerciseMin={exerciseMinForOffset(selectedOffset)} />
      }

      <div className="bg-card rounded-3xl p-5 shadow-card border border-black/[.03]">
        <ExerciseChart />
      </div>
    </div>
  )
}
