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

// iPadOS reports as MacIntel with touch points — detect it explicitly.
const isIOS =
  /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

export const signInAnon = () => signInAnonymously(auth)

// iOS Safari opens window.open() as a new tab, not a popup, so window.opener
// is not preserved and the postMessage from the auth handler never arrives.
// signInWithRedirect is reliable on iOS because Firebase 12 stores redirect
// state in IndexedDB (not localStorage), which Safari's ITP does not clear.
export const signInGoogle = () =>
  isIOS
    ? signInWithRedirect(auth, googleProvider)
    : signInWithPopup(auth, googleProvider)

export const consumeRedirectResult = () => getRedirectResult(auth)

export const signOutUser = () => firebaseSignOut(auth)
