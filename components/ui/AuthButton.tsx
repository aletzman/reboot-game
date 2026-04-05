'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/supabase/useAuth'
import { syncSave, ensureProfile } from '@/lib/supabase/sync'
import { getSave } from '@/lib/gameState'
import { LogIn, LogOut, Github, Loader2, CloudUpload, ChevronDown, User } from 'lucide-react'
import { Screw } from './Screw'

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

  // ══════════════════════════════════════════════════
  // LOADING
  // ══════════════════════════════════════════════════
  if (loading) {
    return (
      <div className="h-[36px] relative p-[3px] bg-[#080b0e] rounded-md border border-[#1a222c] shadow-[0_2px_0_0_#030507]">
        <div className="absolute inset-[3px] rounded-[4px] bg-(--bg-void) shadow-[inset_0_3px_6px_rgba(0,0,0,0.9)]" />
        <div className="relative h-full px-4 flex items-center justify-center rounded-[4px] bg-(--bg-surface) border border-(--border-color)">
          <Loader2 size={12} className="text-(--text-ghost) animate-spin" />
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════
  // NOT AUTHENTICATED — Socket + Plunger en Cyan
  // ══════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <div className="relative" ref={menuRef}>
        {/* ─── SOCKET (El marco hundido) ─── */}
        <div className="h-[36px] relative p-[3px] bg-[#080b0e] rounded-md border border-[#1a222c] shadow-[0_2px_0_0_#030507]">
          {/* Void interior (la cavidad donde se hunde el botón) */}
          <div className="absolute inset-[3px] rounded-[4px] bg-(--bg-void) shadow-[inset_0_3px_6px_rgba(0,0,0,0.9)]" />

          {/* ─── EL BOTÓN FÍSICO ─── */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`
              relative h-full flex items-center gap-2 px-3
              transition-all duration-100 overflow-hidden
              rounded-[4px] border cursor-pointer
              /* COLOR CYAN: Gradiente metálico */
              bg-[linear-gradient(180deg,#0e3a3f_0%,#072428_100%)]
              border-(--cyan)/40
              shadow-[0_3px_0_0_#041416,0_5px_12px_rgba(25,200,212,0.15)]
              hover:shadow-[0_3px_0_0_#041416,0_8px_18px_rgba(25,200,212,0.25)]
              hover:translate-y
              active:scale-98 active:shadow-[0_0px_0_0_transparent]
            `}
          >
            {/* Brillo interior (plástico/metal) */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.25] bg-[linear-gradient(rgba(255,255,255,0.15)_0%,rgba(0,0,0,0.3)_100%)]" />

            {/* Luz lateral izquierda */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-1/2 rounded-r-full bg-(--cyan) shadow-[0_0_8px_var(--cyan)] opacity-60" />

            {/* LED de status */}
            <div className="relative flex items-center justify-center w-2.5 h-2.5 z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-(--cyan)/60 shadow-[0_0_4px_var(--cyan)]" />
            </div>

            <span className="hidden sm:inline text-[10px] font-mono font-bold text-(--cyan) uppercase tracking-widest relative z-10 [text-shadow:0_0_8px_rgba(25,200,212,0.3)]">
              ENLAZAR
            </span>

            <ChevronDown size={10} className={`text-(--cyan)/60 transition-transform relative z-10 ${showMenu ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showMenu && (
          <div className="absolute right-0 top-full mt-1.5 w-56 z-50 overflow-hidden">
            {/* ─── PANEL DE ENLACE ─── */}
            <div className="
              bg-(--bg-deep) border border-(--border-color) rounded-xs
              shadow-[0_8px_24px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.03)]
              relative overflow-hidden
            ">
              {/* Textura y bisel */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-size-[4px_4px]" />
              <div className="absolute inset-px border border-black/40 rounded-xs pointer-events-none" />

              {/* Header de panel */}
              <div className="relative px-3 py-2 border-b border-(--border-color) flex items-center gap-2">
                <div className="w-0.5 h-3 bg-(--cyan) opacity-60" />
                <span className="text-[10px] font-mono font-black text-(--text-muted) tracking-[0.25em] uppercase">
                  ENLACE_SISTEMA
                </span>
                <div className="flex-1" />
                <Screw size="sm" rotation={35} className="opacity-30" />
              </div>

              {/* Opciones */}
              <div className="relative z-10 p-1.5 space-y-0.5">
                <button
                  onClick={() => { signInWithGoogle(); setShowMenu(false) }}
                  className="
                    w-full flex items-center gap-3 px-3 py-2
                    bg-transparent hover:bg-white/5 rounded-xs
                    transition-all duration-150 cursor-pointer
                    border border-transparent hover:border-white/5
                    group/provider
                  "
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" className="shrink-0 opacity-80 group-hover/provider:opacity-100 transition-opacity">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="text-sm font-mono text-(--text-muted) group-hover/provider:text-white transition-colors">Google</span>
                </button>

                <button
                  onClick={() => { signInWithGitHub(); setShowMenu(false) }}
                  className="
                    w-full flex items-center gap-3 px-3 py-2
                    bg-transparent hover:bg-white/5 rounded-xs
                    transition-all duration-150 cursor-pointer
                    border border-transparent hover:border-white/5
                    group/provider
                  "
                >
                  <Github size={16} className="shrink-0 text-(--text-muted) opacity-80 group-hover/provider:opacity-100 group-hover/provider:text-white transition-all" />
                  <span className="text-sm font-mono text-(--text-muted) group-hover/provider:text-white transition-colors">GitHub</span>
                </button>
              </div>

              {/* Footer técnico */}
              <div className="px-3 py-1.5 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-mono text-(--text-muted) opacity-65 tracking-widest uppercase">AUTH_MOD v2.1</span>
                <div className="flex gap-0.5 h-[3px]">
                  <div className="w-[3px] h-full bg-(--text-muted)/45" />
                  <div className="w-[3px] h-full bg-(--text-muted)/35" />
                  <div className="w-[3px] h-full bg-(--text-muted)/25" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ══════════════════════════════════════════════════
  // AUTHENTICATED — Socket + Plunger en Cyan
  // ══════════════════════════════════════════════════
  const save = getSave()
  const playerName = save?.player?.name && save?.player?.name !== 'Jugador' ? save.player.name : null
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuario'
  const avatarUrl = user?.user_metadata?.avatar_url

  // Color cambia según estado de sync
  const accentColor = syncing ? 'var(--amber)' : 'var(--cyan)'
  const bgGradient = syncing
    ? 'bg-[linear-gradient(180deg,#3d270b_0%,#1a1003_100%)]'
    : 'bg-[linear-gradient(180deg,#0e3a3f_0%,#072428_100%)]'
  const borderColor = syncing ? 'border-(--amber)/40' : 'border-(--cyan)/40'
  const shadowColor = syncing
    ? 'shadow-[0_3px_0_0_#1a1003,0_5px_12px_rgba(239,159,39,0.15)]'
    : 'shadow-[0_3px_0_0_#041416,0_5px_12px_rgba(25,200,212,0.15)]'

  return (
    <div className="relative" ref={menuRef}>
      {/* ─── SOCKET ─── */}
      <div className="h-[36px] relative p-[3px] bg-[#080b0e] rounded-md border border-[#1a222c] shadow-[0_2px_0_0_#030507]">
        {/* Void interior */}
        <div className="absolute inset-[3px] rounded-[4px] bg-(--bg-void) shadow-[inset_0_3px_6px_rgba(0,0,0,0.9)]" />

        {/* ─── EL BOTÓN FÍSICO ─── */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`
            relative h-full flex items-center gap-2 px-2
            transition-all duration-100 overflow-hidden
            rounded-[4px] border cursor-pointer
            ${bgGradient} ${borderColor} ${shadowColor}
            hover:translate-y
            active:scale-98 active:shadow-[0_0px_0_0_transparent]
          `}
        >
          {/* Brillo interior */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.25] bg-[linear-gradient(rgba(255,255,255,0.15)_0%,rgba(0,0,0,0.3)_100%)]" />

          {/* Luz lateral */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-1/2 rounded-r-full opacity-60 transition-colors"
            style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
          />

          {/* Avatar con LED */}
          <div className="relative w-5 h-5 shrink-0 z-10">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full rounded-xs object-cover border border-white/15 shadow-[0_0_4px_rgba(0,0,0,0.5)]"
              />
            ) : (
              <div className="w-full h-full rounded-xs bg-black/60 border border-white/10 flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.8)]">
                <User size={11} className="text-(--text-ghost)" />
              </div>
            )}

            {/* LED de sincronización */}
            {syncing ? (
              <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-(--amber) animate-pulse shadow-[0_0_6px_var(--amber)] border border-[#080b0e]" />
            ) : syncDone ? (
              <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-(--green-light) shadow-[0_0_6px_var(--green-light)] border border-[#080b0e]" />
            ) : null}
          </div>

          {/* Nombre */}
          <span
            className="hidden sm:inline text-[10px] font-mono font-bold max-w-[80px] truncate tracking-wider uppercase relative z-10 transition-colors"
            style={{ color: accentColor, textShadow: `0 0 8px ${accentColor}40` }}
          >
            {playerName || displayName}
          </span>

          {/* Indicador */}
          {syncing ? (
            <Loader2 size={12} className="text-(--amber) animate-spin relative z-10" />
          ) : (
            <ChevronDown size={12} className={`text-(--cyan)/60 transition-transform relative z-10 ${showMenu ? 'rotate-180' : ''}`} />
          )}
        </button>
      </div>

      {showMenu && (
        <div className="absolute right-0 top-full mt-1.5 w-56 z-50 overflow-hidden">
          {/* ─── PANEL DE OPERADOR ─── */}
          <div className="
            bg-(--bg-deep) border border-(--border-color) rounded-xs
            shadow-[0_8px_24px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.03)]
            relative overflow-hidden
          ">
            {/* Textura y bisel */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] bg-size-[4px_4px]" />
            <div className="absolute inset-px border border-black/40 rounded-xs pointer-events-none" />

            {/* Header: Info de operador */}
            <div className="relative px-3 py-2.5 border-b border-white/5 bg-black/30">
              <div className="flex items-center gap-2.5">
                {/* LED activo */}
                <div className="w-1 h-3 bg-(--cyan) shadow-[0_0_8px_var(--cyan)] rounded-sm opacity-70" />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-mono font-black text-white truncate uppercase tracking-wider">
                    {playerName || displayName}
                  </span>
                  <span className="text-xs font-mono text-(--text-muted)/80 truncate tracking-wider">
                    {user?.email}
                  </span>
                </div>
              </div>
              {/* Decoración hardware */}
              <div className="absolute top-1.5 right-2 opacity-30">
                <Screw size="sm" rotation={-20} />
              </div>
            </div>

            {/* Acciones */}
            <div className="relative z-10 p-1.5 space-y-0.5">
              {/* Sincronizar */}
              <button
                onClick={handleSync}
                disabled={syncing}
                className="
                  w-full flex items-center gap-3 px-3 py-2
                  bg-transparent hover:bg-white/5 rounded-xs
                  transition-all duration-150 cursor-pointer
                  border border-transparent hover:border-white/5
                  disabled:opacity-30 disabled:cursor-not-allowed
                  group/sync
                "
              >
                {syncing ? (
                  <Loader2 size={14} className="text-(--amber) animate-spin shrink-0" />
                ) : (
                  <CloudUpload size={14} className="text-(--text-muted)/85 group-hover/sync:text-(--green-light) transition-colors shrink-0" />
                )}
                <div className="flex flex-col items-start">
                  <span className="text-xs font-mono font-bold text-(--text-muted) group-hover/sync:text-white transition-colors uppercase tracking-wider">
                    {syncing ? 'Sincronizando...' : 'Sincronizar'}
                  </span>
                </div>
              </button>

              {/* Divider */}
              <div className="h-px bg-white/5 mx-2" />

              {/* Cerrar sesión */}
              <button
                onClick={handleSignOut}
                className="
                  w-full flex items-center gap-3 px-3 py-2
                  bg-transparent hover:bg-(--red)/5 rounded-xs
                  transition-all duration-150 cursor-pointer
                  border border-transparent hover:border-(--red)/10
                  group/logout
                "
              >
                <LogOut size={14} className="text-(--text-muted)/85 group-hover/logout:text-(--red-light) transition-colors shrink-0" />
                <span className="text-xs font-mono font-bold text-(--text-muted) group-hover/logout:text-(--red-light) transition-colors uppercase tracking-wider">
                  Cerrar sesión
                </span>
              </button>
            </div>

            {/* Footer técnico */}
            <div className="px-3 py-1.5 border-t border-(--border-color)/80 flex items-center justify-between">
              <span className="text-[10px] font-mono text-(--text-muted)/85 tracking-widest uppercase">
                {syncDone ? 'SYNC_OK' : 'ENLACE_ACTIVO'}
              </span>
              <div className="flex gap-0.5 h-[3px]">
                <div className={`w-[3px] h-full ${syncDone ? 'bg-(--green-base)/40' : 'bg-(--text-muted)/35'}`} />
                <div className={`w-[3px] h-full ${syncDone ? 'bg-(--green-base)/20' : 'bg-(--text-muted)/25'}`} />
                <div className={`w-[3px] h-full ${syncDone ? 'bg-(--green-base)/10' : 'bg-(--text-muted)/15'}`} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}