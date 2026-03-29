// ============================================================
// Sincronización de progreso: localStorage ↔ Supabase
// ============================================================

import { createClient } from '@/lib/supabase/client'
import { getSave, setSave } from '@/lib/gameState'
import type { GameSave, LevelProgress } from '@/types/game'

// ------------------------------------------------------------
// TIPOS PARA LA TABLA game_saves
// ------------------------------------------------------------

interface GameSaveRow {
  user_id: string
  version: number
  player_name: string
  player_gender: string
  progress: any
  cards: string[]
  objects: string[]
  frag_used_total: number
  current_level_id: string
  created_at: string
  updated_at: string
}

// ------------------------------------------------------------
// SUBIR SAVE A SUPABASE
// ------------------------------------------------------------

export async function pushSaveToSupabase(): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const save = getSave()
  if (!save) return false

  const { error } = await supabase
    .from('game_saves')
    .upsert(
      {
        user_id: user.id,
        version: save.version,
        player_name: save.player.name,
        player_gender: save.player.gender,
        progress: save.progress,
        cards: save.cards,
        objects: save.objects,
        frag_used_total: save.fragUsedTotal,
        current_level_id: save.currentLevelId,
        created_at: save.createdAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

  if (error) {
    console.error('[REBOOT] Error subiendo save a Supabase:', error.message)
    return false
  }

  return true
}

// ------------------------------------------------------------
// DESCARGAR SAVE DE SUPABASE
// ------------------------------------------------------------

export async function pullSaveFromSupabase(): Promise<GameSave | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('game_saves')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    if (error?.code !== 'PGRST116') { // PGRST116 = no rows found (normal para jugadores nuevos)
      console.error('[REBOOT] Error descargando save:', error?.message)
    }
    return null
  }

  const row = data as GameSaveRow

  return {
    version: row.version,
    player: {
      name: row.player_name,
      gender: row.player_gender as 'él' | 'ella' | 'elle'
    },
    progress: row.progress,
    cards: row.cards,
    objects: row.objects,
    fragUsedTotal: row.frag_used_total,
    currentLevelId: row.current_level_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

// ------------------------------------------------------------
// MERGE + SYNC BIDIRECCIONAL
// ------------------------------------------------------------

export async function syncSave(): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const localSave = getSave()
  const remoteSave = await pullSaveFromSupabase()

  if (!localSave && !remoteSave) {
    // No hay save en ningún lado
    return true
  }

  if (!localSave && remoteSave) {
    // Solo hay save remoto → usa ese
    setSave(remoteSave)
    return true
  }

  if (localSave && !remoteSave) {
    // Solo hay save local → sube a Supabase
    return pushSaveToSupabase()
  }

  // Ambos existen → merge
  const merged = mergeSaves(localSave!, remoteSave!)
  setSave(merged)
  
  // Sube el merge
  const { error } = await supabase
    .from('game_saves')
    .upsert(
      {
        user_id: user.id,
        version: merged.version,
        player_name: merged.player.name,
        player_gender: merged.player.gender,
        progress: merged.progress,
        cards: merged.cards,
        objects: merged.objects,
        frag_used_total: merged.fragUsedTotal,
        current_level_id: merged.currentLevelId,
        created_at: merged.createdAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

  if (error) {
    console.error('[REBOOT] Error sincronizando save:', error.message)
    return false
  }

  return true
}

// ------------------------------------------------------------
// MERGE INTELIGENTE — toma lo mejor de cada save
// ------------------------------------------------------------

function mergeSaves(local: GameSave, remote: GameSave): GameSave {
  // Toma el progreso más avanzado nivel por nivel
  const mergedProgress: GameSave['progress'] = { ...remote.progress }

  for (const [levelId, localProg] of Object.entries(local.progress)) {
    const remoteProg = remote.progress[levelId]
    if (!remoteProg || localProg.stars > remoteProg.stars) {
      mergedProgress[levelId] = localProg
    }
  }

  // Une cartas y objetos sin duplicados
  const mergedCards = [...new Set([...local.cards, ...remote.cards])]
  const mergedObjects = [...new Set([...local.objects, ...remote.objects])]

  // Usa el save más reciente como base para datos del jugador
  const base = new Date(local.updatedAt) > new Date(remote.updatedAt) ? local : remote

  return {
    ...base,
    progress: mergedProgress,
    cards: mergedCards,
    objects: mergedObjects,
    fragUsedTotal: Math.max(local.fragUsedTotal, remote.fragUsedTotal),
    updatedAt: new Date().toISOString(),
  }
}

// ------------------------------------------------------------
// CREAR PERFIL AL REGISTRARSE
// ------------------------------------------------------------

export async function ensureProfile(): Promise<boolean> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  // Verifica si el perfil ya existe
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (existing) return true

  // Crea perfil nuevo con datos del provider
  const { error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      display_name: user.user_metadata?.full_name
        || user.user_metadata?.name
        || user.email?.split('@')[0]
        || 'Operador',
      avatar_url: user.user_metadata?.avatar_url || null,
      provider: user.app_metadata?.provider || 'unknown',
    })

  if (error) {
    console.error('[REBOOT] Error creando perfil:', error.message)
    return false
  }

  return true
}

// ------------------------------------------------------------
// OBTENER PERFIL
// ------------------------------------------------------------

export interface UserProfile {
  id: string
  display_name: string
  avatar_url: string | null
  provider: string
  created_at: string
}

export async function getProfile(): Promise<UserProfile | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !data) return null
  return data as UserProfile
}
