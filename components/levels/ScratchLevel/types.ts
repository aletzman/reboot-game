import { Level, LevelState, ScratchBlock, ScratchBlockType } from '@/types/game'

export interface ScratchLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
}

export interface BlockDef {
    type: ScratchBlockType
    label: string
    color: string
    border: string
    hasValue?: boolean
    valueType?: 'number' | 'direction' | 'text'
    valueDefault?: string | number
    hasChildren?: boolean
    valueOptions?: string[]
}

export interface ScratchLevelData {
    availableBlocks: ScratchBlockType[]
    maxBlocks: number
    hint: string
    validateFn: (blocks: ScratchBlock[]) => boolean
}
