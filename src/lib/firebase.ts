import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore'

// On production, use window.location.host as authDomain so the auth popup
// opens from the same origin as the app. Safari blocks cross-origin postMessage
// from the popup back to the opener, which causes signInWithPopup to silently
// fail when authDomain (firebaseapp.com) differs from the hosting domain (web.app).
// Firebase Hosting serves /__/auth/handler on all its domains, so this is safe.
const authDomain =
  typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? window.location.host
    : import.meta.env.VITE_FIREBASE_AUTH_DOMAIN

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app = initializeApp(config)
export const auth = getAuth(app)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
})
