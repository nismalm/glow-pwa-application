import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { signInGoogle, consumeRedirectResult } from '@/lib/auth'
import { useAuthStore } from '@/stores/useAuthStore'
import TabBar from '@/app/TabBar'
import FirestoreSync from '@/components/FirestoreSync'
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

function SignInScreen() {
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    setSigningIn(true)
    setError(null)
    try {
      await signInGoogle()
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? ''
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // user dismissed — no error needed
      } else if (code === 'auth/unauthorized-domain') {
        setError('This domain is not authorised in Firebase. Add it under Authentication → Settings → Authorized Domains.')
      } else if (code === 'auth/popup-blocked') {
        setError('Popup was blocked by your browser. Allow popups for this site and try again.')
      } else {
        setError((err as Error)?.message ?? 'Sign-in failed. Please try again.')
      }
      setSigningIn(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
      <div className="text-center mb-10">
        <div
          className="w-16 h-16 rounded-[20px] mx-auto mb-5 flex items-center justify-center text-3xl shadow-card"
          style={{ background: 'linear-gradient(135deg, #cdde3f 0%, #a8b92f 100%)' }}
        >
          ✨
        </div>
        <h1 className="text-[38px] font-black tracking-tight text-ink leading-none">Glow</h1>
        <p className="text-ink-soft text-[15px] mt-2">Your daily progress, beautifully.</p>
      </div>

      <div className="w-full max-w-sm bg-card rounded-[24px] p-6 shadow-card border border-black/[0.04]">
        <h2 className="text-[18px] font-black text-ink mb-1">Welcome 👋</h2>
        <p className="text-[13px] text-ink-soft mb-6">Sign in to access your personal dashboard.</p>

        <button
          onClick={handleSignIn}
          disabled={signingIn}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-[14px] border border-line bg-bg text-ink font-bold text-[15px] active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {signingIn ? (
            <div className="w-5 h-5 rounded-full border-2 border-ink border-t-transparent animate-spin" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {signingIn ? 'Signing in…' : 'Continue with Google'}
        </button>

        {error && (
          <p className="mt-4 text-[12px] text-coral leading-snug">{error}</p>
        )}
      </div>

      <p className="text-[11px] text-ink-mute mt-6 text-center max-w-xs">
        Your data is stored privately and only accessible to you.
      </p>
    </div>
  )
}

export default function AppRouter() {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)

  useEffect(() => {
    let unsub: (() => void) | undefined
    let cancelled = false

    consumeRedirectResult()
      .catch((err: { code?: string }) => {
        if (err?.code !== 'auth/no-auth-event') {
          console.warn('[auth] redirect result error:', err?.code ?? err)
        }
      })
      .finally(() => {
        if (cancelled) return
        unsub = onAuthStateChanged(auth, (firebaseUser) => {
          useAuthStore.getState().setUser(firebaseUser)
        })
      })

    return () => {
      cancelled = true
      unsub?.()
    }
  }, [])

  if (loading) return <LoadingScreen />
  if (!user) return <SignInScreen />

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
