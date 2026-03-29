import type { GameObject, ObjectType } from '@/types/game'

const BASE = '/api/objects'

export interface ObjectsResponse {
  total: number
  objects: GameObject[]
}

export interface SingleObjectResponse {
  object: GameObject
}

/**
 * Obtiene todos los objetos, opcionalmente filtrados por tipo y/o requerimiento.
 */
export async function getObjects(filters?: {
  type?: ObjectType
  required?: boolean
}): Promise<GameObject[]> {
  const params = new URLSearchParams()
  if (filters?.type) params.set('type', filters.type)
  if (filters?.required !== undefined) params.set('required', String(filters.required))

  const query = params.toString()
  const res = await fetch(`${BASE}${query ? `?${query}` : ''}`)

  if (!res.ok) throw new Error(`Error al obtener objetos: ${res.statusText}`)

  const data: ObjectsResponse = await res.json()
  return data.objects
}

/**
 * Obtiene un objeto específico por su ID.
 */
export async function getObjectById(id: string): Promise<GameObject | null> {
  const res = await fetch(`${BASE}/${encodeURIComponent(id)}`)

  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Error al obtener objeto: ${res.statusText}`)

  const data: SingleObjectResponse = await res.json()
  return data.object
}

/**
 * Obtiene solo los objetos requeridos (llaves, accesos).
 */
export async function getRequiredObjects(): Promise<GameObject[]> {
  return getObjects({ required: true })
}

/**
 * Obtiene objetos filtrados por tipo.
 */
export async function getObjectsByType(type: ObjectType): Promise<GameObject[]> {
  return getObjects({ type })
}
