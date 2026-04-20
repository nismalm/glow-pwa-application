import { useState } from 'react'
import { format, setHours, setMinutes } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTasksStore } from '@/stores/useTasksStore'
import { scheduleNotification, requestNotificationPermission } from '@/lib/notifications'
import type { Task } from '@/types/models'

type Color = Task['color']
type Repeat = Task['repeat']

const COLORS: { value: Color; label: string; cls: string }[] = [
  { value: 'coral', label: 'Coral', cls: 'bg-coral' },
  { value: 'lilac', label: 'Lilac', cls: 'bg-lilac' },
  { value: 'sky', label: 'Sky', cls: 'bg-sky' },
  { value: 'accent', label: 'Lime', cls: 'bg-accent' },
]

const REPEATS: { value: Repeat; label: string }[] = [
  { value: 'none', label: 'Once' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
]

interface Props {
  date: Date
  onClose: () => void
}

export function AddReminderModal({ date, onClose }: Props) {
  const addTask = useTasksStore((s) => s.addTask)

  const [title, setTitle] = useState('')
  const [time, setTime] = useState('08:00')
  const [color, setColor] = useState<Color>('lilac')
  const [repeat, setRepeat] = useState<Repeat>('none')
  const [saving, setSaving] = useState(false)

  const canSave = title.trim().length > 0

  async function handleSave() {
    if (!canSave) return
    setSaving(true)

    const [h, m] = time.split(':').map(Number)
    const dueAt = setMinutes(setHours(date, h), m)

    const task: Task = {
      id: `task_${Date.now()}`,
      title: title.trim(),
      dueAt,
      color,
      repeat,
      done: false,
    }

    addTask(task)

    // Request permission and schedule if within 2-hour window; FCM handles future dates in Phase 6
    const granted = await requestNotificationPermission()
    if (granted) scheduleNotification(task.title, dueAt)

    setSaving(false)
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-md bg-card rounded-3xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        >
          {/* Scrollable body */}
          <div className="overflow-y-auto px-5 pt-5 pb-2">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-[18px] font-black text-ink">Add Reminder</h2>
              <p className="text-[12px] text-ink-soft mt-0.5">{format(date, 'EEEE, MMMM d')}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-bg"
            >
              <X size={16} className="text-ink-soft" />
            </button>
          </div>

          {/* Title */}
          <label className="block mb-4">
            <span className="text-[12px] font-semibold text-ink-soft uppercase tracking-wide mb-1.5 block">Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Evening walk"
              maxLength={60}
              className="w-full bg-bg rounded-2xl px-4 py-3 text-[15px] text-ink placeholder-ink-mute outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>

          {/* Time */}
          <label className="block mb-4">
            <span className="text-[12px] font-semibold text-ink-soft uppercase tracking-wide mb-1.5 block">Time</span>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-bg rounded-2xl px-4 py-3 text-[15px] text-ink outline-none focus:ring-2 focus:ring-accent/40"
            />
          </label>

          {/* Color */}
          <div className="mb-4">
            <span className="text-[12px] font-semibold text-ink-soft uppercase tracking-wide mb-2 block">Color</span>
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-2xl border-2 transition-all ${
                    color === c.value ? 'border-ink bg-bg' : 'border-transparent bg-bg'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full ${c.cls}`} />
                  <span className="text-[10px] font-semibold text-ink-soft">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Repeat */}
          <div className="mb-4">
            <span className="text-[12px] font-semibold text-ink-soft uppercase tracking-wide mb-2 block">Repeat</span>
            <div className="flex gap-2">
              {REPEATS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRepeat(r.value)}
                  className={`flex-1 py-2.5 rounded-2xl text-[13px] font-semibold transition-all ${
                    repeat === r.value
                      ? 'bg-ink text-card'
                      : 'bg-bg text-ink-soft'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          </div>{/* end scrollable body */}

          {/* Save — sticky footer */}
          <div className="px-5 py-4 border-t border-line">
            <button
              onClick={handleSave}
              disabled={!canSave || saving}
              className="w-full py-4 rounded-2xl bg-accent text-[15px] font-bold text-[#1a2a00] transition-all active:scale-[.98] disabled:opacity-40"
            >
              {saving ? 'Saving…' : 'Save Reminder'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
