'use client'

import { Level } from '@/types/game'
import { TypingLevelData } from './types'

interface TypingIntroProps {
    level: Level
    data: TypingLevelData
    onStart: () => void
}

export function TypingIntro({ level, data, onStart }: TypingIntroProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-(--bg-void) gap-8 p-8">
            <div className="text-center max-w-[480px]">
                <div className="font-mono text-[10px] text-(--green-base) tracking-widest mb-3">
                    {'//'} {level.title}
                </div>
                <div className="font-sans text-sm text-(--text-muted) leading-relaxed mb-6">
                    {level.description}
                </div>

                {/* Info del nivel */}
                <div className="flex justify-center gap-8 mb-8">
                    <div className="text-center">
                        <div className="font-mono text-[22px] text-(--green-light)">{data.timeLimit}s</div>
                        <div className="font-mono text-[10px] text-(--text-ghost) tracking-widest">tiempo límite</div>
                    </div>
                    <div className="text-center">
                        <div className="font-mono text-[22px] text-(--amber)">{data.lines.length}</div>
                        <div className="font-mono text-[10px] text-(--text-ghost) tracking-widest">líneas</div>
                    </div>
                    <div className="text-center">
                        <div className="font-mono text-[22px] text-(--purple)">+{data.bonusTimeFor3Stars}s</div>
                        <div className="font-mono text-[10px] text-(--text-ghost) tracking-widest">bonus ★★★</div>
                    </div>
                </div>

                <button
                    onClick={onStart}
                    className="bg-(--green-dark) border border-(--green-base) rounded-lg p-[13px_48px] font-mono text-[13px] text-(--green-light) cursor-pointer tracking-widest transition-colors hover:bg-(--green-base)"
                >
                    iniciar transmisión
                </button>
            </div>
        </div>
    )
}
