import { Level, LevelState, LogicAssemblyBlock, LogicAssemblyBlockType } from '@/types/game'

export interface LogicAssemblyLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
    onStatusChange: (status: LevelState['status']) => void
}

export interface BlockDef {
    type: LogicAssemblyBlockType
    label: string
    color: string
    border: string
    hasValue?: boolean
    valueType?: 'number' | 'direction' | 'text'
    valueDefault?: string | number
    hasChildren?: boolean
    valueOptions?: string[]
}

export interface MapData {
    grid: number[][] // 0: vacio, 1: muro, 2: nodo_energía, 3: inicio
    start: { x: number, y: number, dir: 'up' | 'down' | 'left' | 'right' }
    objective: { x: number, y: number }[]
}

export interface LogicAssemblyLevelData {
    availableBlocks: LogicAssemblyBlockType[]
    limitBlocks?: number
    maxBlocks: number
    hint: string
    validateFn: (blocks: LogicAssemblyBlock[]) => boolean
    map?: MapData
}
