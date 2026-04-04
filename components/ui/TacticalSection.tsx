'use client'

import React from 'react'
import { Screw } from "./Screw";

interface TacticalSectionProps {
    title: string;
    subtitle?: string;
    variant?: 'elevated' | 'hazard' | 'inset';
    accentColor?: string;
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
        <section className="mb-6 group/tactical px-2">

            {/* ─── LA ETIQUETA: PLACA DE IDENTIFICACIÓN INTEGRADA ─── */}
            <header className="relative flex items-center h-8 px-4
                                /* Fondo metálico sólido y oscuro */
                                bg-(--bg-surface)
                                /* Bordes que le dan grosor físico a la placa */
                                border-t border-t-white/5
                                border-x border-x-white/5 
                                rounded-t-sm shadow-[0_2px_5px_rgba(0,0,0,0.5)]">

                {/* Tornillos de fijación de la placa identificativa */}
                <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-60"><Screw size="sm" /></div>
                <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-60"><Screw size="sm" /></div>

                {/* Indicador de Canal (Luz de estado de la sección) */}
                <div
                    className="w-1 h-3 mr-3 shadow-[0_0_8px_var(--accent)]"
                    style={{ backgroundColor: accentColor, '--accent': accentColor } as any}
                />

                <div className="flex items-baseline gap-3">
                    <h3 className="font-mono text-[11px] text-white/80 font-black tracking-widest uppercase">
                        {title}
                    </h3>
                    <span className="font-mono text-[7px] text-(--text-ghost) uppercase tracking-tighter opacity-60">
                        {subtitle || 'REF_0x2A'}
                    </span>
                </div>

                {/* Micro-perforaciones decorativas a la derecha */}
                <div className="flex-1 flex justify-end gap-1 px-4 opacity-10">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-white rounded-full" />
                    ))}
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

