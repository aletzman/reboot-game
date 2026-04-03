'use client'

import React from 'react'
import { PlayCircle } from 'lucide-react'
import { motion } from 'motion/react'

interface SequenceMemoryProps {
    isExecuting: boolean
    usedBlocks: number
    maxBlocks: number
    className?: string
}

export function SequenceMemory({ isExecuting, usedBlocks, maxBlocks, className = "" }: SequenceMemoryProps) {
    // Determinar el color de cada segmento basado en su posición
    const getBarColor = (index: number) => {
        const ratio = index / maxBlocks;
        if (ratio >= 0.8) return 'var(--red)';
        if (ratio >= 0.5) return 'var(--amber)';
        return 'var(--green-light)';
    };

    const label = isExecuting ? 'EJECUCIÓN_PASOS' : 'CAPACIDAD_SISTEMA';

    return (
        <div className={`hidden md:flex w-full self-center flex-col gap-3 p-4 bg-(--bg-void) border border-(--border-color) shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] relative overflow-hidden ${className}`}>

            {/* Capa de textura sutil de hardware */}
            <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[4px_4px] pointer-events-none" />

            {/* Header del Componente */}
            <div className="flex justify-between items-center font-mono text-xs uppercase font-black tracking-widest z-10 relative">
                <span className="flex items-center gap-2 text-(--text-muted)">
                    <PlayCircle
                        size={12}
                        className={`transition-colors duration-300 ${isExecuting ? 'text-(--amber) animate-pulse' : 'opacity-40'}`}
                    />
                    {label}
                </span>
                <span className="text-white">
                    {String(usedBlocks).padStart(2, '0')}
                    <span className="opacity-30 mx-1">/</span>
                    {String(maxBlocks).padStart(2, '0')}
                </span>
            </div>

            {/* Barra de Bloques Segmentada */}
            <div className="flex gap-[2px] h-[6px] w-full items-center z-10">
                {Array.from({ length: maxBlocks || 12 }).map((_, i) => {
                    const active = i < usedBlocks;
                    const isProcessing = isExecuting && active;
                    const barColor = getBarColor(i);

                    return (
                        <motion.div
                            key={i}
                            layout
                            initial={false}
                            animate={{
                                opacity: active ? (isProcessing ? [1, 0.3, 1] : 1) : 0.8,
                                backgroundColor: active ? barColor : 'rgba(255, 255, 255, 0.05)',
                                scaleY: active ? 1 : 0.6,
                                boxShadow: active ? `0 0 6px ${barColor}` : '0 0 0px rgba(0,0,0,0)',
                            }}
                            transition={{
                                duration: isProcessing ? 1 : 0.2,
                                repeat: isProcessing ? Infinity : 0,
                                delay: isProcessing ? i * 0.1 : 0,
                                ease: isProcessing ? "linear" : "easeOut",
                            }}
                            className={`flex-1 h-full rounded-[1px] border ${active ? 'border-transparent' : 'border-white/5'}`}
                        />
                    );
                })}
            </div>
        </div>
    );
}