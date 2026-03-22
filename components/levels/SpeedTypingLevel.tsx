// ============================================================
// REBOOT — components/levels/SpeedTypingLevel.tsx
// Nivel de speed typing: tipea el código antes de que
// se acabe el tiempo. Timer visible, feedback en tiempo real.
// ============================================================

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Level, LevelState, SpeedTypingState, TypingLine } from '@/types/game'

// ------------------------------------------------------------
// TIPOS
// ------------------------------------------------------------

interface SpeedTypingLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
}

// ------------------------------------------------------------
// DATOS DE NIVELES — líneas a tipear y tiempo
// ------------------------------------------------------------

interface TypingLevelData {
    lines: string[]
    timeLimit: number       // segundos
    bonusTimeFor3Stars: number  // segundos restantes para obtener 3 estrellas
}

const TYPING_DATA: Record<string, TypingLevelData> = {
    '2-06': {
        timeLimit: 60,
        bonusTimeFor3Stars: 20,
        lines: [
            'INICIO',
            '  energia = 100',
            '  SI energia > 0 entonces',
            '    MOVER(3)',
            '    ACTIVAR()',
            '  FIN SI',
            'FIN',
        ],
    },
    '4-04': {
        timeLimit: 90,
        bonusTimeFor3Stars: 30,
        lines: [
            'let energia = 100;',
            'let sector = "norte";',
            'function estabilizar(valor) {',
            '  return valor * 2;',
            '}',
            'const resultado = estabilizar(energia);',
            'console.log(resultado);',
        ],
    },
    '4-09': {
        timeLimit: 120,
        bonusTimeFor3Stars: 40,
        lines: [
            'const maquinas = ["A", "B", "C", "D"];',
            'const bunker = {',
            '  nombre: "GENESIS",',
            '  capsulas: 12,',
            '  activo: false',
            '};',
            'function activar(maquina, callback) {',
            '  maquina.activo = true;',
            '  callback(maquina);',
            '}',
            'maquinas.forEach(function(m) {',
            '  console.log("activando: " + m);',
            '});',
        ],
    },
}

const DEFAULT_TYPING: TypingLevelData = {
    timeLimit: 60,
    bonusTimeFor3Stars: 20,
    lines: [
        'INICIO',
        '  MOVER(3)',
        '  ACTIVAR()',
        'FIN',
    ],
}

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------

export default function SpeedTypingLevel({
    level,
    state,
    onComplete,
}: SpeedTypingLevelProps) {
    const data = TYPING_DATA[level.id] ?? DEFAULT_TYPING

    const [typingState, setTypingState] = useState<SpeedTypingState>({
        lines: data.lines.map(text => ({ text, typed: '', correct: null })),
        currentLineIndex: 0,
        timeLeft: data.timeLimit,
        started: false,
        finished: false,
        wpm: 0,
    })

    const [input, setInput] = useState('')
    const [phase, setPhase] = useState<'intro' | 'typing' | 'result'>('intro')
    const [startTime, setStartTime] = useState<number>(0)
    const inputRef = useRef<HTMLInputElement>(null)
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // ------------------------------------------------------------
    // TIMER
    // ------------------------------------------------------------

    useEffect(() => {
        if (phase !== 'typing') return
        timerRef.current = setInterval(() => {
            setTypingState(prev => {
                if (prev.timeLeft <= 1) {
                    clearInterval(timerRef.current!)
                    handleTimeOut()
                    return { ...prev, timeLeft: 0 }
                }
                return { ...prev, timeLeft: prev.timeLeft - 1 }
            })
        }, 1000)
        return () => clearInterval(timerRef.current!)
    }, [phase])

    // ------------------------------------------------------------
    // INICIAR
    // ------------------------------------------------------------

    function handleStart() {
        setPhase('typing')
        setStartTime(Date.now())
        setTimeout(() => inputRef.current?.focus(), 100)
    }

    // ------------------------------------------------------------
    // TIEMPO AGOTADO
    // ------------------------------------------------------------

    function handleTimeOut() {
        clearInterval(timerRef.current!)
        setPhase('result')
        setTypingState(prev => ({ ...prev, finished: true }))
        // si completó al menos la mitad → 1 estrella
        const completed = typingState.lines.filter(l => l.correct === true).length
        const half = Math.floor(data.lines.length / 2)
        if (completed >= half) {
            onComplete(1, state.fragUsed)
        } else {
            onComplete(0, state.fragUsed)
        }
    }

    // ------------------------------------------------------------
    // TIPEO
    // ------------------------------------------------------------

    const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setInput(val)

        setTypingState(prev => {
            const currentLine = prev.lines[prev.currentLineIndex]
            if (!currentLine) return prev

            const expected = currentLine.text
            const updatedLines = [...prev.lines]

            // actualizar la línea actual
            updatedLines[prev.currentLineIndex] = {
                ...currentLine,
                typed: val,
                correct: val === expected ? true : expected.startsWith(val) ? null : false,
            }

            return { ...prev, lines: updatedLines }
        })
    }, [])

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return
        e.preventDefault()

        setTypingState(prev => {
            const currentLine = prev.lines[prev.currentLineIndex]
            if (!currentLine) return prev

            const correct = input.trim() === currentLine.text.trim()
            const updatedLines = [...prev.lines]
            updatedLines[prev.currentLineIndex] = {
                ...currentLine,
                typed: input,
                correct,
            }

            const nextIdx = prev.currentLineIndex + 1

            // terminó todas las líneas
            if (nextIdx >= prev.lines.length) {
                clearInterval(timerRef.current!)
                const elapsed = (Date.now() - startTime) / 1000
                const totalChars = data.lines.join('').length
                const wpm = Math.round((totalChars / 5) / (elapsed / 60))
                const timeLeft = prev.timeLeft

                setInput('')
                setPhase('result')

                // calcular estrellas
                const allCorrect = updatedLines.every(l => l.correct === true)
                const stars = allCorrect
                    ? timeLeft >= data.bonusTimeFor3Stars ? 3 : 2
                    : 1

                setTimeout(() => onComplete(stars as 1 | 2 | 3, state.fragUsed), 600)

                return {
                    ...prev,
                    lines: updatedLines,
                    currentLineIndex: nextIdx,
                    finished: true,
                    wpm,
                }
            }

            setInput('')
            return {
                ...prev,
                lines: updatedLines,
                currentLineIndex: nextIdx,
            }
        })
    }, [input, startTime, data, onComplete, state.fragUsed])

    // ------------------------------------------------------------
    // HELPERS DE UI
    // ------------------------------------------------------------

    function getTimerColor(timeLeft: number): string {
        const ratio = timeLeft / data.timeLimit
        if (ratio > 0.5) return 'var(--green-light)'
        if (ratio > 0.25) return 'var(--amber)'
        return 'var(--red)'
    }

    function formatTime(seconds: number): string {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}s`
    }

    function getLineColor(line: TypingLine, idx: number): string {
        if (line.correct === true) return 'var(--green-light)'
        if (line.correct === false) return 'var(--red)'
        if (idx === typingState.currentLineIndex) return 'var(--text-primary)'
        if (idx < typingState.currentLineIndex) return 'var(--text-muted)'
        return 'var(--text-ghost)'
    }

    function getCharColor(char: string, charIdx: number, lineIdx: number): string {
        if (lineIdx !== typingState.currentLineIndex) return 'inherit'
        const typed = typingState.lines[lineIdx].typed
        if (charIdx >= typed.length) return 'var(--text-ghost)'
        return typed[charIdx] === char ? 'var(--green-light)' : 'var(--red)'
    }

    const progress = (typingState.currentLineIndex / data.lines.length) * 100

    // ------------------------------------------------------------
    // RENDER — intro
    // ------------------------------------------------------------

    if (phase === 'intro') {
        return (
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-void)',
                gap: '2rem',
                padding: '2rem',
            }}>
                <div style={{ textAlign: 'center', maxWidth: '480px' }}>
                    <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--green-base)',
                        letterSpacing: '.14em',
                        marginBottom: '.75rem',
                    }}>
            // {level.title}
                    </div>
                    <div style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '14px',
                        color: 'var(--text-muted)',
                        lineHeight: 1.7,
                        marginBottom: '1.5rem',
                    }}>
                        {level.description}
                    </div>

                    {/* Info del nivel */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '2rem',
                        marginBottom: '2rem',
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', color: 'var(--green-light)' }}>
                                {data.timeLimit}s
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '.1em' }}>
                                tiempo límite
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', color: 'var(--amber)' }}>
                                {data.lines.length}
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '.1em' }}>
                                líneas
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', color: 'var(--purple)' }}>
                                +{data.bonusTimeFor3Stars}s
                            </div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '.1em' }}>
                                bonus ★★★
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        style={{
                            background: 'var(--green-dark)',
                            border: '1px solid var(--green-base)',
                            borderRadius: '8px',
                            padding: '13px 48px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '13px',
                            color: 'var(--green-light)',
                            cursor: 'pointer',
                            letterSpacing: '.14em',
                            transition: 'background .2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--green-base)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'var(--green-dark)')}
                    >
                        iniciar transmisión
                    </button>
                </div>
            </div>
        )
    }

    // ------------------------------------------------------------
    // RENDER — typing
    // ------------------------------------------------------------

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-void)',
            padding: '1.5rem',
            gap: '1.25rem',
            maxWidth: '720px',
            margin: '0 auto',
            width: '100%',
        }}>

            {/* Header — timer y progreso */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {/* Timer */}
                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '28px',
                    fontWeight: 500,
                    color: getTimerColor(typingState.timeLeft),
                    minWidth: '4ch',
                    transition: 'color .5s',
                }}>
                    {formatTime(typingState.timeLeft)}
                </div>

                {/* Barra de progreso */}
                <div style={{ flex: 1 }}>
                    <div style={{
                        background: 'var(--bg-elevated)',
                        borderRadius: '99px',
                        height: '4px',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: 'var(--green-base)',
                            borderRadius: '99px',
                            transition: 'width .3s',
                        }} />
                    </div>
                    <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--text-ghost)',
                        marginTop: '4px',
                        letterSpacing: '.08em',
                    }}>
                        {typingState.currentLineIndex}/{data.lines.length} líneas
                    </div>
                </div>

                {/* Línea actual */}
                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--green-base)',
                    letterSpacing: '.1em',
                }}>
                    {level.id}
                </div>
            </div>

            {/* Código a tipear */}
            <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--bg-hover)',
                borderRadius: '8px',
                padding: '1.25rem 1.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                lineHeight: 2,
            }}>
                {typingState.lines.map((line, lineIdx) => (
                    <div
                        key={lineIdx}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            opacity: lineIdx > typingState.currentLineIndex + 2 ? 0.3 : 1,
                            transition: 'opacity .2s',
                        }}
                    >
                        {/* Número de línea */}
                        <span style={{
                            color: 'var(--text-ghost)',
                            fontSize: '11px',
                            minWidth: '1.5ch',
                            textAlign: 'right',
                            userSelect: 'none',
                        }}>
                            {lineIdx + 1}
                        </span>

                        {/* Indicador de estado */}
                        <span style={{
                            fontSize: '10px',
                            minWidth: '12px',
                            color: line.correct === true
                                ? 'var(--green-light)'
                                : line.correct === false
                                    ? 'var(--red)'
                                    : lineIdx === typingState.currentLineIndex
                                        ? 'var(--green-base)'
                                        : 'transparent',
                        }}>
                            {line.correct === true ? '✓' : line.correct === false ? '✗' : lineIdx === typingState.currentLineIndex ? '▶' : ''}
                        </span>

                        {/* Texto con coloreado por carácter */}
                        <span style={{ color: getLineColor(line, lineIdx) }}>
                            {lineIdx === typingState.currentLineIndex ? (
                                // línea activa — colorea por carácter
                                line.text.split('').map((char, charIdx) => (
                                    <span
                                        key={charIdx}
                                        style={{
                                            color: getCharColor(char, charIdx, lineIdx),
                                            transition: 'color .1s',
                                        }}
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </span>
                                ))
                            ) : (
                                line.text || '\u00A0'
                            )}
                            {/* Cursor en la línea activa */}
                            {lineIdx === typingState.currentLineIndex && (
                                <span style={{
                                    display: 'inline-block',
                                    width: '2px',
                                    height: '16px',
                                    background: 'var(--green-light)',
                                    verticalAlign: 'middle',
                                    marginLeft: '1px',
                                    animation: 'cursorBlink .8s step-end infinite',
                                }} />
                            )}
                        </span>
                    </div>
                ))}
            </div>

            {/* Input oculto */}
            <input
                ref={inputRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                style={{
                    position: 'absolute',
                    opacity: 0,
                    pointerEvents: 'none',
                    width: '1px',
                    height: '1px',
                }}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
            />

            {/* Input visible */}
            <div
                onClick={() => inputRef.current?.focus()}
                style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--green-base)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    color: typingState.lines[typingState.currentLineIndex]?.correct === false
                        ? 'var(--red)'
                        : 'var(--green-light)',
                    cursor: 'text',
                    minHeight: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'border-color .2s',
                }}
            >
                {input || (
                    <span style={{ color: 'var(--text-ghost)', fontSize: '12px' }}>
                        escribe aquí — presiona Enter para confirmar la línea
                    </span>
                )}
            </div>

            {/* Hint de la línea actual */}
            {typingState.currentLineIndex < data.lines.length && (
                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-ghost)',
                    letterSpacing: '.08em',
                }}>
                    línea {typingState.currentLineIndex + 1} de {data.lines.length}
                    {' — '}
                    {data.lines[typingState.currentLineIndex]?.length} caracteres
                </div>
            )}

            {/* Resultado */}
            {phase === 'result' && (
                <div style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--green-base)',
                    borderRadius: '8px',
                    padding: '1rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--green-light)',
                    display: 'flex',
                    gap: '2rem',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px' }}>{typingState.wpm}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '.1em' }}>WPM</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', color: 'var(--amber)' }}>{typingState.timeLeft}s</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '.1em' }}>restantes</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', color: 'var(--green-muted)' }}>
                            {typingState.lines.filter(l => l.correct === true).length}/{data.lines.length}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '.1em' }}>correctas</div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
        </div>
    )
}