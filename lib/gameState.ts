// ============================================================ 
// Manejo del estado del juego: localStorage + Supabase
// ============================================================

import type {
  GameSave,
  LevelProgress,
  LevelAccessResult,
  ActNumber,
  ActSummary,
  Level,
} from '@/types/game'
import * as access from '@/lib/game/access'

// ------------------------------------------------------------
// CONSTANTES
// ------------------------------------------------------------

const SAVE_KEY = 'reboot_save'
const SAVE_VERSION = 1
const FREE_LEVELS = ['P-00', 'P-01'] // niveles sin login

// Niveles que requieren login para acceder (Acto IV en adelante)
const LOGIN_REQUIRED_FROM = '4-01'

// ------------------------------------------------------------
// SAVE VACÍO
// ------------------------------------------------------------

export function createEmptySave(name: string, gender: 'él' | 'ella' | 'elle'): GameSave {
  return {
    version: SAVE_VERSION,
    player: { name, gender },
    progress: {},
    cards: [],
    objects: [],
    fragUsedTotal: 0,
    currentLevelId: 'P-00',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// ------------------------------------------------------------
// LEER Y ESCRIBIR EL SAVE
// ------------------------------------------------------------

export function getSave(): GameSave | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return null
    const save = JSON.parse(raw) as GameSave
    // migración de versión si es necesario
    if (save.version !== SAVE_VERSION) return migrateSave(save)
    return save
  } catch {
    return null
  }
}

export function setSave(save: GameSave): void {
  if (typeof window === 'undefined') return
  save.updatedAt = new Date().toISOString()
  localStorage.setItem(SAVE_KEY, JSON.stringify(save))
  // Dispara sync debounced a Supabase (si hay sesión activa)
  schedulCloudPush()
}

// ------------------------------------------------------------
// AUTO-SYNC A SUPABASE (debounced)
// ------------------------------------------------------------

let pushTimer: ReturnType<typeof setTimeout> | null = null

function schedulCloudPush() {
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = setTimeout(async () => {
    try {
      const { pushSaveToSupabase } = await import('@/lib/supabase/sync')
      await pushSaveToSupabase()
    } catch {
      // Silencioso — si no hay sesión o falla la red, no pasa nada
    }
  }, 1500) // Espera 1.5s después del último cambio
}

export function deleteSave(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SAVE_KEY)
}

export function hasSave(): boolean {
  return getSave() !== null
}

// ------------------------------------------------------------
// PROGRESO
// ------------------------------------------------------------

export function saveProgress(
  levelId: string,
  stars: 0 | 1 | 2 | 3,
  usedFrag: boolean
): void {
  const save = getSave()
  if (!save) return

  const prev = save.progress[levelId]
  const attempts = (prev?.attempts ?? 0) + 1

  // Si usó FRAG, el máximo de estrellas es 2
  let finalStars = stars
  if (usedFrag && finalStars > 2) {
    finalStars = 2
  }

  // solo actualiza estrellas si mejoró
  const bestStars = Math.max(prev?.stars ?? 0, finalStars) as 0 | 1 | 2 | 3

  save.progress[levelId] = {
    completed: finalStars > 0,
    stars: bestStars,
    usedFrag: usedFrag || prev?.usedFrag || false,
    attempts,
    completedAt: finalStars > 0 ? new Date().toISOString() : prev?.completedAt,
  }

  if (usedFrag) save.fragUsedTotal++
  save.currentLevelId = levelId
  setSave(save)
}

export function getLevelProgress(levelId: string): LevelProgress | null {
  return getSave()?.progress[levelId] ?? null
}

export function isLevelCompleted(levelId: string): boolean {
  return getSave()?.progress[levelId]?.completed ?? false
}

export function getTotalStars(): number {
  const save = getSave()
  if (!save) return 0
  return Object.values(save.progress).reduce((acc, l) => acc + (l.stars ?? 0), 0)
}

// ------------------------------------------------------------
// CARTAS
// ------------------------------------------------------------

export function unlockCard(cardId: string): void {
  const save = getSave()
  if (!save) return
  if (save.cards.includes(cardId)) return
  save.cards.push(cardId)
  setSave(save)
}

export function hasCard(cardId: string): boolean {
  return getSave()?.cards.includes(cardId) ?? false
}

export function getUnlockedCards(): string[] {
  return getSave()?.cards ?? []
}

// ------------------------------------------------------------
// OBJETOS
// ------------------------------------------------------------

export function unlockObject(objectId: string): void {
  const save = getSave()
  if (!save) return
  if (save.objects.includes(objectId)) return
  save.objects.push(objectId)
  setSave(save)
}

export function hasObject(objectId: string): boolean {
  return getSave()?.objects.includes(objectId) ?? false
}

export function getObjects(): string[] {
  return getSave()?.objects ?? []
}

// ------------------------------------------------------------
// ACCESO A NIVELES
// ------------------------------------------------------------

export function canAccessLevel(levelId: string, levels: Level[]): LevelAccessResult {
  return access.canAccessLevel(levelId, getSave(), levels)
}

export function requiresLogin(levelId: string): boolean {
  return access.requiresLogin(levelId)
}

// ------------------------------------------------------------
// ACTOS
// ------------------------------------------------------------

export function getActSummary(actNumber: ActNumber, levels: Level[]): ActSummary {
  const save = getSave()
  const actLevels = levels.filter(l => l.act === actNumber)

  const reviewLevel = actLevels.find(l => l.isReview)
  const levelIds = actLevels.map(l => l.id) // Include all levels, INCLUDING the review level
  
  const completed = levelIds.every(id => save?.progress[id]?.completed ?? false)
  
  const totalStars = levelIds.reduce(
    (acc, id) => acc + (save?.progress[id]?.stars ?? 0),
    0
  )

  const maxStars = actLevels.reduce(
    (acc, l) => acc + (l.maxStars || 3),
    0
  )

  return {
    number: actNumber,
    name: actLevels[0]?.actName ?? '',
    levelIds,
    reviewLevelId: reviewLevel?.id ?? null,
    completed,
    totalStars,
    maxStars,
  }
}

export function isActUnlocked(actNumber: number, levels: Level[]): boolean {
  return access.isActUnlocked(actNumber, getSave(), levels)
}

export function getCurrentAct(): ActNumber {
  const save = getSave()
  if (!save || !save.currentLevelId) return 0
  const levelId = save.currentLevelId
  if (levelId.startsWith('P-')) return 0
  const actNum = parseInt(levelId.split('-')[0])
  return (isNaN(actNum) ? 0 : actNum) as ActNumber
}

// ------------------------------------------------------------
// FAIL REDIRECT
// ------------------------------------------------------------

export function getFailRedirect(levelId: string, levels: Level[]): string | null {
  const level = levels.find(l => l.id === levelId)
  return level?.failRedirectTo ?? null
}

export function shouldSuggestRedirect(levelId: string): boolean {
  const progress = getLevelProgress(levelId)
  if (!progress) return false
  // sugiere redirigir si ha fallado 3+ veces sin completar
  return progress.attempts >= 3 && !progress.completed
}

// ------------------------------------------------------------
// CARTA SECRETA — nunca usar FRAG
// ------------------------------------------------------------

export function hasSecretCardCondition(): boolean {
  const save = getSave()
  if (!save) return false
  return save.fragUsedTotal === 0 && Object.keys(save.progress).length > 5
}

// ------------------------------------------------------------
// NOMBRE DEL OBJETO — helper UI
// ------------------------------------------------------------

export function getObjectName(objectId: string): string {
  // Sin objects.json, el nombre debe venir de la UI o de un fetch previo.
  // Devolvemos el ID como fallback.
  return objectId
}

// ------------------------------------------------------------
// MIGRACIÓN DE SAVE
// ------------------------------------------------------------

function migrateSave(oldSave: Partial<GameSave>): GameSave {
  // migraciones futuras van aquí
  // por ahora solo actualiza la versión
  return {
    version: SAVE_VERSION,
    player: oldSave.player ?? { name: '', gender: 'él' },
    progress: oldSave.progress ?? {},
    cards: oldSave.cards ?? [],
    objects: oldSave.objects ?? [],
    fragUsedTotal: oldSave.fragUsedTotal ?? 0,
    currentLevelId: oldSave.currentLevelId ?? 'P-00',
    createdAt: oldSave.createdAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// ------------------------------------------------------------
// MIGRACIÓN A SUPABASE — delegado al módulo sync
// ------------------------------------------------------------

/**
 * @deprecated Usa `syncSave()` de `@/lib/supabase/sync` directamente.
 * Se mantiene por retrocompatibilidad.
 */
export async function migrateToSupabase(_userId: string): Promise<boolean> {
  try {
    const { syncSave } = await import('@/lib/supabase/sync')
    return syncSave()
  } catch {
    return false
  }
}

/**
 * @deprecated Usa `syncSave()` de `@/lib/supabase/sync` directamente.
 * Se mantiene por retrocompatibilidad.
 */
export async function loadFromSupabase(_userId: string): Promise<boolean> {
  try {
    const { syncSave } = await import('@/lib/supabase/sync')
    return syncSave()
  } catch {
    return false
  }
}