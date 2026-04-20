import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BodyFigure } from './BodyFigure'
import { GlassGrid } from './GlassGrid'
import { Confetti } from './Confetti'

interface BadgeState {
  label: string
  cls: string
}

function getBadge(glasses: number, goal: number): BadgeState {
  if (glasses === 0) return { label: "Let's begin", cls: 'bg-[#f1efe9] text-ink-soft' }
  if (glasses < goal / 2) return { label: 'Great start', cls: 'bg-blue-50 text-water' }
  if (glasses < goal) return { label: 'Keep going!', cls: 'bg-ok/10 text-ok' }
  if (glasses === goal) return { label: '✓ Goal hit', cls: 'bg-ok/10 text-ok' }
  return { label: '🔥 Legend', cls: 'bg-accent/20 text-[#6a7400]' }
}

function getMotivator(glasses: number, goal: number): { title: string; sub: string } {
  if (glasses === 0) return { title: "Let's hydrate ✨", sub: 'Drink your first glass to begin' }
  if (glasses < goal / 2) return { title: 'Keep sipping 💧', sub: 'Little sips add up — keep going' }
  if (glasses < goal) return { title: 'Over halfway — you got this', sub: 'Almost there — a few more to go' }
  if (glasses === goal) return { title: 'Goal hit! 🎉', sub: 'You crushed it today — amazing!' }
  return { title: 'Overflow mode 🌊', sub: `${glasses - goal} extra ${glasses - goal === 1 ? 'glass' : 'glasses'} — legend mode!` }
}

interface SliderProps {
  value: number
  max: number
  onChange: (n: number) => void
}

function VerticalSlider({ value, max, onChange }: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  function compute(clientY: number) {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = 1 - (clientY - rect.top) / rect.height
    onChange(Math.round(Math.max(0, Math.min(1, pct)) * max))
  }

  function onPointerDown(e: React.PointerEvent) {
    e.preventDefault()
    dragging.current = true
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    compute(e.clientY)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return
    e.preventDefault()
    compute(e.clientY)
  }

  function onPointerUp() {
    dragging.current = false
  }

  const fillPct = Math.min(value / max, 1) * 100

  return (
    <div
      ref={trackRef}
      className="absolute right-1.5 top-1.5 bottom-1.5 w-2.5 bg-line rounded-full cursor-pointer select-none touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div
        className="absolute left-0 right-0 bottom-0 rounded-full bg-gradient-to-t from-accent-deep to-accent"
        style={{ height: `${fillPct}%`, transition: 'height .3s ease' }}
      />
      <div
        className="absolute -right-2 w-6 h-6 rounded-full bg-accent shadow-[0_4px_10px_rgba(0,0,0,.15)]"
        style={{ bottom: `calc(${fillPct}% - 12px)`, transition: 'bottom .3s ease' }}
      >
        <div className="absolute inset-[7px] rounded-full bg-white" />
      </div>
    </div>
  )
}

interface Props {
  glasses: number
  goal: number
  onSetGlasses?: (n: number) => void
  showConfetti: boolean
  readOnly?: boolean
}

export function WaterHero({ glasses, goal, onSetGlasses, showConfetti, readOnly = false }: Props) {
  const overflow = glasses >= goal
  const pct = Math.min(Math.round((glasses / goal) * 100), 200)
  const badge = getBadge(glasses, goal)
  const motivator = getMotivator(glasses, goal)

  const [pctKey, setPctKey] = useState(0)
  const prevGlasses = useRef(glasses)
  if (prevGlasses.current !== glasses) {
    prevGlasses.current = glasses
    setPctKey((k) => k + 1)
  }

  function handleGlassClick(index: number) {
    if (readOnly || !onSetGlasses) return
    onSetGlasses(index < glasses ? index : index + 1)
  }

  return (
    <div className="relative bg-card rounded-3xl p-[18px] shadow-card border border-black/[.03] mb-3.5 overflow-hidden">
      {showConfetti && <Confetti />}

      {/* header row */}
      <div className="flex items-start justify-between gap-2.5 mb-1.5">
        <div>
          <p className="text-[11px] font-bold tracking-widest text-ink-mute uppercase mb-1">Progress</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={pctKey}
              className="text-[44px] font-black leading-none tracking-[-1.5px]"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 0.35 }}
            >
              {pct}%
            </motion.div>
          </AnimatePresence>
          <p className="text-ink-soft text-[13px] mt-1">
            Goal: {goal} glasses · {glasses} of {goal}
          </p>
        </div>
        <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full mt-1 shrink-0 ${badge.cls}`}>
          {badge.label}
        </span>
      </div>

      {/* figure area */}
      <div className="relative flex justify-center items-start h-[260px] my-0.5">
        <BodyFigure glasses={glasses} goal={goal} overflow={overflow} />
        {!readOnly && onSetGlasses && (
          <VerticalSlider value={glasses} max={goal} onChange={onSetGlasses} />
        )}
      </div>

      {/* glass grid */}
      <div className="mt-3 mb-2">
        <GlassGrid glasses={glasses} goal={goal} onGlassClick={handleGlassClick} />
      </div>

      {/* motivator */}
      <div className="text-center py-2 pb-1">
        <p className="text-[15px] font-bold text-ink">{motivator.title}</p>
        <p className="text-[13px] text-ink-soft mt-0.5">{motivator.sub}</p>
      </div>
    </div>
  )
}
