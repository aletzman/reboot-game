import ActMapClient from '@/components/map/ActMapClient'
import { getLevelsByAct } from '@/services/levelsService'
import { SectorHeader } from '@/components/map/SectorHeader'
import SectorHeaderClient from '@/components/map/SectorHeaderClient'

export const dynamic = 'force-dynamic'

export default async function ActMapPage({ params }: { params: Promise<{ actId: string }> }) {
  const { actId } = await params
  const actNum = parseInt(actId, 10)

  let levels
  let actName = 'ACT_ERROR'

  try {
    levels = await getLevelsByAct(actNum)
    actName = levels.find(level => level.act === actNum)?.actName || 'ACT_ERROR'
  } catch (error) {
    console.error('[ActMapPage] Error fetching levels:', error)
    return (
      <div className="container mx-auto px-4 pb-8 flex flex-col items-center justify-center min-h-[60vh] bg-(--bg-void)">
        <p className="text-(--red) font-mono text-lg mb-2">
          ⚠ Error al cargar niveles
        </p>
        <p className="text-(--text-muted) font-sans text-sm">
          No se pudo conectar con la base de datos. Verifica la conexión e intenta recargar.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 pb-8 flex flex-col gap-4 bg-(--bg-void)">
      {/* Header Shell (Server-side rendered for instant Title) */}
      <SectorHeader actId={actId} actName={actName}>
        {/* Dynamic header stats (Client-side) */}
        <SectorHeaderClient actId={actId} levels={levels} />
      </SectorHeader>

      {/* Main levels list (Client-side) */}
      <ActMapClient key={actId} actId={actId} levels={levels} />
    </div>
  )
}
