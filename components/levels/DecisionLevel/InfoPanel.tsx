'use client'

import { Panel } from '@/components/ui/Panel'
import { LanguageOption } from './types'
import { Screw } from '@/components/ui/Screw'
import { ChevronRightIcon } from 'lucide-react'

interface InfoPanelProps {
    hovered: LanguageOption | undefined
    selectedLang: LanguageOption | undefined
    confirmed: boolean
    onConfirm: () => void
}

export default function InfoPanel({
    hovered,
    selectedLang,
    confirmed,
    onConfirm
}: InfoPanelProps) {
    const displayLang = hovered ?? selectedLang
    const isActive = displayLang?.status === 'active'

    return (
        <Panel typePanel='footer' className="relative flex flex-col p-4 border-t border-black bg-[linear-gradient(0deg,#0a0d11,#12161a)] z-20 shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* TELEMETRY DISPLAY */}
                <div className="md:col-span-2 space-y-5">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${displayLang ? (isActive ? 'bg-(--green-light) animate-pulse shadow-[0_0_10px_var(--green-light)]' : 'bg-(--red) shadow-[0_0_10px_var(--red)]') : 'bg-white/5 shadow-[0_0_5px_rgba(255,255,255,0.1)]'}`} />
                        <h4 className="text-xs font-mono font-black text-(--text-muted) tracking-[0.3em] uppercase underline decoration-1 underline-offset-4">Análisis de Integridad</h4>
                    </div>

                    <div className="relative p-8 bg-black/40 border border-black rounded-sm shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] overflow-hidden min-h-[140px]">
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#fff_2px,#fff_4px)]" />

                        {displayLang ? (
                            <div className="relative z-10 animate-in fade-in slide-in-from-left-2 duration-300">
                                <div className="flex items-center gap-4 mb-3">
                                    <span className={`text-2xl font-black text-white tracking-widest uppercase`}>{displayLang.name}</span>
                                    <span className={`px-3 py-1 text-[10px] font-black border-2 rounded-sm ${isActive ? 'border-(--green-base) text-(--green-light)' : 'border-(--red-muted) text-(--red)'}`}>
                                        {isActive ? 'COMPATIBLE' : 'INCOMPATIBLE'}
                                    </span>
                                </div>
                                <p className="text-base font-mono text-(--text-primary) leading-relaxed uppercase tracking-wider font-medium">
                                    {displayLang.description}
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <span className="text-sm font-mono text-(--text-ghost) tracking-widest uppercase animate-pulse">
                                    // Esperando entrada de datos...
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ACTION CONSOLE */}
                <div className="flex flex-col justify-end gap-5 relative">
                    <div className="flex items-center justify-between text-[10px] font-bold text-(--text-ghost) tracking-widest mb-1 px-1 uppercase">
                        <span>Consola Comandos</span>
                        <span>v1.0.4</span>
                    </div>

                    {selectedLang && !confirmed ? (
                        <button
                            onClick={onConfirm}
                            className="group relative flex items-center justify-between w-full h-20 px-8 bg-(--green-darkest) border-2 border-(--green-base) rounded-sm transition-all hover:bg-(--green-dark) hover:shadow-[0_0_30px_rgba(45,120,0,0.5)] active:translate-y-1 active:shadow-inner overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex flex-col items-start relative z-10 text-left">
                                <span className="text-[10px] text-(--green-light)/60 font-black tracking-widest uppercase mb-1">Sincronizar Kernels</span>
                                <span className="text-[16px] text-(--green-light) font-black tracking-widest uppercase">Cargar {selectedLang.name}</span>
                            </div>
                            <ChevronRightIcon className="w-6 h-6 text-(--green-light) group-hover:translate-x-2 transition-transform" strokeWidth={4} />
                        </button>
                    ) : confirmed ? (
                        <div className="flex flex-col items-center justify-center h-20 border-2 border-(--green-light) bg-(--green-darkest) rounded-sm shadow-[0_0_20px_rgba(126,213,38,0.2)]">
                            <span className="text-[14px] font-black text-(--green-light) tracking-[.25em] uppercase">SISTEMA_OK</span>
                            <div className="flex gap-2 mt-2">
                                <div className="w-1.5 h-4 bg-(--green-light) animate-pulse shadow-[0_0_8px_var(--green-light)]" />
                                <div className="w-1.5 h-4 bg-(--green-light) animate-pulse delay-75 shadow-[0_0_8px_var(--green-light)]" />
                                <div className="w-1.5 h-4 bg-(--green-light) animate-pulse delay-150 shadow-[0_0_8px_var(--green-light)]" />
                            </div>
                        </div>
                    ) : (
                        <div className="h-20 border-2 border-dashed border-white/5 rounded-sm flex items-center justify-center opacity-30">
                            <span className="text-[10px] font-mono text-(--text-ghost) tracking-widest uppercase">Selección Requerida</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center opacity-20">
                        <Screw size="sm" />
                        <div className="h-px bg-white/10 flex-1 mx-4" />
                        <Screw size="sm" />
                    </div>
                </div>
            </div>
        </Panel>
    )
}
