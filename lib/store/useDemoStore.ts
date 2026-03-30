import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface DemoState {
  demoMode: boolean
  toggleDemoMode: () => void
  setDemoMode: (value: boolean) => void
}

const COOKIE_NAME = 'reboot_demo_mode'

// Helper to set cookie
const setDemoCookie = (value: boolean) => {
  if (typeof document !== 'undefined') {
    document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=31536000; SameSite=Lax`
  }
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      demoMode: false, // Initial value, will be hydrated
      toggleDemoMode: () => set((state) => {
        const newValue = !state.demoMode
        setDemoCookie(newValue)
        return { demoMode: newValue }
      }),
      setDemoMode: (value) => {
        setDemoCookie(value)
        set({ demoMode: value })
      },
    }),
    {
      name: 'reboot-demo-mode',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
          // Sync cookie on hydration if needed
          return (state, error) => {
              if (state && !error) {
                  setDemoCookie(state.demoMode)
              }
          }
      }
    }
  )
)

// Helper to access state outside of React
export const isDemoModeActive = () => useDemoStore.getState().demoMode
