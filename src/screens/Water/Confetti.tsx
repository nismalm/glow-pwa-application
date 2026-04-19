import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#cdde3f', '#ff7a6b', '#b8a4ff', '#5ec8ff', '#ffb347']

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: rand(10, 90),
  top: rand(20, 70),
  color: COLORS[i % COLORS.length],
  x: rand(-50, 50),
  y: rand(-120, -60),
  rotate: rand(-200, 200),
}))

export function Confetti() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1700)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      {particles.map(({ id, left, top, color, x, y, rotate }) => (
        <motion.span
          key={id}
          className="absolute block w-2 h-2 rounded-[2px]"
          style={{ left: `${left}%`, top: `${top}%`, backgroundColor: color }}
          initial={{ y: 0, x: 0, rotate: 0, opacity: 1, scale: 1 }}
          animate={{ y, x, rotate, opacity: 0, scale: 0.4 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}
