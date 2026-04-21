import { initializeApp } from 'firebase/app'
import {
  initializeAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  browserPopupRedirectResolver,
} from 'firebase/auth'
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore'

// On deployed environments, use the current hostname as authDomain so Firebase's
// /__/auth/iframe is same-origin. iOS Safari ITP blocks cross-origin iframe
// storage, which causes getRedirectResult to always return null when authDomain
// is firebaseapp.com but the app runs on a different domain.
// The vercel.json proxy forwards /__/auth/* to firebaseapp.com transparently.
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

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
})
