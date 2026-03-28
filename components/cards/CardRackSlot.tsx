"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { LockIcon } from 'lucide-react'
import { DataCartridge } from '@/components/cards/DataCartridge'
import type { Card } from '@/types/game'

interface CardRackSlotProps {
  card: Card
  idx: number
  isUnlocked: boolean
  onSelect: (c: Card) => void
}

export function CardRackSlot({ card, idx, isUnlocked, onSelect }: CardRackSlotProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Determine LED status: On when it's unlocked and not actively being pulled out.
  const isConnected = isUnlocked && !isHovered

  // Define rarity glow colour based on custom properties as used in the cartridge
  const glowColor = isUnlocked ? (
    card.rarity === 'legendary' ? '#ffdd00' :
      card.rarity === 'epic' ? 'var(--purple)' :
        card.rarity === 'rare' ? 'var(--amber)' :
          'var(--blue)'
  ) : 'var(--text-ghost)'

  return (
    <motion.div
      className="flex flex-col pt-4 relative group/rackslot"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: idx * 0.03 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background connector traces tracing from the top */}
      <div className="absolute top-0 inset-x-0 h-4 flex justify-center opacity-20 group-hover/rackslot:opacity-40 transition-opacity">
        <div className="w-px h-full bg-(--green-base) mx-auto" />
      </div>

      {/* RACK CASE UNIT */}
      <div className="relative z-10 w-full aspect-2/3 bg-linear-to-b from-[#0c1218] to-[#040608] border border-[#1a2636] shadow-2xl p-2 pb-10 rounded-xs transition-all">

        {/* Visual Slot Hole */}
        <div className="absolute inset-2 bottom-6 bg-[#010203] shadow-[inset_0_5px_20px_rgba(0,0,0,1)] rounded-xs overflow-hidden border border-[#0a0f14]">
          {!isUnlocked && (
            <div className="flex-1 flex flex-col items-center justify-center h-full">
              <LockIcon className="w-5 h-5 text-[#1a2636]" strokeWidth={1.5} />
            </div>
          )}

          {/* Internal Connector Pins visible when card is extracted or locked */}
          <div className="absolute bottom-0 inset-x-2 h-4 border-t border-[#1a2636]/50 flex justify-between px-1 opacity-20">
            {[...Array(14)].map((_, i) => (
              <div key={`pin-${i}`} className="w-[4%] h-[80%] bg-[#d4af37] rounded-sm mt-auto shadow-[0_0_2px_#d4af37]" />
            ))}
          </div>
        </div>

        {/* THE CARD - Positioned BEHIND the bar front panel */}
        <AnimatePresence>
          {isUnlocked && (
            <div
              className={`absolute z-15 left-2 right-2 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isHovered ? '-translate-y-8 drop-shadow-[0_20px_40px_rgba(0,0,0,1)]' : 'translate-y-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]'}`}
              style={{
                bottom: '4px',
                height: 'calc(100% - 10px)'
              }}
              onClick={() => onSelect(card)}
            >
              <DataCartridge
                card={card}
                isPowered={isConnected}
                detailed={false}
                delay={0}
                className="w-full h-full"
              />
            </div>
          )}
        </AnimatePresence>

        {/* RACK FRONT PANEL / CONNECTION BAR */}
        <div className="absolute bottom-2 inset-x-2 h-16 z-25 pointer-events-none flex flex-col justify-end overflow-visible">

          {/* Connecting Glow underneath the panel when connected */}
          {isConnected && (
            <div
              className="absolute bottom-10 inset-x-4 h-4 blur-md opacity-30 transition-opacity duration-300"
              style={{ backgroundColor: glowColor }}
            />
          )}

          <div className={`h-11 bg-linear-to-b from-[#0c1218] to-[#06080b] border-t border-[#2a3a4c] shadow-[0_-10px_30px_rgba(0,0,0,1)] relative flex flex-col items-center justify-center px-2 transition-colors ${isConnected ? 'border-t-[1.5px]' : ''}`} style={{ borderTopColor: isConnected ? glowColor : '#2a3a4c' }}>

            {/* Tornillos */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-black border border-white/10 shadow-inner" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-black border border-white/10 shadow-inner" />

            {/* Status LED of the Rack itself */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
              <div
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isConnected ? 'animate-pulse' : ''}`}
                style={{
                  backgroundColor: isConnected ? glowColor : '#10151a',
                  boxShadow: isConnected ? `0 0 10px ${glowColor}, 0 0 5px ${glowColor}` : 'none'
                }}
              />
              <span className="text-[5px] text-white/30 uppercase tracking-widest leading-none">LINK</span>
            </div>

            <div className="text-[7px] text-white/40 uppercase font-mono tracking-[0.2em] font-black w-full text-center mt-0.5">
              PORT_0{idx + 1}
            </div>

            <div className="w-[60%] h-px bg-white/5 mt-1 relative">
              {isConnected && (
                <div
                  className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1/3 blur-[1px]"
                  style={{ backgroundColor: glowColor }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Industrial Side Details */}
        <div className="absolute -left-1.5 top-2 bottom-8 w-1 bg-[#1a2636]/20 border-l border-[#1a2636]/40" />
        <div className="absolute -right-1.5 top-2 bottom-8 w-1 bg-[#1a2636]/20 border-r border-[#1a2636]/40" />
      </div>

      {/* Connection lines to the label (Module wiring) */}
      <div className="flex flex-col items-center opacity-60">
        <div className={`w-0.5 h-4 transition-colors duration-300`} style={{ backgroundColor: isConnected ? glowColor : '#1a2636' }} />
        <div className={`w-4 h-0.5 transition-colors duration-300`} style={{ backgroundColor: isConnected ? glowColor : '#1a2636' }} />
        <div className={`w-0.5 h-2 transition-colors duration-300`} style={{ backgroundColor: isConnected ? glowColor : '#1a2636' }} />
      </div>

      {/* Label below the rack unit */}
      <div className={`px-2 py-1 border text-center rounded-xs transition-colors duration-300 backdrop-blur-sm z-10 w-[90%] mx-auto ${isUnlocked ? (isHovered ? 'bg-[#141b24] border-(--green-base)/30' : 'bg-[#0a0f14] border-white/5') : 'bg-black border-red-900/20'}`}>
        <h3 className={`text-[9px] font-black uppercase tracking-widest line-clamp-1 ${isUnlocked ? (isHovered ? 'text-(--green-light)' : 'text-white') : 'text-[#1a1a1a]'}`}>
          {isUnlocked ? card.name : 'ENCRYPTED'}
        </h3>
        <div className={`text-[6px] tracking-widest mt-0.5 ${isUnlocked ? 'text-(--text-muted)' : 'text-red-900/30'}`}>
          {isUnlocked ? `MOD//${card.concept.substring(0, 6)}` : 'UNKNOWN_MOD'}
        </div>
      </div>
    </motion.div>
  )
}
