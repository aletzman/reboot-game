import Link from 'next/link'
import { ChevronLeft, AlertTriangle } from 'lucide-react'
import type { Level, LevelState } from '@/types/game'

interface LevelHeaderProps {
    level: Level
    status: LevelState['status']
    isRunning: boolean
    children?: React.ReactNode
}

export function LevelHeader({ level, status, isRunning, children }: LevelHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row items-stretch border-b-4 border-(--border-color) bg-[#0a0c0f] relative z-20 shadow-[0_15px_40px_rgba(0,0,0,0.9)] select-none">

            {/* ─── CINTA DE PELIGRO SUPERIOR (Industrial Hazard Tape) ─── */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[repeating-linear-gradient(45deg,var(--amber),var(--amber)_10px,#000_10px,#000_20px)] opacity-40 z-30" />

            {/* ─── COMPARTIMENTO 01: BOTÓN DE ABORTO / RETORNO ─── */}
            <Link
                href={`/game/${level.act}`}
                className="group/act flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r-4 border-(--border-color) min-w-[100px] bg-[#050608] hover:bg-(--bg-hover) active:bg-black transition-all relative overflow-hidden"
                title={`Volver a ${level.actName}`}
            >
                {/* Sombra de botón mecánico pesado */}
                <div className="absolute inset-0 shadow-[inset_0_4px_15px_rgba(0,0,0,0.9)] pointer-events-none" />

                <ChevronLeft size={36} className="text-(--text-muted) group-hover/act:text-(--amber) group-hover/act:-translate-x-1 transition-all relative z-10" />

                <div className="flex flex-col items-center justify-center relative z-10 mt-1">
                    <span className="text-[8px] font-mono font-black text-(--text-ghost) tracking-widest uppercase group-hover/act:text-(--amber) transition-colors">
                        RETORNO
                    </span>
                    <span className="text-xl font-mono font-black text-(--text-muted) leading-none group-hover/act:text-white transition-colors mt-1">
                        ACT_0{level.act}
                    </span>
                </div>
            </Link>

            {/* ─── COMPARTIMENTO 02: PLACA DE IDENTIFICACIÓN (MAIN PLATE) ─── */}
            <div className="relative flex-1 flex flex-col justify-center px-8 py-5 border-b md:border-b-0 md:border-r-4 border-(--border-color) bg-(--bg-surface) overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]">

                {/* Tornillos expuestos en las esquinas */}
                <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-black border border-(--border-muted-color) shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center"><div className="w-1 h-px bg-(--text-ghost) rotate-45" /></div>
                <div className="absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-black border border-(--border-muted-color) shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center"><div className="w-1 h-px bg-(--text-ghost) rotate-12" /></div>
                <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-black border border-(--border-muted-color) shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center"><div className="w-1 h-px bg-(--text-ghost) -rotate-45" /></div>
                <div className="absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-black border border-(--border-muted-color) shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center"><div className="w-1 h-px bg-(--text-ghost) rotate-90" /></div>

                {/* Marca de agua estilo "Número de Serie Militar" estampado */}
                <span className="absolute -top-2 right-4 text-7xl font-black font-mono text-black opacity-30 pointer-events-none select-none tracking-tighter">
                    {level.id}
                </span>

                {/* Código de barras decorativo */}
                <div className="absolute bottom-3 right-16 flex gap-[2px] opacity-20 pointer-events-none">
                    <div className="w-1 h-6 bg-(--text-muted)" /><div className="w-0.5 h-6 bg-(--text-muted)" /><div className="w-2 h-6 bg-(--text-muted)" /><div className="w-0.5 h-6 bg-(--text-muted)" /><div className="w-1.5 h-6 bg-(--text-muted)" /><div className="w-1 h-6 bg-(--text-muted)" />
                </div>

                <div className="relative z-10 flex flex-col gap-1 mt-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-(--amber) text-black px-1.5 py-0.5 text-[8px] font-mono font-black uppercase tracking-widest">
                            SECTOR_ACTIVO
                        </span>
                        <span className="text-[10px] font-mono text-(--text-muted) uppercase tracking-[0.3em] font-bold">
                            // {level.actName}
                        </span>
                    </div>
                    <h1 id="level-title" className="text-3xl md:text-5xl font-mono font-black text-white leading-none uppercase tracking-tighter drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                        {level.title}
                    </h1>
                </div>
            </div>

            {/* ─── COMPARTIMENTO 03: MÓDULO DE TELEMETRÍA EXTERNO ─── */}
            <div className="flex flex-col justify-center p-5 min-w-fit md:min-w-[260px] bg-[#050608] relative">

                <div className="flex items-center justify-between w-full mb-2">
                    <span className="text-[9px] font-mono text-(--text-ghost) uppercase tracking-widest font-black flex items-center gap-1">
                        <AlertTriangle size={10} className="text-(--amber) opacity-50" />
                        SYS_STATUS
                    </span>
                    <span className="text-[8px] font-mono text-(--text-ghost) tracking-widest">EXT.V4</span>
                </div>

                {/* Pantalla CRT / LCD de alto contraste */}
                <div className="flex flex-col bg-black border-2 border-(--border-muted-color) p-3 rounded-sm shadow-[inset_0_0_15px_rgba(0,0,0,1)] w-full">

                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-[13px] font-mono font-black tracking-widest transition-colors duration-300 drop-shadow-[0_0_5px_currentColor]
                            ${status === 'success' ? 'text-(--green-base)' : status === 'failed' ? 'text-(--red)' : isRunning ? 'text-(--amber)' : 'text-(--text-muted)'}
                        `}>
                            {status === 'success' ? 'RUTINA_OK' : status === 'failed' ? 'SYS_ERROR' : isRunning ? 'DAT_PROC' : 'STANDBY'}
                        </span>
                    </div>

                    {/* Barra de progreso de hardware rústica */}
                    <div className="flex gap-1 w-full">
                        {[0, 1, 2, 3, 4].map((i) => {
                            let barColor = 'bg-[#111]'
                            let anim = ''

                            if (status === 'success') {
                                barColor = 'bg-(--green-base) shadow-[0_0_8px_var(--green-base)]'
                            } else if (status === 'failed') {
                                barColor = i < 2 ? 'bg-(--red) shadow-[0_0_8px_var(--red)]' : 'bg-[#111]'
                                anim = 'animate-pulse'
                            } else if (isRunning) {
                                barColor = i === Math.floor(Date.now() / 200) % 5 ? 'bg-(--amber) shadow-[0_0_8px_var(--amber)]' : 'bg-[#111]'
                            } else {
                                barColor = i === 0 ? 'bg-(--text-ghost)' : 'bg-[#111]'
                            }

                            return (
                                <div
                                    key={i}
                                    className={`flex-1 h-2 rounded-[1px] transition-all duration-150 ${barColor} ${anim}`}
                                />
                            )
                        })}
                    </div>
                </div>

                {children && (
                    <div className="mt-3 flex items-center justify-center w-full border-t border-(--border-muted-color) pt-3">
                        {children}
                    </div>
                )}
            </div>
        </div>
    )
}