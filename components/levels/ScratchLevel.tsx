// ============================================================
// REBOOT — components/levels/ScratchLevel.tsx
// Nivel tipo Scratch: bloques arrastrables que el jugador
// ensambla para construir un programa visual
// ============================================================

'use client'

import { useState, useRef } from 'react'
import type { Level, LevelState, ScratchBlock, ScratchBlockType } from '@/types/game'

// ------------------------------------------------------------
// TIPOS
// ------------------------------------------------------------

interface ScratchLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
}

// ------------------------------------------------------------
// DEFINICIÓN DE BLOQUES DISPONIBLES
// ------------------------------------------------------------

interface BlockDef {
    type: ScratchBlockType
    label: string
    color: string
    border: string
    hasValue?: boolean
    valueType?: 'number' | 'direction' | 'text'
    valueDefault?: string | number
    hasChildren?: boolean  // puede contener bloques adentro
    valueOptions?: string[]
}

const BLOCK_DEFS: BlockDef[] = [
    {
        type: 'MOVER',
        label: 'MOVER',
        color: '#0d1f00',
        border: '#2d7800',
        hasValue: true,
        valueType: 'number',
        valueDefault: 1,
    },
    {
        type: 'GIRAR',
        label: 'GIRAR',
        color: '#0d1f00',
        border: '#2d7800',
        hasValue: true,
        valueType: 'direction',
        valueDefault: 'derecha',
        valueOptions: ['izquierda', 'derecha'],
    },
    {
        type: 'REPETIR',
        label: 'REPETIR',
        color: '#26215C',
        border: '#534AB7',
        hasValue: true,
        valueType: 'number',
        valueDefault: 2,
        hasChildren: true,
    },
    {
        type: 'SI',
        label: 'SI',
        color: '#042C53',
        border: '#185FA5',
        hasValue: true,
        valueType: 'text',
        valueDefault: 'panel == VERDE',
        hasChildren: true,
    },
    {
        type: 'FUNCION',
        label: 'FUNCIÓN',
        color: '#412402',
        border: '#854F0B',
        hasValue: true,
        valueType: 'text',
        valueDefault: 'miFuncion',
        hasChildren: true,
    },
    {
        type: 'LLAMAR',
        label: 'LLAMAR',
        color: '#412402',
        border: '#EF9F27',
        hasValue: true,
        valueType: 'text',
        valueDefault: 'miFuncion',
    },
    {
        type: 'ACTIVAR',
        label: 'ACTIVAR',
        color: '#1a0d00',
        border: '#EF9F27',
    },
]

// ------------------------------------------------------------
// DATOS DE NIVELES SCRATCH
// Define qué bloques están disponibles y la solución esperada
// ------------------------------------------------------------

interface ScratchLevelData {
    availableBlocks: ScratchBlockType[]
    maxBlocks: number
    hint: string
    validateFn: (blocks: ScratchBlock[]) => boolean
}

const SCRATCH_DATA: Record<string, ScratchLevelData> = {
    '2-01': {
        availableBlocks: ['MOVER', 'GIRAR', 'REPETIR', 'ACTIVAR'],
        maxBlocks: 8,
        hint: 'Usa REPETIR para evitar repetir MOVER varias veces',
        validateFn: (blocks) => {
            const flat = flatBlocks(blocks)
            const hasRepetir = flat.some(b => b.type === 'REPETIR')
            const hasActivar = flat.some(b => b.type === 'ACTIVAR')
            return hasRepetir && hasActivar
        },
    },
    '2-03': {
        availableBlocks: ['MOVER', 'GIRAR', 'FUNCION', 'LLAMAR', 'ACTIVAR'],
        maxBlocks: 12,
        hint: 'Define una FUNCIÓN con la secuencia y llámala 3 veces',
        validateFn: (blocks) => {
            const flat = flatBlocks(blocks)
            const hasFuncion = flat.some(b => b.type === 'FUNCION')
            const llamadas = flat.filter(b => b.type === 'LLAMAR')
            return hasFuncion && llamadas.length >= 2
        },
    },
    '2-07': {
        availableBlocks: ['MOVER', 'GIRAR', 'REPETIR', 'SI', 'FUNCION', 'LLAMAR', 'ACTIVAR'],
        maxBlocks: 20,
        hint: 'Combina funciones, repeticiones y condiciones',
        validateFn: (blocks) => {
            const flat = flatBlocks(blocks)
            const types = new Set(flat.map(b => b.type))
            return types.has('FUNCION') && types.has('REPETIR') && types.has('ACTIVAR')
        },
    },
}

// Fallback
const DEFAULT_SCRATCH: ScratchLevelData = {
    availableBlocks: ['MOVER', 'GIRAR', 'REPETIR', 'ACTIVAR'],
    maxBlocks: 10,
    hint: 'Construye la secuencia correcta',
    validateFn: (blocks) => blocks.length > 0,
}

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

function flatBlocks(blocks: ScratchBlock[]): ScratchBlock[] {
    const result: ScratchBlock[] = []
    for (const b of blocks) {
        result.push(b)
        if (b.children) result.push(...flatBlocks(b.children))
    }
    return result
}

function makeBlock(type: ScratchBlockType): ScratchBlock {
    const def = BLOCK_DEFS.find(d => d.type === type)!
    return {
        id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type,
        value: def.valueDefault,
        children: def.hasChildren ? [] : undefined,
    }
}

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------

export default function ScratchLevel({
    level,
    state,
    onComplete,
}: ScratchLevelProps) {
    const data = SCRATCH_DATA[level.id] ?? DEFAULT_SCRATCH
    const availableDefs = BLOCK_DEFS.filter(d => data.availableBlocks.includes(d.type))

    const [program, setProgram] = useState<ScratchBlock[]>([])
    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
    const [attempts, setAttempts] = useState(0)
    const [draggingId, setDraggingId] = useState<string | null>(null)
    const [dropTarget, setDropTarget] = useState<string | null>(null)  // id del bloque contenedor
    const dragTypeRef = useRef<ScratchBlockType | null>(null)

    // ------------------------------------------------------------
    // AGREGAR BLOQUE DESDE PALETA
    // ------------------------------------------------------------

    function handleAddBlock(type: ScratchBlockType) {
        if (flatBlocks(program).length >= data.maxBlocks) return
        setProgram(prev => [...prev, makeBlock(type)])
    }

    // ------------------------------------------------------------
    // ACTUALIZAR VALOR DE UN BLOQUE
    // ------------------------------------------------------------

    function updateBlockValue(id: string, value: string | number, blocks: ScratchBlock[]): ScratchBlock[] {
        return blocks.map(b => {
            if (b.id === id) return { ...b, value }
            if (b.children) return { ...b, children: updateBlockValue(id, value, b.children) }
            return b
        })
    }

    function handleValueChange(id: string, value: string | number) {
        setProgram(prev => updateBlockValue(id, value, prev))
    }

    // ------------------------------------------------------------
    // ELIMINAR BLOQUE
    // ------------------------------------------------------------

    function removeBlock(id: string, blocks: ScratchBlock[]): ScratchBlock[] {
        return blocks
            .filter(b => b.id !== id)
            .map(b => b.children ? { ...b, children: removeBlock(id, b.children) } : b)
    }

    function handleRemove(id: string) {
        setProgram(prev => removeBlock(id, prev))
    }

    // ------------------------------------------------------------
    // AGREGAR BLOQUE HIJO (dentro de REPETIR, SI, FUNCIÓN)
    // ------------------------------------------------------------

    function addChild(parentId: string, type: ScratchBlockType, blocks: ScratchBlock[]): ScratchBlock[] {
        return blocks.map(b => {
            if (b.id === parentId && b.children !== undefined) {
                return { ...b, children: [...b.children, makeBlock(type)] }
            }
            if (b.children) return { ...b, children: addChild(parentId, type, b.children) }
            return b
        })
    }

    function handleAddChild(parentId: string, type: ScratchBlockType) {
        setProgram(prev => addChild(parentId, type, prev))
    }

    // ------------------------------------------------------------
    // VERIFICAR
    // ------------------------------------------------------------

    function handleCheck() {
        setAttempts(a => a + 1)
        const correct = data.validateFn(program)
        if (correct) {
            setFeedback('correct')
            const stars = attempts === 0 ? 3 : attempts <= 2 ? 2 : 1
            setTimeout(() => onComplete(stars as 1 | 2 | 3, state.fragUsed), 800)
        } else {
            setFeedback('wrong')
            setTimeout(() => setFeedback('idle'), 1400)
        }
    }

    // ------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            background: 'var(--bg-void)',
            minHeight: '70vh',
            flexWrap: 'wrap',
        }}>

            {/* Panel izquierdo — paleta de bloques */}
            <div style={{
                flex: '0 0 200px',
                background: 'var(--bg-surface)',
                borderRight: '1px solid var(--bg-hover)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '.75rem',
            }}>
                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--green-base)',
                    letterSpacing: '.12em',
                    marginBottom: '.25rem',
                }}>
          // bloques
                </div>

                {availableDefs.map(def => (
                    <button
                        key={def.type}
                        onClick={() => handleAddBlock(def.type)}
                        disabled={flatBlocks(program).length >= data.maxBlocks}
                        style={{
                            background: def.color,
                            border: `1px solid ${def.border}`,
                            borderRadius: '6px',
                            padding: '8px 12px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '12px',
                            color: def.border,
                            cursor: 'pointer',
                            textAlign: 'left',
                            letterSpacing: '.06em',
                            opacity: flatBlocks(program).length >= data.maxBlocks ? 0.4 : 1,
                            transition: 'opacity .15s',
                        }}
                    >
                        {def.label}
                        {def.hasValue && (
                            <span style={{ opacity: .5, marginLeft: '4px', fontSize: '10px' }}>
                                {def.valueType === 'number' ? '( n )' : '( ... )'}
                            </span>
                        )}
                        {def.hasChildren && (
                            <span style={{ opacity: .4, marginLeft: '4px', fontSize: '10px' }}>{'{'}</span>
                        )}
                    </button>
                ))}

                <div style={{
                    marginTop: 'auto',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-ghost)',
                    lineHeight: 1.6,
                }}>
                    {flatBlocks(program).length}/{data.maxBlocks} bloques
                </div>
            </div>

            {/* Panel central — canvas del programa */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem',
                gap: '1rem',
                minWidth: '280px',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--green-base)',
                        letterSpacing: '.12em',
                    }}>
            // programa
                    </div>
                    {program.length > 0 && (
                        <button
                            onClick={() => setProgram([])}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-ghost)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10px',
                                cursor: 'pointer',
                            }}
                        >
                            limpiar todo
                        </button>
                    )}
                </div>

                {/* Canvas */}
                <div style={{
                    flex: 1,
                    background: 'var(--bg-surface)',
                    border: `1px solid ${feedback === 'correct' ? 'var(--green-base)' : feedback === 'wrong' ? 'var(--red)' : 'var(--bg-hover)'}`,
                    borderRadius: '8px',
                    padding: '1rem',
                    minHeight: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '.5rem',
                    transition: 'border-color .2s',
                }}>
                    {program.length === 0 && (
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            color: 'var(--text-ghost)',
                            textAlign: 'center',
                            padding: '2rem 0',
                        }}>
                            agrega bloques desde el panel izquierdo
                        </div>
                    )}

                    {program.map(block => (
                        <BlockItem
                            key={block.id}
                            block={block}
                            availableDefs={availableDefs}
                            onRemove={handleRemove}
                            onValueChange={handleValueChange}
                            onAddChild={handleAddChild}
                            depth={0}
                        />
                    ))}
                </div>

                {/* Feedback */}
                {feedback === 'correct' && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--green-light)', textAlign: 'center' }}>
                        ✓ programa correcto — sistema reactivado
                    </div>
                )}
                {feedback === 'wrong' && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--red)', textAlign: 'center' }}>
                        el programa no completa el objetivo — revisa la lógica
                    </div>
                )}

                {/* Botones */}
                <div style={{ display: 'flex', gap: '.625rem' }}>
                    <button
                        onClick={handleCheck}
                        disabled={program.length === 0}
                        style={{
                            flex: 1,
                            background: program.length === 0 ? 'transparent' : 'var(--green-dark)',
                            border: `1px solid ${program.length === 0 ? 'var(--bg-hover)' : 'var(--green-base)'}`,
                            borderRadius: '7px',
                            padding: '11px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '12px',
                            color: program.length === 0 ? 'var(--text-ghost)' : 'var(--green-light)',
                            cursor: program.length === 0 ? 'not-allowed' : 'pointer',
                            letterSpacing: '.1em',
                            transition: 'all .15s',
                        }}
                    >
                        ▶ ejecutar programa
                    </button>
                </div>
            </div>

            {/* Panel derecho — descripción y pista */}
            <div style={{
                flex: '0 0 220px',
                background: 'var(--bg-surface)',
                borderLeft: '1px solid var(--bg-hover)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
            }}>
                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--green-base)',
                    letterSpacing: '.12em',
                }}>
          // objetivo
                </div>
                <div style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.65,
                }}>
                    {level.description}
                </div>

                <div style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--bg-hover)',
                    borderRadius: '6px',
                    padding: '.75rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-ghost)',
                    lineHeight: 1.6,
                }}>
                    {data.hint}
                </div>

                {/* Resumen del programa */}
                {program.length > 0 && (
                    <div style={{ marginTop: 'auto' }}>
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            color: 'var(--text-ghost)',
                            letterSpacing: '.1em',
                            marginBottom: '.5rem',
                        }}>
              // resumen
                        </div>
                        <PseudocodeSummary blocks={program} />
                    </div>
                )}
            </div>
        </div>
    )
}

// ------------------------------------------------------------
// COMPONENTE DE BLOQUE INDIVIDUAL
// ------------------------------------------------------------

function BlockItem({
    block,
    availableDefs,
    onRemove,
    onValueChange,
    onAddChild,
    depth,
}: {
    block: ScratchBlock
    availableDefs: BlockDef[]
    onRemove: (id: string) => void
    onValueChange: (id: string, value: string | number) => void
    onAddChild: (parentId: string, type: ScratchBlockType) => void
    depth: number
}) {
    const def = BLOCK_DEFS.find(d => d.type === block.type)!
    const [showChildPicker, setShowChildPicker] = useState(false)

    return (
        <div style={{
            marginLeft: depth * 20,
        }}>
            {/* Bloque principal */}
            <div style={{
                background: def.color,
                border: `1px solid ${def.border}`,
                borderRadius: '6px',
                padding: '7px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: def.border,
            }}>
                {/* Conector visual */}
                {depth > 0 && (
                    <span style={{ color: def.border, opacity: .4, fontSize: '10px' }}>└</span>
                )}

                <span style={{ fontWeight: 500, letterSpacing: '.04em' }}>{def.label}</span>

                {/* Input de valor */}
                {def.hasValue && def.valueType === 'number' && (
                    <input
                        type="number"
                        min={1}
                        max={10}
                        value={block.value as number}
                        onChange={e => onValueChange(block.id, parseInt(e.target.value) || 1)}
                        style={{
                            background: 'rgba(0,0,0,.3)',
                            border: `1px solid ${def.border}`,
                            borderRadius: '4px',
                            padding: '2px 6px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            color: def.border,
                            width: '44px',
                            outline: 'none',
                        }}
                    />
                )}

                {def.hasValue && def.valueType === 'direction' && (
                    <select
                        value={block.value as string}
                        onChange={e => onValueChange(block.id, e.target.value)}
                        style={{
                            background: def.color,
                            border: `1px solid ${def.border}`,
                            borderRadius: '4px',
                            padding: '2px 6px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            color: def.border,
                            outline: 'none',
                        }}
                    >
                        {def.valueOptions?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                )}

                {def.hasValue && def.valueType === 'text' && (
                    <input
                        type="text"
                        value={block.value as string}
                        onChange={e => onValueChange(block.id, e.target.value)}
                        style={{
                            background: 'rgba(0,0,0,.3)',
                            border: `1px solid ${def.border}`,
                            borderRadius: '4px',
                            padding: '2px 8px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            color: def.border,
                            width: '100px',
                            outline: 'none',
                        }}
                    />
                )}

                {/* Botón eliminar */}
                <button
                    onClick={() => onRemove(block.id)}
                    style={{
                        marginLeft: 'auto',
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255,255,255,.2)',
                        cursor: 'pointer',
                        fontSize: '12px',
                        lineHeight: 1,
                        padding: '0 2px',
                    }}
                    title="eliminar bloque"
                >
                    ×
                </button>
            </div>

            {/* Bloques hijos */}
            {block.children !== undefined && (
                <div style={{
                    marginLeft: 20,
                    borderLeft: `1px dashed ${def.border}`,
                    paddingLeft: '8px',
                    marginTop: '.25rem',
                    marginBottom: '.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '.375rem',
                    minHeight: '32px',
                }}>
                    {block.children.map(child => (
                        <BlockItem
                            key={child.id}
                            block={child}
                            availableDefs={availableDefs}
                            onRemove={onRemove}
                            onValueChange={onValueChange}
                            onAddChild={onAddChild}
                            depth={depth + 1}
                        />
                    ))}

                    {/* Botón agregar hijo */}
                    {!showChildPicker ? (
                        <button
                            onClick={() => setShowChildPicker(true)}
                            style={{
                                background: 'transparent',
                                border: `1px dashed ${def.border}`,
                                borderRadius: '4px',
                                padding: '4px 10px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10px',
                                color: def.border,
                                cursor: 'pointer',
                                opacity: .5,
                                alignSelf: 'flex-start',
                                letterSpacing: '.08em',
                            }}
                        >
                            + agregar bloque
                        </button>
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.25rem' }}>
                            {availableDefs
                                .filter(d => !d.hasChildren) // no anidamos contenedores por simplicidad
                                .map(d => (
                                    <button
                                        key={d.type}
                                        onClick={() => { onAddChild(block.id, d.type); setShowChildPicker(false) }}
                                        style={{
                                            background: d.color,
                                            border: `1px solid ${d.border}`,
                                            borderRadius: '4px',
                                            padding: '3px 8px',
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '10px',
                                            color: d.border,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            <button
                                onClick={() => setShowChildPicker(false)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--bg-hover)',
                                    borderRadius: '4px',
                                    padding: '3px 8px',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '10px',
                                    color: 'var(--text-ghost)',
                                    cursor: 'pointer',
                                }}
                            >
                                cancelar
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ------------------------------------------------------------
// RESUMEN EN PSEUDOCÓDIGO — panel derecho
// ------------------------------------------------------------

function PseudocodeSummary({ blocks, depth = 0 }: { blocks: ScratchBlock[]; depth?: number }) {
    return (
        <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--text-ghost)',
            lineHeight: 1.8,
        }}>
            {blocks.map(block => {
                const indent = '  '.repeat(depth)
                const def = BLOCK_DEFS.find(d => d.type === block.type)!
                const val = block.value !== undefined ? `(${block.value})` : ''

                return (
                    <div key={block.id}>
                        <span style={{ color: def.border, opacity: .7 }}>
                            {indent}{block.type}{val}
                        </span>
                        {block.children && block.children.length > 0 && (
                            <PseudocodeSummary blocks={block.children} depth={depth + 1} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}