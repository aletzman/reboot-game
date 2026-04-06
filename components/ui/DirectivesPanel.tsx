'use client'

import { useState, useRef } from "react";
import { Screw } from "./Screw";

import { useUIStore } from "@/lib/store/useUIStore";

interface DirectivesPanelProps {
    missionText: React.ReactNode;
    infoText: React.ReactNode;
}

export function DirectivesPanel({ missionText, infoText }: DirectivesPanelProps) {
    const { activeTab, isDirectivesOpen, activeFragHint, setDirectivesState, setActiveFragHint } = useUIStore()
    const [panelPosition, setPanelPosition] = useState<'top' | 'bottom'>('top');
    const containerRef = useRef<HTMLDivElement>(null);

    const togglePanel = (tab: 'mission' | 'info') => {
        if (isDirectivesOpen && activeTab === tab) {
            setDirectivesState(false, null);
            if (activeFragHint) setActiveFragHint(null);
            return;
        }

        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setPanelPosition(rect.top < 250 ? 'bottom' : 'top');
        }

        setDirectivesState(true, tab);
    };

    const displayInfo = activeFragHint || infoText;
    const activePanel = isDirectivesOpen ? activeTab : null;

    return (
        <div ref={containerRef} className="relative w-full max-w-2xl mx-auto pointer-events-auto z-50">

            {/* 1. VENTANA DE DATOS (ESTILO TERMINAL EXTERNA) */}
            <div className={`absolute left-0 right-0 z-100
                             transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
                             ${panelPosition === 'top' ? 'bottom-[calc(100%+20px)] origin-bottom' : 'top-[calc(100%+20px)] origin-top'}
                             ${activePanel ? 'translate-y-0 opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none ' + (panelPosition === 'top' ? 'translate-y-4' : '-translate-y-4')}
                            `}>

                {/* ETIQUETA DE CHASIS EXTERIOR */}
                <div className={`absolute right-2 text-[6px] text-(--text-ghost) font-mono tracking-widest uppercase opacity-40
                    ${panelPosition === 'top' ? '-top-3' : '-bottom-3'}`}>
                    HW_LINK // PORT_{activePanel === 'mission' ? 'A1' : 'B2'}
                </div>

                {/* CARCASA PRINCIPAL (Hardware Plate) */}
                <div className="relative p-1.75 bg-(--bg-deep) border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.02)]">

                    {/* Estructura Modular (Tornillos - mantengo tu componente) */}
                    <Screw corner="tl" size="sm" className="-translate-x-1/2 -translate-y-1/2" />
                    <Screw corner="tr" size="sm" className="translate-x-0.5 -translate-y-1/2" />
                    <Screw corner="bl" size="sm" className="-translate-x-0.5 translate-y-0.5" />
                    <Screw corner="br" size="sm" className="translate-x-0.5 translate-y-0.5" />

                    {/* REJILLAS DE VENTILACIÓN (Estilo industrial) */}
                    <div className={`absolute left-1/2 -translate-x-1/2 flex gap-1.5 px-2 py-0.5 bg-(--bg-void) border border-white/10
                        ${panelPosition === 'top' ? 'top-0 translate-y-[-50%]' : 'bottom-0 translate-y-[50%]'}`}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="w-4 h-1 bg-(--bg-deep) shadow-[inset_0_1px_2px_rgba(17,17,17,1)]" />
                        ))}
                    </div>

                    {/* PANTALLA CRT REHUNDIDA (Bisel profundo) */}
                    <div className={`relative w-full h-full p-2.5 overflow-hidden border-4 border-t-black border-l-black border-b-white/5 border-r-white/5
                        shadow-[inset_0_15px_40px_rgba(0,0,0,1)] transition-colors duration-500
                        ${activePanel === 'mission' ? 'bg-[#0a140a]' : 'bg-[#0a0514]'}`}>

                        {/* Efecto de Escaneo CRT y Ruido */}
                        <div className="absolute inset-0 opacity-[0.4] pointer-events-none crt-overlay" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.25)_50%)] bg-size-[100%_4px] pointer-events-none" />
                        <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] pointer-events-none" />

                        <div className="relative z-10 font-mono text-xs leading-relaxed select-none">

                            {/* === PANEL DE MISIÓN === */}
                            {activePanel === 'mission' ? (
                                <div className="relative p-4 bg-black/60 border border-(--green-base)/20 group">
                                    {/* Hardware brackets */}
                                    <div className="absolute top-0 left-0 w-0.5 h-full bg-(--green-base)/40" />
                                    <div className="absolute top-0 left-0 w-8 h-0.5 bg-(--green-base)/40" />
                                    <div className="absolute bottom-0 right-0 w-0.5 h-4 bg-(--green-base)/20" />
                                    <div className="absolute bottom-0 right-0 w-4 h-0.5 bg-(--green-base)/20" />

                                    {/* Encabezado */}
                                    <div className="flex justify-between items-end border-b border-white/10 pb-2 mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-(--green-light) animate-pulse shadow-[0_0_8px_var(--green-base)]" />
                                            <span className="font-black tracking-[0.2em] text-[9px] text-(--green-light) uppercase">INSTRUCCIONES_DE_NIVEL</span>
                                        </div>
                                        <span className="text-[7px] text-(--text-ghost) uppercase tracking-widest bg-(--green-base)/10 px-1 border border-(--green-base)/20">PRIORIDAD_ALPHA</span>
                                    </div>

                                    {/* Contenido de la misión */}
                                    <div className="flex gap-3 text-(--text-primary)">
                                        <div className="flex flex-col items-center mt-1">
                                            <div className="w-[2px] h-full bg-(--green-base)/30" />
                                        </div>
                                        <div className="flex-1 font-sans text-[14px] leading-relaxed opacity-90 tracking-tight text-[#e0e0e0]">
                                            {missionText}
                                        </div>
                                    </div>
                                </div>
                            ) :


                                (
                                    <div className="relative p-4 bg-(--purple)/3 border border-(--purple)/20">
                                        {/* Fondo de placa de circuito sutil */}
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(127,119,221,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(127,119,221,0.05)_1px,transparent_1px)] bg-size-[10px_10px] pointer-events-none" />

                                        {/* Header de la IA */}
                                        <div className="flex items-start gap-4 mb-3 border-b border-(--purple)/20 pb-3 relative z-10">
                                            {/* Visor Táctico */}
                                            <div className="relative w-12 h-12 bg-black/80 border border-(--purple)/30 p-1 shrink-0">
                                                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-(--purple)" />
                                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-(--purple)" />

                                                <img
                                                    src="/assets/frag_logo.png"
                                                    alt="FRAG AI"
                                                    className="w-full h-full object-contain opacity-90 animate-[pulse_3s_infinite] mix-blend-screen"
                                                />
                                            </div>

                                            {/* Datos Sistema */}
                                            <div className="flex flex-col justify-center h-12">
                                                <span className="font-black tracking-[0.2em] text-[10px] text-(--purple)">UNIDAD: FRAG_IA</span>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="font-mono text-[7px] text-(--text-ghost) uppercase">Enlace_Neuronal</span>
                                                    <span className="text-[6px] px-1.5 py-0.5 bg-(--purple)/20 text-(--purple) font-bold tracking-widest border border-(--purple)/30">ESTABLE</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Output del Asistente */}
                                        <div className="relative z-10 font-sans text-[14px] text-[#E6EDF3] tracking-tight pl-3 border-l-[3px] border-(--purple)/60 bg-linear-to-r from-(--purple)/8 to-transparent py-2 pr-2">
                                            <span className="absolute -left-[6px] top-2.5 text-[6px] text-(--purple)">▶</span>
                                            {displayInfo}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>

                {/* CONECTOR FÍSICO (Reemplaza al triángulo simple) */}
                <div className={`absolute -translate-x-1/2 w-4 h-4 bg-(--bg-surface) border border-white/10 rotate-45 z-[-1]
                    ${activePanel === 'info' ? 'left-[75%]' : 'left-[25%]'} 
                    ${panelPosition === 'top' ? 'bottom-[-6px] border-t-transparent border-l-transparent shadow-[4px_4px_10px_rgba(0,0,0,0.8)]'
                        : 'top-[-6px] border-b-transparent border-r-transparent shadow-[-4px_-4px_10px_rgba(0,0,0,0.8)]'}
                    transition-all duration-300`}
                />
            </div>

            {/* 2. BOTONERA INDUSTRIAL (SOCKET & PLUNGER) */}
            <div className="flex gap-4 p-2 bg-[#080B0E] border border-[#1A222C] rounded-sm shadow-[0_4px_0_0_#000]">

                {/* BOTÓN: OBJETIVO */}
                <div className="flex-1 h-14 relative bg-black/60 rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] p-[2px]">
                    <button
                        onClick={() => togglePanel('mission')}
                        className={`relative w-full h-full flex items-center px-4 transition-all duration-200 cursor-pointer rounded-sm
                                ${activePanel === 'mission'
                                ? 'bg-[#0A0C0F] border-transparent shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] opacity-100'
                                : 'bg-[#121519] border-r-2 border-b-2 border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-[#1A1F26] opacity-80 hover:opacity-100'}
                                `}>
                        <div className={`absolute left-1 top-2 bottom-2 w-1 transition-all duration-300
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
                        className={`relative w-full h-full flex items-center px-4 transition-all duration-200 cursor-pointer rounded-sm
                                    ${activePanel === 'info'
                                ? 'bg-[#0A0C0F] border-transparent shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] opacity-100'
                                : 'bg-[#121519] border-r-2 border-b-2 border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:bg-[#1A1F26] opacity-80 hover:opacity-100'}
                                `}
                    >
                        <div className={`absolute left-1 top-2 bottom-2 w-1 transition-all duration-300
                                    ${activePanel === 'info' ? 'bg-(--purple) shadow-[0_0_15px_var(--purple)]' : 'bg-[#2D333B]'}
                                `} />
                        <div className="flex flex-col items-start ml-2">
                            <span className="text-[8px] font-mono text-(--text-muted) tracking-widest font-black uppercase opacity-60">REG_02</span>
                            <span className={`text-[11px] font-mono font-bold tracking-widest ${activePanel === 'info' ? 'text-(--purple) [text-shadow:0_0_8px_var(--purple)]' : 'text-(--text-muted)'}`}>
                                AYUDA_SISTEMA
                            </span>
                        </div>
                        <div className={`ml-auto w-2 h-2 rounded-full border transition-all ${activePanel === 'info' ? 'bg-(--purple) border-black shadow-[0_0_10px_var(--purple)]' : 'bg-black border-[#2D333B]'}`} />
                    </button>
                </div>

            </div>

        </div>
    );
}

