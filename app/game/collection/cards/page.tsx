import { getCards } from '@/services/cardsService'
import CardsArchiveClient from '@/components/cards/CardsArchiveClient'

export const metadata = {
  title: 'Módulos de Datos | REBOOT',
  description: 'Explora y consulta los manuales técnicos y algoritmos de restauración recuperados.',
}

export const dynamic = 'force-dynamic'

export default async function CardsArchivePage() {
  let cards

  try {
    cards = await getCards()
  } catch (error) {
    console.error('[CardsArchivePage] Error fetching cards:', error)
    return (
      <div className="container mx-auto px-4 pb-8 flex flex-col items-center justify-center min-h-[60vh] bg-(--bg-void)">
        <p className="text-(--red) font-mono text-lg mb-2">
          ⚠ Error al cargar módulos de datos
        </p>
        <p className="text-(--text-muted) font-sans text-sm">
          No se pudo conectar con la base de datos. Verifica la conexión e intenta recargar.
        </p>
      </div>
    )
  }

  return <CardsArchiveClient initialCards={cards} />
}
