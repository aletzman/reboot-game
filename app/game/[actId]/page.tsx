import ActMapClient from '@/components/map/ActMapClient'
import { getLevelsByAct } from '@/services/levelsService'

export default async function ActMapPage({ params }: { params: Promise<{ actId: string }> }) {
  const { actId } = await params
  const actNum = parseInt(actId, 10)

  const levels = await getLevelsByAct(actNum)

  return <ActMapClient actId={actId} levels={levels} />
}
