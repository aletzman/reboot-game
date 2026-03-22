// ============================================================
// REBOOT — components/levels/DecisionLevel.tsx
// Nivel de decisión: el jugador elige su lenguaje
// Solo se usa en el nivel 3-02
// ============================================================

'use client'

import { useState } from 'react'
import type { Level, LevelState } from '@/types/game'

// ------------------------------------------------------------
// TIPOS
// ------------------------------------------------------------

interface DecisionLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
}

interface LanguageOption {
    id: string
    name: string
    status: 'active' | 'damaged'
    description: string
    detail: string
    year: string
}

// ------------------------------------------------------------
// OPCIONES DE LENGUAJE
// ------------------------------------------------------------

const LANGUAGES: LanguageOption[] = [
    {
        id: 'javascript',
        name: 'JavaScript',
        status: 'active',
        description: 'El lenguaje de la web. Corre en el browser y en el servidor.',
        detail: 'Sobrevivió El Silencio en el sistema más aislado del laboratorio. Operativo al 100%.',
        year: 'creado en 1995',
    },
    {
        id: 'python',
        name: 'Python',
        status: 'damaged',
        description: 'Simple y poderoso. Usado en ciencia de datos e IA.',
        detail: 'Sistema dañado durante El Silencio. Requiere reparación del compilador.',
        year: 'creado en 1991',
    },
    {
        id: 'csharp',
        name: 'C#',
        status: 'damaged',
        description: 'Robusto y tipado. Base del ecosistema .NET.',
        detail: 'Módulo de runtime corrompido. No disponible.',
        year: 'creado en 2000',
    },
    {
        id: 'rust',
        name: 'Rust',
        status: 'damaged',
        description: 'Velocidad y seguridad de memoria sin garbage collector.',
        detail: 'Error crítico en el linker. Requiere reconstrucción completa.',
        year: 'creado en 2010',
    },
    {
        id: 'go',
        name: 'Go',
        status: 'damaged',
        description: 'Concurrencia nativa. Diseñado para sistemas distribuidos.',
        detail: 'Paquetes de red dañados. Parcialmente recuperable.',
        year: 'creado en 2009',
    },
]

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------

export default function DecisionLevel({
    level,
    state,
    onComplete,
}: DecisionLevelProps) {
    const [selected, setSelected] = useState<string | null>(null)
    const [confirmed, setConfirmed] = useState(false)
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    function handleSelect(id: string) {
        if (confirmed) return
        // solo JavaScript es seleccionable
        if (LANGUAGES.find(l => l.id === id)?.status === 'damaged') return
        setSelected(id)
    }

    function handleConfirm() {
        if (!selected || confirmed) return
        setConfirmed(true)
        setTimeout(() => onComplete(0, state.fragUsed), 1200)
    }

    const hovered = LANGUAGES.find(l => l.id === hoveredId)
    const selectedLang = LANGUAGES.find(l => l.id === selected)

    // ------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-void)',
            padding: '2rem 1rem',
            alignItems: 'center',
            gap: '2rem',
        }}>
            <div style={{ maxWidth: '640px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Header narrativo */}
                <div>
                    <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--green-base)',
                        letterSpacing: '.14em',
                        marginBottom: '.5rem',
                    }}>
            // laboratorio de lenguajes — selección
                    </div>
                    <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        color: 'var(--purple)',
                        lineHeight: 1.7,
                    }}>
                        FRAG: &quot;Cada terminal contiene un lenguaje de programación.
                        Solo uno sigue operativo. Elige con cuidado — esto definirá
                        cómo te comunicarás con los sistemas del bunker.&quot;
                    </div>
                </div>

                {/* Grid de terminales */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '.75rem',
                }}>
                    {LANGUAGES.map(lang => {
                        const isActive = lang.status === 'active'
                        const isSelected = selected === lang.id
                        const isConfirmed = confirmed && isSelected

                        return (
                            <div
                                key={lang.id}
                                onClick={() => handleSelect(lang.id)}
                                onMouseEnter={() => setHoveredId(lang.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                    background: isConfirmed
                                        ? 'var(--green-darkest)'
                                        : isSelected
                                            ? '#0d1f00'
                                            : 'var(--bg-surface)',
                                    border: `${isSelected ? '2px' : '1px'} solid ${isConfirmed ? 'var(--green-light)'
                                            : isSelected ? 'var(--green-base)'
                                                : isActive ? 'var(--green-dark)'
                                                    : 'var(--bg-hover)'
                                        }`,
                                    borderRadius: '10px',
                                    padding: '1.25rem 1rem',
                                    cursor: isActive && !confirmed ? 'pointer' : 'default',
                                    opacity: !isActive ? 0.45 : 1,
                                    transition: 'all .2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '.625rem',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Status indicator */}
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    width: '7px',
                                    height: '7px',
                                    borderRadius: '50%',
                                    background: isActive ? 'var(--green-light)' : 'var(--red)',
                                    animation: isActive ? 'termPulse 2s ease-in-out infinite' : 'none',
                                }} />

                                {/* Nombre del lenguaje */}
                                <div style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '16px',
                                    fontWeight: 500,
                                    color: isActive ? (isSelected ? 'var(--green-light)' : 'var(--text-primary)') : 'var(--text-ghost)',
                                    letterSpacing: '.06em',
                                }}>
                                    {lang.name}
                                </div>

                                {/* Año */}
                                <div style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '9px',
                                    color: isActive ? 'var(--green-base)' : 'var(--text-ghost)',
                                    letterSpacing: '.1em',
                                }}>
                                    {lang.year}
                                </div>

                                {/* Estado */}
                                <div style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '10px',
                                    color: isActive ? 'var(--green-light)' : 'var(--red)',
                                    letterSpacing: '.1em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                }}>
                                    {isActive ? '▶ OPERATIVO' : '✗ DAÑADO'}
                                </div>

                                {/* Líneas decorativas de "terminal" */}
                                <div style={{
                                    borderTop: '1px solid',
                                    borderColor: isActive ? 'var(--green-darkest)' : 'var(--bg-hover)',
                                    paddingTop: '.5rem',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '9px',
                                    color: 'var(--text-ghost)',
                                    lineHeight: 1.5,
                                }}>
                                    {lang.detail}
                                </div>

                                {/* Overlay de confirmación */}
                                {isConfirmed && (
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'rgba(13,31,0,.85)',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '12px',
                                        color: 'var(--green-light)',
                                        letterSpacing: '.14em',
                                    }}>
                                        seleccionado ✓
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Panel inferior — descripción del hover/seleccionado + confirmar */}
                <div style={{
                    background: 'var(--bg-surface)',
                    border: `1px solid ${selected ? 'var(--green-base)' : 'var(--bg-hover)'}`,
                    borderRadius: '10px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    minHeight: '100px',
                    transition: 'border-color .2s',
                }}>
                    {(hovered || selectedLang) ? (
                        <>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '.75rem',
                            }}>
                                <div style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    color: (hovered ?? selectedLang)?.status === 'active'
                                        ? 'var(--green-light)'
                                        : 'var(--text-ghost)',
                                }}>
                                    {(hovered ?? selectedLang)?.name}
                                </div>
                                <div style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '10px',
                                    color: (hovered ?? selectedLang)?.status === 'active'
                                        ? 'var(--green-base)'
                                        : 'var(--red)',
                                    letterSpacing: '.1em',
                                }}>
                                    {(hovered ?? selectedLang)?.status === 'active' ? 'OPERATIVO' : 'NO DISPONIBLE'}
                                </div>
                            </div>
                            <div style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: '13px',
                                color: 'var(--text-muted)',
                                lineHeight: 1.6,
                            }}>
                                {(hovered ?? selectedLang)?.description}
                            </div>
                        </>
                    ) : (
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            color: 'var(--text-ghost)',
                            textAlign: 'center',
                            padding: '1rem 0',
                            letterSpacing: '.08em',
                        }}>
              // pasa el cursor sobre una terminal para ver detalles
                        </div>
                    )}

                    {/* Botón de confirmar */}
                    {selected && !confirmed && (
                        <button
                            onClick={handleConfirm}
                            style={{
                                background: 'var(--green-dark)',
                                border: '1px solid var(--green-base)',
                                borderRadius: '8px',
                                padding: '12px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '12px',
                                color: 'var(--green-light)',
                                cursor: 'pointer',
                                letterSpacing: '.12em',
                                transition: 'background .2s',
                                alignSelf: 'stretch',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--green-base)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'var(--green-dark)')}
                        >
                            confirmar — aprender JavaScript
                        </button>
                    )}

                    {confirmed && (
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            color: 'var(--green-light)',
                            textAlign: 'center',
                            letterSpacing: '.1em',
                        }}>
                            FRAG: &quot;JavaScript. Buena elección. Es todo lo que necesitas.&quot;
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes termPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
        </div>
    )
}