import { motion, AnimatePresence } from 'framer-motion'
import { useRitualsStore } from '@/stores/useRitualsStore'
import { useHaptic } from '@/hooks/useHaptic'
import type { RitualId } from '@/types/models'

const RITUALS: { id: RitualId; emoji: string; label: string }[] = [
  { id: 'meditate', emoji: '🧘', label: 'Meditate' },
  { id: 'study', emoji: '📚', label: 'Learning' },
  { id: 'gratitude', emoji: '🙏', label: 'Gratitude' },
  { id: 'read', emoji: '😌', label: 'Stay calm' },
  { id: 'skincare', emoji: '✨', label: 'Skincare' },
  { id: 'call', emoji: '👫', label: 'Connect with friends' },
]

export function RitualsList() {
  const rituals = useRitualsStore((s) => s.rituals)
  const toggle = useRitualsStore((s) => s.toggle)
  const haptic = useHaptic()

  function handleToggle(id: RitualId) {
    toggle(id)
    haptic()
  }

  return (
    <div className="bg-card rounded-3xl shadow-card border border-black/[.03] mb-4 overflow-hidden">
      {RITUALS.map((r, i) => {
        const done = rituals[r.id]
        return (
          <motion.button
            key={r.id}
            onClick={() => handleToggle(r.id)}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors active:bg-bg ${
              i < RITUALS.length - 1 ? 'border-b border-line' : ''
            }`}
          >
            {/* Checkbox */}
            <motion.div
              animate={done ? { backgroundColor: '#3ec97a', borderColor: '#3ec97a' } : { backgroundColor: 'transparent', borderColor: '#ececec' }}
              className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center"
              transition={{ duration: 0.15 }}
            >
              <AnimatePresence>
                {done && (
                  <motion.svg
                    key="check"
                    width="12" height="9" viewBox="0 0 12 9" fill="none"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.15 }}
                  >
                    <path
                      d="M1 4.5L4.5 8L11 1"
                      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.div>

            <span className="text-xl">{r.emoji}</span>

            <span className={`flex-1 text-[15px] font-semibold transition-all duration-200 ${
              done ? 'text-ink-mute line-through' : 'text-ink'
            }`}>
              {r.label}
            </span>

            <AnimatePresence>
              {done && (
                <motion.span
                  key="done-label"
                  className="text-ok text-[12px] font-bold"
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.15 }}
                >
                  Done
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )
      })}
    </div>
  )
}
