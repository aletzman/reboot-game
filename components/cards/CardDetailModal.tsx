import { CloseButton } from '@/components/ui/CloseButton'
import { DataCartridge } from '@/components/cards/DataCartridge'
import type { Card } from '@/types/game'

interface CardDetailModalProps {
  selectedCard: Card | null
  onClose: () => void
}

export function CardDetailModal({ selectedCard, onClose }: CardDetailModalProps) {
  if (!selectedCard) return null;

  return (
    <div
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center p-4 bg-(--bg-void)/60"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col items-center gap-10"
      >
        {/* Header info bubble */}
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center gap-4 whitespace-nowrap">
          <div className="px-4 py-1.5 bg-(--green-darkest) border border-(--green-base) text-[10px] text-(--green-light) font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_var(--green-darkest)]">
            LÓGICA_DE_MEMORIA_AISLADA
          </div>
        </div>

        {/* Close Button UI */}
        <CloseButton
          onClick={onClose}
          className="absolute -top-20 right-0 md:right-0"
        />

        {/* THE CARD */}
        <div className="relative">
          <DataCartridge
            card={selectedCard}
            isPowered={false}
            detailed={true}
            onClick={onClose}
            viewTransitionId={`cartridge-${selectedCard.id}`}
            className="w-[280px] h-[390px] md:w-[360px] md:h-[540px] shadow-[0_0_100px_rgba(0,0,0,0.8)]"
          />
        </div>
      </div>
    </div>
  )
}
