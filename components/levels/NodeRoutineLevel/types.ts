import type { Level, LevelState, Command, Direction, RobotState } from '@/types/game'

export interface NodeRoutineLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
}

export interface ExtendedRobotState extends RobotState {
    isJumping?: boolean
    isActivating?: boolean
    prevX?: number
    prevY?: number
    height?: number
    prevHeight?: number
}

export type FlatCommand = { cmd: Command; originalIdx: number; panel: 'main' | 'f1' }
