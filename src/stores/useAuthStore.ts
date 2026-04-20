import { create } from 'zustand'
import type { User } from 'firebase/auth'

const STORAGE_KEY = 'glow_client'

export interface ClientSession {
  name: string
  mobile: string // digits only, used as Firestore doc key
}

function loadSession(): ClientSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ClientSession) : null
  } catch {
    return null
  }
}

function saveSession(session: ClientSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
}

interface AuthState {
  user: User | null
  loading: boolean
  clientId: string // mobile number used as Firestore path key
  displayName: string
  avatarInitial: string
  onboarded: boolean
  setUser: (user: User) => void
  setClient: (name: string, mobile: string) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

const storedSession = loadSession()

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  clientId: storedSession?.mobile ?? '',
  displayName: storedSession?.name ?? 'You',
  avatarInitial: storedSession ? storedSession.name[0].toUpperCase() : 'Y',
  onboarded: !!storedSession,
  setUser: (user) => set({ user, loading: false }),
  setClient: (name, mobile) => {
    saveSession({ name, mobile })
    set({
      clientId: mobile,
      displayName: name,
      avatarInitial: name[0].toUpperCase(),
      onboarded: true,
    })
  },
  setLoading: (loading) => set({ loading }),
  logout: () => {
    clearSession()
    set({
      user: null,
      loading: true,
      clientId: '',
      displayName: 'You',
      avatarInitial: 'Y',
      onboarded: false,
    })
  },
}))
