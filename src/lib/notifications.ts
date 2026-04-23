import { getToken } from 'firebase/messaging'
import { messagingPromise } from './firebase'

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export async function getFCMToken(): Promise<string | null> {
  try {
    const messaging = await messagingPromise
    if (!messaging) return null
    const granted = await requestNotificationPermission()
    if (!granted) return null
    return await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js'),
    })
  } catch {
    return null
  }
}

// In-session only scheduler for task reminders (< 2 hours). FCM handles longer-range delivery.
export function scheduleNotification(title: string, dueAt: Date): void {
  const msUntilDue = dueAt.getTime() - Date.now()
  if (msUntilDue <= 0) return
  const TWO_HOURS = 2 * 60 * 60 * 1000
  if (msUntilDue > TWO_HOURS) return
  setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification('Glow Reminder', { body: title, icon: '/icons/icon-192.png' })
    }
  }, msUntilDue)
}
