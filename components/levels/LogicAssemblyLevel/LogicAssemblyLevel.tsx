'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { DragDropProvider, useDroppable, DragOverlay } from '@dnd-kit/react'
import { Play, Activity, RefreshCcw, Cpu, AlertTriangle, PlayCircle } from 'lucide-react'
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
import { TacticalSection } from '@/components/ui/TacticalSection'
import { DirectivesPanel } from '@/components/ui/DirectivesPanel'
import { SequenceMemory } from '@/components/ui/MemorySequence'





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

                    <div className="flex-1 flex flex-col md:flex-row  overflow-hidden relative bg-(--bg-void)">

                        {/* Overlay de bloqueo global cuando hay ejecución o error */}
                        {isInteractionDisabled && (
                            <div className="absolute inset-0 z-50 bg-black/5 cursor-not-allowed" />
                        )}

                        {/* Panel izquierdo — paleta de bloques */}
                        <aside id="logic-palette" className="w-full md:w-[290px] shrink-0 bg-(--bg-deep) border-b md:border-b-0 md:border-r border-(--border-color)  border-t-0 flex flex-col relative overflow-hidden z-20">

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

                            {/* 3. PANEL INFERIOR: Métricas del Sistema (CPU & Memoria) */}
                            <SequenceMemory
                                isExecuting={isExecuting}
                                usedBlocks={flatBlocks(program).length}
                                maxBlocks={data.maxBlocks}
                            />
                        </aside>

                        {/* Panel central — Sequenciador */}
                        <main className="flex-1 flex flex-col bg-(--bg-void) relative h-[calc(100svh-130px)]">
                            <div className="flex flex-row  h-full">
                                <div
                                    id="logic-workspace"
                                    ref={rootDropRef}
                                    className={`flex-1 h-[calc(100svh-305px)] overflow-y-auto custom-scrollbar overflow-x-hidden p-8 transition-all duration-500 border flex flex-col gap-3 ${isRootWorkspaceHover ? 'bg-(--green-base)/5 border-(--green-base)/30' :
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
                                <div className="flex flex-col w-[300px] p-2 py-4">
                                    {/* ========================================================
                                        SECCIÓN 2: MISIÓN (Placa Metálica Atornillada)
                                    ======================================================== */}
                                    <TacticalSection title="MISIÓN_ACTUAL" >
                                        <div className="font-mono text-[12px] text-white/90 leading-relaxed relative z-10">
                                            {level.description}
                                        </div>
                                    </TacticalSection>

                                    {/* ========================================================
                                SECCIÓN 3: PISTA (Etiqueta de Advertencia Industrial)
                        ======================================================== */}
                                    <TacticalSection title="INFO_SISTEMA" variant="hazard">
                                        <span className="relative z-10 ">
                                            {data.hint}
                                        </span>
                                    </TacticalSection>
                                </div>
                            </div>
                            <footer className="h-[100px] border-t border-(--border-color) bg-(--bg-surface) relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.9)]">

                                {/* TEXTURA DE FIBRA (Herencia del SectionHeader) */}
                                <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(45deg,rgba(0,0,0,0)_45%,#fff_50%,rgba(0,0,0,0)_55%)] bg-size-[3px_3px] pointer-events-none" />

                                {/* BISEL DE LUZ SUPERIOR CNC */}
                                <div className="absolute inset-x-0 top-0 h-px bg-white/8 z-30 pointer-events-none" />

                                <div className="flex h-full items-stretch">

                                    {/* ─── COLUMNA IZQUIERDA: CONTROLES DE EJECUCIÓN (70% del ancho) ─── */}
                                    <div className="flex-1 flex items-stretch gap-3 p-3 border-r border-(--border-color) bg-(--bg-deep)/50">

                                        {/* 1. BOTÓN PURGAR (Compacto Vertical) */}
                                        <button
                                            onClick={() => !isInteractionDisabled && setProgram([])}
                                            disabled={isInteractionDisabled || program.length === 0}
                                            className="group relative w-19 flex flex-col items-center cursor-pointer justify-center bg-(--bg-void) border border-black rounded-xs transition-all active:translate-y-0.5 disabled:opacity-20 shadow-[0_4px_0_#000]"
                                        >
                                            <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#fff_5px,#fff_7px)]" />
                                            <RefreshCcw size={14} className="text-(--red) group-hover:rotate-180 transition-transform duration-500 mb-1" />
                                            <span className="text-[9px] font-mono font-black text-(--red)/90  tracking-widest uppercase">BORRAR_TODO</span>
                                        </button>

                                        {/* 2. BOTÓN PRINCIPAL (Slim Injector) */}
                                        <div className="flex-1 relative group">
                                            <button
                                                onClick={handleCheck}
                                                disabled={program.length === 0 || isInteractionDisabled}
                                                className={`relative w-full h-full flex items-center justify-between px-6 rounded-xs transition-all overflow-hidden border border-black
                                                            bg-(--bg-void) cursor-pointer shadow-[0_4px_0_#050608,inset_0_1px_0_rgba(255,255,255,0.05)]
                                                            active:translate-y-1 active:shadow-none disabled:opacity-30`}>
                                                {/* Lume de estado (Slim LED) */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500
                        ${feedback === 'correct' ? 'bg-(--green-base) shadow-[2px_0_15px_var(--green-base)]' :
                                                        feedback === 'wrong' ? 'bg-(--red) shadow-[2px_0_15px_var(--red)]' :
                                                            isExecuting ? 'bg-(--amber) shadow-[2px_0_15px_var(--amber)] animate-pulse' : 'bg-white/5'}
                    `} />

                                                <div className="flex flex-col items-start gap-0.5">
                                                    <span className="font-mono text-[8px] text-(--text-ghost) tracking-[0.3em] font-black opacity-50 uppercase">MODULE_V4_EXEC</span>
                                                    <span className={`font-mono text-lg font-black tracking-tighter uppercase transition-colors
                            ${feedback === 'wrong' ? 'text-(--red-light)' : isExecuting ? 'text-(--amber)' : 'text-white'}
                        `}>
                                                        {isExecuting ? '>> RUN_PROC' : feedback === 'correct' ? 'SEC_OK' : feedback === 'wrong' ? 'ERR_FATAL' : 'START_SEQ'}
                                                    </span>
                                                </div>

                                                {/* Mini Visualizer */}
                                                <div className="flex gap-1 items-end h-6 opacity-40">
                                                    {[...Array(12)].map((_, i) => (
                                                        <div key={i} className={`w-[2px] transition-all ${isExecuting ? 'bg-(--amber) animate-bounce' : 'bg-white/20'}`}
                                                            style={{ height: isExecuting ? `${Math.random() * 100}%` : '20%', transitionDelay: `${i * 30}ms` }} />
                                                    ))}
                                                </div>

                                                <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-black/40 shadow-inner
                        ${feedback === 'correct' ? 'text-(--green-base) shadow-[0_0_15px_var(--green-base)]' : 'text-(--text-muted)'}
                    `}>
                                                    <Play size={18} fill={feedback === 'correct' ? 'currentColor' : 'none'} />
                                                </div>
                                            </button>
                                            <Screw corner="tl" size="sm" />
                                            <Screw corner="br" size="sm" />
                                        </div>
                                    </div>

                                    {/* ─── COLUMNA DERECHA: SECCIÓN DE AYUDA / DOCS (30% del ancho) ─── */}
                                    <div className="w-[320px] bg-(--bg-void) p-3 relative flex flex-col justify-center border-l border-white/5 shadow-[inset_10px_0_20px_rgba(0,0,0,0.5)]">

                                        {/* Header de la Ayuda */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-1.5 h-1.5 bg-(--amber) rounded-full shadow-[0_0_5px_var(--amber)] animate-pulse" />
                                            <span className="text-[9px] font-mono font-black text-(--text-ghost) tracking-widest uppercase">DOCS_ASSISTANT</span>
                                        </div>

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
                            </footer>
                        </main>
                    </div>
                </div>
                {/* Panel derecho — Monitor, Pista y Resumen de Pseudocódigo */}
                <aside id="logic-simulator" className="w-full md:w-[400px] shrink-0 bg-(--bg-deep) border-t md:border-t md:border-l border-(--border-color) flex flex-col relative overflow-hidden z-20 shadow-[-5px_0_15px_rgba(0,0,0,0.6)]">
                    {/* Placa superior del monitor */}
                    <SectionHeader title="MONITOR_PROCESO" subtitle="SEC_02 // MON_PRO" />

                    <div className="flex-1 overflow-y-auto flex flex-col pt-4 custom-scrollbar relative z-10">

                        {/* ========================================================
                            SECCIÓN 1: MONITOR DE PROCESO (Pantalla CRT Hundida)
                        ======================================================== */}
                        <TacticalSection title="EJECUCIÓN_EN_TIEMPO_REAL" variant="inset">
                            {/* Chasis de la Pantalla (Bisel invertido para que parezca un agujero) */}
                            <div className="bg-(--bg-void) relative overflow-hidden">
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
                        </TacticalSection>


                        <TacticalSection title="OUTPUT_SECUENCIA" variant="inset">
                            {/* ========================================================
    SECCIÓN 4: RESUMEN (Terminal de Salida Táctica)
    ======================================================== */}
                            <div className="h-88 overflow-hidden bg-[#05070A] border border-black shadow-[inset_0_2px_15px_rgba(0,0,0,1)] relative group/terminal">

                                {/* 1. HEADER DE LA TERMINAL (Estilo REBOOT) */}
                                <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-black/40">
                                    <div className="flex items-center gap-2">
                                        {/* Indicador de actividad sutil */}
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

                                {/* 2. ÁREA DE CONTENIDO (Scrollable) */}
                                <div className="h-[calc(100%-32px)] overflow-y-auto custom-scrollbar p-4 relative">

                                    {/* Líneas de guía técnicas sutiles (ADN Bit Lógico) */}
                                    <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#fff_1px,transparent_1px)] bg-size-[40px_100%] pointer-events-none" />

                                    <div className="relative z-10 font-mono text-[11px] leading-tight antialiased">
                                        <PseudocodeSummary blocks={program} />

                                        {/* Cursor Táctico (Cuadrado sólido pequeño) */}
                                        <div className="inline-block w-1.5 h-3 bg-(--text-primary) opacity-30 animate-pulse ml-1 align-middle" />
                                    </div>
                                </div>

                                {/* 3. DECORACIÓN DE ESQUINA (Corte CNC) */}
                                <div className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none opacity-10">
                                    <div className="absolute bottom-1 right-1 w-full h-px bg-white -rotate-45" />
                                </div>

                                {/* Overlay de profundidad (Viñeta técnica suave) */}
                                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.6)]" />
                            </div>
                        </TacticalSection>
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
