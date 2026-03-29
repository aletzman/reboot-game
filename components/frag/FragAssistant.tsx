'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { X, Activity, ShieldAlert, Cpu, ArrowRight } from 'lucide-react'
import { getDialogues } from '@/services/dialoguesService'

// ------------------------------------------------------------
// TIPOS
// ------------------------------------------------------------

interface FragAssistantProps {
    hint: string
    onUse: () => void
    feedback?: 'success' | 'error' | null
    autoOpen?: boolean
}

type FragState = 'idle' | 'confirming' | 'speaking' | 'done' | 'analyzing' | 'reacting'

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------

export default function FragAssistant({ hint, onUse, feedback, autoOpen = false }: FragAssistantProps) {
    const [fragState, setFragState] = useState<FragState>(autoOpen ? 'analyzing' : 'idle')
    const [isDismissed, setIsDismissed] = useState(false)
    const [displayedText, setDisplayedText] = useState('')
    const [reactionText, setReactionText] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)

    const [fragDialogues, setFragDialogues] = useState<any>(null)

    useEffect(() => {
        getDialogues().then(data => setFragDialogues(data.frag)).catch(console.error)
    }, [])

    const randomIntro = useMemo(() =>
        fragDialogues ? fragDialogues.intros[Math.floor(Math.random() * fragDialogues.intros.length)] : '', [fragDialogues]
    )
    const randomConfirmation = useMemo(() =>
        fragDialogues ? fragDialogues.confirmations[Math.floor(Math.random() * fragDialogues.confirmations.length)] : '', [fragDialogues]
    )

    // Typewriter del hint
    useEffect(() => {
        if (fragState !== 'speaking') return

        setDisplayedText('')
        let i = 0
        const fullText = hint

        const interval = setInterval(() => {
            i += 3 // Más rápido: 3 caracteres por cada paso de 5ms
            setDisplayedText(fullText.slice(0, i))
            if (i >= fullText.length) {
                clearInterval(interval)
                setTimeout(() => setFragState('done'), 100)
            }
        }, 5)
        return () => clearInterval(interval)
    }, [fragState, hint])

    // Autodisparar si autoOpen es true
    useEffect(() => {
        if (autoOpen && fragState === 'analyzing') {
            const timer = setTimeout(() => {
                onUse()
                setFragState('speaking')
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [autoOpen, fragState])

    function handleRequestFrag() {
        setFragState('confirming')
    }

    function handleConfirm() {
        setFragState('analyzing')
        setTimeout(() => {
            onUse()
            setFragState('speaking')
        }, 1500)
    }

    function handleCancel() {
        setFragState('idle')
    }

    // Efecto para cerrar al hacer click fuera
    useEffect(() => {
        if (fragState === 'idle') return

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setFragState('idle')
                setIsDismissed(true)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [fragState])

    // common position styles
    const containerClasses = "fixed bottom-8 left-8 z-[100] transition-all duration-500 ease-out animate-fade-in animate-slide-up select-none"

    if (isDismissed) return null
    if (fragState === 'idle') return null
    if (!fragDialogues) return null

    const identity = fragDialogues.identity

    return (
        <div className={containerClasses} ref={containerRef}>
            <div className="w-[360px] bg-(--bg-deep)/95 border border-(--purple)/50 rounded-sm p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-3 relative group overflow-hidden">
                {/* Scanner line background effect */}
                <div className="absolute inset-x-0 top-0 h-px bg-(--purple)/30 shadow-[0_0_15px_var(--purple)] animate-[scan_4s_linear_infinite] pointer-events-none" />

                <div className="flex justify-between items-center bg-black/40 -m-4 mb-3 px-4 py-2 border-b border-(--purple)/30 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 flex items-center justify-center">
                            {/* Rotating status ring */}
                            <div className="absolute inset-0 border border-(--purple)/20 rounded-full animate-[spin_8s_linear_infinite]" />
                            <div className="absolute inset-[3px] border border-dashed border-(--purple)/40 rounded-full animate-[spin_12s_linear_infinite_reverse]" />

                            <div className="relative w-7 h-7 rounded-lg border border-(--purple)/50 overflow-hidden shadow-[0_0_12px_rgba(127,119,221,0.4)] bg-black/80 p-0.5 group-hover:border-(--purple) transition-colors">
                                <img
                                    src="/assets/frag_logo.png"
                                    alt="FRAG AI"
                                    className="w-full h-full object-contain animate-[glitch_5s_infinite] opacity-90 group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-linear-to-tr from-(--purple)/20 to-transparent pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="font-mono text-[7px] text-(--green-muted) tracking-[.25em] leading-none uppercase select-none opacity-60">
                                // PROTOCOLO_FRAG_OS_0.1.2.4
                            </div>
                            <div className="font-mono text-[12px] text-(--purple) font-bold uppercase tracking-widest mt-1 drop-shadow-[0_0_8px_rgba(127,119,221,0.5)]">
                                {fragState === 'analyzing' ? 'ANALIZANDO_VECTORES' : 'NÚCLEO_DE_DATOS'}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => { setFragState('idle'); setIsDismissed(true); }}
                        className="p-1.5 rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group cursor-pointer active:scale-90"
                    >
                        <X className="w-4 h-4 text-(--text-ghost) group-hover:text-(--purple) transition-colors" />
                    </button>
                </div>

                {fragState === 'confirming' ? (
                    <div className="space-y-3 relative">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-mono text-[8px] text-(--purple) opacity-50 uppercase tracking-widest">{identity.designation}</span>
                            <span className="font-mono text-[8px] text-(--purple) opacity-50 uppercase tracking-widest">INTEGRIDAD: OK</span>
                        </div>
                        <p className="font-sans text-[12px] text-(--text-primary) leading-relaxed bg-(--purple)/5 p-3 rounded-lg border border-(--purple)/20 shadow-inner">
                            ¿Solicitar asistencia táctica? El rango de completitud podría verse afectado.
                        </p>
                        <div className="flex gap-2 pt-1">
                            <button
                                onClick={handleConfirm}
                                className="flex-1 bg-(--purple)/20 border border-(--purple)/40 hover:bg-(--purple)/30 text-(--purple) py-2.5 rounded-md font-mono text-[10px] tracking-widest font-bold transition-all uppercase"
                            >
                                Proceder
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 border border-(--bg-hover) text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-hover) py-2.5 rounded-md font-mono text-[10px] transition-all uppercase"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                ) : fragState === 'analyzing' ? (
                    <div className="py-6 flex flex-col items-center gap-4">
                        <div className="relative">
                            <Cpu size={32} className="text-(--purple) animate-pulse" />
                            <div className="absolute inset-0 bg-(--purple)/20 blur-xl rounded-full animate-ping" />
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-(--purple) animate-[load_1s_ease-in-out_infinite]" />
                        </div>
                        <p className="font-mono text-[9px] text-(--text-ghost) opacity-60">Sincronizando flujos de datos...</p>
                    </div>
                ) : (
                    <div className="space-y-4 animate-fade-in">
                        {/* Tactical Visualization HUD */}
                        <div className="relative group/hud h-16 w-full rounded-md border border-white/5 bg-black/60 overflow-hidden shadow-inner p-1.5">
                            <div className="absolute inset-0 bg-linear-to-b from-transparent via-(--purple)/5 to-transparent pointer-events-none" />

                            <div className="relative h-full w-full flex gap-[2px] items-end">
                                {Array.from({ length: 48 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-(--purple)/50 transition-all duration-300 rounded-t-[1px]"
                                        style={{
                                            height: `${10 + Math.random() * 80}%`,
                                            animation: `analysisPulse 2s infinite alternate`,
                                            animationDelay: `${i * 0.04}s`,
                                            opacity: 0.3 + (Math.random() * 0.4)
                                        }}
                                    />
                                ))}
                            </div>

                            {/* HUD Overlays */}
                            <div className="absolute top-1 left-1 flex gap-1">
                                <div className="w-1 h-1 bg-(--purple)/80 animate-ping rounded-full" />
                                <span className="font-mono text-[6px] text-(--purple)/60 tracking-widest uppercase mt-0.5">SIGNAL: ACTIVE</span>
                            </div>
                            <div className="absolute bottom-1 right-1 flex flex-col items-end">
                                <span className="font-mono text-[6px] text-(--green-muted)/40 uppercase tracking-tighter italic">LATENCY: 0.04ms</span>
                                <span className="font-mono text-[6px] text-(--purple)/60 uppercase tracking-widest leading-none">SECTOR: 0x{Math.floor(Math.random() * 255).toString(16).toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="relative">
                            {/* Terminal input marker shadow */}
                            <div className="absolute -left-2 top-0 h-full w-[2px] bg-linear-to-b from-(--purple) via-(--purple)/20 to-transparent" />

                            <div className="bg-black/40 backdrop-blur-md rounded border border-white/5 p-3.5 relative overflow-hidden group/message hover:border-(--purple)/20 transition-colors duration-300">
                                <div className="absolute top-0 right-0 p-1.5 opacity-10 group-hover/message:opacity-30 transition-opacity">
                                    <Activity size={14} className="text-(--purple)" />
                                </div>

                                <p className="font-mono text-[13px] text-(--text-primary) leading-relaxed text-left font-medium selection:bg-(--purple)/30 selection:text-white">
                                    <span className="font-mono text-[9px] text-(--purple)/60 mr-2 not-italic font-bold tracking-widest opacity-50 uppercase">[FRAG]:</span>
                                    {displayedText}
                                    {(fragState === 'speaking') && (
                                        <span className="inline-block w-2 h-3.5 bg-(--purple) ml-1 animate-pulse shadow-[0_0_8px_var(--purple)]" />
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-[8px] font-mono text-(--text-ghost) opacity-30 px-1 uppercase tracking-[.25em] group-hover:opacity-60 transition-opacity duration-500">
                            <span>UID_HASH: 0x{Math.floor(Math.random() * 9999).toString(16).padStart(4, '0')}</span>
                            <div className="flex gap-2">
                                <span className="text-(--purple)/60">BUFFER_LOCK: SYNC</span>
                                <span>{new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan {
                    0% { transform: translateY(0); opacity: 0; }
                    5% { opacity: 0.3; }
                    95% { opacity: 0.3; }
                    100% { transform: translateY(240px); opacity: 0; }
                }
                @keyframes load {
                    0% { width: 0%; transform: translateX(-100%); }
                    50% { width: 40%; transform: translateX(50%); }
                    100% { width: 100%; transform: translateX(110%); }
                }
                @keyframes analysisPulse {
                    from { transform: scaleY(0.6); opacity: 0.1; }
                    to { transform: scaleY(1); opacity: 0.5; }
                }
                @keyframes glitch {
                    0%, 100% { transform: translate(0); }
                    1% { transform: translate(-1px, 2px); filter: hue-rotate(90deg); }
                    2% { transform: translate(2px, -1px); filter: contrast(150%); }
                    3% { transform: translate(0); filter: none; }
                    45% { transform: translate(0); }
                    46% { transform: translate(2px, 2px); background: rgba(127,119,221,0.1); }
                    47% { transform: translate(-2px, -2px); }
                    48% { transform: translate(0); background: transparent; }
                }
            `}} />
        </div>
    )
}