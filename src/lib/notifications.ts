// Phase 6: replace scheduleNotification with FCM via Cloud Function trigger
// that reads users/{uid}/tasks/{taskId}.dueAt and sends push at that timestamp.

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function scheduleNotification(title: string, dueAt: Date): void {
  const msUntilDue = dueAt.getTime() - Date.now()
  if (msUntilDue <= 0) return

  // Only schedule same-session notifications (< 2 hours) with setTimeout.
  // For future dates the app relies on FCM (Phase 6).
  const TWO_HOURS = 2 * 60 * 60 * 1000
  if (msUntilDue > TWO_HOURS) return

  setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification('Glow Reminder', { body: title, icon: '/icons/icon-192.png' })
    }
  }, msUntilDue)
}
