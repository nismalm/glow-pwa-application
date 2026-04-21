import {
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from './firebase'

const googleProvider = new GoogleAuthProvider()

const isIOS =
  /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

// navigator.standalone is iOS-only; display-mode covers Android and desktop PWAs.
const isStandalonePWA =
  (navigator as { standalone?: boolean }).standalone === true ||
  window.matchMedia('(display-mode: standalone)').matches

export const signInAnon = () => signInAnonymously(auth)

// iOS PWA (standalone): signInWithRedirect leaves the WKWebView context — the
// redirect lands in Safari whose storage is isolated from the PWA, so the app
// never sees the auth state. signInWithPopup opens an in-app SFSafariViewController
// (iOS 16.4+) that stays in context and posts the result back correctly.
//
// iOS browser (non-standalone): signInWithRedirect is more reliable because
// window.open() on iOS Safari does not preserve window.opener across new tabs,
// so signInWithPopup's postMessage never arrives.
//
// Desktop: signInWithPopup is always fine.
export const signInGoogle = () =>
  isIOS && !isStandalonePWA
    ? signInWithRedirect(auth, googleProvider)
    : signInWithPopup(auth, googleProvider)

export const consumeRedirectResult = () => getRedirectResult(auth)

export const signOutUser = () => firebaseSignOut(auth)
