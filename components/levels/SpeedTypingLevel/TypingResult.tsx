'use client'

import { SpeedTypingState } from '@/types/game'

interface TypingResultProps {
    typingState: SpeedTypingState
}

export function TypingResult({ typingState }: TypingResultProps) {
    const correctCount = typingState.lines.filter(l => l.correct === true).length
    const totalCount = typingState.lines.length

    return (
        <div className="bg-(--bg-surface) border border-(--green-base) rounded-lg p-4 font-mono text-xs text-(--green-light) flex gap-8 justify-center flex-wrap">
            <div className="text-center">
                <div className="text-xl">{typingState.wpm}</div>
                <div className="text-[10px] text-(--text-ghost) tracking-widest uppercase">WPM</div>
            </div>
            <div className="text-center">
                <div className="text-xl text-(--amber)">{typingState.timeLeft}s</div>
                <div className="text-[10px] text-(--text-ghost) tracking-widest uppercase">restantes</div>
            </div>
            <div className="text-center">
                <div className="text-xl text-(--green-muted)">
                    {correctCount}/{totalCount}
                </div>
                <div className="text-[10px] text-(--text-ghost) tracking-widest uppercase">correctas</div>
            </div>
        </div>
    )
}
