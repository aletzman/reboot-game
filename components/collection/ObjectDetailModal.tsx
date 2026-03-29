"use client"

import { motion, AnimatePresence } from 'motion/react'
import { ZapIcon, CpuIcon, TerminalIcon, DatabaseIcon, ActivityIcon, AlertCircleIcon } from 'lucide-react'
import { ObjectScanner } from '@/components/collection/ObjectScanner'
import { CloseButton } from '@/components/ui/CloseButton'
import type { GameObject } from '@/types/game'

interface ObjectDetailModalProps {
    selectedObject: GameObject | null
    onClose: () => void
}

const typeColors: Record<string, string> = {
    lore: 'var(--blue)',
    key: 'var(--amber)',
    hint: 'var(--green-muted)',
    final: 'var(--purple)'
}

export function ObjectDetailModal({ selectedObject, onClose }: ObjectDetailModalProps) {
    if (!selectedObject) return null

    return (
        <AnimatePresence>
            {selectedObject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-(--bg-void)/90"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, rotateX: 10 }}
                        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                        exit={{ scale: 0.9, opacity: 0, rotateX: -10 }}
                        className={`
                relative w-full max-w-4xl max-h-[85vh] flex flex-col
                bg-[#0d1117] border-[6px] border-[#1c212b] rounded-xs shadow-[0_0_80px_rgba(0,0,0,0.6)]
                overflow-hidden will-change-transform
              `}
                        onClick={(e) => e.stopPropagation()}
                        style={{ transform: 'perspective(1200px)' }}
                    >
                        {/* PDA Frame Decorators - Status Indicators */}
                        <div className="absolute top-0 left-0 w-full h-8 bg-[#1c212b] flex items-center justify-between px-6 border-b border-white/5">
                            <div className="flex gap-4 items-center">
                                <div className="flex items-center gap-2 px-2 py-1 bg-black/40 border border-white/5 rounded-xs">
                                    <div className="w-1 h-2.5 bg-(--amber) animate-pulse shadow-[0_0_5px_var(--amber)]" />
                                    <span className="text-[6px] font-mono text-white/50 uppercase tracking-[0.3em]">SYS_READY_v0.9</span>
                                </div>
                                <span className="text-[7px] font-mono text-(--text-muted) uppercase tracking-[0.4em]">REBOOT_PDA_v4.2 // SALVAGED_UNIT</span>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <ZapIcon size={8} className="text-(--amber)" />
                                    <div className="w-12 h-1 bg-black/40 rounded-full overflow-hidden">
                                        <div className="h-full bg-(--amber) w-2/3" />
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-20">
                                    {[...Array(4)].map((_, i) => <div key={i} className="w-2 h-0.5 bg-white" />)}
                                </div>
                                <CloseButton onClick={onClose} className="ml-2 -mt-1.5" size='sm' />
                            </div>
                        </div>

                        {/* Side "Grip" Decorations */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-1 p-1 opacity-20 pointer-events-none">
                            {[...Array(10)].map((_, i) => <div key={i} className="w-1 h-4 bg-white/20 rounded-full" />)}
                        </div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-1 p-1 opacity-20 pointer-events-none">
                            {[...Array(10)].map((_, i) => <div key={i} className="w-1 h-4 bg-white/20 rounded-full" />)}
                        </div>

                        {/* Main "Screen" Container */}
                        <div className="flex-1 mt-8 overflow-y-auto custom-scrollbar flex flex-col md:flex-row">
                            {/* Left Panel: Mini Scan HUD */}
                            <div className="w-full md:w-1/3 bg-[#080b0f] p-8 border-r border-[#1c212b] flex flex-col items-center">
                                <div className="relative mb-8 group/scan">
                                    {/* Diagnostic HUD Overlay */}
                                    <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-(--amber) opacity-40 group-hover/scan:scale-110 transition-transform" />
                                    <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-(--amber) opacity-40 group-hover/scan:scale-110 transition-transform" />

                                    <ObjectScanner
                                        type={selectedObject.type}
                                        id={selectedObject.id}
                                        isUnlocked={true}
                                        className="w-48 h-48 shadow-[0_0_30px_rgba(239,159,39,0.05)]"
                                    />

                                    {/* Scanning Text Overlay (Animated) */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover/scan:opacity-100 transition-opacity">
                                        <span className="bg-black/80 px-2 py-1 text-[8px] font-mono text-(--amber) border border-(--amber)/30 animate-pulse uppercase">DECODING_ENTITY...</span>
                                    </div>
                                </div>

                                <div className="w-full space-y-3">
                                    <div className="bg-black/30 p-3 border-l-2 border-[#1c212b]/50">
                                        <span className="text-[7px] font-mono text-(--text-ghost) uppercase block mb-1">SIGNAL_ID</span>
                                        <span className="text-[10px] font-mono text-white/70 font-bold"># {selectedObject.id.toUpperCase()}</span>
                                    </div>

                                    <div className="bg-black/30 p-3 border-l-2 border-[#1c212b]/50">
                                        <span className="text-[7px] font-mono text-(--text-ghost) uppercase block mb-1">LAST_DETECTED</span>
                                        <span className="text-[10px] font-mono text-(--green-muted) font-bold animate-pulse">TERMINAL_09_A</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Data & Narrative */}
                            <div className="flex-1 p-8 md:p-12 bg-linear-to-br from-[#0d1117] to-[#040608] relative">
                                {/* Digital Glitch Decals */}
                                <div className="absolute bottom-6 right-6 flex flex-col items-end gap-1 opacity-10 pointer-events-none">
                                    <div className="w-16 h-1 bg-white" />
                                    <div className="w-24 h-px bg-white" />
                                    <div className="w-8 h-[2px] bg-(--amber)" />
                                </div>

                                <header className="mb-8 overflow-hidden">
                                    <div className="flex items-center gap-3 mb-2">
                                        <CpuIcon size={12} className="text-(--amber)" />
                                        <span className="text-[9px] font-mono text-(--amber) uppercase tracking-[0.4em] font-black">DATA_STREAM :: RECOVERED</span>
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-(family-name:--font-title) text-white uppercase eading-none mb-4">{selectedObject.name}</h2>
                                    <div className="w-full h-px bg-linear-to-r from-[#1c212b] via-white/10 to-transparent" />
                                </header>

                                <div className="space-y-8">
                                    {/* Compact Description */}
                                    <div className="relative">
                                        <p className="text-(--text-primary) font-sans leading-relaxed text-base opacity-90 border-l-2 border-(--amber)/30 pl-6">
                                            {selectedObject.description}
                                        </p>
                                    </div>

                                    {/* Lore Box (Condensed) */}
                                    <div className="bg-black/40 border border-[#1c212b] p-6 relative group/lore">
                                        <div className="flex items-center gap-2 mb-4">
                                            <DatabaseIcon size={12} className="text-(--amber) opacity-60" />
                                            <h4 className="text-[8px] font-mono text-(--text-ghost) uppercase tracking-widest font-black">FRAGMENTED_MEMORIES</h4>
                                        </div>
                                        <p className="text-(--text-muted) font-sans leading-relaxed text-sm">
                                            "{selectedObject.lore}"
                                        </p>
                                    </div>

                                    {/* Info Grid (Condensed) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-(--bg-elevated) border border-[#1c212b] hover:bg-[#141b24] transition-colors">
                                            <div className="flex items-center gap-2 mb-2">
                                                <ActivityIcon size={10} className="text-(--amber)" />
                                                <span className="text-[10px] font-mono text-(--amber) uppercase font-black tracking-widest">SYSTEM_IMPACT</span>
                                            </div>
                                            <p className="text-(--text-muted) text-[11px] font-mono leading-tight opacity-70">
                                                {selectedObject.effect}
                                            </p>
                                        </div>

                                        <div className="p-4 bg-(--bg-elevated) border border-[#1c212b] hover:bg-[#141b24] transition-colors">
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertCircleIcon size={10} className="text-(--text-ghost)" />
                                                <span className="text-[10px] font-mono text-(--text-ghost) uppercase font-black tracking-widest">USAGE_TRACE</span>
                                            </div>
                                            <p className="text-(--text-muted) text-[11px] font-mono leading-tight opacity-70">
                                                {selectedObject.inventoryNote}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Compact Connections */}
                                    {selectedObject.usedIn.length > 0 && (
                                        <div className="pt-6 border-t border-[#1c212b]">
                                            <h4 className="text-[10px] font-mono text-(--text-ghost) uppercase tracking-[0.4em] mb-3">TERMINAL_RELATIONS::</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedObject.usedIn.map(levelId => (
                                                    <span key={levelId} className="px-2 py-1 bg-black/50 border border-[#1c212b] text-[8px] font-mono text-(--amber) opacity-60">
                                                        REL_{levelId.split('-').pop()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Mechanical Detail - Screw/Bolts on corners */}
                        <div className="absolute top-10 left-1 w-1.5 h-1.5 bg-[#252a33] rounded-full shadow-inner" />
                        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-[#252a33] rounded-full shadow-inner" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
