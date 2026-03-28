// ============================================================
// REBOOT — components/cards/DataCartridge.tsx
// Componente premium que representa una tarjeta física de datos (cartucho)
// ============================================================

'use client'

import React from 'react'
import type { Card } from '@/types/game'

// ------------------------------------------------------------
// ESTILOS DE RAREZA
// ------------------------------------------------------------

export const RARITY_STYLES: Record<string, { color: string, glow: string, label: string }> = {
    common: {
        color: 'var(--blue)',
        glow: 'rgba(55, 138, 221, 0.3)',
        label: 'STD_READ'
    },
    rare: {
        color: 'var(--amber)',
        glow: 'rgba(239, 159, 39, 0.3)',
        label: 'ENH_DATA'
    },
    epic: {
        color: 'var(--purple)',
        glow: 'rgba(127, 119, 221, 0.4)',
        label: 'VOL_CORE'
    },
    legendary: {
        color: '#ffdd00',
        glow: 'rgba(255, 221, 0, 0.5)',
        label: 'ARC_CODE'
    }
}

// ------------------------------------------------------------
// PROPS
// ------------------------------------------------------------

interface DataCartridgeProps {
    card: Card
    flipped?: boolean
    isPowered?: boolean
    detailed?: boolean
    onClick?: () => void
    delay?: number
    className?: string
}

// ------------------------------------------------------------
// COMPONENTE
// ------------------------------------------------------------

export function DataCartridge({
    card,
    flipped = false,
    isPowered = true,
    detailed = false,
    onClick,
    delay = 0,
    className = "w-[150px] h-[210px]"
}: DataCartridgeProps) {
    const rarity = RARITY_STYLES[card.rarity] ?? RARITY_STYLES.common

    return (
        <div
            onClick={onClick}
            className={`${className} cursor-pointer shrink-0 group `}
            style={{
                perspective: '1000px',
                animation: `lc-cardAppear .6s cubic-bezier(.16,1,.3,1) ${delay}s both`,
            }}
        >
            <div className="w-full h-full relative"
                style={{
                    transformStyle: 'preserve-3d',
                    transition: 'transform .6s cubic-bezier(.4,0,.2,1)',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}>

                {/* ═══════════ LADOS 3D (ESPESOR) ═══════════ */}
                <div className="absolute left-0 top-0 bottom-0 w-[12px] bg-[#0c1015] border-y border-[#1a1f26]" style={{ transformOrigin: 'left', transform: 'translateZ(6px) rotateY(-90deg)' }} />
                <div className="absolute right-0 top-0 bottom-0 w-[12px] bg-[#0c1015] border-y border-[#1a1f26]" style={{ transformOrigin: 'right', transform: 'translateZ(6px) rotateY(90deg)' }} />
                <div className="absolute left-0 right-0 top-0 h-[12px] bg-[#050608] border-x border-[#1a1f26]" style={{ transformOrigin: 'top', transform: 'translateZ(6px) rotateX(90deg)' }} />
                <div className="absolute left-0 right-0 bottom-0 h-[12px] bg-[#050608] border-x border-[#1a1f26]" style={{ transformOrigin: 'bottom', transform: 'translateZ(6px) rotateX(-90deg)' }} />

                {/* ═══════════ FRENTE (CARTUCHO) ═══════════ */}
                <div className="absolute inset-0 flex flex-col overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)] font-mono antialiased"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        background: 'linear-gradient(135deg, #1A1F26 0%, #090C10 100%)',
                        borderRadius: '4px 4px 1px 1px',
                        transform: 'translateZ(6px)'
                    }}>

                    {/* SECCIÓN SUPERIOR (HEADER) */}
                    <div className="h-[15%] w-full relative border-b border-black/40 flex justify-center items-center shrink-0">
                        {/* Indicador LED */}
                        <div className="absolute top-1/2 left-4 w-2 h-2 rounded-full bg-black -translate-y-1/2 flex items-center justify-center">
                            <div className={`w-1 h-1 rounded-full transition-all duration-300 ${isPowered ? 'bg-(--green-light) shadow-[0_0_100px_var(--green-light)]' : 'bg-[#0a2e0a]'}`} />
                        </div>
                        {/* Minimalist Ridges */}
                        <div className="flex gap-1.5 opacity-20">
                            {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-white" />)}
                        </div>
                    </div>

                    {/* ETIQUETA PRINCIPAL */}
                    <div className="flex-1 m-2 bg-black border border-white/5 shadow-inner relative overflow-hidden p-3 flex flex-col justify-center items-center">

                        {/* Background Decorator (Only detailed) */}
                        {detailed && (
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                                <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                                    <path d="M0 20h100M0 50h100M0 80h100" strokeWidth="0.5" />
                                    <circle cx="50" cy="50" r="40" strokeWidth="0.5" />
                                </svg>
                            </div>
                        )}

                        {/* Top Technical row (Only detailed) */}
                        {detailed && (
                            <div className="absolute top-2 inset-x-4 flex justify-between items-center z-10">
                                <span className="text-[7px] text-white/40 tracking-[.3em] font-mono">ARC_STREAM::SYS</span>
                                <div className="px-1.5 py-0.5 bg-black/80 border border-white/10 rounded-xs text-[7px] font-black uppercase tracking-widest" style={{ color: rarity.color }}>
                                    {rarity.label}
                                </div>
                            </div>
                        )}

                        {/* ID Mark */}
                        <div className={`absolute left-2 text-[6px] text-white/20 tracking-widest font-mono ${detailed ? 'top-10' : 'top-2'}`}>
                            ID::0{card.id.split('-').pop()}
                        </div>

                        {/* CONTENT AREA */}
                        <div className="flex flex-col gap-1 items-center justify-center relative z-10 w-full px-2 mt-4 flex-1">
                            <h3 className={`font-black uppercase italic tracking-tighter text-white leading-none text-center ${detailed ? 'text-[22px] mb-1' : 'text-[15px]'}`}>
                                {card.name}
                            </h3>
                            <div className="h-px w-8 bg-current opacity-30 my-1" style={{ color: rarity.color }} />
                            <div className={`text-(--text-muted) uppercase font-bold tracking-[.15em] opacity-80 text-center ${detailed ? 'text-[11px]' : 'text-[9px]'}`}>
                                {card.concept}
                            </div>
                        </div>

                        {/* Bottom Row (Only detailed) */}
                        {detailed && (
                            <div className="absolute bottom-10 inset-x-4 border-t border-white/5 pt-2 mb-2 flex flex-col items-center">
                                <div className="text-[7px] text-white/20 uppercase tracking-[.4em] mb-1 font-mono">ACCESS_AUTHORIZED</div>
                                <div className="w-[80%] h-px bg-linear-to-r from-transparent via-white/5 to-transparent" />
                            </div>
                        )}

                        {/* Rarity dots */}
                        <div className={`absolute flex gap-1 ${detailed ? 'bottom-5' : 'bottom-3'}`}>
                            {[...Array(4)].map((_, i) => (
                                <div key={i}
                                    className={`w-1 h-1 rounded-full ${i < (card.rarity === 'legendary' ? 4 : card.rarity === 'epic' ? 3 : card.rarity === 'rare' ? 2 : 1) ? '' : 'bg-white/5'}`}
                                    style={{ backgroundColor: i < (card.rarity === 'legendary' ? 4 : card.rarity === 'epic' ? 3 : card.rarity === 'rare' ? 2 : 1) ? rarity.color : '' }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* PINES DE ORO */}
                    <div className="h-4 w-[85%] mx-auto flex justify-between px-1.5 pt-px bg-[#0c1015] border-t border-x border-black rounded-t-md items-end shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] mt-auto shrink-0 relative overflow-hidden">
                        {[...Array(14)].map((_, i) => (
                            <div key={i} className="w-[5%] h-[90%] rounded-t-[2px] relative"
                                style={{
                                    background: 'linear-gradient(to bottom, #FFD700 0%, #B8860B 40%, #8B6508 100%)',
                                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), inset 1px 0 1px rgba(0,0,0,0.5)',
                                    opacity: '0.9'
                                }}>
                                <div className="absolute top-[20%] w-[30%] left-1/2 -translate-x-1/2 bottom-[10%] bg-black/30 rounded-full shadow-[inset_0_0_2px_black]"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ═══════════ REVERSO ═══════════ */}
                <div className="absolute inset-0 flex flex-col p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]  "
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg) translateZ(6px)',
                        background: 'linear-gradient(to bottom, #11151a, #0a0d11)',
                        borderRadius: '4px 4px 1px 1px'
                    }}>

                    <div className="h-8 w-full bg-[#050608] flex items-center justify-between px-3 mt-1 mb-2 border border-white/5 rounded-xs relative overflow-hidden">
                        {/* Decoración fondo rack */}
                        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-(--green-base) to-transparent opacity-30"></div>

                        <span className="text-[9px] text-(--green-light) tracking-[.25em] font-bold z-10">CORE_LOG / DATABANK</span>
                        <div className={`w-2 h-2 rounded-full z-10 shadow-[0_0_8px_var(--green-light)] ${isPowered ? 'bg-(--green-light) animate-pulse' : 'bg-[#0a2e0a]'}`} />
                    </div>

                    <div className="flex-1 flex flex-col gap-3 overflow-hidden px-2 py-1 font-mono relative">
                        <div className={`font-black uppercase tracking-widest flex items-center gap-2 shrink-0 ${detailed ? 'text-[14px]' : 'text-[12px]'}`} style={{ color: rarity.color }}>
                            <span>[{card.concept}]</span>
                            <span className="h-px flex-1 bg-current opacity-20"></span>
                        </div>

                        <div className={`${detailed ? 'text-[11px]' : 'text-[9px]'} text-(--text-muted) leading-relaxed flex-1 overflow-y-auto custom-scrollbar pr-1 relative z-10 flex flex-col gap-3 pb-1`}>
                            {/* DESCRIPTION */}
                            <div className="text-white/90 font-sans tracking-wide">
                                {card.description}
                            </div>

                            {/* HUMAN EXPLANATION */}
                            <div className="italic text-(--text-muted) px-2 border-l-2 border-[#1a2636]">
                                {card.humanExplanation}
                            </div>

                            {/* TIP */}
                            {card.tip && (
                                <div className="text-(--green-muted) bg-(--green-darkest)/20 p-2 rounded-xs border border-(--green-base)/20 flex flex-col gap-1 mt-1">
                                    <span className="text-(--green-light) font-black tracking-widest uppercase text-[8px] shrink-0">TIP_SYS:</span>
                                    <span>{card.tip}</span>
                                </div>
                            )}

                            {/* CODE EXPL */}
                            {card.codeExample && (
                                <div className={`bg-[#050608] border border-white/5 p-3 rounded-xs ${detailed ? 'text-[13px]' : 'text-[11px]'} text-(--green-base) font-mono leading-tight whitespace-pre overflow-x-auto custom-scrollbar relative shrink-0 shadow-inner mt-1`}>
                                    <div className="absolute top-0 left-0 w-1 h-full bg-current opacity-40" />
                                    <div className="pl-1 relative z-10 opacity-90" style={{ textShadow: '0 0 4px rgba(45,120,0,0.6)' }}>
                                        {card.codeExample}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* PINES DE ORO (REVERSO) */}
                    <div className="h-4 w-[85%] mx-auto flex justify-between px-1.5 pt-px bg-[#0c1015] border-t border-x border-black rounded-t-md items-end shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] mt-auto shrink-0 relative overflow-hidden">
                        {[...Array(14)].map((_, i) => (
                            <div key={i} className="w-[5%] h-[90%] rounded-t-[2px] relative"
                                style={{
                                    background: 'linear-gradient(to bottom, #FFD700 0%, #B8860B 40%, #8B6508 100%)',
                                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.6), inset 1px 0 1px rgba(0,0,0,0.5)',
                                    opacity: '0.9'
                                }}>
                                <div className="absolute top-[20%] w-[30%] left-1/2 -translate-x-1/2 bottom-[10%] bg-black/30 rounded-full shadow-[inset_0_0_2px_black]"></div>                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
