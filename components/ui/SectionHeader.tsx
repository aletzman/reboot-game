'use client'

import React from 'react'
import { Screw } from '../ui/Screw'

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
    return (
        <header className="h-[48px] px-4 flex items-center justify-between relative z-10 bg-(--bg-surface) border-y border-(--border-color) overflow-hidden group/section">

            {/* 1. ESTRUCTURA DE PANEL (EL BISEL) 
                Mismo inset que el LevelHeader para coherencia de fabricación */}
            <div className="absolute inset-[2px] border border-black/60 rounded-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] pointer-events-none" />

            {/* 2. TEXTURA DE FIBRA / CARBONO 
                Misma escala que el header principal pero con menos opacidad */}
            <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(45deg,rgba(0,0,0,0)_45%,#fff_50%,rgba(0,0,0,0)_55%)] bg-size-[3px_3px] pointer-events-none" />

            {/* 3. LUZ DE ESTADO SECUNDARIA
                Más delgada y sutil que la principal */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[2px] bg-(--green-base) shadow-[0_0_10px_var(--green-base)] rounded-r-full opacity-70 group-hover/section:opacity-100 transition-opacity" />

            {/* =========================================
                CONTENIDO (Compacto / Industrial)
                ========================================= */}
            <div className="relative flex items-center gap-4 ml-2">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <h1 className="font-mono text-[11px] text-(--text-primary) tracking-[0.3em] uppercase font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                            {title}
                        </h1>

                        {/* Micro Indicador de Flujo (Heredado del principal) */}
                        <div className="flex gap-0.5 h-[3px]">
                            <div className="w-[3px] h-full bg-(--green-base)/40" />
                            <div className="w-[3px] h-full bg-(--green-base)/20" />
                            <div className="w-[3px] h-full bg-(--green-base)/10" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. DETALLES DE HARDWARE (Los tornillos le dan peso) */}
            <div className="relative flex items-center gap-4">
                {/* Código de serie falso (Look de inventario) */}
                <span className="hidden md:block font-mono text-[8px] text-(--text-ghost) opacity-30 tracking-widest">
                    SN-PRC_{title.slice(0, 3).toUpperCase()}_026
                </span>

                <div className="flex items-center gap-1 opacity-40">
                    <Screw size="sm" className="relative" />
                    <div className="w-4 h-px bg-(--border-color)" />
                    <Screw size="sm" className="relative" />
                </div>
            </div>

            {/* OVERLAY DE SCANLINES (Mismo que el principal pero casi invisible) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(255,255,255,0.1)_50%)] bg-size[100%_2px]" />
        </header>
    )
}