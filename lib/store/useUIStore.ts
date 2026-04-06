import { create } from 'zustand'

interface UIState {
    activeFragHint: string | null
    isDirectivesOpen: boolean
    activeTab: 'mission' | 'info' | null
    
    setActiveFragHint: (hint: string | null) => void
    setDirectivesState: (isOpen: boolean, tab?: 'mission' | 'info' | null) => void
    closeDirectives: () => void
}

export const useUIStore = create<UIState>((set) => ({
    activeFragHint: null,
    isDirectivesOpen: false,
    activeTab: null,
    
    setActiveFragHint: (hint) => set({ activeFragHint: hint }),
    setDirectivesState: (isOpen, tab = null) => set({ 
        isDirectivesOpen: isOpen, 
        activeTab: isOpen ? (tab || 'mission') : null 
    }),
    closeDirectives: () => set({ isDirectivesOpen: false, activeTab: null }),
}))
