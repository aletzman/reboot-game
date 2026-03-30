"use client"

import { useState, useEffect } from 'react'
import { flushSync } from 'react-dom'
import { getUnlockedCards } from '@/lib/gameState'
import { SectorHeader } from '@/components/map/SectorHeader'
import type { Card } from '@/types/game'

import { CardRackSlot } from '@/components/cards/CardRackSlot'
import { CardDetailModal } from '@/components/cards/CardDetailModal'

import { Loading } from '@/components/ui/Loading'

interface CardsArchiveClientProps {
  initialCards: Card[]
}

export default function CardsArchiveClient({ initialCards }: CardsArchiveClientProps) {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([])
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUnlockedIds(getUnlockedCards())
    setLoading(false)
  }, [])

  if (loading) {
    return <Loading message="CARGANDO MÓDULOS..." icon="database" />
  }

  return (
    <div className="flex-1 flex flex-col bg-(--bg-void) relative font-sans">
      <main className="flex-1 container mx-auto px-8 relative z-10 flex flex-col">
        <SectorHeader
          actId="01"
          actName="MÓDULOS DE DATOS"
          idLabel="RACK"
          tag="RACK_CONNECTED"
          subtitle="ANÁLISIS DE SOFTWARE // TERMINAL SECUNDARIA"
          backHref="/game/collection"
          backLabel="ALMACÉN"
        >
          <div className="hidden md:flex flex-col items-end justify-center gap-2 border-l border-[#1a2636]/60 p-5 md:p-6 bg-[#0c1218]/40 min-w-[260px]">
            <div className="flex gap-[3px] w-full justify-between">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-3 skew-x-[-15deg] transition-all duration-500 ${i < (unlockedIds.length / initialCards.length * 12) ? 'bg-(--green-base) shadow-[0_0_8px_var(--green-base)] brightness-150' : 'bg-[#1a2636]'}`}
                />
              ))}
            </div>
            <div className="font-mono text-[8px] text-(--green-muted) uppercase tracking-widest flex items-center justify-between w-full mt-1.5 opacity-60">
              <span>RECUPERADOS</span>
              <span className="text-white font-bold text-[9px] tracking-[0.2em]">{unlockedIds.length} <span className="text-[#1a2636] px-1">/</span> {initialCards.length}</span>
            </div>
          </div>
        </SectorHeader>
        {/* The Grid of Rack-Connected Cartridges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-8 gap-y-16 pb-32">
          {initialCards.map((card, idx) => {
            const isUnlocked = unlockedIds.includes(card.id)

            return (
              <CardRackSlot
                key={card.id}
                card={card}
                idx={idx}
                isUnlocked={isUnlocked}
                isSelected={selectedCard?.id === card.id}
                onSelect={(card) => {
                  const updateState = () => {
                    setSelectedCard(card);
                  }
                  // @ts-ignore
                  if (!document.startViewTransition) {
                    updateState();
                    return;
                  }
                  // @ts-ignore
                  document.startViewTransition(() => {
                    flushSync(() => {
                      updateState();
                    });
                  });
                }}
              />
            )
          })}
        </div>
      </main>
      
      {/* MODAL */}
      <CardDetailModal
        selectedCard={selectedCard}
        onClose={() => {
          // @ts-ignore
          if (!document.startViewTransition) {
            setSelectedCard(null);
            return;
          }
          // @ts-ignore
          document.startViewTransition(() => {
            flushSync(() => {
              setSelectedCard(null);
            });
          });
        }}
      />
    </div>
  )
}
