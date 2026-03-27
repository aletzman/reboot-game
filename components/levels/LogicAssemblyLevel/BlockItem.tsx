'use client'

import React, { useState } from 'react'
import { useDroppable } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { PackageOpen, GripVertical, ChevronUp, ChevronDown, Plus } from 'lucide-react'
import { LogicAssemblyBlock, LogicAssemblyBlockType } from '@/types/game'
import { BlockDef } from './types'
import { BLOCK_DEFS } from './constants'

interface BlockItemProps {
    block: LogicAssemblyBlock
    availableDefs: BlockDef[]
    onRemove: (id: string) => void
    onValueChange: (id: string, value: string | number) => void
    onAddChild: (parentId: string, type: LogicAssemblyBlockType) => void
    onMove: (id: string, direction: 'up' | 'down') => void
    availableFunctions: string[]
    index: number
    depth: number
    disabled?: boolean
}

// Sub-componente para el área de droppable de hijos (zona de anidamiento)
function ChildrenDroppable({ parentId, childrenCount, isLoop, children }: { parentId: string, childrenCount: number, isLoop: boolean, children: React.ReactNode }) {
    const { ref, isDropTarget } = useDroppable({
        id: `children-${parentId}`
    })

    const isEmpty = childrenCount === 0

    return (
        <div
            ref={ref}
            className={`
                relative transition-all duration-500 rounded-lg group/nest
                ${isDropTarget ? 'bg-(--green-base)/10 ring-4 ring-(--green-base)/30 ring-dashed my-6 scale-[1.02] z-40' : 'z-auto'}
            `}
        >
            {/* Hit area invisible pero EXTREMADAMENTE AMPLIA para capturar el drop en toda la indentación */}
            <div className="absolute -inset-4 -inset-x-12 -bottom-12 pointer-events-auto z-0" />

            {/* Contenido: Los hijos reales (z-10 para estar sobre el hit area) */}
            <div className="relative z-10 flex flex-col gap-3 min-h-[10px]">
                {children}
            </div>

            {isDropTarget && (
                <div className="h-16 border-2 border-dashed border-(--green-base)/60 rounded-xl bg-(--green-base)/20 animate-pulse shadow-[0_0_30px_rgba(85,226,0,0.2)] flex items-center justify-center gap-4 mt-4 relative z-20">
                    <div className="p-2 bg-(--green-base)/30 rounded-md">
                        <PackageOpen className="text-(--green-light)" size={20} />
                    </div>
                    <span className="font-mono text-[10px] text-(--green-light) uppercase tracking-[0.6em] font-bold">
                        CONECTANDO_MÓDULO...
                    </span>
                    <div className="w-24 h-1 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-(--green-light) animate-loading" style={{ width: '80%' }} />
                    </div>
                </div>
            )}

            {!isDropTarget && isEmpty && (
                <div className="py-8 px-8 border-2 border-dashed border-white/5 bg-black/20 rounded-xl flex flex-col items-center justify-center gap-3 opacity-20 hover:opacity-50 transition-all select-none hover:bg-black/40 cursor-pointer">
                    <div className="w-3 h-3 rounded-full bg-white/40 ring-4 ring-white/5 animate-pulse" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.5em] font-bold text-center">
                        SOCKET_VACÍO<br />
                        <span className="text-[7px] text-(--text-ghost)">// arrastra_módulos_aquí</span>
                    </span>
                </div>
            )}

            {!isDropTarget && !isEmpty && (
                <div className="h-4 mt-2 opacity-5 hover:opacity-20 transition-all border-t border-white/40 flex items-center justify-center">
                    <span className="font-mono text-[7px] uppercase tracking-widest text-white">área_de_acoplamiento_final</span>
                </div>
            )}
        </div>
    )
}



export function BlockItem({
    block,
    availableDefs,
    onRemove,
    onValueChange,
    onAddChild,
    onMove,
    availableFunctions,
    index,
    depth,
    disabled = false,
}: BlockItemProps) {
    const [showChildPicker, setShowChildPicker] = useState(false)

    // dnd-kit v0: ref para el nodo que se mueve, handleRef para el disparador del arrastre
    const { ref: nodeRef, handleRef, isDragging, isDropTarget } = useSortable({
        id: block.id,
        index,
        disabled
    })

    const def = availableDefs.find(d => d.type === block.type)!

    return (
        <div
            ref={nodeRef}
            className={`relative transition-all duration-300 ${isDragging ? 'opacity-20 scale-95 z-0' : 'z-10'}`}
            style={{ marginLeft: depth > 0 ? 32 : 0 }}
        >
            {/* Indicador de posición (Placeholder) al arrastrar sobre este item */}
            {isDropTarget && !isDragging && (
                <div className="absolute -top-4 left-0 right-0 h-10 border-2 border-dashed border-(--green-base)/40 rounded-lg bg-(--green-base)/5 animate-pulse z-0 flex items-center justify-start pl-12">
                    <div className="w-1.5 h-6 bg-(--green-base)/40 rounded-full" />
                    <span className="font-mono text-[9px] text-(--green-light)/60 uppercase tracking-[0.3em] font-bold ml-4">inyectar_bloque_aquí.sys</span>
                </div>
            )}

            {/* Indentación visual */}
            {depth > 0 && (
                <div className="absolute -left-6 top-10 bottom-0 w-px opacity-20 border-l border-dashed border-white/40" />
            )}

            {/* Contenedor del Bloque */}
            <div
                className={`relative transition-all duration-300 ${isDragging ? 'brightness-50' : ''} ${isDropTarget && !isDragging ? 'translate-y-12' : ''}`}
                style={{ filter: `drop-shadow(0 4px 12px rgba(0,0,0,0.6))` }}
            >
                <div
                    className={`flex items-stretch rounded-lg shadow-sm overflow-hidden transition-all duration-300 bg-(--bg-surface) group ${isDragging ? 'ring-2 ring-(--green-base)/40' : 'hover:translate-x-1'}`}
                    style={{ borderLeft: `4px solid ${def.border}` }}
                >
                    {/* MANIJA INDUSTRIAL (DRAG HANDLE) - UNICA FORMA DE COMPARTIR EL DRAG */}
                    <div
                        ref={handleRef}
                        className={`w-10 bg-black/40 border-r border-white/5 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing hover:bg-white/5 transition-colors group/handle ${disabled ? 'hidden' : ''}`}
                    >
                        <GripVertical size={18} className="text-(--text-ghost) group-hover/handle:text-(--green-light) transition-colors mb-1" />
                    </div>

                    {/* Cuerpo del bloque (Inputs y Controles) */}
                    <div className="flex-1 p-3.5 flex flex-wrap items-center gap-3 relative overflow-hidden">
                        {/* Tornillos decorativos */}
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-white/5 border border-white/5" />
                        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-white/5 border border-white/5" />

                        {/* Controles manuales de prioridad */}
                        <div className="flex flex-col border-r border-white/10 pr-2 mr-1">
                            <button
                                onClick={() => !disabled && onMove(block.id, 'up')}
                                disabled={disabled}
                                className="p-1 hover:bg-white/10 text-white/20 hover:text-(--green-light) transition-colors rounded"
                                title="Mover arriba"
                            >
                                <ChevronUp size={14} />
                            </button>
                            <button
                                onClick={() => !disabled && onMove(block.id, 'down')}
                                disabled={disabled}
                                className="p-1 hover:bg-white/10 text-white/20 hover:text-(--green-light) transition-colors rounded"
                                title="Mover abajo"
                            >
                                <ChevronDown size={14} />
                            </button>
                        </div>

                        {/* Título / Definición */}
                        <div className="flex flex-col">
                            <span
                                className="font-bold tracking-[.2em] text-[10px] uppercase leading-none"
                                style={{ color: def.border, textShadow: `0 0 10px ${def.border}44` }}
                            >
                                {def.label}
                            </span>
                            <span className="font-mono text-[8px] text-(--text-ghost) uppercase mt-1">type::{block.type}</span>
                        </div>

                        <div className="h-4 w-px bg-white/10 mx-1" />

                        {/* Input de Valor */}
                        {def.hasValue && (
                            <div className="flex items-center gap-2">
                                {def.valueType === 'number' && (
                                    <input
                                        type="number"
                                        min={1} max={20}
                                        value={block.value as number}
                                        onChange={e => onValueChange(block.id, parseInt(e.target.value) || 1)}
                                        disabled={disabled}
                                        className="bg-black/60 rounded-sm px-2 py-1 font-mono text-[12px] w-14 outline-none border border-white/10 focus:border-(--green-base) text-(--green-muted) text-center"
                                    />
                                )}
                                {def.valueType === 'direction' && (
                                    <select
                                        value={block.value as string}
                                        onChange={e => onValueChange(block.id, e.target.value)}
                                        disabled={disabled}
                                        className="bg-black/60 rounded-sm px-2 py-1 font-mono text-[11px] min-w-[100px] outline-none border border-white/10 focus:border-(--green-base) text-(--green-muted) uppercase"
                                    >
                                        {def.valueOptions?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                )}
                                {def.valueType === 'text' && (
                                    block.type === 'LLAMAR' ? (
                                        <select
                                            value={block.value as string}
                                            onChange={e => onValueChange(block.id, e.target.value)}
                                            disabled={disabled}
                                            className="bg-black/60 rounded-sm px-3 py-1 font-mono text-[11px] w-[140px] outline-none border border-white/10 focus:border-(--green-base) text-(--green-muted) font-bold"
                                        >
                                            <option value="">-- select_fn --</option>
                                            {availableFunctions.map(fn => <option key={fn} value={fn}>{fn}</option>)}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            value={block.value as string}
                                            onChange={e => onValueChange(block.id, e.target.value)}
                                            disabled={disabled}
                                            className="bg-black/60 rounded-sm px-3 py-1 font-mono text-[11px] w-[140px] outline-none border border-white/10 focus:border-(--green-base) text-(--green-muted) font-bold"
                                            spellCheck={false}
                                        />
                                    )
                                )}
                            </div>
                        )}

                        {/* Botón Eliminar */}
                        <button
                            onClick={() => onRemove(block.id)}
                            disabled={disabled}
                            className={`ml-auto p-1.5 hover:bg-red-500/20 text-white/20 hover:text-(--red) rounded transition-all active:scale-95 ${disabled ? 'opacity-10 cursor-not-allowed' : ''}`}
                        >
                            <span className="text-[10px] font-mono leading-none font-bold">[X]</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Contenedor recursivo para hijos */}
            {block.children !== undefined && (
                <div className="ml-8 mt-1 pl-6 py-4 flex flex-col gap-3 relative">
                    {/* Línea de conexión visual */}
                    <div className="absolute left-0 top-0 bottom-4 w-px opacity-20 border-l border-dashed" style={{ borderColor: def.border }} />
                    <div className="absolute left-0 bottom-4 w-4 h-px opacity-20 border-b border-dashed" style={{ borderColor: def.border }} />

                    <ChildrenDroppable
                        parentId={block.id}
                        childrenCount={block.children.length}
                        isLoop={true}
                    >
                        {block.children.map((child, cIdx) => (
                            <BlockItem
                                key={child.id}
                                index={cIdx}
                                block={child}
                                availableDefs={availableDefs}
                                onRemove={onRemove}
                                onValueChange={onValueChange}
                                onAddChild={onAddChild}
                                onMove={onMove}
                                availableFunctions={availableFunctions}
                                depth={depth + 1}
                                disabled={disabled}
                            />
                        ))}
                    </ChildrenDroppable>

                    {/* Selector de sub-bloques */}
                    <div className="relative pt-1">
                        {!showChildPicker ? (
                            <button
                                onClick={() => setShowChildPicker(true)}
                                disabled={disabled}
                                className={`w-full flex items-center justify-center gap-3 px-5 py-3 rounded bg-black/10 font-mono text-[9px] uppercase tracking-[0.3em] cursor-pointer group/socket transition-all border border-dashed border-white/5 hover:border-(--green-base)/30 hover:bg-(--green-base)/5 text-(--text-ghost) hover:text-(--green-light) ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                            >
                                <Plus size={14} className="group-hover/socket:rotate-90 transition-transform" />
                                <span className="font-bold">acoplar_sub_modulo.sys</span>
                            </button>
                        ) : (
                            <div className="bg-(--bg-surface) border border-white/10 p-4 shadow-2xl animate-fade-in-up">
                                <span className="block font-mono text-[9px] text-(--text-ghost) uppercase tracking-widest mb-3 border-b border-white/5 pb-1">Seleccionar_módulo_secundario</span>
                                <div className="flex flex-wrap gap-2">
                                    {availableDefs
                                        .filter(d => !d.hasChildren)
                                        .map(d => (
                                            <button
                                                key={d.type}
                                                onClick={() => { onAddChild(block.id, d.type); setShowChildPicker(false) }}
                                                className="px-4 py-2 border border-white/5 bg-black/40 hover:bg-white/5 transition-all cursor-pointer font-mono text-[10px] font-bold uppercase tracking-tighter"
                                                style={{ borderLeft: `2px solid ${d.border}`, color: d.border }}
                                            >
                                                {d.label}
                                            </button>
                                        ))}
                                    <button
                                        onClick={() => setShowChildPicker(false)}
                                        className="px-4 py-2 bg-white/5 text-(--text-muted) hover:text-(--red) font-mono text-[9px] uppercase cursor-pointer transition-all"
                                    >
                                        [ abortar ]
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
