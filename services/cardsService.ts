import type { Card, CardRarity } from '@/types/game'

import { getBaseUrl } from './baseUrl'

const BASE = () => `${getBaseUrl()}/api/cards`

export interface CardsResponse {
  total: number
  cards: Card[]
}

export interface SingleCardResponse {
  card: Card
}

/**
 * Obtiene todas las cartas, opcionalmente filtradas por rareza y/o acto.
 */
export async function getCards(filters?: {
  rarity?: CardRarity
  actName?: string
}): Promise<Card[]> {
  const params = new URLSearchParams()
  if (filters?.rarity) params.set('rarity', filters.rarity)
  if (filters?.actName) params.set('actName', filters.actName)

  const query = params.toString()
  const res = await fetch(`${BASE()}${query ? `?${query}` : ''}`, { cache: 'force-cache' })

  if (!res.ok) throw new Error(`Error al obtener cartas: ${res.statusText}`)

  const data: CardsResponse = await res.json()
  return data.cards
}

/**
 * Obtiene una carta específica por su ID.
 */
export async function getCardById(id: string): Promise<Card | null> {
  const res = await fetch(`${BASE()}/${encodeURIComponent(id)}`, { cache: 'force-cache' })

  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Error al obtener carta: ${res.statusText}`)

  const data: SingleCardResponse = await res.json()
  return data.card
}

/**
 * Obtiene cartas filtradas por rareza.
 */
export async function getCardsByRarity(rarity: CardRarity): Promise<Card[]> {
  return getCards({ rarity })
}

/**
 * Obtiene cartas filtradas por nombre de acto.
 */
export async function getCardsByAct(actName: string): Promise<Card[]> {
  return getCards({ actName })
}
