// ============================================================
// REBOOT — components/ui/LevelComplete.tsx
// Modal que aparece al terminar un nivel
// Muestra estrellas, cartas desbloqueadas, objetos y opciones
// ============================================================

'use client'

import { useState, useEffect } from 'react'
import type { Card, GameObject } from '@/types/game'

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
}

// ------------------------------------------------------------
// RAREZA — colores y labels
// ------------------------------------------------------------

const RARITY_STYLES: Record<string, { bg: string; border: string; color: string; label: string }> = {
    common: { bg: '#042C53', border: '#185FA5', color: '#85B7EB', label: 'común' },
    rare: { bg: '#412402', border: '#854F0B', color: '#EF9F27', label: 'rara' },
    epic: { bg: '#26215C', border: '#534AB7', color: '#AFA9EC', label: 'épica' },
    legendary: { bg: '#1a0800', border: '#993C1D', color: '#F0997B', label: 'legendaria' },
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
}: LevelCompleteProps) {
    const [phase, setPhase] = useState<'stars' | 'cards' | 'done'>('stars')
    const [flippedCards, setFlipped] = useState<Set<number>>(new Set())
    const [visibleStars, setVisible] = useState(0)
    const [showObjects, setShowObjects] = useState(false)

    // animación de estrellas una a una
    useEffect(() => {
        if (phase !== 'stars') return
        let count = 0
        const interval = setInterval(() => {
            count++
            setVisible(count)
            if (count >= stars) {
                clearInterval(interval)
                // avanzar a cartas después de mostrar estrellas
                setTimeout(() => {
                    if (newCards.length > 0 || secretCardUnlocked) {
                        setPhase('cards')
                    } else {
                        setPhase('done')
                        if (newObjects.length > 0) setShowObjects(true)
                    }
                }, 800)
            }
        }, 400)
        return () => clearInterval(interval)
    }, [phase, stars, newCards.length, secretCardUnlocked])

    function handleFlipCard(idx: number) {
        setFlipped(prev => {
            const next = new Set(prev)
            next.has(idx) ? next.delete(idx) : next.add(idx)
            return next
        })
    }

    function handleContinueFromCards() {
        setPhase('done')
        if (newObjects.length > 0) setShowObjects(true)
    }

    // ------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(1,1,1,.88)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: '1rem',
        }}>
            <div style={{
                background: 'var(--bg-surface)',
                border: `1px solid ${stars === 3 ? 'var(--green-base)' : stars > 0 ? 'var(--bg-hover)' : 'var(--red)'}`,
                borderRadius: '12px',
                padding: '2rem',
                maxWidth: '480px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                fontFamily: 'var(--font-mono)',
            }}>

                {/* Fase 1 — estrellas */}
                {(phase === 'stars' || phase === 'cards' || phase === 'done') && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            fontSize: '10px',
                            color: 'var(--green-base)',
                            letterSpacing: '.14em',
                            marginBottom: '1rem',
                        }}>
                            {stars === 0 ? '// nivel completado' : stars === 3 ? '// solución perfecta' : '// nivel completado'}
                        </div>

                        {/* Estrellas */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '1rem',
                            marginBottom: '1rem',
                        }}>
                            {[1, 2, 3].map(n => (
                                <div key={n} style={{
                                    width: '40px',
                                    height: '40px',
                                    transition: 'all .3s',
                                    opacity: visibleStars >= n ? 1 : 0.15,
                                    transform: visibleStars >= n ? 'scale(1)' : 'scale(0.7)',
                                }}>
                                    <svg viewBox="0 0 40 40" fill="none">
                                        <polygon
                                            points="20,4 24,14 36,14 26,22 30,34 20,26 10,34 14,22 4,14 16,14"
                                            fill={visibleStars >= n ? '#55e200' : '#1a4d00'}
                                            stroke={visibleStars >= n ? '#88c44d' : '#0d1f00'}
                                            strokeWidth="1"
                                        />
                                    </svg>
                                </div>
                            ))}
                        </div>

                        {/* Mensaje según estrellas */}
                        <div style={{
                            fontSize: '12px',
                            color: stars === 3
                                ? 'var(--green-light)'
                                : stars === 0
                                    ? 'var(--text-muted)'
                                    : 'var(--text-muted)',
                            letterSpacing: '.06em',
                        }}>
                            {stars === 3 && 'FRAG: "Solución óptima. Impresionante."'}
                            {stars === 2 && 'FRAG: "Bien hecho. Puedes mejorar la eficiencia."'}
                            {stars === 1 && 'FRAG: "Completado. Intenta usar menos comandos."'}
                            {stars === 0 && 'FRAG: "Nivel registrado."'}
                        </div>
                    </div>
                )}

                {/* Fase 2 — cartas */}
                {phase === 'cards' && newCards.length > 0 && (
                    <div>
                        <div style={{
                            fontSize: '10px',
                            color: 'var(--green-base)',
                            letterSpacing: '.14em',
                            marginBottom: '1rem',
                            textAlign: 'center',
                        }}>
              // {newCards.length === 1 ? 'carta desbloqueada' : `${newCards.length} cartas desbloqueadas`}
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                        }}>
                            {newCards.map((card, idx) => (
                                <CardFlip
                                    key={card.id}
                                    card={card}
                                    flipped={flippedCards.has(idx)}
                                    onClick={() => handleFlipCard(idx)}
                                />
                            ))}
                        </div>

                        <div style={{
                            fontSize: '10px',
                            color: 'var(--text-ghost)',
                            textAlign: 'center',
                            marginTop: '.75rem',
                            letterSpacing: '.06em',
                        }}>
                            toca la carta para ver qué aprendiste
                        </div>

                        <button
                            onClick={handleContinueFromCards}
                            style={{
                                width: '100%',
                                marginTop: '1rem',
                                background: 'transparent',
                                border: '1px solid var(--bg-hover)',
                                borderRadius: '7px',
                                padding: '9px',
                                color: 'var(--text-muted)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                cursor: 'pointer',
                                letterSpacing: '.1em',
                            }}
                        >
                            continuar →
                        </button>
                    </div>
                )}

                {/* Carta secreta */}
                {secretCardUnlocked && phase === 'cards' && (
                    <div style={{
                        background: '#1a0800',
                        border: '1px solid #993C1D',
                        borderRadius: '8px',
                        padding: '.875rem',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '11px', color: '#F0997B', letterSpacing: '.1em', marginBottom: '.375rem' }}>
                            ★ carta secreta desbloqueada
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            FRAG: "Nunca me pediste ayuda. Lo resolviste todo solo."
                        </div>
                    </div>
                )}

                {/* Objetos desbloqueados */}
                {showObjects && newObjects.length > 0 && (
                    <div>
                        <div style={{
                            fontSize: '10px',
                            color: 'var(--amber)',
                            letterSpacing: '.14em',
                            marginBottom: '.75rem',
                        }}>
              // {newObjects.length === 1 ? 'objeto recogido' : `${newObjects.length} objetos recogidos`}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                            {newObjects.map(obj => (
                                <div key={obj.id} style={{
                                    background: 'var(--bg-elevated)',
                                    border: '1px solid var(--bg-hover)',
                                    borderRadius: '7px',
                                    padding: '.75rem 1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '.25rem',
                                }}>
                                    <div style={{ fontSize: '12px', color: 'var(--amber)', fontWeight: 500 }}>
                                        {obj.name}
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                        {obj.inventoryNote}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Hint de repaso de FRAG */}
                {reviewHint?.shouldShow && phase === 'done' && (
                    <div style={{
                        background: '#1a1020',
                        border: '1px solid #534AB7',
                        borderRadius: '8px',
                        padding: '.875rem',
                    }}>
                        <div style={{
                            fontSize: '11px',
                            color: 'var(--purple)',
                            lineHeight: 1.6,
                        }}>
                            {reviewHint.message}
                        </div>
                    </div>
                )}

                {/* Botones finales */}
                {phase === 'done' && (
                    <div style={{ display: 'flex', gap: '.625rem' }}>
                        <button
                            onClick={onNext}
                            style={{
                                flex: 1,
                                background: 'var(--green-dark)',
                                border: '1px solid var(--green-base)',
                                borderRadius: '7px',
                                padding: '11px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '12px',
                                color: 'var(--green-light)',
                                cursor: 'pointer',
                                letterSpacing: '.1em',
                                transition: 'background .15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--green-base)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'var(--green-dark)')}
                        >
                            {reviewHint?.shouldShow ? `repasar "${reviewHint.levelTitle}"` : 'siguiente nivel →'}
                        </button>
                        <button
                            onClick={onMap}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--bg-hover)',
                                borderRadius: '7px',
                                padding: '11px 16px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                letterSpacing: '.06em',
                            }}
                        >
                            mapa
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

// ------------------------------------------------------------
// COMPONENTE DE CARTA CON FLIP 3D
// ------------------------------------------------------------

function CardFlip({ card, flipped, onClick }: {
    card: Card
    flipped: boolean
    onClick: () => void
}) {
    const rarity = RARITY_STYLES[card.rarity] ?? RARITY_STYLES.common

    return (
        <div
            onClick={onClick}
            style={{
                width: '140px',
                height: '200px',
                perspective: '800px',
                cursor: 'pointer',
                flexShrink: 0,
            }}
        >
            <div style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform .6s cubic-bezier(.4,0,.2,1)',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}>

                {/* Frente — arte geométrico */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    background: rarity.bg,
                    border: `1px solid ${rarity.border}`,
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 10px',
                }}>
                    {/* Rareza */}
                    <div style={{
                        fontSize: '9px',
                        color: rarity.color,
                        letterSpacing: '.12em',
                        textTransform: 'uppercase',
                    }}>
                        {rarity.label}
                    </div>

                    {/* Arte geométrico generativo */}
                    <CardArt cardId={card.id} rarity={card.rarity} color={rarity.color} />

                    {/* Nombre */}
                    <div style={{
                        fontSize: '11px',
                        color: rarity.color,
                        textAlign: 'center',
                        lineHeight: 1.3,
                        fontWeight: 500,
                    }}>
                        {card.name}
                    </div>

                    {/* Acto */}
                    <div style={{
                        fontSize: '9px',
                        color: rarity.border,
                        letterSpacing: '.08em',
                    }}>
                        {card.actName}
                    </div>
                </div>

                {/* Reverso — contenido técnico */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: 'var(--bg-elevated)',
                    border: `1px solid ${rarity.border}`,
                    borderRadius: '10px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    overflow: 'hidden',
                }}>
                    {/* Concepto */}
                    <div style={{
                        fontSize: '10px',
                        color: rarity.color,
                        letterSpacing: '.1em',
                        borderBottom: `1px solid ${rarity.border}`,
                        paddingBottom: '5px',
                    }}>
                        {card.concept}
                    </div>

                    {/* Descripción humana */}
                    <div style={{
                        fontSize: '9px',
                        color: 'var(--text-muted)',
                        lineHeight: 1.55,
                        flex: 1,
                    }}>
                        {card.humanExplanation}
                    </div>

                    {/* Ejemplo de código — solo si existe */}
                    {card.codeExample && (
                        <div style={{
                            background: 'var(--bg-surface)',
                            borderRadius: '4px',
                            padding: '5px 7px',
                            fontSize: '8px',
                            color: 'var(--green-muted)',
                            fontFamily: 'var(--font-mono)',
                            lineHeight: 1.7,
                            whiteSpace: 'pre',
                            overflow: 'hidden',
                            maxHeight: '60px',
                        }}>
                            {card.codeExample.split('\n').slice(0, 4).join('\n')}
                        </div>
                    )}

                    {/* Tip */}
                    <div style={{
                        fontSize: '8px',
                        color: 'var(--text-ghost)',
                        lineHeight: 1.5,
                        fontStyle: 'italic',
                    }}>
                        {card.tip}
                    </div>
                </div>
            </div>
        </div>
    )
}

// ------------------------------------------------------------
// ARTE GEOMÉTRICO GENERATIVO POR CARTA
// Cada carta tiene un patrón único basado en su id
// ------------------------------------------------------------

function CardArt({ cardId, rarity, color }: {
    cardId: string
    rarity: string
    color: string
}) {
    // genera un número pseudoaleatorio determinista a partir del id
    const seed = cardId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    const r = (n: number) => ((seed * (n + 1) * 2654435761) >>> 0) % 100

    const shapes = [
        // círculos
        { cx: 20 + r(0) * 0.6, cy: 20 + r(1) * 0.6, rx: 5 + r(2) * 0.15 },
        { cx: 20 + r(3) * 0.6, cy: 20 + r(4) * 0.6, rx: 3 + r(5) * 0.1 },
        { cx: 20 + r(6) * 0.6, cy: 20 + r(7) * 0.6, rx: 8 + r(8) * 0.2 },
    ]

    const opacities = ['0.15', '0.3', '0.5', '0.8']
    const rarityOpacity: Record<string, number> = {
        common: 0.6, rare: 0.75, epic: 0.9, legendary: 1,
    }
    const baseOpacity = rarityOpacity[rarity] ?? 0.6

    return (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            {/* Fondo geométrico */}
            <rect x="10" y="10" width="60" height="60" rx="4"
                fill="none" stroke={color} strokeOpacity="0.1" strokeWidth="0.5" />

            {/* Formas generativas */}
            {shapes.map((s, i) => (
                <ellipse
                    key={i}
                    cx={s.cx}
                    cy={s.cy}
                    rx={s.rx}
                    ry={s.rx * (0.5 + r(i + 9) * 0.01)}
                    fill={color}
                    fillOpacity={parseFloat(opacities[i % 4]) * baseOpacity}
                />
            ))}

            {/* Líneas de conexión */}
            <line
                x1={shapes[0].cx} y1={shapes[0].cy}
                x2={shapes[1].cx} y2={shapes[1].cy}
                stroke={color} strokeOpacity="0.2" strokeWidth="0.5"
            />
            <line
                x1={shapes[1].cx} y1={shapes[1].cy}
                x2={shapes[2].cx} y2={shapes[2].cy}
                stroke={color} strokeOpacity="0.2" strokeWidth="0.5"
            />

            {/* Punto central */}
            <circle cx="40" cy="40" r="2" fill={color} fillOpacity={baseOpacity} />
        </svg>
    )
}