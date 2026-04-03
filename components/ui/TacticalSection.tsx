'use client'

import React from 'react'
import { Screw } from "./Screw";

interface TacticalSectionProps {
    title: string;
    subtitle?: string;
    variant?: 'elevated' | 'hazard' | 'inset';
    accentColor?: string; // var(--green-base), var(--amber), etc.
    children: React.ReactNode;
}

export function TacticalSection({
    title,
    subtitle,
    variant = 'elevated',
    accentColor = 'var(--text-muted)',
    children
}: TacticalSectionProps) {
    return (
        <section className="mb-4 group/tactical px-4">
            {/* ─── HEADER TÁCTICO (Estilo Subrutinas de Red) ─── */}
            <div className="flex items-center gap-2 mb-2 px-1">
                {/* Indicador de Canal / Actividad */}
                <div
                    className="w-[2px] h-3 shadow-[0_0_8px_var(--accent)]"
                    style={{ backgroundColor: accentColor, '--accent': accentColor } as any}
                />
                <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-(--text-muted) uppercase tracking-[0.2em] font-black leading-none opacity-80">
                        {subtitle || 'DATA_NODE'}
                    </span>
                    <h3 className="font-mono text-[11px] text-white uppercase tracking-wider font-black mt-0.5">
                        {title}
                    </h3>
                </div>
                {/* Separador de riel industrial */}
                <div className="flex-1 h-px bg-white/5 ml-2 self-center border-b border-black" />
            </div>

            {/* ─── CUERPO DEL MÓDULO (Estilo Misión_Actual / Info_Sistema) ─── */}
            <div className="relative">

                {/* VARIANTE 1: PANEL ESTÁNDAR (Como el cuadro de Misión) */}
                {variant === 'elevated' && (
                    <div className="bg-[#1A1F26] p-4 border border-white/5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.4)] relative">
                        {/* Textura de rejilla técnica (Mesh) */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[3px_3px] pointer-events-none" />

                        {/* Tornillería en las esquinas según tu estilo */}
                        <Screw corner="tl" size="sm" />
                        <Screw corner="br" size="sm" />

                        <div className="font-mono text-[11px] text-(--text-primary) leading-relaxed relative z-10 antialiased">
                            {children}
                        </div>
                    </div>
                )}

                {/* VARIANTE 2: PANEL DE INFO (Como el cuadro Ámbar de Info_Sistema) */}
                {variant === 'hazard' && (
                    <div className="bg-black/40 border border-(--amber)/30 p-4 relative overflow-hidden">
                        {/* El patrón de líneas diagonales de advertencia en el borde */}
                        <div className="absolute top-0 right-0 w-12 h-full opacity-[0.08] bg-[repeating-linear-gradient(-45deg,transparent,transparent_5px,var(--amber)_5px,var(--amber)_6px)] pointer-events-none" />

                        <div className="relative z-10 font-mono text-[10px] text-(--amber) leading-relaxed">
                            <div className="flex items-center gap-2 mb-2 opacity-60 font-black tracking-widest border-b border-(--amber)/20 pb-1">
                                <span>SYSTEM_ADVISORY</span>
                            </div>
                            {children}
                        </div>
                    </div>
                )}

                {/* VARIANTE 3: CONSOLA HUNDIDA (Como el Monitor_Proceso) */}
                {variant === 'inset' && (
                    <div className="bg-[#05070A] p-1border border-black shadow-[inset_0_2px_10px_rgba(0,0,0,1)] relative">
                        {/* Scanlines muy finas (ADN de tu terminal) */}
                        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(255,255,255,0.1)_50%)] bg-size-[100%_2px] pointer-events-none" />

                        <div className="relative z-10 font-mono text-[10px] text-(--text-muted)">
                            {children}
                        </div>

                        {/* Cursor de proceso */}
                        <div className="absolute bottom-2 right-2 w-1 h-1 bg-(--green-base) animate-pulse shadow-[0_0_5px_var(--green-base)]" />
                    </div>
                )}
            </div>
        </section>
    );
}