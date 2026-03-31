// ============================================================
// Hook de autenticación — estado reactivo del usuario
// ============================================================

'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true })
  const supabase = createClient()

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getUser().then(({ data: { user } }) => {
      setState({ user, loading: false })
    })

    // Escuchar cambios de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState({ user: session?.user ?? null, loading: false })
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = useCallback(async () => {
    const baseUrl = window.location.origin
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
      },
    })
    if (error) console.error('[REBOOT] Error Google login:', error.message)
  }, [supabase])

  const signInWithGitHub = useCallback(async () => {
    const baseUrl = window.location.origin
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
      },
    })
    if (error) console.error('[REBOOT] Error GitHub login:', error.message)
  }, [supabase])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setState({ user: null, loading: false })
  }, [supabase])

  return {
    user: state.user,
    loading: state.loading,
    isAuthenticated: !!state.user,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
  }
}
