'use client'

import React, { useState } from 'react'
import { useDroppable } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
import { PackageOpen, ChevronDown, Plus, Minus, ArrowDownToLine } from 'lucide-react'
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
    parentId: string
    disabled?: boolean
    isOverlay?: boolean
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
            {/* Hit area expandida para captar arrastres desde la izquierda (indentación) */}
            <div className="absolute -inset-4 -left-16 -inset-x-8 -bottom-8 pointer-events-auto z-0" />

            {/* Contenido */}
            <div className="relative z-10 flex flex-col gap-2 min-h-[4px]">
                {children}
            </div>            {/* ESTADO: Arrastrando sobre el zócalo */}
            {isDropTarget && (
                <div className="h-10 border border-dashed border-(--green-base)/40 bg-(--green-base)/5 flex items-center justify-center gap-3 mt-2 relative z-20 rounded-xs">
                    <ArrowDownToLine className="text-(--green-light) opacity-50 animate-bounce" size={14} />
                    <span className="font-mono text-[8px] text-(--green-light) uppercase tracking-[0.4em] font-black">
                        INSERTAR_MOD
                    </span>
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
    parentId,
    disabled = false,
    isOverlay = false,
}: BlockItemProps) {
    const [showChildPicker, setShowChildPicker] = useState(false)

    const { ref: nodeRef, targetRef, handleRef, isDragging } = useSortable({
        id: `${block.id}__drop`,
        index,
        disabled: disabled || isOverlay, 
        data: { ...block, depth, isWorkspace: true, parentId }
    })

    const def = availableDefs.find(d => d.type === block.type)!

    // Si es un overlay, no necesitamos el wrapper de sortable completo
    const containerProps = isOverlay ? {} : {
        ref: (element: HTMLDivElement | null) => {
            nodeRef(element);
            if (!isDragging) targetRef(element);
        }
    };

    return (
        <div
            {...containerProps}
            className={`relative z-10 transition-shadow duration-200 ${isDragging && !isOverlay ? 'opacity-20 grayscale scale-95' : ''} ${isOverlay ? 'z-50 pointer-events-none' : ''}`}
            style={{ marginLeft: (depth > 0 && !isOverlay) ? 24 : 0 }}
        >

            {/* Indentación visual (Cableado de hardware) */}
            {depth > 0 && (
                <div
                    className="absolute top-6 bottom-0 w-px border-l-2 border-dotted border-(--border-color) opacity-40"
                    style={{ left: 16 }}
                />
            )}


            {/* CONTENEDOR FÍSICO (Cartucho Rugerizado REBOOT - Calibración de Luz Clara) */}
            <div
                className={`
                    relative flex min-h-[50px] w-full rounded-[2px] bg-[#1F242D] /* <-- Más luz en el chasis principal */
                    /* BISELADO ASIMÉTRICO: Los bordes de luz ahora son más claros para reflejar el nuevo fondo */
                    border-t border-l  cursor-grab
                    border-b-2 border-r-[3px] border-[#050608]
                    transition-all duration-150 group 
                    ${disabled ? 'opacity-50 grayscale' : ''}
                `}
            >
                {/* 1. INDICADOR DE COLOR */}
                <div
                    className="w-[6px] h-full border-r border-[#050608] shadow-[inset_-2px_0_4px_rgba(0,0,0,0.4)]"
                    style={{ backgroundColor: '#FFFFFF' }}
                />

                {/* 2. DRAG HANDLE (Placa metálica aclarada) */}
                <div
                    //ref={handleRef}
                    className={`
                        w-8 bg-[#161A20] /* <-- Placa base con más luz */
                        border-r border-[#363D4C] flex flex-col items-center justify-between py-1.5
                        /*cursor-grab active:cursor-grabbing touch-none*/ relative
                        ${disabled ? 'hidden' : ''}
                    `}
                >
                    {/* Tornillo superior */}
                    <div className="w-1.5 h-1.5 rounded-full bg-[#050608] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex items-center justify-center">
                        <div className="w-px h-[3px] bg-[#363D4C] rotate-45" />
                    </div>

                    {/* Estrías de agarre */}
                    <div className="flex flex-col gap-[3px] w-full px-[5px] opacity-80">
                        <div className="h-[2px] w-full bg-[#050608] border-b border-[#363D4C]" />
                        <div className="h-[2px] w-full bg-[#050608] border-b border-[#363D4C]" />
                        <div className="h-[2px] w-full bg-[#050608] border-b border-[#363D4C]" />
                    </div>

                    {/* Tornillo inferior */}
                    <div className="w-1.5 h-1.5 rounded-full bg-[#050608] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex items-center justify-center">
                        <div className="w-px h-[3px] bg-[#363D4C] -rotate-12" />
                    </div>
                </div>

                {/* 3. CUERPO DEL MÓDULO */}
                <div className="flex-1 p-2 pl-3 flex flex-wrap items-center gap-3 relative overflow-hidden">

                    {/* Título Stamped */}
                    <div className="flex flex-col justify-center relative z-10 min-w-18">
                        <span
                            className="font-black tracking-[0.15em] text-[11px] uppercase leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,1)]"
                            style={{ color: def.border }}
                        >
                            {def.label}
                        </span>
                        <span className="font-mono text-[8px] text-(--text-muted) uppercase mt-[3px] font-bold">
                            <span className="opacity-40">TIPO:</span> {block.type}
                        </span>
                    </div>

                    {/* Separador físico */}
                    <div className="h-6 w-[2px] bg-[#050608] mx-1 border-r border-[#363D4C] relative z-10" />

                    {/* 4. INPUTS DE VALOR (Módulos LCD) */}
                    {def.hasValue && (
                        <div className="flex items-center gap-2 relative z-10">

                            {/* Stepper Numérico Mecánico */}
                            {def.valueType === 'number' && (
                                <div className="flex items-stretch bg-[#050608] rounded-sm border-t border-l border-[#050608] border-b border-r overflow-hidden h-7 shadow-[inset_0_2px_4px_rgba(0,0,0,1)]">
                                    <button
                                        onClick={() => !disabled && onValueChange(block.id, Math.max(1, (block.value as number) - 1))}
                                        disabled={disabled || (block.value as number) <= 1}
                                        className="px-2 flex items-center justify-center bg-[#181C23] hover:bg-[#20252D] text-(--text-muted) hover:text-(--amber) active:bg-black border-r border-[#050608] transition-colors cursor-pointer"
                                    >
                                        <Minus size={12} strokeWidth={4} />
                                    </button>
                                    <div className="w-10 flex items-center justify-center relative bg-[#0A0C0F]">
                                        <span className="font-mono text-[13px] font-bold text-white tabular-nums drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]">
                                            {block.value}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => !disabled && onValueChange(block.id, Math.min(20, (block.value as number) + 1))}
                                        disabled={disabled || (block.value as number) >= 20}
                                        className="px-2 flex items-center justify-center bg-[#181C23] hover:bg-[#20252D] text-(--text-muted) hover:text-(--green-light) active:bg-black border-l border-[#050608] transition-colors cursor-pointer"
                                    >
                                        <Plus size={12} strokeWidth={4} />
                                    </button>
                                </div>
                            )}

                            {/* Selectores */}
                            {(def.valueType === 'direction' || (def.valueType === 'text' && block.type === 'LLAMAR')) && (
                                <div className="relative flex">
                                    <select
                                        value={block.value as string}
                                        onChange={e => onValueChange(block.id, e.target.value)}
                                        disabled={disabled}
                                        className="appearance-none bg-[#050608] rounded-sm border-t border-l border-[#050608] border-b border-r pl-3 pr-8 h-7 font-mono text-[10px] min-w-[120px] outline-none text-(--text-muted) hover:text-white focus:text-(--green-base) font-bold uppercase cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,1)] transition-colors"
                                    >
                                        {def.valueType === 'text' && <option value="" className="text-(--text-ghost)">-- SEL_FUNCIÓN --</option>}
                                        {(def.valueOptions || availableFunctions).map(opt => (
                                            <option key={opt} value={opt} className="bg-[#050608] text-white">{opt}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none">
                                        <ChevronDown size={12} strokeWidth={4} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Botón Eliminar */}
                    <CloseButton
                        onClick={() => onRemove(block.id)}
                        size='xs'
                        disabled={disabled}
                        className="ml-auto opacity-45 group-hover:opacity-100 hover:text-white "
                    />
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
                                parentId={block.id}
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