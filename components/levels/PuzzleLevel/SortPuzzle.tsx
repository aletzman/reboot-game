import { useState } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { GripVertical } from 'lucide-react'
import { PuzzleLevelProps, PuzzleData, PuzzleItem } from './types'
import { PuzzleWrapper } from './PuzzleWrapper'
import { move, SyntaxHighlighter } from './utils'

function SortableItem({ item, idx, feedback }: { item: PuzzleItem, idx: number, feedback: 'idle' | 'correct' | 'wrong' }) {
    const { ref, isDragging, isDropTarget } = useSortable({
        id: item.id,
        index: idx
    })

    return (
        <div
            ref={ref}
            className={`
                group rounded-sm font-mono text-xs text-(--green-light) cursor-grab flex items-stretch select-none transition-all duration-200 border overflow-hidden h-[46px]
                ${isDragging ? 'opacity-50 scale-[0.98] z-50 border-(--green-light) shadow-[0_0_20px_rgba(85,226,0,0.2)]' : ''}
                ${isDropTarget ? 'border-(--green-muted) bg-(--bg-hover) translate-y-1' : ''}
                ${feedback === 'correct'
                    ? 'bg-(--green-darkest) border-(--green-base) shadow-[0_0_15px_rgba(45,120,0,0.2)]'
                    : feedback === 'wrong'
                        ? 'bg-[#1a0808] border-(--red) shadow-[0_0_15px_rgba(226,75,74,0.1)]'
                        : 'bg-(--bg-surface) border-(--text-ghost)/50 hover:border-(--green-dark) shadow-[0_2px_4px_rgba(0,0,0,0.2)]'}
            `}
        >
            <div className={`
                flex items-center justify-center px-2 border-r transition-colors w-8
                ${feedback === 'correct' ? 'bg-(--green-dark) border-(--green-base)' :
                    feedback === 'wrong' ? 'bg-(--red)/10 border-(--red)/30' :
                        'bg-(--bg-elevated) border-(--text-ghost)/50 group-hover:border-(--green-dark)'}
            `}>
                <GripVertical size={14} className="opacity-20 group-hover:opacity-60 transition-opacity" />
            </div>

            <div className="flex-1 py-3 px-4 bg-linear-to-r from-transparent to-(--bg-deep)/30 flex items-center">
                <SyntaxHighlighter text={item.text.trimStart()} />
            </div>

            <div className="w-1 bg-(--green-light) opacity-0 group-hover:opacity-20 transition-opacity" />
        </div>
    )
}

export function SortPuzzle({ level, state, data, onComplete }: PuzzleLevelProps & { data: PuzzleData }) {
    const [items, setItems] = useState([...data.items].sort(() => Math.random() - 0.5))
    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
    const [attempts, setAttempts] = useState(0)

    const handleDragEnd = (event: any) => {
        setItems((items) => move(items, event))
    }

    function handleCheck() {
        const correct = items.every((item, i) => item.id === data.items[i].id)
        setAttempts(a => a + 1)
        if (correct) {
            setFeedback('correct')
            const stars = attempts === 0 ? 3 : attempts === 1 ? 2 : 1
            setTimeout(() => onComplete(stars as 1 | 2 | 3, state.fragUsed), 800)
        } else {
            setFeedback('wrong')
            setTimeout(() => setFeedback('idle'), 1200)
        }
    }

    return (
        <PuzzleWrapper level={level} title="ordenar" onCheck={handleCheck} checkLabel="verificar orden">
            <div className="flex gap-2">
                <div className="flex flex-col gap-2">
                    {items.map((_, idx) => (
                        <div
                            key={idx}
                            className={`
                                flex items-center justify-center w-10 h-[46px] font-mono text-[11px] font-bold border-r border-(--border-color) bg-(--bg-elevated)/20 transition-all duration-300
                                ${feedback === 'correct' ? 'text-(--green-light) border-(--green-base) bg-(--green-darkest)' : 'text-(--text-ghost)'}
                            `}
                        >
                            {String(idx + 1).padStart(2, '0')}
                        </div>
                    ))}
                </div>

                <DragDropProvider onDragEnd={handleDragEnd}>
                    <div className="flex flex-col gap-2 flex-1">
                        {items.map((item, idx) => (
                            <SortableItem key={item.id} item={item} idx={idx} feedback={feedback} />
                        ))}
                    </div>
                </DragDropProvider>
            </div>
            {feedback === 'correct' && (
                <div className="font-mono text-[11px] text-(--green-light) text-center bg-(--green-darkest)/30 border border-(--green-base)/20 py-2 rounded-sm animate-pulse mt-4">
                    [ OK ] SECUENCIA_CORRECTA // REGISTRADA
                </div>
            )}
            {feedback === 'wrong' && (
                <div className="font-mono text-[11px] text-(--red) text-center bg-(--red)/5 border border-(--red)/20 py-2 rounded-sm mt-4">
                    [ ERROR ] ORDEN_INCORRECTO // REINTENTAR
                </div>
            )}
        </PuzzleWrapper>
    )
}
