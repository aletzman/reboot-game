'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { SpeedTypingState } from '@/types/game'
import { SpeedTypingLevelProps } from './types'
import { TYPING_DATA, DEFAULT_TYPING } from './constants'
import { formatTime, getTimerColor } from './utils'
import { TypingIntro } from './TypingIntro'
import { TypingDisplay } from './TypingDisplay'
import { TypingResult } from './TypingResult'

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

    const handleTimeOut = useCallback(() => {
        clearInterval(timerRef.current!)
        setPhase('result')
        setTypingState(prev => ({ ...prev, finished: true }))
        
        const completed = typingState.lines.filter(l => l.correct === true).length
        const half = Math.floor(data.lines.length / 2)
        onComplete(completed >= half ? 1 : 0, state.fragUsed)
    }, [typingState.lines, data.lines.length, state.fragUsed, onComplete])

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

            if (nextIdx >= prev.lines.length) {
                clearInterval(timerRef.current!)
                const elapsed = (Date.now() - startTime) / 1000
                const totalChars = data.lines.join('').length
                const wpm = Math.round((totalChars / 5) / (elapsed / 60))
                const timeLeft = prev.timeLeft

                setInput('')
                setPhase('result')

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

    const progress = (typingState.currentLineIndex / data.lines.length) * 100

    if (phase === 'intro') {
        return <TypingIntro level={level} data={data} onStart={handleStart} />
    }

    return (
        <div className="flex-1 flex flex-col bg-(--bg-void) p-6 gap-5 max-w-[720px] mx-auto w-full">

            {/* Header — timer y progreso */}
            <div className="flex items-center gap-6">
                {/* Timer */}
                <div 
                    className="font-mono text-[28px] font-medium min-w-[4ch] transition-colors"
                    style={{ color: getTimerColor(typingState.timeLeft, data.timeLimit) }}
                >
                    {formatTime(typingState.timeLeft)}
                </div>

                {/* Barra de progreso */}
                <div className="flex-1">
                    <div className="bg-(--bg-elevated) rounded-full h-1 overflow-hidden">
                        <div 
                            className="h-full bg-(--green-base) transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="font-mono text-[10px] text-(--text-ghost) mt-1 tracking-wider">
                        {typingState.currentLineIndex}/{data.lines.length} líneas
                    </div>
                </div>

                <div className="font-mono text-[11px] text-(--green-base) tracking-widest uppercase">
                    {level.id}
                </div>
            </div>

            <TypingDisplay typingState={typingState} />

            {/* Input oculto */}
            <input
                ref={inputRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                className="absolute opacity-0 pointer-events-none w-px h-px"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
            />

            {/* Input visible */}
            <div
                onClick={() => inputRef.current?.focus()}
                className={`bg-(--bg-elevated) border rounded-lg p-[12px_16px] font-mono text-sm cursor-text min-h-[46px] flex items-center transition-colors ${
                    typingState.lines[typingState.currentLineIndex]?.correct === false ? 'text-(--red) border-(--red)' : 'text-(--green-light) border-(--green-base)'
                }`}
            >
                {input || (
                    <span className="text-(--text-ghost) text-xs">
                        escribe aquí — presiona Enter para confirmar la línea
                    </span>
                )}
            </div>

            {/* Hint de la línea actual */}
            {typingState.currentLineIndex < data.lines.length && (
                <div className="font-mono text-[10px] text-(--text-ghost) tracking-wider">
                    línea {typingState.currentLineIndex + 1} de {data.lines.length}
                    {' — '}
                    {data.lines[typingState.currentLineIndex]?.length} caracteres
                </div>
            )}

            {phase === 'result' && <TypingResult typingState={typingState} />}
        </div>
    )
}
