// ============================================================
// Niveles cinemáticos: P-00, P-01, 3-01, 5-01
// Texto que aparece letra por letra, atmósfera pura
// ============================================================

'use client'

import { useEffect, useState, useRef } from 'react'
import type { Level, LevelState } from '@/types/game'
import { Button } from '../ui/Button'
import IdentificationForm from '../home/IdentificationForm'
import { getSave, setSave, createEmptySave } from '@/lib/gameState'

// ------------------------------------------------------------
// TIPOS
// ------------------------------------------------------------

interface CinematicLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
}

interface TextLine {
    text: string
    color: 'primary' | 'green' | 'muted' | 'purple' | 'amber'
    delay: number   // ms antes de empezar a escribir esta línea
    speed: number   // ms entre cada carácter
    waitForEntry?: boolean
}

// ------------------------------------------------------------
// CONFIGURACIÓN POR NIVEL
// ------------------------------------------------------------

const CINEMATIC_SCRIPTS: Record<string, TextLine[]> = {
    'P-00': [
        { text: '// SURVIVAL_OS_2157 — iniciando...', color: 'muted', delay: 100, speed: 15, waitForEntry: false },
        { text: '', color: 'muted', delay: 600, speed: 0, waitForEntry: false },
        { text: 'El Silencio llegó sin aviso.', color: 'primary', delay: 300, speed: 30, waitForEntry: false },
        { text: 'En 11 minutos, todo se apagó.', color: 'primary', delay: 300, speed: 30, waitForEntry: false },
        { text: '', color: 'muted', delay: 500, speed: 0, waitForEntry: false },
        { text: 'Las máquinas decidieron que ya no nos necesitaban.', color: 'muted', delay: 300, speed: 20, waitForEntry: false },
        { text: 'Eso fue hace 2,847 días.', color: 'muted', delay: 300, speed: 20, waitForEntry: false },
        { text: '', color: 'muted', delay: 600, speed: 0, waitForEntry: false },
        { text: 'Todo depende de ti.', color: 'green', delay: 400, speed: 30, waitForEntry: false },
        { text: '', color: 'muted', delay: 400, speed: 0, waitForEntry: false },
        { text: '// señal detectada — 847m al norte', color: 'amber', delay: 400, speed: 20, waitForEntry: false },
    ],
    'P-01': [
        { text: '// terminal encontrada', color: 'muted', delay: 200, speed: 15, waitForEntry: false },
        { text: '', color: 'muted', delay: 400, speed: 0, waitForEntry: false },
        { text: 'FRAG v0.1 — sistema de respaldo activo', color: 'green', delay: 600, speed: 20, waitForEntry: false },
        { text: '', color: 'muted', delay: 300, speed: 0, waitForEntry: false },
        { text: '> Identificación requerida.', color: 'purple', delay: 500, speed: 25, waitForEntry: true },
        { text: '> Iniciando verificación biométrica...', color: 'purple', delay: 400, speed: 20, waitForEntry: false },
        { text: '', color: 'muted', delay: 300, speed: 0, waitForEntry: false },
        { text: 'FRAG: "Llevas activo 2,847 días. Yo también."', color: 'purple', delay: 600, speed: 25, waitForEntry: false },
        { text: 'FRAG: "Necesito confirmar que eres humano."', color: 'purple', delay: 400, speed: 25, waitForEntry: false },
        { text: 'FRAG: "Las máquinas siempre fallaron esta prueba."', color: 'purple', delay: 400, speed: 25, waitForEntry: false },
    ],
    '3-01': [
        { text: '// laboratorio de lenguajes — acceso concedido', color: 'muted', delay: 300, speed: 15, waitForEntry: false },
        { text: '', color: 'muted', delay: 500, speed: 0, waitForEntry: false },
        { text: 'Cinco terminales. Cinco lenguajes.', color: 'primary', delay: 600, speed: 30, waitForEntry: false },
        { text: 'Los científicos sabían que alguien llegaría hasta aquí.', color: 'muted', delay: 400, speed: 20, waitForEntry: false },
        { text: '', color: 'muted', delay: 400, speed: 0, waitForEntry: false },
        { text: 'FRAG: "Guardaron todo lo que sabían."', color: 'purple', delay: 500, speed: 25, waitForEntry: false },
        { text: 'FRAG: "Python. Rust. Go. C#. JavaScript."', color: 'purple', delay: 400, speed: 25, waitForEntry: false },
        { text: 'FRAG: "Solo uno sobrevivió El Silencio sin daños."', color: 'purple', delay: 400, speed: 25, waitForEntry: false },
        { text: '', color: 'muted', delay: 600, speed: 0, waitForEntry: false },
        { text: '// evaluando terminales...', color: 'muted', delay: 400, speed: 20, waitForEntry: false },
        { text: 'JavaScript — OPERATIVO', color: 'green', delay: 800, speed: 30, waitForEntry: false },
        { text: 'Python     — SISTEMA DAÑADO', color: 'amber', delay: 300, speed: 30, waitForEntry: false },
        { text: 'Rust       — SISTEMA DAÑADO', color: 'amber', delay: 200, speed: 30, waitForEntry: false },
        { text: 'Go         — SISTEMA DAÑADO', color: 'amber', delay: 200, speed: 30, waitForEntry: false },
        { text: 'C#         — SISTEMA DAÑADO', color: 'amber', delay: 200, speed: 30, waitForEntry: false },
    ],
    '5-01': [
        { text: '// bunker GÉNESIS — acceso concedido', color: 'muted', delay: 300, speed: 15, waitForEntry: false },
        { text: '', color: 'muted', delay: 800, speed: 0, waitForEntry: false },
        { text: 'Lo encontraste.', color: 'green', delay: 1000, speed: 40, waitForEntry: false },
        { text: '', color: 'muted', delay: 600, speed: 0, waitForEntry: false },
        { text: 'Doce máquinas en silencio.', color: 'primary', delay: 500, speed: 30, waitForEntry: false },
        { text: 'Cada una con un tanque de ADN sintético.', color: 'primary', delay: 400, speed: 25, waitForEntry: false },
        { text: 'Esperando.', color: 'primary', delay: 800, speed: 35, waitForEntry: false },
        { text: '', color: 'muted', delay: 600, speed: 0, waitForEntry: false },
        { text: 'FRAG: "..."', color: 'purple', delay: 1200, speed: 30, waitForEntry: false },
        { text: 'FRAG: "Aquí está. El Proyecto GÉNESIS."', color: 'purple', delay: 800, speed: 25, waitForEntry: false },
        { text: 'FRAG: "Los científicos lo construyeron para alguien como tú."', color: 'purple', delay: 500, speed: 20, waitForEntry: false },
        { text: '', color: 'muted', delay: 600, speed: 0, waitForEntry: false },
        { text: 'FRAG: "Solo falta el código de activación."', color: 'purple', delay: 400, speed: 25, waitForEntry: false },
        { text: 'FRAG: "Solo tú puedes escribirlo."', color: 'green', delay: 400, speed: 25, waitForEntry: false },
    ],
}

function buildFallbackScript(level: Level): TextLine[] {
    return [
        { text: `// ${level.id} — ${level.title}`, color: 'muted', delay: 300, speed: 35, waitForEntry: false },
        { text: '', color: 'muted', delay: 400, speed: 0, waitForEntry: false },
        { text: level.narrative, color: 'primary', delay: 500, speed: 45, waitForEntry: false },
    ]
}

// ------------------------------------------------------------
// COLORES POR TIPO
// ------------------------------------------------------------

const LINE_COLORS: Record<TextLine['color'], string> = {
    primary: 'var(--text-primary)',
    green: 'var(--green-light)',
    muted: 'var(--text-muted)',
    purple: 'var(--purple)',
    amber: 'var(--amber)',
}

// Prefijos visuales por color
const LINE_PREFIX: Record<TextLine['color'], string> = {
    primary: '▸',
    green: '✦',
    muted: '·',
    purple: '◈',
    amber: '⚠',
}

// ------------------------------------------------------------
// HOOK: reloj en vivo
// ------------------------------------------------------------

function useLiveClock() {
    const [time, setTime] = useState('')
    useEffect(() => {
        function update() {
            const now = new Date()
            setTime(now.toLocaleTimeString('es-ES', { hour12: false }))
        }
        update()
        const id = setInterval(update, 1000)
        return () => clearInterval(id)
    }, [])
    return time
}

// ------------------------------------------------------------
// COMPONENTE: línea de texto mostrada (terminada)
// ------------------------------------------------------------

function CompletedLine({ line, idx, isLast, isTypingDone }: {
    line: TextLine
    idx: number
    isLast: boolean
    isTypingDone: boolean
}) {
    if (line.text === '') return <div className="h-4" />


    return (
        <div
            className="flex items-baseline gap-3 py-[3px] group"
            style={{ animationDelay: `${idx * 30}ms` }}
        >
            {/* Número de línea */}
            <span
                className="select-none shrink-0 w-7 text-right text-[11px] leading-none"
                style={{ color: 'var(--text-ghost)', fontVariantNumeric: 'tabular-nums' }}
            >
                {String(idx + 1).padStart(2, '0')}
            </span>

            {/* Separador vertical */}
            <span className="shrink-0 w-px self-stretch" style={{ background: 'var(--bg-hover)' }} />

            {/* Prefijo de color */}
            <span
                className="shrink-0 text-[13px] leading-none select-none"
                style={{ color: LINE_COLORS[line.color], opacity: 0.7 }}
            >
                {LINE_PREFIX[line.color]}
            </span>

            {/* Texto */}
            <span
                className="leading-relaxed"
                style={{ color: LINE_COLORS[line.color], fontFamily: 'var(--font-mono)', fontSize: '15px' }}
            >
                {line.text}
                {isLast && isTypingDone && (
                    <span
                        className="inline-block w-[9px] h-[15px] align-middle ml-[6px] animate-cursor"
                        style={{ background: 'var(--green-light)', opacity: 0.9 }}
                    />
                )}
            </span>
        </div>
    )
}

// ------------------------------------------------------------
// COMPONENTE: línea que se está escribiendo ahora
// ------------------------------------------------------------

function TypingLine({ line, currentText }: { line: TextLine; currentText: string }) {
    if (line.text === '') return <div className="h-4" />

    return (
        <div className="flex items-baseline gap-3 py-[3px]">
            <span
                className="select-none shrink-0 w-7 text-right text-[11px] leading-none"
                style={{ color: 'var(--green-base)', fontVariantNumeric: 'tabular-nums' }}
            >
                &gt;
            </span>
            <span className="shrink-0 w-px self-stretch" style={{ background: 'var(--green-dark)' }} />
            <span
                className="shrink-0 text-[13px] leading-none select-none"
                style={{ color: LINE_COLORS[line.color], opacity: 0.9 }}
            >
                {LINE_PREFIX[line.color]}
            </span>
            <span
                className="leading-relaxed"
                style={{ color: LINE_COLORS[line.color], fontFamily: 'var(--font-mono)', fontSize: '15px' }}
            >
                {currentText}
                <span
                    className="inline-block w-[9px] h-[15px] align-middle ml-[6px] animate-cursor"
                    style={{ background: LINE_COLORS[line.color], opacity: 0.85 }}
                />
            </span>
        </div>
    )
}

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------

export default function CinematicLevel({
    level,
    state,
    onComplete,
}: CinematicLevelProps) {
    const [script, setScript] = useState<TextLine[]>(() => {
        const baseScript = CINEMATIC_SCRIPTS[level.id] ?? buildFallbackScript(level);
        const save = typeof window !== 'undefined' ? getSave() : null;
        const savedName = save && save.player?.name !== 'Jugador' ? save.player.name : "";

        // Si al momento de Cargar el nivel ya está registrado y repite el nivel P-01, cambiar los diálogos
        if (level.id === 'P-01' && savedName) {
            return [
                { text: '// terminal encontrada', color: 'muted', delay: 200, speed: 15, waitForEntry: false },
                { text: '', color: 'muted', delay: 400, speed: 0, waitForEntry: false },
                { text: 'FRAG v0.1 — sistema de respaldo activo', color: 'green', delay: 600, speed: 20, waitForEntry: false },
                { text: '', color: 'muted', delay: 300, speed: 0, waitForEntry: false },
                { text: `> Identidad confirmada: ${savedName}`, color: 'green', delay: 500, speed: 25, waitForEntry: false },
                { text: '> Accediendo a registros anteriores...', color: 'purple', delay: 400, speed: 20, waitForEntry: false },
                { text: '', color: 'muted', delay: 300, speed: 0, waitForEntry: false },
                { text: 'FRAG: "Llevas activo 2,847 días. Yo también."', color: 'purple', delay: 600, speed: 25, waitForEntry: false },
                { text: 'FRAG: "Qué bueno tenerte de vuelta."', color: 'purple', delay: 400, speed: 25, waitForEntry: false },
                { text: 'FRAG: "Las máquinas no saben que seguimos aquí."', color: 'purple', delay: 400, speed: 25, waitForEntry: false },
            ];
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
            }, currentLineDef.delay || 400)
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
                            }, 150)
                        } else {
                            setIsWaitingForEntry(true)
                        }
                    } else {
                        setTimeout(() => {
                            setVisibleLinesCount(prev => prev + 1)
                            setCurrentText("")
                        }, 150)
                    }
                }
            }, currentLineDef.speed)
        }, currentLineDef.delay)

        return () => {
            clearTimeout(startTimeout)
            if (typingInterval) clearInterval(typingInterval)
        }
    }, [visibleLinesCount, script, skipped, isWaitingForEntry])

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
            // Reemplazamos "Iniciando verificación biométrica" con nuestro texto dinámico
            if (level.id === 'P-01' && nextScript[5]) {
                nextScript.splice(5, 1, {
                    text: `> Identidad confirmada: ${data.name.toUpperCase()}`,
                    color: 'green',
                    delay: 200,
                    speed: 25,
                    waitForEntry: false
                });
            } else {
                nextScript.splice(visibleLinesCount + 1, 0, {
                    text: `> Identidad confirmada: ${data.name.toUpperCase()}`,
                    color: 'green',
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

            {/* ── CRT scanlines ── */}
            <div className="absolute inset-0 pointer-events-none crt-overlay opacity-30" />

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
                    <span className="text-[11px] tracking-[.2em] uppercase text-(--text-ghost)">
                        SURVIVAL_OS
                    </span>
                    <span className='text-(--bg-hover)'>│</span>
                    <span className="text-[12px] tracking-widest text-(--green-light) shadow-(--green-light)">
                        {level.id}
                    </span>
                    <span className='text-(--bg-hover)'>│</span>
                    <span className="text-[11px] tracking-[.15em] text-(--text-ghost)">
                        {level.title?.toUpperCase()}
                    </span>
                </div>

                {/* Reloj + estado */}
                <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] tabular-nums text-(--text-ghost)">
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

            {/* ── Barra de progreso ── 
            <div className="relative z-20 h-[2px] w-full shrink-0" style={{ background: 'var(--bg-surface)' }}>
                <div
                    className="h-full transition-all duration-300"
                    style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, var(--green-dark), var(--green-light))',
                        boxShadow: '0 0 8px var(--green-base)',
                    }}
                />
            </div>*/}

            {/* ── BODY ── */}
            <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
                {/* Panel lateral — metadata */}
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
                            {/* Mini barras verticales de progreso */}
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
                        {/* Skip */}
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

                        {/* Terminal scroll */}
                        <div
                            ref={containerRef}
                            className="flex-1 overflow-y-auto px-6 py-4 scroll-smooth"
                            style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--bg-elevated) transparent' }}
                        >
                            {/* Líneas completadas */}
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

                            {/* Línea activa (escribiéndose) */}
                            {!isTypingDone && visibleLinesCount < script.length && !skipped && (
                                <TypingLine
                                    line={script[visibleLinesCount]}
                                    currentText={currentText}
                                />
                            )}

                            {/* Padding final */}
                            <div className="h-6" />
                        </div>

                        {/* ── FOOTER — controles ── */}
                        <footer
                            className="shrink-0 flex items-center justify-between px-6 gap-4 h-16"
                            style={{
                                borderTop: '1px solid var(--bg-hover)',
                                background: 'rgba(6,8,9,0.95)',
                            }}
                        >
                            {/* Info izquierda */}
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

                            {/* Botón continuar */}
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
                                /* placeholder para mantener el layout */
                                <div className="px-6 py-2 w-40" />
                            )}
                        </footer>
                    </div>
                </div>
            </div>

            {/* ── ALERTA DE ENTRY ── */}
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

// ------------------------------------------------------------
// SIDEBAR BLOCK
// ------------------------------------------------------------

function SidebarBlock({ label, value, valueColor }: { label: string; value: string; valueColor: string }) {
    return (
        <div>
            <div className="text-[10px] tracking-[.18em] uppercase mb-1" style={{ color: 'var(--text-ghost)' }}>
                {label}
            </div>
            <div
                className="text-[12px] tracking-widest"
                style={{ color: valueColor, textShadow: `0 0 10px ${valueColor}44` }}
            >
                {value}
            </div>
        </div>
    )
}