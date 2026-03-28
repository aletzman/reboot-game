import type { Level, LevelState } from '@/types/game'

export type Phase = 'intro' | 'quiz' | 'puzzle' | 'minigame' | 'summary'

export interface Question {
    id: string
    text: string
    options: string[]
    correctIndex: number
    concept: string // para el redirect si falla
}

export interface ReviewLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
    onStatusChange: (status: LevelState['status']) => void
}

export interface QuestionProps {
  question: Question
  currentQuestion: number
  totalQuestions: number
  showFeedback: number | null
  onAnswer: (index: number) => void
}
