import { createClient } from '@supabase/supabase-js'

// Cliente público sin acceso a cookies, usado para ISR y componentes estáticos
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
