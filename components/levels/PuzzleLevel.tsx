// ============================================================
// REBOOT — components/levels/PuzzleLevel.tsx
// 4 tipos de puzzle en un solo componente:
// puzzle-sort / puzzle-fill / puzzle-bug / puzzle-match
// ============================================================

'use client'

import { useState, useId } from 'react'
import { DragDropProvider, useDraggable, useDroppable } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import type { Level, LevelState } from '@/types/game'
import { Button } from '@/components/ui/Button'
import { CircleDot, Dot, GripHorizontal, GripVertical, Link2, OctagonAlert, RefreshCw, ScanLine } from 'lucide-react'

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
// AYUDANTES
// ------------------------------------------------------------

function move<T>(items: T[], event: any): T[] {
    const { source, target } = event.operation
    if (target && source.id !== target.id) {
        const oldIndex = items.findIndex((i: any) => i.id === source.id)
        const newIndex = items.findIndex((i: any) => i.id === target.id)
        if (oldIndex !== -1 && newIndex !== -1) {
            const updated = [...items]
            const [moved] = updated.splice(oldIndex, 1)
            updated.splice(newIndex, 0, moved)
            return updated
        }
    }
    return items
}

function SyntaxHighlighter({ text }: { text: string }) {
    // Palabras clave comunes de REBOOT y JS
    const keywords = ["INICIO", "FIN", "MOVER", "SI", "ACTIVAR", "REPETIR", "entonces", "const", "let", "function", "return", "robot"]
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

    const parts = text.split(/(\b\w+\b|\s+)/g)

    return (
        <code className="bg-transparent font-mono whitespace-pre">
            {parts.map((part, i) => {
                if (keywords.includes(part)) {
                    return <span key={i} className="text-(--cyan) font-bold">{part}</span>
                }
                if (part.includes("(") || part.includes(")")) {
                    return <span key={i} className="text-(--amber)">{part}</span>
                }
                if (part.startsWith('"') || part.startsWith("'")) {
                    return <span key={i} className="text-(--purple)">{part}</span>
                }
                if (numbers.some(n => part.includes(n))) {
                    return <span key={i} className="text-(--amber)">{part}</span>
                }
                if (part.toUpperCase() === part && part.length > 2 && !keywords.includes(part)) {
                    return <span key={i} className="text-(--green-muted)">{part}</span>
                }
                return <span key={i}>{part}</span>
            })}
        </code>
    )
}

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL — router por tipo
// ------------------------------------------------------------

export default function PuzzleLevel(props: PuzzleLevelProps) {
    const data = PUZZLE_DATA[props.level.id]

    if (!data) {
        return (
            <div className="p-8 font-mono text-(--red) text-xs">
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
        <div className="flex-1 flex flex-col items-center py-12 px-4 bg-(--bg-void) relative overflow-hidden min-h-screen">
            {/* ── CRT scanlines ── */}
            <div className="absolute inset-0 pointer-events-none crt-overlay opacity-20 z-0" />

            <div className="relative z-10 max-w-[620px] w-full flex flex-col gap-6 animate-fade-in-up">
                {/* ── DEVICE FRAME ── */}
                <div className="bg-(--bg-deep) border border-(--bg-hover) shadow-2xl rounded-xs overflow-hidden flex flex-col">

                    {/* ── HEADER TERMINAL ── */}
                    <div className="flex items-center justify-between border-b border-(--bg-hover) px-4 py-2 bg-(--bg-surface)">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-(--green-base) animate-pulse" />
                            <div className="text-[10px] text-(--green-muted) tracking-widest uppercase font-mono">
                                {level.id} // {title}
                            </div>
                        </div>
                        <div className="text-[9px] text-(--text-ghost) tracking-tighter font-mono uppercase">
                            Term-v.1.04_Reboot
                        </div>
                    </div>

                    <div className="p-6 md:p-8 flex flex-col gap-8">
                        {/* ── DESCRIPTION ── */}
                        <div className="relative">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-(--green-dark) opacity-30" />
                            <div className=" font-mono text-[11px] text-(--green-base) tracking-[.2em] mb-2 uppercase opacity-70">
                                // Misión actual
                            </div>
                            <h2 className="text-xl font-(family-name:--font-title) font-bold text-(--text-primary)/80 mb-2 tracking-tight">
                                {level.title}
                            </h2>
                            <p className="text-[14px] text-(--text-muted)  font-mono">
                                {level.description}
                            </p>
                        </div>

                        {/* ── PUZZLE CONTENT ── */}
                        <div className="bg-(--bg-void) border border-(--bg-hover) p-4 rounded-sm shadow-inner relative group">
                            <div className="absolute top-[-8px] right-4 bg-(--bg-deep) px-2 pt-px text-[9px] text-(--text-ghost) tracking-widest border border-(--border-color)/60 rounded-xs z-10 group-hover:text-(--green-muted) transition-colors">
                                AREA_DE_TRABAJO
                            </div>
                            {children}
                        </div>

                        {/* ── ACTIONS ── */}
                        <Button
                            onClick={onCheck}
                            disabled={disabled}
                            variant="solid"
                            size="lg"
                            className="w-full"
                            icon={disabled ? undefined : ScanLine}
                        >
                            {disabled ? '[ Ingresa datos ]' : `${checkLabel}`}
                        </Button>
                    </div>

                    {/* ── FOOTER BAR ── */}
                    <div className="border-t border-(--bg-hover) px-4 py-2 bg-(--bg-surface) flex justify-between items-center text-[9px] text-(--text-ghost) font-mono">
                        <div>REBOOT_OS // SYSTEM_READY</div>
                        <div className="flex gap-4">
                            <span>FRAG_ACTIVE: {level.id.includes('P') ? 'YES' : 'NO'}</span>
                            <span>ENCRYPT: AES-256</span>
                        </div>
                    </div>
                </div>

                {/* ── DECORATIVE ELEMENTS ── */}
                <div className="flex justify-between px-2 text-[8px] text-(--text-ghost) font-mono opacity-40">
                    <div>42.3684° N, 71.0125° W</div>
                    <div>{new Date().toISOString().split('T')[0]} // CACHE_LOADED</div>
                </div>
            </div>
        </div>
    )
}

// ------------------------------------------------------------
// PUZZLE SORT — ordenar líneas
// ------------------------------------------------------------

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

function SortPuzzle({ level, state, data, onComplete }: PuzzleLevelProps & { data: PuzzleData }) {
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

// ------------------------------------------------------------
// PUZZLE MATCH — emparejar conceptos
// ------------------------------------------------------------

const CONNECTION_COLORS = [
    'var(--cyan)',
    'var(--purple)',
    'var(--amber)',
    'var(--blue)',
    '#55e200', // green-light
    '#E24B4A'  // red
]

function MatchItem({ id, text, isSelected, isConnected, isCorrect, isWrong, onClick, isRight = false, selectedLeft = false, isConnectedTo = false, relationColor }: any) {
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

function MatchPuzzle({ level, state, data, onComplete }: PuzzleLevelProps & { data: PuzzleData }) {
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

                            return (
                                <MatchItem
                                    key={item.id}
                                    id={item.id}
                                    text={item.text}
                                    isSelected={isSelected}
                                    isConnected={isConnected}
                                    isCorrect={isCorrect}
                                    isWrong={false} // No resaltar errores individualmente
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

                            return (
                                <MatchItem
                                    key={item.id}
                                    id={item.id}
                                    isRight
                                    selectedLeft={!!selectedLeft}
                                    text={item.text}
                                    isConnectedTo={isConnectedTo}
                                    isCorrect={isCorrect}
                                    isWrong={false} // No resaltar errores individualmente
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