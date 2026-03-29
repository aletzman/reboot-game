import type { RoadmapPhase } from '@/types/game'

import { getBaseUrl } from './baseUrl'

const BASE = () => `${getBaseUrl()}/api/roadmap`

export interface Roadmap {
  fase1_el_lenguaje: RoadmapPhase
  fase2_dom_y_navegador: RoadmapPhase
  fase3_javascript_moderno: RoadmapPhase
  fase4_poo: RoadmapPhase
  fase5_avanzado: RoadmapPhase
}

/**
 * Obtiene el roadmap pedagógico completo.
 */
export async function getRoadmap(): Promise<Roadmap> {
  const res = await fetch(BASE(), { cache: 'force-cache' })

  if (!res.ok) throw new Error(`Error al obtener roadmap: ${res.statusText}`)

  return res.json()
}

/**
 * Obtiene una fase específica del roadmap por su clave.
 */
export async function getRoadmapPhase(
  phase: keyof Roadmap
): Promise<RoadmapPhase> {
  const data = await getRoadmap()
  return data[phase]
}
