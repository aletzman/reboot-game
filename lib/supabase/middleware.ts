// ============================================================
// Middleware helper — refresca tokens de Supabase y valida acceso
// ============================================================

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { canAccessLevel, isActUnlocked, requiresLogin } from '@/lib/game/access'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresca sesión
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Lógica de protección de rutas de Juego
  const gamePathRegex = /^\/game\/(\d+)(?:\/level\/([^\/]+))?$/
  const match = pathname.match(gamePathRegex)

  if (match) {
    const actId = parseInt(match[1], 10)
    const levelId = match[2]

    // 1. Verificación de Login obligatorio
    if (levelId && requiresLogin(levelId) && !user) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (actId >= 4 && !user) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // 2. Verificación de Progreso Bloqueado
    if (user) {
      const { data: row } = await supabase
        .from('game_saves')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (row) {
        const save: any = {
          progress: row.progress || {},
          objects: row.objects || [],
          // Solo necesitamos lo básico para canAccessLevel
        }

        if (levelId) {
          const access = canAccessLevel(levelId, save)
          if (!access.allowed) {
            console.log(`[MIDDLEWARE] Bloqueando acceso a nivel ${levelId}`)
            return NextResponse.redirect(new URL(`/game/${actId}`, request.url))
          }
        } else {
          if (!isActUnlocked(actId, save)) {
            console.log(`[MIDDLEWARE] Bloqueando acceso a Acto ${actId}`)
            return NextResponse.redirect(new URL('/game', request.url))
          }
        }
      }
    }
  }

  return supabaseResponse
}
