import {
  signInAnonymously,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from './firebase'

const googleProvider = new GoogleAuthProvider()

export const signInAnon = () => signInAnonymously(auth)
export const signInGoogle = () => signInWithPopup(auth, googleProvider)
export const signOutUser = () => firebaseSignOut(auth)
