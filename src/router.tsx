import { useEffect, useState, useRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { toast } from 'sonner'
import { auth } from '@/lib/firebase'
import { signInGoogle, consumeRedirectResult } from '@/lib/auth'
import { useAuthStore } from '@/stores/useAuthStore'
import TabBar from '@/app/TabBar'
import FirestoreSync from '@/components/FirestoreSync'
import DashboardScreen from '@/screens/Dashboard'
import WaterScreen from '@/screens/Water'
import ExerciseScreen from '@/screens/Exercise'
import MySpaceScreen from '@/screens/MySpace'

// Shared debug log — visible on login screen so nothing is lost when toasts dismiss.
const debugLines: string[] = []
let notifyDebug: (() => void) | null = null

function log(msg: string) {
  const line = `${new Date().toISOString().slice(11, 23)} ${msg}`
  debugLines.push(line)
  if (debugLines.length > 20) debugLines.shift()
  console.log('[auth-debug]', line)
  notifyDebug?.()
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-full bg-bg">
      <div className="w-10 h-10 rounded-full border-4 border-accent border-t-transparent animate-spin" />
    </div>
  )
}

function DebugLog() {
  const [, setTick] = useState(0)
  useEffect(() => {
    notifyDebug = () => setTick((t) => t + 1)
    return () => { notifyDebug = null }
  }, [])

  return (
    <div className="mt-6 w-full max-w-sm">
      <p className="text-[10px] text-ink-mute mb-1 font-mono">Auth debug log</p>
      <div className="bg-black/80 rounded-xl p-3 font-mono text-[10px] text-green-400 leading-relaxed max-h-40 overflow-y-auto">
        {debugLines.length === 0
          ? <span className="text-white/40">waiting…</span>
          : debugLines.map((l, i) => <div key={i}>{l}</div>)
        }
      </div>
    </div>
  )
}

function SignInScreen() {
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    setSigningIn(true)
    setError(null)
    log('btn: tapped Continue with Google')
    toast.info('Redirecting to Google…')
    try {
      await signInGoogle()
      // On iOS signInWithRedirect navigates away — execution never reaches here.
      // On desktop signInWithPopup resolves here.
      log('btn: signInGoogle resolved (desktop popup path)')
      toast.success('Signed in!')
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? ''
      const message = (err as Error)?.message ?? ''
      log(`btn: error code=${code} msg=${message}`)

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        toast.info('Sign-in cancelled.')
      } else if (code === 'auth/unauthorized-domain') {
        const msg = 'Domain not authorised in Firebase (Auth → Settings → Authorized Domains).'
        setError(msg)
        toast.error(msg)
      } else if (code === 'auth/popup-blocked') {
        const msg = 'Popup blocked. Allow popups for this site.'
        setError(msg)
        toast.error(msg)
      } else {
        const msg = message || 'Sign-in failed. Please try again.'
        setError(msg)
        toast.error(`[${code || 'unknown'}] ${msg}`)
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

      <DebugLog />

      <p className="text-[11px] text-ink-mute mt-4 text-center max-w-xs">
        Your data is stored privately and only accessible to you.
      </p>
    </div>
  )
}

export default function AppRouter() {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const initDone = useRef(false)

  useEffect(() => {
    if (initDone.current) return
    initDone.current = true

    let unsub: (() => void) | undefined
    let cancelled = false

    log('init: calling consumeRedirectResult')

    consumeRedirectResult()
      .then((result) => {
        if (result?.user) {
          log(`redirect: OK — uid=${result.user.uid.slice(0, 8)} email=${result.user.email}`)
          toast.success(`Redirect sign-in OK — ${result.user.email}`)
        } else {
          log('redirect: no pending redirect (result=null)')
          toast.info('No pending redirect.')
        }
      })
      .catch((err: { code?: string; message?: string }) => {
        const code = err?.code ?? 'unknown'
        const msg = err?.message ?? ''
        if (code === 'auth/no-auth-event') {
          log('redirect: no-auth-event (expected on fresh load)')
        } else {
          log(`redirect: ERROR code=${code} msg=${msg}`)
          toast.error(`Redirect error [${code}]`, { duration: 15000 })
        }
      })
      .finally(() => {
        if (cancelled) return
        log('redirect: settled — subscribing onAuthStateChanged')
        unsub = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            log(`onAuthStateChanged: user uid=${firebaseUser.uid.slice(0, 8)} email=${firebaseUser.email}`)
            toast.success(`Signed in as ${firebaseUser.email}`)
          } else {
            log('onAuthStateChanged: null (no user)')
            toast.info('No authenticated user.')
          }
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
