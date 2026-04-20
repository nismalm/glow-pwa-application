import { motion } from 'framer-motion'
import { useRitualsStore } from '@/stores/useRitualsStore'

const TOTAL = 6

function copyCopy(count: number) {
  if (count === TOTAL) return 'All rituals complete! 🌟'
  if (count >= 4) return 'Almost there, keep going ✨'
  if (count >= 2) return 'Good start, keep flowing 🌊'
  return 'Start your rituals 🌅'
}

export function RitualsHeader() {
  const completedCount = useRitualsStore((s) => s.completedCount())
  const pct = (completedCount / TOTAL) * 100

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-5 mb-4"
      style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2a3e 100%)' }}
    >
      <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-lilac/10 -translate-y-10 translate-x-10 pointer-events-none" />
      <p className="text-[12px] font-semibold text-white/40 uppercase tracking-widest mb-1">Daily Rituals</p>
      <h2 className="text-[30px] font-black text-white leading-none mb-1">
        {completedCount}
        <span className="text-white/30 font-light text-[22px]"> / {TOTAL}</span>
      </h2>
      <p className="text-[13px] text-white/55 mb-4">{copyCopy(completedCount)}</p>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-lilac"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
