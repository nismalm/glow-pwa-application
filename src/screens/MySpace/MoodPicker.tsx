import { motion } from 'framer-motion'
import { useMoodStore } from '@/stores/useMoodStore'

const MOODS: { value: 1 | 2 | 3 | 4 | 5; emoji: string; label: string }[] = [
  { value: 1, emoji: '😔', label: 'Low' },
  { value: 2, emoji: '😐', label: 'Meh' },
  { value: 3, emoji: '🙂', label: 'Okay' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
]

export function MoodPicker() {
  const { mood, setMood } = useMoodStore()

  return (
    <div className="bg-card rounded-3xl shadow-card border border-black/[.03] p-5 mb-4">
      <h3 className="text-[15px] font-bold text-ink mb-3">How are you feeling today?</h3>
      <div className="flex gap-2">
        {MOODS.map((m) => {
          const selected = mood === m.value
          return (
            <motion.button
              key={m.value}
              onClick={() => setMood(m.value)}
              whileTap={{ scale: 0.9 }}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl border-2 transition-all ${
                selected ? 'border-lilac bg-lilac/10' : 'border-transparent bg-bg'
              }`}
            >
              <span className="text-[22px]">{m.emoji}</span>
              <span className={`text-[10px] font-semibold ${selected ? 'text-ink' : 'text-ink-mute'}`}>
                {m.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
