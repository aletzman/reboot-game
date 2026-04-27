import { BlockDef, LogicAssemblyLevelData } from './types'
import { LogicAssemblyBlock, LogicAssemblyBlockType } from '@/types/game'

// Redefinimos flatBlocks aquí para evitar dependencia circular con utils.ts
function flatBlocksLocal(blocks: LogicAssemblyBlock[]): LogicAssemblyBlock[] {
    const result: LogicAssemblyBlock[] = []
    if (!blocks) return result
    for (const b of blocks) {
        result.push(b)
        if (b.children) result.push(...flatBlocksLocal(b.children))
    }
    return result
}

export const BLOCK_DEFS: BlockDef[] = [
    {
        type: 'MOVER',
        label: 'MOVER',
        color: 'var(--block-mover-dark)',
        border: 'var(--block-mover)',
        hasValue: true,
        valueType: 'number',
        valueDefault: 1,
    },
    {
        type: 'GIRAR',
        label: 'GIRAR',
        color: 'var(--block-girar-dark)',
        border: 'var(--block-girar)',
        hasValue: true,
        valueType: 'direction',
        valueDefault: 'derecha',
        valueOptions: ['izquierda', 'derecha'],
    },
    {
        type: 'REPETIR',
        label: 'REPETIR',
        color: 'var(--block-repetir-dark)',
        border: 'var(--block-repetir)',
        hasValue: true,
        valueType: 'number',
        valueDefault: 2,
        hasChildren: true,
    },
    {
        type: 'SI',
        label: 'SI',
        color: 'var(--block-si-dark)',
        border: 'var(--block-si)',
        hasValue: true,
        valueType: 'text',
        valueDefault: 'panel == VERDE',
        hasChildren: true,
    },
    {
        type: 'SI_NO',
        label: 'SINO',
        color: 'var(--block-si-dark)',
        border: 'var(--block-si)',
        hasChildren: true,
    },
    {
        type: 'FUNCION',
        label: 'FUNCIÓN',
        color: 'var(--block-funcion-dark)',
        border: 'var(--block-funcion)',
        hasValue: true,
        valueType: 'text',
        valueDefault: 'miFuncion',
        hasChildren: true,
    },
    {
        type: 'LLAMAR',
        label: 'LLAMAR',
        color: 'var(--block-llamar-dark)',
        border: 'var(--block-llamar)',
        hasValue: true,
        valueType: 'text',
        valueDefault: 'miFuncion',
    },
    {
        type: 'ACTIVAR',
        label: 'ACTIVAR',
        color: 'var(--block-activar-dark)',
        border: 'var(--block-activar)',
    },
    {
        type: 'ASIGNAR',
        label: 'ASIGNAR',
        color: 'var(--block-asignar-dark)',
        border: 'var(--block-asignar)',
        hasValue: true,
        valueType: 'text',
        valueDefault: 'x = 1',
    },
]

export const LOGICASSEMBLY_DATA: Record<string, LogicAssemblyLevelData> = {

    // ─────────────────────────────────────────────
    // BLOQUE 1: MOVER + GIRAR + ACTIVAR — grid 4×4
    // ─────────────────────────────────────────────

    '2-01': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR'],
        limitBlocks: 2,
        maxBlocks: 8,
        hint: 'Muévete hasta el nodo y actívalo. Sin paredes, aprende el movimiento básico.',
        map: {
            grid: [
                [3, 0, 0, 2],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ],
            start: { x: 0, y: 0, dir: 'right' },
            objective: [{ x: 3, y: 0 }],
        },
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return flat.some(b => b.type === 'ACTIVAR')
        },
    },

    '2-02': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR'],
        limitBlocks: 4,
        maxBlocks: 8,
        hint: 'Hay una pared en el medio. Rodéala.',
        map: {
            grid: [
                [3, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 2],
            ],
            start: { x: 0, y: 0, dir: 'right' },
            objective: [{ x: 3, y: 3 }],
        },
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return flat.some(b => b.type === 'GIRAR') && flat.some(b => b.type === 'ACTIVAR')
        },
    },

    '2-03': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR'],
        limitBlocks: 4,
        maxBlocks: 8,
        hint: 'Las paredes bloquean el camino directo. Encuentra la ruta libre.',
        map: {
            grid: [
                [3, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 2],
            ],
            start: { x: 0, y: 0, dir: 'down' },
            objective: [{ x: 3, y: 3 }],
        },
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return flat.filter(b => b.type === 'GIRAR').length >= 2 && flat.some(b => b.type === 'ACTIVAR')
        },
    },

    '2-04': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR'],
        limitBlocks: 6,
        maxBlocks: 12,
        hint: 'Dos nodos separados por paredes. Necesitas activar ambos.',
        map: {
            grid: [
                [3, 0, 2, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 2],
            ],
            start: { x: 0, y: 0, dir: 'right' },
            objective: [{ x: 2, y: 0 }, { x: 3, y: 3 }],
        },
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return flat.filter(b => b.type === 'ACTIVAR').length >= 2
        },
    },

    '2-05': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR'],
        limitBlocks: 14,
        maxBlocks: 16,
        hint: 'Las paredes crean un laberinto. Hay una sola ruta que conecta los tres nodos.',
        map: {
            grid: [
                [3, 0, 1, 2],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
                [2, 1, 0, 2],
            ],
            start: { x: 0, y: 0, dir: 'down' },
            objective: [{ x: 3, y: 0 }, { x: 0, y: 3 }, { x: 3, y: 3 }],
        },
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return flat.filter(b => b.type === 'ACTIVAR').length >= 3
        },
    },

    // ─────────────────────────────────────────────
    // BLOQUE 2: + REPETIR — grid 5×5
    // ─────────────────────────────────────────────

    '2-06': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR'],
        limitBlocks: 4,
        maxBlocks: 6,
        hint: 'El pasillo recto invita a usar REPETIR. Las paredes te mantienen en el camino.',
        map: {
            grid: [
                [1, 1, 1, 1, 1],
                [3, 0, 0, 2, 0],
                [1, 1, 1, 0, 1],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 2, 0],
            ],
            start: { x: 0, y: 1, dir: 'right' },
            objective: [{ x: 3, y: 1 }, { x: 3, y: 4 }],
        },
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return flat.some(b => b.type === 'REPETIR') && flat.some(b => b.type === 'ACTIVAR')
        },
    },

    '2-07': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR'],
        limitBlocks: 5,
        maxBlocks: 7,
        hint: 'El patrón se repite, pero hay paredes que definen el camino correcto.',
        map: {
            grid: [
                [3, 0, 1, 0, 0],
                [0, 0, 1, 0, 0],
                [0, 0, 1, 2, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 1, 0, 0],
            ],
            start: { x: 0, y: 0, dir: 'down' },
            objective: [{ x: 3, y: 2 }],
        },
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return flat.some(b => b.type === 'REPETIR') && flat.some(b => b.type === 'ACTIVAR')
        },
    },

    '2-08': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR'],
        limitBlocks: 8,
        maxBlocks: 12,
        hint: 'Tres nodos en columna. Las paredes laterales te guían — usa REPETIR para el patrón.',
        map: {
            grid: [
                [3, 1, 2, 1, 0],
                [0, 1, 0, 1, 0],
                [0, 0, 2, 1, 0],
                [0, 1, 0, 1, 0],
                [0, 1, 2, 1, 0],
            ],
            start: { x: 0, y: 0, dir: 'down' },
            objective: [{ x: 2, y: 0 }, { x: 2, y: 2 }, { x: 2, y: 4 }],
        },
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return flat.some(b => b.type === 'REPETIR') && flat.some(b => b.type === 'ACTIVAR')
        },
    },

    '2-09': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR'],
        limitBlocks: 11,
        maxBlocks: 15,
        hint: 'Las paredes forman un zigzag. El patrón se repite exactamente dos veces.',
        map: {
            grid: [
                [3, 0, 0, 1, 0],
                [1, 1, 0, 1, 0],
                [0, 0, 0, 0, 0],
                [0, 1, 1, 1, 0],
                [2, 0, 2, 0, 2],
            ],
            start: { x: 0, y: 0, dir: 'right' },
            objective: [{ x: 0, y: 4 }, { x: 2, y: 4 }, { x: 4, y: 4 }],
        },
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return flat.some(b => b.type === 'REPETIR') && flat.filter(b => b.type === 'ACTIVAR').length >= 2
        },
    },

    '2-10': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR'],
        limitBlocks: 9,
        maxBlocks: 15,
        hint: 'Bucle dentro de bucle. Las paredes delimitan las filas — piensa en filas y columnas.',
        map: {
            grid: [
                [3, 0, 0, 0, 0],
                [1, 1, 0, 1, 1],
                [0, 0, 0, 0, 0],
                [0, 1, 1, 1, 1],
                [0, 0, 0, 0, 2],
            ],
            start: { x: 0, y: 0, dir: 'right' },
            objective: [{ x: 4, y: 4 }],
        },
        validateFn: (blocks) => {
            const repetirBlocks = blocks.filter(b => b.type === 'REPETIR')
            return repetirBlocks.some(b => b.children?.some(c => c.type === 'REPETIR'))
        },
    },

    // ─────────────────────────────────────────────
    // BLOQUE 3: + SI — grid 6×6
    // ─────────────────────────────────────────────

    '2-11': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR', 'SI', 'ASIGNAR'],
        limitBlocks: 4,
        maxBlocks: 12,
        hint: 'Usa ASIGNAR para marcar celdas. Marca la celda 4 como VERDE, luego activa solo cuando celda == VERDE.',
        map: {
            grid: [
                [3, 0, 0, 0, 2, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
            ],
            start: { x: 0, y: 0, dir: 'right' },
            objective: [{ x: 4, y: 0 }],
        },
        marks: [{ x: 2, y: 0, color: 'VERDE' }],
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return flat.some(b => b.type === 'ASIGNAR') && flat.some(b => b.type === 'SI')
        },
    },

    '2-12': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR', 'SI', 'ASIGNAR'],
        limitBlocks: 8,
        maxBlocks: 14,
        hint: 'Marca celdas 1, 2 como VERDE. Activa nodos en 4, 5 solo cuando celda == VERDE.',
        map: {
            grid: [
                [3, 0, 4, 0, 0, 2],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 4],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 2],
            ],
            start: { x: 0, y: 0, dir: 'right' },
            objective: [{ x: 5, y: 0 }, { x: 5, y: 5 }],
        },
        marks: [{ x: 2, y: 0, color: 'VERDE' }, { x: 5, y: 2, color: 'ROJO' }],
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return flat.some(b => b.type === 'ASIGNAR') && flat.some(b => b.type === 'SI') && flat.some(b => b.type === 'REPETIR')
        },
    },

    '2-13': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR', 'SI', 'ASIGNAR'],
        limitBlocks: 6,
        maxBlocks: 14,
        hint: 'Marca celdas 1, 3 como VERDE. Activa nodos en 0, 2, 4 solo cuando celda == VERDE.',
        map: {
            grid: [
                [2, 2, 2, 2, 2, 2],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
            ],
            start: { x: 5, y: 0, dir: 'left' },
            objective: [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 4, y: 0 }],
        },
        marks: [{ x: 1, y: 0, color: 'VERDE' }, { x: 3, y: 0, color: 'VERDE' }],
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return flat.some(b => b.type === 'ASIGNAR') && flat.some(b => b.type === 'SI') && flat.some(b => b.type === 'REPETIR')
        },
    },

    '2-14': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR', 'SI', 'ASIGNAR'],
        limitBlocks: 6,
        maxBlocks: 16,
        hint: 'Marca celdas 2, 3 como VERDE. Activa nodos en 4, 5 solo cuando celda == VERDE.',
        map: {
            grid: [
                [3, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
            ],
            start: { x: 0, y: 0, dir: 'right' },
            objective: [{ x: 4, y: 0 }, { x: 5, y: 0 }],
        },
        marks: [{ x: 2, y: 0, color: 'VERDE' }, { x: 3, y: 0, color: 'VERDE' }],
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return flat.some(b => b.type === 'ASIGNAR') && flat.some(b => b.type === 'SI') && flat.filter(b => b.type === 'ACTIVAR').length >= 2
        },
    },

    '2-15': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR', 'SI', 'ASIGNAR'],
        limitBlocks: 6,
        maxBlocks: 18,
        hint: 'Marca celdas 0, 2 como VERDE. Activa nodos en 4, 5 solo cuando celda == VERDE. Usa SI dentro de REPETIR.',
        map: {
            grid: [
                [2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2],
            ],
            start: { x: 5, y: 0, dir: 'left' },
            objective: [{ x: 4, y: 0 }, { x: 5, y: 0 }],
        },
        marks: [{ x: 0, y: 0, color: 'VERDE' }, { x: 2, y: 0, color: 'VERDE' }],
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            const repetir = blocks.find(b => b.type === 'REPETIR')
            return flat.some(b => b.type === 'ASIGNAR') && !!repetir?.children?.some(c => c.type === 'SI')
        },
    },

    // ─────────────────────────────────────────────
    // BLOQUE 4: + SI_NO — grid 7×7
    // ─────────────────────────────────────────────

    '2-16': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR', 'SI', 'SI_NO', 'ASIGNAR'],
        limitBlocks: 8,
        maxBlocks: 12,
        hint: 'Dos columnas de nodos. Usa SI_NO para activar solo cuando x < 3 (columna izquierda).',
        map: {
            grid: [
                [3, 2, 2, 2, 2, 2, 2],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
            ],
            start: { x: 0, y: 0, dir: 'right' },
            objective: [{ x: 2, y: 0 }, { x: 4, y: 0 }, { x: 6, y: 0 }],

        },
        marks: [{ x: 1, y: 0, color: 'VERDE' }, { x: 3, y: 0, color: 'AZUL' }, { x: 5, y: 0, color: 'AZUL' }],
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return flat.some(b => b.type === 'SI_NO')
        },
    },

    '2-17': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR', 'SI', 'SI_NO', 'ASIGNAR'],
        limitBlocks: 12,
        maxBlocks: 14,
        hint: 'Tres filas de nodos. Usa SI_NO con REPETIR para activar solo la fila del medio (y == 1).',
        map: {
            grid: [
                [3, 0, 0, 0, 0, 0, 0],
                [0, 2, 2, 2, 0, 0, 0],
                [0, 0, 0, 0, 2, 0, 0],
                [0, 0, 0, 0, 0, 2, 0],
                [0, 0, 0, 0, 0, 0, 2],
                [0, 0, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 0, 0],
            ],
            start: { x: 0, y: 0, dir: 'right' },
            objective: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 2 }, { x: 5, y: 3 }, { x: 6, y: 4 }],
        },
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return flat.some(b => b.type === 'SI_NO') && flat.some(b => b.type === 'REPETIR')
        },
    },

    '2-18': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR', 'SI', 'SI_NO', 'ASIGNAR'],
        limitBlocks: 9,
        maxBlocks: 16,
        hint: 'Cuadrícula 3x3 de nodos. Usa SI_NO para activar solo cuando x >= 3 y y >= 3 (esquina inferior derecha).',
        map: {
            grid: [
                [3, 0, 0, 2, 0, 0, 2],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [2, 0, 0, 0, 0, 0, 2],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [2, 0, 0, 2, 0, 0, 2],
            ],
            start: { x: 0, y: 0, dir: 'right' },
            objective: [
                { x: 6, y: 0 },
                { x: 6, y: 6 },
                { x: 0, y: 6 },
            ],
        },
        marks: [
            { x: 3, y: 0, color: 'ROJO' },
            { x: 6, y: 3, color: 'ROJO' },
            { x: 3, y: 6, color: 'ROJO' },
            { x: 0, y: 3, color: 'AZUL' },
        ],
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return (
                flat.some(b => b.type === 'SI_NO') &&
                flat.some(b => b.type === 'REPETIR') &&
                flat.filter(b => b.type === 'ACTIVAR').length >= 4
            )
        },
    },

    // ─────────────────────────────────────────────
    // BLOQUE 5: + FUNCION + LLAMAR — grid 8×8
    // ─────────────────────────────────────────────

    '2-19': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR', 'ASIGNAR', 'LLAMAR'],
        limitBlocks: 15,
        maxBlocks: 25,
        hint: 'Las paredes crean el mismo pasillo tres veces. Define la ruta como función y llámala.',
        map: {
            grid: [
                [3, 0, 1, 2, 0, 1, 2, 0],
                [0, 0, 1, 0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [2, 0, 0, 0, 0, 0, 0, 2],
            ],
            start: { x: 0, y: 0, dir: 'right' },
            objective: [
                { x: 3, y: 0 },
                { x: 6, y: 0 },
            ],
        },
        marks: [
            { x: 7, y: 7, color: 'AZUL' },
            { x: 0, y: 7, color: 'AZUL' },
        ],
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return flat.some(b => b.type === 'FUNCION') && flat.some(b => b.type === 'LLAMAR')
        },
    },

    '2-20': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR', 'FUNCION', 'LLAMAR'],
        maxBlocks: 13,
        hint: 'Las paredes separan cuatro zonas idénticas. Una función para todas.',
        map: {
            grid: [
                [3, 0, 2, 1, 0, 2, 1, 0],
                [0, 0, 0, 1, 0, 0, 1, 0],
                [1, 1, 1, 1, 1, 1, 1, 0],
                [0, 0, 0, 1, 0, 0, 1, 0],
                [0, 0, 2, 1, 0, 2, 1, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
            ],
            start: { x: 0, y: 0, dir: 'right' },
            objective: [
                { x: 2, y: 0 }, { x: 5, y: 0 },
                { x: 2, y: 4 }, { x: 5, y: 4 },
            ],
        },
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return flat.some(b => b.type === 'FUNCION') &&
                flat.filter(b => b.type === 'LLAMAR').length >= 4
        },
    },

    '2-21': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR', 'SI', 'FUNCION', 'LLAMAR'],
        maxBlocks: 15,
        hint: 'Las paredes crean un laberinto con bifurcaciones. Usa funciones para los tramos repetidos y SI para las decisiones.',
        map: {
            grid: [
                [3, 0, 0, 1, 0, 0, 0, 0],
                [0, 1, 0, 1, 0, 1, 0, 0],
                [0, 1, 0, 0, 0, 1, 0, 0],
                [0, 1, 1, 1, 0, 1, 1, 0],
                [0, 0, 0, 0, 0, 0, 0, 2],
                [0, 1, 0, 1, 0, 1, 0, 0],
                [0, 1, 2, 1, 0, 1, 2, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
            ],
            start: { x: 0, y: 0, dir: 'down' },
            objective: [{ x: 7, y: 4 }, { x: 2, y: 6 }, { x: 6, y: 6 }],
        },
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return (
                flat.some(b => b.type === 'FUNCION') &&
                flat.some(b => b.type === 'LLAMAR') &&
                flat.some(b => b.type === 'SI')
            )
        },
    },

    '2-22': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR', 'SI', 'SI_NO', 'FUNCION', 'LLAMAR'],
        maxBlocks: 17,
        hint: 'Dos laberintos espejo separados por una pared central. Dos funciones, una decisión.',
        map: {
            grid: [
                [3, 0, 0, 1, 0, 0, 0, 0],
                [0, 1, 0, 1, 0, 1, 0, 0],
                [0, 1, 0, 1, 0, 1, 0, 0],
                [0, 0, 0, 1, 0, 0, 0, 0],
                [1, 1, 0, 1, 0, 1, 1, 0],
                [0, 0, 0, 1, 0, 0, 0, 0],
                [0, 2, 0, 1, 0, 2, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
            ],
            start: { x: 0, y: 0, dir: 'down' },
            objective: [{ x: 1, y: 6 }, { x: 5, y: 6 }],
        },
        validateFn: (blocks) => {
            const funciones = blocks.filter(b => b.type === 'FUNCION')
            const flat = flatBlocksLocal(blocks)
            return funciones.length >= 2 && flat.some(b => b.type === 'SI_NO')
        },
    },

    // ─────────────────────────────────────────────
    // BLOQUE 6: + ASIGNAR — grid 9×9
    // ─────────────────────────────────────────────

    '2-23': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR', 'SI', 'SI_NO', 'FUNCION', 'LLAMAR', 'ASIGNAR'],
        maxBlocks: 18,
        hint: 'Marca la celda 4 como VERDE. Activa nodo en 2 solo cuando celda == VERDE.',
        map: {
            grid: [
                [3, 2, 2, 2, 2, 2, 2, 2, 2],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
            ],
            start: { x: 0, y: 0, dir: 'right' },
            objective: [{ x: 2, y: 0 }],
        },
        marks: [{ x: 4, y: 0, color: 'VERDE' }],
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return flat.some(b => b.type === 'ASIGNAR') && flat.some(b => b.type === 'SI')
        },
    },

    '2-24': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR', 'SI', 'SI_NO', 'FUNCION', 'LLAMAR', 'ASIGNAR'],
        maxBlocks: 20,
        hint: 'Marca celdas 1, 2 como VERDE. Activa nodos en 6, 7 solo cuando celda == VERDE.',
        map: {
            grid: [
                [3, 2, 2, 2, 2, 2, 2, 2, 2],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
            ],
            start: { x: 0, y: 0, dir: 'right' },
            objective: [{ x: 6, y: 0 }, { x: 7, y: 0 }],
        },
        marks: [{ x: 1, y: 0, color: 'VERDE' }, { x: 2, y: 0, color: 'VERDE' }],
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return (
                flat.some(b => b.type === 'ASIGNAR') &&
                flat.some(b => b.type === 'SI') &&
                flat.some(b => b.type === 'REPETIR')
            )
        },
    },

    '2-25': {
        availableBlocks: ['MOVER', 'GIRAR', 'ACTIVAR', 'REPETIR', 'SI', 'SI_NO', 'FUNCION', 'LLAMAR', 'ASIGNAR'],
        maxBlocks: 25,
        hint: 'El sistema final. Marca celdas 2, 4, 6 como VERDE. Activa nodo en 8 solo cuando celda == VERDE.',
        map: {
            grid: [
                [3, 2, 2, 2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2, 2, 2, 2],
                [2, 2, 2, 2, 2, 2, 2, 2, 2],
            ],
            start: { x: 0, y: 0, dir: 'right' },
            objective: [{ x: 8, y: 0 }],
        },
        marks: [
            { x: 2, y: 0, color: 'VERDE' }, { x: 4, y: 0, color: 'VERDE' }, { x: 6, y: 0, color: 'VERDE' },
            { x: 0, y: 2, color: 'VERDE' }, { x: 2, y: 2, color: 'VERDE' }, { x: 4, y: 2, color: 'VERDE' }, { x: 6, y: 2, color: 'VERDE' }, { x: 8, y: 2, color: 'VERDE' },
        ],
        validateFn: (blocks) => {
            const flat = flatBlocksLocal(blocks)
            return (
                flat.some(b => b.type === 'FUNCION') &&
                flat.some(b => b.type === 'REPETIR') &&
                flat.some(b => b.type === 'SI_NO') &&
                flat.some(b => b.type === 'ASIGNAR')
            )
        },
    },
}

export const DEFAULT_LOGICASSEMBLY: LogicAssemblyLevelData = {
    availableBlocks: ['MOVER', 'GIRAR', 'REPETIR', 'ACTIVAR'],
    maxBlocks: 10,
    hint: 'Construye la secuencia correcta',
    validateFn: (blocks: LogicAssemblyBlock[]) => blocks.length > 0,
}


export const MODULES_REGISTERS: Record<LogicAssemblyBlockType, string> = {
    'MOVER': '0x01',
    'GIRAR': '0x02',
    'REPETIR': '0x03',
    'SI': '0x04',
    'SI_NO': '0x05',
    'FUNCION': '0x06',
    'LLAMAR': '0x07',
    'ACTIVAR': '0x08',
    'ASIGNAR': '0x09',
}