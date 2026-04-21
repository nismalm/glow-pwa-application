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

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

export const signInAnon = () => signInAnonymously(auth)

export const signInGoogle = () =>
  isMobile
    ? signInWithRedirect(auth, googleProvider)
    : signInWithPopup(auth, googleProvider)

export const handleRedirectResult = () => getRedirectResult(auth)

export const signOutUser = () => firebaseSignOut(auth)
