'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { DragDropProvider, useDroppable, DragOverlay } from '@dnd-kit/react'
import { Play, RefreshCcw } from 'lucide-react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import type { LogicAssemblyBlock, LogicAssemblyBlockType } from '@/types/game'
import { LOGIC_ASSEMBLY_TUTORIAL, LOGIC_TUTORIAL_CONFIG } from './tutorialSteps'
import { LogicAssemblyLevelProps } from './types'
import { BLOCK_DEFS, LOGICASSEMBLY_DATA, DEFAULT_LOGICASSEMBLY } from './constants'
import { flatBlocks, makeBlock, updateBlockValueInTree, removeBlockFromTree, addChildToTree, moveBlockInTree, moveNodeInTree } from './utils'
import { BlockItem } from './BlockItem'
import { PseudocodeSummary } from './PseudocodeSummary'
import { FlatSimulator } from './FlatSimulator'
import { LevelHeader } from '../LevelHeader'
import { DraggablePaletteBlock } from './DraggablePaletteBlock'
import SectionHeader from '@/components/ui/SectionHeader'
import { TacticalSection } from '@/components/ui/TacticalSection'
import { DirectivesPanel } from '@/components/ui/DirectivesPanel'
import { SequenceMemory } from '@/components/ui/MemorySequence'
import { Panel } from '@/components/ui/Panel'
import { directionBiased } from '@dnd-kit/collision'
import { Screw } from '@/components/ui/Screw'
import { PlayButton } from '@/components/ui/PlayButton'
import { StopButton } from '@/components/ui/StopButton'
export default function LogicAssemblyLevel({
    level,
    state,
    onComplete,
    onFragUse,
    onStatusChange
}: LogicAssemblyLevelProps) {
    const data = LOGICASSEMBLY_DATA[level.id] ?? DEFAULT_LOGICASSEMBLY
    const availableDefs = useMemo(
        () => BLOCK_DEFS.filter(d => data.availableBlocks.includes(d.type)),
        [data.availableBlocks]
    )

    const [program, setProgram] = useState<LogicAssemblyBlock[]>([])
    // Estado de preview separado: solo existe durante un drag activo.
    // El workspace renderiza dragPreview ?? program, así el estado "real"
    // no se toca en cada mousemove y BlockItem no re-renderiza innecesariamente.
    const [dragPreview, setDragPreviewState] = useState<LogicAssemblyBlock[] | null>(null)
    const dragPreviewRef = useRef<LogicAssemblyBlock[] | null>(null)

    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
    const [attempts, setAttempts] = useState(0)
    const [isExecuting, setIsExecuting] = useState(false)
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeBlock, setActiveBlock] = useState<LogicAssemblyBlock | null>(null);

    // Refs para evitar closures stale y throttle sin re-renders
    const activeBlockRef = useRef<LogicAssemblyBlock | null>(null);
    const lastTargetRef = useRef<{ id: string, index: number } | null>(null);
    const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Snapshot del programa al inicio del drag para que el preview
    // pueda operar siempre sobre una base estable sin capturar `program`
    const programSnapshotRef = useRef<LogicAssemblyBlock[]>([]);

    const { ref: rootDropRef, isDropTarget: isRootWorkspaceHover } = useDroppable({
        id: 'root-workspace',
        data: { isWorkspace: true },
        collisionDetector: directionBiased,
        collisionPriority: 0
    })

    // Lo que el workspace muestra: preview durante drag, estado real en reposo
    const displayProgram = dragPreview ?? program

    const availableFunctions = useMemo(
        () => Array.from(new Set(
            displayProgram
                .filter(b => b.type === 'FUNCION' && b.value)
                .map(b => b.value as string)
        )),
        [displayProgram]
    )


    useEffect(() => {
        programSnapshotRef.current = program
    }, [program])

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

    // Wrapper para mantener ref sincronizado
    const setDragPreview = useCallback((value: LogicAssemblyBlock[] | null | ((prev: LogicAssemblyBlock[] | null) => LogicAssemblyBlock[] | null)) => {
        if (typeof value === 'function') {
            setDragPreviewState(prev => {
                const next = value(prev)
                dragPreviewRef.current = next
                return next
            })
        } else {
            dragPreviewRef.current = value
            setDragPreviewState(value)
        }
    }, [])

    const handleDragStart = useCallback((event: any) => {
        const { source } = event.operation;
        const sourceData = source.data as any;
        setActiveId(source.id);

        // Usar el ref en vez de program para evitar closure stale
        const currentProgram = programSnapshotRef.current

        let block: LogicAssemblyBlock | null = null;
        if (sourceData.isNew) {
            block = makeBlock(sourceData.type);
        } else {
            const sourceId = source.id.replace('__drop', '');
            block = flatBlocks(currentProgram).find(b => b.id === sourceId) || null;
        }

        setActiveBlock(block);
        activeBlockRef.current = block;

        // Snapshot del programa en el momento exacto que empieza el drag.
        // El preview siempre parte de aquí, evitando acumular errores
        // si moveNodeInTree muta referencias de forma inconsistente.
        dragPreviewRef.current = currentProgram;
        setDragPreviewState(currentProgram);
    }, [program]);

    const handleDragOver = useCallback((event: any) => {
        const { source, target } = event.operation;
        if (!target || isExecuting || !activeBlockRef.current) return;
        //console.log('source.id:', source?.id, '| target.id:', target?.id, '| target.index:', target?.index)

        // Evitar trabajo si el target y el index son idénticos al anterior
        if (
            lastTargetRef.current?.id === target.id &&
            lastTargetRef.current?.index === target.index
        ) return;
        lastTargetRef.current = { id: target.id, index: target.index };


        // Suficiente para que el preview se vea fluido sin saturar React.
        if (throttleRef.current) return;
        throttleRef.current = setTimeout(() => {
            throttleRef.current = null;
        }, 70);

        const sourceId = source.id.replace('__drop', '');
        const targetId = target.id;
        const targetIndex = target.index;
        const isNew = source.data?.isNew || false;

        // Evitar bucles infinitos al soltar un padre sobre un hijo suyo
        if (targetId.includes(activeBlockRef.current.id)) return;

        // Actualizar SOLO el preview, nunca el estado real durante el drag
        setDragPreview(current =>
            moveNodeInTree(
                current ?? programSnapshotRef.current,
                sourceId,
                targetId,
                targetIndex,
                isNew,
                source.data?.type,
                activeBlockRef.current!
            )
        );
    }, [isExecuting]);

    const handleDragEnd = useCallback(() => {
        //console.log('programRef.current al soltar:', JSON.stringify(programSnapshotRef.current, null, 2))
        //console.log('lastTargetRef:', lastTargetRef.current)
        // Limpiar throttle pendiente
        if (throttleRef.current) {
            clearTimeout(throttleRef.current);
            throttleRef.current = null;
        }

        const finalProgram = dragPreviewRef.current;

        // Confirmar el preview como estado real solo si hubo movimiento
        if (finalProgram !== null) {
            setProgram(finalProgram)
        }


        setActiveId(null);
        setActiveBlock(null);
        activeBlockRef.current = null;
        lastTargetRef.current = null;
        programSnapshotRef.current = [];
        dragPreviewRef.current = null;
        setDragPreviewState(null);
    }, []);

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
            }, 1400)
        }
    }

    const isInteractionDisabled = isExecuting || feedback !== 'idle'

    // ------------------------------------------------------------
    // TUTORIAL (DRIVER.JS)
    // ------------------------------------------------------------
    useEffect(() => {
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

    return (
        <DragDropProvider
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex-1 flex flex-row" >
                <div className={`flex-1 flex flex-col w-full h-full overflow-hidden bg-(--bg-void) transition-all duration-700 ${feedback === 'correct' ? 'brightness-125 saturate-150' : ''}`}>

                    <div id="logic-level-header" className="relative z-20">
                        <LevelHeader
                            level={level}
                            status={feedback === 'correct' ? 'success' : feedback === 'wrong' ? 'failed' : isExecuting ? 'playing' : 'idle'}
                            isRunning={isExecuting}
                        />
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                        {isInteractionDisabled && (
                            <div className="absolute inset-0 z-50 bg-black/5 cursor-not-allowed" />
                        )}

                        {/* PALETA DE BLOQUES */}
                        <Panel typePanel="aside" className="w-full md:w-[290px]" border={['left', 'right']}>
                            <SectionHeader title="módulos_de_comando" subtitle="SEC_02 // MOD_CMD" />

                            <div className="p-4 h-[calc(100svh-246px)]">
                                {availableDefs.map(def => (
                                    <div key={def.type} className="relative z-10">
                                        <DraggablePaletteBlock
                                            def={def}
                                            onClick={() => handleAddBlock(def.type)}
                                            disabled={isInteractionDisabled}
                                            maxReached={flatBlocks(program).length >= data.maxBlocks}
                                        />
                                    </div>
                                ))}
                            </div>

                            <SequenceMemory
                                isExecuting={isExecuting}
                                usedBlocks={flatBlocks(displayProgram).length}
                                maxBlocks={data.maxBlocks}
                            />
                        </Panel>

                        {/* ÁREA CENTRAL*/}
                        <main className="flex-1 flex flex-col bg-(--bg-void) relative h-[calc(100svh-130px)]">
                            {/* AREA DE PROGRAMACIÓN */}
                            <Panel typePanel="main" border={'none'} className='h-[calc(100svh-240px)] overflow-y-auto custom-scrollbar'>
                                <div
                                    id="logic-workspace"
                                    ref={rootDropRef}
                                    className={`flex-1 h-full gap-2 relative overflow-y-auto custom-scrollbar overflow-x-hidden p-8 transition-all duration-500 border flex flex-col ${isRootWorkspaceHover ? 'bg-(--green-base)/5 border-(--green-base)/30' :
                                        feedback === 'correct' ? 'bg-(--green-darkest)/10 border-(--green-base)/40' :
                                            feedback === 'wrong' ? 'bg-(--red)/5 border-(--red)/30 animate-shake' :
                                                'bg-(--bg-surface)/30 border-white/5'
                                        }`}
                                >
                                    {displayProgram.length === 0 && (
                                        <div className="flex-1 flex flex-col items-center justify-center opacity-30 select-none pointer-events-none p-12 text-center">
                                            <div className="w-12 h-12 rounded-full border-2 border-dashed border-(--text-ghost) mb-6 flex items-center justify-center animate-pulse">
                                                <div className="w-2 h-2 rounded-full bg-(--text-ghost)" />
                                            </div>
                                            <p className="font-mono text-[13px] text-(--text-muted) tracking-[0.2em] uppercase font-bold max-w-[280px] leading-relaxed">
                                                Arrastra los módulos de comando aquí para comenzar la secuencia
                                            </p>
                                            <p className="font-mono text-[9px] text-(--text-ghost) mt-3 uppercase opacity-40">
                                                esperando_input_del_operador...
                                            </p>
                                        </div>
                                    )}

                                    {displayProgram.map((block, idx) => (
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
                                            parentId="root"
                                            disabled={isInteractionDisabled}
                                        />
                                    ))}
                                </div>
                            </Panel>

                            {/* FOOTER CONTROLES*/}
                            <Panel typePanel="footer" border={['top']} className="h-[120px] relative overflow-visible">
                                <div className="flex h-full items-stretch p-3 gap-4">

                                    <div className="flex-1 flex items-stretch gap-4 p-2 ">

                                        {/* 1. BOTÓN ERASE: TIPO "SWITCH TÁCTICO" */}
                                        <StopButton
                                            isInteractionDisabled={isInteractionDisabled}
                                            program={program}
                                            setProgram={setProgram}
                                        />

                                        {/* 2. BOTÓN START_SEQ: TIPO "PANEL DE CONTROL AERONÁUTICO"
                                            Diseño: Una placa larga de cristal/policarbonato que sobresale del chasis metálico.
                                        */}
                                        <div className="flex-1 relative">
                                            <PlayButton
                                                lengthProgram={flatBlocks(program).length}
                                                isInteractionDisabled={isInteractionDisabled}
                                                feedback={feedback}
                                                isExecuting={isExecuting}
                                                onClick={handleCheck}
                                            />
                                        </div>
                                    </div>
                                    {/* PANEL ASISTENTE (DOCS) */}
                                    <div className="w-[340px] relative flex flex-col justify-end pt-1">
                                        <div className="absolute -top-1 left-2 flex items-center gap-2 px-3 py-0.5 bg-[#192430] border border-[#2D333B] border-b-0 rounded-t-sm z-20 shadow-[-2px_-2px_5px_rgba(0,0,0,0.3)]">
                                            <div className={`w-1.5 h-1.5 rounded-full shadow-[0_0_10px_var(--amber)] animate-pulse transition-colors ${state.fragUsed ? 'bg-(--purple)' : 'bg-(--amber)'}`} />
                                            <span className="text-[9px] font-mono font-black text-(--text-muted) tracking-[0.3em] uppercase">R_INFO // AUX_V4</span>
                                        </div>

                                        <div className="-mb-6">
                                            <DirectivesPanel
                                                infoText={
                                                    <TacticalSection title="MISIÓN_ACTUAL" >
                                                        <div className="font-mono text-[12px] text-white/90 leading-relaxed relative z-10">
                                                            {level.description}
                                                        </div>
                                                    </TacticalSection>
                                                }
                                                missionText={level.description}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </Panel>

                        </main>
                    </div>
                </div>
                {/* MONITOR DE PROCESO */}
                <Panel typePanel="aside" border={['left', 'right']} className="w-full md:w-[400px] shrink-0 flex flex-col relative overflow-hidden">
                    <SectionHeader title="MONITOR_PROCESO" subtitle="SEC_02 // MON_PRO" />

                    <div className="flex-1 overflow-y-auto flex flex-col pt-4 custom-scrollbar relative z-10">
                        {/* EJECUCIÓN EN TIEMPO REAL */}
                        <TacticalSection title="EJECUCIÓN_EN_TIEMPO_REAL" variant="inset">
                            <div className="bg-(--bg-void) relative overflow-hidden">
                                <div className="absolute inset-0 pointer-events-none bg-linear-to-br from-white/5 to-transparent z-10" />

                                {data.map && (
                                    <div className="relative z-0">
                                        <FlatSimulator
                                            blocks={program}
                                            map={data.map}
                                            isExecuting={isExecuting}
                                            onFinish={handleSimulationFinish}
                                        />
                                    </div>
                                )}
                            </div>
                        </TacticalSection>

                        {/* OUTPUT SECUENCIA */}
                        <TacticalSection title="OUTPUT_SECUENCIA" variant="inset">
                            <div className="h-88 overflow-hidden bg-[#05070A] border border-black shadow-[inset_0_2px_15px_rgba(0,0,0,1)] relative group/terminal">

                                <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-black/40">
                                    <div className="flex items-center gap-2">
                                        <div className="w-px h-3 bg-(--text-muted) opacity-40" />
                                        <span className="text-[9px] font-mono font-black text-(--text-muted) uppercase">
                                            LOG_STREAM_V4 // ROOT
                                        </span>
                                    </div>
                                    <div className="flex gap-1 opacity-30">
                                        <div className="w-1 h-1 bg-white rounded-full" />
                                        <div className="w-1 h-1 bg-white/40 rounded-full" />
                                    </div>
                                </div>

                                <div className="h-[calc(100%-32px)] overflow-y-auto custom-scrollbar p-4 relative">
                                    <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#fff_1px,transparent_1px)] bg-size-[40px_100%] pointer-events-none" />

                                    <div className="relative z-10 font-mono text-[11px] leading-tight antialiased">
                                        <PseudocodeSummary blocks={displayProgram} />
                                        <div className="inline-block w-1.5 h-3 bg-(--text-primary) opacity-30 animate-pulse ml-1 align-middle" />
                                    </div>
                                </div>

                                <div className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none opacity-10">
                                    <div className="absolute bottom-1 right-1 w-full h-px bg-white -rotate-45" />
                                </div>

                                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.6)]" />
                            </div>
                        </TacticalSection>
                    </div>
                </Panel>

                {/* DRAG OVERLAY */}
                <DragOverlay>
                    {activeId && activeBlock && (
                        <div className="w-[300px] opacity-90">
                            <BlockItem
                                block={activeBlock}
                                availableDefs={availableDefs}
                                onRemove={() => { }}
                                onValueChange={() => { }}
                                onAddChild={() => { }}
                                onMove={() => { }}
                                availableFunctions={availableFunctions}
                                depth={0}
                                index={0}
                                parentId="overlay"
                                isOverlay
                            />
                        </div>
                    )}
                </DragOverlay>
            </div>
        </DragDropProvider>
    )
}