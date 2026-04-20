import { useEffect, useRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { signInAnon, signOutUser } from '@/lib/auth'
import { useAuthStore } from '@/stores/useAuthStore'
import TabBar from '@/app/TabBar'
import FirestoreSync from '@/components/FirestoreSync'
import OnboardingScreen from '@/components/OnboardingScreen'
import DashboardScreen from '@/screens/Dashboard'
import WaterScreen from '@/screens/Water'
import ExerciseScreen from '@/screens/Exercise'
import MySpaceScreen from '@/screens/MySpace'

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-full bg-bg">
      <div className="w-10 h-10 rounded-full border-4 border-accent border-t-transparent animate-spin" />
    </div>
  )
}

export default function AppRouter() {
  const onboarded = useAuthStore((s) => s.onboarded)
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)

  // Firebase anonymous auth — starts immediately so auth is ready before the form is submitted.
  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        signInAnon().catch((err) => {
          console.error('Sign-in failed:', err)
          useAuthStore.getState().setLoading(false)
        })
        return
      }
      useAuthStore.getState().setUser(firebaseUser)
    })
  }, [])

  // When the user logs out (onboarded flips false), sign out of Firebase so any
  // live onSnapshot listeners terminate cleanly, then sign in a fresh anonymous
  // user so the next Firestore read (getDoc in OnboardingScreen.lookup) has
  // valid auth. Without this, Firestore's offline persistence can enter an
  // error state after the permission-denied from the lingering listeners, and
  // subsequent reads hang — leaving the "Get Started" button stuck on "Checking…".
  const prevOnboarded = useRef(onboarded)
  useEffect(() => {
    const wasOnboarded = prevOnboarded.current
    prevOnboarded.current = onboarded

    if (wasOnboarded && !onboarded) {
      // Logout transition: tear down auth, then bring a fresh anon session up.
      // onAuthStateChanged above will observe the signOut (firebaseUser=null)
      // and kick off signInAnon on its own, so we only need to signOut here.
      signOutUser().catch((err) => {
        console.warn('signOut on logout failed:', err)
      })
    }
  }, [onboarded])

  // Step 1 — must complete onboarding
  if (!onboarded) {
    return <OnboardingScreen />
  }

  // Step 2 — wait for Firebase (usually already done by step 1)
  if (loading || !user) {
    return <LoadingScreen />
  }

  // Fully ready — render the app
  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-bg relative overflow-hidden">
      <FirestoreSync />
      <main className="flex-1 overflow-y-auto pt-6 pb-[116px]">
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
