'use client'

import { useState } from 'react'
import type { ScratchBlock, ScratchBlockType } from '@/types/game'
import { ScratchLevelProps } from './types'
import { BLOCK_DEFS, SCRATCH_DATA, DEFAULT_SCRATCH } from './constants'
import { flatBlocks, makeBlock, updateBlockValueInTree, removeBlockFromTree, addChildToTree } from './utils'
import { BlockItem } from './BlockItem'
import { PseudocodeSummary } from './PseudocodeSummary'

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

    // ------------------------------------------------------------
    // ACCIONES
    // ------------------------------------------------------------

    function handleAddBlock(type: ScratchBlockType) {
        if (flatBlocks(program).length >= data.maxBlocks) return
        setProgram(prev => [...prev, makeBlock(type)])
    }

    function handleValueChange(id: string, value: string | number) {
        setProgram(prev => updateBlockValueInTree(id, value, prev))
    }

    function handleRemove(id: string) {
        setProgram(prev => removeBlockFromTree(id, prev))
    }

    function handleAddChild(parentId: string, type: ScratchBlockType) {
        setProgram(prev => addChildToTree(parentId, type, prev))
    }

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
        <div className="flex-1 flex flex-wrap bg-(--bg-void) min-h-[70vh]">

            {/* Panel izquierdo — paleta de bloques */}
            <aside className="w-[200px] shrink-0 bg-(--bg-surface) border-r border-(--bg-hover) p-5 flex flex-col gap-3">
                <div className="font-mono text-[10px] text-(--green-base) tracking-[.12em] uppercase mb-1">
                    {'// bloques'}
                </div>

                {availableDefs.map(def => (
                    <button
                        key={def.type}
                        onClick={() => handleAddBlock(def.type)}
                        disabled={flatBlocks(program).length >= data.maxBlocks}
                        className="rounded-md p-2.5 font-mono text-[12px] text-left tracking-wide cursor-pointer transition-opacity"
                        style={{
                            background: def.color,
                            border: `1px solid ${def.border}`,
                            color: def.border,
                            opacity: flatBlocks(program).length >= data.maxBlocks ? 0.4 : 1,
                        }}
                    >
                        {def.label}
                        {def.hasValue && (
                            <span className="opacity-50 ml-1 text-[10px]">
                                {def.valueType === 'number' ? '( n )' : '( ... )'}
                            </span>
                        )}
                        {def.hasChildren && (
                            <span className="opacity-40 ml-1 text-[10px]">{'{'}</span>
                        )}
                    </button>
                ))}

                <div className="mt-auto font-mono text-[10px] text-(--text-ghost) leading-relaxed">
                    {flatBlocks(program).length}/{data.maxBlocks} bloques
                </div>
            </aside>

            {/* Panel central — canvas del programa */}
            <main className="flex-1 min-w-[280px] p-6 flex flex-col gap-4">
                <header className="flex justify-between items-center">
                    <div className="font-mono text-[10px] text-(--green-base) tracking-[.12em] uppercase">
                        {'// programa'}
                    </div>
                    {program.length > 0 && (
                        <button
                            onClick={() => setProgram([])}
                            className="bg-transparent border-none text-(--text-ghost) font-mono text-[10px] cursor-pointer"
                        >
                            limpiar todo
                        </button>
                    )}
                </header>

                <div 
                    className="flex-1 bg-(--bg-surface) rounded-lg p-4 min-h-[300px] flex flex-col gap-2 transition-colors border"
                    style={{ border: `1px solid ${feedback === 'correct' ? 'var(--green-base)' : feedback === 'wrong' ? 'var(--red)' : 'var(--bg-hover)'}` }}
                >
                    {program.length === 0 && (
                        <div className="font-mono text-[11px] text-(--text-ghost) text-center py-8">
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

                <footer className="flex flex-col gap-3">
                    {feedback === 'correct' && (
                        <div className="font-mono text-[11px] text-(--green-light) text-center">
                            ✓ programa correcto — sistema reactivado
                        </div>
                    )}
                    {feedback === 'wrong' && (
                        <div className="font-mono text-[11px] text-(--red) text-center">
                            el programa no completa el objetivo — revisa la lógica
                        </div>
                    )}

                    <button
                        onClick={handleCheck}
                        disabled={program.length === 0}
                        className="w-full rounded-[7px] p-2.5 font-mono text-xs tracking-widest cursor-pointer transition-all border disabled:cursor-not-allowed disabled:bg-transparent disabled:border-(--bg-hover) disabled:text-(--text-ghost)"
                        style={{
                            background: program.length === 0 ? undefined : 'var(--green-dark)',
                            borderColor: program.length === 0 ? undefined : 'var(--green-base)',
                            color: program.length === 0 ? undefined : 'var(--green-light)',
                        }}
                    >
                        ▶ ejecutar programa
                    </button>
                </footer>
            </main>

            {/* Panel derecho — descripción y pista */}
            <aside className="w-[220px] shrink-0 bg-(--bg-surface) border-l border-(--bg-hover) p-5 flex flex-col gap-4">
                <div className="font-mono text-[10px] text-(--green-base) tracking-[.12em] uppercase">
                    {'// objetivo'}
                </div>
                <div className="font-sans text-[12px] text-(--text-muted) leading-[1.65]">
                    {level.description}
                </div>

                <div className="bg-(--bg-elevated) border border-(--bg-hover) rounded-md p-3 font-mono text-[11px] text-(--text-ghost) leading-relaxed">
                    {data.hint}
                </div>

                {program.length > 0 && (
                    <div className="mt-auto">
                        <div className="font-mono text-[10px] text-(--text-ghost) tracking-widest uppercase mb-2">
                            {'// resumen'}
                        </div>
                        <PseudocodeSummary blocks={program} />
                    </div>
                )}
            </aside>
        </div>
    )
}
