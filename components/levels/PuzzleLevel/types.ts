import { Level, LevelState } from '@/types/game'

export interface PuzzleLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
}

export interface PuzzleData {
    type: 'sort' | 'fill' | 'bug' | 'match'
    items: PuzzleItem[]
    pairs?: MatchPair[]      // solo para match
    rightItems?: { id: string; text: string }[] // nuevo: para match dinámico
    bugLineIndex?: number    // solo para bug
    fillAnswers?: string[]   // respuestas correctas para fill
}

export interface PuzzleItem {
    id: string
    text: string
    isCode?: boolean
    hasBug?: boolean
    blank?: string           // texto del hueco para fill
    answer?: string          // respuesta correcta para fill
}

export interface MatchPair {
    leftId: string
    rightId: string
}

export const PUZZLE_DATA: Record<string, PuzzleData> = {
    // MATCH — Verificación humana
    'P-02': {
        type: 'match',
        items: [
            { id: 'l1', text: '1, 2, 3, ?' },
            { id: 'l2', text: 'A, B, A, ?' },
            { id: 'l3', text: '■, □, ■, ?' },
            { id: 'l4', text: 'O, OO, OOO, ?' },
        ],
        pairs: [
            { leftId: 'l1', rightId: 'r1' },
            { leftId: 'l2', rightId: 'r2' },
            { leftId: 'l3', rightId: 'r3' },
            { leftId: 'l4', rightId: 'r4' },
        ],
    },

    // SORT — ordenar líneas de pseudocódigo
    '2-02': {
        type: 'sort',
        items: [
            { id: 'a', text: 'INICIO' },
            { id: 'b', text: '  MOVER(3)' },
            { id: 'c', text: '  SI panel == VERDE entonces' },
            { id: 'd', text: '    ACTIVAR()' },
            { id: 'e', text: '  FIN SI' },
            { id: 'f', text: 'FIN' },
        ],
    },

    // FILL — completar huecos del código
    '2-04': {
        type: 'fill',
        items: [
            { id: 'a', text: 'INICIO', isCode: false },
            { id: 'b', text: '  pasos = ___', blank: '___', answer: '4', isCode: true },
            { id: 'c', text: '  REPETIR ___ veces', blank: '___', answer: 'pasos', isCode: true },
            { id: 'd', text: '    MOVER()', isCode: true },
            { id: 'e', text: '  FIN REPETIR', isCode: false },
            { id: 'f', text: '  nombre = ___', blank: '___', answer: '"robot"', isCode: true },
            { id: 'g', text: 'FIN', isCode: false },
        ],
        fillAnswers: ['4', 'pasos', '"robot"'],
    },

    // BUG — encontrar el error
    '2-05': {
        type: 'bug',
        bugLineIndex: 3,
        items: [
            { id: 'a', text: 'INICIO' },
            { id: 'b', text: '  energia = 100' },
            { id: 'c', text: '  SI energia > 0 entonces' },
            { id: 'd', text: '    SI energia < 0 entonces', hasBug: true }, // bug: debería ser > 0
            { id: 'e', text: '      ACTIVAR()' },
            { id: 'f', text: '    FIN SI' },
            { id: 'g', text: '  FIN SI' },
            { id: 'h', text: 'FIN' },
        ],
    },

    // MATCH — emparejar conceptos
    '3-03': {
        type: 'match',
        items: [
            { id: 'l1', text: '→ avanzar', isCode: false },
            { id: 'l2', text: '↻ repetir 3 veces', isCode: false },
            { id: 'l3', text: '◇ si condición', isCode: false },
            { id: 'l4', text: 'ƒ función guardar', isCode: false },
        ],
        pairs: [
            { leftId: 'l1', rightId: 'r1' },
            { leftId: 'l2', rightId: 'r2' },
            { leftId: 'l3', rightId: 'r3' },
            { leftId: 'l4', rightId: 'r4' },
        ],
    },

    // BUG con JS — nivel 4-02
    '4-02': {
        type: 'bug',
        bugLineIndex: 3,
        items: [
            { id: 'a', text: 'const sector = "norte";' },
            { id: 'b', text: 'const distancia = 42;' },
            { id: 'c', text: 'const nombre = "REBOOT";' },
            { id: 'd', text: 'const total = distancia + sector;', hasBug: true }, // bug: number + string
            { id: 'e', text: 'console.log(total);' },
            { id: 'f', text: 'robot.move(distancia);' },
        ],
    },

    // BUG con arrays — nivel 4-06
    '4-06': {
        type: 'bug',
        bugLineIndex: 2,
        items: [
            { id: 'a', text: 'const items = ["A", "B", "C"];' },
            { id: 'b', text: '// acceder al primer elemento:' },
            { id: 'c', text: 'console.log(items[1]);', hasBug: true }, // bug: debería ser [0]
            { id: 'd', text: '' },
            { id: 'e', text: '// acceder al último:' },
            { id: 'f', text: 'console.log(items[items.length]);', hasBug: true }, // bug: debería ser length-1
        ],
    },

    // MATCH — emparejar pseudocódigo con JS (nivel 3-03 alternativo)
    '1-05': {
        type: 'match',
        items: [
            { id: 'l1', text: '→', isCode: false },
            { id: 'l2', text: '↻', isCode: false },
            { id: 'l3', text: '◇ SI', isCode: false },
            { id: 'l4', text: 'ƒ FUNCIÓN', isCode: false },
        ],
        pairs: [
            { leftId: 'l1', rightId: 'r1' },
            { leftId: 'l2', rightId: 'r2' },
            { leftId: 'l3', rightId: 'r3' },
            { leftId: 'l4', rightId: 'r4' },
        ],
    },
}

export const MATCH_RIGHT: Record<string, { id: string; text: string }[]> = {
    'P-02': [
        { id: 'r1', text: '4' },
        { id: 'r2', text: 'B' },
        { id: 'r3', text: '□' },
        { id: 'r4', text: 'OOOO' },
    ],
    '3-03': [
        { id: 'r1', text: 'secuencia' },
        { id: 'r2', text: 'loop / repetición' },
        { id: 'r3', text: 'condicional' },
        { id: 'r4', text: 'función' },
    ],
    '1-05': [
        { id: 'r1', text: 'avanzar' },
        { id: 'r2', text: 'repetir N veces' },
        { id: 'r3', text: 'tomar decisión' },
        { id: 'r4', text: 'guardar secuencia' },
    ],
}

export const CONNECTION_COLORS = [
    'var(--cyan)',
    'var(--purple)',
    'var(--amber)',
    'var(--blue)',
    '#55e200', // green-light
    '#E24B4A'  // red
]
