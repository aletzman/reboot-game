'use client'

import React, { useState } from 'react'
import { useDroppable } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
import { PackageOpen, GripVertical, ChevronDown, Plus, Minus, ArrowDownToLine, Cpu } from 'lucide-react'
import { LogicAssemblyBlock, LogicAssemblyBlockType } from '@/types/game'
import { BlockDef } from './types'
import { CloseButton } from '@/components/ui/CloseButton'

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

// ============================================================================
// 1. ZONA DE ANIDAMIENTO (ZÓCALO PARA BLOQUES HIJOS)
// ============================================================================
function ChildrenDroppable({ parentId, childrenCount, isLoop, children, borderColor }: { parentId: string, childrenCount: number, isLoop: boolean, children: React.ReactNode, borderColor: string }) {
    const { ref, isDropTarget } = useDroppable({
        id: `children-${parentId}`,
        data: { isWorkspace: true }
    })

    const isEmpty = childrenCount === 0

    return (
        <div
            ref={ref}
            className={`
                relative transition-all duration-300 rounded-sm group/nest
                ${isDropTarget ? 'bg-(--bg-hover) ring-2 ring-dashed ring-(--green-muted)/30 my-4 shadow-[inset_0_4px_15px_rgba(0,0,0,0.8)] z-20' : 'z-auto'}
            `}
        >
            {/* Hit area */}
            <div className="absolute -inset-4 -inset-x-8 -bottom-8 pointer-events-auto z-0" />

            {/* Contenido */}
            <div className="relative z-10 flex flex-col gap-2 min-h-[4px]">
                {children}
            </div>

            {/* ESTADO: Arrastrando sobre el zócalo */}
            {isDropTarget && (
                <div className="h-14 border border-dashed border-(--green-base) bg-[#050608] flex items-center justify-center gap-3 mt-2 relative z-20 shadow-[inset_0_0_20px_rgba(85,226,0,0.1)]">
                    <ArrowDownToLine className="text-(--green-light) animate-bounce" size={16} />
                    <span className="font-mono text-[9px] text-(--green-light) uppercase tracking-[0.4em] font-black drop-shadow-[0_0_8px_rgba(85,226,0,0.8)]">
                        INSERTAR_MOD
                    </span>
                    {/* Guías de mira táctica */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-(--green-base)/50" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-(--green-base)/50" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-(--green-base)/50" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-(--green-base)/50" />
                </div>
            )}

            {/* ESTADO: Zócalo Vacío */}
            {!isDropTarget && isEmpty && (
                <div className="py-6 px-4 border border-dashed border-(--border-muted-color) bg-black/40 flex flex-col items-center justify-center gap-2 opacity-40 hover:opacity-80 transition-all select-none hover:bg-(--bg-surface) hover:border-(--border-color) cursor-pointer">
                    <div className="flex items-center gap-2 text-(--text-ghost)">
                        <span className="font-mono text-[10px] uppercase font-black tracking-widest">[</span>
                        <PackageOpen size={14} className="opacity-50" />
                        <span className="font-mono text-[10px] uppercase font-black tracking-widest">]</span>
                    </div>
                    <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-(--text-ghost) font-bold text-center">
                        ZÓCALO_VACÍO
                    </span>
                </div>
            )}
        </div>
    )
}

// ============================================================================
// 2. COMPONENTE PRINCIPAL DEL BLOQUE
// ============================================================================
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

    const { ref: nodeRef, handleRef, isDragging, isDropTarget } = useSortable({
        id: block.id,
        index,
        disabled, modifiers: [RestrictToVerticalAxis],
        data: { ...block, depth, isWorkspace: true }
    })

    const def = availableDefs.find(d => d.type === block.type)!

    return (
        <div
            ref={nodeRef}
            className={`relative z-10 transition-all duration-200 ${isDragging ? 'z-50 opacity-85 scale-[1]' : ''}`}
            style={{ marginLeft: depth > 0 ? 24 : 0 }}
        >
            {/* Indentación visual (Cableado de hardware) */}
            {depth > 0 && (
                <div className="absolute -left-4 top-6 bottom-0 w-px border-l-2 border-dotted border-(--border-color)" />
            )}

            {/* CONTENEDOR FÍSICO DEL BLOQUE */}
            <div className="relative">
                <div
                    className={`
                        flex min-h-13 rounded-[2px] overflow-hidden bg-(--bg-elevated) border border-(--border-muted-color) group
                        ${isDragging ? 'shadow-none border-(--green-muted)/30' : 'shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.02)]'}
                    `}
                    style={{ borderLeft: `4px solid ${def.border}` }}
                >
                    {/* DRAG HANDLE (Textura Rugosa de Agarre) */}
                    <div
                        ref={handleRef}
                        className={`
                            w-8 bg-[#0a0c0f] border-r border-(--border-muted-color) flex items-center justify-center 
                            cursor-grab active:cursor-grabbing hover:bg-[#12161c] transition-colors group/handle touch-none
                            relative overflow-hidden
                            ${disabled ? 'hidden' : ''}
                        `}
                    >
                        {/* Patrón de estrías físicas */}
                        <div className="absolute inset-0 opacity-[0.15] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#fff_2px,#fff_3px)] pointer-events-none mix-blend-overlay" />
                        <GripVertical size={14} className="text-(--text-ghost) group-hover/handle:text-(--text-muted) transition-colors relative z-10" />
                    </div>

                    {/* CUERPO DEL BLOQUE (Inputs y Controles) */}
                    <div className="flex-1 p-2 flex flex-wrap items-center gap-3 relative overflow-hidden bg-linear-to-r from-transparent to-(--bg-surface)/30">

                        {/* Tornillos Industriales */}
                        <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-black border border-(--border-color) shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
                        <div className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-black border border-(--border-color) shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />

                        {/* Título / Definición */}
                        <div className="flex flex-col pl-1">
                            <span
                                className="font-bold tracking-[0.2em] text-[11px] uppercase leading-none drop-shadow-md"
                                style={{ color: def.border }}
                            >
                                {def.label}
                            </span>
                            <span className="font-mono text-[8px] text-(--text-muted) uppercase mt-0.5 opacity-60">
                                {block.type}
                            </span>
                        </div>

                        <div className="h-5 w-px bg-(--border-color) mx-1" />

                        {/* INPUTS DE VALOR (Tu lógica intacta, estilos pulidos) */}
                        {def.hasValue && (
                            <div className="flex items-center gap-2">

                                {/* Stepper de Números */}
                                {def.valueType === 'number' && (
                                    <div className="flex items-stretch bg-[#050608] rounded-sm border border-(--border-muted-color) overflow-hidden h-8 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] group/stepper focus-within:border-(--green-muted) transition-colors">
                                        <button
                                            onClick={() => !disabled && onValueChange(block.id, Math.max(1, (block.value as number) - 1))}
                                            disabled={disabled || (block.value as number) <= 1}
                                            className="px-2 flex items-center justify-center bg-(--bg-surface) hover:bg-(--bg-hover) text-(--text-muted) hover:text-(--amber) disabled:opacity-20 transition-colors border-r border-(--border-color) active:bg-black"
                                        >
                                            <Minus size={12} strokeWidth={3} />
                                        </button>
                                        <div className="w-10 flex items-center justify-center relative">
                                            <span className="font-mono text-[12px] font-black text-(--text-primary) tabular-nums drop-shadow-md">
                                                {block.value}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => !disabled && onValueChange(block.id, Math.min(20, (block.value as number) + 1))}
                                            disabled={disabled || (block.value as number) >= 20}
                                            className="px-2 flex items-center justify-center bg-(--bg-surface) hover:bg-(--bg-hover) text-(--text-muted) hover:text-(--green-light) disabled:opacity-20 transition-colors border-l border-(--border-color) active:bg-black"
                                        >
                                            <Plus size={12} strokeWidth={3} />
                                        </button>
                                    </div>
                                )}

                                {/* Selects (Dirección / Función) */}
                                {(def.valueType === 'direction' || (def.valueType === 'text' && block.type === 'LLAMAR')) && (
                                    <div className="relative group/input flex">
                                        <select
                                            value={block.value as string}
                                            onChange={e => onValueChange(block.id, e.target.value)}
                                            disabled={disabled}
                                            className="appearance-none bg-[#050608] rounded-sm pl-3 pr-8 h-8 font-mono text-[10px] min-w-[120px] outline-none border border-(--border-muted-color) focus:border-(--green-muted) text-(--text-primary) font-bold uppercase transition-colors shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] cursor-pointer"
                                        >
                                            {def.valueType === 'text' && <option value="" className="text-(--text-ghost)">-- SEL_FUNCIÓN --</option>}
                                            {(def.valueOptions || availableFunctions).map(opt => (
                                                <option key={opt} value={opt} className="bg-(--bg-elevated) text-white">{opt}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none group-hover/input:text-(--green-light) transition-colors">
                                            <ChevronDown size={12} strokeWidth={3} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Botón Eliminar (Apagado hasta hover) */}
                        <CloseButton
                            onClick={() => onRemove(block.id)}
                            size='xs'
                            disabled={disabled}
                            className="ml-auto opacity-40 hover:opacity-100 hover:text-(--red) hover:bg-(--red)/10 transition-all mr-2"
                        />
                    </div>
                </div>
            </div>

            {/* ===============================================================
                BLOQUES HIJOS (RUTINAS ANIDADAS)
                =============================================================== */}
            {block.children !== undefined && (
                <div className="ml-5 mt-1 pl-4 py-2 flex flex-col gap-2 relative">

                    {/* Cableado de Hardware (Esquina de anidamiento) */}
                    <div className="absolute left-0 top-0 bottom-4 w-px border-l-2 border-dotted" style={{ borderColor: def.border, opacity: 0.3 }} />
                    <div className="absolute left-0 bottom-4 w-3 h-px border-b-2 border-dotted" style={{ borderColor: def.border, opacity: 0.3 }} />

                    {/* Zócalo para soltar hijos */}
                    <ChildrenDroppable
                        parentId={block.id}
                        childrenCount={block.children.length}
                        isLoop={true}
                        borderColor={def.border}
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

                    {/* Botón Táctico para Acoplar Sub-Módulo */}
                    <div className="relative pt-1 z-10">
                        {!showChildPicker ? (
                            <button
                                onClick={() => setShowChildPicker(true)}
                                disabled={disabled}
                                className={`
                                    w-full flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-black/20 
                                    font-mono text-[9px] uppercase tracking-[0.2em] cursor-pointer group/socket transition-all 
                                    border border-dashed border-(--border-color) hover:border-(--cyan)/50 hover:bg-(--cyan)/5 
                                    text-(--text-ghost) hover:text-(--cyan)
                                    ${disabled ? 'opacity-30 cursor-not-allowed hidden' : ''}
                                `}
                            >
                                <Plus size={12} className="group-hover/socket:rotate-90 transition-transform" />
                                <span className="font-bold">ACOPLAR_MOD_INTERNO</span>
                            </button>
                        ) : (
                            <div className="bg-[#050608] border border-(--border-color) p-3 shadow-2xl rounded-sm">
                                <span className="block font-mono text-[8px] text-(--text-muted) uppercase tracking-widest mb-3 border-b border-(--border-color) pb-1">
                                    [ SEL_MOD_COMPATIBLE ]
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {availableDefs
                                        .filter(d => !d.hasChildren)
                                        .map(d => (
                                            <button
                                                key={d.type}
                                                onClick={() => { onAddChild(block.id, d.type); setShowChildPicker(false) }}
                                                className="px-3 py-1.5 border border-(--border-color) bg-(--bg-surface) hover:bg-(--bg-hover) transition-all cursor-pointer font-mono text-[9px] font-bold uppercase tracking-widest shadow-sm hover:shadow-md"
                                                style={{ borderLeft: `2px solid ${d.border}`, color: d.border }}
                                            >
                                                {d.label}
                                            </button>
                                        ))}
                                    <button
                                        onClick={() => setShowChildPicker(false)}
                                        className="px-3 py-1.5 bg-transparent border border-transparent text-(--text-ghost) hover:text-(--red) font-mono text-[8px] uppercase cursor-pointer transition-all"
                                    >
                                        [ CANCELAR ]
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