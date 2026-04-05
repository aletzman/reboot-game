'use client'

import React from 'react'
import { FastForward } from 'lucide-react'
import { useSettingsStore } from '@/store/settings.store'
import { Screw } from '@/components/ui/Screw'

export function SpeedSelector() {
    const simulationSpeed = useSettingsStore(state => state.simulationSpeed)
    const setSimulationSpeed = useSettingsStore(state => state.setSimulationSpeed)

    const speeds = [0.5, 1, 2, 4]

    return (
        <div className="flex items-center gap-4 bg-[#0a0c10] border border-white/10 px-3 h-[36px] rounded-xs shadow-[inset_0_2px_10px_rgba(0,0,0,1)] relative group/speed select-none">
            {/* Chasis details */}
            <div className="absolute top-0 left-0 right-0 h-px bg-white/5 pointer-events-none" />

            {/* Label Section */}
            <div className="flex items-center gap-2 pr-3 border-r border-white/10 h-4 my-auto">
                <span className="text-[10px] font-mono font-black text-(--text-muted)/80 uppercase tracking-[0.2em]">SPEED</span>
            </div>

            {/* Selector de Botones Mecánicos */}
            <div className="flex items-center gap-2">
                {speeds.map(s => (
                    <button
                        key={s}
                        onClick={() => setSimulationSpeed(s)}
                        className={`
                            w-10 h-6 rounded-xs transition-all duration-75 flex items-center justify-center cursor-pointer relative overflow-hidden group/btn
                            border border-white/10 font-mono text-[9px] font-black
                            
                            /* FÍSICA DEL BOTÓN: Hundido si es el seleccionado */
                            ${simulationSpeed === s
                                ? 'bg-[#151005] border-t-black border-b-white/5 shadow-[inset_0_2px_6px_rgba(0,0,0,1)] translate-y text-(--amber)'
                                : 'bg-[#1a1c20] border-t-white/10 border-b-2 border-b-black shadow-[0_2px_4px_rgba(0,0,0,0.6)] text-white/40 hover:bg-[#252830] hover:text-white/60 active:translate-y active:border-b-0'}
                        `}
                    >
                        <span className="relative z-10 text-xs">{s}x</span>

                        {/* LED indicador en la esquina superior derecha (Estilo Audio Mute) */}
                        <div className={`absolute top-1 right-1 w-[1.5px] h-[1.5px] rounded-full transition-all
                            ${simulationSpeed === s
                                ? 'bg-(--amber) shadow-[0_0_5px_var(--amber)]'
                                : 'bg-black shadow-[inset_0_1px_1px_rgba(0,0,0,1)]'}`}
                        />

                        {/* Reflejo interno sutil para dar volumen al plástico */}
                        <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent pointer-events-none" />
                    </button>
                ))}
            </div>

            {/* Hardware decoration final */}
            <div className="ml-auto *:">
                <Screw size="sm" rotation={-45} />
            </div>
        </div>
    )
}