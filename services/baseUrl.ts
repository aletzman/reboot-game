/**
 * Resuelve la URL base de la API.
 *
 * - En el servidor (SSR / RSC): usa SITE_URL o construye desde headers.
 * - En el cliente: devuelve '' (URL relativa, el navegador resuelve).
 */
export function getBaseUrl(): string {
  // Cliente → relativo
  if (typeof window !== 'undefined') return ''

  // Servidor → necesitamos URL absoluta
  // 1. Variable de entorno explícita (deploy)
  if (process.env.SITE_URL) return process.env.SITE_URL

  // 2. Vercel / preview
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  // 3. Fallback desarrollo local
  const port = process.env.PORT || 3000
  return `http://localhost:${port}`
}
