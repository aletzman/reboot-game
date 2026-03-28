// ============================================================
// REBOOT — components/ui/LevelComplete.tsx
// Modal que aparece al terminar un nivel
// Muestra estrellas, cartas desbloqueadas, objetos y opciones
// ============================================================

'use client'

import React, { useState, useEffect, useMemo, memo } from 'react'
import type { Card, GameObject } from '@/types/game'
import { Button } from './Button'
import { RotateCcwIcon, HardDriveIcon, XIcon, ChevronsRightIcon, DatabaseIcon, CpuIcon, ActivityIcon } from 'lucide-react'
import { DataCartridge, RARITY_STYLES } from '@/components/cards/DataCartridge'
import { CardDetailModal } from '@/components/cards/CardDetailModal'

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

    // animación de entrada optimizada
    useEffect(() => {
        const frame = requestAnimationFrame(() => setBackdropReady(true))
        const t = setTimeout(() => setPanelReady(true), 100)
        return () => {
            cancelAnimationFrame(frame)
            clearTimeout(t)
        }
    }, [])

    // animación de celdas una a una
    useEffect(() => {
        if (stars === 0) return
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

    const starMessage = useMemo(() => {
        if (stars === 3) return 'FRAG: "Sincronización perfecta. Has recuperado todos los datos del sector."'
        if (stars === 2) return 'FRAG: "Buen trabajo. Conexión estable, aunque se detectaron redundancias."'
        if (stars === 1) return 'FRAG: "Conexión mínima establecida. Los datos son legibles pero incompletos."'
        return 'FRAG: "Registro de nivel guardado. El núcleo sigue inestable."'
    }, [stars])

    const hasRewards = newCards.length > 0 || secretCardUnlocked || newObjects.length > 0;

    // ------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------

    return (
        <div
            className={`fixed inset-0 z-200 flex items-center justify-center p-4 transition-colors duration-700 ease-out ${backdropReady ? 'bg-black/80' : 'bg-black/0'}`}
        >
            {/* Partículas flotando — efecto sutil (Memoized) */}
            <FloatingParticles visible={backdropReady} />

            <div className={`relative w-full max-w-[680px] bg-[#0c1218] rounded-sm p-[2px] border border-[#1a2636] shadow-[0_0_100px_rgba(0,0,0,0.9)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${panelReady ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}>

                {/* Decoración Corners */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-(--green-base) z-30" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-(--green-base) z-30" />

                {/* Scanline Effect Overlay ONLY inside the modal for performance */}
                <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.03] overflow-hidden rounded-sm">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,white_3px)] w-full h-full" />
                </div>

                <div className="relative bg-(--bg-void) border border-(--bg-hover) shadow-inner flex flex-col font-mono overflow-hidden">
                    <div className="relative px-6 py-6 max-h-[85vh] overflow-y-auto custom-scrollbar flex flex-col gap-6 z-10">

                        {/* ── HEADER TERMINAL ── */}
                        <div className="relative z-20 flex items-center justify-between border-b border-[#1a2636] pb-4 mb-2">
                            <div className="flex flex-col gap-1">
                                <div className="text-[9px] text-(--green-muted) tracking-[0.3em] uppercase flex items-center gap-2">
                                    <ActivityIcon size={10} /> SIS_STATUS // COMPLETE
                                </div>
                                <div className="text-[18px] font-bold text-white tracking-[.15em] uppercase leading-none mt-1">
                                    Misión Finalizada
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="px-2 py-0.5 bg-(--green-darkest) border border-(--green-base) text-[10px] text-(--green-light) tracking-widest uppercase animate-pulse">
                                    &gt; OK_DATA
                                </div>
                                <div className="text-[8px] text-(--text-muted) tracking-tighter uppercase font-mono">
                                    LOG_REF: {Math.random().toString(36).substring(2, 10).toUpperCase()}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-8 relative z-20 transition-all">

                            {/* ── CÉLULAS DE ENERGÍA Y ESTADO ── */}
                            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4">
                                {/* CAJA CÉLULAS (FUSION CELLS) */}
                                <div className="bg-[#080c11] border border-[#1a2636] px-4 py-5 flex flex-col items-center justify-center gap-4 rounded-xs shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                                    <span className="text-[9px] text-(--text-muted) uppercase tracking-[.2em] leading-none block w-full text-center pb-3 border-b border-[#131d2a]">
                                        Estatus_Sincronía
                                    </span>
                                    <div className="flex justify-center gap-3 mt-1">
                                        {[1, 2, 3].map(n => (
                                            <DataNode key={n} active={visibleStars >= n} delay={n * 0.1} />
                                        ))}
                                    </div>
                                </div>

                                {/* CAJA REPORTE NÚCLEO */}
                                <div className="flex flex-col justify-center bg-(--bg-surface) border-l-4 border-(--cyan) p-5 rounded-r-xs relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        <ActivityIcon size={48} className="text-(--cyan)" />
                                    </div>
                                    <div className="text-[9px] text-(--purple) font-bold tracking-[.25em] mb-2 uppercase flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-(--purple) rounded-full animate-pulse" /> FRAG_SYSTEM ANALYSIS
                                    </div>
                                    <div className={`text-[13px] leading-normal ${stars === 3 ? 'text-(--green-light)' : 'text-(--text-primary)'}`}>
                                        {starMessage}
                                    </div>
                                    {reviewHint?.levelTitle && (
                                        <div className="text-[9px] text-(--text-muted) mt-3 tracking-widest uppercase flex items-center gap-2">
                                            <span className="text-(--text-ghost)">DB_SOURCE:</span> {reviewHint.levelTitle}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contenedor de recompensas si hay alguna */}
                            {hasRewards && (
                                <div className="border border-[#1a3810] bg-[#061006] p-5 rounded-xs flex flex-col gap-6 relative overflow-hidden group">
                                    {/* Shimmer de fondo para rewards */}
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(85,226,0,0.03)_50%,transparent_75%)] bg-size-[200%_200%] animate-[lc-shimmer_6s_linear_infinite]" />

                                    <div className="text-[11px] text-(--green-base) uppercase font-bold tracking-[.3em] flex items-center gap-4 relative z-10">
                                        <DatabaseIcon size={14} />
                                        <span>RECURSOS RECUPERADOS</span>
                                        <div className="h-px flex-1 bg-[linear-gradient(90deg,var(--green-base),transparent)] opacity-30" />
                                    </div>

                                    {/* ── CARTAS DESBLOQUEADAS ── */}
                                    {newCards.length > 0 && (
                                        <div className="animate-[lc-slideUp_.6s_ease-out_both] delay-300 relative z-10">
                                            <div className="text-[10px] text-(--green-light) tracking-[.15em] mb-4 uppercase flex items-center gap-2">
                                                <div className="w-3 h-px bg-(--green-light)" />
                                                {newCards.length} Módulo{newCards.length > 1 ? 's' : ''} de memoria extraído{newCards.length > 1 ? 's' : ''}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {newCards.map((card, idx) => {
                                                    const r = RARITY_STYLES[card.rarity] ?? RARITY_STYLES.common
                                                    return (
                                                        <div
                                                            key={card.id}
                                                            onClick={() => { setSelectedCardIdx(idx); setIsFlipped(false); }}
                                                            className="flex items-center gap-3 p-3 bg-black/40 border border-transparent hover:border-(--green-base) transition-all duration-300 group/item cursor-pointer shadow-lg"
                                                            style={{
                                                                borderColor: `${r.color}33`,
                                                                boxShadow: `0 4px 15px -5px ${r.color}22`
                                                            }}
                                                        >
                                                            <div className="w-10 h-10 bg-(--bg-void) rounded-xs flex items-center justify-center border border-[#1a2636] group-hover/item:border-(--green-base) transition-colors">
                                                                <HardDriveIcon size={18} style={{ color: r.color }} className="opacity-80 group-hover/item:opacity-100 transition-opacity" />
                                                            </div>
                                                            <div className="flex-1 overflow-hidden">
                                                                <div className="text-[10px] font-bold tracking-widest uppercase truncate leading-tight" style={{ color: r.color }}>
                                                                    {card.name}
                                                                </div>
                                                                <div className="text-[8px] text-(--text-muted) mt-1 tracking-widest uppercase flex items-center gap-1">
                                                                    <div className="w-1 h-1 rounded-full bg-(--text-ghost)" /> ver detalles
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
                                        <div className="border border-(--amber)/30 rounded-xs p-5 pb-6 text-center relative overflow-hidden animate-[lc-slideUp_.6s_ease-out_both] delay-500"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(20,10,0,.9), rgba(40,25,0,.6))',
                                            }}>
                                            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(240,153,123,.08)_50%,transparent_70%)] animate-[lc-shimmer_4s_linear_infinite]" />
                                            <div className="text-[11px] font-bold text-(--amber) tracking-[.4em] mb-3 relative uppercase flex items-center justify-center gap-3">
                                                <div className="h-px w-8 bg-(--amber) opacity-40" />
                                                FRAGMENTO OCULTO
                                                <div className="h-px w-8 bg-(--amber) opacity-40" />
                                            </div>
                                            <div className="text-[12px] text-[#f5d5b8] italic relative leading-relaxed max-w-[400px] mx-auto opacity-90">
                                                &quot;Independencia total del sistema FRAG confirmada. Protocolo de genio activado.&quot;
                                            </div>
                                        </div>
                                    )}

                                    {/* ── OBJETOS DESBLOQUEADOS ── */}
                                    {newObjects.length > 0 && (
                                        <div className="animate-[lc-slideUp_.6s_ease-out_both] delay-700 relative z-10">
                                            <div className="text-[10px] text-(--amber) tracking-[.15em] uppercase mb-4 flex items-center gap-2">
                                                <div className="w-3 h-px bg-(--amber)" />
                                                {newObjects.length} Artefacto{newObjects.length > 1 ? 's' : ''} recuperado{newObjects.length > 1 ? 's' : ''}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {newObjects.map((obj, i) => (
                                                    <div key={obj.id} className="bg-black/30 border border-[#2a1d0a] rounded-xs py-3 px-4 flex flex-col gap-2 hover:bg-black/50 transition-colors">
                                                        <div className="text-[11px] text-(--amber) font-bold tracking-widest uppercase">
                                                            {obj.name}
                                                        </div>
                                                        <div className="text-[10px] text-(--text-muted) leading-relaxed">
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
                                <div className="border border-(--purple)/30 bg-[#0d091a] rounded-xs p-5 relative overflow-hidden animate-[lc-slideUp_.6s_ease-out_both] delay-500">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-(--purple)/5 rounded-full" />
                                    <div className="text-[10px] text-[#a49ee8] tracking-[.25em] mb-3 uppercase font-bold flex items-center gap-2">
                                        <ActivityIcon size={12} /> SUGERENCIA_OPTIMIZACIÓN
                                    </div>
                                    <div className="text-[12px] text-[#d6d4f0] leading-relaxed pl-4 border-l-2 border-(--purple)/40">
                                        {reviewHint.message}
                                    </div>
                                </div>
                            )}

                            {/* ── CONTENIDO PERSONALIZADO POR NIVEL (Ej: Stats de typing) ── */}
                            {children && (
                                <div className="animate-[lc-slideUp_.6s_ease-out_both] delay-200">
                                    {children}
                                </div>
                            )}

                            {/* ── BOTONES FINALES ── */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mt-2 pt-6 border-t border-[#1a2636] animate-[lc-slideUp_.6s_ease-out_both] delay-900ms">
                                <div className="flex gap-3">
                                    <Button
                                        onClick={onRetry}
                                        variant="outline"
                                        size="sm"
                                        className="min-w-[120px]"
                                    >
                                        <RotateCcwIcon size={14} />
                                        REINTENTAR
                                    </Button>
                                    <Button
                                        onClick={onMap}
                                        variant="outline"
                                        size="sm"
                                        className="min-w-[100px]"
                                    >
                                        MAPA
                                    </Button>
                                </div>
                                <Button
                                    onClick={onNext}
                                    size="md"
                                    variant="solid"
                                    icon={reviewHint?.shouldShow ? RotateCcwIcon : ChevronsRightIcon}
                                    iconPosition="right"
                                >
                                    {reviewHint?.shouldShow ?
                                        `REPASAR "${reviewHint.levelTitle}"`
                                        :
                                        "SIGUIENTE NIVEL"
                                    }
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* OVERLAY DE VISTA DETALLADA DEL MÓDULO */}
            <CardDetailModal
                selectedCard={selectedCardIdx !== null ? newCards[selectedCardIdx] : null}
                isFlipped={isFlipped}
                onClose={() => setSelectedCardIdx(null)}
                onFlip={() => setIsFlipped(!isFlipped)}
            />
        </div>
    )
}

// ============================================================
// FUSION CELL (Mini Generadores de Energía)
// ============================================================

const DataNode = memo(({ active, delay }: {
    active: boolean
    delay: number
}) => {
    return (
        <div className="w-10 h-10 relative flex items-center justify-center"
            style={{
                transition: `transform .7s cubic-bezier(.34,1.56,.64,1) ${delay}s, opacity .7s cubic-bezier(.34,1.56,.64,1) ${delay}s`,
                transform: active ? 'scale(1) rotate(0deg)' : 'scale(0.6) rotate(-10deg)',
                opacity: active ? 1 : 0.15,
            }}>
            
            {/* SVG Balanced Node Structure */}
            <svg viewBox="0 0 60 60" className="w-full h-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                {/* External Hexagonal Frame */}
                <path 
                    d="M30 4 L56 18 V42 L30 56 L4 42 V18 Z" 
                    fill="#080c11" 
                    stroke={active ? 'var(--amber)' : '#1a2636'} 
                    strokeWidth="2"
                    className="transition-colors duration-500"
                />
                
                {/* Secondary inner contour */}
                <path 
                    d="M30 8 L52 20 V40 L30 52 L8 40 V20 Z" 
                    fill="none" 
                    stroke={active ? 'var(--amber)' : '#0d131a'} 
                    strokeWidth="1" 
                    strokeOpacity="0.2"
                />

                {/* Industrial Connectors (Top/Bottom) */}
                <rect x="28" y="0" width="4" height="6" fill={active ? 'var(--amber)' : '#1a2636'} className="transition-colors" />
                <rect x="28" y="54" width="4" height="6" fill={active ? 'var(--amber)' : '#1a2636'} className="transition-colors" />

                {/* Central Energy Core */}
                <circle cx="30" cy="30" r="10" 
                    fill={active ? 'var(--amber)' : '#0d131a'} 
                    className="transition-all duration-500"
                />
                
                {active && (
                    <>
                        {/* Glow Core */}
                        <circle cx="30" cy="30" r="6" fill="#fff" fillOpacity="0.3" className="animate-pulse" />
                        
                        {/* Power Indicator Light */}
                        <circle cx="30" cy="18" r="1.5" fill="#fff" className="animate-[lc-blink_1.5s_infinite]" />
                    </>
                )}

                {/* Technical text - very subtle */}
                <text x="30" y="46" fontSize="4" fill={active ? 'var(--amber)' : '#1a2636'} textAnchor="middle" className="font-mono font-bold tracking-widest uppercase transition-colors">
                    {active ? 'READY' : 'OFF'}
                </text>
            </svg>

            {/* Subtle glow foundation */}
            {active && (
                <div className="absolute inset-0 bg-(--amber) opacity-[0.05] rounded-full blur-[10px] animate-pulse" />
            )}
        </div>
    )
})

DataNode.displayName = 'DataNode'

// ============================================================
// PARTÍCULAS FLOTANTES — efecto sutil de fondo (Memoized)
// ============================================================

const FloatingParticles = memo(({ visible }: { visible: boolean }) => {
    // Definimos las partículas fuera del componente para evitar cálculos en cada frame
    const particles = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: `${10 + (i * 15) % 80}%`,
        top: `${15 + (i * 20) % 70}%`,
        size: 1 + (i % 2),
        delay: i * 0.8,
        duration: 5 + (i % 4) * 2,
    })), [])

    if (!visible) return null

    return (
        <div className='absolute inset-0 overflow-hidden pointer-events-none z-0'>
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute rounded-full bg-(--green-base) opacity-0"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        animation: `lc-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
                        willChange: 'transform, opacity'
                    }}
                />
            ))}
        </div>
    )
})

FloatingParticles.displayName = 'FloatingParticles'