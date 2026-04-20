import { subDays, format } from 'date-fns'

export interface MoodDay {
  day: string
  mood: number | null
}

// Past 6 days only. Today is added dynamically in MoodChart using useMoodStore
// so the chart always reflects the current session's mood selection.
// Phase 6: replaced by a Firestore range query via useWeekData(weekStart)
const PAST_MOODS = [3, 4, 2, 5, 3, 4]

export const mockPastMoodLogs: MoodDay[] = Array.from({ length: 6 }, (_, i) => ({
  day: format(subDays(new Date(), 6 - i), 'EEE'),
  mood: PAST_MOODS[i],
}))
