import { useState } from 'react'
import { DragDropProvider, useDraggable, useDroppable } from '@dnd-kit/react'
import { Link2, OctagonAlert, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PuzzleLevelProps, PuzzleData, CONNECTION_COLORS, MATCH_RIGHT } from './types'
import { PuzzleWrapper } from './PuzzleWrapper'

function MatchItem({ id, text, isSelected, isConnected, isCorrect, isWrong, onClick, isRight = false, selectedLeft = false, isConnectedTo = false, relationColor, isHinted = false }: any) {
    const draggable = useDraggable({ id })
    const droppable = useDroppable({ id })

    const connectionStyles = (isConnected || isConnectedTo) && relationColor ? {
        borderColor: relationColor,
        color: relationColor,
        boxShadow: `inset 0 0 10px ${relationColor}10`
    } : {}

    return (
        <div
            ref={(node) => {
                draggable.ref(node)
                droppable.ref(node)
            }}
            onClick={onClick}
            style={connectionStyles}
            className={`
                rounded-sm px-4 py-3 font-mono text-xs flex items-center justify-between gap-3 cursor-pointer transition-all duration-200 select-none border relative overflow-hidden
                ${draggable.isDragging ? 'opacity-50 z-50 scale-105 border-(--green-light)' : ''}
                ${droppable.isDropTarget ? 'ring-2 ring-(--green-muted) bg-(--bg-hover)' : ''}
                ${isCorrect
                    ? 'bg-(--green-darkest) border-(--green-base) text-(--green-light) shadow-[0_0_10px_rgba(45,120,0,0.15)]'
                    : isSelected
                        ? 'bg-(--bg-elevated) border-(--green-light) text-(--green-light) ring-1 ring-(--green-light)/20'
                        : isHinted
                            ? 'bg-(--purple)/10 border-(--purple) text-(--purple) shadow-[0_0_10px_rgba(127,119,221,0.2)]'
                            : isWrong
                                ? 'bg-[#1a0808] border-(--red) text-(--red)'
                                : isConnectedTo || isConnected
                                    ? 'bg-(--bg-elevated)/40 border-l-4'
                                    : isRight && selectedLeft
                                        ? 'bg-(--bg-deep) border-(--green-dark) text-(--text-primary) hover:border-(--green-light) shadow-[inset_0_0_10px_rgba(45,120,0,0.05)]'
                                        : 'bg-(--bg-deep) border-[#1a1f26] text-(--text-muted) hover:border-(--green-dark) hover:text-(--green-muted)'}
                ${isRight && !selectedLeft && !isConnectedTo ? 'cursor-default opacity-50' : 'cursor-pointer'}
            `}
        >
            {isHinted && <div className="absolute inset-0 bg-(--purple)/10 animate-pulse pointer-events-none" />}
            {isSelected && <div className="absolute inset-0 bg-(--green-light) opacity-5 animate-pulse" />}
            <span className="relative z-10 text-sm">{text}</span>
            {(isConnected || isConnectedTo) && (
                <span
                    className="text-[10px] animate-pulse relative z-10 font-bold"
                    style={{ color: relationColor || 'var(--green-base)' }}
                >
                    <Link2 size={15} />
                </span>
            )}
        </div>
    )
}

export function MatchPuzzle({ level, state, data, onComplete }: PuzzleLevelProps & { data: PuzzleData }) {
    const rightItems = MATCH_RIGHT[level.id] ?? []
    const [shuffledRight] = useState(() => [...rightItems].sort(() => Math.random() - 0.5))
    const [connections, setConnections] = useState<Record<string, string>>({})
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
    const [correctCount, setCorrectCount] = useState(0)
    const [attempts, setAttempts] = useState(0)

    function handleLeftClick(id: string) {
        setSelectedLeft(prev => prev === id ? null : id)
    }

    function handleRightClick(rightId: string) {
        if (!selectedLeft) return
        setConnections(prev => ({ ...prev, [selectedLeft]: rightId }))
        setSelectedLeft(null)
    }

    const handleDragEnd = (event: any) => {
        const { operation } = event
        const { source, target } = operation
        if (target) {
            const isLeft = data.items.some(i => i.id === source.id)
            const isRight = shuffledRight.some(i => i.id === target.id)

            if (isLeft && isRight) {
                setConnections(prev => ({ ...prev, [source.id as string]: target.id as string }))
                setSelectedLeft(null)
            }
        }
    }

    function handleCheck() {
        if (!data.pairs) return

        let correct = 0
        data.pairs.forEach(pair => {
            if (connections[pair.leftId] === pair.rightId) correct++
        })

        setCorrectCount(correct)
        setAttempts(a => a + 1)

        if (correct === data.pairs.length) {
            setFeedback('correct')
            const stars = attempts === 0 ? 3 : attempts === 1 ? 2 : 1
            setTimeout(() => onComplete(stars as 1 | 2 | 3, state.fragUsed), 2000)
        } else {
            setFeedback('wrong')
            setTimeout(() => { setFeedback('idle') }, 3000)
        }
    }

    function handleReset() {
        setConnections({})
        setSelectedLeft(null)
        setFeedback('idle')
        setCorrectCount(0)
        setAttempts(0)
    }

    const allConnected = data.items.every(item => connections[item.id])

    return (
        <PuzzleWrapper
            level={level}
            title="emparejar"
            onCheck={handleCheck}
            checkLabel="verificar pares"
            disabled={!allConnected}
        >
            <div className="font-mono text-[12px] text-(--green-muted) tracking-[.15em] mb-4 flex items-center justify-between opacity-80 border-b border-(--bg-hover) pb-2 transition-all">
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${Object.keys(connections).length === data.items.length ? 'bg-(--green-light) shadow-[0_0_8px_var(--green-light)]' : 'bg-(--green-dark) animate-pulse'}`} />
                    MAPEO_RELACIONAL // {Object.keys(connections).length}/{data.items.length}
                    {state.fragUsed && <span className="text-(--purple) text-[10px] ml-2 animate-pulse font-bold tracking-[.3em]">/// ASISTENCIA_ACTIVA</span>}
                </div>
                <Button onClick={handleReset} size='xs' variant='outline' icon={RefreshCw}>
                    REINICIAR
                </Button>
            </div>

            <DragDropProvider onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        {data.items.map((item, idx) => {
                            const isSelected = selectedLeft === item.id
                            const isConnected = !!connections[item.id]
                            const isCorrect = feedback === 'correct' && isConnected
                            const relationColor = isConnected ? CONNECTION_COLORS[idx % CONNECTION_COLORS.length] : null
                            
                            // Ayuda de FRAG: resaltar el primer par correcto que NO esté conectado (o el primero si no hay ninguno)
                            const firstPair = data.pairs?.[0]
                            const isHinted = state.fragUsed && firstPair?.leftId === item.id && !isConnected

                            return (
                                <MatchItem
                                    key={item.id}
                                    id={item.id}
                                    text={item.text}
                                    isSelected={isSelected}
                                    isConnected={isConnected}
                                    isCorrect={isCorrect}
                                    isWrong={false}
                                    isHinted={isHinted}
                                    onClick={() => handleLeftClick(item.id)}
                                    relationColor={relationColor}
                                />
                            )
                        })}
                    </div>

                    <div className="flex flex-col gap-2">
                        {shuffledRight.map(item => {
                            const connectedLeftId = Object.entries(connections).find(([, v]) => v === item.id)?.[0]
                            const isConnectedTo = !!connectedLeftId
                            const isCorrect = feedback === 'correct' && isConnectedTo
                            const leftIdx = connectedLeftId ? data.items.findIndex(i => i.id === connectedLeftId) : -1
                            const relationColor = isConnectedTo ? CONNECTION_COLORS[leftIdx % CONNECTION_COLORS.length] : null
                            
                            const firstPair = data.pairs?.[0]
                            const isHinted = state.fragUsed && firstPair?.rightId === item.id && !isConnectedTo

                            return (
                                <MatchItem
                                    key={item.id}
                                    id={item.id}
                                    isRight
                                    selectedLeft={!!selectedLeft}
                                    text={item.text}
                                    isConnectedTo={isConnectedTo}
                                    isCorrect={isCorrect}
                                    isWrong={false}
                                    isHinted={isHinted}
                                    onClick={() => handleRightClick(item.id)}
                                    relationColor={relationColor}
                                />
                            )
                        })}
                    </div>
                </div>
            </DragDropProvider>

            {feedback === 'correct' && (
                <div className="font-mono text-sm text-(--green-light) text-center bg-(--green-darkest)/30 border border-(--green-base)/20 py-2 rounded-sm animate-pulse mt-4 font-bold">
                    [ OK ] ENLACES_ESTABLECIDOS // SINCRONÍA_COMPLETA
                </div>
            )}
            {feedback === 'wrong' && (
                <div className="flex items-center justify-center gap-2 font-mono text-sm text-(--red) text-center bg-(--red)/5 border border-(--red)/20 py-2 rounded-sm mt-4 font-bold">
                    <OctagonAlert /> {correctCount} / {data.items.length} ENLACES_CORRECTOS // REINTENTAR
                </div>
            )}
        </PuzzleWrapper>
    )
}
