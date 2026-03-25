import { Level, LevelState, TestCase, CodeEditorState } from '@/types/game'

export interface CodeEditorLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
}

export interface EditorLevelData {
    starterCode: string
    tests: Omit<TestCase, 'passed'>[]
    robotAPI: string
    maxLines?: number
}
