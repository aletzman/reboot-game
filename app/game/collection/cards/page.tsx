"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayersIcon, ChevronLeftIcon } from 'lucide-react'
import { getUnlockedCards } from '@/lib/gameState'
import cardsData from '@/data/cards.json'
import { Header } from '@/components/ui/Header'
import { NavButton } from '@/components/ui/NavButton'
import type { Card } from '@/types/game'

import { CardRackSlot } from '@/components/cards/CardRackSlot'
import { CardDetailModal } from '@/components/cards/CardDetailModal'

export default function CardsArchivePage() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([])
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    setUnlockedIds(getUnlockedCards())
  }, [])

  const cards = cardsData.cards as Card[]

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-47px)] bg-(--bg-void) relative overflow-y-auto font-sans custom-scrollbar">
      <main className="flex-1 container mx-auto px-8 pb-12 pt-6 relative z-10 flex flex-col">
        <header className="mb-14 relative flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <NavButton href="/game/collection" icon={ChevronLeftIcon}>
              TERMINAL_CENTRAL
            </NavButton>
          </div>

          <div className="w-full bg-linear-to-r from-[#0c1218] to-transparent border-l-4 border-(--green-base) p-6 rounded-r-md flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden shadow-xl">
            {/* Fondo simulando rejilla técnica sutil */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.01)_3px)] pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-full bg-[radial-gradient(ellipse_at_right,rgba(45,120,0,0.05),transparent_70%)] pointer-events-none" />

            {/* Decoración tech */}
            <div className="absolute top-0 left-0 w-8 h-px bg-(--green-light) shadow-[0_0_5px_var(--green-light)]" />
            <div className="absolute bottom-0 left-0 w-16 h-px bg-(--green-light) shadow-[0_0_5px_var(--green-light)]" />

            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center gap-3 font-mono">
                <div className="w-2 h-2 rounded-full bg-(--green-base) animate-pulse shadow-[0_0_8px_var(--green-base)]" />
                <span className="text-[10px] text-(--green-muted) uppercase font-black tracking-[0.4em] leading-none text-nowrap">
                  SYS.ARCHIVE // RACK DE CONEXIÓN
                </span>
              </div>

              <div className="flex items-end gap-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-(family-name:--font-title) tracking-tighter text-white uppercase leading-none drop-shadow-md">
                  MÓDULOS DE DATOS
                </h1>
                <div className="hidden lg:flex flex-col gap-0.5 opacity-20 mb-1">
                  <div className="w-16 h-1 bg-white" />
                  <div className="w-12 h-[2px] bg-white" />
                  <div className="flex gap-1 h-3 mt-0.5">
                    <div className="w-1 h-full bg-white" />
                    <div className="w-3 h-full bg-white" />
                    <div className="w-0.5 h-full bg-white" />
                    <div className="w-2 h-full bg-(--green-base)" />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex flex-col items-end gap-2 bg-[#080c11] border border-[#1a2636] p-4 rounded-xs shadow-[inset_0_2px_15px_rgba(0,0,0,0.8)] min-w-[200px] md:min-w-[260px]">
              <div className="flex gap-[3px] w-full justify-between">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-5 skew-x-[-15deg] transition-all duration-500 ${i < (unlockedIds.length / cards.length * 12) ? 'bg-(--green-base) shadow-[0_0_8px_var(--green-base)] brightness-150' : 'bg-[#1a2636]'}`}
                  />
                ))}
              </div>
              <div className="font-mono text-[9px] text-(--green-muted) uppercase tracking-widest flex items-center justify-between w-full mt-2 border-t border-[#1a2636] pt-3">
                <span>RECURSOS_RECUPERADOS</span>
                <span className="text-white font-bold text-[10px] tracking-[0.2em]">{unlockedIds.length} <span className="text-[#1a2636] px-1">/</span> {cards.length}</span>
              </div>
            </div>
          </div>
        </header>

        {/* The Grid of Rack-Connected Cartridges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-8 gap-y-16 pb-32">
          {cards.map((card, idx) => {
            const isUnlocked = unlockedIds.includes(card.id)

            return (
              <CardRackSlot
                key={card.id}
                card={card}
                idx={idx}
                isUnlocked={isUnlocked}
                onSelect={(card) => {
                  setSelectedCard(card);
                  setIsFlipped(false);
                }}
              />
            )
          })}
        </div>
      </main>

      {/* MODAL */}
      <CardDetailModal
        selectedCard={selectedCard}
        isFlipped={isFlipped}
        onClose={() => setSelectedCard(null)}
        onFlip={() => setIsFlipped(!isFlipped)}
      />
    </div>
  )
} 
