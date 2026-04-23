import { initializeApp } from 'firebase/app'
import {
  initializeAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserPopupRedirectResolver,
} from 'firebase/auth'
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore'
import { getMessaging, isSupported } from 'firebase/messaging'

// On deployed environments, use the current hostname as authDomain so Firebase's
// /__/auth/iframe is same-origin — iOS Safari ITP blocks cross-origin iframe
// storage, causing getRedirectResult to always return null otherwise.
// vercel.json proxies /__/auth/* to firebaseapp.com transparently.
const authDomain =
  window.location.hostname === 'localhost'
    ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
    : window.location.hostname

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app = initializeApp(config)

// indexedDB first — survives iOS Safari ITP and PWA relaunch better than localStorage.
// Explicit resolver prevents the lazy-load path that triggers payload errors on iOS.
export const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence],
  popupRedirectResolver: browserPopupRedirectResolver,
})

// Multi-tab manager: a PWA user commonly has the site open in Safari AND the
// installed PWA simultaneously. Default single-tab mode silently kills the
// listener in the "losing" tab, so remote writes never reach the UI on that
// device/tab. The multi-tab manager shares the IndexedDB lease so every tab
// keeps a live snapshot stream.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
})

// Resolves to Messaging instance or null (unsupported browsers / iOS Safari without PWA)
export const messagingPromise = isSupported().then((yes) => (yes ? getMessaging(app) : null))
