import { Level, LevelState, SpeedTypingState } from '@/types/game'

export interface SpeedTypingLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean, customContent?: React.ReactNode) => void
    onFragUse: () => void
}

export interface TypingLevelData {
    lines: string[]
    timeLimit: number
    bonusTimeFor3Stars: number
}
