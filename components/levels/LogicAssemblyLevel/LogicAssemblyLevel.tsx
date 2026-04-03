'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { DragDropProvider, useDroppable, DragOverlay } from '@dnd-kit/react'
import { Play, Activity, RefreshCcw, Cpu } from 'lucide-react'
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
import { Screw } from '@/components/ui/Screw'
import SectionHeader from '@/components/ui/SectionHeader'





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
    const [activeId, setActiveId] = useState<string | null>(null);
    const [activeBlock, setActiveBlock] = useState<LogicAssemblyBlock | null>(null);
    const activeBlockRef = useRef<LogicAssemblyBlock | null>(null);
    const lastTargetRef = useRef<{ id: string, index: number } | null>(null);

    const { ref: rootDropRef, isDropTarget: isRootWorkspaceHover } = useDroppable({
        id: 'root-workspace', // ID unificado
        data: { isWorkspace: true }
    })


    const availableFunctions = Array.from(new Set(program
        .filter(b => b.type === 'FUNCION' && b.value)
        .map(b => b.value as string)))

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

    const handleDragStart = useCallback((event: any) => {
        const { source } = event.operation;
        const data = source.data as any;
        setActiveId(source.id);

        let block: LogicAssemblyBlock | null = null;
        if (data.isNew) {
            block = makeBlock(data.type);
        } else {
            const sid = source.id.replace('__drop', '');
            block = flatBlocks(program).find(b => b.id === sid) || null;
        }

        setActiveBlock(block);
        activeBlockRef.current = block;
    }, [program]);

    const handleDragOver = useCallback((event: any) => {
        const { source, target } = event.operation;
        if (!target || isExecuting || !activeBlockRef.current) return;

        // Optimización: Evitar re-renders si el target y el index son idénticos al anterior
        if (lastTargetRef.current?.id === target.id && lastTargetRef.current?.index === target.index) return;
        lastTargetRef.current = { id: target.id, index: target.index };

        const sourceId = source.id.replace('__drop', '');
        const targetId = target.id;
        const targetIndex = target.index;
        const isNew = source.data?.isNew || false;

        // Evitar bucles infinitos
        if (targetId.includes(activeBlockRef.current.id)) return;

        setProgram(current => {
            return moveNodeInTree(
                current,
                sourceId,
                targetId,
                targetIndex,
                isNew,
                source.data?.type,
                activeBlockRef.current!
            );
        });
    }, [isExecuting]);

    const handleDragEnd = useCallback(() => {
        setActiveId(null);
        setActiveBlock(null);
        activeBlockRef.current = null;
        lastTargetRef.current = null;
    }, []);

    const handleDragCancel = useCallback(() => {
        setActiveId(null);
        setActiveBlock(null);
        activeBlockRef.current = null;
        lastTargetRef.current = null;
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
            }, 2000)
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

                    <div className="flex-1 flex flex-col md:flex-row  overflow-hidden shadow-2xl relative bg-(--bg-void)">

                        {/* Overlay de bloqueo global cuando hay ejecución o error */}
                        {isInteractionDisabled && (
                            <div className="absolute inset-0 z-50 bg-black/5 cursor-not-allowed" />
                        )}

                        {/* Panel izquierdo — paleta de bloques */}
                        <aside id="logic-palette" className="w-full md:w-[240px] shrink-0 bg-(--bg-deep) border-b md:border-b-0 md:border-r border-(--border-color)  border-t-0 flex flex-col relative overflow-hidden z-20">

                            {/* 1. HEADER: Placa Metálica Superior */}
                            <SectionHeader title="módulos_de_comando" subtitle="SEC_02 // MOD_CMD" />

                            {/* 2. ZONA DE ALMACENAJE (El "Hueco" oscuro) */}
                            <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto custom-scrollbar bg-(--bg-deep) relative">
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
                        </aside>

                        {/* Panel central — Sequenciador */}
                        <main className="flex-1 flex flex-col bg-(--bg-void) relative h-[calc(100svh-130px)]">
                            <div
                                id="logic-workspace"
                                ref={rootDropRef}
                                className={`flex-1 h-[calc(100svh-500px)] overflow-y-auto custom-scrollbar overflow-x-hidden p-8 transition-all duration-500 border flex flex-col gap-3 ${isRootWorkspaceHover ? 'bg-(--green-base)/5 border-(--green-base)/30' :
                                    feedback === 'correct' ? 'bg-(--green-darkest)/10 border-(--green-base)/40' :
                                        feedback === 'wrong' ? 'bg-(--red)/5 border-(--red)/30 animate-shake' :
                                            'bg-(--bg-surface)/30 border-white/5'
                                    }`}
                            >
                                {program.length === 0 && (
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
                                        parentId="root"
                                        disabled={isInteractionDisabled}
                                    />
                                ))}
                            </div>

                            <footer className="p-8 border-t border-(--border-color) bg-(--bg-surface) relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.7)]">
                                <div className="max-w-5xl mx-auto flex items-stretch gap-4">

                                    {/* 1. MÓDULO DE PURGA: Kill Switch Industrial */}
                                    <div className="relative p-2 bg-black/40 rounded-sm shadow-[inset_0_2px_10px_rgba(0,0,0,1)] border border-white/5">
                                        <button
                                            onClick={() => !isInteractionDisabled && setProgram([])}
                                            disabled={isInteractionDisabled || program.length === 0}
                                            className={`h-full px-4 flex flex-col items-center justify-center gap-2 group transition-all duration-150 rounded-xs select-none relative overflow-hidden
                                                    ${isInteractionDisabled || program.length === 0
                                                    ? 'opacity-20 grayscale cursor-not-allowed bg-transparent'
                                                    : 'cursor-pointer bg-[#2A1616] hover:bg-[#3D1A1A] active:scale-95 shadow-[0_4px_0_rgba(0,0,0,1)] active:shadow-none'
                                                }
                                                border border-b-[3px] border-r-[3px] border-black
                                            `}
                                        >
                                            <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,#000_8px,#000_10px)] pointer-events-none" />

                                            <RefreshCcw size={16} className="text-(--red) group-hover:rotate-180 transition-transform duration-500 relative z-10" />
                                            <span className="font-sans text-[9px] text-(--red) uppercase font-black  text-center leading-tight relative z-10">
                                                BORRAR TODO
                                            </span>
                                        </button>
                                        <Screw corner="tl" size="sm" />
                                        <Screw corner="br" size="sm" />
                                    </div>

                                    {/* 2. UNIDAD DE CONTROL CENTRAL */}
                                    <div className="flex-1 relative p-2 bg-black/20 rounded-sm shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)] border border-white/5">



                                        <button
                                            id="logic-execute-button"
                                            onClick={handleCheck}
                                            disabled={program.length === 0 || isInteractionDisabled}
                                            className={`group relative w-full h-20 transition-all duration-200 rounded-xs overflow-hidden select-none cursor-pointer
                                                    active:translate-y-1 active:translate-x-0.5 active:shadow-none
                                                    disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed
                                                    
                                                    /* ESTRUCTURA FÍSICA */
                                                    bg-[#1F242D] border-t border-l  border-b-4 border-r-5 border-black
                                                    shadow-[0_8px_0_#050608,0_15px_30px_rgba(0,0,0,0.7)]
                                                `}
                                        >
                                            {/* Textura de rejilla mucho más densa */}
                                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[4px_4px] pointer-events-none" />

                                            {/* Luz de estado lateral (Lume) */}
                                            <div className={`absolute left-0 top-0 bottom-0 w-2 transition-all duration-500
                                                    ${feedback === 'correct' ? 'bg-(--green-light) shadow-[4px_0_20px_var(--green-light)]' :
                                                    feedback === 'wrong' ? 'bg-(--red) shadow-[4px_0_20px_var(--red)]' :
                                                        isExecuting ? 'bg-(--amber) shadow-[4px_0_20px_var(--amber)]' :
                                                            'bg-[#363D4C] opacity-30'}
                                                `} />

                                            <div className="relative z-10 flex items-center justify-between px-10 h-full">
                                                <div className="flex flex-col items-start gap-1">
                                                    <span className="font-mono text-[9px] tracking-[0.5em] text-[#565F73] uppercase font-black">
                                                        CORE_INJECTOR_V2.1
                                                    </span>
                                                    <span className={`font-mono text-xl tracking-tighter uppercase font-black transition-all
                                                            ${feedback === 'wrong' ? 'text-(--red)' : isExecuting ? 'text-(--amber)' : 'text-white'}
                                                        `}>
                                                        {isExecuting ? '>>> EJECUTANDO' : feedback === 'correct' ? 'SUCCESS_OK' : feedback === 'wrong' ? 'FATAL_ERR' : 'INICIAR SECUENCIA'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-8">
                                                    {/* Gráfica de pulsos (Solo cuando hay acción) */}
                                                    <div className="hidden lg:flex gap-[3px] items-end h-8">
                                                        {Array.from({ length: 16 }).map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className={`w-[2px] rounded-full transition-all duration-300 ${isExecuting ? 'bg-(--amber) shadow-[0_0_5px_var(--amber)]' : 'bg-white/10'
                                                                    }`}
                                                                style={{ height: isExecuting ? `${30 + (Math.random() * 70)}%` : '20%' }}
                                                            />
                                                        ))}
                                                    </div>

                                                    {/* Botón Circular con Bisel Profundo */}
                                                    <div className={`
                                                            w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 bg-black/40
                                                            shadow-[inset_0_4px_8px_rgba(0,0,0,0.8),0_2px_0_rgba(255,255,255,0.05)]
                                                            ${isExecuting ? 'border-(--amber) text-(--amber) animate-spin' :
                                                            feedback === 'correct' ? 'border-(--green-base) text-(--green-light) shadow-[0_0_20px_var(--green-base)]' :
                                                                'border-[#363D4C] text-[#363D4C] group-hover:border-(--green-muted) group-hover:text-(--green-light)'}
                                                        `}>
                                                        <Play size={28} fill={feedback === 'correct' ? 'currentColor' : 'none'} strokeWidth={3} />
                                                    </div>
                                                </div>
                                            </div>
                                        </button>

                                        <Screw corner="tl" size="sm" />
                                        <Screw corner="tr" size="sm" />
                                        <Screw corner="bl" size="sm" />
                                        <Screw corner="br" size="sm" />
                                    </div>

                                    {/* 3. MÓDULO DE TELEMETRÍA (Monitor de Recursos) */}
                                    <div className="hidden md:flex w-[260px] relative p-2 bg-black/40 rounded-sm shadow-[inset_0_4px_15px_rgba(0,0,0,0.9)] border border-white/5 overflow-hidden">
                                        <div className="absolute inset-0 pointer-events-none bg-linear-to-tr from-white/1 via-transparent to-white/3 z-20" />

                                        <div className="flex flex-col gap-4 w-full p-2 justify-center relative z-10">
                                            {/* CPU BAR */}
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between font-mono text-[8px] uppercase font-black text-(--text-muted) tracking-widest">
                                                    <span className="flex items-center gap-1.5"><Activity size={10} /> CPU_LOAD</span>
                                                    <span className={isExecuting ? 'text-(--amber)' : 'text-(--green-muted)'}>{isExecuting ? '98%' : '01%'}</span>
                                                </div>
                                                <div className="h-1.5 bg-black rounded-full p-px border border-white/5">
                                                    <div className={`h-full bg-(--green-base) transition-all duration-500 shadow-[0_0_8px_var(--green-base)] ${isExecuting ? 'w-full' : 'w-[5%]'}`} />
                                                </div>
                                            </div>

                                            {/* MEMORY BLOCKS */}
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between font-mono text-[8px] uppercase font-black text-(--text-muted) tracking-widest">
                                                    <span className="flex items-center gap-1.5"><Cpu size={10} /> BUFFER_STACK</span>
                                                    <span>{flatBlocks(program).length} / {data.maxBlocks}</span>
                                                </div>
                                                <div className="flex gap-1 h-4">
                                                    {Array.from({ length: 12 }).map((_, i) => {
                                                        const active = ((i + 1) / 12) <= (flatBlocks(program).length / data.maxBlocks);
                                                        return (
                                                            <div
                                                                key={i}
                                                                className={`flex-1 border border-black shadow-[inset_0_1px_2px_rgba(255,255,255,0.02)] transition-all ${active ? 'bg-(--blue) shadow-[0_0_8px_var(--blue)]' : 'bg-white/5'}`}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                        <Screw corner="tr" size="sm" />
                                        <Screw corner="bl" size="sm" />
                                    </div>
                                </div>
                            </footer>
                        </main>
                    </div>
                </div>

                {/* Panel derecho — Monitor, Pista y Resumen de Pseudocódigo */}
                <aside id="logic-simulator" className="w-full md:w-[400px] shrink-0 bg-(--bg-deep) border-t-[3px] md:border-t-0 md:border-l-[3px] border-black flex flex-col relative overflow-hidden z-20 shadow-[-5px_0_15px_rgba(0,0,0,0.6)]">

                    <div className="flex-1 overflow-y-auto flex flex-col gap-6 custom-scrollbar relative z-10">

                        {/* ========================================================
                            SECCIÓN 1: MONITOR DE PROCESO (Pantalla CRT Hundida)
                        ======================================================== */}
                        {/* Placa superior del monitor */}
                        <SectionHeader title="MONITOR_PROCESO" subtitle="SEC_02 // MON_PRO" />
                        <section className="px-4">

                            <div className="font-mono text-[9px] text-(--text-muted) uppercase tracking-widest mb-2 font-bold flex items-center gap-2">
                                <span className="w-2 h-2 border-t border-l border-(--text-muted) opacity-50" />
                                EJECUCIÓN_EN_TIEMPO_REAL
                            </div>

                            {/* Chasis de la Pantalla (Bisel invertido para que parezca un agujero) */}
                            <div className="bg-(--bg-void) p-2 rounded-[2px] border-t-2 border-l-2 border-black border-b border-r  shadow-[inset_0_8px_20px_rgba(0,0,0,1)] relative overflow-hidden mt-1">
                                {/* Reflejo de cristal curvo sobre la cuadrícula */}
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
                        </section>

                        {/* ========================================================
            SECCIÓN 2: MISIÓN (Placa Metálica Atornillada)
            ======================================================== */}
                        <section>
                            <div className="font-mono text-[10px] text-(--text-muted) uppercase tracking-[0.15em] mb-2 font-black flex items-center gap-2 drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
                                <span className="w-4 h-px bg-(--text-muted) shadow-[0_1px_0_rgba(0,0,0,0.8)]" />
                                <span>MISIÓN_ACTUAL</span>
                            </div>

                            {/* Placa física que sobresale del chasis */}
                            <div className="bg-(--bg-elevated) p-3 rounded-[2px] border-t border-l  border-b-2 border-r-[3px] border-black shadow-[3px_3px_0_rgba(0,0,0,0.6)] relative">
                                {/* Tornillos */}
                                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-(--bg-void) shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center">
                                    <div className="w-px h-[3px] bg-(--border-color) rotate-45" />
                                </div>
                                <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-(--bg-void) shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center">
                                    <div className="w-px h-[3px] bg-(--border-color) -rotate-12" />
                                </div>

                                <div className="font-mono text-[12px] text-white/90 leading-relaxed relative z-10">
                                    {level.description}
                                </div>
                            </div>
                        </section>

                        {/* ========================================================
            SECCIÓN 3: PISTA (Etiqueta de Advertencia Industrial)
            ======================================================== */}
                        <section>
                            <div className="font-mono text-[10px] text-(--text-muted) uppercase tracking-[0.15em] mb-2 font-black flex items-center gap-2 drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">
                                <span className="w-4 h-px bg-(--text-muted) shadow-[0_1px_0_rgba(0,0,0,0.8)]" />
                                <span>INFO_SISTEMA</span>
                            </div>

                            {/* Etiqueta de Hazard (Hundida en el metal) */}
                            <div className="bg-(--bg-void) border border-black border-b-(--bg-hover) border-r-(--bg-hover) border-l-4 border-l-(--amber) p-3 text-[11px] text-(--amber) leading-relaxed font-mono shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] relative overflow-hidden">
                                {/* Patrón de franjas de peligro sutil en la esquina */}
                                <div className="absolute top-0 right-0 w-12 h-12 opacity-10 bg-[repeating-linear-gradient(-45deg,transparent,transparent_3px,var(--amber)_3px,var(--amber)_6px)] pointer-events-none" />

                                <span className="relative z-10 drop-shadow-[0_0_2px_rgba(184,107,37,0.4)]">
                                    {data.hint}
                                </span>
                            </div>
                        </section>

                        {/* ========================================================
            SECCIÓN 4: RESUMEN (Terminal de Texto)
            ======================================================== */}
                        {program.length > 0 && (
                            <section className="mt-auto pt-4">
                                {/* Header Técnico y Limpio */}
                                <div className="flex items-center justify-between mb-2 px-1">
                                    <div className="font-mono text-[10px] text-(--text-muted) uppercase tracking-widest font-black flex items-center gap-2">
                                        {/* Pequeño cuadrado de hardware en lugar de texto morado */}
                                        <span className="w-2 h-2 bg-(--border-color) shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />
                                        OUTPUT_SECUENCIA
                                    </div>
                                    {/* Indicador de estado del log */}
                                    <div className="font-mono text-[8px] text-(--green-muted) tracking-widest bg-(--green-muted)/10 px-1.5 py-0.5 rounded-[2px] border border-(--green-muted)/20">
                                        ACTIVO
                                    </div>
                                </div>

                                {/* Pantalla LCD Limpia (Sin ruido, solo profundidad) */}
                                <div className="bg-[#06080B] rounded-[2px] border-t-2 border-l-2 border-[#020203] border-b border-r p-3 relative shadow-[inset_0_6px_15px_rgba(0,0,0,1)]">

                                    {/* Reflejo de cristal pulido (Un degradado diagonal limpio, CERO líneas) */}
                                    <div className="absolute inset-0 pointer-events-none bg-linear-to-tr from-white/5 via-transparent to-white/10 z-10" />

                                    {/* Sombra interior extra arriba para dar más sensación de que está hundido */}
                                    <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-b from-black/50 to-transparent pointer-events-none z-10" />

                                    {/* El Código - 100% Legible y Limpio */}
                                    <div className="relative z-0">
                                        <PseudocodeSummary blocks={program} />
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </aside>

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
