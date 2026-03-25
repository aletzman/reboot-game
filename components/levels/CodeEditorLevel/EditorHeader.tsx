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
        <div className="bg-(--bg-surface) border-b border-(--bg-hover) p-[8px_16px] flex items-center gap-4 flex-wrap">
            <div className="font-mono text-[10px] text-(--green-base) tracking-[.12em] uppercase">
                {'//'} {level.title}
            </div>
            <div className="font-mono text-[10px] text-(--text-ghost) tracking-[.08em]">
                API: {robotAPI}
            </div>
            <div className="ml-auto flex gap-2">
                <button
                    onClick={onRun}
                    disabled={running}
                    className={`rounded-[6px] p-[6px_18px] font-mono text-[11px] cursor-pointer tracking-wider transition-all border disabled:cursor-not-allowed disabled:opacity-60 ${
                        phase === 'passed' 
                            ? 'bg-(--green-darkest) border-(--green-light) text-(--green-light)' 
                            : 'bg-(--green-dark) border-(--green-base) text-(--green-light)'
                    }`}
                >
                    {running ? '⟳ ejecutando...' : phase === 'passed' ? '✓ completado' : '▶ ejecutar'}
                </button>
            </div>
        </div>
    )
}
