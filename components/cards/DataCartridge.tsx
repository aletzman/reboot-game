'use client'

import { useState } from 'react'
import type { Card } from '@/types/game'
import { CpuIcon, BarcodeIcon, WifiIcon, ShieldCheckIcon } from 'lucide-react'

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
        color: 'linear-gradient(135deg, var(--amber) 0%, var(--purple) 100%)',
        glow: 'rgba(255, 221, 0, 0.5)',
        label: 'ARC_CODE'
    }
}

interface DataCartridgeProps {
    card: Card
    flipped?: boolean
    isPowered?: boolean
    detailed?: boolean
    onClick?: () => void
    delay?: number
    className?: string
    viewTransitionId?: string
}

export function DataCartridge({
    card,
    flipped = false,
    isPowered = true,
    detailed = false,
    onClick,
    delay = 0,
    className = "w-[150px] h-[210px]",
    viewTransitionId = ""
}: DataCartridgeProps) {
    const [activeTab, setActiveTab] = useState<'desc' | 'code' | 'tip'>('desc')
    const rawRarity = RARITY_STYLES[card.rarity] ?? RARITY_STYLES.common
    const isLegendary = card.rarity === 'legendary'

    // Rarity styles fixed for legendary gradient
    const rarity = {
        ...rawRarity,
        color: isLegendary ? 'var(--amber)' : rawRarity.color
    }

    return (
        <div
            onClick={onClick}
            className={`${className} cursor-pointer shrink-0 group select-none`}
            style={{
                perspective: '1500px',
                WebkitPerspective: '1500px',
                // Explicit transition ID (e.g., from rack selection) or default for detailed view
                viewTransitionName: viewTransitionId || (detailed ? `cartridge-${card.id}` : undefined),
                // @ts-ignore
                ['view-transition-name']: viewTransitionId || (detailed ? `cartridge-${card.id}` : undefined),
            } as React.CSSProperties}
        >
            <div
                className="w-full h-full relative"
                style={{
                    animation: `lc-cardAppear .6s cubic-bezier(.16,1,.3,1) ${delay}s both`,
                    transformStyle: 'preserve-3d',
                    WebkitTransformStyle: 'preserve-3d',
                }}
            >
                <div className={`w-full h-full relative transition-transform duration-600 ease-in-out`}
                    style={{
                        transformStyle: 'preserve-3d',
                        WebkitTransformStyle: 'preserve-3d',
                        transform: flipped ? 'rotateY(180deg) scale(1.0001)' : 'rotateY(0deg) scale(1.0001)',
                    }}>

                    {/* ═══════════ LADOS 3D (ESPESOR) ═══════════ */}
                    {/* Lateral izquierdo */}
                    <div className="absolute left-0 top-[2%] bottom-[1%] w-[12px] bg-[#0c1015] border-y border-[#1a1f26]"
                        style={{
                            transformOrigin: 'left',
                            transform: 'translateZ(6px) rotateY(-90deg)',
                            backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.5), transparent)',
                        }}
                    />
                    {/* Lateral derecho */}
                    <div className="absolute right-0 top-[2%] bottom-[1%] w-[12px] bg-[#0c1015] border-y border-[#1a1f26]"
                        style={{
                            transformOrigin: 'right',
                            transform: 'translateZ(6px) rotateY(90deg)',
                            backgroundImage: 'linear-gradient(to left, rgba(0,0,0,0.5), transparent)',
                        }}
                    />
                    {/* Superior */}
                    <div className="absolute left-0 right-0 top-0 h-[12px] bg-[#050608] border-x border-[#1a1f26]"
                        style={{
                            transformOrigin: 'top',
                            transform: 'translateZ(6px) rotateX(90deg)',
                        }}
                    />
                    {/* Inferior */}
                    <div className="absolute left-0 right-0 bottom-0 h-[12px] bg-[#050608] border-x border-[#1a1f26]"
                        style={{
                            transformOrigin: 'bottom',
                            transform: 'translateZ(6px) rotateX(-90deg)',
                        }}
                    />

                    {/* ═══════════ FRENTE (CARCASA INDUSTRIAL) ═══════════ */}
                    <div className="absolute inset-0 flex flex-col font-mono"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            background: 'linear-gradient(165deg, #1f252d 0%, #0d1117 70%, #080a0d 100%)',
                            borderRadius: '6px 2px 2px 6px',
                            transform: 'translate3d(0, 0, 6px)',
                            clipPath: 'polygon(0 0, 92% 0, 100% 8%, 100% 100%, 0 100%)', // Bevel en esquina sup-der
                            boxShadow: `
                                0 15px 45px rgba(0,0,0,0.9), 
                                inset 0 0 1px 1px rgba(255,255,255,0.08),
                                inset 0 0 20px rgba(0,0,0,0.5)
                            `
                        }}>
                        {/* Rivets/Bolts in corners for industrial feel */}
                        <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-white/10 border border-black z-30" />
                        <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-white/10 border border-black z-30" />
                        <div className="absolute bottom-2 right-2 w-1 h-1 rounded-full bg-white/10 border border-black z-30 opacity-40" />

                        {/* Rim Light / Subtle highlight on the main bevel edge */}
                        <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-xs z-30" />

                        {/* GRIP SUPERIOR (ASIDERO) */}
                        <div className={`${detailed ? 'h-32 pb-4 pt-8 px-6' : 'h-[18%] pt-1 pb-1.5 px-4'} w-full relative border-b border-black/60 flex flex-col justify-end items-center shrink-0 bg-[#161b22]`}>
                            {/* Texture lines for grip with relief */}
                            <div className={`absolute inset-x-0 ${detailed ? 'top-6 gap-2 px-10' : 'top-0 gap-[2px] px-4 mt-1'} flex flex-col opacity-40 transition-all`}>
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex flex-col">
                                        <div className={`${detailed ? 'h-0.5' : 'h-px'} w-full bg-black/60`} />
                                        <div className={`${detailed ? 'h-0.5' : 'h-px'} w-full bg-white/10`} />
                                    </div>
                                ))}
                            </div>

                            {/* Hot-Swap Slot Hole */}
                            <div className={`absolute ${detailed ? 'top-7.5 w-16 h-4' : 'top-2 w-8 h-1.5'} bg-black rounded-full shadow-inner opacity-40`} />

                            {/* Status Indicators */}
                            <div className="w-full flex justify-between items-center z-10">
                                <div className="flex items-center gap-1.5">
                                    {/* 3D LED DOME (CÚPULA) */}
                                    <div className={`${detailed ? 'w-5 h-5' : 'w-2.5 h-2.5'} rounded-full bg-[#050608] shadow-[inset_0_1px_1px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] flex items-center justify-center relative overflow-visible`}>
                                        <div
                                            className={`w-[80%] h-[80%] rounded-full transition-all duration-300 relative overflow-hidden`}
                                            style={{
                                                background: isPowered
                                                    ? `radial-gradient(circle at 30% 30%, var(--green-light) 0%, var(--green-base) 60%, var(--green-darkest) 100%)`
                                                    : `radial-gradient(circle at 30% 30%, #1a4d00 0%, #0d1f00 70%, #050608 100%)`,
                                                boxShadow: isPowered
                                                    ? `0 0 ${detailed ? '10px 2px' : '6px 1px'} var(--green-light), inset 0 -2px 2px rgba(0,0,0,0.4)`
                                                    : 'inset 0 -1px 2px rgba(0,0,0,0.6)'
                                            }}
                                        >
                                            {/* Specular Highlight (The 'glint' on the glass dome) */}
                                            <div className="absolute top-[15%] left-[15%] w-[30%] h-[30%] bg-white/40 rounded-full blur-[0.5px]" />
                                        </div>
                                    </div>
                                    <span className={`${detailed ? 'text-[10px] text-shadow-[1px_1px_rgba(0,0,0,0.9)]' : 'text-[6px] text-white/30'} uppercase tracking-[.2em] font-black`}>PWR_LNK</span>
                                </div>
                            </div>
                        </div>

                        {/* CUERPO CENTRAL CON VENTILACIÓN */}
                        <div className="flex-1 relative overflow-hidden flex flex-col">
                            {/* Side Ventilation Gills */}
                            <div className={`absolute left-0 top-1/4 bottom-1/4 flex flex-col pointer-events-none opacity-40  ${detailed ? ' gap-4 w-2' : ' gap-1.5  w-1 '}`}>
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className={`w-full bg-black shadow-[0_1px_rgba(255,255,255,0.05)] ${detailed ? 'h-[2px]' : 'h-px'}`} />
                                ))}
                            </div>

                            {/* THE ETIQUETA / LABEL (Physical Sticker) */}
                            <div className="flex-1 m-2.5 mt-2 bg-[#050608] border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col group/label">

                                {/* Sticker Background Texture */}
                                <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
                                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '4px 4px' }} />

                                {/* Header technical row */}
                                <div className={`${detailed ? 'p-3' : 'p-1'} pb-0 flex justify-between items-start z-10`}>
                                    <div className="flex flex-col">
                                        <span className={`${detailed ? 'text-[10px]' : 'text-[2px]'} text-white/40 tracking-widest font-black opacity-80 uppercase`}>MOD_TYPE::0x{card.id.split('-').pop()}</span>
                                        <span className={`${detailed ? 'text-[8px]' : 'text-[2px]'} text-white/20 uppercase`}>REBOOT_OS_VER_4.2.1</span>
                                    </div>
                                    <div className={`${detailed ? 'px-3 py-1.5 text-[10px]' : 'px-1 py-0 text-[5px]'} border border-white/10 rounded-xs font-black uppercase tracking-widest shadow-sm`}
                                        style={{
                                            background: isLegendary ? rawRarity.color : 'black',
                                            color: isLegendary ? 'black' : rarity.color,
                                            borderColor: isLegendary ? 'white/20' : 'currentColor'
                                        }}>
                                        {rarity.label}
                                    </div>
                                </div>

                                {/* ART / CHIP AREA */}
                                <div className={`flex-1 flex flex-col items-center justify-center relative ${detailed ? 'p-2' : 'p-0'}`}>
                                    {/* Geometric Center Art */}
                                    <div className={`relative z-10 ${detailed ? 'mt-3 mb-3' : 'mt-1 mb-1'}`}>
                                        <div className={`${detailed ? 'w-32 h-32' : 'w-7 h-7'} rounded-sm border flex items-center justify-center relative overflow-hidden`}
                                            style={{
                                                borderColor: isLegendary ? 'var(--amber)' : `var(--border-color)`,
                                                background: `linear-gradient(45deg, ${rarity.color}05, transparent)`
                                            }}>
                                            {/* Microchip tracks */}
                                            <div className="absolute inset-0 flex flex-col justify-around px-2 opacity-20">
                                                {[...Array(6)].map((_, i) => <div key={i} className={`${detailed ? 'h-[2px]' : 'h-px'} w-full bg-current`} style={{ color: rarity.color }} />)}
                                            </div>
                                            <div className="absolute inset-0 flex justify-around py-2 opacity-20">
                                                {[...Array(6)].map((_, i) => <div key={i} className={`${detailed ? 'w-[2px]' : 'w-px'} h-full bg-current`} style={{ color: rarity.color }} />)}
                                            </div>

                                            {/* Icon or Graphic Placeholder */}
                                            <div className={`${detailed ? 'w-48 h-48' : 'w-7 h-7'} relative z-20 flex items-center justify-center`}>
                                                <div className={`absolute inset-0 blur-3xl opacity-20 ${detailed ? 'scale-150' : ''}`} style={{ backgroundColor: rarity.color }} />
                                                <span className={`${detailed ? 'text-8xl' : 'text-lg'} font-black filter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]`} style={{ color: rarity.color }}>{card.name.charAt(0)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Name & Concept */}
                                    <div className={`text-center z-10 w-full ${detailed ? 'px-6' : 'px-0'}`}>
                                        <h3 className={`font-black uppercase text-white leading-tight ${detailed ? 'text-3xl mb-1' : 'text-[8px] mb-px'} tracking-tight`}>
                                            {card.name}
                                        </h3>
                                        <div className={`${detailed ? 'h-1.5 w-16 mb-2' : 'h-px w-6 mb-1'} mx-auto opacity-40`} style={{ background: isLegendary ? rawRarity.color : rarity.color }} />
                                        <div className={`text-(--text-muted) uppercase font-bold text-center ${detailed ? 'text-md' : 'text-[4.5px] opacity-70'}`}>
                                            {card.concept}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer technical row */}
                                <div className={`${detailed ? 'p-4' : 'p-2'} pt-1 mt-auto flex justify-between items-end z-10`}>
                                    <div className="flex flex-col gap-1">
                                        <div className={`${detailed ? 'gap-[6px]' : 'gap-[2px]'} flex`}>
                                            {[...Array(4)].map((_, i) => (
                                                <div key={i}
                                                    className={`${detailed ? 'w-6 h-3' : 'w-1.5 h-1'} border-[0.5px] rounded-px ${i < (card.rarity === 'legendary' ? 4 : card.rarity === 'epic' ? 3 : card.rarity === 'rare' ? 2 : 1) ? '' : 'border-white/5'}`}
                                                    style={{
                                                        borderColor: i < (card.rarity === 'legendary' ? 4 : card.rarity === 'epic' ? 3 : card.rarity === 'rare' ? 2 : 1) ? (isLegendary ? 'var(--amber)' : rarity.color) : '',
                                                        backgroundColor: i < (card.rarity === 'legendary' ? 4 : card.rarity === 'epic' ? 3 : card.rarity === 'rare' ? 2 : 1) ? (isLegendary ? 'var(--amber)' : rarity.color) : ''
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <span className={`${detailed ? 'text-[8px]' : 'text-[5px]'} text-white/20 uppercase tracking-widest leading-none`}>AUTH_SIG</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5 font-mono">
                                        <span className={`${detailed ? 'text-xs' : 'text-[5px]'} text-white/40`}>#{card.id.toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PINES DE CONEXIÓN (PCB BLOCK) */}
                        <div className={`${detailed ? 'h-12 pt-2 px-8' : 'h-6 pt-1 px-4'} w-[92%] mx-auto bg-[#080a0d] border-t border-black relative overflow-hidden flex flex-col shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]`}>
                            <div className={`${detailed ? 'gap-[3px]' : 'gap-px'} flex-1 flex justify-between items-end`}>
                                {[...Array(16)].map((_, i) => (
                                    <div key={i} className="flex-1 h-full rounded-b-sm relative transition-all duration-300 group-hover:bg-[#ffdf1b]"
                                        style={{
                                            background: 'linear-gradient(to bottom, #d4ae1b 0%, #b8860b 60%, #443300 100%)',
                                            boxShadow: `0 -1px ${detailed ? '10px' : '4px'} rgba(212, 174, 27, 0.3)`,
                                            opacity: i % 4 === 0 ? '0.6' : '1'
                                        }}>
                                        {/* Divider line in middle of pin */}
                                        <div className="absolute inset-y-0 left-1/2 w-px bg-black opacity-15" />
                                    </div>
                                ))}
                            </div>
                            {/* Plastic reinforcement bar */}
                            <div className={`${detailed ? 'h-1 gap-8 px-16' : 'h-1 gap-4 px-8'} w-full bg-black/80 flex justify-center mt-auto`}>
                                <div className="w-px h-full bg-white/10" />
                                <div className="w-px h-full bg-white/10" />
                            </div>
                        </div>
                    </div>

                    {/* ═══════════ REVERSO (TECHNICAL HUD MODULE) ═══════════ */}
                    <div className="absolute inset-0 flex flex-col p-2.5 z-40"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg) translate3d(0, 0, 6.1px)', // Consistent with front depth
                            background: 'linear-gradient(165deg, #0d1117 0%, #06080b 100%)',
                            borderRadius: '4px 4px 1px 1px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.9), inset 0 0 20px rgba(0,0,0,0.6)',
                            clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%, 0 8%)'
                        }}>
                        {/* Hardware casing rivets */}
                        <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-white/5 border border-black shadow-inner z-50 pointer-events-none" />
                        <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-white/5 border border-black shadow-inner z-50 pointer-events-none" />
                        <div className="absolute bottom-2 right-2 w-1 h-1 rounded-full bg-white/5 border border-black shadow-inner z-50 pointer-events-none op-40" />

                        <div className="flex-1 flex flex-col gap-2 overflow-hidden px-4 py-4 font-mono relative bg-black/60 rounded-xs border border-white/10 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-sm group/reverso">
                            {/* CRT SCANLINES & GLARE */}
                            <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-length-[100%_3px,3px_100%] rounded-xs mask-image:linear-gradient(to_bottom,transparent,black,transparent)" />

                            {/* SVG Grid Schematic Background */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
                                <svg width="100%" height="100%" viewBox="0 0 100 150" fill="none" stroke="currentColor">
                                    <path d="M0 0h100M0 25h100M0 50h100M0 75h100M0 100h100M0 125h100M0 150h100M0 0v150M25 0v150M50 0v150M75 0v150M100 0v150" strokeWidth="0.1" />
                                    <circle cx="50" cy="75" r="40" strokeWidth="0.1" strokeDasharray="1 1" />
                                    <path d="M10 10L90 140M90 10L10 140" strokeWidth="0.05" opacity="0.5" />
                                </svg>
                            </div>

                            <div className={`font-black uppercase tracking-[0.4em] flex items-center justify-between shrink-0 ${detailed ? 'text-lg px-2 pb-4 border-b border-white/10' : 'text-[9px] mb-2'}`}
                                style={{ color: rarity.color, transform: 'translateZ(0.5px)', textShadow: `0 0 10px ${rarity.color}44` }}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-1 bg-current ${detailed ? 'h-6 shadow-[0_0_15px_currentColor]' : 'h-3 shadow-[0_0_8px_currentColor]'} transition-all`} />
                                    <span className="opacity-90 tracking-widest uppercase">DATABANK_NODE::{(card.id.split('-').pop() || '000').toUpperCase()}</span>
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(detailed ? 6 : 3)].map((_, i) => <div key={i} className={`w-1 h-1 bg-current transition-opacity duration-300 animate-pulse`}
                                        style={{ animationDelay: `${i * 0.1}s`, opacity: 0.1 + (i * 0.15) }} />)}
                                </div>
                            </div>

                            {/* MAIN HUD LAYOUT: Sidebar + Viewport */}
                            <div className={`flex flex-1 gap-4 overflow-hidden mt-2 ${detailed ? 'flex-row' : 'flex-col'}`}>

                                {/* DETAILED SIDE NAVIGATION (HARDWARE SWITCHES) */}
                                {detailed && (
                                    <div className="w-16 flex flex-col gap-3 py-2 shrink-0 border-r border-white/5 pr-4 relative">
                                        {[
                                            { id: 'desc', label: 'SPEC', icon: WifiIcon },
                                            { id: 'code', label: 'SRC', icon: CpuIcon },
                                            { id: 'tip', label: 'ADR', icon: ShieldCheckIcon }
                                        ].map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={(e) => { e.stopPropagation(); setActiveTab(tab.id as any) }}
                                                className={`group/btn flex flex-col items-center gap-2 py-4 rounded-xs transition-all border duration-300 relative overflow-hidden
                                                    ${activeTab === tab.id
                                                        ? 'bg-white/10 border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]'
                                                        : 'hover:bg-white/5 border-transparent text-white/20'}`}
                                            >
                                                {/* Active Indicator Light */}
                                                <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-500 ${activeTab === tab.id ? 'bg-(--green-light) opacity-80' : 'bg-transparent'}`}
                                                    style={{ boxShadow: activeTab === tab.id ? '0 0 10px var(--green-light)' : 'none' }} />

                                                <tab.icon className="w-6 h-6 transition-transform group-hover/btn:scale-110" />
                                                <span className="text-[9px] font-black tracking-widest">{tab.label}</span>
                                            </button>
                                        ))}

                                        {/* Telemetry info sidebar bottom */}
                                        <div className="mt-auto flex flex-col items-center opacity-10 gap-4 rotate-180 [writing-mode:vertical-lr]">
                                            <span className="text-[8px] font-black tracking-[0.5em] uppercase whitespace-nowrap">SYSTEM_FORENSICS_A12</span>
                                            <div className="w-px h-16 bg-white" />
                                        </div>
                                    </div>
                                )}

                                {/* MINI VIEW MODE SELECTOR (Only in small mode) */}
                                {!detailed && (
                                    <div className="flex w-full bg-black/40 rounded-full p-1 border border-white/5 mb-4 relative z-20 overflow-hidden" onClick={e => e.stopPropagation()}>
                                        <div
                                            className="absolute inset-y-1 bg-white/10 rounded-full transition-all duration-300"
                                            style={{ width: 'calc(50% - 4px)', left: activeTab === 'desc' ? '4px' : 'calc(50%)' }}
                                        />
                                        <button onClick={() => setActiveTab('desc')} className={`relative z-10 flex-1 py-1 text-[7px] font-black uppercase tracking-widest transition-colors ${activeTab === 'desc' ? 'text-white' : 'text-white/20'}`}>SPEC</button>
                                        <button onClick={() => setActiveTab('code')} className={`relative z-10 flex-1 py-1 text-[7px] font-black uppercase tracking-widest transition-colors ${activeTab === 'code' ? 'text-white' : 'text-white/20'}`}>SRC</button>
                                    </div>
                                )}

                                {/* MAIN VIEWPORT SCREEN */}
                                <div className="flex-1 relative flex flex-col overflow-hidden bg-black/40 rounded-[2px] border border-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-md px-2">

                                    {/* Glass reflection gradient */}
                                    <div className="absolute inset-x-0 top-0 h-[30%] bg-linear-to-b from-white/3 to-transparent pointer-events-none z-20" />

                                    {/* SCREEN SCANNING LINE */}
                                    {detailed && (
                                        <div className="absolute inset-x-0 w-full h-[2px] bg-white/8 shadow-[0_0_15px_rgba(255,255,255,0.1)] z-30 animate-[v-scan_4s_linear_infinite] pointer-events-none" />
                                    )}

                                    <div className={`w-full overflow-y-auto pr-3 relative z-10 flex flex-col gap-6 py-6 scrollbar-hide flex-1
                                        [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10`}>

                                        {activeTab === 'desc' && (
                                            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                                {/* DATA HEADER */}
                                                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] text-white/20 font-black tracking-widest uppercase">STREAM_BUFFER::FORENSICS</span>
                                                        <span className={`font-black tracking-wider ${detailed ? 'text-xs' : 'text-[8px]'}`} style={{ color: rarity.color }}>SYNC_LVL::AAL_09</span>
                                                    </div>
                                                    <div className="flex flex-col items-end opacity-20">
                                                        <span className="text-[8px] font-mono">0.42_bps</span>
                                                        <span className="text-[8px] font-mono">256_KB</span>
                                                    </div>
                                                </div>

                                                {/* PRIMARY DATA TEXT */}
                                                <div className={`leading-relaxed relative border-l-2 border-white/5 pl-6`}>
                                                    <div className="absolute top-0 left-0 w-3 h-[2px] bg-white/20" />
                                                    <div className="absolute top-1/2 -left-[4px] w-1.5 h-1.5 rounded-full bg-white/10 border border-white/5" />

                                                    <div className="flex flex-col gap-6">
                                                        <p className={`${detailed ? 'text-[17px]' : 'text-[9px]'} font-sans font-medium text-white/95 tracking-tight`}>
                                                            {card.description}
                                                        </p>

                                                        {card.humanExplanation && (
                                                            <div className="mt-4 pt-6 border-t border-white/5 relative">
                                                                <span className="absolute -top-3 left-0 px-2 bg-[#06080b] text-[8px] text-(--green-muted) font-black tracking-widest uppercase">AI_TRANSLATION_LAYER</span>
                                                                <p className={`${detailed ? 'text-[16px]' : 'text-[8px]'} italic font-sans text-(--green-light)/70 leading-relaxed`}>
                                                                    "{card.humanExplanation}"
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'code' && (
                                            <div className="flex-1 flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                                                <div className="flex items-center gap-3 text-[10px] text-white/20 font-black tracking-widest border-b border-white/5 pb-4">
                                                    <div className="w-2 h-2 rounded-full border border-current animate-pulse" />
                                                    RECOVERED_SOURCE_FRAGMENT::C0X_F2
                                                </div>
                                                <div className={`bg-black/60 border border-white/10 ${detailed ? 'p-8 text-base shadow-2xl' : 'p-3 text-[9px]'} rounded-[1px] font-mono whitespace-pre flex-1 relative overflow-auto custom-scrollbar`}>
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-white/5" />
                                                    <code className="text-(--green-muted) opacity-90 leading-relaxed block translate-x-2">
                                                        {card.codeExample || "// NO_SOURCE_FRAGMENT_AVAILABLE\n// RECOVERY_STATUS: PENDING\n// ADDR: 0x88AF_B29"}
                                                    </code>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'tip' && (
                                            <div className="flex-1 flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
                                                <div className="flex items-center gap-3 text-[10px] text-(--green-muted) font-black tracking-widest border-b border-(--green-base)/10 pb-4">
                                                    <ShieldCheckIcon className="w-4 h-4" />
                                                    ENCRYPTED_ADVISORY::FRAG_PROTOCOL
                                                </div>
                                                <div className={`p-8 bg-(--green-darkest)/20 border-l-4 border-(--green-base)/30 rounded-xs relative group/advisory overflow-hidden shadow-xl`}>
                                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-(--green-base)/5 to-transparent -translate-x-full group-hover/advisory:translate-x-full transition-transform duration-1000" />
                                                    <p className={`${detailed ? 'text-[18px]' : 'text-[10px]'} leading-relaxed font-sans text-white/95 font-medium`}>
                                                        {card.tip || "NO_FIELD_REPORTS_LOADED"}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Telemetry bar at the bottom of screen */}
                                    {detailed && (
                                        <div className="h-8 border-t border-white/5 flex items-center justify-between px-4 shrink-0 text-[8px] font-black tracking-widest text-white/10 uppercase">
                                            <div className="flex gap-4">
                                                <span>SEC::{(card.actName || 'S01-A').toUpperCase()}</span>
                                                <span style={{ color: rarity.color }}>TYPE::{card.rarity.toUpperCase()}</span>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <div className="w-32 h-1.5 bg-white/5 relative rounded-full overflow-hidden">
                                                    <div className="absolute inset-y-0 left-0 bg-(--green-base) opacity-40" style={{ width: '65%' }} />
                                                </div>
                                                <span>SCAN_COMPLETE</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
