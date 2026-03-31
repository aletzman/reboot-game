import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { Level, LevelState } from '@/types/game'

interface LevelHeaderProps {
    level: Level
    status: LevelState['status']
    isRunning: boolean
    children?: React.ReactNode
}

export function LevelHeader({ level, status, isRunning, children }: LevelHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row items-stretch border border-(--border-muted-color) bg-(--bg-deep) overflow-hidden shadow-2xl relative z-20">
            {/* COMPARTIMENT 01: ACT IDENTIFICATION & NAVIGATION */}
            <Link
                href={`/game/${level.act}`}
                className="flex flex-row items-center justify-center p-3 pl-1 border-b md:border-b-0 md:border-r border-(--border-muted-color) min-w-[75px] bg-black/30 hover:bg-(--bg-hover) transition-all group/act relative overflow-hidden"
                title={`Volver a ${level.actName}`}
            >
                <ChevronLeft size={35} className="text-(--green-base) opacity-100 group-hover/act:opacity-100 transition-all" />
                <div className="flex flex-col items-center justify-center">
                    <span className="text-[8px] font-mono font-bold text-(--text-muted) mb-2 vertical-text tracking-[.4em] uppercase opacity-50 group-hover/act:text-(--green-light) group-hover/act:opacity-100 transition-all">IR_A_SECTOR</span>
                    <div className="w-full h-px bg-(--border-muted-color) mb-2 opacity-20 group-hover/act:bg-(--green-base) transition-all" />
                    <div className="relative">
                        <span className="text-2xl font-mono font-black text-(--text-primary) leading-none group-hover/act:text-(--green-light) transition-all">0{level.act}</span>
                    </div>
                </div>
            </Link>

            {/* COMPARTIMENT 02: MISSION OPERATIONAL DATA */}
            <div className="relative flex-1 flex flex-col justify-center px-6 py-4 md:py-0 border-b md:border-b-0 md:border-r border-(--border-muted-color)">
                <h1 id="level-title" className="text-3xl md:text-4xl font-(family-name:--font-title) font-semibold text-white leading-none uppercase">
                    {level.title}
                </h1>
                <span className="text-xs font-mono text-(--green-light) uppercase">{level.actName}</span>
                <span className="absolute top-2 right-2 text-6xl font-(family-name:--font-title) text-(--text-muted)/10 uppercase">{level.id}</span>
            </div>

            {/* COMPARTIMENT 03: TELEMETRY & SYNC */}
            <div className="flex items-center justify-end p-4 min-w-fit md:min-w-[280px] bg-black/20 gap-6">
                {children && (
                    <div className="flex items-center">
                        {children}
                    </div>
                )}
                
                <div className="flex flex-col items-end gap-2">
                    <span className="text-[8px] font-mono text-(--text-muted) uppercase tracking-[0.3em] font-black opacity-65 leading-none">
                        MISSION_STATUS
                    </span>

                    <div className="flex items-center gap-4">
                        <span className={`text-xs md:text-[13px] font-mono font-black tracking-widest transition-colors duration-300
                            ${status === 'success' ? 'text-(--green-light)' : status === 'failed' ? 'text-(--red)' : isRunning ? 'text-(--amber)' : 'text-(--text-primary)'}
                        `}>
                            {status === 'success' ? 'SECUENCIA_OK' : status === 'failed' ? 'ERROR_DE_EJECUCION' : isRunning ? 'EJECUTANDO' : 'EN_ESPERA'}
                        </span>

                        <div className="flex gap-[3px]">
                            {[0, 1, 2].map((i) => {
                                let barColor = 'bg-(--bg-hover)'
                                let anim = ''

                                if (status === 'success') {
                                    barColor = 'bg-(--green-base)'
                                } else if (status === 'failed') {
                                    barColor = 'bg-(--red)'
                                    anim = 'animate-pulse'
                                } else if (isRunning) {
                                    barColor = 'bg-(--amber)'
                                    anim = i === 0 ? 'animate-pulse' : i === 1 ? 'animate-pulse opacity-75' : 'animate-pulse opacity-40'
                                } else {
                                    barColor = i === 0 ? 'bg-(--text-muted)' : 'bg-(--bg-hover)'
                                }

                                return (
                                    <div
                                        key={i}
                                        className={`w-2 h-4 rounded-[1px] transition-colors duration-300 ${barColor} ${anim}`}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
