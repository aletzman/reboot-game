import { LogicAssemblyBlock, LogicAssemblyBlockType } from '@/types/game'
import { create } from 'zustand'

interface FlatInstruction {
    type: LogicAssemblyBlockType
    value?: string | number
    id: string
    stack?: string[]
}

interface LogicAssemblyDataState {
    program: LogicAssemblyBlock[]
    // Modificamos setProgram para que acepte el patrón de callback
    setProgram: (program: LogicAssemblyBlock[] | ((prev: LogicAssemblyBlock[]) => LogicAssemblyBlock[])) => void
    isExecuting: boolean
    setIsExecuting: (isExecuting: boolean) => void
    currentStep: number
    setCurrentStep: (currentStep: number) => void
    currentFlatInstruction: FlatInstruction
    setCurrentFlatInstruction: (currentFlatInstruction: FlatInstruction) => void
}

export const useLogicAssemblyData = create<LogicAssemblyDataState>((set) => ({
    program: [],

    // Implementación lógica:
    setProgram: (updater) => set((state) => ({
        program: typeof updater === 'function' ? updater(state.program) : updater
    })),

    isExecuting: false,
    setIsExecuting: (isExecuting) => set({ isExecuting }),
    currentStep: -1,
    setCurrentStep: (currentStep) => set({ currentStep }),
    currentFlatInstruction: { type: 'MOVER', value: 0, id: '' },
    setCurrentFlatInstruction: (currentFlatInstruction) => set({ currentFlatInstruction }),
}))