import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface SettingsState {
    simulationSpeed: number
    setSimulationSpeed: (speed: number) => void
    // Futuros settings aquí
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            simulationSpeed: 1, // 1x, 2x, 4x, etc.
            setSimulationSpeed: (simulationSpeed) => set({ simulationSpeed }),
        }),
        {
            name: 'reboot_settings',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
