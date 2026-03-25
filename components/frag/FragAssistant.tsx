'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { Terminal, X, Zap, ArrowRight, Activity, ShieldAlert, Cpu } from 'lucide-react'
import dialogues from '@/data/dialogues.json'

// ------------------------------------------------------------
// TIPOS
// ------------------------------------------------------------

interface FragAssistantProps {
    hint: string
    onUse: () => void
    feedback?: 'success' | 'error' | null
}

type FragState = 'idle' | 'confirming' | 'speaking' | 'done' | 'analyzing' | 'reacting'

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------

export default function FragAssistant({ hint, onUse, feedback }: FragAssistantProps) {
    const [fragState, setFragState] = useState<FragState>('idle')
    const [displayedText, setDisplayedText] = useState('')
    const [reactionText, setReactionText] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)
    
    // Memorizar diálogos para evitar cambios en rerenders
    const fragDialogues = dialogues.frag
    const { identity } = fragDialogues

    const randomIntro = useMemo(() => 
        fragDialogues.intros[Math.floor(Math.random() * fragDialogues.intros.length)], []
    )
    const randomConfirmation = useMemo(() => 
        fragDialogues.confirmations[Math.floor(Math.random() * fragDialogues.confirmations.length)], []
    )

    // Reaccionar al feedback externo (éxito/fallo del nivel)
    useEffect(() => {
        if (!feedback) return
        
        const pool = feedback === 'success' ? fragDialogues.success_reactions : fragDialogues.fail_reactions
        const text = pool[Math.floor(Math.random() * pool.length)]
        
        setReactionText(text)
        setFragState('reacting')
        
        // Auto-archivar después de unos segundos
        const timer = setTimeout(() => {
            setFragState('idle')
        }, 5000)
        
        return () => clearTimeout(timer)
    }, [feedback])

    // typewriter del hint o reacción
    useEffect(() => {
        if (fragState !== 'speaking' && fragState !== 'reacting') return
        
        setDisplayedText('')
        let i = 0
        const fullText = fragState === 'reacting' ? reactionText : hint
        
        const interval = setInterval(() => {
            i++
            setDisplayedText(fullText.slice(0, i))
            if (i >= fullText.length) {
                clearInterval(interval)
                if (fragState === 'speaking') {
                    setTimeout(() => setFragState('done'), 800)
                }
            }
        }, 35)
        return () => clearInterval(interval)
    }, [fragState, hint, reactionText])

    function handleRequestFrag() {
        setFragState('confirming')
    }

    function handleConfirm() {
        setFragState('analyzing')
        // Simular análisis táctico antes de dar la pista
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
                // No cerrar si está analizando (para evitar romper la animación táctica si es muy rápida)
                // O permitir cerrar igual para mayor libertad del usuario
                setFragState('idle')
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [fragState])

    // common position styles
    const containerClasses = "fixed bottom-6 right-6 z-[100] transition-all duration-300 ease-in-out"

    // ------------------------------------------------------------
    // RENDER — idle: botón flotante premium
    // ------------------------------------------------------------

    if (fragState === 'idle') {
        return (
            <div className={containerClasses} ref={containerRef}>
                <button
                    onClick={handleRequestFrag}
                    className="group relative flex items-center gap-2.5 bg-(--bg-elevated)/80 backdrop-blur-md border border-(--purple)/30 hover:border-(--purple) rounded-full px-5 py-2.5 font-mono text-[11px] text-(--purple) tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(127,119,221,0.15)] hover:shadow-[0_0_25px_rgba(127,119,221,0.3)]"
                >
                    <div className="absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-transparent via-(--purple) to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Zap size={14} className="text-(--purple) animate-pulse" />
                    <span className="opacity-80 group-hover:opacity-100 italic font-medium">FRAG</span>
                </button>
            </div>
        )
    }

    // ------------------------------------------------------------
    // RENDER — confirming: aviso táctico
    // ------------------------------------------------------------

    if (fragState === 'confirming') {
        return (
            <div className={containerClasses} ref={containerRef}>
                <div className="w-[320px] bg-(--bg-deep)/90 backdrop-blur-xl border border-(--purple)/40 rounded-xl p-5 shadow-[0_10px_40px_-10px_rgba(1,1,1,0.5)] flex flex-col gap-4 overflow-hidden relative">
                    {/* Scanner line animation */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
                        <div className="w-full h-px bg-(--purple) shadow-[0_0_8px_var(--purple)] animate-[scan_3s_linear_infinite]" />
                    </div>

                    <div className="flex items-center justify-between border-b border-(--purple)/20 pb-2">
                        <div className="flex items-center gap-2 text-(--purple)">
                            <ShieldAlert size={14} />
                            <span className="font-mono text-[10px] font-bold tracking-[0.15em]">PROTOCOLO: ASISTENCIA</span>
                        </div>
                        <button onClick={handleCancel} className="text-(--text-ghost) hover:text-(--red) transition-colors">
                            <X size={14} />
                        </button>
                    </div>

                    <div className="space-y-3 relative">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-mono text-[8px] text-(--purple) opacity-50 uppercase tracking-widest">{identity.designation}</span>
                            <span className="font-mono text-[8px] text-(--purple) opacity-50 uppercase tracking-widest">INT_MEMORIA: {identity.memory_integrity}</span>
                        </div>
                        <p className="font-mono text-[10px] text-(--purple) opacity-90 leading-tight border-l-2 border-(--purple)/30 pl-3">
                            {randomIntro}
                        </p>
                        <p className="font-sans text-[12px] text-(--text-primary) leading-relaxed bg-(--purple)/5 p-3 rounded-lg border border-(--purple)/20 shadow-inner">
                           {randomConfirmation}
                        </p>
                        <div className="flex items-center gap-2 px-1">
                             <div className="w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-(--red)/50 w-[95%]" />
                             </div>
                             <p className="font-mono text-[9px] text-(--red) opacity-70 italic whitespace-nowrap">
                                // ALERTA: DEGRADACIÓN DE ESTRELLAS
                            </p>
                        </div>
                    </div>

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
            </div>
        )
    }

    // ------------------------------------------------------------
    // RENDER — analyzing: pantalla de carga táctica
    // ------------------------------------------------------------

    if (fragState === 'analyzing') {
        return (
            <div className={containerClasses} ref={containerRef}>
                <div className="w-[340px] bg-(--bg-deep)/95 backdrop-blur-xl border border-(--purple)/50 rounded-lg p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center gap-4 text-center">
                    <div className="relative">
                        <Cpu size={32} className="text-(--purple) animate-pulse" />
                        <div className="absolute inset-0 bg-(--purple)/20 blur-xl rounded-full animate-ping" />
                    </div>
                    <div className="font-mono text-[10px] text-(--purple) tracking-[0.2em] uppercase font-bold">
                        Calculando vectores de solución...
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-(--purple) animate-[load_1.5s_ease-in-out_infinite]" />
                    </div>
                    <p className="font-mono text-[9px] text-(--text-ghost) opacity-60">
                        Inyectando fragmentos lógicos en el bus de datos...
                    </p>
                </div>
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes load {
                        0% { width: 0%; transform: translateX(-100%); }
                        50% { width: 70%; transform: translateX(20%); }
                        100% { width: 100%; transform: translateX(110%); }
                    }
                `}} />
            </div>
        )
    }

    // ------------------------------------------------------------
    // RENDER — speaking / done: panel de terminal FRAG
    // ------------------------------------------------------------

    return (
        <div className={containerClasses} ref={containerRef}>
            <div className="w-[360px] bg-(--bg-deep)/95 backdrop-blur-xl border border-(--purple)/50 rounded-lg p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-3 relative group">
                {/* Header dinámico */}
                <div className="flex items-center justify-between border-b border-(--purple)/30 pb-2">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Activity size={14} className="text-(--purple) animate-pulse" />
                            <div className="absolute inset-0 bg-(--purple)/30 blur-sm rounded-full animate-pulse" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-mono text-[10px] text-(--purple) font-bold tracking-widest uppercase">{identity.nickname}_LINK v0.1 ALPHA</span>
                            <span className="font-mono text-[7px] text-(--purple)/60 tracking-[0.2em]">{identity.status}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-(--purple)/10 border border-(--purple)/20">
                        <div className="w-1.5 h-1.5 bg-(--purple) rounded-full animate-ping" />
                        <span className="font-mono text-[9px] text-(--purple) opacity-80 uppercase">DECODIFICANDO</span>
                    </div>
                </div>

                {/* Tactical Analysis Overlay (Visual only) */}
                <div className="h-12 w-full bg-black/40 rounded border border-white/5 flex gap-1 p-1 items-end overflow-hidden opacity-30 group-hover:opacity-60 transition-opacity">
                    {Array.from({ length: 24 }).map((_, idx) => (
                        <div 
                            key={idx} 
                            className="bg-(--purple)/40 w-full"
                            style={{ 
                                height: `${Math.random() * 100}%`,
                                animation: `analysisPulse ${1 + Math.random()}s infinite alternate`
                            }}
                        />
                    ))}
                </div>

                {/* Transcripción de mensaje */}
                <div className="min-h-[80px] relative">
                    <div className="absolute -left-1 top-0 h-full w-[2px] bg-linear-to-b from-(--purple) via-(--purple)/40 to-transparent" />
                    <div className="pl-3 py-1 font-mono text-[11px] leading-relaxed text-(--purple) text-justify">
                        <span className="opacity-40 italic mr-1">[{">"}] ADYACENCIA_LÓGICA:</span>
                        {displayedText}
                        {fragState === 'speaking' && (
                            <span className="inline-block w-2 h-3.5 bg-(--purple) ml-1 animate-[blink_1s_step-end_infinite]" />
                        )}
                    </div>
                </div>

                {/* Footer contextual */}
                <div className="flex items-center justify-between border-t border-(--purple)/10 pt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2">
                        <span className="text-[8px] font-mono text-(--text-ghost) uppercase tracking-tighter">PROTOCOLO_ASISTENCIA_F34</span>
                    </div>
                    
                    {fragState === 'done' && (
                        <button
                            onClick={() => setFragState('idle')}
                            className="flex items-center gap-1.5 font-mono text-[9px] text-(--purple) hover:text-(--purple) transition-colors font-bold tracking-widest uppercase cursor-pointer group/close"
                        >
                            Archivar Datos
                            <ArrowRight size={10} className="group-hover/close:translate-x-0.5 transition-transform" />
                        </button>
                    )}
                </div>

                {/* Efectos de estilo extras */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes scan {
                        0% { transform: translateY(-100%); opacity: 0; }
                        50% { opacity: 0.5; }
                        100% { transform: translateY(300%); opacity: 0; }
                    }
                    @keyframes blink {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0; }
                    }
                    @keyframes analysisPulse {
                        from { opacity: 0.2; transform: scaleY(0.8); }
                        to { opacity: 1; transform: scaleY(1); }
                    }
                `}} />
            </div>
        </div>
    )
}