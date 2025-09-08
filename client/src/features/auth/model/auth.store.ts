import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  accessToken: string | null
  setAccessToken: (t: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (t) => set({ accessToken: t }),
      logout: () => set({ accessToken: null })
    }),
    {
      name: 'auth-store'
    }
  )
)
