import { useState, useEffect } from 'react'
import { Bell, BellOff } from 'lucide-react'
import { doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getFCMToken } from '@/lib/notifications'
import { useAuthStore } from '@/stores/useAuthStore'

export function NotificationToggle() {
  const clientId = useAuthStore((s) => s.clientId)
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [denied, setDenied] = useState(false)
  const supported = 'Notification' in window

  useEffect(() => {
    if (!clientId || !supported) return
    if (Notification.permission === 'denied') { setDenied(true); return }
    getDoc(doc(db, 'users', clientId))
      .then((snap) => {
        const prefs = snap.data()?.preferences
        setEnabled(prefs?.reminders === true && Notification.permission === 'granted')
      })
      .catch(console.error)
  }, [clientId, supported])

  const handleEnable = async () => {
    if (!clientId) return
    setLoading(true)
    try {
      const token = await getFCMToken()
      if (!token) {
        if (Notification.permission === 'denied') setDenied(true)
        return
      }
      await setDoc(
        doc(db, 'users', clientId),
        { fcmTokens: arrayUnion(token), preferences: { reminders: true } },
        { merge: true },
      )
      setEnabled(true)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDisable = async () => {
    if (!clientId) return
    setLoading(true)
    try {
      await setDoc(
        doc(db, 'users', clientId),
        { preferences: { reminders: false } },
        { merge: true },
      )
      setEnabled(false)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (!supported) return null

  return (
    <div className="bg-card rounded-3xl shadow-card border border-black/[.03] p-5 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              enabled ? 'bg-accent/20' : 'bg-bg'
            }`}
          >
            {enabled ? (
              <Bell size={18} className="text-ink" strokeWidth={2} />
            ) : (
              <BellOff size={18} className="text-ink-mute" strokeWidth={1.8} />
            )}
          </div>
          <div>
            <p className="text-[14px] font-bold text-ink leading-tight">Daily reminder</p>
            <p className="text-[12px] text-ink-soft mt-0.5">
              {denied
                ? 'Blocked in browser settings'
                : enabled
                ? 'Every day at 10 PM'
                : 'Get nudged to log your progress'}
            </p>
          </div>
        </div>

        {!denied && (
          <button
            onClick={enabled ? handleDisable : handleEnable}
            disabled={loading}
            className={`relative w-12 h-7 rounded-full transition-colors duration-200 disabled:opacity-50 ${
              enabled ? 'bg-accent' : 'bg-ink-mute/30'
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${
                enabled ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        )}
      </div>
    </div>
  )
}
