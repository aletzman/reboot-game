import { getCards } from '@/services/cardsService'
import CardsArchiveClient from '@/components/cards/CardsArchiveClient'

export const metadata = {
  title: 'Módulos de Datos | REBOOT',
  description: 'Explora y consulta los manuales técnicos y algoritmos de restauración recuperados.',
}

export const dynamic = 'force-dynamic'

export default async function CardsArchivePage() {
  const cards = await getCards()

  return <CardsArchiveClient initialCards={cards} />
}
