// ============================================================
// REBOOT — components/levels/PuzzleLevel.tsx
// 4 tipos de puzzle en un solo componente:
// puzzle-sort / puzzle-fill / puzzle-bug / puzzle-match
// ============================================================

'use client'

import { useState, useCallback } from 'react'
import type { Level, LevelState } from '@/types/game'

// ------------------------------------------------------------
// TIPOS
// ------------------------------------------------------------

interface PuzzleLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
}

interface PuzzleData {
    type: 'sort' | 'fill' | 'bug' | 'match'
    items: PuzzleItem[]
    pairs?: MatchPair[]      // solo para match
    bugLineIndex?: number    // solo para bug
    fillAnswers?: string[]   // respuestas correctas para fill
}

interface PuzzleItem {
    id: string
    text: string
    isCode?: boolean
    hasBug?: boolean
    blank?: string           // texto del hueco para fill
    answer?: string          // respuesta correcta para fill
}

interface MatchPair {
    leftId: string
    rightId: string
}

// ------------------------------------------------------------
// DATOS DE PUZZLES POR NIVEL
// ------------------------------------------------------------

const PUZZLE_DATA: Record<string, PuzzleData> = {

    // MATCH — Verificación humana
    'P-02': {
        type: 'match',
        items: [
            { id: 'l1', text: '1, 2, 3, ?' },
            { id: 'l2', text: 'A, B, A, ?' },
            { id: 'l3', text: '■, □, ■, ?' },
            { id: 'l4', text: 'O, OO, OOO, ?' },
        ],
        pairs: [
            { leftId: 'l1', rightId: 'r1' },
            { leftId: 'l2', rightId: 'r2' },
            { leftId: 'l3', rightId: 'r3' },
            { leftId: 'l4', rightId: 'r4' },
        ],
    },

    // SORT — ordenar líneas de pseudocódigo
    '2-02': {
        type: 'sort',
        items: [
            { id: 'a', text: 'INICIO' },
            { id: 'b', text: '  MOVER(3)' },
            { id: 'c', text: '  SI panel == VERDE entonces' },
            { id: 'd', text: '    ACTIVAR()' },
            { id: 'e', text: '  FIN SI' },
            { id: 'f', text: 'FIN' },
        ],
    },

    // FILL — completar huecos del código
    '2-04': {
        type: 'fill',
        items: [
            { id: 'a', text: 'INICIO', isCode: false },
            { id: 'b', text: '  pasos = ___', blank: '___', answer: '4', isCode: true },
            { id: 'c', text: '  REPETIR ___ veces', blank: '___', answer: 'pasos', isCode: true },
            { id: 'd', text: '    MOVER()', isCode: true },
            { id: 'e', text: '  FIN REPETIR', isCode: false },
            { id: 'f', text: '  nombre = ___', blank: '___', answer: '"robot"', isCode: true },
            { id: 'g', text: 'FIN', isCode: false },
        ],
        fillAnswers: ['4', 'pasos', '"robot"'],
    },

    // BUG — encontrar el error
    '2-05': {
        type: 'bug',
        bugLineIndex: 3,
        items: [
            { id: 'a', text: 'INICIO' },
            { id: 'b', text: '  energia = 100' },
            { id: 'c', text: '  SI energia > 0 entonces' },
            { id: 'd', text: '    SI energia < 0 entonces', hasBug: true }, // bug: debería ser > 0
            { id: 'e', text: '      ACTIVAR()' },
            { id: 'f', text: '    FIN SI' },
            { id: 'g', text: '  FIN SI' },
            { id: 'h', text: 'FIN' },
        ],
    },

    // MATCH — emparejar conceptos
    '3-03': {
        type: 'match',
        items: [
            { id: 'l1', text: '→ avanzar', isCode: false },
            { id: 'l2', text: '↻ repetir 3 veces', isCode: false },
            { id: 'l3', text: '◇ si condición', isCode: false },
            { id: 'l4', text: 'ƒ función guardar', isCode: false },
        ],
        pairs: [
            { leftId: 'l1', rightId: 'r1' },
            { leftId: 'l2', rightId: 'r2' },
            { leftId: 'l3', rightId: 'r3' },
            { leftId: 'l4', rightId: 'r4' },
        ],
    },

    // BUG con JS — nivel 4-02
    '4-02': {
        type: 'bug',
        bugLineIndex: 3,
        items: [
            { id: 'a', text: 'const sector = "norte";' },
            { id: 'b', text: 'const distancia = 42;' },
            { id: 'c', text: 'const nombre = "REBOOT";' },
            { id: 'd', text: 'const total = distancia + sector;', hasBug: true }, // bug: number + string
            { id: 'e', text: 'console.log(total);' },
            { id: 'f', text: 'robot.move(distancia);' },
        ],
    },

    // BUG con arrays — nivel 4-06
    '4-06': {
        type: 'bug',
        bugLineIndex: 2,
        items: [
            { id: 'a', text: 'const items = ["A", "B", "C"];' },
            { id: 'b', text: '// acceder al primer elemento:' },
            { id: 'c', text: 'console.log(items[1]);', hasBug: true }, // bug: debería ser [0]
            { id: 'd', text: '' },
            { id: 'e', text: '// acceder al último:' },
            { id: 'f', text: 'console.log(items[items.length]);', hasBug: true }, // bug: debería ser length-1
        ],
    },

    // MATCH — emparejar pseudocódigo con JS (nivel 3-03 alternativo)
    '1-03': {
        type: 'match',
        items: [
            { id: 'l1', text: '→', isCode: false },
            { id: 'l2', text: '↻', isCode: false },
            { id: 'l3', text: '◇ SI', isCode: false },
            { id: 'l4', text: 'ƒ FUNCIÓN', isCode: false },
        ],
        pairs: [
            { leftId: 'l1', rightId: 'r1' },
            { leftId: 'l2', rightId: 'r2' },
            { leftId: 'l3', rightId: 'r3' },
            { leftId: 'l4', rightId: 'r4' },
        ],
    },
}

// Derechas del match por nivel
const MATCH_RIGHT: Record<string, { id: string; text: string }[]> = {
    'P-02': [
        { id: 'r1', text: '4' },
        { id: 'r2', text: 'B' },
        { id: 'r3', text: '□' },
        { id: 'r4', text: 'OOOO' },
    ],
    '3-03': [
        { id: 'r1', text: 'secuencia' },
        { id: 'r2', text: 'loop / repetición' },
        { id: 'r3', text: 'condicional' },
        { id: 'r4', text: 'función' },
    ],
    '1-03': [
        { id: 'r1', text: 'avanzar' },
        { id: 'r2', text: 'repetir N veces' },
        { id: 'r3', text: 'tomar decisión' },
        { id: 'r4', text: 'guardar secuencia' },
    ],
}

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL — router por tipo
// ------------------------------------------------------------

export default function PuzzleLevel(props: PuzzleLevelProps) {
    const data = PUZZLE_DATA[props.level.id]

    if (!data) {
        return (
            <div style={{ padding: '2rem', fontFamily: 'var(--font-mono)', color: 'var(--red)', fontSize: '12px' }}>
                ERROR: Puzzle no definido para nivel {props.level.id}
            </div>
        )
    }

    switch (data.type) {
        case 'sort': return <SortPuzzle  {...props} data={data} />
        case 'fill': return <FillPuzzle  {...props} data={data} />
        case 'bug': return <BugPuzzle   {...props} data={data} />
        case 'match': return <MatchPuzzle {...props} data={data} />
    }
}

// ------------------------------------------------------------
// WRAPPER COMPARTIDO
// ------------------------------------------------------------

function PuzzleWrapper({ level, title, children, onCheck, checkLabel = 'verificar', disabled }: {
    level: Level
    title: string
    children: React.ReactNode
    onCheck: () => void
    checkLabel?: string
    disabled?: boolean
}) {
    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem 1rem',
            background: 'var(--bg-void)',
            gap: '1.5rem',
        }}>
            <div style={{ maxWidth: '560px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--green-base)', letterSpacing: '.12em', marginBottom: '.375rem' }}>
            // {level.title}
                    </div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        {level.description}
                    </div>
                </div>

                {children}

                <button
                    onClick={onCheck}
                    disabled={disabled}
                    style={{
                        background: disabled ? 'transparent' : 'var(--green-dark)',
                        border: `1px solid ${disabled ? 'var(--bg-hover)' : 'var(--green-base)'}`,
                        borderRadius: '8px',
                        padding: '12px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        color: disabled ? 'var(--text-ghost)' : 'var(--green-light)',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        letterSpacing: '.1em',
                        transition: 'all .15s',
                    }}
                >
                    {checkLabel}
                </button>
            </div>
        </div>
    )
}

// ------------------------------------------------------------
// PUZZLE SORT — ordenar líneas
// ------------------------------------------------------------

function SortPuzzle({ level, state, data, onComplete }: PuzzleLevelProps & { data: PuzzleData }) {
    const [items, setItems] = useState([...data.items].sort(() => Math.random() - 0.5))
    const [dragIdx, setDragIdx] = useState<number | null>(null)
    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
    const [attempts, setAttempts] = useState(0)

    function handleDragStart(idx: number) { setDragIdx(idx) }

    function handleDrop(targetIdx: number) {
        if (dragIdx === null || dragIdx === targetIdx) return
        const updated = [...items]
        const [moved] = updated.splice(dragIdx, 1)
        updated.splice(targetIdx, 0, moved)
        setItems(updated)
        setDragIdx(null)
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.375rem' }}>
                {items.map((item, idx) => (
                    <div
                        key={item.id}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={e => e.preventDefault()}
                        onDrop={() => handleDrop(idx)}
                        style={{
                            background: feedback === 'correct' ? 'var(--green-darkest)' : 'var(--bg-surface)',
                            border: `1px solid ${feedback === 'correct' ? 'var(--green-base)' : feedback === 'wrong' ? 'var(--red)' : 'var(--bg-hover)'}`,
                            borderRadius: '6px',
                            padding: '9px 14px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '12px',
                            color: 'var(--green-light)',
                            cursor: 'grab',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '.75rem',
                            userSelect: 'none',
                            transition: 'border-color .2s',
                        }}
                    >
                        <span style={{ color: 'var(--text-ghost)', fontSize: '10px' }}>⠿</span>
                        {item.text}
                    </div>
                ))}
            </div>
            {feedback === 'correct' && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--green-light)', textAlign: 'center' }}>
                    ✓ orden correcto
                </div>
            )}
            {feedback === 'wrong' && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--red)', textAlign: 'center' }}>
                    orden incorrecto — intenta de nuevo
                </div>
            )}
        </PuzzleWrapper>
    )
}

// ------------------------------------------------------------
// PUZZLE FILL — completar huecos
// ------------------------------------------------------------

function FillPuzzle({ level, state, data, onComplete }: PuzzleLevelProps & { data: PuzzleData }) {
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.375rem' }}>
                {data.items.map(item => {
                    if (!item.text) return <div key={item.id} style={{ height: '.5rem' }} />
                    if (!item.blank) {
                        return (
                            <div key={item.id} style={{
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--bg-hover)',
                                borderRadius: '6px',
                                padding: '8px 14px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '12px',
                                color: 'var(--text-muted)',
                            }}>
                                {item.text}
                            </div>
                        )
                    }
                    // línea con hueco
                    const parts = item.text.split('___')
                    const isWrong = wrongIds.has(item.id)
                    return (
                        <div key={item.id} style={{
                            background: 'var(--bg-surface)',
                            border: `1px solid ${isWrong ? 'var(--red)' : feedback === 'correct' ? 'var(--green-base)' : 'var(--bg-hover)'}`,
                            borderRadius: '6px',
                            padding: '8px 14px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '12px',
                            color: 'var(--green-light)',
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '.375rem',
                            transition: 'border-color .2s',
                        }}>
                            <span style={{ color: 'var(--text-muted)' }}>{parts[0]}</span>
                            <input
                                value={answers[item.id] ?? ''}
                                onChange={e => setAnswers(prev => ({ ...prev, [item.id]: e.target.value }))}
                                placeholder="?"
                                style={{
                                    background: 'var(--bg-elevated)',
                                    border: `1px solid ${isWrong ? 'var(--red)' : 'var(--green-base)'}`,
                                    borderRadius: '4px',
                                    padding: '2px 8px',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '12px',
                                    color: 'var(--green-light)',
                                    width: '80px',
                                    outline: 'none',
                                }}
                            />
                            {parts[1] && <span style={{ color: 'var(--text-muted)' }}>{parts[1]}</span>}
                        </div>
                    )
                })}
            </div>
        </PuzzleWrapper>
    )
}

// ------------------------------------------------------------
// PUZZLE BUG — encontrar el error
// ------------------------------------------------------------

function BugPuzzle({ level, state, data, onComplete }: PuzzleLevelProps & { data: PuzzleData }) {
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
            <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-ghost)',
                letterSpacing: '.08em',
            }}>
        // selecciona la línea con el error
            </div>

            <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--bg-hover)',
                borderRadius: '8px',
                overflow: 'hidden',
            }}>
                {data.items.map((item, idx) => {
                    if (!item.text) return (
                        <div key={item.id} style={{ height: '8px', background: 'var(--bg-surface)' }} />
                    )
                    const isSelected = selected === idx
                    const isCorrect = feedback === 'correct' && item.hasBug
                    const isWrong = feedback === 'wrong' && isSelected

                    return (
                        <div
                            key={item.id}
                            onClick={() => setSelected(idx)}
                            style={{
                                padding: '9px 16px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '12px',
                                color: isCorrect ? 'var(--green-light)' : isWrong ? 'var(--red)' : isSelected ? 'var(--green-light)' : 'var(--text-muted)',
                                background: isCorrect ? 'var(--green-darkest)' : isWrong ? '#1a0808' : isSelected ? 'var(--bg-elevated)' : 'transparent',
                                borderLeft: `3px solid ${isCorrect ? 'var(--green-base)' : isWrong ? 'var(--red)' : isSelected ? 'var(--green-base)' : 'transparent'}`,
                                cursor: 'pointer',
                                display: 'flex',
                                gap: '1rem',
                                alignItems: 'center',
                                transition: 'all .15s',
                                userSelect: 'none',
                            }}
                        >
                            <span style={{ color: 'var(--text-ghost)', fontSize: '10px', minWidth: '1.5ch' }}>
                                {idx + 1}
                            </span>
                            {item.text}
                        </div>
                    )
                })}
            </div>

            {feedback === 'correct' && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--green-light)', textAlign: 'center' }}>
                    ✓ bug encontrado y corregido
                </div>
            )}
            {feedback === 'wrong' && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--red)', textAlign: 'center' }}>
                    esa línea está correcta — busca en otra parte
                </div>
            )}
        </PuzzleWrapper>
    )
}

// ------------------------------------------------------------
// PUZZLE MATCH — emparejar conceptos
// ------------------------------------------------------------

function MatchPuzzle({ level, state, data, onComplete }: PuzzleLevelProps & { data: PuzzleData }) {
    const rightItems = MATCH_RIGHT[level.id] ?? []
    const [shuffledRight] = useState(() => [...rightItems].sort(() => Math.random() - 0.5))
    const [connections, setConnections] = useState<Record<string, string>>({})
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
    const [wrongPairs, setWrongPairs] = useState<Set<string>>(new Set())
    const [attempts, setAttempts] = useState(0)

    function handleLeftClick(id: string) {
        setSelectedLeft(prev => prev === id ? null : id)
    }

    function handleRightClick(rightId: string) {
        if (!selectedLeft) return
        setConnections(prev => ({ ...prev, [selectedLeft]: rightId }))
        setSelectedLeft(null)
    }

    function handleCheck() {
        if (!data.pairs) return
        const wrong = new Set<string>()
        data.pairs.forEach(pair => {
            if (connections[pair.leftId] !== pair.rightId) wrong.add(pair.leftId)
        })
        setAttempts(a => a + 1)
        if (wrong.size === 0) {
            setFeedback('correct')
            const stars = attempts === 0 ? 3 : attempts === 1 ? 2 : 1
            setTimeout(() => onComplete(stars as 1 | 2 | 3, state.fragUsed), 800)
        } else {
            setFeedback('wrong')
            setWrongPairs(wrong)
            setTimeout(() => { setFeedback('idle'); setWrongPairs(new Set()) }, 1200)
        }
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
            <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-ghost)',
                letterSpacing: '.08em',
            }}>
        // selecciona izquierda → luego derecha para conectar
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Columna izquierda */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.375rem' }}>
                    {data.items.map(item => {
                        const isSelected = selectedLeft === item.id
                        const isConnected = !!connections[item.id]
                        const isWrong = wrongPairs.has(item.id)
                        const isCorrect = feedback === 'correct' && isConnected
                        return (
                            <div
                                key={item.id}
                                onClick={() => handleLeftClick(item.id)}
                                style={{
                                    background: isCorrect ? 'var(--green-darkest)' : isSelected ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                                    border: `1px solid ${isCorrect ? 'var(--green-base)' : isWrong ? 'var(--red)' : isSelected ? 'var(--green-base)' : 'var(--bg-hover)'}`,
                                    borderRadius: '6px',
                                    padding: '9px 12px',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '12px',
                                    color: isCorrect ? 'var(--green-light)' : isSelected ? 'var(--green-light)' : 'var(--text-muted)',
                                    cursor: 'pointer',
                                    transition: 'all .15s',
                                    userSelect: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '.5rem',
                                }}
                            >
                                <span>{item.text}</span>
                                {isConnected && (
                                    <span style={{ fontSize: '10px', color: 'var(--green-base)' }}>→</span>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Columna derecha */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.375rem' }}>
                    {shuffledRight.map(item => {
                        const isConnectedTo = Object.values(connections).includes(item.id)
                        const connectedLeft = Object.entries(connections).find(([, v]) => v === item.id)?.[0]
                        const isCorrect = feedback === 'correct' && isConnectedTo
                        const isWrong = connectedLeft ? wrongPairs.has(connectedLeft) : false

                        return (
                            <div
                                key={item.id}
                                onClick={() => handleRightClick(item.id)}
                                style={{
                                    background: isCorrect ? 'var(--green-darkest)' : isConnectedTo ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                                    border: `1px solid ${isCorrect ? 'var(--green-base)' : isWrong ? 'var(--red)' : isConnectedTo ? 'var(--green-base)' : selectedLeft ? 'var(--green-dark)' : 'var(--bg-hover)'}`,
                                    borderRadius: '6px',
                                    padding: '9px 12px',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '12px',
                                    color: isCorrect ? 'var(--green-light)' : isConnectedTo ? 'var(--green-muted)' : selectedLeft ? 'var(--text-primary)' : 'var(--text-muted)',
                                    cursor: selectedLeft ? 'pointer' : 'default',
                                    transition: 'all .15s',
                                    userSelect: 'none',
                                }}
                            >
                                {item.text}
                            </div>
                        )
                    })}
                </div>
            </div>

            {feedback === 'correct' && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--green-light)', textAlign: 'center' }}>
                    ✓ todos los pares correctos
                </div>
            )}
            {feedback === 'wrong' && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--red)', textAlign: 'center' }}>
                    algunos pares son incorrectos — revisa los marcados en rojo
                </div>
            )}
        </PuzzleWrapper>
    )
}