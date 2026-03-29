import { unstable_cache } from 'next/cache'
import { supabasePublic } from '@/lib/supabase/public'
import type { GameObject, ObjectType } from '@/types/game'

export const getObjects = unstable_cache(
  async (filters?: { type?: ObjectType; required?: boolean }): Promise<GameObject[]> => {
    let query = supabasePublic.from('objects').select('*')

    if (filters?.type) {
      query = query.eq('type', filters.type)
    }
    if (filters?.required !== undefined) {
      query = query.eq('required', filters.required)
    }

    const { data, error } = await query
    if (error) throw new Error(`Error al obtener objetos: ${error.message}`)

    return data as GameObject[]
  },
  ['objects_list'],
  { revalidate: 3600, tags: ['objects'] }
)

export const getObjectById = unstable_cache(
  async (id: string): Promise<GameObject | null> => {
    const { data, error } = await supabasePublic
      .from('objects')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is no rows returned on zero or 1 row expectation
      throw new Error(`Error al obtener objeto: ${error.message}`)
    }

    return data as GameObject | null
  },
  ['object_by_id'],
  { revalidate: 3600, tags: ['objects'] }
)

export async function getRequiredObjects(): Promise<GameObject[]> {
  return getObjects({ required: true })
}

export async function getObjectsByType(type: ObjectType): Promise<GameObject[]> {
  return getObjects({ type })
}
