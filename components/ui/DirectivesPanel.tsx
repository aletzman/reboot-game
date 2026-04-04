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

            {/* 1. VENTANA DE DATOS (ESTILO TERMINAL EXTERNA) */}
            <div className={`
                absolute left-0 right-0 z-100
                transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${panelPosition === 'top' ? 'bottom-[calc(100%+20px)] origin-bottom' : 'top-[calc(100%+20px)] origin-top'}
                ${activePanel ? 'translate-y-0 opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none ' + (panelPosition === 'top' ? 'translate-y-4' : '-translate-y-4')}
            `}>
                <div className="relative p-1 bg-[#1A1F26] border border-[#2D333B] shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)]">

                    {/* Estructura Modular (Tornillos) */}
                    <Screw corner="tl" size="sm" />
                    <Screw corner="tr" size="sm" />
                    <Screw corner="bl" size="sm" />
                    <Screw corner="br" size="sm" />

                    {/* Pantalla CRT Rehundida */}
                    <div className={`
                        relative w-full h-full p-6 overflow-hidden border-2 border-black
                        shadow-[inset_0_10px_30px_rgba(0,0,0,1)]
                        ${activePanel === 'mission' ? 'bg-[#040804]' : 'bg-[#080602]'}
                    `}>
                        {/* Efecto de Escaneo CRT */}
                        <div className="absolute inset-0 opacity-[0.3] pointer-events-none crt-overlay" />
                        <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/2 to-transparent bg-size-[100%_4px] pointer-events-none" />

                        <div className="relative z-10 font-mono text-xs leading-relaxed">
                            {activePanel === 'mission' ? (
                                <div className="text-(--green-light) [text-shadow:0_0_10px_var(--green-base)]">
                                    <div className="flex items-center gap-3 mb-4 pb-2 border-b border-(--green-dark)/30">
                                        <div className="w-2 h-2 bg-(--green-base) animate-pulse" />
                                        <span className="font-black tracking-[0.2em] text-[10px]">OBJETIVOS_DEL_SISTEMA</span>
                                    </div>
                                    <div className="opacity-90">{missionText}</div>
                                </div>
                            ) : (
                                <div className="text-(--amber) [text-shadow:0_0_10px_var(--amber)]">
                                    <div className="flex items-center gap-3 mb-4 pb-2 border-b border-[#594A12]/30">
                                        <div className="w-2 h-2 bg-(--amber) animate-pulse" />
                                        <span className="font-black tracking-[0.2em] text-[10px]">MANUAL_DE_AYUDA</span>
                                    </div>
                                    <div className="opacity-90">{infoText}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rejilla de ventilación decorativa arriba */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1 opacity-20">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="w-3 h-1 bg-black border-t border-white/20" />
                        ))}
                    </div>
                </div>

                {/* Puntero de dirección (TRIÁNGULO) */}
                <div className={`absolute -translate-x-1/2 w-0 h-0 
                    border-x-10 border-x-transparent
                    ${activePanel === 'info' ? 'left-[75%]' : 'left-[25%]'}
                    ${panelPosition === 'top'
                        ? 'top-full border-t-10 border-t-[#1A1F26]'
                        : 'bottom-full border-b-10 border-b-[#1A1F26]'}
                    transition-all duration-300 z-110
                    drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]
                `} />

            </div>

            {/* 2. BOTONERA INDUSTRIAL (SOCKET & PLUNGER) */}
            <div className="flex gap-4 p-2 bg-[#080B0E] border border-[#1A222C] rounded-sm shadow-[0_4px_0_0_#000]">

                {/* BOTÓN: OBJETIVO */}
                <div className="flex-1 h-14 relative bg-black/60 rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] p-[2px]">
                    <button
                        onClick={() => togglePanel('mission')}
                        className={`
                relative w-full h-full flex items-center px-4 transition-all duration-200 cursor-pointer rounded-sm
                ${activePanel === 'mission'
                                ? 'bg-[#0A0C0F] border-transparent shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] opacity-100'
                                : 'bg-[#121519] border-r-2 border-b-2 border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-[#1A1F26] opacity-80 hover:opacity-100'}
            `}
                    >
                        <div className={`
                absolute left-1 top-2 bottom-2 w-1 transition-all duration-300
                ${activePanel === 'mission' ? 'bg-(--green-base) shadow-[0_0_15px_var(--green-base)]' : 'bg-[#2D333B]'}
            `} />
                        <div className="flex flex-col items-start ml-2">
                            <span className="text-[8px] font-mono text-(--text-muted) tracking-widest font-black uppercase opacity-60">COM_01</span>
                            <span className={`text-[11px] font-mono font-bold tracking-widest ${activePanel === 'mission' ? 'text-(--green-light) [text-shadow:0_0_8px_var(--green-base)]' : 'text-(--text-muted)'}`}>
                                OBJETIVO
                            </span>
                        </div>
                        <div className={`ml-auto w-2 h-2 rounded-full border transition-all ${activePanel === 'mission' ? 'bg-(--green-base) border-black shadow-[0_0_10px_var(--green-base)]' : 'bg-black border-[#2D333B]'}`} />
                    </button>
                </div>

                {/* BOTÓN: AYUDA */}
                <div className="flex-1 h-14 relative bg-black/60 rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] p-[2px]">
                    <button
                        onClick={() => togglePanel('info')}
                        className={`
                relative w-full h-full flex items-center px-4 transition-all duration-200 cursor-pointer rounded-sm
                ${activePanel === 'info'
                                ? 'bg-[#0A0C0F] border-transparent shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] opacity-100'
                                : 'bg-[#121519] border-r-2 border-b-2 border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-[#1A1F26] opacity-80 hover:opacity-100'}
            `}
                    >
                        <div className={`
                absolute left-1 top-2 bottom-2 w-1 transition-all duration-300
                ${activePanel === 'info' ? 'bg-(--amber) shadow-[0_0_15px_var(--amber)]' : 'bg-[#2D333B]'}
            `} />
                        <div className="flex flex-col items-start ml-2">
                            <span className="text-[8px] font-mono text-(--text-muted) tracking-widest font-black uppercase opacity-60">REG_02</span>
                            <span className={`text-[11px] font-mono font-bold tracking-widest ${activePanel === 'info' ? 'text-(--amber) [text-shadow:0_0_8px_var(--amber)]' : 'text-(--text-muted)'}`}>
                                AYUDA_SISTEMA
                            </span>
                        </div>
                        <div className={`ml-auto w-2 h-2 rounded-full border transition-all ${activePanel === 'info' ? 'bg-(--amber) border-black shadow-[0_0_10px_var(--amber)]' : 'bg-black border-[#2D333B]'}`} />
                    </button>
                </div>

            </div>

        </div>
    );
}

