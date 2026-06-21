// ============================================================ 
// Motor central: determina qué renderizar, valida acceso,
// maneja recompensas y sugiere redirects de repaso
// ============================================================

import type { Level, LevelType, Card, GameObject, LevelState } from '@/types/game'
import {
  saveProgress,
  unlockCard,
  unlockObject,
  getSave,
  canAccessLevel,
} from '@/lib/gameState'

// Los buscadores de datos ahora deben venir de los servicios o ser pasados como parámetros.

// ------------------------------------------------------------
// COMPONENTE POR TIPO
// ------------------------------------------------------------

// Mapeo de type → nombre del componente a importar dinámicamente
export const LEVEL_COMPONENT_MAP: Record<LevelType, string> = {
  'concept-trial': 'ConceptTrialLevel',
  'cinematic':     'CinematicLevel',
  'noderoutine':      'NodeRoutineLevel',
  'logicassembly':       'LogicAssemblyLevel',
  'puzzle-sort':   'PuzzleLevel',
  'puzzle-fill':   'PuzzleLevel',
  'puzzle-bug':    'PuzzleLevel',
  'puzzle-match':  'PuzzleLevel',
  'speedtyping':   'SpeedTypingLevel',
  'codeeditor':    'CodeEditorLevel',
  'decision':      'DecisionLevel',
  'review':        'ReviewLevel',
}

// Los 4 tipos de puzzle usan el mismo componente
// pero reciben el type como prop para saber qué variante mostrar
export function isPuzzleType(type: LevelType): boolean {
  return ['puzzle-sort', 'puzzle-fill', 'puzzle-bug', 'puzzle-match'].includes(type)
}

// ------------------------------------------------------------
// INICIALIZAR ESTADO DEL NIVEL
// ------------------------------------------------------------

export function initLevelState(level: Level): LevelState {
  return {
    level,
    status: 'idle',
    stars: 0,
    fragUsed: false,
    fragAvailableThisRun: level.fragAvailable,
    unlockedCards: [],
    unlockedObjects: [],
    hintsUsed: 0,
  }
}

// ------------------------------------------------------------
// COMPLETAR NIVEL — maneja todas las recompensas
// ------------------------------------------------------------

export interface CompletionResult {
  stars: 0 | 1 | 2 | 3
  newCards: Card[]
  newObjects: GameObject[]
  secretCardUnlocked: boolean
  suggestRedirect: string | null  // id del nivel sugerido para repasar
  nextLevelId: string | null
}

export function completeLevel(
  level: Level,
  stars: 0 | 1 | 2 | 3,
  usedFrag: boolean,
  allLevels: Level[],
  allCards: Card[],
  allObjects: GameObject[]
): CompletionResult {
  const canonicalId = level.id

  // guardar progreso
  saveProgress(canonicalId, stars, usedFrag)

  // desbloquear cartas
  const newCards: Card[] = []
  for (const cardId of level.rewardCards) {
    const card = allCards.find(c => c.id === cardId)
    if (card) {
      unlockCard(cardId)
      newCards.push(card)
    }
  }

  // desbloquear objetos
  const newObjects: GameObject[] = []
  for (const objId of level.rewardObjects) {
    const obj = allObjects.find(o => o.id === objId)
    if (!obj) continue

    const needsThreeStars = level.isReview && obj.obtainCondition?.includes('3 estrellas')
    if (needsThreeStars && stars < 3) continue

    unlockObject(objId)
    newObjects.push(obj)
  }

  // carta secreta
  const save = getSave()
  const secretCardUnlocked =
    !usedFrag &&
    (save?.fragUsedTotal ?? 0) === 0 &&
    canonicalId === '5-02'

  // sugerir redirect
  let suggestRedirect: string | null = null
  if (stars < 2 && level.failRedirectTo) {
    suggestRedirect = level.failRedirectTo
  }

  return {
    stars,
    newCards,
    newObjects,
    secretCardUnlocked,
    suggestRedirect,
    nextLevelId: getNextLevelId(canonicalId, allLevels),
  }
}

function getNextLevelId(currentId: string, allLevels: Level[]): string | null {
  const idx = allLevels.findIndex(l => l.id === currentId)
  if (idx === -1 || idx === allLevels.length - 1) return null
  return allLevels[idx + 1].id
}

// ------------------------------------------------------------
// VALIDACIÓN DE ACCESO CON MENSAJE
// ------------------------------------------------------------

export interface AccessCheck {
  allowed: boolean
  blockedBy?: 'missing-objects' | 'locked'
  missingObjectNames?: string[]
  message?: string
}

export function checkLevelAccess(levelId: string, allLevels: Level[]): AccessCheck {
  const result = canAccessLevel(levelId, allLevels)

  if (result.allowed) return { allowed: true }

  if (result.reason === 'missing-objects') {
    // Nota: El objeto nombre ahora se espera que venga de la UI o se asigne el ID
    const names = result.objects
    return {
      allowed: false,
      blockedBy: 'missing-objects',
      missingObjectNames: names,
      message: `Necesitas los objetos requeridos`,
    }
  }

  return {
    allowed: false,
    blockedBy: 'locked',
    message: 'Completa los niveles anteriores primero',
  }
}

// ------------------------------------------------------------
// HINT DE REPASO
// ------------------------------------------------------------

export interface RepasHint {
  shouldShow: boolean
  levelId: string | null
  levelTitle: string | null
  message: string | null
}

export function getReviewHint(levelId: string, levels: Level[]): RepasHint {
  const save = getSave()
  if (!save) return { shouldShow: false, levelId: null, levelTitle: null, message: null }

  // Buscamos si falló mucho
  const progress = save.progress[levelId]
  const shouldSuggest = (progress?.attempts ?? 0) >= 3 && !progress?.completed
  
  if (!shouldSuggest) {
    return { shouldShow: false, levelId: null, levelTitle: null, message: null }
  }

  const level = levels.find(l => l.id === levelId)
  const redirectId = level?.failRedirectTo
  
  if (!redirectId) {
    return { shouldShow: false, levelId: null, levelTitle: null, message: null }
  }

  const redirectLevel = levels.find(l => l.id === redirectId)
  return {
    shouldShow: true,
    levelId: redirectId,
    levelTitle: redirectLevel?.title ?? null,
    message: `FRAG: "Parece que este concepto necesita más práctica. Te sugiero repasar '${redirectLevel?.title}'."`,
  }
}

// ------------------------------------------------------------
// OBJETOS CONSULTABLES EN EL NIVEL
// ------------------------------------------------------------

export function getAvailableHintObjects(level: Level, allObjects: GameObject[]): GameObject[] {
  if (!level?.hintObjects) return []

  const save = getSave()
  if (!save) return []

  return level.hintObjects
    .filter(objId => save.objects.includes(objId))
    .map(objId => allObjects.find(o => o.id === objId))
    .filter((obj): obj is GameObject => obj !== undefined)
}

export function canUseHintObject(level: Level, hintsUsed: number): boolean {
  if (!level?.hintObjects) return false
  const maxHints = level.id === '5-02' ? 2 : 99
  return hintsUsed < maxHints
}

// ------------------------------------------------------------
// HELPERS DE DATOS
// ------------------------------------------------------------

// Estas funciones de ayuda se han eliminado por redundancia con los servicios.

// Se eliminó getSectorInfo porque ahora GameMapClient genera los actos directamente con la data de la DB.