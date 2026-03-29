'use client'

import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { Info, HelpCircle, GraduationCap } from 'lucide-react'
import { CloseButton } from '@/components/ui/CloseButton'
import { getGlossary } from '@/services/glossaryService'

interface GlossaryTerm {
    id: string
    term: string
    technical: string
    human: string
}

interface TheoryTextProps {
    text: string
}

export function TheoryText({ text }: TheoryTextProps) {
    const [glossary, setGlossary] = useState<GlossaryTerm[]>([])
    const [combinedPattern, setCombinedPattern] = useState<RegExp | null>(null)

    useEffect(() => {
        getGlossary().then((data: GlossaryTerm[]) => {
            setGlossary(data)
            const sortedTerms = [...data].sort((a, b) => b.term.length - a.term.length)
            setCombinedPattern(new RegExp(`(\\*[^\\*]+\\*)|\\b(${sortedTerms.map(t => t.term).join('|')})\\b`, 'gi'))
        }).catch(console.error)
    }, [])

    if (!combinedPattern) return <span>{text}</span>

    // Split text using the combined pattern
    const parts = text.split(combinedPattern).filter(part => part !== undefined)

    return (
        <span>
            {parts.map((part, i) => {
                // If it's a manual bold term (*term*)
                if (part.startsWith('*') && part.endsWith('*')) {
                    const content = part.slice(1, -1)
                    return (
                        <span key={i} className="font-extrabold text-(--text-primary)">
                            {content}
                        </span>
                    )
                }

                // If it matches a glossary term
                const term = glossary.find(t => t.term.toLowerCase() === (part.toLowerCase()))
                if (term) {
                    return <TheoryTerm key={`${term.id}-${i}`} term={term} />
                }

                // Default text
                return part
            })}
        </span>
    )
}

function TheoryTerm({ term }: { term: GlossaryTerm }) {
    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState<'technical' | 'human'>('technical')
    const [portalNode, setPortalNode] = useState<HTMLElement | null>(null)
    const triggerRef = useRef<HTMLSpanElement>(null)
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, showBelow: false })

    useEffect(() => {
        setPortalNode(document.body)
    }, [])

    function updateCoords() {
        if (!triggerRef.current) return
        const rect = triggerRef.current.getBoundingClientRect()

        // Decide if we show it below the term (if too close to top of viewport)
        const showBelow = rect.top < 300

        setCoords({
            top: rect.top,
            left: rect.left + rect.width / 2,
            width: rect.width,
            showBelow
        })
    }

    useLayoutEffect(() => {
        if (isOpen) {
            updateCoords()
            window.addEventListener('scroll', updateCoords, true)
            window.addEventListener('resize', updateCoords)
            return () => {
                window.removeEventListener('scroll', updateCoords, true)
                window.removeEventListener('resize', updateCoords)
            }
        }
    }, [isOpen])

    return (
        <span className="inline-block">
            <motion.span
                ref={triggerRef}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                className={`cursor-help font-bold text-(--green-light) border-b border-dashed border-(--green-light)/40 hover:border-solid px-1 -mx-1 rounded transition-all inline-flex items-center gap-1 ${isOpen ? 'bg-(--green-light)/10 border-solid' : 'hover:bg-(--green-light)/10'}`}
            >
                {term.term}
            </motion.span>

            {isOpen && portalNode && createPortal(
                <div className="fixed inset-0 z-1000 pointer-events-none">
                    {/* Backdrop to close on click outside */}
                    <div className="absolute inset-0 pointer-events-auto" onClick={() => setIsOpen(false)} />

                    <motion.div
                        initial={{ opacity: 0, y: coords.showBelow ? -10 : 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: coords.showBelow ? -10 : 10, scale: 0.95 }}
                        className="absolute pointer-events-auto w-72 xs:w-80"
                        style={{
                            top: coords.showBelow ? coords.top + 30 : coords.top - 12, // Positioning
                            left: coords.left,
                            transformOrigin: coords.showBelow ? 'top center' : 'bottom center',
                            translate: '-50% ' + (coords.showBelow ? '0' : '-100%')
                        }}
                    >
                        <div className="bg-(--bg-elevated) border border-(--green-base)/40 rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-5 relative overflow-hidden">
                            {/* HUD Scanline effect */}
                            <div className="absolute inset-0 bg-linear-to-b from-(--green-base)/5 to-transparent pointer-events-none" />

                            <div className="relative flex flex-col gap-4">
                                <div className="flex items-center justify-between border-b border-(--bg-hover) pb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-(--green-light) rounded-full animate-pulse" />
                                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-(--green-muted)">
                                            REF_DB / {term.id.toUpperCase()}
                                        </span>
                                    </div>
                                        <CloseButton 
                                            size="sm" 
                                            onClick={() => setIsOpen(false)} 
                                        />
                                </div>

                                {/* Mode Toggle - Switch style */}
                                <div className="flex bg-(--bg-deep) p-1 border border-(--bg-hover) rounded-xs">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setMode('technical'); }}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] uppercase font-bold transition-all ${mode === 'technical'
                                            ? 'bg-(--green-darkest) text-(--green-light) border border-(--green-base)/40 shadow-[0_0_10px_rgba(85,226,0,0.1)]'
                                            : 'text-(--text-ghost) hover:text-(--text-muted)'
                                            }`}
                                    >
                                        <GraduationCap size={12} /> TÉCNICO
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setMode('human'); }}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] uppercase font-bold transition-all ${mode === 'human'
                                            ? 'bg-(--amber)/10 text-(--amber) border border-(--amber)/40 shadow-[0_0_10px_rgba(239,159,39,0.1)]'
                                            : 'text-(--text-ghost) hover:text-(--text-muted)'
                                            }`}
                                    >
                                        <HelpCircle size={12} /> ANALÓGICO
                                    </button>
                                </div>

                                <div className="min-h-[60px] flex items-center">
                                    <p className="text-(--text-muted) text-[13px] leading-relaxed font-normal">
                                        "{mode === 'technical' ? term.technical : term.human}"
                                    </p>
                                </div>

                                <div className="pt-2 border-t border-(--bg-hover) flex items-center justify-between opacity-60">
                                    <div className="flex items-center gap-2 text-[9px] text-(--green-muted) uppercase font-bold tracking-widest">
                                        <Info size={12} />
                                        <span>DIAGNÓSTICO FRAG</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-1 h-3 bg-(--green-base)/40" />
                                        <div className="w-1 h-3 bg-(--green-base)/60" />
                                        <div className="w-1 h-3 bg-(--green-base)/80" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Speech bubble arrow - Positioned based on showBelow */}
                        <div className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-(--bg-elevated) border-r border-b border-(--green-base)/40 rotate-45 z-10 ${coords.showBelow ? 'bottom-full -mb-1.5 rotate-[-135deg] border-none bg-(--bg-elevated)' : 'top-full -mt-1.5'
                            }`} />
                        {coords.showBelow && (
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-3 h-3 bg-(--bg-elevated) border-t border-l border-(--green-base)/40 rotate-45 -mb-1.5" />
                        )}
                    </motion.div>
                </div>,
                portalNode
            )}
        </span>
    )
}
