'use client'

import { LanguageOption } from './types'
import { Screw } from '@/components/ui/Screw'

interface TerminalItemProps {
    lang: LanguageOption
    isSelected: boolean
    isConfirmed: boolean
    onSelect: (id: string) => void
    onMouseEnter: (id: string) => void
    onMouseLeave: () => void
    disabled: boolean
}

export default function TerminalItem({
    lang,
    isSelected,
    isConfirmed,
    onSelect,
    onMouseEnter,
    onMouseLeave,
    disabled
}: TerminalItemProps) {
    const isActive = lang.status === 'active'
    const actuallyConfirmed = isConfirmed && isSelected

    // Design tokens based on status
    const statusLight = isActive ? 'var(--green-light)' : 'var(--red)'

    return (
        <div
            onClick={() => isActive && onSelect(lang.id)}
            onMouseEnter={() => onMouseEnter(lang.id)}
            onMouseLeave={onMouseLeave}
            className={`relative flex flex-col min-h-[180px] transition-all duration-300 font-mono group rounded-md p-1 border border-black shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),inset_0_-4px_12px_rgba(0,0,0,0.9)] 
                ${isActive && !disabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}
            `}
        >
            {/* THE UNIT (Plunger) */}
            <article className={`relative flex flex-col h-full rounded-sm overflow-hidden bg-[linear-gradient(180deg,#161b22,#0a0d11)] transition-all duration-300 ease-out z-10 border-2
                ${actuallyConfirmed
                    ? 'border-(--green-light) bg-(--green-darkest) shadow-[0_0_20px_rgba(126,213,38,0.3)]'
                    : isSelected
                        ? 'border-(--green-base) bg-[#0d1f00] -translate-y-1 shadow-[0_12px_28px_rgba(45,120,0,0.4)]'
                        : isActive
                            ? 'border-[#1c2229] hover:border-(--green-base)/40 hover:-translate-y-1 shadow-[0_6px_12px_rgba(0,0,0,0.6)]'
                            : 'border-[#1a2026] grayscale'
                }
            `}>
                {/* Metallic Header */}
                <header className="h-[36px] border-b border-black bg-[linear-gradient(90deg,#0a0d11,#161C23,#0a0d11)] flex items-center justify-between px-3 shrink-0 relative shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                    <div className="opacity-20"><Screw size="md" /></div>

                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-4 rounded-[1px] shadow-[0_0_5px_currentColor] transition-colors duration-500
                            ${actuallyConfirmed ? 'bg-(--green-light) text-(--green-light)' : isActive ? 'bg-(--green-base) text-(--green-base)' : 'bg-(--red-muted) text-(--red-muted)'}
                         `} />
                        <span className="text-[12px] font-black tracking-widest text-(--text-muted) uppercase">UNIDAD_{lang.id.toUpperCase()}</span>
                    </div>

                    <div className="opacity-20"><Screw size="md" /></div>
                </header>

                {/* Content Area (Inset) */}
                <div className="flex-1 p-5 bg-black/40 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden">
                    {/* Background Noise */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#fff_2px,#fff_4px)]" />

                    <div className="relative z-10">
                        <div className="text-[20px] font-black tracking-tight text-white leading-tight mb-1 uppercase">
                            {lang.name}
                        </div>
                        <div className="text-[11px] text-(--text-muted) tracking-widest uppercase font-bold">
                            VERSIÓN {lang.year} // REV.0{lang.id.slice(-1)}
                        </div>
                    </div>

                    <div className="mt-auto flex justify-between items-end relative z-10 pt-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-(--text-ghost) font-black uppercase tracking-tighter mb-0.5">Estado del Módulo</span>
                            <span className={`text-[13px] font-black uppercase tracking-widest ${isActive ? 'text-(--green-light)' : 'text-(--red)'}`}>
                                {isActive ? '► OPERATIVO' : '✗ DAÑADO'}
                            </span>
                        </div>

                        {/* Status Light */}
                        <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] ${isActive && 'animate-pulse'}`}
                            style={{ backgroundColor: statusLight, color: statusLight }} />
                    </div>
                </div>

                {/* Footer Strip */}
                <footer className="h-[32px] border-t border-black bg-black/60 flex items-center px-4 font-bold">
                    <span className="text-[10px] text-(--text-ghost) truncate uppercase tracking-widest">
                        {lang.detail}
                    </span>
                </footer>

                {/* SELECTION OVERLAY */}
                {actuallyConfirmed && (
                    <div className="absolute inset-0 z-30 bg-(--green-darkest)/80 flex items-center justify-center">
                        <div className="px-5 py-2 border-2 border-(--green-light) bg-black rounded-sm shadow-[0_0_20px_var(--green-light)]">
                            <span className="text-[14px] font-black text-(--green-light) tracking-[.25em] uppercase">MÓDULO MONTADO</span>
                        </div>
                    </div>
                )}
            </article>
        </div>
    )
}
