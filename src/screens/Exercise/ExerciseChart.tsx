import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { mockWeekLogs } from '@/mocks/weekLogs'
import { useExerciseStore } from '@/stores/useExerciseStore'

export function ExerciseChart() {
  const { didWorkout, durationMin } = useExerciseStore()

  // Today (index 6) always comes from the live store so the chart stays in sync with the form.
  // Past days (index 0–5) come from mockWeekLogs (Phase 6: Firestore range query).
  const data = mockWeekLogs.map((d, i) => ({
    day: d.day,
    min: i === 6 ? (didWorkout ? durationMin : 0) : d.exerciseMin,
  }))

  return (
    <div>
      <h3 className="text-[15px] font-bold text-ink mb-4">This week</h3>
      <div className="h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="exGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff7a6b" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#ff7a6b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: '#a0a0a0', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#a0a0a0', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.1)', fontSize: 12 }}
              formatter={(v: number) => [`${v} min`, 'Exercise']}
            />
            <Area
              type="monotone"
              dataKey="min"
              stroke="#ff7a6b"
              strokeWidth={2}
              fill="url(#exGrad)"
              dot={{ r: 4, fill: '#ff7a6b', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#ff7a6b', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
