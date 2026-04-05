'use client'

import { useEffect, useRef } from 'react'
import { LogicAssemblyBlock } from '@/types/game'
import { BLOCK_DEFS } from './constants'
import { useLogicAssemblyData } from '@/lib/store/useLogicAssemblyData'
import { motion } from 'motion/react'

export function PseudocodeSummary({ blocks, depth = 0 }: { blocks: LogicAssemblyBlock[]; depth?: number }) {
    const currentFlatInstruction = useLogicAssemblyData((state) => state.currentFlatInstruction)
    const isExecuting = useLogicAssemblyData((state) => state.isExecuting)
    const activeRef = useRef<HTMLDivElement>(null)

    // Efecto para seguir la ejecución con el scroll
    useEffect(() => {
        if (isExecuting && activeRef.current) {
            activeRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            })
        }
    }, [currentFlatInstruction.id, isExecuting])

    return (
        <div className={`font-mono text-[11px] leading-relaxed 
            ${depth === 0 ? 'p-2 h-[300px] overflow-y-auto custom-scrollbar' : 'flex flex-col'}`}>
            {blocks.map((block, idx) => {
                const def = BLOCK_DEFS.find(d => d.type === block.type)!
                const val = block.value !== undefined ? `(${block.value})` : ''

                const isDirectlyActive = isExecuting && currentFlatInstruction.id === block.id
                const isParentActive = isExecuting && currentFlatInstruction.stack?.includes(block.id)
                const isActive = isDirectlyActive || isParentActive

                return (
                    <div
                        key={block.id}
                        ref={isDirectlyActive ? activeRef : null}
                        className="flex flex-col group/line "
                    >
                        <div className="flex items-center min-h-[22px]  relative">
                            {/* 1. ÁREA DE MARGEN IZQUIERDO (Números de línea y espacio de indentación) */}
                            <div className="flex items-center shrink-0" style={{ width: `${depth * 20 + 35}px` }}>
                                {/* Número de línea (solo para el primer nivel) */}
                                {depth === 0 ? (
                                    <span className="w-8 text-(--text-muted) text-right pr-3 select-none font-bold text-[10px] opacity-60 group-hover/line:opacity-100 transition-opacity">
                                        {String(idx + 1).padStart(2, '0')}
                                    </span>
                                ) : (
                                    <div className="w-8 shrink-0" />
                                )}

                                {/* Guías visuales de indentación */}
                                {Array.from({ length: depth }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-full w-[20px] border-r border-white/5 opacity-50"
                                    />
                                ))}
                            </div>

                            {/* 2. CONTENIDO DEL COMANDO */}
                            <div className="flex-1 flex items-center gap-2 pl-2">
                                <motion.div
                                    className="flex items-center gap-2 transition-all duration-300 relative"
                                    animate={{
                                        x: isDirectlyActive ? 4 : 0,
                                        opacity: isActive ? 1 : (isExecuting ? 0.35 : 0.8)
                                    }}
                                >
                                    {/* Indicador de ejecución actual » */}
                                    {isDirectlyActive && (
                                        <motion.span
                                            initial={{ x: -8, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            className="text-(--amber) font-black text-[12px] absolute -left-4"
                                        >
                                            »
                                        </motion.span>
                                    )}

                                    <span
                                        style={{
                                            color: def.border,
                                            textShadow: isActive ? `0 0 12px ${def.border}` : 'none'
                                        }}
                                        className={`tracking-tight uppercase font-bold transition-all duration-300 
                                            ${isActive ? 'brightness-150 saturate-150' : 'brightness-90'}
                                        `}
                                    >
                                        {block.type}
                                    </span>

                                    {val && (
                                        <span className={`text-[12px] px-1.5 py-0 rounded-xs bg-black/60 border transition-all duration-300 font-medium
                                            ${isActive
                                                ? 'text-(--text-primary) border-(--border-color)'
                                                : 'text-(--text-primary) border-(--border-color)/0'
                                            }`}
                                        >
                                            {val}
                                        </span>
                                    )}
                                </motion.div>
                            </div>
                        </div>

                        {/* 3. RECURSIVIDAD PARA HIJOS */}
                        {block.children && block.children.length > 0 && (
                            <PseudocodeSummary blocks={block.children} depth={depth + 1} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}
