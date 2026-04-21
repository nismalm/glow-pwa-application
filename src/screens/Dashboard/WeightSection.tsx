import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { useWeightStore } from '@/stores/useWeightStore'

export function WeightSection() {
  const entries = useWeightStore((s) => s.entries)
  const todayEntry = useWeightStore((s) => s.todayEntry)
  const logWeight = useWeightStore((s) => s.logWeight)

  const [kg, setKg] = useState('')
  const [error, setError] = useState('')

  const alreadyLoggedToday = !!todayEntry()
  const showPrompt = !alreadyLoggedToday
  const hasHistory = entries.length > 0

  function handleSave() {
    const value = parseFloat(kg)
    if (isNaN(value) || value < 20 || value > 300) {
      setError('Enter a valid weight (20–300 kg)')
      return
    }
    logWeight(value)
    setKg('')
    setError('')
  }

  const chartData = entries.map((e) => ({
    date: format(parseISO(e.date), 'MMM d'),
    kg: e.kg,
  }))

  const latest = entries[entries.length - 1]
  const prev = entries[entries.length - 2]
  const diff = latest && prev ? +(latest.kg - prev.kg).toFixed(1) : null

  return (
    <>
      {/* Weigh-in prompt */}
      {showPrompt && (
        <div className="bg-card rounded-[22px] p-[18px] shadow-card border border-black/[0.03] mb-3.5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">🏋️</span>
            <h3 className="text-[15px] font-bold text-ink">Time to weigh in!</h3>
          </div>
          <p className="text-[12px] text-ink-soft mb-3">
            Log your weight anytime — though logging every 7 days is where the real trends show up.
          </p>
          <div className="flex gap-2.5 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 border border-line rounded-2xl bg-bg px-4 py-3 focus-within:border-accent transition-colors">
                <input
                  type="number"
                  inputMode="decimal"
                  value={kg}
                  onChange={(e) => { setKg(e.target.value); setError('') }}
                  placeholder="e.g. 68.5"
                  className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-ink-mute outline-none"
                />
                <span className="text-[13px] font-semibold text-ink-soft">kg</span>
              </div>
              {error && <p className="text-[12px] text-coral mt-1.5 font-medium">{error}</p>}
            </div>
            <button
              onClick={handleSave}
              className="py-3 px-5 rounded-2xl bg-ink text-white text-[14px] font-bold active:scale-95 transition-transform flex-shrink-0"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Weight history chart */}
      {hasHistory && (
        <div className="bg-card rounded-[22px] p-[18px] shadow-card border border-black/[0.03] mb-3.5">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-[15px] font-bold text-ink">Weight history</h3>
              <p className="text-[12px] text-ink-soft">
                {latest ? `${latest.kg} kg` : '—'}
                {diff !== null && (
                  <span className={`ml-2 font-semibold ${diff < 0 ? 'text-ok' : diff > 0 ? 'text-coral' : 'text-ink-mute'}`}>
                    {diff > 0 ? `+${diff}` : diff} kg since last check-in
                  </span>
                )}
              </p>
            </div>
            <span className="text-xl">⚖️</span>
          </div>
          <div className="h-[140px] mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#cdde3f" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#cdde3f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f0f0f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#a0a0a0', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#a0a0a0', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,.1)', fontSize: 12 }}
                  formatter={(v: number) => [`${v} kg`, 'Weight']}
                />
                <Line
                  type="monotone"
                  dataKey="kg"
                  stroke="#a8b92f"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#a8b92f', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#cdde3f', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  )
}
