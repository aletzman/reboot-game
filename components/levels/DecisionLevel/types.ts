import type { Level, LevelState } from '@/types/game'

export interface DecisionLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
}

export interface LanguageOption {
    id: string
    name: string
    status: 'active' | 'damaged'
    description: string
    detail: string
    year: string
}
