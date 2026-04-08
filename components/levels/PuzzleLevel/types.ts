import { Level, LevelState } from '@/types/game'

export interface PuzzleLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
    onStatusChange: (status: LevelState['status'], reason?: LevelState['failReason'], context?: any) => void
}

export interface PuzzleData {
    type: 'sort' | 'fill' | 'bug' | 'match'
    items: PuzzleItem[]
    pairs?: MatchPair[]      // solo para match
    rightItems?: PuzzleItem[] // nuevo: para match dinámico
    bugLineIndex?: number    // solo para bug
    fillAnswers?: string[]   // respuestas correctas para fill
    isCode?: boolean
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
    'P-01': {
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

    // MATCH — nivel 3-01: variable y loop (antes PuzzleReveal)
    '3-01': {
        type: 'match',
        items: [
            { id: 'l1', text: 'ASIGNAR: energía = 100', isCode: false },
            { id: 'l2', text: 'REPETIR(4) { MOVER }', isCode: false },
        ],
        pairs: [
            { leftId: 'l1', rightId: 'r1' },
            { leftId: 'l2', rightId: 'r2' },
        ],
        rightItems: [
            { id: 'r1', text: 'let energia = 100;' },
            { id: 'r2', text: 'for(let i=0; i<4; i++) { robot.move(); }' },
        ],
        isCode: true,
    },

    // MATCH — nivel 3-02: condicional y función (antes PuzzleReveal)
    '3-02': {
        type: 'match',
        items: [
            { id: 'l1', text: "SI sensor==ROJO { GIRAR }", isCode: false },
            { id: 'l2', text: 'FUNCIÓN escanear() { ACTIVAR }', isCode: false },
        ],
        pairs: [
            { leftId: 'l1', rightId: 'r1' },
            { leftId: 'l2', rightId: 'r2' },
        ],
        rightItems: [
            { id: 'r1', text: "if(sensor === 'rojo') { robot.turn('left'); }" },
            { id: 'r2', text: 'function escanear() { robot.activate(); }' },
        ],
        isCode: true,
    },

    // MATCH — nivel 3-03: todos los conceptos juntos
    '3-03': {
        type: 'match',
        items: [
            { id: 'l1', text: 'VARIABLE: nombre = 5', isCode: false },
            { id: 'l2', text: 'REPETIR(3) { MOVER }', isCode: false },
            { id: 'l3', text: "SI panel==VERDE { ACTIVAR }", isCode: false },
            { id: 'l4', text: 'FUNCIÓN mover(n) { MOVER(n) }', isCode: false },
        ],
        pairs: [
            { leftId: 'l1', rightId: 'r1' },
            { leftId: 'l2', rightId: 'r2' },
            { leftId: 'l3', rightId: 'r3' },
            { leftId: 'l4', rightId: 'r4' },
        ],
        rightItems: [
            { id: 'r1', text: 'let nombre = 5;' },
            { id: 'r2', text: 'for(let i=0; i<3; i++) { robot.move(); }' },
            { id: 'r3', text: "if(panel === 'verde') { robot.activate(); }" },
            { id: 'r4', text: 'function mover(n) { robot.move(n); }' },
        ],
        isCode: true,
    },

    // MATCH — nivel 3-04: conceptos avanzados (antes PuzzleReveal)
    '3-04': {
        type: 'match',
        items: [
            { id: 'l1', text: 'IMPRIMIR "estado: OK"', isCode: false },
            { id: 'l2', text: 'TEXTO: "Sector 7"', isCode: false },
            { id: 'l3', text: 'energía ES_IGUAL 0', isCode: false },
            { id: 'l4', text: 'NOTA: // esto es una nota', isCode: false },
        ],
        pairs: [
            { leftId: 'l1', rightId: 'r1' },
            { leftId: 'l2', rightId: 'r2' },
            { leftId: 'l3', rightId: 'r3' },
            { leftId: 'l4', rightId: 'r4' },
        ],
        rightItems: [
            { id: 'r1', text: "console.log('estado: OK');" },
            { id: 'r2', text: "let zona = 'Sector 7';" },
            { id: 'r3', text: 'if(energia === 0) { /* sin energía */ }' },
            { id: 'r4', text: '// esto es un comentario' },
        ],
        isCode: true,
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
    '1-R': {
        type: 'match',
        items: [
            { id: 'l1', text: 'Secuencia' },
            { id: 'l2', text: 'Bucle' },
            { id: 'l3', text: 'Condicional' },
            { id: 'l4', text: 'Orden de ejecución' },
        ],
        pairs: [
            { leftId: 'l1', rightId: 'r1' },
            { leftId: 'l2', rightId: 'r2' },
            { leftId: 'l3', rightId: 'r3' },
            { leftId: 'l4', rightId: 'r4' },
        ],
        rightItems: [
            { id: 'r1', text: 'Pasos en orden' },
            { id: 'r2', text: 'Repetir acciones' },
            { id: 'r3', text: 'Si... entonces...' },
            { id: 'r4', text: 'El top-down del programa' },
        ]
    },
    '2-R': {
        type: 'sort',
        items: [
            { id: '1', text: 'FUNCION estabilizar()' },
            { id: '2', text: '  SI nucleo == caliente ENTONCES' },
            { id: '3', text: '    ACTIVAR(refrigerante)' },
            { id: '4', text: '  FIN SI' },
            { id: '5', text: 'FIN FUNCION' },
        ]
    },
    '3-R': {
        type: 'match',
        items: [
            { id: 'l1', text: 'REPETIR (bloque)' },
            { id: 'l2', text: 'SI (bloque)' },
            { id: 'l3', text: 'MOVER()' },
            { id: 'l4', text: '// comentario' },
        ],
        pairs: [
            { leftId: 'l1', rightId: 'r1' },
            { leftId: 'l2', rightId: 'r2' },
            { leftId: 'l3', rightId: 'r3' },
            { leftId: 'l4', rightId: 'r4' },
        ],
        rightItems: [
            { id: 'r1', text: 'for / while' },
            { id: 'r2', text: 'if-else' },
            { id: 'r3', text: 'Invocación de función' },
            { id: 'r4', text: 'Explicación del código' },
        ]
    },
    '4-R': {
        type: 'bug',
        bugLineIndex: 1,
        items: [
            { id: 'a', text: 'const nucleo = "estable";' },
            { id: 'b', text: 'nucleo = "critico";', hasBug: true }, // error: const cannot be reassigned
            { id: 'c', text: 'console.log(nucleo);' }
        ]
    },
    '5-R': {
        type: 'fill',
        items: [
            { id: 'a', text: 'function calcularEnergia(____)', blank: '____', answer: 'v', isCode: true },
            { id: 'b', text: '  let total = v * 10;', isCode: true },
            { id: 'c', text: '  ____ total;', blank: '____', answer: 'return', isCode: true },
            { id: 'd', text: '}', isCode: true },
        ],
        fillAnswers: ['v', 'return']
    },
    '6-R': {
        type: 'sort',
        items: [
            { id: '1', text: 'let n = 0;' },
            { id: '2', text: 'while (n < 5) {' },
            { id: '3', text: '  robot.move();' },
            { id: '4', text: '  n++;' },
            { id: '5', text: '}' },
        ]
    },
    '7-R': {
        type: 'match',
        items: [
            { id: 'l1', text: 'const data = [1, 2, 3]' },
            { id: 'l2', text: 'const obj = { id: 1 }' },
            { id: 'l3', text: 'data.length' },
            { id: 'l4', text: 'obj.id' },
        ],
        pairs: [
            { leftId: 'l1', rightId: 'r1' },
            { leftId: 'l2', rightId: 'r2' },
            { leftId: 'l3', rightId: 'r3' },
            { leftId: 'l4', rightId: 'r4' },
        ],
        rightItems: [
            { id: 'r1', text: 'Arreglo (Array)' },
            { id: 'r2', text: 'Objeto' },
            { id: 'r3', text: 'Longitud del arreglo' },
            { id: 'r4', text: 'Propiedad del objeto' },
        ]
    },
}

export const MATCH_RIGHT: Record<string, PuzzleItem[]> = {
    'P-01': [
        { id: 'r1', text: '4' },
        { id: 'r2', text: 'B' },
        { id: 'r3', text: '□' },
        { id: 'r4', text: 'OOOO' },
    ],
    '1-05': [
        { id: 'r1', text: 'avanzar' },
        { id: 'r2', text: 'repetir N veces' },
        { id: 'r3', text: 'tomar decisión' },
        { id: 'r4', text: 'guardar secuencia' },
    ],
}

export const CONNECTION_COLORS = [
    'var(--block-girar)',
    'var(--block-activar)',
    'var(--block-llamar)',
    'var(--block-repetir)',
    '#55e200', // green-light
    '#E24B4A'  // red
]
