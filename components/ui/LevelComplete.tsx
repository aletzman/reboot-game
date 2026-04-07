'use client'

import React, { useState, useEffect, useMemo, memo } from 'react'
import type { Card, GameObject } from '@/types/game'
import { Button } from './Button'
import { Panel } from './Panel'
import { TacticalSection } from './TacticalSection'
import SectionHeader from './SectionHeader'
import { RotateCcwIcon, HardDriveIcon, ChevronsRightIcon, DatabaseIcon, CpuIcon, ActivityIcon, MapIcon } from 'lucide-react'
import { RARITY_STYLES } from '@/components/cards/DataCartridge'
import { CardDetailModal } from '@/components/cards/CardDetailModal'
import { Screw } from './Screw'

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

            <div className={`relative w-full max-w-[780px] bg-[#030405] rounded-md p-[8px] border border-black shadow-[0_50px_100px_rgba(0,0,0,0.9),inset_0_4px_20px_rgba(0,0,0,0.9),inset_0_-4px_20px_rgba(0,0,0,0.9)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${panelReady ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}>

                {/* ─── MODULO PRINCIPAL (PLUNGER) ─── */}
                <div className="relative flex-1 flex flex-col rounded-sm overflow-hidden bg-[linear-gradient(180deg,#161b22,#0a0d11)] border-2 border-[#1c2229] shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.05)]">

                    <SectionHeader title="Misión Finalizada" subtitle="SIS_STATUS // OPERACIÓN_COMPLETA" />

                    <div className="relative px-6 py-6 pb-2 max-h-[70vh] overflow-y-auto custom-scrollbar flex flex-col gap-5 z-10 isolate bg-[#0C1117] shadow-[inset_0_4px_20px_rgba(0,0,0,0.8)]">
                        {/* Textura global de fondo industrial */}
                        <div className="absolute inset-0 opacity-[0.02] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#fff_2px,#fff_4px)] pointer-events-none z-0" />

                        <div className="flex flex-col md:flex-row gap-5 min-h-[160px]">

                            {/* COLUMNA IZQUIERDA: CONSUMO Y RESULTADOS */}
                            <div className="w-full md:w-[320px] flex flex-col gap-5">
                                <TacticalSection title="CONSUMO_DE_ENERGÍA" variant="elevated" isActived={true}>
                                    <div className="flex justify-center items-center gap-5 h-28 p-2 relative z-10">
                                        {[1, 2, 3].map(n => {
                                            const isActive = n <= visibleStars;
                                            return (
                                                <div key={n} className="relative w-16 h-full border-x border-y border-[#1c2229]/50 bg-[#020304] flex flex-col justify-end p-1 shadow-[inset_0_6px_15px_rgba(0,0,0,1)] rounded-sm overflow-hidden">
                                                    {/* Contacto metálico superior de la batería */}
                                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#2d3641] shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />

                                                    {/* Celda LED de la batería */}
                                                    <div
                                                        className={`w-full transition-all duration-700 rounded-xs relative overflow-hidden
                                                             ${isActive
                                                                ? 'h-full bg-(--green-base) border-t-2 border-(--green-light) shadow-[0_0_20px_var(--green-light)]'
                                                                : 'h-2 bg-[#0c1218] border-t border-black'
                                                            }
                                                         `}
                                                    >
                                                        {isActive && (
                                                            <>
                                                                <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.5)_4px,rgba(0,0,0,0.5)_8px)]" />
                                                                <div className="absolute top-0 left-0 right-0 h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,transparent_100%)]" />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </TacticalSection>

                                <TacticalSection
                                    title="RESULTADO_OPERATIVO"
                                    variant="inset"
                                    accentColor={visibleStars === 3 ? 'var(--green-light)' : visibleStars === 2 ? 'var(--amber)' : 'var(--red-light)'}
                                >
                                    <div className="p-4 bg-[#05070a] border border-(--bg-void) shadow-[inset_0_4px_12px_rgba(0,0,0,1)] overflow-hidden relative min-h-[90px] flex flex-col justify-center">
                                        {/* Reflejo CRT */}
                                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02)_0%,transparent_50%)] pointer-events-none" />

                                        <div className={`text-[13px] font-black uppercase tracking-widest mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${visibleStars === 3 ? 'text-(--green-light)' : visibleStars === 2 ? 'text-amber-400' : 'text-red-400'}`}>
                                            {feedback.title}
                                        </div>
                                        <div className="text-[13px] text-[#8B949E] leading-relaxed font-sans opacity-95 font-medium">
                                            {feedback.desc}
                                        </div>
                                    </div>
                                </TacticalSection>
                            </div>

                            {/* COLUMNA DERECHA: FRAG ANALYSIS */}
                            <div className="flex-1 h-full flex flex-col">
                                <TacticalSection title="ANÁLISIS_FRAG_OS" accentColor="var(--purple)" variant="inset">
                                    <div className="p-5 h-full min-h-[240px] flex flex-col justify-between relative overflow-hidden bg-[#020304] border border-(--bg-void) shadow-[inset_0_8px_20px_rgba(0,0,0,1)]">
                                        {/* Reflejo CRT Violeta */}
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(127,119,221,0.05),transparent_60%)] pointer-events-none" />

                                        {/* Rejilla de circuito muy sutil de fondo */}
                                        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(127,119,221,1)_1px,transparent_1px),linear-gradient(90deg,rgba(127,119,221,1)_1px,transparent_1px)] bg-size-[15px_15px] pointer-events-none z-0" />

                                        <div className="flex items-start gap-4 flex-1 relative z-10">
                                            <div className="text-(--purple) font-black text-xl select-none mt-1 animate-pulse drop-shadow-[0_0_8px_var(--purple)]">{">_"}</div>
                                            <div className="flex flex-col gap-4">
                                                <p className={`text-[15px] leading-relaxed tracking-wide font-sans normal-case ${stars === 3 ? 'text-purple-100' : 'text-[#E6EDF3]'}`}>
                                                    {feedback.frag}
                                                </p>
                                            </div>
                                        </div>

                                        {reviewHint?.levelTitle && (
                                            <div className="inline-flex w-fit items-center gap-3 text-[10px] text-[#8B949E] tracking-[0.2em] uppercase bg-[#080B0E] border border-[#1c2229] px-4 py-2 mt-4 rounded-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] relative z-10">
                                                <CpuIcon size={14} className="text-(--purple)/60" />
                                                <span>
                                                    NODO_RELACIONADO: <span className="text-(--purple) font-bold">{reviewHint.levelTitle}</span>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </TacticalSection>
                            </div>
                        </div>

                        {/* RECOMPENSAS: EXTRACCIÓN DE RECURSOS */}
                        {hasRewards && (
                            <TacticalSection title="EXTRACCIÓN_DE_RECURSOS" accentColor="var(--green-base)" variant="inset">
                                <div className="p-5 flex flex-col gap-4 bg-[#080B0E] relative overflow-hidden border border-(--bg-void) shadow-[inset_0_6px_15px_rgba(0,0,0,1)]">
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(85,226,0,0.02)_50%,transparent_75%)] bg-size-[200%_200%] animate-[lc-shimmer_6s_linear_infinite]" />

                                    {newCards.length > 0 && (
                                        <div className="animate-[lc-slideUp_.6s_ease-out_both] delay-300 relative z-10">
                                            <div className="text-[11px] text-(--green-light) tracking-[.15em] mb-4 uppercase font-black flex items-center gap-3 drop-shadow-[0_0_4px_rgba(126,213,38,0.5)]">
                                                <div className="w-5 h-[3px] bg-(--green-light) shadow-[0_0_8px_var(--green-light)]" />
                                                {newCards.length} Módulo{newCards.length > 1 ? 's' : ''} extraído{newCards.length > 1 ? 's' : ''}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {newCards.map((card, idx) => {
                                                    const r = RARITY_STYLES[card.rarity] ?? RARITY_STYLES.common
                                                    return (
                                                        <div
                                                            key={card.id}
                                                            onClick={() => { setSelectedCardIdx(idx); }}
                                                            className="flex items-center gap-4 p-3 bg-[#020304] rounded-sm border-2 border-[#1c2229] hover:border-(--green-base) transition-all duration-300 group/item cursor-pointer shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]"
                                                        >
                                                            <div className="w-14 h-14 bg-[#05070a] rounded-sm flex items-center justify-center border-2 border-[#1c2229] group-hover/item:border-(--green-base) shadow-[inset_0_4px_8px_rgba(0,0,0,1)] transition-colors shrink-0">
                                                                <HardDriveIcon size={24} style={{ color: r.color }} className="opacity-70 group-hover/item:opacity-100 group-hover/item:scale-110 transition-all drop-shadow-[0_0_8px_currentColor]" />
                                                            </div>
                                                            <div className="flex-1 overflow-hidden">
                                                                <div className="text-[11px] font-black tracking-[0.15em] uppercase truncate leading-tight" style={{ color: r.color, textShadow: `0 0 8px ${r.color}55` }}>
                                                                    {card.name}
                                                                </div>
                                                                <div className="text-[9px] text-[#3D444D] mt-2 tracking-[0.2em] uppercase flex items-center gap-2 font-bold group-hover/item:text-[#8B949E] transition-colors">
                                                                    <div className="w-2 h-0.5 bg-current" /> VER_DATA_MODULE
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {newObjects.length > 0 && (
                                        <div className="animate-[lc-slideUp_.6s_ease-out_both] delay-500 relative z-10">
                                            <div className="text-[11px] text-(--amber) tracking-[.15em] uppercase font-black mb-4 flex items-center gap-3 drop-shadow-[0_0_4px_rgba(239,159,39,0.5)]">
                                                <div className="w-5 h-[3px] bg-(--amber) shadow-[0_0_8px_var(--amber)]" />
                                                {newObjects.length} Artefacto{newObjects.length > 1 ? 's' : ''} recuperado{newObjects.length > 1 ? 's' : ''}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {newObjects.map((obj) => (
                                                    <div key={obj.id} className="bg-[#020304] border-2 border-[#1c2229] rounded-sm shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] p-4 flex flex-col gap-2">
                                                        <div className="text-[12px] text-(--amber) font-black tracking-widest uppercase" style={{ textShadow: '0 0 8px rgba(239,159,39,0.4)' }}>{obj.name}</div>
                                                        <div className="text-[10px] text-[#8B949E] font-medium leading-relaxed">{obj.inventoryNote}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {secretCardUnlocked && (
                                        <div className="border-2 border-[#1c2229] bg-[linear-gradient(135deg,rgba(20,10,0,1),rgba(40,25,0,0.8))] rounded-sm p-4 text-center relative overflow-hidden animate-[lc-slideUp_.6s_ease-out_both] delay-700 mt-2 z-10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.9)]">
                                            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#fff_2px,#fff_4px)]" />
                                            <div className="text-[12px] font-black text-(--amber) tracking-[.4em] mb-2 relative uppercase drop-shadow-[0_0_10px_var(--amber)]">FRAGMENTO_OCULTO_SNC</div>
                                            <div className="text-[12px] text-[#f5d5b8] italic opacity-95">&quot;Independencia total del sistema FRAG confirmada.&quot;</div>
                                        </div>
                                    )}
                                </div>
                            </TacticalSection>
                        )}

                        {reviewHint?.shouldShow && (
                            <TacticalSection title="SUGERENCIA_DE_OPTIMIZACIÓN" accentColor="var(--purple)" isActived={true} variant="inset">
                                <div className="p-4 bg-[#05070a] border border-(--bg-void) shadow-[inset_0_8px_20px_rgba(0,0,0,1)] animate-[lc-slideUp_.6s_ease-out_both] relative overflow-hidden flex flex-col justify-center">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(127,119,221,0.03),transparent_70%)] pointer-events-none" />
                                    <div className="text-[14px] text-[#d6d4f0] leading-relaxed font-sans font-medium relative z-10">
                                        {reviewHint.message}
                                    </div>
                                </div>
                            </TacticalSection>
                        )}

                        {children}
                    </div>

                    {/* ─── FOOTER MECÁNICO (SWITCHES ) ─── */}
                    <div className="shrink-0 relative bg-[linear-gradient(180deg,#12161A_0%,#090B0D_100%)] border-t-2 border-black z-20 shadow-[0_-8px_20px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.05)]">
                        <div className="flex flex-wrap items-center justify-between gap-4 p-5 py-6">
                            <div className="flex gap-4">
                                <Button onClick={onRetry} variant="outline" icon={RotateCcwIcon} size="md" className="min-w-[140px]">
                                    REINTENTAR
                                </Button>
                                <Button onClick={onMap} variant="cyan" icon={MapIcon} size="md" className="min-w-[120px]">
                                    MAPA_SECT
                                </Button>
                            </div>
                            <Button
                                onClick={onNext}
                                size="md"
                                variant="green"
                                icon={reviewHint?.shouldShow ? RotateCcwIcon : ChevronsRightIcon}
                                iconPosition="right"
                                className="min-w-[180px]"
                            >
                                {reviewHint?.shouldShow ? `REPASAR NODO` : "SIGUIENTE_FASE"}
                            </Button>
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