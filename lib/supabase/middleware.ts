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
  const demoMode = request.cookies.get('reboot_demo_mode')?.value === 'true'

  // Lógica de protección de rutas de Juego
  const gamePathRegex = /^\/game\/(\d+)(?:\/level\/([^\/]+))?/
  const match = pathname.match(gamePathRegex)

  if (match) {
    const actId = parseInt(match[1], 10)
    const levelId = match[2]

    // En modo demo, solo validamos contra los límites de demo
    if (demoMode) {
       // Necesitamos los niveles para validar acceso (los traemos de Supabase para consistencia con canAccessLevel)
       const { data: levels } = await supabase.from('levels').select('*').order('id', { ascending: true })
       
       if (levels && levels.length > 0) {
         if (levelId) {
           const access = canAccessLevel(levelId, null, levels, true)
           if (!access.allowed) {
             return NextResponse.redirect(new URL(`/game/${actId}`, request.url))
           }
         } else {
           if (!isActUnlocked(actId, null, levels, true)) {
             return NextResponse.redirect(new URL('/game', request.url))
           }
         }
       }
       return supabaseResponse
    }

    // 1. Verificación de Login obligatorio
    if (levelId && requiresLogin(levelId) && !user) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    if (actId >= 4 && !user) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // 2. Verificación de Progreso Bloqueado
    if (user) {
      // Necesitamos tanto el save como los niveles para validar acceso
      const [saveRes, levelsRes] = await Promise.all([
        supabase.from('game_saves').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('levels').select('*').order('id', { ascending: true })
      ])

      const row = saveRes.data
      const levels = levelsRes.data || []

      if (row && levels.length > 0) {
        const save: any = {
          progress: row.progress || {},
          objects: row.objects || [],
        }

        if (levelId) {
          const access = canAccessLevel(levelId, save, levels)
          if (!access.allowed) {
            console.log(`[MIDDLEWARE] Bloqueando acceso a nivel ${levelId}`)
            return NextResponse.redirect(new URL(`/game/${actId}`, request.url))
          }
        } else {
          if (!isActUnlocked(actId, save, levels)) {
            console.log(`[MIDDLEWARE] Bloqueando acceso a Acto ${actId}`)
            return NextResponse.redirect(new URL('/game', request.url))
          }
        }
      }
    }
  }

  return supabaseResponse
}
