// ============================================================ 
// Motor central: determina qué renderizar, valida acceso,
// maneja recompensas y sugiere redirects de repaso
// ============================================================

import type { Level, LevelType, Card, GameObject, LevelState } from '@/types/game'
import levelsData from '@/data/levels.json'
import cardsData from '@/data/cards.json'
import objectsData from '@/data/objects.json'
import {
  canAccessLevel,
  saveProgress,
  unlockCard,
  unlockObject,
  getSave,
  shouldSuggestRedirect,
  getFailRedirect,
} from '@/lib/gameState'

// ------------------------------------------------------------
// OBTENER NIVEL POR ID
// ------------------------------------------------------------

export function getLevelById(id: string): Level | null {
  const level = (levelsData.levels as Level[]).find(l => l.id === id)
  return level ?? null
}

export function getAllLevels(): Level[] {
  return levelsData.levels as Level[]
}

export function getLevelsByAct(act: number): Level[] {
  return (levelsData.levels as Level[]).filter(l => l.act === act)
}

export function getNextLevelId(currentId: string): string | null {
  const levels = levelsData.levels as Level[]
  const idx = levels.findIndex(l => l.id === currentId)
  if (idx === -1 || idx === levels.length - 1) return null
  return levels[idx + 1].id
}

export function getPrevLevelId(currentId: string): string | null {
  const levels = levelsData.levels as Level[]
  const idx = levels.findIndex(l => l.id === currentId)
  if (idx <= 0) return null
  return levels[idx - 1].id
}

// ------------------------------------------------------------
// COMPONENTE POR TIPO
// ------------------------------------------------------------

// Mapeo de type → nombre del componente a importar dinámicamente
export const LEVEL_COMPONENT_MAP: Record<LevelType, string> = {
  'cinematic':     'CinematicLevel',
  'lightbot':      'LightbotLevel',
  'scratch':       'ScratchLevel',
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
  levelId: string,
  stars: 0 | 1 | 2 | 3,
  usedFrag: boolean
): CompletionResult {
  const level = getLevelById(levelId)
  if (!level) throw new Error(`Nivel no encontrado: ${levelId}`)

  // guardar progreso
  saveProgress(levelId, stars, usedFrag)

  // desbloquear cartas
  const newCards: Card[] = []
  for (const cardId of level.rewardCards) {
    const card = getCardById(cardId)
    if (card) {
      unlockCard(cardId)
      newCards.push(card)
    }
  }

  // desbloquear objetos
  // los objetos de repaso solo se dan con 3 estrellas
  const newObjects: GameObject[] = []
  for (const objId of level.rewardObjects) {
    const obj = getObjectById(objId)
    if (!obj) continue

    const needsThreeStars = level.isReview && obj.obtainCondition?.includes('3 estrellas')
    if (needsThreeStars && stars < 3) continue

    unlockObject(objId)
    newObjects.push(obj)
  }

  // carta secreta — si nunca usó FRAG en todo el juego
  const save = getSave()
  const secretCardUnlocked =
    !usedFrag &&
    (save?.fragUsedTotal ?? 0) === 0 &&
    levelId === '5-02'

  // sugerir redirect si falló mucho en algún nivel relacionado
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
    nextLevelId: getNextLevelId(levelId),
  }
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

export function checkLevelAccess(levelId: string): AccessCheck {
  const result = canAccessLevel(levelId)

  if (result.allowed) return { allowed: true }

  if (result.reason === 'missing-objects') {
    const names = result.objects.map(id => {
      const obj = getObjectById(id)
      return obj?.name ?? id
    })
    return {
      allowed: false,
      blockedBy: 'missing-objects',
      missingObjectNames: names,
      message: `Necesitas: ${names.join(', ')}`,
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

export function getReviewHint(levelId: string): RepasHint {
  if (!shouldSuggestRedirect(levelId)) {
    return { shouldShow: false, levelId: null, levelTitle: null, message: null }
  }

  const redirectId = getFailRedirect(levelId)
  if (!redirectId) {
    return { shouldShow: false, levelId: null, levelTitle: null, message: null }
  }

  const redirectLevel = getLevelById(redirectId)
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

export function getAvailableHintObjects(levelId: string): GameObject[] {
  const level = getLevelById(levelId)
  if (!level?.hintObjects) return []

  const save = getSave()
  if (!save) return []

  return level.hintObjects
    .filter(objId => save.objects.includes(objId))
    .map(objId => getObjectById(objId))
    .filter((obj): obj is GameObject => obj !== null)
}

export function canUseHintObject(levelId: string, hintsUsed: number): boolean {
  const level = getLevelById(levelId)
  if (!level?.hintObjects) return false
  // máximo 2 consultas de objetos por nivel en el nivel final
  const maxHints = levelId === '5-02' ? 2 : 99
  return hintsUsed < maxHints
}

// ------------------------------------------------------------
// HELPERS DE DATOS
// ------------------------------------------------------------

export function getCardById(id: string): Card | null {
  const card = (cardsData.cards as Card[]).find(c => c.id === id)
  return card ?? null
}

export function getObjectById(id: string): GameObject | null {
  const obj = (objectsData.objects as GameObject[]).find(o => o.id === id)
  return obj ?? null
}

export function getCardsByRarity(rarity: string): Card[] {
  return (cardsData.cards as Card[]).filter(c => c.rarity === rarity)
}

export function getRequiredObjectsForLevel(levelId: string): GameObject[] {
  const level = getLevelById(levelId)
  if (!level) return []
  return level.requiredObjects
    .map(id => getObjectById(id))
    .filter((obj): obj is GameObject => obj !== null)
}

// ------------------------------------------------------------
// MAPA DEL MUNDO — estado de sectores
// ------------------------------------------------------------

export interface SectorInfo {
  act: number
  name: string
  levels: Level[]
  reviewLevel: Level | null
  completedCount: number
  totalCount: number
  isUnlocked: boolean
  isCompleted: boolean
}

export function getSectorInfo(actNumber: number): SectorInfo {
  const save = getSave()
  const allLevels = getLevelsByAct(actNumber)
  const regularLevels = allLevels.filter(l => !l.isReview)
  const reviewLevel = allLevels.find(l => l.isReview) ?? null

  const completedCount = regularLevels.filter(
    l => save?.progress[l.id]?.completed
  ).length

  // un sector está desbloqueado si el anterior está completo
  const prevActCompleted = actNumber === 0
    ? true
    : getLevelsByAct(actNumber - 1)
        .filter(l => !l.isReview)
        .every(l => save?.progress[l.id]?.completed)

  return {
    act: actNumber,
    name: allLevels[0]?.actName ?? '',
    levels: regularLevels,
    reviewLevel,
    completedCount,
    totalCount: regularLevels.length,
    isUnlocked: prevActCompleted,
    isCompleted: completedCount === regularLevels.length,
  }
}