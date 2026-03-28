"use client"

import React from 'react'
import { motion } from 'motion/react'
import { WrenchIcon, KeyIcon, LightbulbIcon, ArchiveIcon, InboxIcon, ScanIcon } from 'lucide-react'

interface ObjectScannerProps {
    type: 'lore' | 'key' | 'hint' | 'final'
    id: string
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

export function ObjectScanner({ type, id, isUnlocked, className }: ObjectScannerProps) {
    const Icon = typeIcons[type] || InboxIcon
    const color = typeColors[type] || 'var(--amber)'

    return (
        <div className={`relative ${className} group`} style={{ perspective: '1000px' }}>
            {/* The Display Case / Scanner */}
            <div 
                className={`
                    w-full h-full relative transition-all duration-700
                    bg-[#080b10] border-2 border-[#1a1f26] 
                    ${isUnlocked ? 'group-hover:border-(--amber) group-hover:shadow-[0_0_30px_rgba(239,159,39,0.1)]' : 'opacity-40 grayscale'}
                `}
                style={{
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Back Plate Decoration */}
                <div className="absolute inset-0 opacity-[0.03]" 
                    style={{ 
                        backgroundImage: `linear-gradient(#1a1f26 1px, transparent 1px), linear-gradient(90deg, #1a1f26 1px, transparent 1px)`,
                        backgroundSize: '10px 10px'
                    }} 
                />

                {/* Technical HUD Elements */}
                <div className="absolute top-2 left-2 flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-(--text-ghost)" />
                    <div className={`w-8 h-px mt-0.5 ${isUnlocked ? 'bg-(--amber)' : 'bg-(--text-ghost)'}`} />
                </div>
                <div className="absolute top-2 right-2 text-[6px] font-mono text-(--text-ghost) tracking-tighter uppercase">
                    OBJ_SCAN::{id.slice(0,4)}
                </div>

                {/* Main Object Visual */}
                <div className="absolute inset-0 flex items-center justify-center p-8">
                    {/* Ring decoration */}
                    <div className={`
                        absolute w-24 h-24 border border-dashed rounded-full transition-all duration-1000
                        ${isUnlocked ? 'border-(--amber) opacity-20 group-hover:opacity-40 group-hover:animate-spin' : 'border-(--text-ghost) opacity-10'}
                    `} />
                    
                    <motion.div 
                        animate={isUnlocked ? {
                            y: [0, -5, 0],
                            rotateZ: [0, 2, -2, 0]
                        } : {}}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10"
                    >
                        <Icon 
                            strokeWidth={0.5} 
                            className={`w-16 h-16 transition-colors duration-500`}
                            style={{ color: isUnlocked ? color : 'var(--text-ghost)' }}
                        />
                        
                        {isUnlocked && (
                           <div className="absolute inset-0 blur-[15px] scale-150 opacity-20 pointer-events-none" style={{ color: color }}>
                              <Icon strokeWidth={1} className="w-full h-full" />
                           </div>
                        )}
                    </motion.div>
                </div>

                {/* Bottom Stats & Pins */}
                <div className="absolute bottom-0 inset-x-0 h-8 border-t border-[#1a1f26] flex items-center justify-between px-3 bg-[#0c1015]">
                    <div className="flex gap-1 items-center">
                        <div className={`w-1 h-3 ${isUnlocked ? 'bg-(--amber) animate-pulse' : 'bg-[#1a1f26]'}`} />
                        <span className="text-[7px] font-mono text-(--text-ghost) uppercase tracking-widest">
                            {isUnlocked ? 'Synced' : 'Locked'}
                        </span>
                    </div>

                    {/* Industrial Gold Pins - Matching DataCartridge style */}
                    <div className="h-2 w-16 flex justify-between px-0.5 pt-px bg-[#0a0a0a] border-t border-x border-[#1a1a1a] rounded-t-xs items-end self-end mb-0">
                         {[...Array(8)].map((_, i) => (
                             <div key={i} className="w-[8%] h-full rounded-t-[0.5px]"
                                 style={{
                                     background: 'linear-gradient(to bottom, #d4af37, #8a7322)',
                                     boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)'
                                 }} />
                         ))}
                    </div>

                    <div className="text-[6px] font-mono text-(--text-ghost) opacity-40 uppercase">
                        V_2.0
                    </div>
                </div>

                {/* Optical Overlay (Glass feel) */}
                <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent pointer-events-none" />
            </div>
        </div>
    )
}
