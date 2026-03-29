'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/supabase/useAuth'
import { syncSave, ensureProfile } from '@/lib/supabase/sync'
import { getSave } from '@/lib/gameState'
import { LogIn, LogOut, Github, Loader2, CloudUpload, ChevronDown, Wifi, ArrowLeftRight } from 'lucide-react'

export function AuthButton() {
  const { user, loading, isAuthenticated, signInWithGoogle, signInWithGitHub, signOut } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncDone, setSyncDone] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Cierra el menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Al loguearse, sincroniza el save y crea perfil
  useEffect(() => {
    if (isAuthenticated && !syncDone) {
      setSyncing(true)
      Promise.all([ensureProfile(), syncSave()])
        .then(() => setSyncDone(true))
        .catch(console.error)
        .finally(() => setSyncing(false))
    }
  }, [isAuthenticated, syncDone])

  const handleSync = async () => {
    setSyncing(true)
    await syncSave()
    setSyncing(false)
  }

  const handleSignOut = async () => {
    await signOut()
    setShowMenu(false)
    setSyncDone(false)
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5">
        <Loader2 size={14} className="text-(--green-muted) animate-spin" />
      </div>
    )
  }

  // ══════════════════════════════════════════════════
  // NO LOGUEADO
  // ══════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="relative" ref={menuRef}>
        {/* ── BOTÓN PRINCIPAL ── */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2.5 px-4 py-2  bg-(--bg-surface)
                     border border-(--green-dark)/40 hover:border-(--green-base)
                     text-(--green-light) hover:text-white
                     transition-all duration-300 rounded font-mono text-xs font-semibold uppercase tracking-wider
                     cursor-pointer group
                     hover:shadow-[0_0_20px_rgba(85,226,0,0.15)]"
        >
          <div className="relative">
            <LogIn size={15} className="group-hover:scale-110 transition-transform" />
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-(--green-light) animate-pulse" />
          </div>
          <span className="hidden sm:inline">Iniciar sesión</span>
          <ChevronDown size={12} className={`opacity-60 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
        </button>

        {/* ── DROPDOWN ── */}
        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-72 
                          bg-(--bg-elevated) border border-(--green-dark)/30
                          rounded-sm shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(85,226,0,0.06)]
                          z-9999 overflow-hidden animate-slide-up">

            {/* Header con línea de acento */}
            <div className="relative px-4 py-3 border-b border-(--bg-hover) bg-(--bg-surface)">
              <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--green-base) to-transparent opacity-50" />
              <div className="flex items-center gap-2">
                <Wifi size={12} className="text-(--cyan)" />
                <span className="text-[11px] font-mono text-(--cyan) uppercase tracking-widest font-bold">
                  Enlace externo
                </span>
              </div>
              <p className="text-xs font-mono text-(--text-muted) mt-1">
                Conecta tu cuenta para guardar progreso
              </p>
            </div>

            {/* Opciones OAuth */}
            <div className="p-2 space-y-1">
              {/* Google */}
              <button
                onClick={() => { signInWithGoogle(); setShowMenu(false) }}
                className="w-full flex items-center gap-3.5 px-3 py-3 
                           hover:bg-(--green-darkest)/50 rounded-xs
                           transition-all duration-200 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center shrink-0 
                                shadow-sm group-hover:shadow-[0_0_10px_rgba(255,255,255,0.15)] transition-shadow">
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-mono text-(--text-primary) group-hover:text-(--green-light) transition-colors font-medium">
                    Continuar con Google
                  </span>
                  <span className="text-[10px] font-mono text-(--text-ghost) uppercase tracking-wider">
                    OAuth 2.0 · Rápido y seguro
                  </span>
                </div>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 px-3">
                <div className="flex-1 h-px bg-(--bg-hover)" />
                <span className="text-[10px] font-mono text-(--text-ghost)">o</span>
                <div className="flex-1 h-px bg-(--bg-hover)" />
              </div>

              {/* GitHub */}
              <button
                onClick={() => { signInWithGitHub(); setShowMenu(false) }}
                className="w-full flex items-center gap-3.5 px-3 py-3 
                           hover:bg-(--green-darkest)/50 rounded-xs
                           transition-all duration-200 cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-md bg-[#171818] flex items-center justify-center shrink-0 
                                border border-[#3a3f44] group-hover:border-[#555] transition-colors">
                  <Github size={16} className="text-white" />
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-mono text-(--text-primary) group-hover:text-(--green-light) transition-colors font-medium">
                    Continuar con GitHub
                  </span>
                  <span className="text-[10px] font-mono text-(--text-ghost) uppercase tracking-wider">
                    OAuth 2.0 · Para desarrolladores
                  </span>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="relative px-4 py-2.5 border-t border-(--bg-hover) bg-(--bg-surface)">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-(--green-base) animate-pulse" />
                <span className="text-xs font-sans text-(--text-muted)">
                  Tu progreso se sincroniza automáticamente
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ══════════════════════════════════════════════════
  // LOGUEADO
  // ══════════════════════════════════════════════════
  const save = getSave()
  const playerName = save?.player?.name && save?.player?.name !== 'Jugador' && save?.player?.name !== 'Superviviente'
    ? save.player.name
    : null

  const displayName = user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || user?.email?.split('@')[0]
    || 'OPERADOR'

  const avatarUrl = user?.user_metadata?.avatar_url

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2.5 px-3 py-1.5  
                   border border-(--border-color)/40 hover:border-(--green-base)
                   transition-all duration-300 rounded cursor-pointer group
                   shadow-[0_0_10px_rgba(85,226,0,0.06)] hover:shadow-[0_0_16px_rgba(85,226,0,0.12)]"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-6 h-6 rounded-full border border-(--green-dark)/50 group-hover:border-(--green-base) transition-colors"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-(--green-darkest) border border-(--green-dark) flex items-center justify-center">
            <span className="text-[10px] font-mono text-(--green-light) font-bold">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="hidden sm:inline text-[13px] font-sans text-(--text-muted) group-hover:text-(--green-light) transition-colors max-w-[120px] truncate font-medium">
          {playerName || displayName}
        </span>
        {syncing && <Loader2 size={12} className="text-(--green-muted) animate-spin" />}
        <ChevronDown size={12} className={`text-(--text-ghost) transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-2 w-72 
                        bg-(--bg-elevated) border border-(--green-dark)/30
                        rounded-lg shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(85,226,0,0.06)]
                        z-9999 overflow-hidden animate-slide-up">

          {/* Info del usuario */}
          <div className="relative px-4 py-4 border-b border-(--bg-hover) bg-(--bg-surface)">
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-(--green-base) to-transparent opacity-50" />
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayName} className="w-10 h-10 rounded-full border-2 border-(--green-dark)/50" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-(--green-darkest) border-2 border-(--green-dark) flex items-center justify-center">
                  <span className="text-sm font-mono text-(--green-light) font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-sans text-(--text-primary) truncate font-medium uppercase">
                  {playerName || displayName}
                </span>
                <span className="text-[11px] font-mono text-(--text-muted) truncate">
                  {playerName ? displayName : (user?.email || 'Enlace activo')}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="p-2 space-y-1">
            {/* Sync */}
            <button
              onClick={handleSync}
              disabled={syncing}
              className="w-full flex items-center gap-3 px-3 py-2.5
                         hover:bg-(--green-darkest)/50 rounded-xs
                         transition-all duration-200 cursor-pointer group disabled:opacity-50"
            >
              {syncing ? (
                <Loader2 size={16} className="text-(--green-muted) animate-spin shrink-0" />
              ) : (
                <CloudUpload size={16} className="text-(--green-muted) group-hover:text-(--green-light) transition-colors shrink-0" />
              )}
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-sm font-sans text-(--text-primary) group-hover:text-(--green-light) transition-colors font-medium">
                  {syncing ? 'Sincronizando...' : 'Sincronizar progreso'}
                </span>
                <span className="flex items-center gap-2 text-[10px] font-mono text-(--text-muted) uppercase tracking-wider">
                  Local <ArrowLeftRight size={12} className="text-(--green-muted)" /> Nube
                </span>
              </div>
            </button>

            <div className="h-px bg-(--bg-hover) mx-2" />

            {/* Cerrar sesión */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5
                         hover:bg-(--red-dark)/20 rounded-md
                         transition-all duration-200 cursor-pointer group"
            >
              <LogOut size={16} className="text-(--red)/70 group-hover:text-(--red-light) transition-colors shrink-0" />
              <span className="text-sm font-sans text-(--text-muted) group-hover:text-(--red-light) transition-colors font-medium">
                Cerrar sesión
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="relative px-4 py-2 border-t border-(--bg-hover) bg-(--bg-surface)">
            <span className="text-[10px] font-mono text-(--text-ghost) uppercase tracking-wider">
              Sesión vía {user?.app_metadata?.provider || 'OAuth'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
