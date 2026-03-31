"use client"

import { useState, useEffect, useCallback, startTransition } from 'react'
import { hasCard, getUnlockedCards } from '@/lib/gameState'
import { isDemoModeActive } from '@/lib/store/useDemoStore'
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
    const ids = getUnlockedCards()
    if (isDemoModeActive()) {
      setUnlockedIds(initialCards.slice(0, 6).map(c => c.id))
    } else {
      setUnlockedIds(ids)
    }
    setLoading(false)
  }, [initialCards])

  // React 19: Use startTransition to trigger ViewTransition animations.
  // NO manual document.startViewTransition or flushSync needed!
  const handleSelect = useCallback((card: Card) => {
    startTransition(() => {
      setSelectedCard(card)
    })
  }, [])

  const handleClose = useCallback(() => {
    startTransition(() => {
      setSelectedCard(null)
    })
  }, [])

  if (loading) {
    return <Loading message="CARGANDO MÓDULOS..." icon="database" />
  }

  return (
    <div className="flex-1 flex flex-col bg-(--bg-void) relative font-sans">
      <main className="flex-1 container mx-auto px-8 pb-12 relative z-10 flex flex-col">
        <SectorHeader
          actId="01"
          actName="CARTAS"
          idLabel="MOD"
          tag="STORAGE_RELIABILITY_OK"
          subtitle="ARCHIVO DE MÓDULOS LÓGICOS // RESTAURACIÓN DINÁMICA"
          variant="blue"
          backHref="/game/collection"
          backLabel="ALMACÉN"
        >
          <div className="hidden md:flex flex-col items-end justify-center gap-2 border-l border-[#1a2636]/60 p-5 md:p-6 bg-[#0c1218]/40 min-w-[260px]">
            <div className="flex gap-[3px] w-full justify-between">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-3 skew-x-[-15deg] transition-all duration-500 ${i < (unlockedIds.length / initialCards.length * 15) ? 'bg-(--blue) shadow-[0_0_8px_var(--blue)] brightness-150' : 'bg-[#1a2636]'}`}
                />
              ))}
            </div>
            <div className="font-mono text-[8px] text-(--blue) uppercase tracking-widest flex items-center justify-between w-full mt-1.5 opacity-60">
              <span>MÓDULOS_SINCRONIZADOS</span>
              <span className="text-white font-bold text-[9px] tracking-[0.2em]">{unlockedIds.length} <span className="text-[#1a2636] px-1">/</span> {initialCards.length}</span>
            </div>
          </div>
        </SectorHeader>

        {/* The Grid of Rack-Connected Cartridges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-x-8 gap-y-16 pb-32">
          {initialCards.map((card, idx) => {
            const isUnlocked = hasCard(card.id)

            return (
              <CardRackSlot
                key={card.id}
                card={card}
                idx={idx}
                isUnlocked={isUnlocked}
                isSelected={selectedCard?.id === card.id}
                onSelect={handleSelect}
              />
            )
          })}
        </div>
      </main>

      <CardDetailModal
        selectedCard={selectedCard}
        onClose={handleClose}
      />
    </div>
  )
}
