import { getLevels } from '@/services/levelsService'
import GameMapClient from '@/components/map/GameMapClient'

export const metadata = {
  title: 'Mapa de Sectores | REBOOT',
  description: 'Explora los sectores fragmentados y restaura la red global.',
}

export const dynamic = 'force-dynamic'

export default async function GameMapPage() {
  const levels = await getLevels()


  return <GameMapClient levels={levels} />
}
