import { useState } from 'react'
import { RitualsHeader } from './RitualsHeader'
import { RitualsList } from './RitualsList'
import { Calendar } from './Calendar'
import { TaskList } from './TaskList'
import { MoodPicker } from './MoodPicker'
import { MoodChart } from './MoodChart'

export default function MySpaceScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <div className="flex flex-col px-4 pt-5 min-h-full">
      <h1 className="text-[22px] font-black tracking-tight text-ink mb-4">My Space ✨</h1>
      <RitualsHeader />
      <RitualsList />
      <Calendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      <TaskList selectedDate={selectedDate} />
      <MoodPicker />
      <MoodChart />
    </div>
  )
}
