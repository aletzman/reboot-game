// ============================================================ 
// Manejo del estado del juego: localStorage + Supabase
// ============================================================

import type {
  GameSave,
  LevelProgress,
  LevelAccessResult,
  ActNumber,
  ActSummary,
} from '@/types/game'
import levelsData from '@/data/levels.json'
import objectsData from '@/data/objects.json'

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

export function canAccessLevel(levelId: string): LevelAccessResult { 
  const save = getSave()

   const id = levelId.toUpperCase()  // ← normaliza aquí
  
  if (FREE_LEVELS.includes(id)) return { allowed: true }
  
  if (!getSave()) return { allowed: false, reason: 'locked', requiredAct: 0 }

  // buscar el nivel en los datos
  const level = (levelsData.levels as any[]).find(l => l.id === levelId)

  if (!level) return { allowed: false, reason: 'locked', requiredAct: 0 }

  // verificar objetos requeridos
  const reqObjs = level.requiredObjects ?? []
  const missingObjects = reqObjs.filter(
    (objId: string) => !save!.objects.includes(objId)
  )

  if (missingObjects.length > 0) {
    return { allowed: false, reason: 'missing-objects', objects: missingObjects }
  }

  return { allowed: true }
}

export function requiresLogin(levelId: string): boolean {
  // los actos 4, 5, 6 y 7 requieren login
  return (
    levelId.startsWith('4-') ||
    levelId.startsWith('5-') ||
    levelId.startsWith('6-') ||
    levelId.startsWith('7-') ||
    levelId === '4-R' ||
    levelId === '5-R' ||
    levelId === '6-R' ||
    levelId === '7-R'
  )
}

// ------------------------------------------------------------
// ACTOS
// ------------------------------------------------------------

export function getActSummary(actNumber: ActNumber): ActSummary {
  const save = getSave()
  const actLevels = (levelsData.levels as { id: string; act: number; actName: string; isReview: boolean }[])
    .filter(l => l.act === actNumber)

  const regularLevels = actLevels.filter(l => !l.isReview)
  const reviewLevel = actLevels.find(l => l.isReview)

  const levelIds = regularLevels.map(l => l.id)
  const completed = levelIds.every(id => save?.progress[id]?.completed ?? false)
  const totalStars = levelIds.reduce(
    (acc, id) => acc + (save?.progress[id]?.stars ?? 0),
    0
  )

  return {
    number: actNumber,
    name: actLevels[0]?.actName ?? '',
    levelIds,
    reviewLevelId: reviewLevel?.id ?? null,
    completed,
    totalStars,
  }
}

export function isActUnlocked(actNumber: number): boolean {
  if (actNumber <= 1) return true
  const save = getSave()
  if (!save) return actNumber <= 1
  
  // Logical progression: Act N is unlocked if Act N-1 is "completed" 
  // (all regular levels finished)
  const prevAct = getActSummary((actNumber - 1) as ActNumber)
  return prevAct.completed || prevAct.levelIds.some(id => save.progress[id]?.completed) 
  // actually let's just use a simpler check: if ANY level of the previous act is completed 
  // or if it's the first act.
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

export function getFailRedirect(levelId: string): string | null {
  const level = (levelsData.levels as { id: string; failRedirectTo: string | null }[])
    .find(l => l.id === levelId)
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
  const obj = (objectsData.objects as { id: string; name: string }[])
    .find(o => o.id === objectId)
  return obj?.name ?? objectId
}

// ------------------------------------------------------------
// MIGRACIÓN DE SAVE
// ------------------------------------------------------------

function migrateSave(oldSave: Partial<GameSave>): GameSave {
  // migraciones futuras van aquí
  // por ahora solo actualiza la versión
  return {
    version: SAVE_VERSION,
    player: oldSave.player ?? { name: 'Jugador', gender: 'él' },
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