"use client"

import { useState, useEffect, memo, ViewTransition } from 'react'
import { LockIcon } from 'lucide-react'
import { DataCartridge } from '@/components/cards/DataCartridge'
import type { Card } from '@/types/game'

interface CardRackSlotProps {
  card: Card
  idx: number
  isUnlocked: boolean
  isSelected: boolean
  onSelect: (c: Card) => void
}

export const CardRackSlot = memo(({ card, idx, isUnlocked, isSelected, onSelect }: CardRackSlotProps) => {
  const [isHovered, setIsHovered] = useState(false)

  // FIX: When card returns from modal (isSelected goes false), 
  // reset hover so it slides back into its slot immediately.
  useEffect(() => {
    if (!isSelected) {
      setIsHovered(false)
    }
  }, [isSelected])

  const isConnected = isUnlocked && !isHovered

  const glowColor = isUnlocked ? (
    card.rarity === 'legendary' ? '#ffdd00' :
      card.rarity === 'epic' ? 'var(--purple)' :
        card.rarity === 'rare' ? 'var(--amber)' :
          'var(--blue)'
  ) : 'var(--text-ghost)'

  return (
    <div
      className="flex flex-col pt-4 relative group/rackslot animate-[fade-in-up_0.4s_ease-out_both]"
      style={{ animationDelay: `${idx * 15}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background connector traces */}
      <div className="absolute top-0 inset-x-0 h-4 flex justify-center opacity-10 group-hover/rackslot:opacity-30 transition-opacity">
        <div className="w-px h-full bg-(--green-base) mx-auto" />
      </div>

      {/* RACK CASE UNIT */}
      <div className="relative z-10 w-full aspect-2/3 bg-linear-to-b from-[#0c1218] to-[#040608] border border-[#1a2636] shadow-2xl p-2 pb-10 rounded-xs">

        {/* Visual Slot Hole */}
        <div className="absolute inset-2 bottom-6 bg-[#010203] shadow-[inset_0_5px_20px_rgba(0,0,0,1)] rounded-xs overflow-hidden border border-[#0a0f14]">
          {!isUnlocked && (
            <div className="flex-1 flex flex-col items-center justify-center h-full">
              <LockIcon className="w-5 h-5 text-[#1a2636]" strokeWidth={1.5} />
            </div>
          )}
          <div className="absolute bottom-0 inset-x-2 h-4 border-t border-[#1a2636]/40 flex justify-between px-1 opacity-20">
            {[...Array(14)].map((_, i) => (
              <div key={`pin-${i}`} className="w-[4%] h-[80%] bg-[#d4af37] rounded-sm mt-auto" />
            ))}
          </div>
        </div>

        {/* THE CARD — ViewTransition for shared element morphing */}
        {isUnlocked && !isSelected && (
          <ViewTransition name={`cartridge-${card.id}`}>
            <div
              className={`absolute z-15 left-2 right-2 cursor-pointer transition-transform duration-500 will-change-transform ease-[cubic-bezier(0.16,1,0.3,1)] ${isHovered ? '-translate-y-8' : 'translate-y-0'}`}
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
          </ViewTransition>
        )}

        {/* RACK FRONT PANEL / CONNECTION BAR */}
        <div
          className="absolute bottom-0 inset-x-2 h-16 z-25 flex flex-col justify-end overflow-visible transition-all duration-300 ease-in-out"
          style={{
            transformOrigin: 'bottom',
            perspective: '1000px',
            transform: isSelected ? 'perspective(1000px) rotateX(-65deg) translateY(10px)' : 'perspective(1000px) rotateX(0deg) translateY(0)',
            opacity: isSelected ? 0.7 : 1,
            pointerEvents: isSelected ? 'none' : 'auto'
          }}
        >
          {isConnected && (
            <div
              className="absolute bottom-10 inset-x-4 h-4 opacity-30 transition-opacity duration-300"
              style={{ backgroundColor: glowColor }}
            />
          )}

          <div className={`h-11 bg-linear-to-b from-[#0c1218] to-[#06080b] border-t border-[#2a3a4c] shadow-[0_-10px_30px_rgba(0,0,0,1)] relative flex flex-col items-center justify-center px-2 transition-colors ${isConnected ? 'border-t-[1.5px]' : ''}`} style={{ borderTopColor: isConnected ? glowColor : '#2a3a4c' }}>
            <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-black border border-white/10 shadow-inner" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-black border border-white/10 shadow-inner" />

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
                  className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1/3"
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

      {/* Connection lines */}
      <div className="flex flex-col items-center opacity-40">
        <div className="w-0.5 h-4 transition-colors duration-300" style={{ backgroundColor: isConnected ? glowColor : '#1a2636' }} />
        <div className="w-4 h-0.5 transition-colors duration-300" style={{ backgroundColor: isConnected ? glowColor : '#1a2636' }} />
        <div className="w-0.5 h-2 transition-colors duration-300" style={{ backgroundColor: isConnected ? glowColor : '#1a2636' }} />
      </div>

      {/* Label */}
      <div className={`px-2 py-1 border text-center rounded-xs transition-colors duration-300 z-10 w-[90%] mx-auto ${isUnlocked ? (isHovered ? 'bg-[#141b24] border-(--green-base)/30' : 'bg-[#0a0f14] border-white/5') : 'bg-black border-red-900/20'}`}>
        <h3 className={`text-[9px] font-black uppercase tracking-widest line-clamp-1 ${isUnlocked ? (isHovered ? 'text-(--green-light)' : 'text-white') : 'text-[#1a1a1a]'}`}>
          {isUnlocked ? card.name : 'ENCRYPTED'}
        </h3>
        <div className={`text-[6px] tracking-widest mt-0.5 ${isUnlocked ? 'text-(--text-muted)' : 'text-red-900/30'}`}>
          {isUnlocked ? `MOD//${card.concept.substring(0, 6)}` : 'UNKNOWN_MOD'}
        </div>
      </div>
    </div>
  )
}, (prev, next) => {
  return prev.card.id === next.card.id &&
    prev.isUnlocked === next.isUnlocked &&
    prev.isSelected === next.isSelected &&
    prev.idx === next.idx
})

CardRackSlot.displayName = 'CardRackSlot'
