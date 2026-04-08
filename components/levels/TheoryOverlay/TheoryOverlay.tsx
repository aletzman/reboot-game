'use client'

import { useState } from 'react'
import type { TheorySlide } from '@/types/game'
import { motion, AnimatePresence } from 'motion/react'
import {
    ChevronRight,
    ChevronLeft,
    Terminal,
    Zap,
    Info,
    CheckCircle2,
    Cpu,
    Activity,
    ShieldCheck
} from 'lucide-react'
import { TheoryText } from './TheoryText'
import { TheoryButton } from './TheoryButton'

interface TheoryOverlayProps {
    theory: TheorySlide[]
    onComplete: () => void
}

export default function TheoryOverlay({ theory, onComplete }: TheoryOverlayProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const currentSlide = theory[currentIndex]

    const isFirst = currentIndex === 0
    const isLast = currentIndex === theory.length - 1

    function next() {
        if (isLast) onComplete()
        else setCurrentIndex(prev => prev + 1)
    }

    function prev() {
        if (!isFirst) setCurrentIndex(prev => prev - 1)
    }

    return (
        <div className="fixed inset-0 z-300 flex items-center justify-center p-6 bg-(--bg-void) bg-diagonal-lines">
            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-4xl bg-(--bg-elevated) border border-(--bg-hover) shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-xs flex flex-col min-h-[600px] will-change-transform"
            >
                {/* Tactical Frame Elements */}
                <div className="absolute -top-px -left-px w-12 h-12 border-t-2 border-l-2 border-(--purple)/50 z-10" />
                <div className="absolute -top-px -right-px w-12 h-12 border-t-2 border-r-2 border-(--purple)/50 z-10" />
                <div className="absolute -bottom-px -left-px w-12 h-12 border-b-2 border-l-2 border-(--purple)/50 z-10" />
                <div className="absolute -bottom-px -right-px w-12 h-12 border-b-2 border-r-2 border-(--purple)/50 z-10" />

                {/* Header Section */}
                <header className="flex items-center justify-between px-8 py-5 border-b border-(--bg-hover) bg-(--bg-deep)/40">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-(--purple)/10 border border-(--purple)/30 flex items-center justify-center shadow-[inset_0_0_10px_rgba(127,119,221,0.2)]">
                            <Cpu className="text-(--purple)" size={20} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs uppercase font-bold tracking-[0.2em] text-(--purple)">
                                    MODULO_PEDAGOGICO
                                </span>
                                <div className="h-px w-8 bg-(--purple)/30" />
                                <Activity size={10} className="text-(--purple)" />
                            </div>
                            <h2 className="text-(--text-primary) font-(family-name:--font-title) font-bold text-3xl">
                                {currentSlide.title}
                            </h2>
                        </div>
                    </div>
                </header>

                {/* Content Area - KEY FIX: overflow-visible/y-auto blend */}
                <div className="flex-1 relative overflow-hidden bg-radial-at-t from-(--bg-surface) to-(--bg-elevated)">
                    {/* Interior Scanlines */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
                        style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 1px, transparent 1px, transparent 2px)', backgroundSize: '100% 2px' }} />

                    <div className="h-full overflow-y-auto custom-scrollbar px-10 py-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.15 }}
                                className="flex flex-col gap-8 pb-10" // Padding at bottom to ensure space for tooltips
                            >
                                {/* Narrative/Main Text */}
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-linear-to-b from-(--purple)/60 via-(--purple)/10 to-transparent" />
                                    <div className="text-(--text-primary)/90 leading-relaxed text-[15px] font-normal pl-2">
                                        <TheoryText text={currentSlide.content} />
                                    </div>
                                </div>

                                {/* Code Context Section */}
                                {currentSlide.code && (
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-linear-to-r from-(--green-base)/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur rounded-lg" />
                                        <div className="relative bg-(--bg-deep) border border-(--bg-hover) rounded-sm overflow-hidden font-mono shadow-2xl">
                                            <div className="bg-(--bg-surface) px-4 py-2 border-b border-(--bg-hover) flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Terminal size={14} className="text-(--green-muted)" />
                                                    <span className="text-[10px] text-(--green-muted) uppercase tracking-widest font-bold">
                                                        Fragmento_Nucleo.js
                                                    </span>
                                                </div>
                                                <div className="h-1 w-20 bg-(--bg-void) rounded-full overflow-hidden">
                                                    <div className="h-full bg-(--green-light) animate-[loading_2s_infinite]" style={{ width: '40%' }} />
                                                </div>
                                            </div>
                                            <pre className="p-6 text-(--green-muted) overflow-x-auto text-[14px] leading-relaxed">
                                                <code>
                                                    {currentSlide.code.split('\n').map((line, i) => {
                                                        const isHighlighted = currentSlide.highlightLines?.includes(i + 1)
                                                        return (
                                                            <div
                                                                key={i}
                                                                className={`flex gap-4 px-4 -mx-4 transition-colors ${isHighlighted ? 'bg-(--green-light)/10 border-l-2 border-(--green-light) text-(--text-primary)' : ''}`}
                                                            >
                                                                <span className="shrink-0 w-6 text-(--text-ghost) text-right select-none opacity-40">{i + 1}</span>
                                                                <span>{line}</span>
                                                            </div>
                                                        )
                                                    })}
                                                </code>
                                            </pre>
                                        </div>
                                    </div>
                                )}

                                {/* FRAG Insight Section */}
                                {currentSlide.explanation && (
                                    <div className="mt-2 border-l-2 border-(--purple)/40 bg-(--purple)/5 p-6 relative overflow-hidden group">
                                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 text-(--purple)">
                                            <ShieldCheck size={100} />
                                        </div>
                                        <div className="relative flex gap-5">
                                            <div className="bg-(--purple)/20 p-2 h-fit rounded shadow-[0_0_15px_rgba(127,119,221,0.2)]">
                                                <Info size={18} className="text-(--purple)" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-(--purple) font-bold uppercase text-[10px] tracking-[0.3em] flex items-center gap-2 mb-2">
                                                    ANÁLISIS FRAG <span className="h-px flex-1 bg-(--purple)/20" />
                                                </span>
                                                <div className="text-(--text-primary)/70 text-[14px] leading-relaxed">
                                                    <TheoryText text={currentSlide.explanation} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Tactical Footer */}
                <div className="px-8 py-6 border-t border-(--bg-hover) bg-(--bg-surface) flex flex-wrap items-center justify-between gap-6">
                    {/* Tactical Progress Bar */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center w-32">
                            <span className="text-sm text-(--text-muted) font-mono">COMPLETADO:</span>
                            <span className="text-sm text-(--purple) font-mono">{Math.round(((currentIndex + 1) / theory.length) * 100)}%</span>
                        </div>
                        <div className="flex gap-1">
                            {theory.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-2 transition-all duration-500 rounded-xs ${i === currentIndex
                                        ? 'w-6 bg-(--purple) shadow-[0_0_10px_rgba(127,119,221,0.5)]'
                                        : i < currentIndex ? 'w-4 bg-(--purple)/40' : 'w-4 bg-(--bg-hover)'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isFirst && (
                            <TheoryButton
                                color="secondary"
                                size="md"
                                onClick={prev}
                                icon={ChevronLeft}
                            >
                                BACK
                            </TheoryButton>
                        )}

                        <TheoryButton
                            color={isLast ? 'success' : 'primary'}
                            size="md"
                            onClick={next}
                            icon={isLast ? CheckCircle2 : ChevronRight}
                            iconPosition="right"
                        >
                            {isLast ? 'CONFIRMAR' : 'SIGUIENTE'}
                        </TheoryButton>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
