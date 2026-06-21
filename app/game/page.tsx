import { getLevels } from '@/services/levelsService'
import GameMapClient from '@/components/map/GameMapClient'

export const metadata = {
  title: 'Mapa de Sectores | REBOOT',
  description: 'Explora los sectores fragmentados y restaura la red global.',
}

export const dynamic = 'force-dynamic'

export default async function GameMapPage() {
  let levels

  try {
    levels = await getLevels()
  } catch (error) {
    console.error('[GameMapPage] Error fetching levels:', error)
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

  return <GameMapClient levels={levels} />
}
