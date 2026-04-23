importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: 'AIzaSyDvgdmHWYTobDrx5WNkIEkfGpxw-K_FgRI',
  authDomain: 'glow-progress-tracker.firebaseapp.com',
  projectId: 'glow-progress-tracker',
  storageBucket: 'glow-progress-tracker.firebasestorage.app',
  messagingSenderId: '957082477462',
  appId: '1:957082477462:web:a3688c7dae8c4656e873b7',
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? 'Glow'
  const body = payload.notification?.body ?? 'Time to log your progress!'
  self.registration.showNotification(title, {
    body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: { url: '/' },
  })
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/'
  event.waitUntil(clients.openWindow(url))
})
