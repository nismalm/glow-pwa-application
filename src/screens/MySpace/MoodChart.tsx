import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { useWeekData } from '@/hooks/useWeekData'
import { useMoodStore } from '@/stores/useMoodStore'

const MOOD_EMOJI: Record<number, string> = { 1: '😔', 2: '😐', 3: '🙂', 4: '😊', 5: '😄' }

export function MoodChart() {
  const mood = useMoodStore((s) => s.mood)
  const weekData = useWeekData()

  // Use live store value for today (index 6) so chart reflects current session immediately
  const chartData = weekData.map((d, i) => ({
    day: d.day,
    mood: i === 6 ? mood : d.mood,
  }))

  return (
    <div className="bg-card rounded-3xl shadow-card border border-black/[.03] p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-bold text-ink">Mood this week</h3>
        <span className="text-[20px]">{mood ? MOOD_EMOJI[mood] : '—'}</span>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={chartData} margin={{ top: 8, right: 4, bottom: 0, left: -28 }}>
          <defs>
            <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b8a4ff" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#b8a4ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#a0a0a0' }}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 3, 5]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: '#a0a0a0' }}
            tickFormatter={(v: number) => MOOD_EMOJI[v] ?? String(v)}
          />
          <Tooltip
            formatter={(v: number) => [MOOD_EMOJI[v] ?? v, 'Mood']}
            contentStyle={{
              background: '#fff',
              border: 'none',
              borderRadius: 12,
              fontSize: 12,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}
          />
          <Area
            type="monotone"
            dataKey="mood"
            stroke="#b8a4ff"
            strokeWidth={2.5}
            fill="url(#moodGrad)"
            connectNulls={false}
            dot={{ fill: '#b8a4ff', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#b8a4ff', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
