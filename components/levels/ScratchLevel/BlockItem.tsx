'use client'

import { useState } from 'react'
import { ScratchBlock, ScratchBlockType } from '@/types/game'
import { BlockDef } from './types'
import { BLOCK_DEFS } from './constants'

interface BlockItemProps {
    block: ScratchBlock
    availableDefs: BlockDef[]
    onRemove: (id: string) => void
    onValueChange: (id: string, value: string | number) => void
    onAddChild: (parentId: string, type: ScratchBlockType) => void
    depth: number
}

export function BlockItem({
    block,
    availableDefs,
    onRemove,
    onValueChange,
    onAddChild,
    depth,
}: BlockItemProps) {
    const def = BLOCK_DEFS.find(d => d.type === block.type)!
    const [showChildPicker, setShowChildPicker] = useState(false)

    return (
        <div style={{ marginLeft: depth * 20 }}>
            {/* Bloque principal */}
            <div
                className="rounded-md p-[7px_10px] flex items-center gap-2 font-mono text-sm leading-none"
                style={{ background: def.color, border: `1px solid ${def.border}`, color: def.border }}
            >
                {/* Conector visual */}
                {depth > 0 && (
                    <span className="opacity-40 text-[10px]">└</span>
                )}

                <span className="font-medium tracking-wide">{def.label}</span>

                {/* Input de valor */}
                {def.hasValue && def.valueType === 'number' && (
                    <input
                        type="number"
                        min={1}
                        max={10}
                        value={block.value as number}
                        onChange={e => onValueChange(block.id, parseInt(e.target.value) || 1)}
                        className="bg-black/30 rounded py-0.5 px-1.5 font-mono text-[11px] w-11 outline-none"
                        style={{ border: `1px solid ${def.border}` }}
                    />
                )}

                {def.hasValue && def.valueType === 'direction' && (
                    <select
                        value={block.value as string}
                        onChange={e => onValueChange(block.id, e.target.value)}
                        className="rounded py-0.5 px-1.5 font-mono text-[11px] outline-none"
                        style={{ background: def.color, border: `1px solid ${def.border}`, color: def.border }}
                    >
                        {def.valueOptions?.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                )}

                {def.hasValue && def.valueType === 'text' && (
                    <input
                        type="text"
                        value={block.value as string}
                        onChange={e => onValueChange(block.id, e.target.value)}
                        className="bg-black/30 rounded py-0.5 px-2 font-mono text-[11px] w-[100px] outline-none"
                        style={{ border: `1px solid ${def.border}` }}
                    />
                )}

                {/* Botón eliminar */}
                <button
                    onClick={() => onRemove(block.id)}
                    className="ml-auto bg-transparent border-none text-white/20 cursor-pointer text-sm leading-none p-0.5"
                    title="eliminar bloque"
                >
                    ×
                </button>
            </div>

            {/* Bloques hijos */}
            {block.children !== undefined && (
                <div 
                    className="ml-5 pl-2 my-1 flex flex-col gap-1.5 min-h-[32px]"
                    style={{ borderLeft: `1px dashed ${def.border}` }}
                >
                    {block.children.map(child => (
                        <BlockItem
                            key={child.id}
                            block={child}
                            availableDefs={availableDefs}
                            onRemove={onRemove}
                            onValueChange={onValueChange}
                            onAddChild={onAddChild}
                            depth={depth + 1}
                        />
                    ))}

                    {/* Botón agregar hijo */}
                    {!showChildPicker ? (
                        <button
                            onClick={() => setShowChildPicker(true)}
                            className="bg-transparent rounded px-2.5 py-1 font-mono text-[10px] cursor-pointer opacity-50 self-start tracking-wider"
                            style={{ border: `1px dashed ${def.border}`, color: def.border }}
                        >
                            + agregar bloque
                        </button>
                    ) : (
                        <div className="flex flex-wrap gap-1">
                            {availableDefs
                                .filter(d => !d.hasChildren)
                                .map(d => (
                                    <button
                                        key={d.type}
                                        onClick={() => { onAddChild(block.id, d.type); setShowChildPicker(false) }}
                                        className="rounded px-2 py-1 font-mono text-[10px] cursor-pointer"
                                        style={{ background: d.color, border: `1px solid ${d.border}`, color: d.border }}
                                    >
                                        {d.label}
                                    </button>
                                ))}
                            <button
                                onClick={() => setShowChildPicker(false)}
                                className="bg-transparent border border-(--bg-hover) rounded px-2 py-0.5 font-mono text-[10px] text-(--text-ghost) cursor-pointer"
                            >
                                cancelar
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
