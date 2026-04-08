"use client"

import React from 'react'
import { motion } from 'motion/react'
import { Screw } from '@/components/ui/Screw'

interface StatusProps {
    status: 'idle' | 'correct' | 'wrong'
    progress: number
    current: number
    total: number
}

export function StatusMonitor({ status, progress, current, total }: StatusProps) {
    const esCorrecto = status === 'correct'
    const esError = status === 'wrong'

    return (
        <div className={`w-full rounded-xs
            relative p-6 border transition-all duration-500
            ${esCorrecto ? 'bg-green-500/5 border-green-500/20' :
                esError ? 'bg-red-500/5 border-red-500/20' :
                    'bg-(--bg-deep) border-(--border-color)'}
        `}>
            <div className="relative z-10 flex flex-col gap-6">

                {/* INFO PRINCIPAL: LENGUAJE CLARO */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {/* Indicador Visual */}
                        <div className={`w-3 h-3 rounded-full ${esCorrecto ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' :
                            esError ? 'bg-red-500' :
                                'bg-zinc-700'
                            }`} />

                        <div className="flex flex-col gap-1">
                            <span className={`text-sm font-mono font-black tracking-wider uppercase ${esCorrecto ? 'text-green-400' : esError ? 'text-red-400' : 'text-(--text-primary)'
                                }`}>
                                {esCorrecto ? 'RESPUESTAS_CORRECTAS' : esError ? 'REVISAR_RESPUESTAS' : 'PROGRESO_DE_LA_MISIÓN'}
                            </span>
                            <span className="text-[10px] font-mono text-(--text-muted)/85 uppercase font-bold tracking-tight">
                                {esCorrecto ? 'Has completado todos los puntos correctamente' :
                                    esError ? 'Algunos conceptos no coinciden, intenta de nuevo' :
                                        'Selecciona los pares para completar el ejercicio'}
                            </span>
                        </div>
                    </div>

                    {/* Contador Directo */}
                    <div className="flex flex-col items-end border-l border-white/10 pl-6">
                        <span className="text-[8px] font-mono text-(--text-muted) font-black tracking-widest mb-1">ACCIERTOS</span>
                        <span className="text-2xl font-mono font-black text-white leading-none">
                            {current}<span className="text-zinc-800 mx-0.5">/</span>{total}
                        </span>
                    </div>
                </div>

                {/* BARRA DE PROGRESO */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-[9px] font-mono font-black text-(--text-muted) tracking-widest">AVANCE_TOTAL</span>
                        <span className={`text-xs font-mono font-black ${esCorrecto ? 'text-green-400' : esError ? 'text-red-400' : 'text-zinc-500'
                            }`}>{progress}%</span>
                    </div>

                    <div className="h-2 w-full bg-black/60 rounded-sm overflow-hidden border border-white/5 p-px">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className={`h-full rounded-sm ${esCorrecto ? 'bg-green-500' : esError ? 'bg-red-600' : 'bg-zinc-700'
                                }`}
                        />
                    </div>
                </div>
            </div>

            <div className="absolute top-2 right-2 opacity-5"><Screw size="sm" /></div>
        </div>
    )
}