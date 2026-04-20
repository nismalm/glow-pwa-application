import { format, subDays } from 'date-fns'

export const todayKey = () => format(new Date(), 'yyyy-MM-dd')

export const weekRange = () => {
  const today = new Date()
  return {
    start: format(subDays(today, 6), 'yyyy-MM-dd'),
    end: format(today, 'yyyy-MM-dd'),
    today,
  }
}
