'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Screw } from './Screw'

interface SequenceMemoryProps {
    isExecuting: boolean
    usedBlocks: number
    maxBlocks: number
    className?: string
}

export function SequenceMemory({ isExecuting, usedBlocks, maxBlocks, className = "" }: SequenceMemoryProps) {
    const getBarColor = (index: number) => {
        const ratio = index / maxBlocks;
        if (ratio >= 0.85) return 'var(--red)';
        if (ratio >= 0.6) return 'var(--amber)';
        return 'var(--green-light)';
    };

    return (
        <div className={`
            hidden md:flex flex-col gap-1 p-3 py-1 w-full
            bg-(--bg-deep) 
            shadow-[0_-5px_15px_rgba(0,0,0,0.4)]
            relative overflow-hidden group/mem
            ${className}
        `}>
            {/* 3. HEADER */}
            <div className="flex justify-between items-end px-1 relative z-10">
                <div className="flex flex-col">
                    <span className={`
                        text-[10px] font-mono font-bold tracking-widest mt-1
                        ${isExecuting ? 'text-(--amber) [text-shadow:0_0_8px_var(--amber)]' : 'text-(--text-muted)'}
                    `}>
                        {isExecuting ? 'PROCESANDO_PASOS' : 'USO_DE_MEMORIA'}
                    </span>
                </div>

                <div className="flex items-baseline gap-1 bg-black/40 px-2 py-0.5 border border-white/5 rounded-sm">
                    <span className="text-[12px] font-mono font-black text-white leading-none">
                        {String(usedBlocks).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] font-mono text-(--text-ghost)">BLOQUES</span>
                </div>
            </div>

            {/* 4. BARRA DE BLOQUES */}
            <div className="
                relative h-[22px] w-full flex items-center justify-between gap-[3px] 
                bg-black/60 p-1.5 rounded-[1px]
                border border-black shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]
            ">
                <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-10">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-px h-full bg-white" />
                    ))}
                </div>

                {Array.from({ length: maxBlocks || 12 }).map((_, i) => {
                    const active = i < usedBlocks;
                    const isProcessing = isExecuting && active;
                    const barColor = getBarColor(i);

                    return (
                        <div key={i} className="relative flex-1 h-full flex flex-col items-center">
                            <motion.div
                                layout
                                animate={{
                                    backgroundColor: active ? barColor : 'rgba(255, 255, 255, 0.05)',
                                    opacity: active ? (isProcessing ? [1, 0.4, 1] : 1) : 0.4,
                                    height: active ? '100%' : '15%',
                                    boxShadow: active ? `0 0 8px ${barColor}` : 'none'
                                }}
                                transition={{
                                    duration: isProcessing ? 0.6 : 0.1,
                                    repeat: isProcessing ? Infinity : 0,
                                    delay: isProcessing ? i * 0.05 : 0
                                }}
                                className="w-full rounded-[0.5px] border-x border-black/20"
                            />
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between items-center px-1">
                <div className="flex gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${isExecuting ? 'bg-(--amber) animate-pulse shadow-[0_0_5px_var(--amber)]' : 'bg-black border border-white/10'}`} />
                    <span className="text-[7px] font-mono text-(--text-ghost) uppercase tracking-tighter">CONEXIÓN_ACTIVA</span>
                </div>
                <span className="text-[7px] font-mono text-(--text-ghost) uppercase">LÍMITE_MÁX: {maxBlocks}</span>
            </div>
        </div>
    );
}
