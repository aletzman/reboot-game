import LevelPage from '@/components/levels/LevelPage'
import { getLevelById, getLevels } from '@/services/levelsService'
import { getCards } from '@/services/cardsService'
import { getObjects } from '@/services/objectsService'
import { notFound } from 'next/navigation'
import { Card, GameObject, Level } from '@/types/game'


// FUNCIÓN DE TEST: Extrae datos directamente de los JSON locales (data/)
async function getLocalTestData(id: string) {
  const levelsData = (await import('@/data/levels.json')).default;
  const cardsData = (await import('@/data/cards.json')).default;
  const objectsData = (await import('@/data/objects.json')).default;

  return {
    level: levelsData.levels.find((l: any) => l.id === id),
    allLevels: levelsData.levels,
    allCards: cardsData.cards,
    allObjects: objectsData.objects
  };
}

export default async function Page({ params }: { params: Promise<{ actId: string, id: string }> }) {
  const { id } = await params

  // --- MODO PRODUCCIÓN (Supabase) ---
  /*let [level, allLevels, allCards, allObjects] = await Promise.all([
    getLevelById(id),
    getLevels(),
    getCards(),
    getObjects()
  ])*/

  // --- MODO TESTING (Local JSON) ---
  const testData = await getLocalTestData(id);
  let level = testData.level as Level;
  let allLevels = testData.allLevels as Level[];
  let allCards = testData.allCards as Card[];
  let allObjects = testData.allObjects as GameObject[];

  if (!level) notFound()

  return (
    <LevelPage
      key={id}
      initialLevel={level}
      allLevels={allLevels}
      allCards={allCards}
      allObjects={allObjects}
    />
  )
}
