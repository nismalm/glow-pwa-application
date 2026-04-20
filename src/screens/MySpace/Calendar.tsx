import { useState, useMemo } from 'react'
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, addMonths, subMonths, isSameMonth, isSameDay, isToday,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTasksStore } from '@/stores/useTasksStore'
import { useRitualsStore } from '@/stores/useRitualsStore'

interface Props {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export function Calendar({ selectedDate, onDateSelect }: Props) {
  const [viewDate, setViewDate] = useState(selectedDate)

  const tasks = useTasksStore((s) => s.tasks)
  const completedCountForDate = useRitualsStore((s) => s.completedCountForDate)

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(viewDate))
    const end = endOfWeek(endOfMonth(viewDate))
    return eachDayOfInterval({ start, end })
  }, [viewDate])

  const taskDates = useMemo(() => {
    const set = new Set<string>()
    tasks.forEach((t) => set.add(format(t.dueAt, 'yyyy-MM-dd')))
    return set
  }, [tasks])

  function handleSelect(day: Date) {
    onDateSelect(day)
    // Keep view in sync if the user jumps to a day outside the current month
    if (!isSameMonth(day, viewDate)) setViewDate(day)
  }

  return (
    <div className="bg-card rounded-3xl shadow-card border border-black/[.03] p-5 mb-4">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[17px] font-bold text-ink">{format(viewDate, 'MMMM yyyy')}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewDate((d) => subMonths(d, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-bg active:bg-line transition-colors"
          >
            <ChevronLeft size={16} className="text-ink-soft" />
          </button>
          <button
            onClick={() => setViewDate((d) => addMonths(d, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-bg active:bg-line transition-colors"
          >
            <ChevronRight size={16} className="text-ink-soft" />
          </button>
        </div>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 mb-1">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="text-center text-[11px] font-semibold text-ink-mute py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd')
          const inMonth = isSameMonth(day, viewDate)
          const todayDay = isToday(day)
          const isSelected = isSameDay(day, selectedDate)
          const hasTask = taskDates.has(key)
          const hasRituals = completedCountForDate(key) > 0

          return (
            <button
              key={key}
              onClick={() => handleSelect(day)}
              className="flex flex-col items-center gap-[3px] py-[5px]"
            >
              <div className={`w-[30px] h-[30px] flex items-center justify-center rounded-full text-[13px] font-semibold transition-all ${
                todayDay && !isSelected
                  ? 'bg-ink text-card'
                  : isSelected
                  ? 'bg-accent text-ink'
                  : !inMonth
                  ? 'text-ink-mute/40'
                  : 'text-ink'
              }`}>
                {format(day, 'd')}
              </div>
              <div className="flex gap-[3px] h-[4px] items-center">
                {hasTask && inMonth && <div className="w-[4px] h-[4px] rounded-full bg-coral" />}
                {hasRituals && inMonth && <div className="w-[4px] h-[4px] rounded-full bg-lilac" />}
              </div>
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-3 pt-3 border-t border-line">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-coral" />
          <span className="text-[11px] text-ink-mute">Reminder</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-lilac" />
          <span className="text-[11px] text-ink-mute">Rituals done</span>
        </div>
      </div>
    </div>
  )
}
