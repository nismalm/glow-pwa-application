import { create } from 'zustand'
import type { User } from 'firebase/auth'
import { signOutUser } from '@/lib/auth'

interface AuthState {
  user: User | null
  loading: boolean
  clientId: string
  displayName: string
  avatarInitial: string
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  clientId: '',
  displayName: '',
  avatarInitial: '',
  setUser: (user) =>
    set({
      user,
      loading: false,
      clientId: user?.uid ?? '',
      displayName: user?.displayName ?? 'You',
      avatarInitial: (user?.displayName?.[0] ?? 'Y').toUpperCase(),
    }),
  setLoading: (loading) => set({ loading }),
  logout: () => {
    signOutUser().catch(console.warn)
    set({ user: null, loading: false, clientId: '', displayName: '', avatarInitial: '' })
  },
}))
