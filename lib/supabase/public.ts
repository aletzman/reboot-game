import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Cliente público sin acceso a cookies, usado para ISR y componentes estáticos
// Lazy-initialized para evitar crear el cliente durante build time
let _client: SupabaseClient | null = null

export function getSupabasePublic(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
      throw new Error(
        'Faltan variables de entorno de Supabase: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (o NEXT_PUBLIC_SUPABASE_ANON_KEY)'
      )
    }

    _client = createClient(url, key)
  }
  return _client
}

/** @deprecated Usa getSupabasePublic() en su lugar */
export const supabasePublic = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabasePublic() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
