import type { Level, LevelType } from '@/types/game'
import { getBaseUrl } from './baseUrl'

const BASE = () => `${getBaseUrl()}/api/levels`

export interface LevelsResponse {
  total: number
  levels: Level[]
}

export interface SingleLevelResponse {
  level: Level
}

/**
 * Obtiene todos los niveles, opcionalmente filtrados por acto y/o tipo.
 */
export async function getLevels(filters?: {
  act?: number
  type?: LevelType
}): Promise<Level[]> {
  const params = new URLSearchParams()
  if (filters?.act !== undefined) params.set('act', String(filters.act))
  if (filters?.type) params.set('type', filters.type)

  const query = params.toString()
  const res = await fetch(`${BASE()}${query ? `?${query}` : ''}`, { cache: 'force-cache' })

  if (!res.ok) throw new Error(`Error al obtener niveles: ${res.statusText}`)

  const data: LevelsResponse = await res.json()
  return data.levels
}

/**
 * Obtiene un nivel específico por su ID.
 */
export async function getLevelById(id: string): Promise<Level | null> {
  const res = await fetch(`${BASE()}/${encodeURIComponent(id)}`, { cache: 'force-cache' })

  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Error al obtener nivel: ${res.statusText}`)

  const data: SingleLevelResponse = await res.json()
  return data.level
}

/**
 * Obtiene todos los niveles de un acto específico.
 */
export async function getLevelsByAct(act: number): Promise<Level[]> {
  return getLevels({ act })
}

/**
 * Obtiene todos los niveles de un tipo específico.
 */
export async function getLevelsByType(type: LevelType): Promise<Level[]> {
  return getLevels({ type })
}
