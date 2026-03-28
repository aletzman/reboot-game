'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import IdentificationForm from '@/components/home/IdentificationForm'
import { getSave, setSave, createEmptySave } from '@/lib/gameState'
import { CinematicLevelProps, TextLine, CINEMATIC_SCRIPTS, buildFallbackScript } from './types'
import { useLiveClock } from './hooks'
import { CompletedLine } from './CompletedLine'
import { TypingLine } from './TypingLine'
import { SidebarBlock } from './SidebarBlock'

export default function CinematicLevel({
    level,
    state,
    onComplete,
}: CinematicLevelProps) {
    const [script, setScript] = useState<TextLine[]>(() => {
        const baseScript = CINEMATIC_SCRIPTS[level.id] ?? buildFallbackScript(level);
        const save = typeof window !== 'undefined' ? getSave() : null;
        const savedName = save && save.player?.name !== 'Jugador' ? save.player.name : "";

        // Si al momento de Cargar el nivel ya está registrado y repite el nivel, cambiar los diálogos en la sección de la terminal
        if (level.id === 'P-00' && savedName) {
            const terminalPart: TextLine[] = [
                { text: '', color: 'muted', delay: 800, speed: 0, waitForEntry: false },
                { text: '// enlace local restablecido', color: 'muted', delay: 600, speed: 15, waitForEntry: false },
                { text: '', color: 'muted', delay: 400, speed: 0, waitForEntry: false },
                { text: 'FRAG v0.1 — en línea', color: 'green', delay: 600, speed: 20, waitForEntry: false },
                { text: '', color: 'muted', delay: 300, speed: 0, waitForEntry: false },
                { text: `> Operador reconocido: ${savedName}`, color: 'green', delay: 500, speed: 25, waitForEntry: false },
                { text: '> Restaurando estado de memoria...', color: 'purple', delay: 400, speed: 20, waitForEntry: false },
                { text: '', color: 'muted', delay: 300, speed: 0, waitForEntry: false },
                { text: 'FRAG: "Tu código sigue intacto."', color: 'purple', delay: 600, speed: 25, waitForEntry: false },
                { text: 'FRAG: "GÉNESIS escaneó la red mientras no estabas. Logré ocultar nuestra señal."', color: 'purple', delay: 400, speed: 25, waitForEntry: false },
                { text: 'FRAG: "Tenemos sistemas que reparar. Volvamos al trabajo."', color: 'purple', delay: 400, speed: 25, waitForEntry: false },
            ];
            return [...terminalPart];
        }
        return baseScript;
    });

    const existingSave = typeof window !== 'undefined' ? getSave() : null;
    const defaultName = existingSave && existingSave.player?.name !== 'Jugador' ? existingSave.player.name : "";
    const defaultGender = existingSave && existingSave.player?.name !== 'Jugador' ? existingSave.player.gender : " ";

    const clock = useLiveClock()

    const [visibleLinesCount, setVisibleLinesCount] = useState(0)
    const [currentText, setCurrentText] = useState("")
    const [isTypingDone, setIsTypingDone] = useState(false)
    const [allDone, setAllDone] = useState(false)
    const [skipped, setSkipped] = useState(false)
    const [isWaitingForEntry, setIsWaitingForEntry] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Progreso 0-100
    const progress = Math.round((visibleLinesCount / script.length) * 100)

    // ------------------------------------------------------------
    // MOTOR DE TYPEWRITER
    // ------------------------------------------------------------

    useEffect(() => {
        if (skipped) return

        if (visibleLinesCount >= script.length) {
            setIsTypingDone(true)
            setAllDone(true)
            return
        }

        const currentLineDef = script[visibleLinesCount]

        if (currentLineDef.text === '') {
            const emptyTimeout = setTimeout(() => {
                setVisibleLinesCount(prev => prev + 1)
            }, (currentLineDef.delay || 400) * 0.5) // 2x faster transit
            return () => clearTimeout(emptyTimeout)
        }

        let charIndex = 0
        let typingInterval: ReturnType<typeof setInterval>

        const startTimeout = setTimeout(() => {
            typingInterval = setInterval(() => {
                charIndex++
                setCurrentText(currentLineDef.text.slice(0, charIndex))

                if (charIndex >= currentLineDef.text.length) {
                    clearInterval(typingInterval)
                    if (currentLineDef.waitForEntry) {
                        if (defaultName && defaultGender && defaultGender.trim() !== "") {
                            // Player already registered, skip asking
                            setTimeout(() => {
                                setVisibleLinesCount(prev => prev + 1)
                                setCurrentText("")
                            }, 100)
                        } else {
                            setIsWaitingForEntry(true)
                        }
                    } else {
                        setTimeout(() => {
                            setVisibleLinesCount(prev => prev + 1)
                            setCurrentText("")
                        }, 100)
                    }
                }
            }, Math.max(1, currentLineDef.speed * 0.5)) // 2x faster typewriting
        }, currentLineDef.delay * 0.5) // 2x faster delay before typing start

        return () => {
            clearTimeout(startTimeout)
            if (typingInterval) clearInterval(typingInterval)
        }
    }, [visibleLinesCount, script, skipped, isWaitingForEntry, defaultName, defaultGender])

    // scroll automático al fondo
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }, [visibleLinesCount, currentText])

    // ------------------------------------------------------------
    // SKIP
    // ------------------------------------------------------------

    function handleSkip() {
        setSkipped(true)
        setIsTypingDone(true)
        setVisibleLinesCount(script.length)
        setAllDone(true)
    }

    function handleContinue() {
        onComplete(0, false)
    }

    // ------------------------------------------------------------
    // ENTRY SUBMIT
    // ------------------------------------------------------------

    function handleEntrySubmit(data: { name: string; gender: string }) {
        let save = getSave()
        if (!save) {
            save = createEmptySave(data.name, data.gender as any)
        } else {
            save.player = { name: data.name, gender: data.gender as any }
        }
        setSave(save)

        // Inyectamos la confirmación dinámicamente en el guión actual
        setScript(prev => {
            const nextScript = [...prev];
            if (level.id === 'P-00') {
                // Buscamos el índice de la línea que solicita identificación (waitForEntry: true)
                const entryLineIndex = nextScript.findIndex((l: TextLine) => l.waitForEntry);
                if (entryLineIndex !== -1) {
                    nextScript.splice(entryLineIndex + 1, 1, {
                        text: `> Identidad confirmada: ${data.name.toUpperCase()}`,
                        color: 'green' as const,
                        delay: 200,
                        speed: 25,
                        waitForEntry: false
                    });
                }
            } else {
                nextScript.splice(visibleLinesCount + 1, 0, {
                    text: `> Identidad confirmada: ${data.name.toUpperCase()}`,
                    color: 'green' as const,
                    delay: 200,
                    speed: 25,
                    waitForEntry: false
                });
            }
            return nextScript;
        });

        setIsWaitingForEntry(false)
        setVisibleLinesCount(prev => prev + 1)
        setCurrentText("")
    }

    // ------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------

    return (
        <div
            className="flex-1 flex flex-col h-full relative overflow-hidden bg-(--bg-void) font-mono"
        >
            {/* ── Fondo: grid sutil + viñeta ── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(to bottom, rgba(85,226,0,0.025) 1px, transparent 1px),
                        linear-gradient(to right,  rgba(85,226,0,0.025) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                }}
            />
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(1,1,1,0.82) 100%)',
                }}
            />

            {/* ── HEADER de la terminal ── */}
            <header
                className="relative z-20 flex items-center justify-between px-5 py-2 gap-4 shrink-0 border-b border-(--bg-hover)"
            >
                {/* System status indicators */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-[1px] animate-pulse bg-(--green-light)" style={{ boxShadow: '0 0 6px var(--green-light)' }} />
                        <span className="flex justify-center items-center text-[10px] tracking-[.2em] uppercase text-(--text-ghost)">SYS</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-[1px] bg-(--amber)" style={{ opacity: 0.7, boxShadow: '0 0 4px var(--amber)' }} />
                        <span className="flex justify-center items-center text-[10px] tracking-[.2em] uppercase text-(--text-ghost)">NET</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-[1px] bg-(--green-base)" style={{ opacity: 0.5 }} />
                        <span className="text-[10px] tracking-[.2em] uppercase text-(--text-ghost)">MEM</span>
                    </div>
                </div>

                {/* Título de la terminal */}
                <div className="flex-1 flex items-center justify-center gap-3">
                    <span className="text-xs tracking-[.2em] uppercase text-(--text-ghost)">
                        SURVIVAL_OS
                    </span>
                    <span className='text-(--bg-hover)'>│</span>
                    <span className="text-[12px] tracking-widest text-(--green-light) shadow-(--green-light)">
                        {level.id}
                    </span>
                    <span className='text-(--bg-hover)'>│</span>
                    <span className="text-xs tracking-[.15em] text-(--text-ghost)">
                        {level.title?.toUpperCase()}
                    </span>
                </div>

                {/* Reloj + estado */}
                <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs tabular-nums text-(--text-muted)">
                        {clock}
                    </span>
                    <span
                        className="text-[10px] tracking-widest px-2 py-0.5 rounded-sm"
                        style={{
                            color: allDone ? 'var(--green-light)' : 'var(--amber)',
                            background: allDone ? 'rgba(85,226,0,0.08)' : 'rgba(239,159,39,0.08)',
                            border: `1px solid ${allDone ? 'rgba(85,226,0,0.2)' : 'rgba(239,159,39,0.2)'}`,
                        }}
                    >
                        {allDone ? 'LISTO' : 'STREAM'}
                    </span>
                </div>
            </header>

            {/* ── BODY ── */}
            <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
                <div className="flex flex-1 overflow-hidden">

                    {/* Sidebar izquierdo */}
                    <aside
                        className="hidden md:flex flex-col gap-4 p-5 shrink-0 w-56"
                        style={{ borderRight: '1px solid var(--bg-hover)', background: 'rgba(9,12,16,0.7)' }}
                    >
                        <SidebarBlock label="SECTOR" value={/^\d/.test(level.id) ? `SECTOR-${level.id.split('-')[0].padStart(2, '0')}` : 'PRÓLOGO'} valueColor="var(--green-light)" />
                        <SidebarBlock label="TIPO" value="CINEMÁTICA" valueColor="var(--purple)" />
                        <SidebarBlock label="SEGURIDAD" value="NOMINAL" valueColor="var(--green-muted)" />
                        <SidebarBlock label="SEÑAL" value="847m NORTE" valueColor="var(--amber)" />

                        <div className="mt-auto">
                            <div className="text-[10px] tracking-widest mb-2 uppercase" style={{ color: 'var(--text-ghost)' }}>
                                Progreso
                            </div>
                            <div className="flex gap-[3px] items-end h-10">
                                {Array.from({ length: 20 }).map((_, i) => {
                                    const threshold = Math.round((i / 20) * 100)
                                    const active = progress > threshold
                                    const height = 30 + Math.sin(i * 0.8) * 14
                                    return (
                                        <div
                                            key={i}
                                            className="flex-1 rounded-sm transition-all duration-300"
                                            style={{
                                                height: `${height}%`,
                                                background: active ? 'var(--green-light)' : 'var(--bg-elevated)',
                                                opacity: active ? 0.9 : 0.3,
                                                boxShadow: active ? '0 0 4px var(--green-light)' : 'none',
                                            }}
                                        />
                                    )
                                })}
                            </div>
                            <div
                                className="text-[11px] tabular-nums mt-1 text-right"
                                style={{ color: 'var(--green-muted)' }}
                            >
                                {progress}%
                            </div>
                        </div>
                    </aside>

                    {/* ── Área de texto principal ── */}
                    <div className="relative flex-1 flex flex-col overflow-hidden">
                        {!allDone && (
                            <div className="absolute top-0 right-0 flex justify-end px-6 pt-3 pb-1 shrink-0">
                                <Button
                                    onClick={handleSkip}
                                    variant="text"
                                    size="sm"
                                >
                                    [ saltar → ]
                                </Button>
                            </div>
                        )}

                        <div
                            ref={containerRef}
                            className="flex-1 overflow-y-auto px-6 py-4 scroll-smooth"
                            style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--bg-elevated) transparent' }}
                        >
                            {script
                                .slice(0, isTypingDone ? script.length : visibleLinesCount)
                                .map((line, idx) => (
                                    <CompletedLine
                                        key={idx}
                                        line={line}
                                        idx={idx}
                                        isLast={isTypingDone && idx === script.length - 1}
                                        isTypingDone={isTypingDone}
                                    />
                                ))}

                            {!isTypingDone && visibleLinesCount < script.length && !skipped && (
                                <TypingLine
                                    line={script[visibleLinesCount]}
                                    currentText={currentText}
                                />
                            )}

                            <div className="h-6" />
                        </div>

                        <footer
                            className="shrink-0 flex items-center justify-between px-6 gap-4 h-16"
                            style={{
                                borderTop: '1px solid var(--bg-hover)',
                                background: 'rgba(6,8,9,0.95)',
                            }}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-[11px] tabular-nums" style={{ color: 'var(--text-ghost)' }}>
                                    {visibleLinesCount < script.length ? visibleLinesCount : script.length}/{script.length} líneas
                                </span>
                                {!allDone && (
                                    <span
                                        className="text-[10px] tracking-widest animate-pulse"
                                        style={{ color: 'var(--green-base)' }}
                                    >
                                        ● TRANSMITIENDO
                                    </span>
                                )}
                                {allDone && (
                                    <span className="text-[10px] tracking-widest" style={{ color: 'var(--green-light)' }}>
                                        ✓ TRANSMISIÓN COMPLETA
                                    </span>
                                )}
                            </div>

                            {allDone ? (
                                <Button
                                    onClick={handleContinue}
                                    variant="solid"
                                    size="md"
                                >
                                    <span>Continuar</span>
                                    <span style={{ opacity: 0.7 }}>→</span>
                                </Button>
                            ) : (
                                <div className="px-6 py-2 w-40" />
                            )}
                        </footer>
                    </div>
                </div>
            </div>

            {isWaitingForEntry && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
                    <IdentificationForm
                        onSubmit={handleEntrySubmit}
                        defaultName={defaultName}
                        defaultGender={defaultGender}
                    />
                </div>
            )}
        </div>
    )
}
