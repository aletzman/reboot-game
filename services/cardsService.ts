import { unstable_cache } from 'next/cache'
import { supabasePublic } from '@/lib/supabase/public'
import type { Card, CardRarity } from '@/types/game'

export const getCards = unstable_cache(
  async (filters?: { rarity?: CardRarity; actName?: string }): Promise<Card[]> => {
    let query = supabasePublic.from('cards').select('*')

    if (filters?.rarity) {
      query = query.eq('rarity', filters.rarity)
    }
    if (filters?.actName) {
      query = query.eq('actName', filters.actName)
    }

    const { data, error } = await query
    if (error) throw new Error(`Error al obtener cartas: ${error.message}`)

    return data as Card[]
  },
  ['cards_list'],
  { revalidate: 3600, tags: ['cards'] }
)

export const getCardById = unstable_cache(
  async (id: string): Promise<Card | null> => {
    const { data, error } = await supabasePublic
      .from('cards')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error al obtener carta: ${error.message}`)
    }

    return data as Card | null
  },
  ['card_by_id'],
  { revalidate: 3600, tags: ['cards'] }
)

export async function getCardsByRarity(rarity: CardRarity): Promise<Card[]> {
  return getCards({ rarity })
}

export async function getCardsByAct(actName: string): Promise<Card[]> {
  return getCards({ actName })
}
