import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface DebugState {
  debugMode: boolean
  toggleDebugMode: () => void
  setDebugMode: (value: boolean) => void
}

const COOKIE_NAME = 'reboot_debug_mode'

// Helper to set cookie
const setDebugCookie = (value: boolean) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=31536000; SameSite=Lax`
  }
}

export const useDebugStore = create<DebugState>()(
  persist(
    (set) => ({
      debugMode: false,
      toggleDebugMode: () => set((state) => {
        const newValue = !state.debugMode
        setDebugCookie(newValue)
        return { debugMode: newValue }
      }),
      setDebugMode: (value) => {
        setDebugCookie(value)
        set({ debugMode: value })
      },
    }),
    {
      name: 'reboot-debug-mode',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
        return (state, error) => {
            if (state && !error) {
                setDebugCookie(state.debugMode)
            }
        }
      }
    }
  )
)

// Helper to access state outside of React
export const isDebugModeActive = () => {
    if (typeof window === 'undefined') return false;
    return useDebugStore.getState().debugMode;
}
