'use client'

import { useState, useCallback, useEffect } from 'react'
import { DragDropProvider, useDraggable, useDroppable, DragOverlay } from '@dnd-kit/react'
import { Play } from 'lucide-react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import type { LogicAssemblyBlock, LogicAssemblyBlockType } from '@/types/game'
import { LOGIC_ASSEMBLY_TUTORIAL, LOGIC_TUTORIAL_CONFIG } from './tutorialSteps'
import { LogicAssemblyLevelProps, BlockDef } from './types'
import { BLOCK_DEFS, LOGICASSEMBLY_DATA, DEFAULT_LOGICASSEMBLY } from './constants'
import { flatBlocks, makeBlock, updateBlockValueInTree, removeBlockFromTree, addChildToTree, findAndReorder, moveBlockInTree } from './utils'
import { BlockItem } from './BlockItem'
import { PseudocodeSummary } from './PseudocodeSummary'
import { FlatSimulator } from './FlatSimulator'
import { LevelHeader } from '../LevelHeader'



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

export default function LogicAssemblyLevel({
    level,
    state,
    onComplete,
    onFragUse,
    onStatusChange
}: LogicAssemblyLevelProps) {
    const data = LOGICASSEMBLY_DATA[level.id] ?? DEFAULT_LOGICASSEMBLY
    const availableDefs = BLOCK_DEFS.filter(d => data.availableBlocks.includes(d.type))

    const [program, setProgram] = useState<LogicAssemblyBlock[]>([])
    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
    const [attempts, setAttempts] = useState(0)
    const [isExecuting, setIsExecuting] = useState(false)

    const availableFunctions = program
        .filter(b => b.type === 'FUNCION' && b.value)
        .map(b => b.value as string)

    // ------------------------------------------------------------
    // ACCIONES
    // ------------------------------------------------------------

    function handleAddBlock(type: LogicAssemblyBlockType) {
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

    function handleAddChild(parentId: string, type: LogicAssemblyBlockType) {
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
        const newType = op.source.data?.type as LogicAssemblyBlockType | undefined

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
            onStatusChange('failed')
            setTimeout(() => {
                setFeedback('idle')
                onStatusChange('idle')
            }, 5000)
        }
    }

    const isInteractionDisabled = isExecuting || feedback !== 'idle'

    // ------------------------------------------------------------
    // TUTORIAL (DRIVER.JS)
    // ------------------------------------------------------------
    useEffect(() => {
        // Solo lanzamos el tutorial en el primer nivel de LogicAssembly (2-01)
        if (level.id !== '2-01') return

        const timer = setTimeout(() => {
            const driverObj = driver({
                ...LOGIC_TUTORIAL_CONFIG,
                steps: LOGIC_ASSEMBLY_TUTORIAL
            })

            driverObj.drive()
        }, 1000)

        return () => clearTimeout(timer)
    }, [level.id])

    // ------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------

    return (
        <DragDropProvider
            onDragStart={handleDragStart}
            onDragEnd={(e, m) => handleReorder(e, m)}
        >
            <div className={`flex-1 flex flex-col w-full h-full overflow-hidden bg-(--bg-void) transition-all duration-700 ${feedback === 'correct' ? 'brightness-125 saturate-150' : ''}`}>



                <div className="flex-1 flex flex-col md:flex-row min-h-[70vh] border border-(--bg-hover) overflow-hidden shadow-2xl relative bg-(--bg-void)">

                    {/* Overlay de bloqueo global cuando hay ejecución o error */}
                    {isInteractionDisabled && (
                        <div className="absolute inset-0 z-50 bg-black/5 cursor-not-allowed" />
                    )}

                    {/* Panel izquierdo — paleta de bloques */}
                    <aside id="logic-palette" className="w-full md:w-[240px] shrink-0 bg-(--bg-surface) border-b md:border-b-0 md:border-r border-(--bg-hover) flex flex-col relative overflow-hidden">
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
                        <div id="logic-level-header" className="relative z-20">
                            <LevelHeader
                                level={level}
                                status={feedback === 'correct' ? 'success' : feedback === 'wrong' ? 'failed' : isExecuting ? 'playing' : 'idle'}
                                isRunning={isExecuting}
                            >
                                {program.length > 0 && (
                                    <button
                                        onClick={() => !isInteractionDisabled && setProgram([])}
                                        disabled={isInteractionDisabled}
                                        className="group flex items-center gap-2 px-3 py-1.5 bg-black/40 hover:bg-(--red)/10 border border-(--border-muted-color) hover:border-(--red)/30 text-(--text-muted) hover:text-(--red) transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed group"
                                    >
                                        <span className="font-mono text-[9px] uppercase font-black tracking-widest">BORRAR_TODO</span>
                                    </button>
                                )}
                            </LevelHeader>
                        </div>

                        <div className="flex-1 relative z-10">
                            <div
                                id="logic-workspace"
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
                                        <div className="w-1.5 h-1.5 rounded-full bg-(--green-light) animate-pulse shadow-[0_0_8px_var(--green-light)]" />
                                        <span>Verificación exitosa :: Código de integridad validado</span>
                                    </div>
                                )}
                                {feedback === 'wrong' && (
                                    <div className="flex items-center gap-2 font-mono text-[12px] text-(--red) tracking-widest uppercase">
                                        <div className="w-1.5 h-1.5 rounded-full bg-(--red) animate-pulse shadow-[0_0_8px_var(--red)]" />
                                        <span>Error de secuencia :: Fallo en la validación lógica</span>
                                    </div>
                                )}
                            </div>

                            <button
                                id="logic-execute-button"
                                onClick={handleCheck}
                                disabled={program.length === 0 || isInteractionDisabled}
                                className={`
                                    group relative w-full h-16 transition-all duration-500 active:scale-[0.98]
                                    disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed
                                    overflow-hidden border select-none
                                    ${feedback === 'idle' ? 'bg-(--green-darkest) border-(--green-base) shadow-[0_0_25px_rgba(45,120,0,0.1)]' :
                                        feedback === 'correct' ? 'bg-(--green-darkest) border-(--green-light) shadow-[0_0_40px_rgba(85,226,0,0.2)]' :
                                            feedback === 'wrong' ? 'bg-(--red)/10 border-(--red) shadow-[0_0_30px_rgba(226,75,74,0.15)]' :
                                                'bg-(--bg-surface) border-(--bg-hover)'
                                    }
                                `}
                            >
                                {/* Scanning Bar Effect */}
                                {!isInteractionDisabled && (
                                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-sweep-glow" />
                                    </div>
                                )}

                                {/* Industrial Corner Accents */}
                                <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-current opacity-40 group-hover:opacity-100" />
                                <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-current opacity-40 group-hover:opacity-100" />
                                <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-current opacity-40 group-hover:opacity-100" />
                                <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-current opacity-40 group-hover:opacity-100" />

                                <div className="relative z-10 flex items-center justify-between px-8 h-full">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${isExecuting ? 'bg-(--amber) animate-pulse shadow-[0_0_10px_var(--amber)]' : feedback === 'correct' ? 'bg-(--green-light) shadow-[0_0_15px_var(--green-light)]' : feedback === 'wrong' ? 'bg-(--red) shadow-[0_0_10px_var(--red)]' : 'bg-(--green-light) opacity-30 shadow-none'} `} />

                                        <div className="flex flex-col items-start leading-none gap-1">
                                            <span className="font-mono text-[9px] tracking-[.3em] text-(--text-ghost) group-hover:text-current transition-colors uppercase font-black">
                                                {isExecuting ? 'AUTENTICANDO' : feedback === 'correct' ? 'SISTEMA_ESTABLE' : feedback === 'wrong' ? 'CRITICAL_FAIL' : 'INYECCIÓN_DATOS'}
                                            </span>
                                            <span className={`font-mono text-sm tracking-[.15em] uppercase font-black transition-colors ${feedback === 'wrong' ? 'text-(--red)' : 'text-(--green-light)'}`}>
                                                {isExecuting ? 'PROCESANDO...' : feedback === 'correct' ? 'SECUENCIA_OK' : feedback === 'wrong' ? 'FALLO_LÓGICO' : 'INICIAR SECUENCIA'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-5">
                                        <div className="flex gap-1">
                                            {[0, 1, 2].map(i => (
                                                <div
                                                    key={i}
                                                    className={`w-0.5 h-4 bg-current transition-all duration-500 ${isExecuting ? 'animate-bounce' : 'opacity-20 group-hover:opacity-50'}`}
                                                    style={{ animationDelay: `${i * 0.15}s` }}
                                                />
                                            ))}
                                        </div>
                                        <div className={`p-2 rounded-full border border-current/20 group-hover:border-current/50 transition-all ${isExecuting ? 'animate-spin opacity-50' : ''}`}>
                                            <Play size={18} fill={feedback === 'correct' ? 'currentColor' : 'none'} className={feedback === 'correct' ? 'text-(--green-light)' : 'text-(--text-ghost) group-hover:text-(--green-light)'} />
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </footer>
                    </main>

                    {/* Panel derecho — descripción y pista */}
                    <aside id="logic-simulator" className="w-full md:w-[280px] shrink-0 bg-(--bg-surface) border-t md:border-t-0 md:border-l border-(--bg-hover) flex flex-col p-5 gap-6 overflow-y-auto custom-scrollbar">
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
            </div>
        </DragDropProvider>
    )
}
