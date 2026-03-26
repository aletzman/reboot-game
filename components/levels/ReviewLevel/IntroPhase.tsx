import React from 'react'
import { Terminal, Zap, ArrowRight, ShieldCheck, Database, Cpu, Activity } from 'lucide-react'
import { ReviewLevelProps } from './types'
import { Button } from '@/components/ui/Button'

interface IntroPhaseProps extends Pick<ReviewLevelProps, 'level'> {
    onStart: () => void
}

export function IntroPhase({ level, onStart }: IntroPhaseProps) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-(--bg-void) relative overflow-hidden transition-all animate-in fade-in duration-700">
            {/* Scanline Effect */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-(--green-base) opacity-5 animate-scanline pointer-events-none z-10" />
            
            {/* Decorative background elements */}
            <div className="absolute top-6 left-8 flex items-center gap-3 text-(--text-ghost) font-mono text-[10px] tracking-widest uppercase">
                <Activity size={12} className="text-(--green-base)" />
                <span>Status: Analyzing_Node</span>
                <span className="w-1 h-1 rounded-full bg-(--green-base) animate-pulse shadow-[0_0_5px_var(--green-base)]" />
            </div>

            <div className="absolute bottom-6 right-8 text-right font-mono text-[9px] text-(--text-ghost) tracking-widest uppercase flex flex-col gap-1">
                <div>Memory_Check: [OK]</div>
                <div>Logic_Buffer: 0xFF-01A</div>
            </div>

            <div className="max-w-2xl w-full animate-in zoom-in-95 duration-500">
                {/* Header Protocol */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="inline-block px-4 py-1.5 bg-(--green-darkest) border-x border-(--green-dark) text-(--green-base) font-mono text-[11px] uppercase tracking-[0.3em] mb-6 shadow-[0_0_15px_rgba(85,226,0,0.1)]">
                        protocolo de repaso integrado
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-bold text-(--text-primary) tracking-tight mb-4">
                        {level.title}
                    </h1>
                    
                    <div className="flex items-center gap-4 w-full">
                        <div className="h-px flex-1 bg-linear-to-r from-transparent via-(--bg-hover) to-(--green-dark)/30" />
                        <div className="font-mono text-[10px] text-(--green-base) px-2">[ ACTO_{level.id?.split('-')[1] || '0'} ]</div>
                        <div className="h-px flex-1 bg-linear-to-l from-transparent via-(--bg-hover) to-(--green-dark)/30" />
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-6 items-stretch">
                    <div className="bg-(--bg-surface) border border-(--bg-hover) rounded-sm p-8 relative group overflow-hidden">
                        {/* Corner brackets */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-(--green-dark) opacity-40 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-(--green-dark) opacity-40 group-hover:opacity-100 transition-opacity" />

                        <div className="flex gap-5">
                            <div className="bg-(--green-darkest) p-4 rounded-sm border border-(--green-dark) shrink-0 h-fit shadow-[0_4px_15px_rgba(0,0,0,0.4)]">
                                <Database size={24} className="text-(--green-light) animate-pulse" />
                            </div>
                            
                            <div className="flex flex-col gap-4">
                                <div>
                                    <div className="text-(--green-muted) font-mono text-[11px] uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-(--green-base)" />
                                        análisis de objetivos
                                    </div>
                                    <p className="text-(--text-muted) text-[15px] leading-relaxed font-sans">
                                        {level.description || 'Validando la integridad sintáctica de los módulos recientemente cargados en el núcleo del sistema.'}
                                    </p>
                                </div>

                                <div className="bg-(--bg-deep) border border-(--bg-hover) p-4 rounded-sm">
                                    <div className="flex items-center gap-2 mb-2 text-(--amber) font-mono text-[10px] font-bold uppercase tracking-widest">
                                        <ShieldCheck size={14} /> fase de certificación habilitada
                                    </div>
                                    <div className="text-(--text-muted) text-[13px] italic font-sans opacity-80 leading-snug">
                                        &quot;{level.narrative?.replace('FRAG: ', '') || 'Asegúrese de que el hardware de memoria esté sincronizado antes de proceder.'}&quot;
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats/Phases Column */}
                    <div className="flex flex-col gap-4 h-full">
                        <div className="bg-(--bg-surface) border border-(--bg-hover) p-5 rounded-sm flex-1 flex flex-col justify-center items-center gap-6 group hover:border-(--green-dark) transition-all">
                             {[1, 2, 3].map((i: number) => (
                                <div key={i} className="flex flex-col items-center gap-2 w-full">
                                    <div className="flex justify-between w-full text-[9px] font-mono text-(--text-ghost) uppercase tracking-tighter mb-1 px-1">
                                        <span>fase_{i}</span>
                                        <span className={i === 1 ? 'text-(--green-light)' : 'text-(--text-ghost)'}>
                                            {i === 1 ? 'QUIZ' : i === 2 ? 'PUZZLE' : 'SIM'}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-(--bg-deep) border border-(--bg-hover) rounded-[1px] overflow-hidden p-[2px]">
                                        <div className={`h-full transition-all duration-1000 ${i === 1 ? 'w-full bg-(--green-base) shadow-[0_0_8px_var(--green-base)]' : 'w-0 bg-(--bg-hover)'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button 
                            onClick={onStart}
                            variant="solid"
                            size="lg"
                            className="w-full py-6 font-mono tracking-widest text-sm bg-(--green-dark) border-(--green-base) hover:bg-(--green-base) text-(--green-light) shadow-[0_0_20px_rgba(85,226,0,0.1)] active:scale-[0.98]"
                            icon={ArrowRight}
                            iconPosition="right"
                        >
                            ENLAZAR NÚCLEO
                        </Button>
                    </div>
                </div>
                
                <div className="mt-8 flex justify-center">
                    <div className="font-mono text-[10px] text-(--text-ghost) animate-pulse uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full border border-(--green-dark)" />
                        esperando señal de estabilización...
                        <div className="w-2 h-2 rounded-full border border-(--green-dark)" />
                    </div>
                </div>
            </div>
        </div>
    )
}
