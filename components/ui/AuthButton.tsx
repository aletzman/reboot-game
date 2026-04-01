'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/supabase/useAuth'
import { syncSave, ensureProfile } from '@/lib/supabase/sync'
import { getSave } from '@/lib/gameState'
import { LogIn, LogOut, Github, Loader2, CloudUpload, ChevronDown, User } from 'lucide-react'

export function AuthButton() {
  const { user, loading, isAuthenticated, signInWithGoogle, signInWithGitHub, signOut } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncDone, setSyncDone] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
      <div className="flex items-center justify-center px-4 py-1.5 min-w-[120px] bg-(--bg-surface) border border-(--border-muted-color) rounded-sm h-[32px]">
        <Loader2 size={14} className="text-(--text-muted) animate-spin" />
      </div>
    )
  }

  // ══════════════════════════════════════════════════
  // NO LOGUEADO
  // ══════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2 px-3 py-1.5 bg-(--bg-surface) border border-(--border-muted-color) hover:border-(--border-color) hover:bg-(--bg-hover) text-(--text-muted) hover:text-white transition-all rounded-sm font-mono text-xs uppercase tracking-wider cursor-pointer h-[32px]"
        >
          <LogIn size={14} />
          <span className="hidden sm:inline">Iniciar sesión</span>
          <ChevronDown size={12} className={`opacity-60 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1 w-64 bg-(--bg-elevated) border border-(--border-color) rounded-sm shadow-xl z-50 overflow-hidden">
            <div className="p-2 space-y-1">
              <button
                onClick={() => { signInWithGoogle(); setShowMenu(false) }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-(--bg-hover) rounded-sm transition-colors cursor-pointer text-sm text-(--text-primary)"
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continuar con Google
              </button>

              <button
                onClick={() => { signInWithGitHub(); setShowMenu(false) }}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-(--bg-hover) rounded-sm transition-colors cursor-pointer text-sm text-(--text-primary)"
              >
                <Github size={16} />
                Continuar con GitHub
              </button>
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
  const playerName = save?.player?.name && save?.player?.name !== 'Jugador' ? save.player.name : null
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuario'
  const avatarUrl = user?.user_metadata?.avatar_url

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-2 py-1 bg-(--bg-surface) border border-(--border-muted-color) hover:border-(--border-color) hover:bg-(--bg-hover) transition-all rounded-sm cursor-pointer h-[32px]"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="w-5 h-5 rounded-sm object-cover" />
        ) : (
          <div className="w-5 h-5 rounded-sm bg-(--bg-hover) flex items-center justify-center">
            <User size={12} className="text-(--text-muted)" />
          </div>
        )}

        <span className="hidden sm:inline text-xs font-sans text-(--text-primary) max-w-[100px] truncate ml-1">
          {playerName || displayName}
        </span>

        {syncing ? (
          <Loader2 size={12} className="text-(--text-muted) animate-spin ml-1" />
        ) : (
          <ChevronDown size={12} className={`text-(--text-muted) transition-transform ml-1 ${showMenu ? 'rotate-180' : ''}`} />
        )}
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-1 w-60 bg-(--bg-elevated) border border-(--border-color) rounded-sm shadow-xl z-50 overflow-hidden">

          <div className="px-4 py-3 border-b border-(--bg-hover) bg-(--bg-surface)">
            <p className="text-sm font-medium text-white truncate">{playerName || displayName}</p>
            <p className="text-xs text-(--text-muted) truncate">{user?.email}</p>
          </div>

          <div className="p-1">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-(--bg-hover) rounded-sm transition-colors cursor-pointer text-sm text-(--text-primary) disabled:opacity-50"
            >
              {syncing ? <Loader2 size={14} className="animate-spin" /> : <CloudUpload size={14} />}
              Sincronizar progreso
            </button>

            <div className="h-px bg-(--bg-hover) my-1 mx-2" />

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-(--red)/10 text-(--red-light) rounded-sm transition-colors cursor-pointer text-sm"
            >
              <LogOut size={14} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}