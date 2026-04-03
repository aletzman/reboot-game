'use client'

import { useState, useRef } from "react";
import { Screw } from "./Screw";

interface DirectivesPanelProps {
    missionText: React.ReactNode;
    infoText: React.ReactNode;
}

export function DirectivesPanel({ missionText, infoText }: DirectivesPanelProps) {
    const [activePanel, setActivePanel] = useState<'mission' | 'info' | null>(null);
    const [panelPosition, setPanelPosition] = useState<'top' | 'bottom'>('top');
    const containerRef = useRef<HTMLDivElement>(null);

    const togglePanel = (tab: 'mission' | 'info') => {
        if (activePanel === tab) {
            setActivePanel(null);
            return;
        }

        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            // Si el elemento está muy arriba de la pantalla, mostramos la ventana hacia abajo
            if (rect.top < 250) {
                setPanelPosition('bottom');
            } else {
                setPanelPosition('top');
            }
        }

        setActivePanel(tab);
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-2xl mx-auto mb-6 pointer-events-auto z-50">

            {/* 1. VENTANA FLOTANTE (Solo el contenido emerge) */}
            <div className={`
                absolute left-0 right-0 z-100
                transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${panelPosition === 'top' ? 'bottom-full mb-4 origin-bottom' : 'top-full mt-4 origin-top'}
                ${activePanel ? 'translate-y-0 opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none ' + (panelPosition === 'top' ? 'translate-y-4' : '-translate-y-4')}
            `}>
                <div className={`
                    relative p-5 rounded-sm border border-white/10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]
                    ${activePanel === 'mission' ? 'bg-[#1A1F26]/95 border-l-2 border-l-(--green-base)' : 'bg-[#05070A]/95 border-l-2 border-l-(--amber)'}
                `}>
                    {/* Textura de rejilla técnica (ADN REBOOT) */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[3px_3px] pointer-events-none" />

                    <div className="relative z-10 font-mono text-[11px] leading-relaxed">
                        {activePanel === 'mission' ? (
                            <div className="text-(--text-primary)">
                                <div className="text-(--green-muted) mb-2 font-black tracking-[0.2em] text-xs flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-(--green-base) animate-pulse" />
                                    MISIÓN_ACTUAL
                                </div>
                                {missionText}
                            </div>
                        ) : (
                            <div className="text-(--amber)">
                                <div className="text-(--amber) mb-2 font-black tracking-[0.2em] text-[8px] flex items-center gap-2 opacity-60">
                                    <span className="w-2 h-px bg-(--amber)" />
                                    ASISTENCIA_SISTEMA
                                </div>
                                {infoText}
                            </div>
                        )}
                    </div>

                    {/* Tornillo de cierre estético */}
                    <Screw corner="br" size="sm" />
                </div>

                {/* Triángulo indicador (Puntero hacia el botón) */}
                <div className={`
                    absolute left-[25%] -translate-x-1/2 w-0 h-0 
                    border-x-8 border-x-transparent
                    ${panelPosition === 'top' ? 'top-full' : 'bottom-full'}
                    ${panelPosition === 'top'
                        ? (activePanel === 'mission' ? 'border-t-8 border-t-[#1A1F26]/95' : 'border-t-8 border-t-[#05070A]/95 ml-[50%]')
                        : (activePanel === 'mission' ? 'border-b-8 border-b-[#1A1F26]/95' : 'border-b-8 border-b-[#05070A]/95 ml-[50%]')
                    }
                    transition-all duration-300
                `} />
            </div>

            {/* 2. BARRA DE BOTONES TÁCTICOS (Estilo TacticalSection) */}
            <div className="flex gap-2">

                {/* Botón Estilo REBOOT: MISIÓN */}
                <button
                    onClick={() => togglePanel('mission')}
                    className={`
                        flex-1 h-12 relative overflow-hidden transition-all flex items-center px-3 border
                        ${activePanel === 'mission' 
                            ? 'bg-[#1A1F26] border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_10px_rgba(0,0,0,0.5)]' 
                            : 'bg-black/40 border-black shadow-[inset_0_2px_10px_rgba(0,0,0,1)] hover:bg-[#1A1F26]/50'}
                    `}
                >
                    {/* Bisel lateral de estado librete */}
                    <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-300 ${activePanel === 'mission' ? 'bg-(--green-base) shadow-[0_0_8px_var(--green-base)]' : 'bg-white/10'}`} />

                    <div className="flex flex-col items-start ml-2 relative z-10">
                        <span className="text-[7px] font-mono text-(--text-muted) tracking-widest font-black uppercase opacity-60">ACTION_01</span>
                        <span className={`text-[10px] font-mono font-black tracking-widest mt-0.5 ${activePanel === 'mission' ? 'text-white' : 'text-(--text-ghost)'}`}>
                            MISIÓN_ACTUAL
                        </span>
                    </div>

                    <div className={`ml-auto w-1.5 h-1.5 rounded-full border border-black/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all ${activePanel === 'mission' ? 'bg-(--green-base) shadow-[0_0_8px_var(--green-base)]' : 'bg-black'}`} />
                    
                    {/* Textura de relleno cuando activo */}
                    {activePanel === 'mission' && (
                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[length:3px_3px] pointer-events-none" />
                    )}
                </button>

                {/* Botón Estilo REBOOT: INFO */}
                <button
                    onClick={() => togglePanel('info')}
                    className={`
                        flex-1 h-12 relative overflow-hidden transition-all flex items-center px-3 border
                        ${activePanel === 'info' 
                            ? 'bg-[#1A1F26] border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_10px_rgba(0,0,0,0.5)]' 
                            : 'bg-black/40 border-black shadow-[inset_0_2px_10px_rgba(0,0,0,1)] hover:bg-[#1A1F26]/50'}
                    `}
                >
                    {/* Bisel lateral de estado info */}
                    <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-300 ${activePanel === 'info' ? 'bg-(--amber) shadow-[0_0_8px_var(--amber)]' : 'bg-white/10'}`} />

                    <div className="flex flex-col items-start ml-2 relative z-10">
                        <span className="text-[7px] font-mono text-(--text-muted) tracking-widest font-black uppercase opacity-60">DATA_02</span>
                        <span className={`text-[10px] font-mono font-black tracking-widest mt-0.5 ${activePanel === 'info' ? 'text-white' : 'text-(--text-ghost)'}`}>
                            INFO_SISTEMA
                        </span>
                    </div>

                    <div className={`ml-auto w-1.5 h-1.5 rounded-full border border-black/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition-all ${activePanel === 'info' ? 'bg-(--amber) shadow-[0_0_8px_var(--amber)]' : 'bg-black'}`} />
                    
                    {/* Líneas de advertencia cuando activo */}
                    {activePanel === 'info' && (
                        <div className="absolute top-0 right-0 w-12 h-full opacity-[0.08] bg-[repeating-linear-gradient(-45deg,transparent,transparent_5px,var(--amber)_5px,var(--amber)_6px)] pointer-events-none" />
                    )}
                </button>

            </div>
        </div>
    );
}