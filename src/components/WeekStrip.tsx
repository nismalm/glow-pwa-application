import { subDays, format } from 'date-fns'

interface Props {
  isDone?: (dayOffset: number) => boolean
  selectedOffset?: number
  onSelect?: (offset: number) => void
}

// Shows the last 7 days ending on today (offset 0 = today, offset -6 = 6 days ago).
// No future days. Past days are selectable.
export function WeekStrip({ isDone, selectedOffset = 0, onSelect }: Props) {
  const today = new Date()
  // offset goes from -6 (oldest) to 0 (today), left to right
  const days = Array.from({ length: 7 }, (_, i) => {
    const offset = i - 6 // -6, -5, ..., 0
    const date = subDays(today, -offset) // subDays(today, 6) for oldest
    const isToday = offset === 0
    const isSelected = offset === selectedOffset
    const done = !isToday && (isDone?.(offset) ?? false)
    return { offset, date, isToday, isSelected, done, dow: format(date, 'EEEEE'), dom: format(date, 'd') }
  })

  return (
    <div className="grid grid-cols-7 gap-1 bg-card rounded-[20px] p-2.5 shadow-card border border-black/[.03] mb-4">
      {days.map(({ offset, isToday, isSelected, done, dow, dom }) => (
        <button
          key={offset}
          onClick={() => onSelect?.(offset)}
          className="flex flex-col items-center py-2 rounded-2xl transition-colors active:bg-line/50"
        >
          <span
            className={`text-[10px] font-bold tracking-wide mb-1.5 uppercase ${
              isSelected ? 'text-ink' : 'text-ink-mute'
            }`}
          >
            {dow}
          </span>
          <div
            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-bold
              ${isSelected && isToday
                ? 'bg-accent border-accent text-[#1a2a00]'
                : isSelected
                ? 'bg-ink border-ink text-white'
                : done
                ? 'bg-ink/60 border-ink/60 text-white'
                : 'border-line text-ink-soft'
              }`}
          >
            {done && !isSelected ? '✓' : dom}
          </div>
        </button>
      ))}
    </div>
  )
}
