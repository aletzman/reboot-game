'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { SpeedTypingState } from '@/types/game'
import { SpeedTypingLevelProps } from './types'
import { TYPING_DATA, DEFAULT_TYPING } from './constants'
import { formatTime, getTimerColor } from './utils'
import { TypingIntro } from './TypingIntro'
import { TypingDisplay } from './TypingDisplay'
import { TypingResult } from './TypingResult'
import { Button } from '@/components/ui/Button'
import { RotateCcwIcon, AlertTriangle, Cpu, Globe, Activity, Zap, ShieldCheck, Database } from 'lucide-react'

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

    const handleTimeOut = useCallback(() => {
        clearInterval(timerRef.current!)
        setPhase('result')
        setTypingState(prev => ({ ...prev, finished: true }))

        // El usuario no quiere el diálogo de "Nivel Completado" si falla.
        // Nos quedamos en fase 'result' y mostramos botón de reintento local.
    }, [])

    const handleRetryLocal = useCallback(() => {
        setTypingState({
            lines: data.lines.map(text => ({ text, typed: '', correct: null })),
            currentLineIndex: 0,
            timeLeft: data.timeLimit,
            started: false,
            finished: false,
            wpm: 0,
        })
        setInput('')
        setPhase('typing')
        setTimeout(() => inputRef.current?.focus(), 100)
    }, [data.lines, data.timeLimit])

    // ------------------------------------------------------------
    // TIMER
    // ------------------------------------------------------------

    useEffect(() => {
        if (phase !== 'typing' || !typingState.started) return
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
    }, [phase, typingState.started, handleTimeOut])

    // ------------------------------------------------------------
    // INICIAR
    // ------------------------------------------------------------

    function handleStart() {
        setPhase('typing')
        // El startTime se establecerá al teclear el primer caracter
        setTimeout(() => inputRef.current?.focus(), 100)
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

            // Iniciar el cronómetro con el primer caracter
            const isFirstChar = !prev.started && val.length > 0
            if (isFirstChar) {
                setStartTime(Date.now())
            }

            const expected = currentLine.text
            const updatedLines = [...prev.lines]

            updatedLines[prev.currentLineIndex] = {
                ...currentLine,
                typed: val,
                correct: val === expected ? true : expected.startsWith(val) ? null : false,
            }

            return {
                ...prev,
                lines: updatedLines,
                started: prev.started || isFirstChar
            }
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
                    : 0

                if (stars > 0) {
                    const finalState = {
                        ...prev,
                        lines: updatedLines,
                        currentLineIndex: nextIdx,
                        finished: true,
                        wpm,
                    }
                    setTimeout(() => onComplete(
                        stars as 1 | 2 | 3,
                        state.fragUsed,
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-1000 fill-mode-both mt-2">
                            <TypingResult typingState={finalState} />
                        </div>
                    ), 600)
                }

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

    const integrity = Math.round(progress)
    const stability = 100 - (typingState.lines.filter(l => l.correct === false).length * 10)

    return (
        <div className="flex-1 flex flex-col bg-(--bg-void) p-4 md:p-6 gap-6 max-w-[1100px] mx-auto w-full relative overflow-hidden animate-fade-in-up">
            <div className="absolute top-0 left-0 w-full h-px bg-(--green-base) opacity-10 animate-scanline pointer-events-none z-10" />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 flex-1 overflow-hidden">
                {/* ÁREA PRINCIPAL DE TRANSMISIÓN */}
                <div className="flex flex-col gap-5 overflow-hidden">
                    {/* Header — compact technical summary */}
                    <div className="flex items-center gap-6 bg-(--bg-surface) border border-(--bg-hover) p-4 rounded-xs relative group overflow-hidden shrink-0">
                        <div className="absolute top-0 left-0 w-1 h-full bg-(--green-base) opacity-50 shadow-[0_0_10px_rgba(85,226,0,0.5)]" />

                        {/* Timer Panel */}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                                <Activity size={12} className="text-(--green-muted)" />
                                <span className="font-mono text-[10px] text-(--text-muted)/90 uppercase tracking-widest">link_uptime</span>
                            </div>
                            <div
                                className="font-mono text-3xl font-medium min-w-[4ch] transition-colors tabular-nums leading-none"
                                style={{ color: getTimerColor(typingState.timeLeft, data.timeLimit) }}
                            >
                                {formatTime(typingState.timeLeft)}
                            </div>
                        </div>

                        <div className="w-px h-10 bg-(--bg-hover)" />

                        {/* Main Progress Panel */}
                        <div className="flex-1">
                            <div className="flex justify-between items-end mb-2">
                                <div className="flex items-center gap-2">
                                    <Database size={12} className="text-(--green-muted)" />
                                    <span className="font-mono text-[10px] text-(--text-muted)/90 uppercase tracking-widest">packet transfer</span>
                                </div>
                                <span className="font-mono text-[10px] text-(--green-light) font-bold">
                                    {typingState.currentLineIndex}/{data.lines.length} SEGMENTOS
                                </span>
                            </div>
                            <div className="bg-(--bg-deep) border border-(--bg-hover) h-2.5 overflow-hidden relative rounded-[2px]">
                                <div
                                    className="h-full bg-(--green-base) transition-all duration-300 relative shadow-[0_0_15px_rgba(85,226,0,0.4)]"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-[sweep-glow_2s_infinite]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Display de Código */}
                    <div className="relative group flex-1 overflow-hidden flex flex-col min-h-0">
                        <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-(--green-dark) opacity-40 z-20 pointer-events-none" />
                        <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-(--green-dark) opacity-40 z-20 pointer-events-none" />

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <TypingDisplay typingState={typingState} />
                        </div>
                    </div>

                    {/* Input oculto (para que funcione el tipeo) */}
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

                    {/* Terminal Input */}
                    <div className="flex flex-col gap-2 mt-auto shrink-0">
                        <div
                            onClick={() => inputRef.current?.focus()}
                            className={`bg-(--bg-surface) border border-dashed rounded-xs p-5 font-mono text-sm cursor-text min-h-[64px] flex items-center transition-all group overflow-hidden relative ${typingState.lines[typingState.currentLineIndex]?.correct === false
                                ? 'text-(--red) border-(--red) bg-(--red)/10 shadow-[0_0_20px_rgba(226,75,74,0.15)]'
                                : 'text-(--green-light) border-(--green-dark) group-focus-within:border-(--green-base) group-hover:bg-(--bg-hover)/50'
                                }`}
                        >
                            <span className="mr-4 text-(--green-base) font-bold text-lg opacity-60">
                                {'>'}
                            </span>

                            {input ? (
                                <div className="flex-1 flex flex-wrap gap-x-0 tracking-wide text-lg font-medium">
                                    {input.split('').map((char, idx) => (
                                        <span key={idx} className={typingState.lines[typingState.currentLineIndex]?.text[idx] === char ? 'text-(--green-light)' : 'text-(--red)'}>
                                            {char === ' ' ? '\u00A0' : char}
                                        </span>
                                    ))}
                                    <span className="w-2.5 h-6 bg-(--green-light) animate-pulse inline-block ml-0.5" />
                                </div>
                            ) : (
                                <span className="text-(--text-muted)/70 text-xs italic tracking-wider flex items-center gap-2">
                                    <Zap size={14} className="animate-pulse" />
                                    esperando secuencia de entrada corporativa... [Enter para confirmar]
                                </span>
                            )}

                            {typingState.lines[typingState.currentLineIndex]?.correct === false && (
                                <div className="absolute inset-0 pointer-events-none bg-(--red)/5 animate-pulse" />
                            )}
                        </div>

                        <div className="flex justify-between items-center px-2">
                            <div className="font-mono text-[9px] text-(--text-ghost) tracking-[0.25em] uppercase flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-(--green-dark) animate-ping" />
                                st_buffer_ready
                            </div>
                            {typingState.currentLineIndex < data.lines.length && (
                                <div className="font-mono text-[9px] text-(--text-muted) flex gap-5 uppercase tracking-widest">
                                    <span className="text-(--cyan) font-bold">ptr: 0x{((typingState.currentLineIndex + 1) * 16).toString(16).toUpperCase()}</span>
                                    <span>ln: {typingState.currentLineIndex + 1}</span>
                                    <span>sz: {data.lines[typingState.currentLineIndex]?.length}b</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* SIDEBAR — HARDWARE STATUS */}
                <div className="hidden lg:flex flex-col gap-6 w-full">
                    {/* Panel de Estado General */}
                    <div className="bg-(--bg-surface) border border-(--bg-hover) p-4 rounded-xs flex flex-col gap-5 relative overflow-hidden shrink-0">
                        <div className="text-[10px] font-mono text-(--green-muted) uppercase tracking-widest border-b border-(--bg-hover) pb-2 mb-1 flex items-center gap-2">
                            <ShieldCheck size={14} />
                            diagnóstico_hw
                        </div>

                        {/* Métrica: Estabilidad del Enlace */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter">
                                <span className="text-(--text-muted)">link_integrity</span>
                                <span className={stability > 70 ? 'text-(--green-light)' : stability > 40 ? 'text-(--amber)' : 'text-(--red)'}>
                                    {stability}%
                                </span>
                            </div>
                            <div className="flex gap-1">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-3 w-full rounded-[1px] transition-colors duration-500 ${(i * 10) < stability
                                            ? stability > 70 ? 'bg-(--green-base)' : stability > 40 ? 'bg-(--amber)' : 'bg-(--red)'
                                            : 'bg-(--bg-deep)'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Métrica: Señal */}
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-mono text-(--text-muted) uppercase">signal_gain</span>
                                <div className="flex items-end gap-[2px] h-4">
                                    <div className="w-1.5 h-[20%] bg-(--green-base)" />
                                    <div className="w-1.5 h-[40%] bg-(--green-base)" />
                                    <div className="w-1.5 h-[70%] bg-(--green-base)" />
                                    <div className="w-1.5 h-[90%] bg-(--green-base) animate-pulse shadow-[0_0_5px_var(--green-base)]" />
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[9px] font-mono text-(--text-muted) uppercase block mb-1">link_enc</span>
                                <span className="text-[10px] font-mono text-(--cyan) font-bold bg-(--cyan)/10 px-1.5 py-0.5 rounded-xs tracking-tighter">RSA-4096</span>
                            </div>
                        </div>

                        {/* Métrica: CPU */}
                        <div className="flex items-start gap-3 mt-1">
                            <div className="bg-(--bg-deep) p-2 rounded-xs border border-(--bg-hover)">
                                <Cpu size={18} className="text-(--green-muted)" />
                            </div>
                            <div className="flex-1">
                                <span className="text-[8px] font-mono text-(--text-muted) uppercase block">sys_processing</span>
                                <div className="w-full bg-(--bg-deep) h-1 mt-1.5 rounded-full overflow-hidden">
                                    <div className="h-full bg-(--amber) animate-[lc-shimmer_1.5s_infinite]" style={{ width: '64%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Panel de Info del Sistema */}
                    <div className="bg-(--bg-surface) border border-(--bg-hover) p-4 rounded-xs flex flex-col gap-4 flex-1">
                        <div className="text-[10px] font-mono text-(--green-muted) uppercase tracking-widest border-b border-(--bg-hover) pb-2 flex items-center gap-2">
                            <Globe size={14} />
                            network_node
                        </div>
                        <div className="font-mono text-[10px] leading-relaxed">
                            <div className="flex justify-between text-(--text-muted)">
                                <span className="opacity-50">IPV4_ADDR:</span>
                                <span className="text-(--green-light)">172.16.8.254</span>
                            </div>
                            <div className="flex justify-between text-(--text-muted)">
                                <span className="opacity-50">SUBNET:</span>
                                <span>255.255.0.0</span>
                            </div>
                            <div className="mt-3 opacity-60 italic text-[9px] flex items-center gap-2">
                                <Activity size={10} className="animate-spin" />
                                <span>LOCATING_UPLINK...</span>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 flex flex-col items-center gap-4">
                            <div className="w-20 h-20 rounded-full border border-(--green-dark)/30 flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full border border-(--green-base) border-dashed animate-[spin_15s_linear_infinite] opacity-30" />
                                <div className="absolute inset-2 rounded-full border border-(--cyan)/20 border-dotted animate-[spin_10s_linear_reverse_infinite]" />
                                <Activity size={24} className="text-(--green-light) animate-pulse" />
                            </div>
                            <div className="text-[8px] font-mono text-(--text-ghost) text-center uppercase tracking-widest leading-normal">
                                syncing_with_cubepath<br />v0.4.2_stable
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resultado de Fallo (se muestra sobre el resto si existe) */}
            {phase === 'result' && (typingState.timeLeft === 0 || !typingState.lines.every(l => l.correct === true)) && (
                <div className="absolute inset-0 z-50 bg-(--bg-void)/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in">
                    <div className="flex flex-col gap-6 max-w-[500px] w-full animate-fade-in-up">
                        <TypingResult typingState={typingState} />

                        <div className="bg-(--bg-surface) border border-(--red)/30 p-8 rounded-sm flex flex-col items-center gap-5 relative overflow-hidden shadow-[0_0_50px_rgba(226,75,74,0.15)]">
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-(--red) opacity-70 shadow-[0_0_15px_rgba(226,75,74,0.6)]" />

                            <div className="flex items-center gap-3 text-(--red) font-bold font-mono text-lg uppercase tracking-widest">
                                <AlertTriangle size={24} />
                                transmisión fallida
                            </div>

                            <p className="font-mono text-xs text-(--text-muted) text-center leading-relaxed">
                                La integridad de la transmisión ha sido comprometida por errores de paridad
                                o el tiempo de enlace ha expirado de forma prematura.
                                Reinicie el hardware para intentar una nueva conexión.
                            </p>

                            <Button
                                onClick={handleRetryLocal}
                                variant="solid"
                                className="bg-(--red-dark) border-(--red) hover:bg-(--red) text-white! mt-2 w-full py-4 text-sm"
                                icon={RotateCcwIcon}
                            >
                                reiniciar transmisión
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
