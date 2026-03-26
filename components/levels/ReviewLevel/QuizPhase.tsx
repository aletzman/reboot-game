import React from 'react'
import { Brain, Check, X, Activity, Cpu, ShieldAlert, CpuIcon, Hash } from 'lucide-react'
import { Question } from './types'

interface QuizPhaseProps {
    question: Question
    currentQuestion: number
    totalQuestions: number
    showFeedback: number | null
    onAnswer: (index: number) => void
}

export function QuizPhase({
    question,
    currentQuestion,
    totalQuestions,
    showFeedback,
    onAnswer
}: QuizPhaseProps) {
    const progress = ((currentQuestion) / totalQuestions) * 100

    return (
        <div className="flex-1 flex flex-col bg-(--bg-void) p-6 relative overflow-hidden transition-all animate-in zoom-in-95 duration-500">
            {/* Background scanline */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-(--green-base) opacity-5 animate-scanline pointer-events-none z-10" />

            <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col gap-6">
                {/* Top Status Bar */}
                <div className="flex items-center gap-4 bg-(--bg-surface) border border-(--bg-hover) p-3 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-(--purple) opacity-50 shadow-[0_0_10px_rgba(127,119,221,0.5)]" />
                    
                    <div className="flex flex-col gap-1 pr-4 border-r border-(--bg-hover)">
                        <span className="font-mono text-[9px] text-(--text-ghost) uppercase tracking-widest">protocol_id</span>
                        <span className="font-mono text-xs text-(--purple) font-bold tracking-tighter flex items-center gap-2">
                             <Brain size={14} /> EVAL_LOGIC_PRM_{currentQuestion + 1}
                        </span>
                    </div>

                    <div className="flex-1 flex flex-col gap-1">
                        <div className="flex justify-between items-end">
                            <span className="font-mono text-[9px] text-(--text-ghost) uppercase tracking-widest">integrity_check</span>
                            <span className="font-mono text-[10px] text-(--green-light) font-bold">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-(--bg-deep) border border-(--bg-hover) rounded-[1px] overflow-hidden p-px">
                            <div 
                                className="h-full bg-(--green-base) transition-all duration-700 shadow-[0_0_10px_rgba(85,226,0,0.3)]" 
                                style={{ width: `${progress}%` }} 
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pl-4 border-l border-(--bg-hover)">
                        <div className="flex flex-col gap-0.5">
                            <span className="font-mono text-[8px] text-(--text-ghost) uppercase">latency</span>
                            <span className="font-mono text-[10px] text-(--green-muted)">14ms</span>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-(--bg-hover) flex items-center justify-center">
                            <Activity size={12} className="text-(--green-base) animate-pulse" />
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 overflow-hidden">
                    {/* Main Question Area */}
                    <div className="flex flex-col gap-6 min-h-0">
                        <div className="bg-(--bg-surface) border border-(--bg-hover) p-8 rounded-sm relative group flex-1 flex flex-col">
                            {/* Decorative corners */}
                            <div className="absolute -top-px -left-px w-4 h-4 border-t border-l border-(--green-dark) opacity-40" />
                            <div className="absolute -top-px -right-px w-4 h-4 border-t border-r border-(--green-dark) opacity-40" />
                            <div className="absolute -bottom-px -left-px w-4 h-4 border-b border-l border-(--green-dark) opacity-40" />
                            <div className="absolute -bottom-px -right-px w-4 h-4 border-b border-r border-(--green-dark) opacity-40" />

                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-(--bg-deep) border border-(--bg-hover) rounded-[1px] flex items-center justify-center font-mono text-xs text-(--text-muted)">
                                        Q{currentQuestion + 1}
                                    </div>
                                    <div className="h-px flex-1 bg-linear-to-r from-(--bg-hover) to-transparent" />
                                </div>

                                <h2 className="text-xl md:text-2xl text-(--text-primary) font-medium leading-relaxed font-sans">
                                    {question.text}
                                </h2>

                                <div className="mt-4 grid grid-cols-1 gap-3">
                                    {question.options.map((opt: string, i: number) => {
                                        const isCorrect = i === question.correctIndex
                                        const isSelected = showFeedback === i
                                        
                                        let borderColor = 'var(--bg-hover)'
                                        let bgColor = 'var(--bg-surface)'
                                        let textColor = 'var(--text-primary)'
                                        let statusColor = 'var(--bg-hover)'
                                        
                                        if (showFeedback !== null) {
                                            if (isCorrect) {
                                                borderColor = 'var(--green-base)'
                                                bgColor = 'var(--green-darkest)'
                                                textColor = 'var(--green-light)'
                                                statusColor = 'var(--green-base)'
                                            } else if (isSelected) {
                                                borderColor = 'var(--red)'
                                                bgColor = 'rgba(226, 75, 74, 0.1)'
                                                textColor = 'var(--red)'
                                                statusColor = 'var(--red)'
                                            }
                                        }

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => onAnswer(i)}
                                                disabled={showFeedback !== null}
                                                className={`
                                                    group relative flex items-center gap-4 text-left p-4 rounded-[1px] border transition-all duration-200
                                                    ${showFeedback === null ? 'hover:border-(--green-base) hover:bg-(--bg-hover)/50 cursor-pointer' : 'cursor-default'}
                                                `}
                                                style={{ borderColor, backgroundColor: bgColor, color: textColor }}
                                            >
                                                {/* Left status notch */}
                                                <div 
                                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 rounded-r-sm transition-colors"
                                                    style={{ backgroundColor: statusColor }}
                                                />

                                                <div className={`
                                                    w-8 h-8 flex items-center justify-center rounded-[1px] border font-mono text-xs transition-colors
                                                    ${showFeedback === null ? 'border-(--bg-hover) group-hover:border-(--green-base) group-hover:bg-(--green-darkest)' : 'border-current'}
                                                `}>
                                                    0{i + 1}
                                                </div>
                                                <span className="flex-1 font-mono text-[14px] leading-tight tracking-tight">{opt}</span>
                                                
                                                {showFeedback !== null && isCorrect && <Check className="text-(--green-light) animate-in zoom-in-50 duration-300" size={18} />}
                                                {showFeedback !== null && isSelected && !isCorrect && <X className="text-(--red) animate-in zoom-in-50 duration-300" size={18} />}
                                                
                                                {showFeedback === null && (
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[8px] text-(--green-light) uppercase tracking-tighter">
                                                        [ ENTRAR ]
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Hint Area */}
                        <div className="bg-(--bg-deep) border border-dashed border-(--bg-hover) p-4 rounded-sm flex items-start gap-4 h-fit">
                            <div className="bg-(--bg-surface) p-2 border border-(--bg-hover) rounded-[1px]">
                                <Activity size={16} className="text-(--text-ghost)" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="font-mono text-[9px] text-(--text-ghost) uppercase tracking-widest leading-none">terminal_log</span>
                                <p className="text-[11px] text-(--text-muted) font-mono leading-none">
                                     SEC_ERR_0: Esperando validación de entrada del usuario en puerto_0X11
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar HUD */}
                    <div className="hidden lg:flex flex-col gap-6">
                        <div className="bg-(--bg-surface) border border-(--bg-hover) p-5 rounded-sm flex flex-col gap-6">
                            <div className="flex flex-col gap-4">
                                <div className="text-[10px] font-mono text-(--green-muted) uppercase tracking-widest border-b border-(--bg-hover) pb-2 flex items-center gap-2">
                                    <CpuIcon size={14} /> diagnóstico_hw
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter text-(--text-muted)">
                                        <span>cpu_load</span>
                                        <span className="text-(--green-light)">{(20 + currentQuestion * 10)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-(--bg-deep) rounded-[1px] overflow-hidden p-px">
                                        <div 
                                            className="h-full bg-(--green-base) transition-all duration-700" 
                                            style={{ width: `${20 + currentQuestion * 10}%` }} 
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-[9px] font-mono uppercase tracking-tighter text-(--text-muted)">
                                        <span>mem_buffer</span>
                                        <span className="text-(--cyan)">{(40 + currentQuestion * 5)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-(--bg-deep) rounded-[1px] overflow-hidden p-px">
                                        <div 
                                            className="h-full bg-(--cyan) transition-all duration-700" 
                                            style={{ width: `${40 + currentQuestion * 5}%` }} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-(--bg-hover)" />

                            <div className="flex flex-col gap-3">
                                <div className="text-[10px] font-mono text-(--text-ghost) uppercase tracking-widest border-b border-(--bg-hover) pb-2 flex items-center gap-2">
                                    <Hash size={14} /> metadata_log
                                </div>
                                <div className="flex flex-col gap-2 font-mono text-[9px] text-(--text-muted)">
                                    <div className="flex justify-between">
                                        <span className="opacity-50">NODE_ID:</span>
                                        <span>0X88FF-2</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="opacity-50">STATUS:</span>
                                        <span className="text-(--green-light)">ACTIVE</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="opacity-50">VER_CHECK:</span>
                                        <span>PASSED</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-(--bg-surface) border border-(--bg-hover) p-5 rounded-sm flex-1 flex flex-col items-center justify-center gap-4 opacity-50 relative overflow-hidden group hover:opacity-100 transition-opacity">
                            <div className="absolute inset-0 bg-linear-to-b from-transparent via-(--green-darkest)/5 to-transparent pointer-events-none" />
                            <ShieldAlert size={40} className="text-(--bg-hover) group-hover:text-(--green-dark) transition-colors" />
                            <div className="text-[8px] font-mono text-(--text-ghost) text-center uppercase tracking-widest leading-normal">
                                secure_verification_active<br />endpoint_protected
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
