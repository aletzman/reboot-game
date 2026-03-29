import type { GlossaryTerm } from '@/types/game'

import { getBaseUrl } from './baseUrl'

const BASE = () => `${getBaseUrl()}/api/glossary`

export interface GlossaryResponse {
  total: number
  terms: GlossaryTerm[]
}

export interface SingleTermResponse {
  term: GlossaryTerm
}

/**
 * Obtiene todos los términos del glosario, opcionalmente con búsqueda parcial.
 */
export async function getGlossary(search?: string): Promise<GlossaryTerm[]> {
  const params = new URLSearchParams()
  if (search) params.set('search', search)

  const query = params.toString()
  const res = await fetch(`${BASE()}${query ? `?${query}` : ''}`, { cache: 'force-cache' })

  if (!res.ok) throw new Error(`Error al obtener glosario: ${res.statusText}`)

  const data: GlossaryResponse = await res.json()
  return data.terms
}

/**
 * Obtiene un término específico por su ID.
 */
export async function getGlossaryTerm(id: string): Promise<GlossaryTerm | null> {
  const res = await fetch(`${BASE()}/${encodeURIComponent(id)}`, { cache: 'force-cache' })

  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Error al obtener término: ${res.statusText}`)

  const data: SingleTermResponse = await res.json()
  return data.term
}

/**
 * Busca términos del glosario por texto parcial.
 */
export async function searchGlossary(query: string): Promise<GlossaryTerm[]> {
  return getGlossary(query)
}
