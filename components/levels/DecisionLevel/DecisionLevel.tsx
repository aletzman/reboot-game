'use client'

import { useState } from 'react'
import type { DecisionLevelProps } from './types'
import { LANGUAGES } from './constants'
import TerminalItem from './TerminalItem'
import InfoPanel from './InfoPanel'
import { Screw } from '@/components/ui/Screw'
import { Panel } from '@/components/ui/Panel'

export default function DecisionLevel({
    level,
    state,
    onComplete,
    onFragUse,
}: DecisionLevelProps) {
    const [selected, setSelected] = useState<string | null>(null)
    const [confirmed, setConfirmed] = useState(false)
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    function handleSelect(id: string) {
        if (confirmed) return
        // solo JavaScript es seleccionable
        if (LANGUAGES.find(l => l.id === id)?.status === 'damaged') return
        setSelected(id)
    }

    function handleConfirm() {
        if (!selected || confirmed) return
        setConfirmed(true)
        setTimeout(() => onComplete(3, state.fragUsed), 1200)
    }

    const hovered = LANGUAGES.find(l => l.id === hoveredId)
    const selectedLang = LANGUAGES.find(l => l.id === selected)

    return (
        <div className="flex-1 flex flex-col bg-(--bg-void) p-2 items-center overflow-y-auto">
            <div className="max-w-7xl w-full flex flex-col gap-8">
                {/* MAIN CHASSIS CONTAINER */}
                <div className="relative flex flex-col rounded-lg border border-black shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),inset_0_-4px_12px_rgba(0,0,0,0.9)] overflow-hidden p-[2px]">

                    {/* TOP HEADER PLATE */}
                    <header className="relative flex items-center justify-between px-6 h-14 border-b border-black bg-[linear-gradient(90deg,#0a0d11,#161C23,#0a0d11)] z-20 shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
                        <div className="absolute inset-[4px] border border-black/60 rounded-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] pointer-events-none" />

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="opacity-40"><Screw size="md" /></div>
                            <div className="flex flex-col">
                                <span className="text-xs font-mono font-black text-(--green-base) tracking-[0.2em] leading-none mb-1.5">
                                    LABORATORIO DE LENGUAJES
                                </span>
                                <span className="text-[14px] font-mono text-(--text-muted) tracking-widest leading-none">
                                    SELECCIÓN UNIDAD LÓGICA
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="text-right flex flex-col">
                                <span className="text-[10px] font-mono text-(--text-ghost) tracking-tighter uppercase">Estado Sistema</span>
                                <span className="text-[12px] font-mono font-bold text-(--green-light) animate-pulse uppercase">Sincronizando...</span>
                            </div>
                            <div className="opacity-40"><Screw size="md" /></div>
                        </div>
                    </header>

                    {/* NARRATIVE SECTION (RECESSED) */}
                    <Panel typePanel='main' className="p-3 bg-black/40 border-b border-black relative overflow-hidden">
                        <div className="flex items-start gap-6 relative z-10 max-w-3xl mx-auto">
                            <div className="w-1.5 h-16 bg-(--purple) shadow-[0_0_15px_var(--purple)] shrink-0 mt-1" />
                            <p className="text-base font-mono text-(--text-primary) leading-relaxed">
                                <span className="text-(--purple) font-black">FRAG:</span> &quot;Cada terminal contiene un lenguaje de programación.
                                Solo uno sigue operativo. Elige con cuidado — esto definirá cómo te comunicarás con los sistemas del bunker.&quot;
                            </p>
                        </div>
                    </Panel>

                    {/* INTERACTIVE CONTENT AREA (The Rack) */}
                    <div className="relative flex bg-[#030405] overflow-hidden h-[calc(100svh-460px)]">

                        {/* TERMINALS GRID AREA */}
                        <div className="flex-1 p-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {LANGUAGES.map(lang => (
                                    <TerminalItem
                                        key={lang.id}
                                        lang={lang}
                                        isSelected={selected === lang.id}
                                        isConfirmed={confirmed}
                                        onSelect={handleSelect}
                                        onMouseEnter={setHoveredId}
                                        onMouseLeave={() => setHoveredId(null)}
                                        disabled={confirmed}
                                    />
                                ))}
                            </div>
                        </div>


                    </div>

                    {/* LOWER CONSOLE PANEL */}
                    <InfoPanel
                        hovered={hovered}
                        selectedLang={selectedLang}
                        confirmed={confirmed}
                        onConfirm={handleConfirm}
                    />
                </div>
            </div>
        </div>
    )
}
