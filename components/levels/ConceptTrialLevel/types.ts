import { Level, LevelState } from '@/types/game'

export interface ConceptTrialLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
    onStatusChange: (status: LevelState['status'], reason?: LevelState['failReason'], context?: any) => void
}
