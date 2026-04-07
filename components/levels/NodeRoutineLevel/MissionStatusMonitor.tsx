'use client'

import React from 'react'
import { motion } from 'motion/react'

type MissionState = "idle" | "playing" | "success" | "failed" | "reviewing"

export function MissionStatusMonitor({ status, className }: { status: MissionState, className?: string }) {

    const config = {
        idle: {
            etiqueta: "MODO_ESPERA",
            color: "var(--text-ghost)",
            glow: "rgba(61, 68, 77, 0.2)",
            sub: "SYNC_READY"
        },
        playing: {
            etiqueta: "EJECUCION_ACTIVA",
            color: "var(--amber)",
            glow: "rgba(239, 159, 39, 0.4)",
            sub: "PROCESS_HASH_VALIDATING"
        },
        success: {
            etiqueta: "SISTEMA_SINCRO",
            color: "var(--green-light)",
            glow: "rgba(126, 213, 38, 0.4)",
            sub: "INTEGRITY_CHECK_PASSED"
        },
        failed: {
            etiqueta: "FALLO_CRITICO",
            color: "var(--red)",
            glow: "rgba(226, 75, 74, 0.4)",
            sub: "BUFFER_OVERFLOW_DETECTED"
        },
        reviewing: {
            etiqueta: "DEPURACION",
            color: "var(--cyan)",
            glow: "rgba(25, 200, 212, 0.4)",
            sub: "INSPECTING_STACK_TRACE"
        }
    }

    const activo = config[status]

    return (
        <div className={`relative h-full w-full bg-black/40 overflow-hidden flex flex-col justify-center px-6 ${className}`}>
            {/* CRT Screen Inset Shadow */}
            <div className="absolute inset-0 shadow-[inset_0_2px_20px_rgba(0,0,0,0.8)] pointer-events-none z-20" />

            {/* Scanlines Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 2px)', backgroundSize: '100% 2px' }} />

            {/* Dynamic Status Glow */}
            <div
                className="absolute inset-0 opacity-10 transition-colors duration-500"
                style={{
                    background: `radial-gradient(circle at center, ${activo.glow} 0%, transparent 70%)`
                }}
            />

            {/* Technical HUD Grid Background (Subtle) */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            <div className="relative z-30 flex flex-col items-center">
                {/* Micro-segments (Activity Bar) */}
                <div className="flex gap-1 mb-2 self-start opacity-40">
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={status === 'playing' ? {
                                opacity: [0.2, 1, 0.2],
                                scaleY: [1, 1.5, 1]
                            } : {}}
                            transition={{
                                repeat: Infinity,
                                duration: 1,
                                delay: i * 0.1
                            }}
                            className="w-1 h-2 rounded-full"
                            style={{ backgroundColor: activo.color }}
                        />
                    ))}
                </div>

                <div className="w-full relative">
                    {/* Main Label */}
                    <div className="flex items-center justify-between gap-4 mb-0.5">
                        <h2
                            className="text-2xl font-mono font-black tracking-tighter transition-colors duration-500"
                            style={{
                                color: activo.color,
                                textShadow: `0 0 10px ${activo.glow}`
                            }}
                        >
                            {activo.etiqueta}
                        </h2>

                        {/* Status Code */}
                        <span className="text-[10px] font-mono opacity-30 font-bold">
                            CFG_ST_{status.toUpperCase()}
                        </span>
                    </div>

                    {/* Technical Sub-label */}
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="h-0.5 w-4 shrink-0 transition-colors duration-500" style={{ backgroundColor: activo.color }} />
                        <span className="text-[9px] font-mono uppercase tracking-[0.2em] whitespace-nowrap opacity-50 block truncate">
                            {activo.sub}
                        </span>
                    </div>
                </div>
            </div>

            {/* Scanning light sweep */}
            {status === 'playing' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{ top: ['-20%', '120%'] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                        className="absolute left-0 right-0 h-[20%] bg-white/5 blur-xl"
                    />
                </div>
            )}
        </div>
    )
}