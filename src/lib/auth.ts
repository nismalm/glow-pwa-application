import {
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  browserPopupRedirectResolver,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from './firebase'

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

const isIOS =
  /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

// All iOS browsers (Safari, Chrome-on-iOS = WKWebView, in-app browsers, and
// standalone PWA) sever window.opener via COOP, so popup's postMessage never
// arrives. signInWithRedirect is the only reliable path on any iOS context.
// Desktop (Mac/Windows/Linux) handles popup correctly.
const shouldUseRedirect = isIOS

export const signInAnon = () => signInAnonymously(auth)

export const signInGoogle = () =>
  shouldUseRedirect
    ? signInWithRedirect(auth, googleProvider, browserPopupRedirectResolver)
    : signInWithPopup(auth, googleProvider, browserPopupRedirectResolver)

// Explicit resolver avoids lazy-loading, which prevents the undefined.payload
// error inside Firebase's core.js on iOS redirect returns.
export const consumeRedirectResult = () =>
  getRedirectResult(auth, browserPopupRedirectResolver)

export const signOutUser = () => firebaseSignOut(auth)
