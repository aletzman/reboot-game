'use client'

import { useState, useCallback } from 'react'
import { DragDropProvider, useDraggable, useDroppable, DragOverlay } from '@dnd-kit/react'
import type { ScratchBlock, ScratchBlockType } from '@/types/game'
import { ScratchLevelProps, BlockDef } from './types'
import { BLOCK_DEFS, SCRATCH_DATA, DEFAULT_SCRATCH } from './constants'
import { flatBlocks, makeBlock, updateBlockValueInTree, removeBlockFromTree, addChildToTree, findAndReorder, moveBlockInTree } from './utils'
import { BlockItem } from './BlockItem'
import { PseudocodeSummary } from './PseudocodeSummary'
import { FlatSimulator } from './FlatSimulator'



function DraggablePaletteBlock({ def, disabled, maxReached, onClick }: { def: BlockDef, disabled: boolean, maxReached: boolean, onClick: () => void }) {
    const { ref, isDragging } = useDraggable({
        id: `palette-${def.type}`,
        data: { type: def.type, isNew: true },
        disabled: disabled || maxReached
    })

    return (
        <button
            ref={ref}
            onClick={onClick}
            disabled={disabled || maxReached}
            className={`
                group relative flex flex-col p-4 text-left transition-all duration-300 hover:brightness-110 active:scale-95 disabled:opacity-20 disabled:grayscale disabled:hover:scale-100 cursor-grab overflow-hidden border border-white/5 bg-(--bg-elevated)
                ${isDragging ? 'opacity-50 scale-105 z-50' : ''}
                ${disabled ? 'cursor-not-allowed' : ''}
            `}
            style={{ borderLeft: `3px solid ${def.border}` }}
        >
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: def.border }}>
                {def.label}
            </span>
            <span className="font-mono text-[8px] text-(--text-ghost) mt-1 uppercase opacity-40">id::{def.type}</span>
        </button>
    )
}

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
    const [isExecuting, setIsExecuting] = useState(false)

    const availableFunctions = program
        .filter(b => b.type === 'FUNCION' && b.value)
        .map(b => b.value as string)

    // ------------------------------------------------------------
    // ACCIONES
    // ------------------------------------------------------------

    function handleAddBlock(type: ScratchBlockType) {
        if (isExecuting || feedback !== 'idle') return
        if (flatBlocks(program).length >= data.maxBlocks) return
        setProgram(prev => [...prev, makeBlock(type)])
    }

    function handleValueChange(id: string, value: string | number) {
        if (isExecuting || feedback !== 'idle') return
        setProgram(prev => updateBlockValueInTree(id, value, prev))
    }

    function handleRemove(id: string) {
        if (isExecuting || feedback !== 'idle') return
        setProgram(prev => removeBlockFromTree(id, prev))
    }

    function handleMoveBlock(id: string, direction: 'up' | 'down') {
        if (isExecuting || feedback !== 'idle') return
        setProgram(prev => moveBlockInTree(id, direction, prev))
    }

    function handleAddChild(parentId: string, type: ScratchBlockType) {
        if (isExecuting || feedback !== 'idle') return
        setProgram(prev => addChildToTree(parentId, type, prev))
    }

    const { ref: rootDropRef, isDropTarget: isRootWorkspaceHover } = useDroppable({
        id: 'root-workspace'
    })

    const [activeId, setActiveId] = useState<string | null>(null)
    const [activeData, setActiveData] = useState<any>(null)

    const handleDragStart = useCallback((event: any) => {
        const { operation } = event
        setActiveId(operation.source.id)
        setActiveData(operation.source.data)
    }, [])

    const handleReorder = useCallback((event: any, manager: any) => {
        setActiveId(null)
        setActiveData(null)

        if (isExecuting || feedback !== 'idle') return

        const op = event.operation || manager?.dragOperation
        if (!op || !op.source) return

        const sid = op.source.id || (op.source.data?.id)
        const tid = op.target?.id || (op.target?.data?.id)
        const isNew = op.source.data?.isNew || false
        const newType = op.source.data?.type as ScratchBlockType | undefined

        if (!sid) return

        setProgram(current => {
            if (isNew && flatBlocks(current).length >= data.maxBlocks) {
                return current
            }

            // Normalizamos el destino (null significa raíz/vacío)
            const normalizedTid = (tid === 'root-workspace') ? null : tid

            // Caso especial: si es el mismo bloque y no hay un target nuevo real, no hacemos nada
            if (!isNew && sid === tid) return current

            return findAndReorder([...current], sid as string, normalizedTid as string, isNew, newType)
        })
    }, [isExecuting, feedback, data.maxBlocks])

    function handleCheck() {
        if (program.length === 0 || isExecuting || feedback !== 'idle') return
        setAttempts(a => a + 1)
        setIsExecuting(true)
        setFeedback('idle')
    }

    function handleSimulationFinish(success: boolean) {
        setIsExecuting(false)
        if (success) {
            setFeedback('correct')
            const stars = attempts === 0 ? 3 : attempts <= 2 ? 2 : 1
            setTimeout(() => onComplete(stars as 1 | 2 | 3, state.fragUsed), 1000)
        } else {
            setFeedback('wrong')
            setTimeout(() => setFeedback('idle'), 2000)
        }
    }

    const isInteractionDisabled = isExecuting || feedback !== 'idle'

    // ------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------

    return (
        <DragDropProvider
            onDragStart={handleDragStart}
            onDragEnd={(e, m) => handleReorder(e, m)}
        >
            <div className="flex-1 flex flex-col md:flex-row bg-(--bg-void) min-h-[75vh] border border-(--bg-hover) rounded-xl overflow-hidden shadow-2xl relative">

                {/* Overlay de bloqueo global cuando hay ejecución o error */}
                {isInteractionDisabled && (
                    <div className="absolute inset-0 z-50 bg-black/5 cursor-not-allowed" />
                )}

                {/* Panel izquierdo — paleta de bloques */}
                <aside className="w-full md:w-[240px] shrink-0 bg-(--bg-surface) border-b md:border-b-0 md:border-r border-(--bg-hover) flex flex-col relative overflow-hidden">
                    <header className="p-4 border-b border-(--bg-hover) bg-(--bg-deep)/50">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-(--green-base) animate-pulse" />
                            <span className="font-mono text-[10px] text-(--green-light) tracking-[0.2em] uppercase font-bold">
                                biblioteca.sys
                            </span>
                        </div>
                    </header>

                    <div className="flex-1 p-4 flex flex-col gap-2.5 overflow-y-auto custom-scrollbar">
                        {availableDefs.map(def => (
                            <DraggablePaletteBlock
                                key={def.type}
                                def={def}
                                onClick={() => handleAddBlock(def.type)}
                                disabled={isInteractionDisabled}
                                maxReached={flatBlocks(program).length >= data.maxBlocks}
                            />
                        ))}
                    </div>

                    <div className="p-4 border-t border-(--bg-hover) bg-(--bg-deep)/30">
                        <div className="flex justify-between items-end mb-2">
                            <span className="font-mono text-[8px] text-(--text-ghost) uppercase tracking-widest font-bold">memoria_libre</span>
                            <div className="flex gap-0.5">
                                <span className="font-mono text-[10px] text-(--green-muted)">{flatBlocks(program).length}</span>
                                <span className="font-mono text-[10px] text-(--text-ghost)">/</span>
                                <span className="font-mono text-[10px] text-(--text-muted)">{data.maxBlocks}</span>
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-black/40 rounded-sm flex gap-0.5 p-0.5">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className={`flex-1 transition-all duration-300 ${((i + 1) / 12) <= (flatBlocks(program).length / data.maxBlocks) ? 'bg-(--green-base) shadow-[0_0_5px_var(--green-base)]' : 'bg-white/5'}`} />
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Panel central — canvas del programa */}
                <main className="flex-1 flex flex-col bg-(--bg-deep) relative">
                    <header className="p-4 flex justify-between items-center border-b border-(--bg-hover) bg-(--bg-surface)/40 backdrop-blur-sm relative z-20">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-1 rounded-full ${feedback === 'correct' ? 'bg-(--green-light) shadow-[0_0_10px_var(--green-light)]' : feedback === 'wrong' ? 'bg-(--red) shadow-[0_0_10px_var(--red)]' : 'bg-(--text-ghost) opacity-20'}`} />
                                <span className="font-mono text-[9px] text-(--text-ghost) uppercase tracking-widest font-bold">
                                    status: {feedback === 'idle' ? 'standby' : feedback}
                                </span>
                            </div>
                        </div>

                        {program.length > 0 && (
                            <button
                                onClick={() => !isInteractionDisabled && setProgram([])}
                                disabled={isInteractionDisabled}
                                className="group flex items-center gap-2 px-3 py-1.5 bg-black/40 hover:bg-(--red)/10 border border-white/5 hover:border-(--red)/30 text-(--text-ghost) hover:text-(--red) transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <span className="font-mono text-[9px] uppercase font-bold">borrar_todo</span>
                            </button>
                        )}
                    </header>

                    <div className="flex-1 relative z-10">
                        <div
                            ref={rootDropRef}
                            className={`h-[calc(100svh-315px)] overflow-y-auto custom-scrollbar overflow-x-hidden p-4 transition-all duration-500 border flex flex-col gap-3 ${isRootWorkspaceHover ? 'bg-(--green-base)/5 border-(--green-base)/30' :
                                feedback === 'correct' ? 'bg-(--green-darkest)/10 border-(--green-base)/40' :
                                    feedback === 'wrong' ? 'bg-(--red)/5 border-(--red)/30 animate-shake' :
                                        'bg-(--bg-surface)/30 border-white/5'
                                }`}
                        >
                            {program.length === 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center opacity-30 select-none">
                                    <p className="font-mono text-[11px] text-(--text-muted) tracking-widest uppercase italic">
                                        Drag_and_Drop_data_modules_to_initialize_sequencer.log
                                    </p>
                                </div>
                            )}

                            {program.map((block, idx) => (
                                <BlockItem
                                    key={block.id}
                                    index={idx}
                                    block={block}
                                    availableDefs={availableDefs}
                                    onRemove={handleRemove}
                                    onValueChange={handleValueChange}
                                    onAddChild={handleAddChild}
                                    onMove={handleMoveBlock}
                                    availableFunctions={availableFunctions}
                                    depth={0}
                                    disabled={isInteractionDisabled}
                                />
                            ))}
                        </div>
                    </div>

                    <footer className="p-6 border-t border-(--bg-hover) bg-(--bg-surface)/40 backdrop-blur-md relative z-20">
                        <div className="mb-4 h-8 flex items-center justify-center overflow-hidden">
                            {feedback === 'correct' && (
                                <div className="flex items-center gap-2 font-mono text-[12px] text-(--green-light) tracking-widest uppercase">
                                    <span>Verificación exitosa :: Código de integridad validado</span>
                                </div>
                            )}
                            {feedback === 'wrong' && (
                                <div className="flex items-center gap-2 font-mono text-[12px] text-(--red) tracking-widest uppercase">
                                    <span>Error de secuencia :: Fallo en la validación lógica</span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleCheck}
                            disabled={program.length === 0 || isInteractionDisabled}
                            className={`group relative w-full h-14 overflow-hidden shadow-2xl transition-all duration-300 border-b-4 active:border-b-0 active:translate-y-1 cursor-pointer disabled:cursor-not-allowed disabled:grayscale disabled:opacity-50 disabled:border-b-0
                            ${feedback === 'idle' ? 'bg-(--green-darkest) border-(--green-base) hover:bg-(--green-dark) text-(--green-light)' :
                                    (feedback === 'correct' || isExecuting) ? 'bg-(--bg-elevated) border-(--green-light) text-(--green-light)' :
                                        'bg-(--red)/10 border-(--red) text-(--red)'}`}
                        >
                            <div className="relative z-10 flex items-center justify-center gap-4">
                                <span className="font-mono text-xs tracking-[0.5em] uppercase font-bold">{isExecuting ? 'EJECUTANDO...' : 'INICIAR SECUENCIA'}</span>
                            </div>
                        </button>
                    </footer>
                </main>

                {/* Panel derecho — descripción y pista */}
                <aside className="w-full md:w-[280px] shrink-0 bg-(--bg-surface) border-t md:border-t-0 md:border-l border-(--bg-hover) flex flex-col p-5 gap-6 overflow-y-auto custom-scrollbar">
                    <section>
                        <div className="font-mono text-[9px] text-(--green-light) uppercase tracking-[0.2em] mb-3 font-bold flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-(--green-light) animate-pulse" />
                            <span>visualización_periférica.cpu</span>
                        </div>
                        <div className="font-mono text-[11px] text-(--text-muted) uppercase tracking-widest mb-3 opacity-80 flex items-center gap-2">
                            <span className="w-4 h-px bg-(--text-ghost)" />
                            <span>SIMULACIÓN_LOCAL.vms</span>
                        </div>
                        {data.map && (
                            <FlatSimulator
                                blocks={program}
                                map={data.map}
                                isExecuting={isExecuting}
                                onFinish={handleSimulationFinish}
                            />
                        )}
                    </section>

                    <section>
                        <div className="font-mono text-[11px] text-(--text-muted) uppercase tracking-widest mb-3 opacity-80 flex items-center gap-2">
                            <span className="w-4 h-px bg-(--text-ghost)" />
                            <span>Misión</span>
                        </div>
                        <div className="font-mono text-[13px] text-(--text-muted) leading-relaxed bg-(--bg-elevated) p-3 rounded-md border border-white/5">
                            {level.description}
                        </div>
                    </section>

                    <section>
                        <div className="font-mono text-[11px] text-(--text-muted) uppercase tracking-widest mb-3 opacity-80 flex items-center gap-2">
                            <span className="w-4 h-px bg-(--text-ghost)" />
                            <span>Pista_Terminal</span>
                        </div>
                        <div className="bg-(--bg-void) border-l-2 border-(--amber) p-3 text-[11px] text-(--amber)/80 leading-relaxed font-mono">
                            {data.hint}
                        </div>
                    </section>

                    {program.length > 0 && (
                        <section className="mt-auto">
                            <div className="font-mono text-[9px] text-(--purple) uppercase tracking-[0.2em] mb-3 font-bold">
                                {'// resumen.txt'}
                            </div>
                            <div className="bg-(--bg-deep) rounded-lg border border-(--bg-hover) p-1 overflow-hidden">
                                <PseudocodeSummary blocks={program} />
                            </div>
                        </section>
                    )}
                </aside>
            </div>

            <DragOverlay>
                {activeId && activeData ? (
                    <div className="px-5 py-3 border-2 border-(--green-light)/30 bg-(--bg-elevated) shadow-[0_20px_40px_rgba(0,0,0,0.8)] opacity-90 scale-105 z-50 pointer-events-none rounded-sm flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-(--green-light) animate-pulse shadow-[0_0_10px_var(--green-light)]" />
                        <span className="font-mono text-sm font-bold text-white uppercase tracking-[0.2em]">
                            {BLOCK_DEFS.find(d => d.type === activeData.type)?.label || 'MODULO'}
                        </span>
                        <div className="w-1.5 h-6 bg-white/5 rounded-full" />
                        <span className="font-mono text-[9px] text-(--text-ghost) uppercase italic whitespace-nowrap">id::{activeId.toString().substring(0, 6)}</span>
                    </div>
                ) : null}
            </DragOverlay>
        </DragDropProvider>
    )
}
