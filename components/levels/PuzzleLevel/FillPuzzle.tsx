import { useState } from 'react'
import { PuzzleLevelProps, PuzzleData } from './types'
import { PuzzleWrapper } from './PuzzleWrapper'

export function FillPuzzle({ level, state, data, onComplete }: PuzzleLevelProps & { data: PuzzleData }) {
    const blanks = data.items.filter(i => i.blank)
    const [answers, setAnswers] = useState<Record<string, string>>(
        Object.fromEntries(blanks.map(b => [b.id, '']))
    )
    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
    const [attempts, setAttempts] = useState(0)
    const [wrongIds, setWrongIds] = useState<Set<string>>(new Set())

    function handleCheck() {
        const wrong = new Set<string>()
        blanks.forEach(item => {
            if (answers[item.id]?.trim() !== item.answer) wrong.add(item.id)
        })
        setAttempts(a => a + 1)
        if (wrong.size === 0) {
            setFeedback('correct')
            const stars = attempts === 0 ? 3 : attempts <= 2 ? 2 : 1
            setTimeout(() => onComplete(stars as 1 | 2 | 3, state.fragUsed), 800)
        } else {
            setFeedback('wrong')
            setWrongIds(wrong)
            setTimeout(() => { setFeedback('idle'); setWrongIds(new Set()) }, 1500)
        }
    }

    const allFilled = blanks.every(b => answers[b.id]?.trim())

    return (
        <PuzzleWrapper level={level} title="completar" onCheck={handleCheck} checkLabel="verificar" disabled={!allFilled}>
            <div className="flex flex-col gap-1.5">
                {data.items.map(item => {
                    if (!item.text) return <div key={item.id} className="h-2" />
                    if (!item.blank) {
                        return (
                            <div key={item.id} className="bg-(--bg-surface) border border-(--bg-hover) rounded-md px-3.5 py-2 font-mono text-xs text-(--text-muted)">
                                {item.text}
                            </div>
                        )
                    }
                    const parts = item.text.split('___')
                    const isWrong = wrongIds.has(item.id)
                    return (
                        <div key={item.id} className={`
                            bg-(--bg-surface) rounded-sm px-4 py-3 font-mono text-xs text-(--green-light) flex items-center flex-wrap gap-2 transition-all duration-200 border relative overflow-hidden
                            ${isWrong ? 'border-(--red) bg-[#1a0808]' : feedback === 'correct' ? 'border-(--green-base) bg-(--green-darkest)' : 'border-[#1a1f26]'}
                        `}>
                            {feedback === 'correct' && (
                                <div className="absolute inset-y-0 left-0 w-1 bg-(--green-base)" />
                            )}
                            <span className="text-(--text-muted) opacity-60">{parts[0]}</span>
                            <input
                                value={answers[item.id] ?? ''}
                                onChange={e => setAnswers(prev => ({ ...prev, [item.id]: e.target.value }))}
                                placeholder="?"
                                className={`
                                    bg-(--bg-elevated) rounded-xs px-3 py-1 font-mono text-xs text-(--green-light) w-24 outline-none border transition-all duration-200 placeholder:text-(--text-ghost)
                                    ${isWrong ? 'border-(--red) text-(--red)' : 'border-(--green-dark) focus:border-(--green-light) focus:shadow-[0_0_10px_rgba(85,226,0,0.1)]'}
                                `}
                            />
                            {parts[1] && <span className="text-(--text-muted)">{parts[1]}</span>}
                        </div>
                    )
                })}
            </div>
        </PuzzleWrapper>
    )
}
