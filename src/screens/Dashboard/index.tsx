import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { useWaterStore } from '@/stores/useWaterStore'
import { useExerciseStore } from '@/stores/useExerciseStore'
import { useRitualsStore } from '@/stores/useRitualsStore'
import { useStreakStore } from '@/stores/useStreakStore'
import { mockWeekLogs } from '@/mocks/weekLogs'
import { mockUser } from '@/mocks/user'
import { getDailyQuote } from '@/mocks/quotes'

const TOTAL_RITUALS = 6
const EXERCISE_GOAL_MIN = 30
const CIRC = 94.25 // 2π × r(15)

function Ring({ pct, color, label }: { pct: number; color: string; label: string }) {
  const clamped = Math.min(pct, 100)
  const dash = (clamped / 100) * CIRC
  return (
    <div className="text-center">
      <div className="relative w-[72px] h-[72px] mx-auto mb-1.5">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="#eeeeee" strokeWidth="5" />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeDasharray={`${dash} ${CIRC}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-extrabold text-[13px] text-ink">
          {clamped}%
        </div>
      </div>
      <div className="text-[11px] text-ink-soft font-semibold">{label}</div>
    </div>
  )
}

export default function DashboardScreen() {
  const navigate = useNavigate()

  const { glasses, goal } = useWaterStore()
  const { durationMin, didWorkout } = useExerciseStore()
  const { completedCount } = useRitualsStore()
  const { count: streak, best: bestStreak } = useStreakStore()

  const ritualsCompleted = completedCount()
  const glassesLeft = Math.max(0, goal - glasses)

  // Replace today's slot (index 6) with live store values so chart stays accurate
  const chartData = mockWeekLogs.map((entry, i) =>
    i === 6
      ? { ...entry, water: glasses, exerciseMin: didWorkout ? durationMin : 0, ritualsCompleted }
      : entry,
  )

  const waterPct = Math.round((glasses / goal) * 100)
  const exercisePct = didWorkout ? Math.round((durationMin / EXERCISE_GOAL_MIN) * 100) : 0
  const ritualsPct = Math.round((ritualsCompleted / TOTAL_RITUALS) * 100)
  const overallPct = Math.round((waterPct + exercisePct + ritualsPct) / 3)

  const [greeting, setGreeting] = useState('')
  const [dateStr, setDateStr] = useState('')
  const [quote] = useState(() => getDailyQuote())

  useEffect(() => {
    const h = new Date().getHours()
    if (h < 12) setGreeting('Good morning')
    else if (h < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    const now = new Date()
    setDateStr(
      now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) +
        " · Let's make today count",
    )
  }, [])

  const statCards = [
    {
      label: 'WATER',
      value: `${glasses} / ${goal}`,
      trend: glassesLeft > 0 ? `${glassesLeft} glasses to go` : '✓ Goal hit!',
      blob: { background: 'radial-gradient(circle at 30% 30%, #bfe5ff, #5ec8ff)' },
    },
    {
      label: 'MOVEMENT',
      value: didWorkout ? `${durationMin} min` : 'Rest day',
      trend: didWorkout ? '▲ Great session!' : '🛌 Recovery counts',
      blob: { background: 'radial-gradient(circle at 30% 30%, #ffd8d1, #ff9a86)' },
    },
    {
      label: 'MY SPACE',
      value: `${ritualsCompleted} / ${TOTAL_RITUALS}`,
      trend:
        ritualsCompleted < TOTAL_RITUALS
          ? `${TOTAL_RITUALS - ritualsCompleted} more to go`
          : '✓ All done!',
      blob: { background: 'radial-gradient(circle at 30% 30%, #e3d9ff, #b8a4ff)' },
    },
    {
      label: 'STREAK',
      value: `${streak} ${streak === 1 ? 'day' : 'days'}`,
      trend: streak >= bestStreak ? '▲ Personal best!' : `Best: ${bestStreak} days`,
      blob: { background: 'radial-gradient(circle at 30% 30%, #e6f5a6, #cdde3f)' },
    },
  ]

  return (
    <div className="px-5 pt-1">
      {/* Greeting */}
      <div className="pt-1 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] text-ink-mute uppercase font-semibold tracking-wider">
              {greeting}
            </p>
            <h1 className="text-[28px] font-black tracking-tight mt-1.5 mb-1 leading-tight">
              Hi, {mockUser.displayName} <span className="text-[22px]">✨</span>
            </h1>
            <p className="text-[14px] text-ink-soft">{dateStr}</p>
          </div>
          <div
            className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center font-black text-base shadow-card"
            style={{ background: 'linear-gradient(135deg, #ffd3c9, #ffb0a0)', color: '#7a2e21' }}
          >
            {mockUser.avatarInitial}
          </div>
        </div>
      </div>

      {/* Quote */}
      <div
        className="relative rounded-[22px] p-[18px] mb-3.5 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #111 0%, #2a2a2a 100%)' }}
      >
        <div className="absolute -right-5 -top-5 w-[120px] h-[120px] rounded-full bg-accent opacity-25" />
        <p className="text-white text-[15px] leading-snug font-medium relative">"{quote}"</p>
        <p className="text-white/70 text-[12px] mt-2.5 relative">— A love note from today</p>
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3 mb-3.5">
        {statCards.map(({ label, value, trend, blob }) => (
          <div
            key={label}
            className="bg-card rounded-[20px] p-4 shadow-card border border-black/[0.03] relative overflow-hidden"
          >
            <div
              className="absolute -right-2.5 -bottom-2.5 w-[70px] h-[70px] rounded-full opacity-50"
              style={blob}
            />
            <p className="text-[12px] text-ink-soft font-semibold">{label}</p>
            <p className="text-[26px] font-black tracking-tight mt-1 leading-none">{value}</p>
            <p className="text-[11px] text-ok font-semibold mt-1.5">{trend}</p>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="bg-card rounded-[22px] p-[18px] shadow-card border border-black/[0.03] mb-3.5">
        <div className="flex items-start justify-between mb-2.5">
          <div>
            <h3 className="text-[15px] font-bold">This week</h3>
            <p className="text-[12px] text-ink-soft">Water · Exercise · My Space</p>
          </div>
        </div>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="30%" barGap={2}>
              <CartesianGrid vertical={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: '#999' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 10, fill: '#999' }} axisLine={false} tickLine={false} />
              <Bar dataKey="water" fill="#2aa7ff" radius={[4, 4, 0, 0]} />
              <Bar dataKey="exerciseMin" fill="#ff7a6b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ritualsCompleted" fill="#b8a4ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {[
            { color: '#2aa7ff', label: 'Water' },
            { color: '#ff7a6b', label: 'Exercise' },
            { color: '#b8a4ff', label: 'My Space' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-[12px] text-ink-soft">
              <div className="w-2.5 h-2.5 rounded-[3px]" style={{ background: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Today's rings */}
      <div className="bg-card rounded-[22px] p-[18px] shadow-card border border-black/[0.03] mb-3.5">
        <h3 className="text-[15px] font-bold">Today's rings</h3>
        <p className="text-[12px] text-ink-soft mb-2">A quick glance at everything</p>
        <div className="flex items-center justify-center gap-4 py-2">
          <Ring pct={waterPct} color="#2aa7ff" label="Water" />
          <Ring pct={exercisePct} color="#ff7a6b" label="Exercise" />
          <Ring pct={ritualsPct} color="#b8a4ff" label="My Space" />
          <Ring pct={overallPct} color="#a8b92f" label="Overall" />
        </div>
      </div>

      {/* CTA banner */}
      <div
        className="rounded-[22px] p-[18px] mb-3.5 flex items-center justify-between gap-2.5 shadow-card"
        style={{ background: 'linear-gradient(135deg, #cdde3f 0%, #a8b92f 100%)' }}
      >
        <div>
          <p className="font-black text-[15px] text-[#1a2a00]">
            {glassesLeft > 0
              ? glassesLeft === 1
                ? 'One last glass! 💧'
                : `${glassesLeft} glasses to go! 💧`
              : 'Water goal smashed! 🎉'}
          </p>
          <p className="text-[12px] mt-0.5 text-[#1a2a00]/80">
            {glassesLeft > 0
              ? `Finish your water to keep the ${streak}-day streak alive`
              : `You're on a ${streak}-day streak. Incredible!`}
          </p>
        </div>
        {glassesLeft > 0 ? (
          <button
            onClick={() => navigate('/water')}
            className="flex-shrink-0 bg-[#111] text-white px-3.5 py-2.5 rounded-xl text-[12px] font-bold active:scale-95 transition-transform"
          >
            Open
          </button>
        ) : (
          <span className="text-2xl">🌟</span>
        )}
      </div>
    </div>
  )
}
