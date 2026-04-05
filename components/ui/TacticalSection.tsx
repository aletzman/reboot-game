'use client'

import React from 'react'
import { Screw } from "./Screw";

interface TacticalSectionProps {
    title: string;
    subtitle?: string;
    variant?: 'elevated' | 'hazard' | 'inset';
    accentColor?: string;
    children: React.ReactNode;
    isActived?: boolean;
    button?: React.ReactNode;
}

export function TacticalSection({
    title,
    subtitle,
    variant = 'elevated',
    accentColor = 'var(--text-muted)',
    children,
    isActived,
    button
}: TacticalSectionProps) {
    return (
        <section className="mb-2 group/tactical px-2">

            {/* ─── LA ETIQUETA: PLACA DE IDENTIFICACIÓN INTEGRADA ─── */}
            <header className="relative flex items-center h-8 px-4
                                /* Fondo metálico sólido y oscuro */
                                bg-(--bg-surface)
                                /* Bordes que le dan grosor físico a la placa */
                                border-t border-t-white/5
                                border-x border-x-white/5 
                                rounded-t-sm shadow-[0_2px_5px_rgba(0,0,0,0.5)]">

                {/* Tornillos de fijación de la placa identificativa */}
                <div className="absolute left-1 top-1/2 -translate-y-1/2"><Screw size="sm" /></div>
                <div className="absolute right-1 top-1/2 -translate-y-1/2"><Screw size="sm" /></div>

                {/* Indicador de Canal (Luz de estado de la sección) */}
                <div
                    className={`w-1 h-3 mr-3 mt-0.5 ${isActived ? 'animate-cursor' : ''}`}
                    style={{ backgroundColor: isActived !== undefined && !isActived ? 'var(--text-ghost)' : accentColor, '--accent': accentColor, boxShadow: isActived ? '0 0 8px var(--accent)' : 'none' } as any}
                />

                <div className="flex items-baseline gap-3 pt-1">
                    <h3 className={`font-mono text-[11px] font-black tracking-widest uppercase ${isActived !== undefined && !isActived ? 'text-(--text-primary)/35' : 'text-(--text-primary)/95'}`}>
                        {title}
                    </h3>
                </div>

                {/* Micro-perforaciones decorativas / Botón de acción */}
                <div className="flex-1 flex justify-end items-center pr-1 overflow-hidden">
                    {button ? (
                        <div className={`flex items-center pt-0.5 ${isActived ? 'opacity-100' : 'opacity-25'}`}>
                            {button}
                        </div>
                    ) : (
                        <div className="flex gap-1 opacity-10">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-1 h-1 bg-white rounded-full" />
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* ─── EL RELIEVE: SOCKET MECANIZADO PARA CONTROLES ─── */}
            <div className="
                relative p-px 
                bg-[#080B0E] 
                /* Relieve inverso (hacia adentro) muy marcado */
                shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.02)]
                /* Borde de sellado industrial */
                border border-(--bg-elevated) rounded-b-sm
            ">
                <div className="relative z-10 font-mono text-[11px] leading-tight antialiased">
                    {children}
                </div>
            </div>

        </section>
    );
}

