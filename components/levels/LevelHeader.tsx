import Link from 'next/link'
import { ChevronLeft, AlertTriangle } from 'lucide-react'
import type { Level, LevelState } from '@/types/game'
import { Screw } from '../ui/Screw'

interface LevelHeaderProps {
    level: Level
    status: LevelState['status']
    isRunning: boolean
    children?: React.ReactNode
}

export function LevelHeader({ level, status, isRunning, children }: LevelHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row items-stretch border-b border-(--border-color) bg-[#0a0c0f] relative z-20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] select-none">


            {/* ─── COMPARTIMENTO 01: BOTÓN DE RETORNO (Compacto) ─── */}
            <Link
                href={`/game/${level.act}`}
                className="group/act flex flex-col items-center justify-center py-2 px-4 border-b md:border-b-0 md:border-r border-(--border-color) min-w-[80px] bg-[#050608] hover:bg-(--bg-hover) active:bg-black transition-all relative overflow-hidden"
                title={`Volver a ${level.actName}`}
            >
                <div className="absolute inset-0 shadow-[inset_0_2px_10px_rgba(0,0,0,0.9)] pointer-events-none" />
                <ChevronLeft size={24} className="text-(--text-muted) group-hover/act:text-(--amber) group-hover/act:-translate-x-1 transition-all relative z-10" />
                <div className="flex flex-col items-center justify-center relative z-10 mt-0.5">
                    <span className="text-[9px] font-mono font-black text-(--text-ghost) tracking-widest uppercase group-hover/act:text-(--amber) transition-colors">
                        RETORNO
                    </span>
                    <span className="text-sm font-mono font-black text-(--text-muted) leading-none group-hover/act:text-white transition-colors mt-0.5">
                        SEC_{level.act.toString().padStart(2, '0')}
                    </span>
                </div>
            </Link>

            {/* ─── COMPARTIMENTO 02: PLACA DE IDENTIFICACIÓN (Slim) ─── */}
            <div className="relative flex-1 flex flex-col justify-center px-6 py-2 border-b md:border-b-0 md:border-r border-(--border-color) bg-(--bg-surface) overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">

                <Screw corner="tl" size="sm" />
                <Screw corner="tr" size="sm" />
                <Screw corner="bl" size="sm" />
                <Screw corner="br" size="sm" />

                {/* Marca de agua (Menos invasiva) */}
                <span className="absolute -top-1 right-4 text-6xl font-black font-mono text-black opacity-30 pointer-events-none select-none tracking-tighter">
                    {level.id}
                </span>

                {/* Código de barras (Más corto) */}
                <div className="absolute bottom-2 right-12 flex gap-[2px] opacity-20 pointer-events-none">
                    <div className="w-1 h-3 bg-(--text-muted)" /><div className="w-0.5 h-3 bg-(--text-muted)" /><div className="w-1.5 h-3 bg-(--text-muted)" /><div className="w-0.5 h-3 bg-(--text-muted)" /><div className="w-1 h-3 bg-(--text-muted)" />
                </div>

                <div className="relative z-10 flex flex-col gap-0.5 mt-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-(--text-muted) uppercase tracking-[0.3em] font-bold leading-none">
                            {level.actName}
                        </span>
                    </div>
                    <h1 id="level-title" className="text-2xl md:text-[28px] font-mono font-black text-white leading-none uppercase tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mt-0.5">
                        {level.title}
                    </h1>
                </div>
            </div>

            {/* ─── COMPARTIMENTO 03: TELEMETRÍA (Alineación Horizontal) ─── */}
            <div className="flex items-center justify-between md:justify-end px-4 py-2 min-w-fit md:min-w-[280px] bg-[#050608] relative gap-4">

                <div className="flex flex-col w-full md:w-40">
                    <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[9px] font-mono text-(--text-ghost) uppercase tracking-widest font-black flex items-center gap-1">
                            STATUS
                        </span>
                        <span className="text-[7px] font-mono text-(--text-ghost) tracking-widest">EXT.V4</span>
                    </div>

                    {/* Pantalla CRT Ultra-Compacta */}
                    <div className="flex flex-col bg-black border border-(--border-muted-color) px-2 py-1.5 rounded-sm shadow-[inset_0_0_10px_rgba(0,0,0,1)] w-full">
                        <span className={`text-[10px] font-mono font-black tracking-widest transition-colors duration-300 drop-shadow-[0_0_5px_currentColor] mb-1 leading-none
                            ${status === 'success' ? 'text-(--green-base)' : status === 'failed' ? 'text-(--red)' : isRunning ? 'text-(--amber)' : 'text-(--text-muted)'}
                        `}>
                            {status === 'success' ? 'RUTINA_OK' : status === 'failed' ? 'SYS_ERROR' : isRunning ? 'DAT_PROC' : 'STANDBY'}
                        </span>

                        <div className="flex gap-1 w-full">
                            {[0, 1, 2, 3, 4].map((i) => {
                                let barColor = 'bg-[#111]'
                                let anim = ''

                                if (status === 'success') {
                                    barColor = 'bg-(--green-base) shadow-[0_0_5px_var(--green-base)]'
                                } else if (status === 'failed') {
                                    barColor = i < 2 ? 'bg-(--red) shadow-[0_0_5px_var(--red)]' : 'bg-[#111]'
                                    anim = 'animate-pulse'
                                } else if (isRunning) {
                                    // Animación secuencial ligera
                                    barColor = i === (Math.floor(Date.now() / 200) % 5) ? 'bg-(--amber) shadow-[0_0_5px_var(--amber)]' : 'bg-[#111]'
                                } else {
                                    barColor = i === 0 ? 'bg-(--text-ghost)' : 'bg-[#111]'
                                }

                                return (
                                    <div key={i} className={`flex-1 h-1.5 rounded-[1px] transition-all duration-150 ${barColor} ${anim}`} />
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Si tienes botones extra, ahora se ponen AL LADO de la pantalla, no abajo */}
                {children && (
                    <div className="flex items-center justify-center shrink-0 border-l border-(--border-color) pl-4 ml-1">
                        {children}
                    </div>
                )}
            </div>
        </div>
    )
}