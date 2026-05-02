'use client'

import React, { useState, memo, useMemo } from 'react'
import { useDroppable } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { PackageOpen, ChevronDown, Plus, Minus, ArrowDownToLine } from 'lucide-react'
import { LogicAssemblyBlock, LogicAssemblyBlockType } from '@/types/game'
import { BlockDef } from './types'
import { CloseButton } from '@/components/ui/CloseButton'
import { MODULES_REGISTERS } from './constants';

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
    activeBlockId?: string | null
    isPhantom?: boolean
}

// ============================================================================
// 1. ZONA DE ANIDAMIENTO (ZÓCALO PARA BLOQUES HIJOS)
// ============================================================================
const ChildrenDroppable = memo(function ChildrenDroppable({
    parentId,
    childrenCount,
    isLoop,
    children,
    borderColor
}: {
    parentId: string
    childrenCount: number
    isLoop: boolean
    children: React.ReactNode
    borderColor: string
}) {
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
            <div className="absolute -inset-4 -left-16 -inset-x-8 -bottom-8 pointer-events-auto z-0" />

            <div className="relative z-10 flex flex-col gap-2 min-h-[4px]">
                {children}
            </div>

            {isDropTarget && (
                <div className="h-10 border border-dashed border-(--green-base)/40 bg-(--green-base)/5 flex items-center justify-center gap-3 mt-2 relative z-20 rounded-xs">
                    <ArrowDownToLine className="text-(--green-light) opacity-50 animate-bounce" size={14} />
                    <span className="font-mono text-[8px] text-(--green-light) uppercase tracking-[0.4em] font-black">
                        INSERTAR_MOD
                    </span>
                </div>
            )}

            {!isDropTarget && isEmpty && (
                <div className="py-6 px-4 text-(--text-muted)/60 hover:text-(--text-primary) border border-dashed border-(--border-muted-color) bg-black/40 flex flex-col items-center justify-center gap-2 opacity-70 hover:opacity-80 transition-all select-none hover:bg-(--bg-surface) hover:border-(--border-color) cursor-pointer">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase font-black tracking-widest">[</span>
                        <PackageOpen size={14} className="opacity-50" />
                        <span className="font-mono text-[10px] uppercase font-black tracking-widest">]</span>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] font-bold text-center">
                        ZÓCALO_VACÍO
                    </span>
                </div>
            )}
        </div>
    )
})

// ============================================================================
// 2. COMPONENTE PRINCIPAL DEL BLOQUE
// ============================================================================
function BlockItemInner({
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
    activeBlockId = null,
    isPhantom = false,
}: BlockItemProps) {
    const [showChildPicker, setShowChildPicker] = useState(false)

    const { ref: nodeRef, targetRef, handleRef, isDragging } = useSortable({
        id: `${block.id}__drop`,
        index,
        disabled: disabled || isOverlay,
        data: { ...block, depth, isWorkspace: true, parentId }
    })

    const def = useMemo(() => availableDefs.find(d => d.type === block.type), [availableDefs, block.type])

    if (!def) {
        return null
    }

    const currentIsPhantom = isPhantom || (activeBlockId === block.id);

    return (
        <div
            id={`block-${block.type}`}
            ref={isOverlay ? undefined : nodeRef}
            //{...containerProps}
            className={`relative z-10 transition-all duration-200 
                ${(isDragging || currentIsPhantom) && !isOverlay ? 'opacity-30 grayscale-[0.5] scale-[1]' : ''} 
                ${isOverlay ? 'z-50 pointer-events-none opacity-100' : ''}`}
            style={{ marginLeft: (depth > 0 && !isOverlay) ? 24 : 0 }}
        >
            {depth > 0 && (
                <div
                    className="absolute top-6 bottom-0 w-px border-l-2 border-dotted border-(--border-color) opacity-40"
                    style={{ left: 16 }}
                />
            )}


            <div
                ref={isOverlay ? undefined : targetRef}
                className={`relative flex min-h-[50px] w-full 
                            rounded-[4px] transition-all duration-150 group 
                             ${disabled ? 'opacity-50 grayscale' : ''} block-item`}
            >
                <div

                    className="w-[6px] h-[50px] border-r border-[#050608] shadow-[inset_-2px_0_4px_rgba(0,0,0,0.4)]"
                    style={{ backgroundColor: def?.border ? def.border : 'transparent' }}
                />

                <div className="absolute inset-px border border-(--bg-elevated)/60 rounded-[1px] pointer-events-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />

                {/*Handle Drag*/}
                <div
                    ref={isOverlay ? undefined : handleRef}
                    className="w-10 bg-(--surface-2) border-r border-white/5 flex flex-col items-center justify-center gap-1.5 cursor-grab active:cursor-grabbing group-hover:bg-[#161920] transition-colors touch-none select-none"
                >
                    <div className="w-1 h-1 rounded-full bg-(--text-muted)/60" />
                    <div className="flex flex-col gap-1 opacity-20">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-4 h-px bg-(--text-muted)" />
                        ))}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-(--text-muted)/60 shadow-[0_0_5px_rgba(255,255,255,0.1)]" />
                </div>

                <div className="flex-1 p-2 pl-3 flex flex-wrap items-center gap-3 relative overflow-hidden">

                    <div className="flex flex-col justify-center items-center relative z-10 min-w-18 h-full rounded-xs label-panel">
                        <span
                            className="text-[11px] uppercase label-text"
                            style={{ color: def?.border ? def.border : 'white' }}
                        >
                            {def.label}
                        </span>
                        <span className="font-mono text-[10px] text-(--text-muted) uppercase font-bold">
                            <span className="opacity-60">ID:</span> {MODULES_REGISTERS[block.type]}
                        </span>
                    </div>

                    <div className="h-6 w-px bg-[#1e2128] mx-1 border-r border-[#4f545f] relative z-10" />

                    {def.hasValue && (
                        <div className="flex items-center gap-2 relative z-10">

                            {def.valueType === 'number' && (
                                <div className="flex items-stretch rounded-sm h-7 lcd-screen">
                                    <button
                                        onClick={() => !disabled && onValueChange(block.id, Math.max(1, (block.value as number) - 1))}
                                        disabled={disabled || (block.value as number) <= 1}
                                        className="px-2 flex items-center justify-center bg-[#181C23] hover:bg-[#20252D] text-(--text-muted) hover:text-(--amber) active:bg-black border-r border-[#050608] transition-colors cursor-pointer"
                                    >
                                        <Minus size={12} strokeWidth={4} />
                                    </button>
                                    <div className="w-10 flex items-center justify-center relative">
                                        <span className="font-mono text-[13px] font-bold text-(--green-light) tabular-nums">
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

                            {(def.valueType === 'direction' || (def.valueType === 'text' && block.type === 'LLAMAR')) && (
                                <div className="relative flex group/lcd">
                                    <select
                                        id="block-select"
                                        value={block.value as string}
                                        onChange={e => onValueChange(block.id, e.target.value)}
                                        disabled={disabled}
                                        className={`appearance-none rounded-sm h-7 pl-3 pr-8 min-w-[120px] outline-none transition-all duration-200 cursor-pointer lcd-screen  
                                        ${def.valueType === 'direction' ? 'uppercase' : ''}`}
                                        style={{
                                            textShadow: '0 1px 1px var(--green-base), 0 0 3px rgba(126, 213, 38, 0.2)',
                                            backgroundImage: 'linear-gradient(180deg, rgba(45, 120, 0, 0.1) 0%, rgba(0, 0, 0, 0) 100%)'
                                        }}
                                    >
                                        {def.valueType === 'text' && (
                                            <option value="" className="text-(--green-muted) opacity-50">-- SEL_FUNCIÓN --</option>
                                        )}
                                        {(def.valueOptions || availableFunctions).map(opt => (
                                            <option key={opt} value={opt} className="bg-(--green-darkest) text-(--green-light)">
                                                {opt}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-(--green-base) group-hover/lcd:text-(--green-light) transition-colors">
                                        <ChevronDown size={12} strokeWidth={4} />
                                    </div>


                                </div>
                            )}

                            {def.valueType === 'text' && block.type !== 'LLAMAR' && (
                                <div className="relative flex">
                                    <input
                                        id={`block-field-text`}
                                        type="text"
                                        value={block.value as string}
                                        onFocus={e => onValueChange(block.id, e.target.value)}
                                        onChange={e => onValueChange(block.id, e.target.value)}
                                        disabled={disabled}
                                        placeholder={block.type === 'FUNCION' ? 'nombre_función' : 'expresión'}
                                        className={`rounded-sm lcd-screen px-3 h-7`}
                                    />
                                </div>
                            )}

                        </div>
                    )}

                    <CloseButton
                        onClick={() => onRemove(block.id)}
                        size='xs'
                        disabled={disabled}
                        variant="light"
                        className="ml-auto opacity-60 group-hover:opacity-100 hover:text-white"
                    />
                </div>
            </div>

            {block.children !== undefined && (
                <div className="ml-5 mt-1 pl-4 py-2 flex flex-col gap-2 relative">

                    <div className="absolute left-0 top-0 bottom-4 w-px border-l-2 border-dotted" style={{ borderColor: def.border, opacity: 0.3 }} />
                    <div className="absolute left-0 bottom-4 w-3 h-px border-b-2 border-dotted" style={{ borderColor: def.border, opacity: 0.3 }} />

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
                                activeBlockId={activeBlockId}
                                isPhantom={currentIsPhantom}
                            />
                        ))}
                    </ChildrenDroppable>

                    <div className="relative pt-1 z-10">
                        {!showChildPicker ? (
                            <button
                                id="add-child-button"
                                onClick={() => setShowChildPicker(true)}
                                disabled={disabled}
                                className={`
                                w-full flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-black/20 
                                font-mono text-[10px] uppercase tracking-[0.2em] cursor-pointer group/socket transition-all 
                                border border-dashed border-(--border-color) hover:border-(--cyan)/50 hover:bg-(--cyan)/5 
                                text-(--text-muted) hover:text-(--cyan)
                                ${disabled ? 'opacity-30 cursor-not-allowed hidden' : ''}
                            `}
                            >
                                <Plus size={12} className="group-hover/socket:rotate-90 transition-transform" />
                                <span className="font-bold">ACOPLAR_MODULO_INTERNO</span>
                            </button>
                        ) : (
                            <div className="bg-[#050608] border border-(--border-color) p-3 shadow-2xl rounded-sm">
                                <span className="block font-mono text-[8px] text-(--text-muted) uppercase tracking-widest mb-3 border-b border-(--border-color) pb-1">
                                    [ SEL_MOD_COMPATIBLE ]
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {availableDefs
                                        .filter(d => d.type !== 'FUNCION' && d.type !== 'LLAMAR')
                                        .map(d => (
                                            <button
                                                id={`add-child-button-${d.type}`}
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

// Comparación custom: un BlockItem solo necesita re-renderizar si cambió
// su bloque (referencia o contenido), su posición, o el flag disabled.
// Los callbacks (onRemove, onValueChange, etc.) son estables por useCallback
// en el padre, así que no necesitamos compararlos.
export const BlockItem = memo(BlockItemInner, (prev, next) => {
    return (
        prev.block === next.block &&
        prev.index === next.index &&
        prev.depth === next.depth &&
        prev.disabled === next.disabled &&
        prev.parentId === next.parentId &&
        prev.isOverlay === next.isOverlay &&
        prev.isPhantom === next.isPhantom &&
        prev.activeBlockId === next.activeBlockId &&
        prev.availableFunctions === next.availableFunctions
    )
})