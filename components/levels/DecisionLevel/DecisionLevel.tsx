'use client'

import { useState } from 'react'
import type { DecisionLevelProps } from './types'
import { LANGUAGES } from './constants'
import TerminalItem from './TerminalItem'
import InfoPanel from './InfoPanel'

export default function DecisionLevel({
    level,
    state,
    onComplete,
    onFragUse,
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
                    {LANGUAGES.map(lang => (
                        <TerminalItem
                            key={lang.id}
                            lang={lang}
                            isSelected={selected === lang.id}
                            isConfirmed={confirmed}
                            onSelect={handleSelect}
                            onMouseEnter={setHoveredId}
                            onMouseLeave={() => setHoveredId(null)}
                            disabled={confirmed}
                        />
                    ))}
                </div>

                {/* Panel inferior */}
                <InfoPanel
                    hovered={hovered}
                    selectedLang={selectedLang}
                    confirmed={confirmed}
                    onConfirm={handleConfirm}
                />
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
