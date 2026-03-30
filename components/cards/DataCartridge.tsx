'use client'

import type { Card } from '@/types/game'

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
    isPowered?: boolean
    detailed?: boolean
    onClick?: () => void
    delay?: number
    className?: string
}

export function DataCartridge({
    card,
    isPowered = true,
    detailed = false,
    onClick,
    delay = 0,
    className = "w-[150px] h-[210px]",
}: DataCartridgeProps) {
    const rawRarity = RARITY_STYLES[card.rarity] ?? RARITY_STYLES.common
    const isLegendary = card.rarity === 'legendary'

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
                // ViewTransition name is now handled by parent <ViewTransition> component
            }}
        >
            <div
                className="w-full h-full relative"
                style={{
                    transformStyle: 'preserve-3d',
                    WebkitTransformStyle: 'preserve-3d',
                }}
            >
                <div className="w-full h-full relative"
                    style={{
                        transformStyle: 'preserve-3d',
                        WebkitTransformStyle: 'preserve-3d',
                        transform: 'rotateY(0deg) scale(1.0001)',
                    }}>

                    {/* ═══════════ LADOS 3D (ESPESOR) ═══════════ */}
                    <div className="absolute left-0 top-[2%] bottom-[1%] w-[12px] bg-[#0c1015] border-y border-[#1a1f26]"
                        style={{
                            transformOrigin: 'left',
                            transform: 'translateZ(6px) rotateY(-90deg)',
                            backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.5), transparent)',
                        }}
                    />
                    <div className="absolute right-0 top-[2%] bottom-[1%] w-[12px] bg-[#0c1015] border-y border-[#1a1f26]"
                        style={{
                            transformOrigin: 'right',
                            transform: 'translateZ(6px) rotateY(90deg)',
                            backgroundImage: 'linear-gradient(to left, rgba(0,0,0,0.5), transparent)',
                        }}
                    />
                    <div className="absolute left-0 right-0 top-0 h-[12px] bg-[#050608] border-x border-[#1a1f26]"
                        style={{
                            transformOrigin: 'top',
                            transform: 'translateZ(6px) rotateX(90deg)',
                        }}
                    />
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
                            clipPath: 'polygon(0 0, 92% 0, 100% 8%, 100% 100%, 0 100%)',
                            boxShadow: `
                                0 15px 45px rgba(0,0,0,0.9), 
                                inset 0 0 1px 1px rgba(255,255,255,0.08),
                                inset 0 0 20px rgba(0,0,0,0.5)
                            `
                        }}>
                        {/* Rivets */}
                        <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-white/10 border border-black z-30" />
                        <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-white/10 border border-black z-30" />
                        <div className="absolute bottom-2 right-2 w-1 h-1 rounded-full bg-white/10 border border-black z-30 opacity-40" />

                        {/* Rim Light */}
                        <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-xs z-30" />

                        {/* GRIP SUPERIOR */}
                        <div className={`${detailed ? 'h-32 pb-4 pt-8 px-6' : 'h-[18%] pt-1 pb-1.5 px-4'} w-full relative border-b border-black/60 flex flex-col justify-end items-center shrink-0 bg-[#161b22]`}>
                            <div className={`absolute inset-x-0 ${detailed ? 'top-6 gap-2 px-10' : 'top-0 gap-[2px] px-4 mt-1'} flex flex-col opacity-40 transition-all`}>
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex flex-col">
                                        <div className={`${detailed ? 'h-0.5' : 'h-px'} w-full bg-black/60`} />
                                        <div className={`${detailed ? 'h-0.5' : 'h-px'} w-full bg-white/10`} />
                                    </div>
                                ))}
                            </div>

                            <div className={`absolute ${detailed ? 'top-7.5 w-16 h-4' : 'top-2 w-8 h-1.5'} bg-black rounded-full shadow-inner opacity-40`} />

                            <div className="w-full flex justify-between items-center z-10">
                                <div className="flex items-center gap-1.5">
                                    <div className={`${detailed ? 'w-5 h-5' : 'w-2.5 h-2.5'} rounded-full bg-[#050608] shadow-[inset_0_1px_1px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] flex items-center justify-center relative overflow-visible`}>
                                        <div
                                            className="w-[80%] h-[80%] rounded-full transition-all duration-300 relative overflow-hidden"
                                            style={{
                                                background: isPowered
                                                    ? `radial-gradient(circle at 30% 30%, var(--green-light) 0%, var(--green-base) 60%, var(--green-darkest) 100%)`
                                                    : `radial-gradient(circle at 30% 30%, #1a4d00 0%, #0d1f00 70%, #050608 100%)`,
                                                boxShadow: isPowered
                                                    ? `0 0 ${detailed ? '10px 2px' : '6px 1px'} var(--green-light), inset 0 -2px 2px rgba(0,0,0,0.4)`
                                                    : 'inset 0 -1px 2px rgba(0,0,0,0.6)'
                                            }}
                                        >
                                            <div className="absolute top-[15%] left-[15%] w-[30%] h-[30%] bg-white/40 rounded-full" />
                                        </div>
                                    </div>
                                    <span className={`${detailed ? 'text-[10px] text-shadow-[1px_1px_rgba(0,0,0,0.9)]' : 'text-[6px] text-white/30'} uppercase tracking-[.2em] font-black`}>PWR_LNK</span>
                                </div>
                            </div>
                        </div>

                        {/* CUERPO CENTRAL */}
                        <div className="flex-1 relative overflow-hidden flex flex-col">
                            <div className={`absolute left-0 top-1/4 bottom-1/4 flex flex-col pointer-events-none opacity-40 ${detailed ? ' gap-4 w-2' : ' gap-1.5 w-1'}`}>
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className={`w-full bg-black shadow-[0_1px_rgba(255,255,255,0.05)] ${detailed ? 'h-[2px]' : 'h-px'}`} />
                                ))}
                            </div>

                            <div className="flex-1 m-2.5 mt-2 bg-[#050608] border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col group/label">
                                <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
                                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '4px 4px' }} />

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

                                <div className={`flex-1 flex flex-col items-center justify-center relative ${detailed ? 'p-2' : 'p-0'}`}>
                                    <div className={`relative z-10 ${detailed ? 'mt-3 mb-3' : 'mt-1 mb-1'}`}>
                                        <div className={`${detailed ? 'w-32 h-32' : 'w-7 h-7'} rounded-sm border flex items-center justify-center relative overflow-hidden`}
                                            style={{
                                                borderColor: isLegendary ? 'var(--amber)' : `var(--border-color)`,
                                                background: `linear-gradient(45deg, ${rarity.color}05, transparent)`
                                            }}>
                                            <div className="absolute inset-0 flex flex-col justify-around px-2 opacity-20">
                                                {[...Array(6)].map((_, i) => <div key={i} className={`${detailed ? 'h-[2px]' : 'h-px'} w-full bg-current`} style={{ color: rarity.color }} />)}
                                            </div>
                                            <div className="absolute inset-0 flex justify-around py-2 opacity-20">
                                                {[...Array(6)].map((_, i) => <div key={i} className={`${detailed ? 'w-[2px]' : 'w-px'} h-full bg-current`} style={{ color: rarity.color }} />)}
                                            </div>

                                            <div className={`${detailed ? 'w-48 h-48' : 'w-7 h-7'} relative z-20 flex items-center justify-center`}>
                                                <div className={`absolute inset-0 opacity-20 ${detailed ? 'scale-150' : ''}`} style={{ backgroundColor: rarity.color }} />
                                                <span className={`${detailed ? 'text-8xl' : 'text-lg'} font-black filter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]`} style={{ color: rarity.color }}>{card.name.charAt(0)}</span>
                                            </div>
                                        </div>
                                    </div>

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

                        {/* PINES DE CONEXIÓN */}
                        <div className={`${detailed ? 'h-12 pt-2 px-8' : 'h-6 pt-1 px-4'} w-[92%] mx-auto bg-[#080a0d] border-t border-black relative overflow-hidden flex flex-col shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]`}>
                            <div className={`${detailed ? 'gap-[3px]' : 'gap-px'} flex-1 flex justify-between items-end`}>
                                {[...Array(16)].map((_, i) => (
                                    <div key={i} className="flex-1 h-full rounded-b-sm relative transition-all duration-300 group-hover:bg-[#ffdf1b]"
                                        style={{
                                            background: 'linear-gradient(to bottom, #d4ae1b 0%, #b8860b 60%, #443300 100%)',
                                            boxShadow: `0 -1px ${detailed ? '10px' : '4px'} rgba(212, 174, 27, 0.3)`,
                                            opacity: i % 4 === 0 ? '0.6' : '1'
                                        }}>
                                        <div className="absolute inset-y-0 left-1/2 w-px bg-black opacity-15" />
                                    </div>
                                ))}
                            </div>
                            <div className={`${detailed ? 'h-1 gap-8 px-16' : 'h-1 gap-4 px-8'} w-full bg-black/80 flex justify-center mt-auto`}>
                                <div className="w-px h-full bg-white/10" />
                                <div className="w-px h-full bg-white/10" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
