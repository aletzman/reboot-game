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
import { Button } from '@/components/ui/Button'
import { StopButton } from '@/components/ui/StopButton'
import { AnimatePresence, motion } from 'motion/react'
import { useLogicAssemblyData } from '@/lib/store/useLogicAssemblyData'
import { SpeedSelector } from '../../ui/SpeedSelector'
import { useUIStore } from '@/lib/store/useUIStore'

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

    //const [program, setProgram] = useState<LogicAssemblyBlock[]>([])
    // Estado de preview separado: solo existe durante un drag activo.
    // El workspace renderiza dragPreview ?? program, así el estado "real"
    // no se toca en cada mousemove y BlockItem no re-renderiza innecesariamente.
    const [dragPreview, setDragPreviewState] = useState<LogicAssemblyBlock[] | null>(null)

    const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle')
    const [attempts, setAttempts] = useState(0)
    //const [isExecuting, setIsExecuting] = useState(false)
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeBlock, setActiveBlock] = useState<LogicAssemblyBlock | null>(null);

    // Refs para evitar closures stale y throttle sin re-renders
    const activeBlockRef = useRef<LogicAssemblyBlock | null>(null);
    const lastTargetRef = useRef<{ id: string, index: number } | null>(null);
    const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);


    const { ref: rootDropRef, isDropTarget: isRootWorkspaceHover } = useDroppable({
        id: 'root-workspace',
        data: { isWorkspace: true }
    })

    const program = useLogicAssemblyData((state) => state.program)
    const setProgram = useLogicAssemblyData((state) => state.setProgram)
    const isExecuting = useLogicAssemblyData((state) => state.isExecuting)
    const setIsExecuting = useLogicAssemblyData((state) => state.setIsExecuting)

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


    // Snapshot del programa para que el preview
    // pueda operar siempre sobre una base estable.
    const programSnapshotRef = useRef<LogicAssemblyBlock[]>(program);
    const dragPreviewRef = useRef<LogicAssemblyBlock[] | null>(null)

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

        // Snapshot FRECO del programa al inicio del drag para evitar errores de sincronización
        const currentProgram = [...program]
        programSnapshotRef.current = currentProgram;

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
        setDragPreview(currentProgram);
    }, [program, setDragPreview]);

    const handleDragOver = useCallback((event: any) => {
        let { source, target } = event.operation;

        // Si no hay target detectado por colisión directa con droppables (como bloques),
        // pero estamos sobre el workspace (root-workspace), lo asignamos manualmente.
        if (!target && isRootWorkspaceHover) {
            target = { id: 'root-workspace', index: programSnapshotRef.current.length };
        }

        if (!target) {
            lastTargetRef.current = null
            return
        }

        if (isExecuting || !activeBlockRef.current) return;

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

        // Actualizar SOLO el preview, partiendo SIEMPRE del snapshot estable del inicio del drag
        setDragPreview(
            moveNodeInTree(
                programSnapshotRef.current,
                sourceId,
                targetId,
                targetIndex,
                isNew,
                source.data?.type,
                activeBlockRef.current!
            )
        );
    }, [isExecuting, isRootWorkspaceHover, setDragPreview]);

    const handleDragEnd = useCallback((event: any) => {
        const { target } = event.operation;
        // Limpiar throttle pendiente
        if (throttleRef.current) {
            clearTimeout(throttleRef.current);
            throttleRef.current = null;
        }

        const finalProgram = dragPreviewRef.current;

        // Confirmar la inserción si el preview ha cambiado y estamos sobre la zona del workspace
        if (finalProgram !== null && finalProgram !== programSnapshotRef.current) {
            if (target || isRootWorkspaceHover) {
                setProgram(finalProgram)
            }
        }

        setActiveId(null);
        setActiveBlock(null);
        activeBlockRef.current = null;
        lastTargetRef.current = null;
        dragPreviewRef.current = null;
        setDragPreviewState(null);
    }, [isRootWorkspaceHover, setProgram]);

    const closeDirectives = useUIStore(state => state.closeDirectives)

    function handleCheck() {
        if (program.length === 0 || isExecuting || feedback !== 'idle') return
        closeDirectives()
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
                        >
                            <SequenceMemory
                                isExecuting={isExecuting}
                                usedBlocks={flatBlocks(displayProgram).length}
                                maxBlocks={data.maxBlocks}
                            />
                        </LevelHeader>
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row w-full overflow-hidden relative">

                        {isInteractionDisabled && (
                            <div className="absolute inset-0 z-50 bg-black/5 cursor-not-allowed" />
                        )}

                        {/* PALETA DE BLOQUES */}
                        <Panel id="logic-palette" typePanel="aside" className="w-full md:w-[400px]" border={['left', 'right']}>
                            <SectionHeader title="módulos_de_comando" subtitle="SEC_02 // MOD_CMD" />

                            <div className="flex flex-col gap-1 p-4 h-[calc(100svh-177px)]">
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
                        </Panel>

                        {/* ÁREA CENTRAL*/}
                        <div className="flex-1 flex flex-col bg-(--bg-void) w-full relative h-[calc(100svh-130px)] min-w-0">
                            {/* AREA DE PROGRAMACIÓN */}
                            <Panel typePanel="main" border={'none'} className='h-[calc(100svh-240px)] w-full overflow-y-auto custom-scrollbar'>
                                <div
                                    id="root-workspace"
                                    ref={rootDropRef}
                                    className={`flex-1 min-h-[500px] h-full w-full gap-2 relative p-8 transition-all duration-500 border flex flex-col 
                                        ${isRootWorkspaceHover ? 'bg-(--green-base)/5 border-(--green-base)/30' :
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
                                            activeBlockId={activeBlock?.id}
                                        />
                                    ))}
                                </div>
                            </Panel>

                            {/* FOOTER CONTROLES*/}
                            <Panel typePanel="footer" border={['top']} className=" h-28 w-full relative overflow-visible min-w-0">
                                <div className="flex h-full items-stretch p-1.5 gap-4 min-w-0">
                                    <div id="logic-execute-button" className="flex-1 flex items-center justify-center gap-2 min-w-0">
                                        <Button
                                            onClick={handleCheck}
                                            disabled={isInteractionDisabled}
                                            variant={'green'}
                                            icon={Play}
                                            iconPosition="right"
                                            size="lg"
                                            className='w-full'
                                        >
                                            INICIAR
                                        </Button>
                                        <Button
                                            onClick={() => setProgram([])}
                                            disabled={isInteractionDisabled}
                                            variant={'red'}
                                            icon={RefreshCcw}
                                            iconPosition="right"
                                            size="lg"
                                            className='w-full'
                                        >
                                            BORRAR
                                        </Button>
                                    </div>
                                    <div className="flex-0.5 not-first:flex items-start h-full justify-center min-w-0">
                                        <SpeedSelector />
                                    </div>
                                    {/* PANEL ASISTENTE (DOCS) */}
                                    <div className=" relative flex flex-1 flex-col justify-center">
                                        <DirectivesPanel
                                            infoText={level.fragHint}
                                            missionText={level.description}
                                        />
                                    </div>

                                </div>
                            </Panel>

                        </div>
                    </div>
                </div>
                {/* MONITOR DE PROCESO */}
                <Panel typePanel="aside" border={['left', 'right']} className="w-full md:w-[400px] shrink-0 flex flex-col relative custom-scrollbar h-[calc(100svh-57px)] overflow-hidden overflow-y-auto">
                    <SectionHeader title="MONITOR_PROCESO" subtitle="SEC_02 // MON_PRO" />

                    <div id="logic-simulator" className="flex-1 overflow-y-auto flex flex-col pt-4 custom-scrollbar relative z-10">
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

                        {/* OUTPUT_SECUENCIA: MONITOR DE DEPURACIÓN */}
                        <TacticalSection title="MONITOR_DE_DEPURACIÓN" variant="inset">
                            <div className={`h-[325px] overflow-hidden bg-[#020406]  transition-all duration-500 relative group/terminal
                       
                            `}>

                                {/* 1. EFECTOS DE PANTALLA MÍNIMOS (Para no cansar la vista) */}
                                <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-20" />
                                <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.7)] pointer-events-none z-20" />

                                {/* 2. HEADER DINÁMICO */}
                                <div className={`relative z-30 flex items-center justify-between px-3 py-1.5 border-b backdrop-blur-sm transition-colors duration-500 bg-black/60 border-white/5`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isExecuting ? 'animate-pulse shadow-[0_0_8px_var(--amber)]' : 'bg-(--text-ghost)'}`} />
                                        <span className={`text-[9px] font-mono font-black tracking-widest uppercase transition-colors ${isExecuting ? 'text-(--amber)' : 'text-(--text-muted)'}`}>
                                            {isExecuting ? '[ EJECUTANDO_SECUENCIA ]' : 'ESTADO_DEL_CÓDIGO // READ_ONLY'}
                                        </span>
                                    </div>
                                    <div className="text-[8px] font-mono text-(--text-ghost) opacity-60">
                                        REF_ID: 0x{level.id.toUpperCase().replace('-', '')}
                                    </div>
                                </div>

                                {/* 3. ÁREA DE CÓDIGO (Siempre legible) */}
                                <div className="h-[calc(100%-55px)] p-1 relative">
                                    <div className="relative z-10 flex gap-4 h-full">
                                        {/* Contenido de la secuencia */}
                                        <div className={`flex-1 font-mono text-[11px] h-full leading-tight antialiased transition-colors duration-500 ${isExecuting ? 'text-(--amber) [text-shadow:0_0_5px_rgba(239,159,39,0.3)]' : 'text-(--green-light) [text-shadow:0_0_5px_rgba(126,213,38,0.2)]'}`}>
                                            <PseudocodeSummary blocks={program} />
                                        </div>
                                    </div>
                                </div>

                                {/* 4. FOOTER TÉCNICO */}
                                <div className="absolute bottom-0 left-0 right-0 h-4 bg-black/40 border-t border-white/5 px-2 flex items-center justify-between z-30">
                                    <span className="text-[9px] font-mono text-(--text-muted) uppercase tracking-widest">
                                        {isExecuting ? 'FLUJO_DE_DATOS_ACTIVO' : 'SISTEMA_EN_ESPERA'}
                                    </span>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-1 bg-white/5 rounded-full overflow-hidden">
                                            {isExecuting && <motion.div animate={{ x: [-32, 32] }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-full bg-(--amber)/40" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TacticalSection>


                    </div>
                </Panel>

                {/* DRAG OVERLAY */}
                <DragOverlay>
                    <AnimatePresence>
                        {activeId && activeBlock && (
                            <motion.div
                                key={activeId}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 0.8, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                                transition={{ duration: 0.1 }}
                                className="w-[300px] pointer-events-none z-50 relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                            >
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
                            </motion.div>
                        )}
                    </AnimatePresence>
                </DragOverlay>
            </div>
        </DragDropProvider>
    )
}