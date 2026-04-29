import { unstable_cache } from 'next/cache'
import { supabasePublic } from '@/lib/supabase/public'
import type { Level, LevelType } from '@/types/game'

export const getLevels = unstable_cache(
  async (filters?: { act?: number; type?: LevelType }): Promise<Level[]> => {
    let query = supabasePublic.from('levels').select('*')

    if (filters?.act !== undefined) {
      query = query.eq('act', filters.act)
    }
    if (filters?.type) {
      query = query.eq('type', filters.type)
    }

    query = query.order('id', { ascending: true })

    const { data, error } = await query
    if (error) throw new Error(`Error al obtener niveles: ${error.message}`)

    // Optional: Sort by acts or identifiers if the column order isn't guaranteed
    return data as Level[]
  },
  ['levels_list'],
  { revalidate: 3600, tags: ['levels'] }
)

export const getLevelById = unstable_cache(
  async (id: string): Promise<Level | null> => {
    const { data, error } = await supabasePublic
      .from('levels')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Error al obtener nivel: ${error.message}`)
    }

    return data as Level | null
  },
  ['level_by_id'],
  { revalidate: 3600, tags: ['levels'] }
)

export async function getLevelsByAct(act: number): Promise<Level[]> {
  return getLevels({ act })
}

export async function getLevelsByType(type: LevelType): Promise<Level[]> {
  return getLevels({ type })
}
