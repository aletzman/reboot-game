'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Navigation2, Target, ArrowUpFromLine } from 'lucide-react'
import { ExtendedRobotState } from './types'

export function RobotMonitor({ robot }: { robot: ExtendedRobotState }) {
    const [rotation, setRotation] = useState(0)
    const [isTurning, setIsTurning] = useState(false)
    const prevDirectionRef = useRef(robot.direction)

    // Lógica de Giro Inteligente (Camino más corto)
    useEffect(() => {
        const directionMap = { north: 0, east: 90, south: 180, west: 270 }
        const targetAngle = directionMap[robot.direction]
        let diff = targetAngle - (rotation % 360)
        if (diff > 180) diff -= 360
        if (diff < -180) diff += 360
        setRotation(prev => prev + diff)

        // Detectar giro comparando dirección anterior
        if (prevDirectionRef.current !== robot.direction) {
            setIsTurning(true)
            prevDirectionRef.current = robot.direction
            const timer = setTimeout(() => setIsTurning(false), 500)
            return () => clearTimeout(timer)
        }
    }, [robot.direction])

    const directionLabel: Record<string, string> = {
        north: 'N  000°',
        east: 'E  090°',
        south: 'S  180°',
        west: 'W  270°',
    }

    return (
        <div className="w-full flex flex-col overflow-hidden shadow-[inset_0_2px_12px_rgba(0,0,0,0.8)] relative group/console">

            {/* SCREENS & OVERLAYS */}
            <div className="p-3 flex flex-col gap-3 overflow-y-auto custom-scrollbar 
                            font-mono leading-tight relative z-10 bg-(--bg-deep) 
                            shadow-[inset_0_0_30px_rgba(0,0,0,0.6)]">

                {/* Scanlines industriales */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] opacity-20 z-20" />
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(45,120,0,0.06)_0%,transparent_100%)] z-10" />

                {/* === SECCIÓN A: COORDENADAS + BRÚJULA === */}
                <section className="flex gap-3 relative z-30">
                    {/* Readout de coordenadas — strip horizontal */}
                    <div className="flex-1 grid grid-cols-3 bg-black/60 border border-white/10 shadow-[inset_0_0_20px_rgba(0,0,0,1)] relative overflow-hidden">

                        {/* Scanline de actualización de datos */}
                        <div className="absolute inset-0 w-full h-px bg-(--green-light)/10 animate-[scan_4s_linear_infinite] pointer-events-none" />

                        {/* EJE X - Sector Horizontal */}
                        <div className="relative flex flex-col items-center justify-center p-3 border-r border-white/5 bg-linear-to-b from-transparent to-white/1">
                            <div className="absolute top-1 left-1 flex gap-0.5">
                                <div className="w-1 h-1 bg-(--green-light)/40" />
                                <div className="w-1 h-1 bg-(--green-light)/10" />
                            </div>

                            <span className="text-[8px] font-black text-(--text-muted) uppercase tracking-widest mb-1">Sector_X</span>
                            <div className="flex items-center gap-1">
                                <span className="text-[8px] text-(--green-muted) font-bold">[</span>
                                <span className="text-xl font-black text-(--green-light) [text-shadow:0_0_10px_var(--green-base)] tabular-nums">
                                    {robot.x.toString().padStart(2, '0')}
                                </span>
                                <span className="text-[8px] text-(--green-muted) font-bold">]</span>
                            </div>
                        </div>

                        {/* EJE Y - Sector Vertical */}
                        <div className="relative flex flex-col items-center justify-center p-3 border-r border-white/5">
                            <span className="text-[8px] font-black text-(--text-muted) uppercase tracking-widest mb-1">Sector_Y</span>
                            <div className="flex items-center gap-1">
                                <span className="text-[8px] text-(--green-muted) font-bold">[</span>
                                <span className="text-xl font-black text-(--green-light) [text-shadow:0_0_10px_var(--green-base)] tabular-nums">
                                    {robot.y.toString().padStart(2, '0')}
                                </span>
                                <span className="text-[8px] text-(--green-muted) font-bold">]</span>
                            </div>
                        </div>

                        {/* EJE ALT - Índice de Capa */}
                        <div className="relative flex flex-col items-center justify-center p-3 bg-(--cyan)/2">
                            <div className="absolute bottom-1 right-1 flex gap-0.5">
                                <div className="w-1 h-1 bg-(--cyan)/10" />
                                <div className="w-1 h-1 bg-(--cyan)/40" />
                            </div>

                            <span className="text-[8px] font-black text-(--cyan)/60 uppercase tracking-widest mb-1">LEVEL</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-black text-(--cyan) [text-shadow:0_0_10px_rgba(25,200,212,0.4)] tabular-nums">
                                    {robot.height || 0}
                                </span>
                                <span className="text-[8px] text-(--cyan)/40 font-bold">lvl</span>
                            </div>
                        </div>
                    </div>

                    {/* Brújula Circular */}
                    <div className="w-20 flex flex-col items-center justify-center bg-black/20 border border-(--border-muted-color) py-2">
                        <div className="relative w-12 h-12 border border-(--border-color) rounded-full flex items-center justify-center bg-[radial-gradient(circle,rgba(45,120,0,0.05)_0%,transparent_70%)]">
                            <Navigation2
                                size={18}
                                className="text-(--amber) drop-shadow-[0_0_8px_var(--amber)] transition-transform duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)"
                                style={{ transform: `rotate(${rotation}deg)` }}
                            />
                            <div className="absolute inset-0 border border-(--border-color)/60 rounded-full animate-[spin_20s_linear_infinite]" />
                            <div className="absolute inset-1 border border-dashed border-(--border-color) rounded-full animate-[spin_10s_linear_infinite_reverse]" />
                        </div>
                        <span className="text-[8px] font-black text-(--amber) mt-1.5 tracking-widest uppercase">{directionLabel[robot.direction]}</span>
                    </div>
                </section>

                {/* === SECCIÓN B: MATRIZ DE ACTUADORES === */}
                <section className="flex flex-col gap-2 relative z-30">
                    <div className="flex items-center gap-2 border-b border-(--border-muted-color) pb-1">
                        <Target size={10} className="text-(--green-light)" />
                        <span className="text-[8px] font-black text-(--text-primary) tracking-widest uppercase">System_Actuators</span>
                    </div>

                    <div className="space-y-2 pt-0.5">
                        {/* 1. Actuador de Movimiento */}
                        <div className="flex items-center gap-2">
                            <span className="w-16 text-[10px] text-(--text-muted)/60 font-black uppercase">TRACT_MOT</span>
                            <div className="flex-1 h-2.5 bg-black/50 border border-(--border-muted-color) relative overflow-hidden flex items-center">
                                {robot.isMoving && (
                                    <div className="flex gap-px w-full px-0.5 overflow-hidden">
                                        {[...Array(16)].map((_, i) => (
                                            <div key={i} className="w-0.5 h-1.5 bg-(--green-light) animate-[pulse_0.1s_infinite]" style={{ animationDelay: `${i * 0.02}s` }} />
                                        ))}
                                    </div>
                                )}
                                <div className={`h-full bg-(--green-light)/10 transition-all duration-300 ${robot.isMoving ? 'w-full shadow-[inset_0_0_5px_var(--green-light)]' : 'w-0'}`} />
                            </div>
                            <span className={`text-[10px] font-black w-8 text-right ${robot.isMoving ? 'text-(--green-light)' : 'text-(--text-muted)/60'}`}>
                                {robot.isMoving ? 'EXEC' : 'IDLE'}
                            </span>
                        </div>

                        {/* 2. Actuador de Giro */}
                        <div className="flex items-center gap-2">
                            <span className="w-16 text-[10px] text-(--text-muted)/60 font-black uppercase">ROT_GYR</span>
                            <div className="flex-1 h-2.5 bg-black/50 border border-(--border-muted-color) relative overflow-hidden flex items-center">
                                {/* Barra sweep desde el centro */}
                                <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2 bg-(--amber) transition-all duration-300 ease-out ${isTurning ? 'w-full opacity-60 shadow-[0_0_8px_var(--amber)]' : 'w-0 opacity-0'
                                    }`} />
                                {/* Marcas de referencia estáticas */}
                                <div className="absolute inset-0 flex items-center justify-center gap-1 pointer-events-none">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className={`w-px h-1.5 transition-colors duration-200 ${isTurning ? 'bg-(--amber)/80' : 'bg-white/10'}`} />
                                    ))}
                                </div>
                            </div>
                            <span className={`text-[10px] font-black w-8 text-right ${isTurning ? 'text-(--amber)' : 'text-(--text-muted)/60'}`}>
                                {isTurning ? 'ROT' : 'LOCK'}
                            </span>
                        </div>

                        {/* 3. Actuador de Salto */}
                        <div className="flex items-center gap-2">
                            <span className="w-16 text-[10px] text-(--text-muted)/60 font-black uppercase">ELEV_SYS</span>
                            <div className="flex-1 h-2.5 bg-black/50 border border-(--border-muted-color) relative overflow-hidden flex items-center justify-center">
                                {robot.isJumping ? (
                                    <ArrowUpFromLine size={8} className="text-(--cyan) animate-bounce drop-shadow-[0_0_5px_var(--cyan)]" />
                                ) : (
                                    <div className="w-6 h-px bg-white/10" />
                                )}
                                <div className={`absolute left-0 top-0 bottom-0 bg-(--cyan)/10 transition-all duration-300 origin-left ${robot.isJumping ? 'scale-x-100' : 'scale-x-0'}`} />
                            </div>
                            <span className={`text-[10px] font-black w-8 text-right ${robot.isJumping ? 'text-(--cyan)' : 'text-(--text-muted)/60'}`}>
                                {robot.isJumping ? 'JMP' : 'GND'}
                            </span>
                        </div>

                        {/* 4. Actuador Mecánico */}
                        <div className="flex items-center gap-2">
                            <span className="w-16 text-[10px] text-(--text-muted)/60 font-black uppercase">MECH_ARM</span>
                            <div className="flex-1 h-2.5 bg-black/50 border border-(--border-muted-color) relative overflow-hidden flex items-center px-0.5">
                                {robot.isActivating && (
                                    <div className="flex gap-px w-full animate-[pulse_0.1s_infinite]">
                                        {[...Array(8)].map((_, i) => (
                                            <div key={i} className="flex-1 h-1.5 bg-(--amber)" />
                                        ))}
                                    </div>
                                )}
                                <div className={`h-full bg-(--amber)/10 transition-all duration-300 origin-center ${robot.isActivating ? 'scale-y-100' : 'scale-y-0'}`} />
                            </div>
                            <span className={`text-[10px] font-black w-8 text-right ${robot.isActivating ? 'text-(--amber)' : 'text-(--text-muted)/60'}`}>
                                {robot.isActivating ? 'FIRE' : 'STBY'}
                            </span>
                        </div>
                    </div>
                </section>
            </div>

            {/* FOOTER: Telemetría Activa */}
            <div className="bg-(--bg-void) p-2 px-3 border-t border-(--border-muted-color) flex justify-between items-center relative z-20">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-(--cyan) rounded-full shadow-[0_0_8px_var(--cyan)] animate-pulse" />
                    <span className="text-[9px] pt-0.5 text-(--text-muted)/85 font-mono uppercase tracking-[0.15em]">
                        Sensors_Online
                    </span>
                </div>
                <span className="text-[9px] font-mono text-(--text-muted) tracking-widest">UNIT-01</span>
            </div>
        </div>
    )
}