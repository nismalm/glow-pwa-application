import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { signInAnon } from '@/lib/auth'
import { useAuthStore } from '@/stores/useAuthStore'
import OnboardingScreen from './OnboardingScreen'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, onboarded } = useAuthStore()

  // Start Firebase auth immediately — before onboarding is complete.
  // By the time the user finishes the form, anonymous auth is ready and the
  // transition to dashboard is instant with no spinner.
  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        signInAnon().catch((err) => {
          console.error('Anonymous sign-in failed:', err)
          useAuthStore.getState().setLoading(false)
        })
        return
      }
      useAuthStore.getState().setUser(firebaseUser)
    })
  }, [])

  // Step 1: must complete onboarding first
  if (!onboarded) return <OnboardingScreen />

  // Step 2: wait for Firebase auth (usually already done by this point)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg">
        <div className="w-10 h-10 rounded-full border-4 border-accent border-t-transparent animate-spin" />
      </div>
    )
  }

  // Step 3: auth failed entirely — fall back to onboarding
  if (!user) return <OnboardingScreen />

  return <>{children}</>
}
