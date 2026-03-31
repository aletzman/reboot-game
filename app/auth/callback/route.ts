// ============================================================
// OAuth Callback — procesa la respuesta de Google/GitHub
// ============================================================

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getBaseUrl } from '@/services/baseUrl'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/game'

  // Limpiamos el baseUrl para evitar problemas con la redirección final
  const baseUrl = getBaseUrl().replace(/\/$/, '')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirige al mapa del juego (o a donde venía)
      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  // Si hay error, redirige a la home con un mensaje
  return NextResponse.redirect(`${baseUrl}/?error=auth_failed`)
}
