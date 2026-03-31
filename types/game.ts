// ------------------------------------------------------------
// NIVEL
// ------------------------------------------------------------

export type LevelType =
  | 'cinematic'
  | 'noderoutine'
  | 'logicassembly'
  | 'puzzle-sort'
  | 'puzzle-fill'
  | 'puzzle-bug'
  | 'puzzle-match'
  | 'speedtyping'
  | 'codeeditor'
  | 'decision'
  | 'review'

export interface ReviewFailRedirect {
  [concept: string]: string // concepto → id del nivel donde se vio
}

export interface TheorySlide {
  step: number
  title: string
  content: string
  code?: string
  explanation?: string
  highlightLines?: number[]
  avoidSyntax?: string[]
}

export interface Challenge {
  difficulty: 'easy' | 'medium' | 'hard'
  instruction: string
  starConditions: string[]
}

export interface Level {
  id: string
  act: number
  actName: string
  type: LevelType
  title: string
  description: string
  narrative: string
  mechanic?: string
  concept?: string
  codeExample?: string
  fragAvailable: boolean
  fragHint?: string | string[]
  optional: boolean
  isReview: boolean
  reviewOf: string[]
  requiredObjects: string[]
  rewardObjects: string[]
  rewardCards: string[]
  failRedirectTo: string | null
  reviewFailRedirect?: ReviewFailRedirect
  hintObjects?: string[]   // objetos consultables durante el nivel
  maxStars?: 1 | 2 | 3
  note?: string
  theory?: TheorySlide[]
  pitfalls?: string[]      // errores comunes específicos del tema
  challenge?: Challenge    // desafío detallado
}

// ------------------------------------------------------------
// CARTA
// ------------------------------------------------------------

export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface Card {
  id: string
  name: string
  rarity: CardRarity
  concept: string
  unlockedBy: string       // id del nivel donde se obtiene
  actName: string
  frontArt: string         // clave del arte geométrico del frente
  description: string      // qué es este concepto
  humanExplanation: string // analogía en lenguaje humano
  codeExample: string | null // null en actos 1-3, código real en acto 4+
  tip: string              // consejo profesional
}

// ------------------------------------------------------------
// OBJETO
// ------------------------------------------------------------

export type ObjectType = 'key' | 'hint' | 'lore' | 'final'

export interface GameObject {
  id: string
  name: string
  icon: string
  obtainedIn: string       // id del nivel donde se obtiene
  description: string
  lore: string
  type: ObjectType
  required: boolean        // si true, bloquea niveles sin él
  usedIn: string[]         // ids de niveles donde tiene efecto
  effect: string           // qué hace cuando se usa
  inventoryNote: string    // texto visible en el inventario
  obtainCondition?: string // ej: "3 estrellas en nivel 1-R"
}

// ------------------------------------------------------------
// PROGRESO DEL JUGADOR
// ------------------------------------------------------------

export interface LevelProgress {
  completed: boolean
  stars: 0 | 1 | 2 | 3
  usedFrag: boolean
  attempts: number         // cuántas veces intentó el nivel
  completedAt?: string     // ISO date string
}

export interface GameSave {
  version: number          // para migraciones futuras del save
  player: {
    name: string
    gender: 'él' | 'ella' | 'elle'
  }
  progress: {
    [levelId: string]: LevelProgress
  }
  cards: string[]          // ids de cartas desbloqueadas
  objects: string[]        // ids de objetos recogidos
  fragUsedTotal: number    // para la carta secreta (nunca usar FRAG)
  currentLevelId: string   // último nivel visitado
  createdAt: string        // ISO date string
  updatedAt: string        // ISO date string
}

// ------------------------------------------------------------
// ESTADO DE LA UI DEL NIVEL
// ------------------------------------------------------------

export interface LevelFailContext {
  panel?: 'main' | 'f1' | 'f2'
  command?: CommandType
  coords?: { x: number; y: number }
  involvedPanels?: Array<'main' | 'f1' | 'f2'>
}

export interface LevelState {
  level: Level
  status: 'idle' | 'playing' | 'success' | 'failed' | 'reviewing'
  failReason?: 'generic' | 'timeout' | 'crash' | 'infinite-loop' | 'out-of-bounds'
  failContext?: LevelFailContext
  stars: 0 | 1 | 2 | 3
  fragUsed: boolean
  fragAvailableThisRun: boolean
  unlockedCards: Card[]
  unlockedObjects: GameObject[]
  hintsUsed: number        // cuántas veces consultó objetos de pista
}

// ------------------------------------------------------------
// MAPA DEL MUNDO
// ------------------------------------------------------------

export type SectorStatus = 'locked' | 'available' | 'active' | 'completed'

export interface Sector {
  id: number
  name: string
  levels: string[]         // ids de niveles en orden
  status: SectorStatus
  requiredSector?: number  // sector que debe completarse antes
}

// ------------------------------------------------------------
// MOTOR DE NODEROUTINE
// ------------------------------------------------------------

export type CommandType =
  | 'move'
  | 'turn-left'
  | 'turn-right'
  | 'jump'
  | 'drop'
  | 'activate'
  | 'repeat'
  | 'call-fn' // deprecated soon
  | 'call-f1'
  | 'call-f2'

export interface Command {
  type: CommandType
  times?: number           // para repeat
  fnName?: string          // para call-fn
  children?: Command[]     // para repeat
}

export type Direction = 'north' | 'south' | 'east' | 'west'

export type TileType =
  | 'floor'
  | 'wall'
  | 'target'
  | 'active'
  | 'broken'
  | 'generator'
  | 'empty'

export interface MapTile {
  type: TileType
  x: number
  y: number
  height?: number // 0 for ground, 1 for block 1, etc.
  activated?: boolean
}

export interface RobotState {
  x: number
  y: number
  height?: number // same as block height
  direction: Direction
  isMoving: boolean
}

export interface NodeRoutineLevelData {
  map: MapTile[][]
  robotStart: { x: number; y: number; direction: Direction; height?: number }
  targets: { x: number; y: number; height?: number }[]
  maxCommands?: number     // Límite de comandos para obtener 3 estrellas
  allowedCommands?: CommandType[]
  allowF1?: boolean        // habilita el contenedor F1
  allowF2?: boolean        // habilita el contenedor F2
  maxF1Commands?: number   // límite óptimo de comandos para F1 (para estrellas, opcional)
  maxF2Commands?: number   // límite óptimo de comandos para F2
  uiLimitMain?: number     // Límite estricto de ranuras en la UI para MAIN
  uiLimitF1?: number       // Límite estricto de ranuras en la UI para F1
  uiLimitF2?: number       // Límite estricto de ranuras en la UI para F2
}

// ------------------------------------------------------------
// MOTOR DE LOGICASSEMBLY
// ------------------------------------------------------------

export type LogicAssemblyBlockType =
  | 'MOVER'
  | 'GIRAR'
  | 'REPETIR'
  | 'SI'
  | 'SI_NO'
  | 'FUNCION'
  | 'LLAMAR'
  | 'ACTIVAR'
  | 'ASIGNAR'

export interface LogicAssemblyBlock {
  id: string
  type: LogicAssemblyBlockType
  value?: number | string   // para MOVER(n), REPETIR(n), GIRAR('izquierda')
  condition?: string        // para SI
  children?: LogicAssemblyBlock[] // bloques anidados dentro de REPETIR, SI, etc
  fnName?: string           // para FUNCION y LLAMAR
}

// ------------------------------------------------------------
// SPEED TYPING
// ------------------------------------------------------------

export interface TypingLine {
  text: string             // línea a tipear
  typed: string            // lo que el jugador ha escrito
  correct: boolean | null  // null = no evaluado aún
}

export interface SpeedTypingState {
  lines: TypingLine[]
  currentLineIndex: number
  timeLeft: number         // segundos restantes
  started: boolean
  finished: boolean
  wpm: number              // palabras por minuto al terminar
}

// ------------------------------------------------------------
// CODE EDITOR
// ------------------------------------------------------------

export interface TestCase {
  id: string
  description: string      // qué verifica este test
  input?: unknown          // input para la función del jugador
  expected: unknown        // resultado esperado
  passed: boolean | null   // null = no ejecutado
}

export interface CodeEditorState {
  code: string             // código actual del jugador
  running: boolean
  output: string[]         // líneas de console.log
  error: string | null     // error de ejecución si hay
  tests: TestCase[]        // para niveles con tests automáticos
  allTestsPassed: boolean
}

// ------------------------------------------------------------
// HELPERS DE TIPO
// ------------------------------------------------------------

export type ActNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export interface ActSummary {
  number: ActNumber
  name: string
  levelIds: string[]
  reviewLevelId: string | null
  completed: boolean
  totalStars: number
  maxStars: number
}

// Resultado de intentar acceder a un nivel
export type LevelAccessResult =
  | { allowed: true }
  | { allowed: false; reason: 'missing-objects'; objects: string[] }
  | { allowed: false; reason: 'locked'; requiredAct: number }

// ------------------------------------------------------------
// GLOSARIO
// ------------------------------------------------------------

export interface GlossaryTerm {
  id: string
  term: string
  technical: string         // definición técnica
  human: string             // analogía en lenguaje humano
}

// ------------------------------------------------------------
// DIÁLOGOS
// ------------------------------------------------------------

export interface FragDialogues {
  identity: {
    full_name: string
    nickname: string
    build: string
    designation: string
    status: string
    memory_integrity: string
  }
  intros: string[]
  confirmations: string[]
  outros: string[]
  fail_reactions: string[]
  success_reactions: string[]
  ambient_tips: string[]
  story_beats: { [key: string]: string }
}

export interface NarrativeDialogues {
  [key: string]: string
}

export interface Dialogues {
  frag: FragDialogues
  narrative: NarrativeDialogues
}

// ------------------------------------------------------------
// ROADMAP
// ------------------------------------------------------------

export interface RoadmapTopic {
  nombre: string
  subtemas: string[]
}

export interface RoadmapPhase {
  semanas: string
  temas: RoadmapTopic[]
}