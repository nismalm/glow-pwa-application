import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { format, subDays } from 'date-fns'
import { db } from '@/lib/firebase'
import { useAuthStore } from '@/stores/useAuthStore'
import type { WeekDay, RitualId, Rituals } from '@/types/models'

function emptyWeek(): WeekDay[] {
  return Array.from({ length: 7 }, (_, i) => ({
    day: format(subDays(new Date(), 6 - i), 'EEE'),
    water: 0,
    exerciseMin: 0,
    ritualsCompleted: 0,
    mood: null,
    intensity: null,
  }))
}

export function useWeekData(): WeekDay[] {
  const user = useAuthStore((s) => s.user)
  const clientId = useAuthStore((s) => s.clientId)
  const [data, setData] = useState<WeekDay[]>(emptyWeek)

  useEffect(() => {
    if (!user || !clientId) return

    const today = new Date()
    const weekStart = format(subDays(today, 6), 'yyyy-MM-dd')
    const weekEnd = format(today, 'yyyy-MM-dd')

    const q = query(
      collection(db, 'users', clientId, 'dailyLogs'),
      where('date', '>=', weekStart),
      where('date', '<=', weekEnd),
      orderBy('date', 'asc'),
    )

    return onSnapshot(q, (snap) => {
      const logs = snap.docs.map((d) => d.data())
      const days: WeekDay[] = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(today, 6 - i)
        const dateStr = format(date, 'yyyy-MM-dd')
        const log = logs.find((l) => l['date'] === dateStr)
        const exercise = log?.['exercise'] as { durationMin?: number; intensity?: number } | null | undefined
        return {
          day: format(date, 'EEE'),
          water: (log?.['water'] as { glasses?: number } | undefined)?.glasses ?? 0,
          exerciseMin: exercise?.durationMin ?? 0,
          ritualsCompleted: log
            ? Object.values(
                (log['rituals'] as Rituals | undefined) ??
                  ({} as Record<RitualId, boolean>),
              ).filter(Boolean).length
            : 0,
          mood: (log?.['mood'] as number | null | undefined) ?? null,
          intensity: exercise?.intensity ?? null,
        }
      })
      setData(days)
    })
  }, [user, clientId])

  return data
}
