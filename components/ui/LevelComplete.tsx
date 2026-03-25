// ============================================================
// REBOOT — components/ui/LevelComplete.tsx
// Modal que aparece al terminar un nivel
// Muestra estrellas, cartas desbloqueadas, objetos y opciones
// ============================================================

'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Card, GameObject } from '@/types/game'
import { Button } from './Button'
import { RotateCcwIcon, HardDriveIcon, XIcon, ArrowRightIcon, ChevronsRightIcon } from 'lucide-react'
import { DataCartridge, RARITY_STYLES } from '@/components/cards/DataCartridge'

// ------------------------------------------------------------
// TIPOS
// ------------------------------------------------------------

interface ReviewHint {
    shouldShow: boolean
    levelId: string | null
    levelTitle: string | null
    message: string | null
}

interface LevelCompleteProps {
    stars: 0 | 1 | 2 | 3
    newCards: Card[]
    newObjects: GameObject[]
    secretCardUnlocked: boolean
    reviewHint: ReviewHint | null
    onNext: () => void
    onMap: () => void
    onRetry: () => void
    children?: React.ReactNode
}

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------

export default function LevelComplete({
    stars,
    newCards,
    newObjects,
    secretCardUnlocked,
    reviewHint,
    onNext,
    onMap,
    onRetry,
    children
}: LevelCompleteProps) {
    const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null)
    const [isFlipped, setIsFlipped] = useState(false)
    const [visibleStars, setVisible] = useState(0)
    const [backdropReady, setBackdropReady] = useState(false)
    const [panelReady, setPanelReady] = useState(false)

    // animación de entrada
    useEffect(() => {
        requestAnimationFrame(() => setBackdropReady(true))
        const t = setTimeout(() => setPanelReady(true), 150)
        return () => clearTimeout(t)
    }, [])

    // animación de estrellas una a una
    useEffect(() => {
        let count = 0
        const interval = setInterval(() => {
            count++
            setVisible(count)
            if (count >= stars) {
                clearInterval(interval)
            }
        }, 400)
        return () => clearInterval(interval)
    }, [stars])

    const starMessage = stars === 3
        ? 'FRAG: "Solución óptima. Impresionante."'
        : stars === 2
            ? 'FRAG: "Bien hecho. Puedes mejorar la eficiencia."'
            : stars === 1
                ? 'FRAG: "Completado. Intenta usar menos comandos."'
                : 'FRAG: "Nivel registrado."'

    const hasCardsOrObjects = newCards.length > 0 || secretCardUnlocked || newObjects.length > 0;

    // ------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------

    return (
        <div
            className={`fixed inset-0 z-200 flex items-center justify-center p-4 transition-colors duration-500 ease-out backdrop-blur-[1px] `}
        >
            {/* Partículas flotando — efecto sutil */}
            <FloatingParticles visible={backdropReady} />

            <div className="relative w-full max-w-[650px] bg-[#0c1218] rounded-xs p-[3px] border border-[#121922] shadow-[0_0_80px_rgba(0,0,0,0.8)]">
                {/* Panel principal */}
                <div
                    className="relative bg-(--bg-void) border border-(--bg-hover) shadow-inner flex flex-col font-mono"
                    style={{
                        opacity: panelReady ? 1 : 0,
                        transform: panelReady ? 'translateY(0) scale(1)' : 'translateY(20px) scale(.97)',
                        transition: 'all .5s cubic-bezier(.16,1,.3,1)',
                    }}
                >
                    <div className="relative px-6 py-6 max-h-[85vh] overflow-y-auto custom-scrollbar flex flex-col gap-6">

                        {/* ── CRT scanlines ── */}
                        <div className="absolute inset-0 pointer-events-none crt-overlay opacity-30 z-10" />

                        {/* ── HEADER TERMINAL ── */}
                        <div className="relative z-20 flex items-center justify-between border-b-2 border-(--bg-hover) pb-3 mb-2">
                            <div className="text-[10px] text-(--green-muted) tracking-widest uppercase">
                                SIS_EXT // DATA
                            </div>
                            <div className="text-[15px] font-bold text-white tracking-[.25em] uppercase" style={{ textShadow: '0 0 10px rgba(255,255,255,0.2)' }}>
                                Nivel Completado
                            </div>
                            <div className="text-[10px] text-(--green-base) tracking-widest uppercase animate-pulse">
                                [ OK ]
                            </div>
                        </div>

                        <div className="flex flex-col gap-6 relative z-20">

                            {/* ── ESTRELLAS Y ESTADO ── */}
                            <div className="flex gap-4 sm:flex-row flex-col">
                                {/* CAJA ESTRELLAS */}
                                <div className="bg-[#0b1016] border border-[#1a2636] px-5 py-4 flex flex-col items-center justify-center gap-2 rounded-xs shrink-0 w-full sm:w-auto">
                                    <span className="text-[9px] text-(--green-muted) uppercase tracking-[.15em] leading-none block w-full text-center pb-2 border-b border-[#1c2936]">
                                        Eficiencia
                                    </span>
                                    <div className="flex justify-center gap-[10px] mt-2">
                                        {[1, 2, 3].map(n => (
                                            <div key={n} className="transform scale-[0.85] origin-center">
                                                <StarIcon index={n} active={visibleStars >= n} delay={n * 0.15} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CAJA REPORTE FRAG */}
                                <div className="flex-1 bg-(--bg-elevated) border border-[#1a3810] p-4 rounded-xs relative">
                                    <div className="absolute top-[-8px] bg-[#0b1016] px-2 left-4 text-[9px] text-(--green-muted) tracking-widest border border-[#1a3810] rounded-xs">
                                        REPORTE_IA
                                    </div>
                                    <div className={`text-[12px] leading-[1.6] mt-1 ${stars === 3 ? 'text-(--green-light)' : 'text-(--text-muted)'}`}>
                                        {starMessage}
                                    </div>
                                    {reviewHint?.levelTitle && (
                                        <div className="text-[9px] text-[#425e79] mt-3 tracking-widest uppercase border-t border-[#1c2936] pt-2">
                                            Fuente: {reviewHint.levelTitle}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contenedor de recompensas si hay alguna */}
                            {hasCardsOrObjects && (
                                <div className="border border-[#1a3810] bg-[#061006] p-5 rounded-xs flex flex-col gap-5">
                                    <div className="text-[10px] text-(--green-base) uppercase tracking-widest flex items-center gap-3">
                                        <span>[ NUEVOS DATOS ]</span>
                                        <div className="h-px flex-1 bg-[linear-gradient(90deg,rgba(45,120,0,0.5),transparent)]" />
                                    </div>

                                    {/* ── CARTAS DESBLOQUEADAS ── */}
                                    {newCards.length > 0 && (
                                        <div className="animate-[lc-slideUp_.5s_cubic-bezier(.16,1,.3,1)_both]" style={{ animationDelay: '0.6s' }}>
                                            <div className="text-[10px] text-(--green-light) tracking-[.14em] mb-4 uppercase">
                                                {newCards.length === 1 ? '• 1 Módulo de memoria detectado' : `• ${newCards.length} Módulos detectados`}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {newCards.map((card, idx) => {
                                                    const r = RARITY_STYLES[card.rarity] ?? RARITY_STYLES.common
                                                    return (
                                                        <div
                                                            key={card.id}
                                                            onClick={() => { setSelectedCardIdx(idx); setIsFlipped(false); }}
                                                            className="flex items-center gap-3 p-3 bg-[#0a0f16] border cursor-pointer hover:bg-[rgba(255,255,255,0.03)] transition-colors"
                                                            style={{ borderColor: r.border }}
                                                        >
                                                            <HardDriveIcon size={16} color={r.color} className="opacity-70" />
                                                            <div className="flex-1 overflow-hidden">
                                                                <div className="text-[9px] font-bold tracking-widest uppercase truncate" style={{ color: r.color }}>
                                                                    {card.name}
                                                                </div>
                                                                <div className="text-[8px] text-(--text-muted) opacity-60 mt-0.5 tracking-widest uppercase">
                                                                    Click para analizar
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── CARTA SECRETA ── */}
                                    {secretCardUnlocked && (
                                        <div className="border border-(--amber)/50 rounded-xs p-4 text-center relative overflow-hidden animate-[lc-slideUp_.5s_cubic-bezier(.16,1,.3,1)_both]"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(26,8,0,.8), rgba(65,36,2,.4))',
                                                animationDelay: '1s'
                                            }}>
                                            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(240,153,123,.06)_50%,transparent_70%)] animate-[lc-shimmer_3s_ease-in-out_infinite]" />
                                            <div className="text-[10px] font-bold text-(--amber) tracking-widest mb-2 relative uppercase">
                                                ★ Archivo especial
                                            </div>
                                            <div className="text-[11px] text-[#f0caa3] italic relative">
                                                FRAG: &quot;Nunca me pediste ayuda. Lo resolviste todo solo.&quot;
                                            </div>
                                        </div>
                                    )}

                                    {/* ── OBJETOS DESBLOQUEADOS ── */}
                                    {newObjects.length > 0 && (
                                        <div className="animate-[lc-slideUp_.5s_cubic-bezier(.16,1,.3,1)_both]" style={{ animationDelay: '1.2s' }}>
                                            <div className="text-[10px] text-(--amber) tracking-[.14em] uppercase mb-3">
                                                {newObjects.length === 1 ? '• 1 Objeto material' : `• ${newObjects.length} Objetos materiales`}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {newObjects.map((obj, i) => (
                                                    <div key={obj.id} className="bg-[#0b1008] border border-[rgba(239,159,39,0.3)] rounded-xs py-3 px-4 flex flex-col gap-[6px]"
                                                        style={{ animation: `lc-slideUp .4s cubic-bezier(.16,1,.3,1) ${1.4 + i * 0.1}s both` }}>
                                                        <div className="text-[11px] text-(--amber) font-semibold tracking-[.05em]">
                                                            {obj.name}
                                                        </div>
                                                        <div className="text-[10px] text-[#b3b2a2] leading-relaxed">
                                                            {obj.inventoryNote}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── HINT DE REPASO DE FRAG ── */}
                            {reviewHint?.shouldShow && (
                                <div className="border border-[rgba(127,119,221,.4)] bg-[#0d091a] rounded-xs p-5 animate-[lc-slideUp_.5s_cubic-bezier(.16,1,.3,1)_both]"
                                    style={{ animationDelay: '1.4s' }}>
                                    <div className="text-[9px] text-[#a49ee8] tracking-[.15em] mb-2 uppercase opacity-80 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#a49ee8]" /> Sugerencia de optimización_
                                    </div>
                                    <div className="text-[11px] text-[#d6d4f0] leading-relaxed pl-4 border-l border-[rgba(127,119,221,.4)]">
                                        {reviewHint.message}
                                    </div>
                                </div>
                            )}

                            {/* ── CONTENIDO PERSONALIZADO POR NIVEL (Ej: Stats de typing) ── */}
                            {children}

                            {/* ── BOTONES FINALES ── */}
                            <div className="flex flex-wrap justify-end gap-3 mt-4 animate-[lc-slideUp_.5s_cubic-bezier(.16,1,.3,1)_both]" style={{ animationDelay: '1.5s' }}>
                                <Button
                                    onClick={onRetry}
                                    variant="outline"
                                    size="sm"
                                >
                                    <RotateCcwIcon size={16} />
                                    reintentar
                                </Button>
                                <Button
                                    onClick={onMap}
                                    variant="outline"
                                    size="sm"
                                >
                                    mapa
                                </Button>
                                <Button
                                    onClick={onNext}
                                    size="sm"
                                    variant="solid"
                                    icon={reviewHint?.shouldShow ? RotateCcwIcon : ChevronsRightIcon}
                                    iconPosition={reviewHint?.shouldShow ? "right" : "right"}
                                >
                                    {reviewHint?.shouldShow ?
                                        <>
                                            repasar "{reviewHint.levelTitle}"
                                        </>
                                        :
                                        <>
                                            siguiente nivel
                                        </>
                                    }
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* OVERLAY DE VISTA DETALLADA DEL MÓDULO */}
            {selectedCardIdx !== null && newCards[selectedCardIdx] && (
                <div className="fixed inset-0 z-300 bg-black/80 flex flex-col items-center justify-center p-4 backdrop-blur-[2px] animate-[lc-fadeIn_0.2s_ease-out_both] cursor-pointer"
                    onClick={() => setSelectedCardIdx(null)}>
                    <div onClick={(e) => e.stopPropagation()} className="relative flex flex-col items-center gap-6">
                        <Button variant="outline" className="hidden sm:flex absolute -top-12 -right-4 border-none hover:bg-(--bg-hover) p-2 text-(--text-muted) hover:text-(--green-light)" onClick={() => setSelectedCardIdx(null)}>
                            <XIcon size={20} /> cerrar
                        </Button>
                        <DataCartridge
                            card={newCards[selectedCardIdx]}
                            flipped={isFlipped}
                            onClick={() => setIsFlipped(!isFlipped)}
                            className="w-[240px] h-[336px] md:w-[280px] md:h-[465px]"
                        />
                        <div className="text-[10px] text-(--green-muted) tracking-widest flex items-center gap-2 mt-4 animate-pulse">
                            [ CLICK EN EL MÓDULO PARA LEER DATOS CACHÉ ]
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ============================================================
// ICONO DE ESTRELLA — con glow y animación de entrada
// ============================================================

function StarIcon({ index, active, delay }: {
    index: number
    active: boolean
    delay: number
}) {
    return (
        <div className="w-[44px] h-[44px] relative"
            style={{
                transition: `all .5s cubic-bezier(.34,1.56,.64,1) ${delay}s`,
                transform: active ? 'scale(1)' : 'scale(0.5)',
                opacity: active ? 1 : 0.12,
            }}>
            {/* Glow de fondo */}
            {active && (
                <div className="absolute -inset-2 rounded-full animate-[lc-starPulse_2s_ease-in-out_infinite] " />
            )}
            <svg viewBox="0 0 44 44" fill="none" className="relative z-10">
                <polygon
                    points="22,3 27,16 40,16 30,24 33,38 22,29 11,38 14,24 4,16 17,16"
                    fill={active ? 'var(--amber)' : '#1a4d00'}
                    stroke={active ? 'var(--amber)' : '#0d1f00'}
                    strokeWidth="1"
                />
                {/* Brillo interior */}
                {active && (
                    <polygon
                        points="22,8 25,17 34,17 27,23 29,33 22,27 15,33 17,23 10,17 19,17"
                        fill="rgba(136,196,77,.2)"
                    />
                )}
            </svg>
        </div>
    )
}



// ============================================================
// PARTÍCULAS FLOTANTES — efecto sutil de fondo
// ============================================================

function FloatingParticles({ visible }: { visible: boolean }) {
    if (!visible) return null

    const particles = Array.from({ length: 12 }, (_, i) => ({
        left: `${5 + (i * 7.3) % 90}%`,
        top: `${10 + (i * 13.7) % 80}%`,
        size: 1 + (i % 3),
        delay: i * 0.4,
        duration: 4 + (i % 3) * 2,
    }))

    return (
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
            {particles.map((p, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-(--green-light) opacity-0"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animation: `lc-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
                    }}
                />
            ))}
        </div>
    )
}