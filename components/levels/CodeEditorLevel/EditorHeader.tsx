'use client'

import { Level } from '@/types/game'

interface EditorHeaderProps {
    level: Level
    robotAPI: string
    running: boolean
    phase: 'editing' | 'running' | 'passed' | 'failed'
    onRun: () => void
}

export function EditorHeader({ level, robotAPI, running, phase, onRun }: EditorHeaderProps) {
    return (
        <div className="bg-(--bg-deep) border-b border-(--bg-hover) p-[10px_20px] flex items-center gap-6 flex-wrap relative overflow-hidden">
            {/* Background pattern accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-(--green-base) shadow-[0_0_10px_rgba(45,120,0,0.5)]" />

            <div className="flex flex-col gap-0.5">
                <div className="font-mono text-[9px] text-(--text-ghost) tracking-[0.2em] uppercase leading-none">
                    Mission Objective
                </div>
                <div className="font-mono text-[11px] text-(--green-light) tracking-widest uppercase font-bold">
                    {level.title}
                </div>
            </div>

            <div className="h-8 w-px bg-(--bg-hover) hidden sm:block" />

            {/*<div className="flex flex-col gap-0.5">
                <div className="font-mono text-[9px] text-(--text-ghost) tracking-[0.2em] uppercase leading-none">
                    System API
                </div>
                <div className="font-mono text-[11px] text-(--cyan) tracking-[0.05em]">
                    {robotAPI}
                </div>
            </div>*/}

            <div className="ml-auto flex items-center gap-4">
                {/* Status Indicator */}
                <div className="flex items-center gap-2 px-3 py-1 rounded bg-(--bg-surface) border border-(--bg-hover)">
                    <div className={`w-1.5 h-1.5 rounded-full ${running ? 'bg-(--amber) animate-pulse shadow-[0_0_8px_rgba(239,159,39,0.6)]' :
                        phase === 'passed' ? 'bg-(--green-light) shadow-[0_0_8px_rgba(85,226,0,0.6)]' :
                            phase === 'failed' ? 'bg-(--red) shadow-[0_0_8px_rgba(226,75,74,0.6)]' :
                                'bg-(--text-ghost)'
                        }`} />
                    <span className="font-mono text-[9px] uppercase tracking-widest text-(--text-muted)">
                        {running ? 'En ejecución' : phase === 'passed' ? 'Sincronizado' : phase === 'failed' ? 'Error' : 'Standby'}
                    </span>
                </div>

                <button
                    onClick={onRun}
                    disabled={running}
                    className={`group relative overflow-hidden rounded-[4px] p-[8px_24px] font-mono text-[11px] font-bold uppercase cursor-pointer tracking-[0.15em] transition-all border shadow-lg disabled:cursor-not-allowed disabled:opacity-60 ${phase === 'passed'
                        ? 'bg-(--green-darkest) border-(--green-light) text-(--green-light) shadow-[0_0_15px_rgba(45,120,0,0.3)]'
                        : 'bg-(--green-dark) border-(--green-base) text-(--green-light) hover:bg-(--green-base) hover:shadow-[0_0_20px_rgba(45,120,0,0.4)]'
                        }`}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {running ? (
                            <>
                                <span className="animate-spin text-[14px]">⟳</span>
                                Procesando
                            </>
                        ) : phase === 'passed' ? (
                            <>
                                <span className="text-[14px]">✓</span>
                                Reintentar
                            </>
                        ) : (
                            <>
                                <span className="text-[14px]">▶</span>
                                Transmitir
                            </>
                        )}
                    </span>
                    {/* Glitch/Industrial effect on hover */}
                    <div className="absolute inset-0 bg-white/5 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12" />
                </button>
            </div>
        </div>
    )
}
