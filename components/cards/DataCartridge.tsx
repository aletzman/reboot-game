'use client'

import React from 'react'
import type { Card } from '@/types/game'

// ------------------------------------------------------------
// RAREZA — colores y labels
// ------------------------------------------------------------

export const RARITY_STYLES: Record<string, {
    bg: string
    bgGlow: string
    border: string
    color: string
    label: string
    shimmer: string
}> = {
    common: {
        bg: 'rgba(0, 30, 45, .6)',
        bgGlow: 'rgba(0, 240, 255, .08)',
        border: '#008C99',
        color: '#00F0FF',
        label: 'nodo',
        shimmer: 'rgba(0, 240, 255, .2)'
    },
    rare: {
        bg: 'rgba(25, 5, 45, .6)',
        bgGlow: 'rgba(184, 41, 255, .08)',
        border: '#6B1899',
        color: '#B829FF',
        label: 'cluster',
        shimmer: 'rgba(184, 41, 255, .2)'
    },
    epic: {
        bg: 'rgba(45, 0, 20, .6)',
        bgGlow: 'rgba(255, 0, 123, .1)',
        border: '#99004A',
        color: '#FF007B',
        label: 'matriz',
        shimmer: 'rgba(255, 0, 123, .25)'
    },
    legendary: {
        bg: 'rgba(40, 35, 0, .6)',
        bgGlow: 'rgba(255, 215, 0, .1)',
        border: '#998100',
        color: '#FFD700',
        label: 'núcleo',
        shimmer: 'rgba(255, 215, 0, .25)'
    }
}

// ------------------------------------------------------------
// COMPONENTE TARJETA/CARTUCHO
// ------------------------------------------------------------

interface DataCartridgeProps {
    card: Card
    flipped?: boolean
    onClick?: () => void
    delay?: number
    className?: string
}

export function DataCartridge({
    card,
    flipped = false,
    onClick,
    delay = 0,
    className = "w-[150px] h-[210px]"
}: DataCartridgeProps) {
    const rarity = RARITY_STYLES[card.rarity] ?? RARITY_STYLES.common
    const isLegendary = card.rarity === 'legendary'

    return (
        <div
            onClick={onClick}
            className={`${className} cursor-pointer shrink-0 group `}
            style={{
                perspective: '900px',
                animation: `lc-cardAppear .6s cubic-bezier(.16,1,.3,1) ${delay}s both`,
            }}
        >
            <div className="w-full h-full relative"
                style={{
                    transformStyle: 'preserve-3d',
                    transition: 'transform .6s cubic-bezier(.4,0,.2,1)',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}>

                {/* ═══════════ LADOS 3D (ESPESOR DEL CARTUCHO) ═══════════ */}
                <div className="absolute left-0 top-0 bottom-0 w-[16px] bg-[#0c1015] border-y border-[#1a1f26]" style={{ transformOrigin: 'left', transform: 'translateZ(8px) rotateY(-90deg)' }} />
                <div className="absolute right-0 top-0 bottom-0 w-[16px] bg-[#0c1015] border-y border-[#1a1f26]" style={{ transformOrigin: 'right', transform: 'translateZ(8px) rotateY(90deg)' }} />
                <div className="absolute left-0 right-0 top-0 h-[16px] bg-[#050608] border-x border-[#1a1f26]" style={{ transformOrigin: 'top', transform: 'translateZ(8px) rotateX(90deg)' }} />
                <div className="absolute left-0 right-0 bottom-0 h-[16px] bg-[#050608] border-x border-[#1a1f26]" style={{ transformOrigin: 'bottom', transform: 'translateZ(8px) rotateX(-90deg)' }} />

                {/* ═══════════ FRENTE (CARTUCHO FÍSICO) ═══════════ */}
                <div className="absolute inset-0 flex flex-col overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)] font-mono antialiased"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        background: 'linear-gradient(to bottom, #161b22, #0d1117)',
                        borderRadius: '6px 6px 2px 2px',
                        transform: 'translateZ(8px)'
                    }}>

                    {/* 1. SECCIÓN SUPERIOR DEL CARTUCHO (PLÁSTICO & AGARRE) */}
                    <div className="h-[18%] w-full relative border-b border-[#050608] shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex justify-center items-center shrink-0">
                        {/* Tornillos */}
                        <div className="absolute top-1.5 left-2 w-2 h-2 rounded-full bg-[#050608] border-t border-l border-white/10 flex items-center justify-center transform -rotate-12"><div className="w-full h-0.5 bg-white/20" /></div>
                        <div className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-[#050608] border-t border-l border-white/10 flex items-center justify-center transform rotate-45"><div className="w-full h-0.5 bg-white/20" /></div>

                        {/* Ridges (Relieve estructural) */}
                        <div className="flex flex-col gap-1 w-[40%]">
                            <div className="h-[2px] bg-[#050608] shadow-[0_1px_0_rgba(255,255,255,0.05)] rounded-full" />
                            <div className="h-[2px] bg-[#050608] shadow-[0_1px_0_rgba(255,255,255,0.05)] rounded-full" />
                            <div className="h-[2px] bg-[#050608] shadow-[0_1px_0_rgba(255,255,255,0.05)] rounded-full" />
                        </div>
                        {/* LED Indicador (Apagado) */}
                        <div className="absolute top-9 left-4 w-2.5 h-2.5 rounded-full bg-black flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.08)]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#0a2e0a] border border-[#144514] relative shadow-[inset_0_-1px_2px_rgba(0,0,0,0.8)]">
                                {/* Reflejo curvado del vidrio/plástico */}
                                <div className="absolute top-[0.5px] left-px w-[2px] h-px bg-white/20 rounded-full rotate-45" />
                            </div>
                        </div>
                    </div>

                    {/* 2. ETIQUETA HOLOGRÁFICA / STICKER PRINCIPAL */}
                    <div className="flex-1 m-2 p-1.5 flex flex-col relative rounded-[2px] shadow-[inset_0_2px_10px_rgba(0,0,0,1)]"
                        style={{
                            transform: 'translateZ(1px)',
                            background: '#040608',
                            border: `1px solid ${rarity.color}33`,
                        }}>
                        {/* Shimmer de etiqueta */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2px]"
                            style={{
                                background: `repeating-linear-gradient(45deg, transparent, transparent 4px, ${rarity.shimmer} 5px)`,
                                opacity: 0.3
                            }} />

                        {/* Cabecera del sticker */}
                        <div className="w-full flex justify-between items-end border-b pb-1 relative z-10" style={{ borderColor: `${rarity.color}44` }}>
                            <div className="flex flex-col">
                                <div className="text-[8px] text-(--text-muted) font-semibold tracking-widest uppercase leading-none mb-[2px]">
                                    SYS_MODULE
                                </div>
                                <div className="text-sm font-mono font-bold tracking-widest uppercase" style={{ color: rarity.color }}>
                                    {rarity.label}
                                </div>
                            </div>

                            {/* Barcode falso */}
                            <div className="h-4.5 w-15 opacity-70"
                                style={{ background: `repeating-linear-gradient(90deg, ${rarity.color}, ${rarity.color} 1px, transparent 1px, transparent 3px, ${rarity.color} 3px, ${rarity.color} 4px, transparent 4px, transparent 5px)` }}
                            />
                        </div>

                        {/* ARTE / CIRCUITO (Vista de placa) */}
                        <div className="relative w-full aspect-square border-y bg-[#020305] flex items-center justify-center my-1.5 shadow-[inset_0_0_15px_rgba(0,0,0,1)] z-10"
                            style={{ borderColor: `${rarity.color}66` }}>
                            {isLegendary && (
                                <div className="absolute inset-0"
                                    style={{
                                        boxShadow: `inset 0 0 15px ${rarity.color}88`,
                                        animation: 'lc-pulse_2s_infinite'
                                    }} />
                            )}
                            <CardArt cardId={card.id} rarity={card.rarity} color={rarity.color} />
                        </div>

                        {/* Nombre del concepto (Etiqueta principal) */}
                        <div className="w-full bg-[#080b10] border p-1 text-center shrink z-10 mt-auto" style={{ borderColor: `${rarity.color}66` }}>
                            <div className="text-[10px] sm:text-xs font-bold leading-tight uppercase tracking-widest text-wrap break-all"
                                style={{ color: rarity.color, textShadow: `0 0 5px ${rarity.shimmer}` }}>
                                {card.name}
                            </div>
                        </div>

                        {/* Sub-id técnico */}
                        <div className="w-full text-right text-[4px] sm:text-[5px] tracking-widest text-(--text-ghost) mt-1 uppercase z-10 pt-1 border-t" style={{ borderColor: `${rarity.color}22` }}>
                            ID: {card.id.split('-')[1]} // {card.actName || 'SYS'} // {card.concept.replace(/\s+/g, '_')}
                        </div>
                    </div>

                    {/* 3. PINES BAJOS DE CONEXIÓN */}
                    <div className="h-3 w-[70%] mx-auto flex justify-between px-1 pt-px bg-[#0a0a0a] border-t border-x border-[#1a1a1a] rounded-t-sm items-end shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] shrink-0">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-[6%] h-full rounded-t-[1px]"
                                style={{
                                    background: 'linear-gradient(to bottom, #d4af37, #8a7322)',
                                    boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), inset 1px 0 1px rgba(0,0,0,0.5)'
                                }} />
                        ))}
                    </div>
                </div>

                {/* ═══════════ REVERSO (PANTALLA LECTURA) ═══════════ */}
                <div className="absolute inset-0 flex flex-col rounded-b-xs p-1.5 font-mono shadow-[0_10px_30px_rgba(0,0,0,0.8)] antialiased"
                    style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg) translateZ(8px)',
                        background: 'linear-gradient(to bottom, #11151a, #0a0d11)',
                    }}>

                    {/* Pantalla E-ink o Panel empotrado */}
                    <div className="flex-1 bg-(--bg-deep) border border-[#050608] shadow-[inset_0_4px_15px_rgba(0,0,0,1)] rounded-sm flex flex-col p-2.5 overflow-hidden"
                        style={{ transform: 'translateZ(1px)' }}>

                        {/* Header retro de log */}
                        <div className="text-[11px] text-(--green-muted) tracking-widest uppercase border-b border-(--bg-hover) pb-1">
                            &gt; DATA_LOG...
                        </div>

                        {/* Concepto extraído */}
                        <div className="text-[10px] sm:text-[13px] tracking-[.15em] font-bold uppercase mt-1.5"
                            style={{ color: rarity.color }}>
                            [{card.concept}]
                        </div>

                        {/* Descripción Humana */}
                        <div className="text-[10px] sm:text-[13px] text-(--text-muted) leading-[1.6] flex-1 pt-1 font-mono overflow-y-auto custom-scrollbar pr-1 mt-1">
                            {card.humanExplanation}
                        </div>

                        {/* Fragmento de código analizado */}
                        {!card.codeExample && (
                            <div className="bg-[#020305] border border-(--bg-hover) p-2 mt-1.5 text-[11px] sm:text-[13px] text-(--green-base) font-mono leading-[1.6] whitespace-pre overflow-hidden relative shrink-0 rounded-sm">
                                <div className="absolute top-0 left-0 bottom-0 w-[2px] bg-(--green-darkest)" />
                                <div className="pl-1.5">
                                    {/*card.codeExample.split('\n').slice(0, 4).join('\n')*/}
                                    const data = {

                                    }
                                </div>
                            </div>
                        )}

                        {/* Tip del sistema */}
                        {card.tip && (
                            <div className='text-[11px] sm:text-[13px] text-(--text-muted) leading-tight bg-(--bg-void) p-2 mt-2 border border-(--bg-hover) relative shrink-0 rounded-sm'>
                                <span className="text-(--amber) mr-1 font-bold">INFO:</span>
                                {card.tip}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function CardArt({ cardId, rarity, color }: {
    cardId: string
    rarity: string
    color: string
}) {
    const seed = cardId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    const r = (n: number) => ((seed * (n + 1) * 2654435761) >>> 0) % 10

    // Circuit board path generation based on seed
    const paths = []
    for (let i = 0; i < 4; i++) {
        const x1 = 10 + r(i * 4) * 6
        const y1 = 10 + r(i * 4 + 1) * 6
        const x2 = 10 + r(i * 4 + 2) * 6
        const y2 = 10 + r(i * 4 + 3) * 6

        // Orthogonal right-angle paths
        paths.push(`M${x1},${y1} H${x2} V${y2}`)
    }

    // Node rects
    const rects = []
    for (let i = 0; i < 5; i++) {
        rects.push({
            x: 10 + r(i * 2) * 6 - 2,
            y: 10 + r(i * 2 + 1) * 6 - 2,
            s: 4 + (r(i * 2) % 3) * 2
        })
    }

    const baseOpacity = rarity === 'legendary' ? 1.0 : rarity === 'epic' ? 0.8 : rarity === 'rare' ? 0.6 : 0.4

    return (
        <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none">
            {/* Grid de fondo tipo blueprint */}
            <pattern id={`grid-${cardId}`} width="8" height="8" patternUnits="userSpaceOnUse">
                <rect width="8" height="8" fill="none" />
                <circle cx="4" cy="4" r="0.5" fill={color} fillOpacity="0.05" />
            </pattern>
            <rect width="80" height="80" fill={`url(#grid-${cardId})`} />

            {/* Paths de circuito */}
            {paths.map((d, i) => (
                <path
                    key={`p-${i}`}
                    d={d}
                    stroke={color}
                    strokeWidth="1.5"
                    strokeOpacity={baseOpacity * 0.7}
                    fill="none"
                />
            ))}

            {/* Intersecciones (chips / soldaduras) */}
            {rects.map((rect, i) => (
                <rect
                    key={`r-${i}`}
                    x={rect.x}
                    y={rect.y}
                    width={rect.s}
                    height={rect.s}
                    fill={color}
                    fillOpacity={baseOpacity}
                    stroke="#000"
                    strokeWidth="0.5"
                />
            ))}

            {/* Marco de chip central */}
            <rect x="25" y="25" width="30" height="30" fill="#000" fillOpacity="0.8" stroke={color} strokeWidth="1" strokeOpacity={baseOpacity} />
            <text x="40" y="38" fill={color} fontSize="6" fontFamily="monospace" textAnchor="middle" fillOpacity={baseOpacity}>
                M-BLK
            </text>
            <text x="40" y="46" fill={color} fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold" fillOpacity={baseOpacity}>
                {String(seed % 999).padStart(3, '0')}
            </text>
        </svg>
    )
}
