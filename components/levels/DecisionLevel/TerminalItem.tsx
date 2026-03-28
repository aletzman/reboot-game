'use client'

import { LanguageOption } from './types'

interface TerminalItemProps {
    lang: LanguageOption
    isSelected: boolean
    isConfirmed: boolean
    onSelect: (id: string) => void
    onMouseEnter: (id: string) => void
    onMouseLeave: () => void
    disabled: boolean
}

export default function TerminalItem({
    lang,
    isSelected,
    isConfirmed,
    onSelect,
    onMouseEnter,
    onMouseLeave,
    disabled
}: TerminalItemProps) {
    const isActive = lang.status === 'active'
    const actuallyConfirmed = isConfirmed && isSelected

    return (
        <div
            onClick={() => onSelect(lang.id)}
            onMouseEnter={() => onMouseEnter(lang.id)}
            onMouseLeave={onMouseLeave}
            style={{
                background: actuallyConfirmed
                    ? 'var(--green-darkest)'
                    : isSelected
                        ? '#0d1f00'
                        : 'var(--bg-surface)',
                border: `${isSelected ? '2px' : '1px'} solid ${actuallyConfirmed ? 'var(--green-light)'
                    : isSelected ? 'var(--green-base)'
                        : isActive ? 'var(--green-dark)'
                            : 'var(--bg-hover)'
                    }`,
                borderRadius: '10px',
                padding: '1.25rem 1rem',
                cursor: isActive && !disabled ? 'pointer' : 'default',
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
            {actuallyConfirmed && (
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
}
