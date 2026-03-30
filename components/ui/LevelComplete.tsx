'use client'

import React, { useState, useEffect, useMemo, memo } from 'react'
import type { Card, GameObject } from '@/types/game'
import { Button } from './Button'
import { RotateCcwIcon, HardDriveIcon, ChevronsRightIcon, DatabaseIcon, CpuIcon, ActivityIcon } from 'lucide-react'
import { RARITY_STYLES } from '@/components/cards/DataCartridge'
import { CardDetailModal } from '@/components/cards/CardDetailModal'

interface ReviewHint {
    shouldShow: boolean
    levelId: string | null
    levelTitle: string | null
    message: string | null
}

interface LevelCompleteProps {
    stars: 0 | 1 | 2 | 3
    levelType?: string
    newCards: Card[]
    newObjects: GameObject[]
    secretCardUnlocked: boolean
    reviewHint: ReviewHint | null
    onNext: () => void
    onMap: () => void
    onRetry: () => void
    children?: React.ReactNode
}

export default function LevelComplete({
    stars,
    levelType = 'noderoutine',
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

    const feedback = useMemo(() => {
        const type = (levelType || 'noderoutine').toLowerCase();

        const map: Record<string, any> = {
            noderoutine: {
                3: { title: 'RUTA PERFECTA', desc: '¡Increíble! Usaste las tarjetas exactas para llegar al objetivo.', frag: 'Sincronización total. El robot no dio ni un solo paso innecesario.' },
                2: { title: 'BUEN CAMINO', desc: 'El robot llegó bien, pero usaste algunas tarjetas de más.', frag: 'Conexión estable. Podrías intentar hacerlo con menos instrucciones la próxima vez.' },
                1: { title: 'DANDO VUELTAS', desc: 'Usaste demasiadas tarjetas. El robot dio rodeos innecesarios.', frag: 'Los datos llegaron, pero el consumo de energía fue muy alto por las vueltas.' },
                0: { title: 'ERROR DE RUTA', desc: 'El robot no pudo completar su camino.', frag: 'Se perdió la señal. Revisa el orden de tus tarjetas.' }
            },
            speedtyping: {
                3: { title: '¡SÚPER RÁPIDO!', desc: 'Escribes con mucha fluidez. El código cargó al instante.', frag: 'Impresionante. Escribes más rápido que mi procesador central.' },
                2: { title: 'BUEN RITMO', desc: 'Vas por buen camino, aunque algunas letras te detuvieron.', frag: 'Bien hecho. Con un poco más de práctica serás un experto tecleando.' },
                1: { title: 'PASO A PASO', desc: 'El código tardó un poco en cargar. ¡No te desesperes!', frag: 'Paciencia. Lo importante es que cada letra sea la correcta.' },
                0: { title: 'CONEXIÓN LENTA', desc: 'Tardaste demasiado en escribir el código.', frag: 'Intenta calentar los dedos antes de empezar la siguiente carga.' }
            },
            codeeditor: {
                3: { title: 'CÓDIGO LIMPIO', desc: '¡Excelente! Escribiste todo de forma clara y directa.', frag: 'Algoritmo perfecto. Has logrado que el robot entienda todo a la primera.' },
                2: { title: 'CASI PERFECTO', desc: 'Funciona bien, pero podrías intentar usar menos líneas.', frag: 'Buen trabajo. Un código más corto es más fácil de leer para el sistema.' },
                1: { title: 'UN POCO LÍO', desc: 'El código es un poco confuso y al robot le costó entenderlo.', frag: 'Funciona, pero el procesador se calentó un poco intentando descifrarlo.' },
                0: { title: 'ERROR DE TEXTO', desc: 'Hay algo mal escrito en el código que no deja que funcione.', frag: 'Revisa bien los puntos y comas. Un pequeño error detiene todo.' }
            },
            logicassembly: {
                3: { title: 'PIEZAS EN ORDEN', desc: '¡Todo encaja! El circuito funciona a la perfección.', frag: 'Lógica impecable. Has restaurado la conexión del sector por completo.' },
                2: { title: 'BIEN ARMADO', desc: 'El sistema funciona, aunque algunas piezas están un poco apretadas.', frag: 'Nodo activo. Se nota que entiendes cómo fluye la energía por aquí.' },
                1: { title: 'CONEXIÓN DÉBIL', desc: 'Lograste que funcione, pero el armado es un poco confuso.', frag: 'La señal es un poco inestable. Intenta ordenar mejor las piezas lógicas.' },
                0: { title: 'CIRCUITO ROTO', desc: 'Las piezas no están conectadas correctamente.', frag: 'No hay flujo de datos. Revisa las conexiones de cada bloque.' }
            }
        };

        // Fallback para puzzles y otros
        const defaultSet = map.noderoutine;
        if (type.startsWith('puzzle')) {
            return {
                3: { title: '¡QUÉ AGUDEZA!', desc: 'Resolviste el enigma rápidamente y sin fallar ni una vez.', frag: '¡Eres un genio! Has desbloqueado el acceso al sistema central.' },
                2: { title: 'BUEN OJO', desc: 'Te tomó un par de intentos, pero lograste dar con la respuesta.', frag: 'El sistema aceptó tu respuesta. No estuvo mal para ser el primer intento.' },
                1: { title: 'DUDAS AL INICIO', desc: 'Te costó un poco, pero finalmente entendiste el patrón.', frag: 'Criptografía superada. La persistencia es la clave de todo buen programador.' },
                0: { title: 'NO ENCAJA', desc: 'Aún no logras descifrar este patrón de datos.', frag: 'No te rindas. A veces la solución está justo frente a tus ojos.' }
            }[stars];
        }

        const selectedType = map[type] || defaultSet;
        return selectedType[stars] || defaultSet[stars];
    }, [stars, levelType])

    const hasRewards = newCards.length > 0 || secretCardUnlocked || newObjects.length > 0;

    return (
        <div
            className={`fixed inset-0 z-200 flex items-center justify-center p-4 transition-colors duration-700 ease-out ${backdropReady ? 'bg-black/80' : 'bg-black/0'}`}
        >
            <FloatingParticles visible={backdropReady} />

            <div className={`relative w-full max-w-[720px] bg-[#0c1218] rounded-sm p-[2px] border border-[#1a2636] shadow-[0_0_100px_rgba(0,0,0,0.9)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${panelReady ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}>

                {/* Corners */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-(--green-base) z-30" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-(--green-base) z-30" />

                <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.03] overflow-hidden rounded-sm">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,white_3px)] w-full h-full" />
                </div>

                <div className="relative bg-(--bg-void) border border-(--bg-hover) shadow-inner flex flex-col font-mono overflow-hidden">
                    <div className="relative px-6 py-6 max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col gap-6 z-10">

                        {/* ── HEADER ── */}
                        <div className="relative z-20 flex items-center justify-between border-b border-[#1a2636] pb-4 mb-2">
                            <div className="flex flex-col gap-1">
                                <div className="text-[9px] text-(--green-muted) tracking-[0.3em] uppercase flex items-center gap-2">
                                    <ActivityIcon size={10} /> SIS_STATUS // COMPLETE
                                </div>
                                <div className="text-[20px] font-bold text-white uppercase leading-none mt-1">
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

                        <div className="flex flex-col gap-6 relative z-20">

                            {/* ── PANEL DE DIAGNÓSTICO (HARDWARE + CLARIDAD EDUCATIVA - VERSIÓN LIMPIA) ── */}
                            <div className="flex flex-col md:flex-row bg-[#020304] border-2 border-[#1a202c] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative min-h-[240px] font-mono">

                                {/* NOTA: Eliminado el overlay de textura CRT local de aquí, 
                                   ya que el Layout global ya aplica uno.
                                */}

                                {/* PANEL IZQUIERDO: BATERÍAS Y CALIFICACIÓN CLARA */}
                                <div className="w-full md:w-[320px] p-6 flex flex-col justify-between gap-6 bg-[#05070a] relative border-b-2 md:border-b-0 md:border-r-2 border-[#1a202c] shadow-[inset_-10px_0_20px_rgba(0,0,0,0.5)]">

                                    <div className="relative z-10 w-full">
                                        <div className="flex items-center justify-between border-b-2 border-[#1a202c] pb-2 mb-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 ${visibleStars === 3 ? 'bg-(--green-base) animate-pulse' : visibleStars === 2 ? 'bg-amber-500' : 'bg-red-500'} shadow-[0_0_8px_currentColor]`} />
                                                <span className="text-[10px] font-black text-white/50 tracking-[0.2em] uppercase">
                                                    CONSUMO DE ENERGÍA
                                                </span>
                                            </div>
                                        </div>

                                        {/* Ranuras Físicas de Batería */}
                                        <div className="flex justify-center items-center gap-4 h-20">
                                            {[1, 2, 3].map(n => {
                                                const isActive = n <= visibleStars;
                                                return (
                                                    <div key={n} className="relative w-12 h-16 border-2 border-[#1a202c] bg-black flex flex-col justify-end p-1 shadow-[inset_0_0_10px_rgba(0,0,0,1)]">
                                                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-1 bg-[#1a202c]" />
                                                        <div
                                                            className={`w-full transition-all duration-700 border-t-2
                                                                ${isActive
                                                                    ? 'h-full bg-(--green-base)/40 border-(--green-base) shadow-[0_0_15px_rgba(45,120,0,0.5)]'
                                                                    : 'h-2 bg-red-900/60 border-red-900/50'
                                                                }
                                                            `}
                                                        >
                                                            {/* Rayas internas de la batería (mantenidas por ser gráficas, no scanlines) */}
                                                            {isActive && (
                                                                <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,1)_4px,rgba(0,0,0,1)_8px)]" />
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* FEEDBACK EDUCATIVO DIRECTO Y CLARO */}
                                    <div className={`relative z-10 w-full p-4 border-l-4 bg-black/80 flex flex-col gap-2
                                        ${visibleStars === 3 ? 'border-(--green-base)' : visibleStars === 2 ? 'border-amber-500' : 'border-red-500'}`}>

                                        <span className={`text-[12px] font-black uppercase
                                            ${visibleStars === 3 ? 'text-(--green-base)' : visibleStars === 2 ? 'text-amber-500' : 'text-red-500'}`}>
                                            {feedback.title}
                                        </span>

                                        {/* Usamos font-sans para máxima legibilidad pedagógica */}
                                        <span className="text-[12px] text-white/70 leading-relaxed font-sans normal-case">
                                            {feedback.desc}
                                        </span>
                                    </div>
                                </div>

                                {/* PANEL DERECHO: CONSOLA FRAG (El Mentor - Fondo Puro) */}
                                <div className="flex-1 p-6 md:p-8 bg-black relative flex flex-col justify-center min-h-[220px]">

                                    {/* NOTA: Eliminado el grid de fondo morado de aquí para máxima limpieza. */}

                                    <div className="relative z-10 flex flex-col h-full justify-between">

                                        {/* Header de la consola: Ahora es un Análisis de la Ruta */}
                                        <div className="flex items-center gap-3 border-b border-[#1a202c] pb-3 mb-4">
                                            <div className="bg-(--purple) text-black font-black text-[10px] px-2 py-0.5 tracking-widest">
                                                FRAG_OS
                                            </div>
                                            <span className="text-[10px] text-(--purple)/80 tracking-[0.2em] uppercase font-bold">
                                                ANÁLISIS DE APRENDIZAJE
                                            </span>
                                        </div>

                                        {/* Mensaje de FRAG: Altamente legible sobre negro puro */}
                                        <div className="flex-1 flex gap-4">
                                            <div className="text-(--purple) font-black text-lg select-none mt-1">{">"}</div>
                                            <div className="flex flex-col gap-4">
                                                {/* Usamos un color más claro (purple-200) para no cansar la vista */}
                                                <p className={`text-sm md:text-[15px] leading-relaxed tracking-wide font-medium
                                                    ${stars === 3 ? 'text-purple-200' : 'text-white/90'}`}>
                                                    {feedback.frag}
                                                    <span className="inline-block w-2 h-4 bg-(--purple) animate-pulse ml-2 align-middle" />
                                                </p>

                                                {reviewHint?.levelTitle && (
                                                    <div className="inline-flex w-fit items-center gap-3 text-[9px] text-white/40 tracking-[0.2em] uppercase bg-[#0a000a] border border-(--purple)/30 px-3 py-1.5 mt-2">
                                                        <CpuIcon size={12} className="text-(--purple)/60" />
                                                        <span>
                                                            NIVEL: <span className="text-(--purple) font-bold">{reviewHint.levelTitle}</span>
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* RECOMPENSAS */}
                            {hasRewards && (
                                <div className="border border-[#1a3810] bg-[#061006] p-5 rounded-xs flex flex-col gap-6 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(85,226,0,0.03)_50%,transparent_75%)] bg-size-[200%_200%] animate-[lc-shimmer_6s_linear_infinite]" />

                                    <div className="text-[11px] text-(--green-base) uppercase font-bold tracking-[.3em] flex items-center gap-4 relative z-10">
                                        <DatabaseIcon size={14} />
                                        <span>RECURSOS RECUPERADOS</span>
                                        <div className="h-px flex-1 bg-[linear-gradient(90deg,var(--green-base),transparent)] opacity-30" />
                                    </div>

                                    {newCards.length > 0 && (
                                        <div className="animate-[lc-slideUp_.6s_ease-out_both] delay-300 relative z-10">
                                            <div className="text-[10px] text-(--green-light) tracking-[.15em] mb-4 uppercase flex items-center gap-2">
                                                <div className="w-3 h-px bg-(--green-light)" />
                                                {newCards.length} Módulo{newCards.length > 1 ? 's' : ''} extraído{newCards.length > 1 ? 's' : ''}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {newCards.map((card, idx) => {
                                                    const r = RARITY_STYLES[card.rarity] ?? RARITY_STYLES.common
                                                    return (
                                                        <div
                                                            key={card.id}
                                                            onClick={() => { setSelectedCardIdx(idx); }}
                                                            className="flex items-center gap-3 p-3 bg-black/40 rounded-xs border border-(--border-color)/40 hover:border-(--green-base)/40 transition-all duration-300 group/item cursor-pointer shadow-lg"
                                                            style={{
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

                                    {secretCardUnlocked && (
                                        <div className="border border-(--amber)/30 rounded-xs p-5 text-center relative overflow-hidden animate-[lc-slideUp_.6s_ease-out_both] delay-500"
                                            style={{ background: 'linear-gradient(135deg, rgba(20,10,0,.9), rgba(40,25,0,.6))' }}>
                                            <div className="text-[11px] font-bold text-(--amber) tracking-[.4em] mb-2 relative uppercase">FRAGMENTO OCULTO RECUPERADO</div>
                                            <div className="text-[12px] text-[#f5d5b8] italic opacity-90">&quot;Independencia total del sistema FRAG confirmada.&quot;</div>
                                        </div>
                                    )}

                                    {newObjects.length > 0 && (
                                        <div className="animate-[lc-slideUp_.6s_ease-out_both] delay-700 relative z-10">
                                            <div className="text-[10px] text-(--amber) tracking-[.15em] uppercase mb-4 flex items-center gap-2">
                                                <div className="w-3 h-px bg-(--amber)" />
                                                {newObjects.length} Artefacto{newObjects.length > 1 ? 's' : ''} recuperado{newObjects.length > 1 ? 's' : ''}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {newObjects.map((obj) => (
                                                    <div key={obj.id} className="bg-black/30 border border-[#2a1d0a] rounded-xs py-3 px-4 flex flex-col gap-1">
                                                        <div className="text-[11px] text-(--amber) font-bold tracking-widest uppercase">{obj.name}</div>
                                                        <div className="text-[9px] text-(--text-muted)">{obj.inventoryNote}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {reviewHint?.shouldShow && (
                                <div className="border border-(--purple)/30 bg-[#0d091a] rounded-xs p-5 animate-[lc-slideUp_.6s_ease-out_both]">
                                    <div className="text-[10px] text-[#a49ee8] tracking-[.25em] mb-3 uppercase font-bold flex items-center gap-2">
                                        <ActivityIcon size={12} /> SUGERENCIA_OPTIMIZACIÓN
                                    </div>
                                    <div className="text-[12px] text-[#d6d4f0] leading-relaxed pl-4 border-l-2 border-(--purple)/40">
                                        {reviewHint.message}
                                    </div>
                                </div>
                            )}

                            {children}

                            {/* BOTONES */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mt-2 pt-6 border-t border-[#1a2636]">
                                <div className="flex gap-3">
                                    <Button onClick={onRetry} variant="outline" size="sm" className="min-w-[120px]">
                                        <RotateCcwIcon size={14} /> REINTENTAR
                                    </Button>
                                    <Button onClick={onMap} variant="outline" size="sm" className="min-w-[100px]">MAPA</Button>
                                </div>
                                <Button
                                    onClick={onNext}
                                    size="md"
                                    variant="solid"
                                    icon={reviewHint?.shouldShow ? RotateCcwIcon : ChevronsRightIcon}
                                    iconPosition="right"
                                >
                                    {reviewHint?.shouldShow ? `REPASAR "${reviewHint.levelTitle}"` : "SIGUIENTE NIVEL"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CardDetailModal
                selectedCard={selectedCardIdx !== null ? newCards[selectedCardIdx] : null}
                onClose={() => setSelectedCardIdx(null)}
            />
        </div>
    )
}

const FloatingParticles = memo(({ visible }: { visible: boolean }) => {
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