// ============================================================
// OAuth Callback — procesa la respuesta de Google/GitHub
// ============================================================

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/game'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirige al mapa del juego (o a donde venía)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Si hay error, redirige a la home con un mensaje
  return NextResponse.redirect(`${origin}/?error=auth_failed`)
}
