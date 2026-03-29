// ============================================================
// Edge Middleware — refresca sesión de Supabase en cada request
// ============================================================

import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas EXCEPTO:
     * - _next/static, _next/image (assets de Next.js)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Archivos estáticos (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|wav|ogg)$).*)',
  ],
}
