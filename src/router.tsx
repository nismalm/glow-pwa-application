import { Routes, Route, Navigate } from 'react-router-dom'
import TabBar from '@/app/TabBar'
import DashboardScreen from '@/screens/Dashboard'
import WaterScreen from '@/screens/Water'
import ExerciseScreen from '@/screens/Exercise'
import MySpaceScreen from '@/screens/MySpace'

export default function AppRouter() {
  return (
    // Max-width centers on desktop; full-width on mobile
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-bg relative">
      <main className="flex-1 overflow-y-auto overflow-x-hidden pt-6 pb-[100px]">
        <Routes>
          <Route path="/" element={<DashboardScreen />} />
          <Route path="/water" element={<WaterScreen />} />
          <Route path="/exercise" element={<ExerciseScreen />} />
          <Route path="/myspace" element={<MySpaceScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <TabBar />
    </div>
  )
}
