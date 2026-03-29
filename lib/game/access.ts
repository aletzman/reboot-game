import type { GameSave, LevelAccessResult, Level } from '@/types/game'

/**
 * Versión pura de la lógica de acceso para ser usada en Middleware y Server Components
 */

export function canAccessLevel(
  levelId: string, 
  save: GameSave | null, 
  levels: Level[]
): LevelAccessResult {
  const id = levelId.toUpperCase()
  const FREE_LEVELS = ['P-00', 'P-01']

  if (FREE_LEVELS.includes(id)) return { allowed: true }
  if (!save) return { allowed: false, reason: 'locked', requiredAct: 0 }

  const levelIndex = levels.findIndex(l => l.id === levelId)
  if (levelIndex === -1) return { allowed: false, reason: 'locked', requiredAct: 0 }

  const level = levels[levelIndex]

  // Verificar objetos requeridos
  const reqObjs = level.requiredObjects ?? []
  const missingObjects = reqObjs.filter(
    (objId: string) => !save.objects.includes(objId)
  )

  if (missingObjects.length > 0) {
    return { allowed: false, reason: 'missing-objects', objects: missingObjects }
  }

  // Verificar que el acto esté desbloqueado
  if (!isActUnlocked(level.act, save, levels)) {
    return { allowed: false, reason: 'locked', requiredAct: level.act }
  }

  // 1. Si es el primer nivel del acto, ya pasó isActUnlocked
  // Buscamos el primer nivel de este acto
  const firstLevelOfAct = levels.find(l => l.act === level.act)
  if (firstLevelOfAct && firstLevelOfAct.id === levelId) {
    return { allowed: true }
  }

  // 2. Si no es el primero, el anterior debe estar completado
  // Nota: Consideramos el anterior en el array de niveles
  if (levelIndex > 0) {
    const prevLevel = levels[levelIndex - 1]

    // Si el anterior es de otro acto, este sigue siendo el "primero" en lógica secuencial de este acto
    if (prevLevel.act !== level.act) return { allowed: true }

    const prevCompleted = save.progress[prevLevel.id]?.completed
    if (!prevCompleted) {
      return { allowed: false, reason: 'locked', requiredAct: level.act }
    }
  }

  return { allowed: true }
}

export function isActUnlocked(
  actNumber: number, 
  save: GameSave | null, 
  levels: Level[]
): boolean {
  if (actNumber <= 0) return true
  if (!save) return false

  // Acto N se desbloquea si algún nivel del Acto N-1 está completado 
  // o si el Acto N-1 está marcado como completado de alguna forma.
  // Regla simple: Al menos un nivel del acto anterior debe estar completado.
  // O mejor aún: el último nivel (Review) del acto anterior debe estar completado.

  const prevActNumber = actNumber - 1
  const prevActLevels = levels.filter(l => l.act === prevActNumber)

  if (prevActLevels.length === 0) return true // No hay niveles previos, asumimos desbloqueado

  // Si es Acto 1, chequeamos Acto 0 (P-00, P-01)
  if (prevActNumber === 0) {
    return save.progress['P-01']?.completed || save.progress['P-00']?.completed
  }

  // Para otros actos, buscamos obligatoriamente el nivel de Review (X-R)
  const reviewLevelId = `${prevActNumber}-R`
  return save.progress[reviewLevelId]?.completed ?? false
}

export function requiresLogin(levelId: string): boolean {
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
