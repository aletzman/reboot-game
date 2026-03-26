'use client'

import { Level } from '@/types/game'
import { TypingLevelData } from './types'
import { Button } from '@/components/ui/Button'
import { Terminal, Clock, Zap, Database, Cpu } from 'lucide-react'

interface TypingIntroProps {
    level: Level
    data: TypingLevelData
    onStart: () => void
}

export function TypingIntro({ level, data, onStart }: TypingIntroProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-(--bg-void) p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-(--green-base) opacity-10 animate-scanline pointer-events-none" />

            {/* Elementos decorativos de terminal */}
            <div className="absolute top-4 left-6 flex items-center gap-2 text-(--text-ghost) font-mono text-[10px] tracking-tighter">
                <Terminal size={12} className="text-(--green-base)" />
                <span>SYS_LINK: 0x44FB29</span>
                <span className="w-1 h-1 rounded-full bg-(--green-base) animate-pulse ml-2" />
                <span className="text-(--green-base) animate-pulse">UPLINK_READY</span>
            </div>

            <div className="absolute bottom-4 right-6 text-right font-mono text-[10px] text-(--text-ghost) tracking-tighter uppercase">
                <div>sector_{level.id?.split('-')[0] || '01'}</div>
                <div>buffer_overflow_risk: [LOW]</div>
            </div>

            <div className="max-w-[560px] w-full animate-fade-in-up">
                {/* Panel de cabecera */}
                <div className="relative mb-8 text-center">
                    <div className="inline-block px-4 py-1 bg-(--green-darkest) border-x border-(--green-dark) text-(--green-base) font-mono text-[11px] uppercase tracking-[0.2em] mb-4">
                        misión de transmisión
                    </div>

                    <h1
                        className="text-4xl md:text-5xl font-(family-name:--font-title) font-medium text-(--green-light) glitch mb-2"
                        data-text={level.title}
                    >
                        {level.title}
                    </h1>

                    <div className="h-px w-full separator-glow" />
                </div>

                {/* Contenido Narrativo */}
                <div className="bg-(--bg-surface) border border-(--bg-hover) rounded-sm p-6 mb-8 relative group">
                    {/* Esquinas decorativas */}
                    <div className="absolute -top-px -left-px w-4 h-4 border-t border-l border-(--green-base) opacity-40 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute -bottom-px -right-px w-4 h-4 border-b border-r border-(--green-base) opacity-40 group-hover:opacity-100 transition-opacity" />

                    <div className="flex gap-4 items-start">
                        <div className="bg-(--green-darkest) p-3 rounded-sm border border-(--green-dark) shrink-0">
                            <Cpu size={20} className="text-(--green-base) animate-pulse" />
                        </div>
                        <div>
                            <div className="font-mono text-[11px] text-(--green-muted) uppercase mb-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-(--green-base) block" />
                                descripción del sistema
                            </div>
                            <p className="text-sm text-(--text-muted) leading-relaxed font-mono">
                                {level.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Grid de Stats */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-(--bg-elevated) border border-(--bg-hover) p-4 rounded-sm flex flex-col items-center hover:border-(--green-dark) transition-colors group">
                        <Clock size={20} className="text-(--green-base) mb-3 group-hover:scale-110 transition-transform" />
                        <span className="font-mono text-xl text-(--text-primary)">{data.timeLimit}s</span>
                        <span className="font-mono text-[10px] text-(--text-muted) font-medium tracking-widest uppercase">límite</span>
                    </div>

                    <div className="bg-(--bg-elevated) border border-(--bg-hover) p-4 rounded-sm flex flex-col items-center hover:border-(--amber) transition-colors group">
                        <Database size={20} className="text-(--amber) mb-3 group-hover:scale-110 transition-transform" />
                        <span className="font-mono text-xl text-(--text-primary)">{data.lines.length}</span>
                        <span className="font-mono text-[10px] text-(--text-muted) font-medium tracking-widest uppercase">paquetes</span>
                    </div>

                    <div className="bg-(--bg-elevated) border border-(--bg-hover) p-4 rounded-sm flex flex-col items-center hover:border-(--purple) transition-colors group">
                        <Zap size={20} className="text-(--purple) mb-3 group-hover:scale-110 transition-transform" />
                        <span className="font-mono text-xl text-(--text-primary)">+{data.bonusTimeFor3Stars}s</span>
                        <span className="font-mono text-[10px] text-(--text-muted) font-medium tracking-widest uppercase">bonus ★★★</span>
                    </div>
                </div>

                {/* Acción Principal */}
                <div className="flex flex-col items-center gap-4">
                    <Button
                        onClick={onStart}
                        size="xl"
                        variant="solid"
                        icon={Zap}
                        iconPosition="right"
                        className="w-full sm:w-auto min-w-[280px]"
                    >
                        iniciar transmisión
                    </Button>
                    <div className="font-mono text-[10px] text-(--text-ghost) animate-pulse uppercase tracking-widest">
                        esperando señal de estabilización...
                    </div>
                </div>
            </div>

            {/* Ruido sutil en el fondo (opcional) */}
            <div className="absolute inset-0 z-[-1] opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
    )
}
