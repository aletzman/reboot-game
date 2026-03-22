// ============================================================
// REBOOT — components/frag/FragAssistant.tsx
// La IA auxiliar — aparece en niveles donde fragAvailable=true
// 1 uso por nivel. Si se usa, no se obtiene la 3ra estrella.
// Siempre en --purple. Nunca da la solución completa.
// ============================================================

'use client'

import { useState, useEffect } from 'react'

// ------------------------------------------------------------
// TIPOS
// ------------------------------------------------------------

interface FragAssistantProps {
    hint: string
    onUse: () => void
}

type FragState = 'idle' | 'confirming' | 'speaking' | 'done'

// ------------------------------------------------------------
// FRASES DE ENTRADA DE FRAG
// Varía para no ser repetitivo
// ------------------------------------------------------------

const FRAG_INTROS = [
    'FRAG:',
    'FRAG v0.1:',
    '// FRAG:',
    'FRAG — sistema de respaldo:',
]

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------

export default function FragAssistant({ hint, onUse }: FragAssistantProps) {
    const [fragState, setFragState] = useState<FragState>('idle')
    const [displayedText, setDisplayedText] = useState('')
    const [introText] = useState(
        () => FRAG_INTROS[Math.floor(Math.random() * FRAG_INTROS.length)]
    )

    // typewriter del hint
    useEffect(() => {
        if (fragState !== 'speaking') return
        setDisplayedText('')
        let i = 0
        const fullText = hint
        const interval = setInterval(() => {
            i++
            setDisplayedText(fullText.slice(0, i))
            if (i >= fullText.length) {
                clearInterval(interval)
                setTimeout(() => setFragState('done'), 300)
            }
        }, 28)
        return () => clearInterval(interval)
    }, [fragState, hint])

    function handleRequestFrag() {
        setFragState('confirming')
    }

    function handleConfirm() {
        onUse()
        setFragState('speaking')
    }

    function handleCancel() {
        setFragState('idle')
    }

    // ------------------------------------------------------------
    // RENDER — idle: botón flotante
    // ------------------------------------------------------------

    if (fragState === 'idle') {
        return (
            <div style={{
                position: 'fixed',
                bottom: '1.5rem',
                right: '1.5rem',
                zIndex: 100,
            }}>
                <button
                    onClick={handleRequestFrag}
                    style={{
                        background: '#26215C',
                        border: '1px solid #534AB7',
                        borderRadius: '99px',
                        padding: '10px 18px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        color: '#AFA9EC',
                        cursor: 'pointer',
                        letterSpacing: '.1em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all .2s',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = '#3C3489'
                        e.currentTarget.style.borderColor = '#7F77DD'
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = '#26215C'
                        e.currentTarget.style.borderColor = '#534AB7'
                    }}
                >
                    <FragIcon />
                    pedir pista a FRAG
                </button>
            </div>
        )
    }

    // ------------------------------------------------------------
    // RENDER — confirming: advertencia antes de usar
    // ------------------------------------------------------------

    if (fragState === 'confirming') {
        return (
            <div style={{
                position: 'fixed',
                bottom: '1.5rem',
                right: '1.5rem',
                zIndex: 100,
                maxWidth: '320px',
            }}>
                <div style={{
                    background: '#0D0B1A',
                    border: '1px solid #534AB7',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    fontFamily: 'var(--font-mono)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '.625rem',
                    }}>
                        <FragIcon />
                        <span style={{ fontSize: '11px', color: '#7F77DD', letterSpacing: '.1em' }}>
                            FRAG v0.1
                        </span>
                    </div>

                    <div style={{
                        fontSize: '12px',
                        color: '#8B7FCC',
                        lineHeight: 1.6,
                    }}>
                        Si acepto la pista perderás la oportunidad de
                        obtener la tercera estrella en este nivel.
                    </div>

                    <div style={{
                        fontSize: '11px',
                        color: '#534AB7',
                        lineHeight: 1.5,
                    }}>
                        ¿Seguro que quieres continuar?
                    </div>

                    <div style={{ display: 'flex', gap: '.5rem' }}>
                        <button
                            onClick={handleConfirm}
                            style={{
                                flex: 1,
                                background: '#26215C',
                                border: '1px solid #534AB7',
                                borderRadius: '6px',
                                padding: '9px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                color: '#AFA9EC',
                                cursor: 'pointer',
                                letterSpacing: '.08em',
                                transition: 'all .15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = '#7F77DD'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#534AB7'}
                        >
                            sí, quiero la pista
                        </button>
                        <button
                            onClick={handleCancel}
                            style={{
                                background: 'transparent',
                                border: '1px solid #1D2533',
                                borderRadius: '6px',
                                padding: '9px 14px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                color: '#3D444D',
                                cursor: 'pointer',
                            }}
                        >
                            no
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // ------------------------------------------------------------
    // RENDER — speaking / done: FRAG escribe la pista
    // ------------------------------------------------------------

    return (
        <div style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 100,
            maxWidth: '340px',
        }}>
            <div style={{
                background: '#0D0B1A',
                border: '1px solid #534AB7',
                borderRadius: '12px',
                padding: '1.25rem',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                flexDirection: 'column',
                gap: '.875rem',
            }}>
                {/* Header FRAG */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '.625rem',
                    borderBottom: '1px solid #26215C',
                    paddingBottom: '.625rem',
                }}>
                    <FragIcon />
                    <span style={{
                        fontSize: '10px',
                        color: '#534AB7',
                        letterSpacing: '.12em',
                    }}>
                        {introText}
                    </span>
                    <span style={{
                        marginLeft: 'auto',
                        fontSize: '9px',
                        color: '#3C3489',
                        letterSpacing: '.08em',
                    }}>
                        1 uso restante → 0
                    </span>
                </div>

                {/* Texto con typewriter */}
                <div style={{
                    fontSize: '12px',
                    color: '#AFA9EC',
                    lineHeight: 1.7,
                    minHeight: '2.5rem',
                }}>
                    {displayedText}
                    {fragState === 'speaking' && (
                        <span style={{
                            display: 'inline-block',
                            width: '7px',
                            height: '12px',
                            background: '#7F77DD',
                            verticalAlign: 'middle',
                            marginLeft: '2px',
                            animation: 'fragBlink .6s step-end infinite',
                        }} />
                    )}
                </div>

                {/* Cerrar — solo cuando terminó de escribir */}
                {fragState === 'done' && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <span style={{
                            fontSize: '10px',
                            color: '#3C3489',
                            letterSpacing: '.08em',
                        }}>
              // pista usada — sin 3ra estrella
                        </span>
                        <button
                            onClick={() => setFragState('done')}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#534AB7',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10px',
                                cursor: 'pointer',
                                letterSpacing: '.08em',
                            }}
                        >
                            [cerrar]
                        </button>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes fragBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
        </div>
    )
}

// ------------------------------------------------------------
// ÍCONO DE FRAG — cuadrado fragmentado en purple
// ------------------------------------------------------------

function FragIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="7" height="7" rx="1.5" fill="#534AB7" opacity="1" />
            <rect x="10" y="1" width="7" height="7" rx="1.5" fill="#534AB7" opacity="0.6" />
            <rect x="1" y="10" width="7" height="7" rx="1.5" fill="#534AB7" opacity="0.4" />
            <rect x="10" y="10" width="7" height="7" rx="1.5" fill="#534AB7" opacity="0.2" />
        </svg>
    )
}