'use client'

import { LanguageOption } from './types'

interface InfoPanelProps {
    hovered: LanguageOption | undefined
    selectedLang: LanguageOption | undefined
    confirmed: boolean
    onConfirm: () => void
}

export default function InfoPanel({
    hovered,
    selectedLang,
    confirmed,
    onConfirm
}: InfoPanelProps) {
    const displayLang = hovered ?? selectedLang

    return (
        <div style={{
            background: 'var(--bg-surface)',
            border: `1px solid ${selectedLang ? 'var(--green-base)' : 'var(--bg-hover)'}`,
            borderRadius: '10px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            minHeight: '100px',
            transition: 'border-color .2s',
        }}>
            {displayLang ? (
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
                            color: displayLang.status === 'active'
                                ? 'var(--green-light)'
                                : 'var(--text-ghost)',
                        }}>
                            {displayLang.name}
                        </div>
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            color: displayLang.status === 'active'
                                ? 'var(--green-base)'
                                : 'var(--red)',
                            letterSpacing: '.1em',
                        }}>
                            {displayLang.status === 'active' ? 'OPERATIVO' : 'NO DISPONIBLE'}
                        </div>
                    </div>
                    <div style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '13px',
                        color: 'var(--text-muted)',
                        lineHeight: 1.6,
                    }}>
                        {displayLang.description}
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
            {selectedLang && !confirmed && (
                <button
                    onClick={onConfirm}
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
    )
}
