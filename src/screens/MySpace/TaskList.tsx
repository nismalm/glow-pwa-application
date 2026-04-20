import { useState } from 'react'
import { Bell, Plus } from 'lucide-react'
import { format, isToday, isTomorrow, isYesterday } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { useTasksStore } from '@/stores/useTasksStore'
import { AddReminderModal } from './AddReminderModal'

const COLOR_DOT: Record<string, string> = {
  coral: 'bg-coral',
  lilac: 'bg-lilac',
  sky: 'bg-sky',
  accent: 'bg-accent',
}

const REPEAT_LABEL: Record<string, string> = {
  none: 'Once',
  daily: 'Daily',
  weekly: 'Weekly',
}

function dateLabel(date: Date): string {
  if (isToday(date)) return "Today's Reminders"
  if (isTomorrow(date)) return "Tomorrow's Reminders"
  if (isYesterday(date)) return "Yesterday's Reminders"
  return `${format(date, 'MMM d')} Reminders`
}

interface Props {
  selectedDate: Date
}

export function TaskList({ selectedDate }: Props) {
  const tasks = useTasksStore((s) => s.tasks)
  const toggle = useTasksStore((s) => s.toggle)
  const [showModal, setShowModal] = useState(false)

  const dateStr = format(selectedDate, 'yyyy-MM-dd')
  const dateTasks = tasks
    .filter((t) => format(t.dueAt, 'yyyy-MM-dd') === dateStr)
    .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime())

  return (
    <>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[15px] font-bold text-ink">{dateLabel(selectedDate)}</h3>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 text-[12px] font-bold text-accent active:opacity-60 transition-opacity"
          >
            <Plus size={14} />
            Add reminder
          </button>
        </div>

        <AnimatePresence mode="wait">
          {dateTasks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-card rounded-3xl shadow-card border border-black/[.03] p-6 text-center"
            >
              <p className="text-[22px] mb-2">🔔</p>
              <p className="text-[14px] font-semibold text-ink mb-0.5">No reminders</p>
              <p className="text-[12px] text-ink-soft">Tap "+ Add reminder" to schedule one for this day</p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-card rounded-3xl shadow-card border border-black/[.03] overflow-hidden"
            >
              {dateTasks.map((task, i) => (
                <motion.button
                  key={task.id}
                  onClick={() => toggle(task.id)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-5 py-4 text-left active:bg-bg transition-colors ${
                    i < dateTasks.length - 1 ? 'border-b border-line' : ''
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${COLOR_DOT[task.color] ?? 'bg-ink-mute'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-[14px] font-semibold transition-all ${
                      task.done ? 'text-ink-mute line-through' : 'text-ink'
                    }`}>
                      {task.title}
                    </p>
                    <p className="text-[12px] text-ink-soft">
                      {format(task.dueAt, 'h:mm a')} · {REPEAT_LABEL[task.repeat]}
                    </p>
                  </div>
                  <Bell size={15} className={task.done ? 'text-ink-mute/40' : 'text-ink-mute'} />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showModal && (
        <AddReminderModal date={selectedDate} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}
