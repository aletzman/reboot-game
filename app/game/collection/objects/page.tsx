import { getObjects } from '@/services/objectsService'
import ObjectsArchiveClient from '@/components/collection/ObjectsArchiveClient'

export const metadata = {
  title: 'Artefactos Recuperados | REBOOT',
  description: 'Consulta las herramientas, credenciales y fragmentos arquitectónicos recuperados del refugio.',
}

export const dynamic = 'force-dynamic'

export default async function ObjectsArchivePage() {
  let objects

  try {
    objects = await getObjects()
  } catch (error) {
    console.error('[ObjectsArchivePage] Error fetching objects:', error)
    return (
      <div className="container mx-auto px-4 pb-8 flex flex-col items-center justify-center min-h-[60vh] bg-(--bg-void)">
        <p className="text-(--red) font-mono text-lg mb-2">
          ⚠ Error al cargar artefactos
        </p>
        <p className="text-(--text-muted) font-sans text-sm">
          No se pudo conectar con la base de datos. Verifica la conexión e intenta recargar.
        </p>
      </div>
    )
  }

  return <ObjectsArchiveClient initialObjects={objects} />
}
