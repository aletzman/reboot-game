import { getObjects } from '@/services/objectsService'
import ObjectsArchiveClient from '@/components/collection/ObjectsArchiveClient'

export const metadata = {
  title: 'Artefactos Recuperados | REBOOT',
  description: 'Consulta las herramientas, credenciales y fragmentos arquitectónicos recuperados del refugio.',
}

export const dynamic = 'force-dynamic'

export default async function ObjectsArchivePage() {
  const objects = await getObjects()

  return <ObjectsArchiveClient initialObjects={objects} />
}
