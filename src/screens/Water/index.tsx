import { useEffect, useRef, useState } from 'react'
import { format, subDays } from 'date-fns'
import { useWaterStore } from '@/stores/useWaterStore'
import { useStreakStore } from '@/stores/useStreakStore'
import { mockWeekLogs } from '@/mocks/weekLogs'
import { WeekStrip } from '@/components/WeekStrip'
import { WaterHero } from './WaterHero'
import { useHaptic } from '@/hooks/useHaptic'

// Returns the water glasses for a given day offset (0 = today from store, negative = from mock history).
function useWaterForOffset(offset: number, todayGlasses: number, goal: number) {
  if (offset === 0) return { glasses: todayGlasses, goal, readOnly: false }
  // offset -1 → mockWeekLogs[5], offset -6 → mockWeekLogs[0]
  const idx = 6 + offset
  const glasses = mockWeekLogs[idx]?.water ?? 0
  return { glasses, goal, readOnly: true }
}

export default function WaterScreen() {
  const { glasses, goal, increment, decrement, setGlasses } = useWaterStore()
  const streak = useStreakStore()
  const haptic = useHaptic()

  const [selectedOffset, setSelectedOffset] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const prevGlassesRef = useRef(glasses)

  // Only trigger confetti when on today's view and goal is freshly hit
  useEffect(() => {
    if (selectedOffset !== 0) return
    const prev = prevGlassesRef.current
    prevGlassesRef.current = glasses
    if (prev < goal && glasses === goal) {
      setShowConfetti(true)
      const t = setTimeout(() => setShowConfetti(false), 2000)
      return () => clearTimeout(t)
    }
  }, [glasses, goal, selectedOffset])

  function handleAdd() {
    increment()
    haptic()
  }

  function handleRemove() {
    decrement()
    haptic()
  }

  function isDone(dayOffset: number) {
    if (dayOffset === 0) return glasses >= goal
    const idx = 6 + dayOffset
    return (mockWeekLogs[idx]?.water ?? 0) >= goal
  }

  const { glasses: displayGlasses, readOnly } = useWaterForOffset(selectedOffset, glasses, goal)

  const selectedDate =
    selectedOffset === 0
      ? 'Today'
      : format(subDays(new Date(), -selectedOffset), 'EEEE, MMM d')

  return (
    <div className="flex flex-col px-4 pt-5 pb-[110px] min-h-full">
      <h1 className="text-[22px] font-black tracking-tight text-ink mb-4">Stay Hydrated</h1>

      <WeekStrip
        isDone={isDone}
        selectedOffset={selectedOffset}
        onSelect={setSelectedOffset}
      />

      {/* day label when viewing history */}
      {selectedOffset !== 0 && (
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[13px] font-semibold text-ink-soft">
            📅 Viewing {selectedDate}
          </span>
          <button
            onClick={() => setSelectedOffset(0)}
            className="text-[12px] font-bold text-water"
          >
            Back to today
          </button>
        </div>
      )}

      <WaterHero
        glasses={displayGlasses}
        goal={goal}
        onSetGlasses={readOnly ? undefined : setGlasses}
        showConfetti={showConfetti && !readOnly}
        readOnly={readOnly}
      />

      {/* action buttons — only on today's view */}
      {!readOnly && (
        <div className="flex gap-2.5 mb-3.5">
          <button
            onClick={handleRemove}
            disabled={glasses === 0}
            className="flex-1 py-[14px] rounded-2xl border border-line bg-card text-[14px] font-bold text-ink
              active:scale-[.97] transition-transform disabled:opacity-40"
          >
            − Remove
          </button>
          <button
            onClick={handleAdd}
            disabled={glasses >= 20}
            className="flex-1 py-[14px] rounded-2xl bg-accent text-[14px] font-bold text-[#1a2a00]
              active:scale-[.97] transition-transform disabled:opacity-40"
          >
            + Add a glass
          </button>
        </div>
      )}

      {/* daily goal card */}
      <div className="bg-card rounded-3xl p-5 shadow-card border border-black/[.03]">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-ink">Daily goal</h3>
            <p className="text-ink-soft text-[13px] mt-0.5">
              Target: {goal} glasses · exceed it for bonus 🌟
            </p>
          </div>
          <span className="text-[12px] font-bold bg-[#f1efe9] text-ink-soft px-3 py-1.5 rounded-full whitespace-nowrap">
            🔥 {streak.count}-day streak
          </span>
        </div>
      </div>
    </div>
  )
}
