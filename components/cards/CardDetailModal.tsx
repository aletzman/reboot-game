import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { XIcon } from 'lucide-react'
import { DataCartridge } from '@/components/cards/DataCartridge'
import type { Card } from '@/types/game'

interface CardDetailModalProps {
  selectedCard: Card | null
  isFlipped: boolean
  onClose: () => void
  onFlip: () => void
}

export function CardDetailModal({ selectedCard, isFlipped, onClose, onFlip }: CardDetailModalProps) {
  return (
    <AnimatePresence>
      {selectedCard && (
        <div
          className="fixed inset-0 z-500 bg-black/95 flex flex-col items-center justify-center p-4 transition-opacity duration-300 cursor-pointer"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col items-center gap-10"
          >
            {/* Header info bubble */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-4 whitespace-nowrap">
              <div className="px-4 py-1.5 bg-(--green-darkest) border border-(--green-base) text-[10px] text-(--green-light) font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_var(--green-darkest)]">
                LÓGICA_DE_MEMORIA_AISLADA
              </div>
            </div>

            {/* Close Button UI */}
            <button
              className="absolute -top-16 right-0 md:-right-16 p-2 text-(--text-muted) hover:text-(--red) transition-all hover:rotate-90"
              onClick={onClose}
            >
              <XIcon size={32} strokeWidth={1} />
            </button>

            {/* THE CARD */}
            <div className="relative">
              <DataCartridge
                card={selectedCard}
                flipped={isFlipped}
                isPowered={true}
                detailed={true}
                onClick={onFlip}
                className="w-[280px] h-[390px] md:w-[360px] md:h-[540px] shadow-[0_0_100px_rgba(0,0,0,0.8)]"
              />
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="text-[11px] text-(--green-light) tracking-[.4em] uppercase font-bold text-center animate-pulse">
                [ ANALIZANDO_ESTRUCTURA_DE_DATOS ]
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
