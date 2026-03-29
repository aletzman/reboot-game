import LevelPage from '@/components/levels/LevelPage'
import { getLevelById, getLevels } from '@/services/levelsService'
import { getCards } from '@/services/cardsService'
import { getObjects } from '@/services/objectsService'
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ actId: string, id: string }> }) {
  const { id } = await params

  // Fetch everything on server (using cache)
  const [level, allLevels, allCards, allObjects] = await Promise.all([
    getLevelById(id),
    getLevels(),
    getCards(),
    getObjects()
  ])

  if (!level) notFound()

  return (
    <LevelPage
      initialLevel={level}
      allLevels={allLevels}
      allCards={allCards}
      allObjects={allObjects}
    />
  )
}
