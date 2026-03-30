"use client"

import { motion } from 'motion/react'
import { KeyIcon, LightbulbIcon, ArchiveIcon, InboxIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

interface ObjectScannerProps {
    type: 'lore' | 'key' | 'hint' | 'final'
    id: string
    icon: string
    isUnlocked: boolean
    className?: string
}

const typeIcons: Record<string, any> = {
    lore: InboxIcon,
    key: KeyIcon,
    hint: LightbulbIcon,
    final: ArchiveIcon
}

const typeColors: Record<string, string> = {
    lore: 'var(--blue)',
    key: 'var(--amber)',
    hint: 'var(--green-muted)',
    final: 'var(--purple)'
}

export function ObjectScanner({ type, id, icon, isUnlocked, className }: ObjectScannerProps) {
    const IconFallback = typeIcons[type] || InboxIcon
    const color = typeColors[type] || 'var(--amber)'
    const [imgError, setImgError] = useState(false)

    // Construct image path
    const imagePath = `/assets/objects/${icon}.webp`

    return (
        <div className={`relative ${className} group overflow-hidden`} style={{ perspective: '1200px' }}>
            <div
                className={`
                    w-full h-full relative transition-all duration-700
                    bg-[#090b0e] border-2 border-[#1a1f26] shadow-2xl
                    ${isUnlocked ? 'group-hover:border-(--amber)/50 group-hover:shadow-[0_0_30px_rgba(239,159,39,0.15)]' : 'opacity-60 grayscale brightness-50'}
                `}
                style={{
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                }}
            >
                <div className="absolute inset-x-0 top-0 h-1 bg-white/5 border-b border-black/40" />
                <div className="absolute inset-y-0 left-0 w-1 bg-white/5 border-r border-black/40" />
                <div className="absolute inset-y-0 right-0 w-1 bg-black/40 border-l border-white/5" />
                <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-[#2d333b] shadow-inner" />
                <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-[#2d333b] shadow-inner" />

                <div className="absolute inset-3 bottom-12 bg-black/50 shadow-[inset_0_0_20px_black] border border-white/5 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(#1a1f26 1px, transparent 1px), linear-gradient(90deg, #1a1f26 1px, transparent 1px)`,
                            backgroundSize: '12px 12px'
                        }}
                    />

                    {isUnlocked && (
                        <div className="absolute inset-x-0 h-[2px] bg-(--amber) opacity-0 group-hover:opacity-40 blur-[2px] shadow-[0_0_10px_var(--amber)] group-hover:animate-[scan_3s_infinite_linear] pointer-events-none z-0" />
                    )}
                    <motion.div
                        animate={isUnlocked ? {
                            y: [0, -3, 0],
                            rotateZ: [0, 1, -1, 0],
                        } : {}}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 w-2/3 h-2/3 flex items-center justify-center"
                    >
                        {isUnlocked && !imgError ? (
                            <div className="relative w-full h-full">
                                <Image
                                    src={imagePath}
                                    alt={id}
                                    fill
                                    className="object-contain drop-shadow-[0_0_20px_rgba(239,159,39,0.3)] transition-transform duration-500 group-hover:scale-110"
                                    onError={() => setImgError(true)}
                                />
                                {/* Under-glow */}
                                <div className="absolute -bottom-4 inset-x-0 h-4 bg-amber-500/20 blur-[15px] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ) : (
                            <IconFallback
                                strokeWidth={0.5}
                                className="w-1/2 h-1/2 transition-colors duration-500"
                                style={{ color: isUnlocked ? color : 'var(--text-ghost)' }}
                            />
                        )}
                    </motion.div>
                </div>

                {/* 3. IDENTIFICATION STICKER (Industrial Label) */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20">
                    <div className="px-2 py-0.5 bg-[#d1d5db] text-black text-[7.5px] font-black uppercase tracking-[0.2em] rounded-b-xs">
                        {id.replace('obj-', '')}
                    </div>
                    {isUnlocked && (
                        <div className="flex gap-0.5">
                            <div className="w-1 h-3 skew-x-[-15deg] bg-(--amber) shadow-[0_0_4px_var(--amber)]" />
                            <div className="w-1 h-3 skew-x-[-15deg] bg-(--amber)/40" />
                        </div>
                    )}
                </div>

                {/* 4. THE STORAGE HANDLE (The Physical Interaction Point) */}
                <div className="absolute bottom-0 inset-x-0 h-10 border-t border-[#1a1f26] bg-linear-to-b from-[#0f141a] to-[#05070a] z-30 flex items-center justify-between px-3">
                    {/* Metal Grip Ridges */}
                    <div className="flex gap-1 h-4 border-x border-white/5 px-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-1 h-full bg-black/40 border-r border-white/5 rounded-full" />
                        ))}
                    </div>

                    {/* Status Console (Small pixel display) */}
                    <div className="flex-1 mx-2 h-5 bg-black/80 border border-white/5 rounded-xs flex items-center justify-between px-1.5 overflow-hidden">
                        <span className={`text-[7px] font-mono tracking-widest uppercase transition-colors ${isUnlocked ? 'text-(--amber) animate-pulse' : 'text-(--text-ghost)'}`}>
                            {isUnlocked ? 'Mounted' : 'Missing'}
                        </span>
                        <div className="flex gap-[2px]">
                            <div className={`w-1 h-1 rounded-full ${isUnlocked ? 'bg-(--green-light) shadow-[0_0_3px_var(--green-light)]' : 'bg-red-900'}`} />
                            <div className="w-1 h-1 rounded-full bg-white/5" />
                        </div>
                    </div>

                    {/* Locking Bolts */}
                    <div className="h-6 w-1 border-r border-white/10 opacity-20" />
                    <div className="text-[6px] font-mono text-(--text-ghost) opacity-40 uppercase ml-1">
                        CADDY_v3
                    </div>
                </div>

                {/* Technical Overlay (Glass feel) */}
                <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none z-40" />

                {/* Scanline Detail */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,1)_3px)] h-[1000%]" />
                </div>
            </div>

            {/* Animation CSS for scanning line */}
            <style jsx>{`
                @keyframes scan {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
            `}</style>
        </div>
    )
}
