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
        <div ref={containerRef} className="relative w-full max-w-2xl mx-auto pointer-events-auto z-50">

            {/* 1. VENTANA FLOTANTE (Diseño Industrial CRT REBOOT) */}
            <div className={`
                absolute left-0 right-0 z-100
                transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${panelPosition === 'top' ? 'bottom-full mb-4 origin-bottom' : 'top-full mt-4 origin-top'}
                ${activePanel ? 'translate-y-0 opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none ' + (panelPosition === 'top' ? 'translate-y-4' : '-translate-y-4')}
            `}>
                <div
                    className="relative p-[4px] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_0_1px_rgba(0,0,0,1)]"
                    style={{
                        background: 'linear-gradient(180deg, #2A313C 0%, #15191E 100%)',
                        borderTop: '1px solid #4D5B69',
                        borderBottom: '1px solid #080A0C'
                    }}
                >
                    {/* Tornillos en las esquinas de la carcasa */}
                    <Screw corner="tl" size="sm" />
                    <Screw corner="tr" size="sm" />
                    <Screw corner="bl" size="sm" />
                    <Screw corner="br" size="sm" />

                    <div className={`
                        relative w-full h-full p-5 overflow-hidden border border-black shadow-[inset_0_5px_20px_rgba(0,0,0,0.8)]
                        ${activePanel === 'mission' ? 'bg-[#020502]' : 'bg-[#0a0701]'}
                    `}>
                        {/* CRT / Scanline Background */}
                        <div className="absolute inset-0 opacity-[0.15] pointer-events-none crt-overlay" />

                        {/* Resplandor lateral sutil */}
                        {activePanel === 'mission' && (
                            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-(--green-base) opacity-50 shadow-[0_0_20px_var(--green-base)] pointer-events-none" />
                        )}
                        {activePanel === 'info' && (
                            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-(--amber) opacity-50 shadow-[0_0_20px_var(--amber)] pointer-events-none" />
                        )}

                        <div className="relative z-10 font-mono text-[11px] leading-relaxed">
                            {activePanel === 'mission' ? (
                                <div className="text-(--green-light) [text-shadow:0_0_8px_rgba(126,213,38,0.4)]">
                                    <div className="text-(--green-base) mb-3 font-black tracking-[0.25em] text-[10px] flex items-center gap-3 border-b border-(--green-dark)/50 pb-2">
                                        <div className="relative w-2 h-2">
                                            <span className="absolute inset-0 bg-(--green-base) animate-ping opacity-75" />
                                            <span className="relative block w-2 h-2 bg-(--green-base) shadow-[0_0_8px_var(--green-base)]" />
                                        </div>
                                        MISIÓN_ESTADO_ACTUAL
                                    </div>
                                    <div className="opacity-95">{missionText}</div>
                                </div>
                            ) : (
                                <div className="text-(--amber) [text-shadow:0_0_8px_rgba(239,159,39,0.4)]">
                                    <div className="text-[#c5811b] mb-3 font-black tracking-[0.25em] text-[10px] flex items-center gap-3 border-b border-[#594A12]/50 pb-2">
                                        <div className="w-3 h-[3px] bg-(--amber) shadow-[0_0_8px_var(--amber)] animate-pulse" />
                                        REGISTRO_ASISTENCIA
                                    </div>
                                    <div className="opacity-95">{infoText}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Triángulo indicador (Puntero adaptado al chasis metálico) */}
                <div className={`
                    absolute -translate-x-1/2 w-0 h-0 
                    border-x-12 border-x-transparent
                    ${activePanel === 'info' ? 'left-[75%]' : 'left-[25%]'}
                    ${panelPosition === 'top' ? 'top-[calc(100%-1px)] border-t-12 border-t-[#15191E]' : 'bottom-[calc(100%-1px)] border-b-12 border-b-[#2A313C]'}
                    transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
                    drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]
                `} />
            </div>

            {/* 2. BARRA DE BOTONES TÁCTICOS (Estilo Bloque Industrial) */}
            <div className="flex gap-2">

                {/* Botón Estilo REBOOT: MISIÓN */}
                <button
                    onClick={() => togglePanel('mission')}
                    className={`
                        flex-1 h-14 relative overflow-hidden transition-all flex items-center px-4 border
                        ${activePanel === 'mission'
                            ? 'bg-[#1e2329] border-[#4D5B69] shadow-[0_4px_15px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]'
                            : 'bg-[#121519] border-[#080A0C] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] hover:bg-[#1A1F26]'}
                    `}
                >
                    {/* Bisel lateral de estado */}
                    <div className={`absolute left-0 top-0 bottom-0 w-[4px] transition-all duration-300 ${activePanel === 'mission' ? 'bg-(--green-base) shadow-[0_0_15px_var(--green-base)]' : 'bg-[#2D333B]'}`} />

                    <div className="flex flex-col items-start justify-center ml-3 relative z-10">
                        <span className="text-[9px] font-mono text-[#8B949E] tracking-[0.2em] font-bold uppercase opacity-80">CMD_01</span>
                        <span className={`text-[12px] font-mono font-black tracking-widest mt-0.5 ${activePanel === 'mission' ? 'text-(--green-light) [text-shadow:0_0_8px_var(--green-base)]' : 'text-[#3D444D]'}`}>
                            OBJETIVO
                        </span>
                    </div>

                    <div className={`ml-auto w-2.5 h-2.5 rounded-sm border transition-all ${activePanel === 'mission' ? 'bg-(--green-base) border-black shadow-[0_0_10px_var(--green-base),inset_0_1px_2px_rgba(255,255,255,0.5)]' : 'bg-[#0C1117] border-[#2D333B] shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]'}`} />

                    {/* Textura de relleno cuando activo */}
                    {activePanel === 'mission' && (
                        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[4px_4px] pointer-events-none" />
                    )}
                </button>

                {/* Botón Estilo REBOOT: INFO */}
                <button
                    onClick={() => togglePanel('info')}
                    className={`
                        flex-1 h-14 relative overflow-hidden transition-all flex items-center px-4 border
                        ${activePanel === 'info'
                            ? 'bg-[#1e2329] border-[#4D5B69] shadow-[0_4px_15px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]'
                            : 'bg-[#121519] border-[#080A0C] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] hover:bg-[#1A1F26]'}
                    `}
                >
                    {/* Bisel lateral de estado */}
                    <div className={`absolute left-0 top-0 bottom-0 w-[4px] transition-all duration-300 ${activePanel === 'info' ? 'bg-(--amber) shadow-[0_0_15px_var(--amber)]' : 'bg-[#2D333B]'}`} />

                    <div className="flex flex-col items-start justify-center ml-3 relative z-10">
                        <span className="text-[9px] font-mono text-[#8B949E] tracking-[0.2em] font-bold uppercase opacity-80">DAT_02</span>
                        <span className={`text-[12px] font-mono font-black tracking-widest mt-0.5 ${activePanel === 'info' ? 'text-(--amber) [text-shadow:0_0_8px_var(--amber)]' : 'text-[#3D444D]'}`}>
                            ASISTENCIA
                        </span>
                    </div>

                    <div className={`ml-auto w-2.5 h-2.5 rounded-sm border transition-all ${activePanel === 'info' ? 'bg-(--amber) border-black shadow-[0_0_10px_var(--amber),inset_0_1px_2px_rgba(255,255,255,0.5)]' : 'bg-[#0C1117] border-[#2D333B] shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]'}`} />

                    {/* Líneas de advertencia cuando activo */}
                    {activePanel === 'info' && (
                        <div className="absolute top-0 right-0 w-20 h-full opacity-[0.12] bg-[repeating-linear-gradient(-45deg,transparent,transparent_6px,var(--amber)_6px,var(--amber)_12px)] pointer-events-none" />
                    )}
                </button>

            </div>
        </div>
    );
}