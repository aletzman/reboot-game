import { useState } from 'react'
import { PuzzleLevelProps, PuzzleData } from './types'
import { PuzzleWrapper } from './PuzzleWrapper'

export function BugPuzzle({ level, state, data, onComplete }: PuzzleLevelProps & { data: PuzzleData }) {
    const [selected, setSelected] = useState<number | null>(null)
    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
    const [attempts, setAttempts] = useState(0)

    function handleCheck() {
        if (selected === null) return
        setAttempts(a => a + 1)
        const isCorrect = data.items[selected]?.hasBug === true
        if (isCorrect) {
            setFeedback('correct')
            const stars = attempts === 0 ? 3 : attempts === 1 ? 2 : 1
            setTimeout(() => onComplete(stars as 1 | 2 | 3, state.fragUsed), 800)
        } else {
            setFeedback('wrong')
            setTimeout(() => { setFeedback('idle'); setSelected(null) }, 1200)
        }
    }

    return (
        <PuzzleWrapper
            level={level}
            title="encontrar bug"
            onCheck={handleCheck}
            checkLabel="esta línea tiene el bug"
            disabled={selected === null}
        >
            <div className="font-mono text-[11px] text-(--text-ghost) tracking-wide mb-4">
                // selecciona la línea con el error
            </div>

            <div className="bg-(--bg-deep) border border-[#1a1f26] rounded-sm overflow-hidden divide-y divide-[#1a1f26]">
                {data.items.map((item, idx) => {
                    if (!item.text) return (
                        <div key={item.id} className="h-4 bg-[#0a0c10]/50" />
                    )
                    const isSelected = selected === idx
                    const isCorrect = feedback === 'correct' && item.hasBug
                    const isWrong = feedback === 'wrong' && isSelected

                    return (
                        <div
                            key={item.id}
                            onClick={() => setSelected(idx)}
                            className={`
                                group px-4 py-3 font-mono text-xs flex gap-6 items-center cursor-pointer transition-all duration-200 select-none border-l-4
                                ${isCorrect
                                    ? 'text-(--green-light) bg-(--green-darkest) border-l-(--green-base) shadow-[inset_0_0_20px_rgba(45,120,0,0.1)]'
                                    : isWrong
                                        ? 'text-(--red) bg-[#1a0808] border-l-(--red)'
                                        : isSelected
                                            ? 'text-(--green-light) bg-(--bg-elevated) border-l-(--green-base)'
                                            : 'text-(--text-muted) bg-transparent border-l-transparent hover:bg-(--bg-surface) hover:text-(--text-primary)'}
                            `}
                        >
                            <span className={`text-[10px] min-w-[2ch] transition-colors ${isSelected || isCorrect ? 'text-(--green-light)' : 'text-(--text-ghost)'}`}>
                                {String(idx + 1).padStart(2, '0')}
                            </span>
                            <div className="flex-1 flex items-center justify-between">
                                <span>{item.text}</span>
                                {isSelected && !isCorrect && !isWrong && (
                                    <span className="text-[10px] text-(--green-base) animate-pulse px-2 py-0.5 border border-(--green-base)/30 rounded-xs bg-(--green-darkest)">
                                        MARCADA
                                    </span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {feedback === 'correct' && (
                <div className="font-mono text-[11px] text-(--green-light) text-center bg-(--green-darkest)/30 border border-(--green-base)/20 py-2 rounded-sm animate-pulse mt-4">
                    [ OK ] CORRUPCIÓN_DETECTADA // PARCHE_APLICADO
                </div>
            )}
            {feedback === 'wrong' && (
                <div className="font-mono text-[11px] text-(--red) text-center bg-(--red)/5 border border-(--red)/20 py-2 rounded-sm mt-4">
                    [ ERROR ] LÍNEA_INTEGRA // BUSCANDO_ANOMALÍA
                </div>
            )}
        </PuzzleWrapper>
    )
}
