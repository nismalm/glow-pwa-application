import {
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from './firebase'

const googleProvider = new GoogleAuthProvider()

export const signInAnon = () => signInAnonymously(auth)

// signInWithPopup works on all platforms including iOS Safari and installed PWAs.
// signInWithRedirect is avoided because Apple ITP wipes Firebase's redirect state
// in transit, causing "The requested action is invalid" errors on iOS.
export const signInGoogle = () => signInWithPopup(auth, googleProvider)

export const signOutUser = () => firebaseSignOut(auth)
