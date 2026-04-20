import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuthStore } from '@/stores/useAuthStore'

type Step = 'mobile' | 'name'

export default function OnboardingScreen() {
  const setClient = useAuthStore((s) => s.setClient)
  const user = useAuthStore((s) => s.user) // null until Firebase anon auth completes

  const [step, setStep] = useState<Step>('mobile')
  const [mobile, setMobile] = useState('')
  const [name, setName] = useState('')
  const [mobileError, setMobileError] = useState('')
  const [nameError, setNameError] = useState('')
  const [checking, setChecking] = useState(false)
  const [pendingDigits, setPendingDigits] = useState<string | null>(null)

  const sanitize = (v: string) => v.replace(/\D/g, '')

  // If auth wasn't ready when the user tapped "Get Started", retry once it is
  useEffect(() => {
    if (!user || !pendingDigits) return
    setPendingDigits(null)
    void lookup(pendingDigits)
  }, [user, pendingDigits])

  async function lookup(digits: string) {
    setChecking(true)
    try {
      // 5s timeout fallback — if Firestore is stuck (e.g. offline cache in a
      // bad state after logout), don't hang the UI. Fall through to name step.
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('lookup-timeout')), 5000),
      )
      const snap = await Promise.race([
        getDoc(doc(db, 'users', digits)),
        timeout,
      ])
      if (snap.exists()) {
        // Existing user — log them straight in with their stored name
        const storedName = (snap.data()?.displayName as string | undefined) ?? 'You'
        setClient(storedName, digits)
      } else {
        // New user — move to name step
        setStep('name')
      }
    } catch {
      // On any error (network, timeout, permission-denied) fall through to name step
      setStep('name')
    } finally {
      setChecking(false)
    }
  }

  function handleMobileSubmit(e: React.FormEvent) {
    e.preventDefault()
    const digits = sanitize(mobile)
    if (digits.length < 10) {
      setMobileError('Enter a valid mobile number (min 10 digits)')
      return
    }
    setMobileError('')
    if (!user) {
      // Auth still initialising — queue and wait
      setPendingDigits(digits)
      setChecking(true)
      return
    }
    void lookup(digits)
  }

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setNameError('Please enter your name')
      return
    }
    setClient(name.trim(), sanitize(mobile))
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
      {/* Branding */}
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

      {step === 'mobile' ? (
        /* ── Step 1: Mobile number ── */
        <form
          onSubmit={handleMobileSubmit}
          className="w-full max-w-sm bg-card rounded-[24px] p-6 shadow-card border border-black/[0.04]"
        >
          <h2 className="text-[18px] font-black text-ink mb-1">Welcome 👋</h2>
          <p className="text-[13px] text-ink-soft mb-6">
            Enter your mobile number to get started.
          </p>

          <div className="mb-6">
            <label className="block text-[12px] font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
              Mobile Number
            </label>
            <input
              type="tel"
              inputMode="numeric"
              value={mobile}
              autoFocus
              onChange={(e) => {
                setMobile(e.target.value)
                setMobileError('')
              }}
              placeholder="e.g. 9876543210"
              className="w-full rounded-[14px] border border-line bg-bg px-4 py-3 text-[15px] text-ink placeholder:text-ink-mute outline-none focus:border-accent transition-colors"
            />
            {mobileError && (
              <p className="text-[12px] text-coral mt-1.5 font-medium">{mobileError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={checking}
            className="w-full py-3.5 rounded-[14px] font-black text-[15px] text-[#1a2a00] active:scale-[0.98] transition-transform disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #cdde3f 0%, #a8b92f 100%)' }}
          >
            {checking ? 'Checking…' : 'Get Started →'}
          </button>
        </form>
      ) : (
        /* ── Step 2: Name (new users only) ── */
        <form
          onSubmit={handleNameSubmit}
          className="w-full max-w-sm bg-card rounded-[24px] p-6 shadow-card border border-black/[0.04]"
        >
          <button
            type="button"
            onClick={() => { setStep('mobile'); setChecking(false) }}
            className="text-[12px] font-semibold text-ink-soft mb-4 flex items-center gap-1 active:opacity-60"
          >
            ← Back
          </button>
          <h2 className="text-[18px] font-black text-ink mb-1">Almost there 🌟</h2>
          <p className="text-[13px] text-ink-soft mb-6">
            Looks like you're new here. What should we call you?
          </p>

          <div className="mb-6">
            <label className="block text-[12px] font-semibold text-ink-soft uppercase tracking-wider mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              autoFocus
              onChange={(e) => {
                setName(e.target.value)
                setNameError('')
              }}
              placeholder="e.g. Dilsath"
              className="w-full rounded-[14px] border border-line bg-bg px-4 py-3 text-[15px] text-ink placeholder:text-ink-mute outline-none focus:border-accent transition-colors"
            />
            {nameError && (
              <p className="text-[12px] text-coral mt-1.5 font-medium">{nameError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-[14px] font-black text-[15px] text-[#1a2a00] active:scale-[0.98] transition-transform"
            style={{ background: 'linear-gradient(135deg, #cdde3f 0%, #a8b92f 100%)' }}
          >
            Create Account →
          </button>
        </form>
      )}

      <p className="text-[11px] text-ink-mute mt-6 text-center max-w-xs">
        Your data is stored privately. Your mobile number is never shared.
      </p>
    </div>
  )
}
