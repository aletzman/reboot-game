import { BlockDef, LogicAssemblyLevelData } from './types'
import { LogicAssemblyBlock } from '@/types/game'

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
        label: 'SI / SI NO',
        color: 'var(--block-si-dark)',
        border: 'var(--block-si)',
        hasValue: true,
        valueType: 'text',
        valueDefault: 'id == 0',
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
    '2-01': {
        availableBlocks: ['MOVER', 'GIRAR', 'REPETIR', 'ACTIVAR', 'ASIGNAR'],
        maxBlocks: 8,
        hint: 'Usa REPETIR para evitar repetir MOVER varias veces',
        map: {
            grid: [
                [0, 0, 0, 0, 0],
                [0, 2, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 3, 0, 0, 0],
                [0, 0, 0, 0, 0]
            ],
            start: { x: 1, y: 3, dir: 'up' },
            objective: [{ x: 1, y: 1 }]
        },
        validateFn: (blocks: LogicAssemblyBlock[]) => {
            const flat = flatBlocksLocal(blocks)
            const hasRepetir = flat.some((b: LogicAssemblyBlock) => b.type === 'REPETIR')
            const hasActivar = flat.some((b: LogicAssemblyBlock) => b.type === 'ACTIVAR')
            return hasRepetir && hasActivar
        },
    },
    '2-03': {
        availableBlocks: ['MOVER', 'GIRAR', 'FUNCION', 'LLAMAR', 'ACTIVAR'],
        maxBlocks: 12,
        hint: 'Define una FUNCIÓN con la secuencia y llámala 3 veces para los tres nodos',
        map: {
            grid: [
                [0, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 0, 0, 2, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 3, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 0, 0, 2, 0],
                [0, 0, 0, 0, 0, 0, 0]
            ],
            start: { x: 3, y: 3, dir: 'up' },
            objective: [{ x: 1, y: 1 }, { x: 5, y: 1 }, { x: 1, y: 5 }, { x: 5, y: 5 }]
        },
        validateFn: (blocks: LogicAssemblyBlock[]) => {
            const flat = flatBlocksLocal(blocks)
            const hasFuncion = flat.some((b: LogicAssemblyBlock) => b.type === 'FUNCION')
            const llamadas = flat.filter((b: LogicAssemblyBlock) => b.type === 'LLAMAR')
            return hasFuncion && llamadas.length >= 3
        },
    },
    '2-07': {
        availableBlocks: ['MOVER', 'GIRAR', 'REPETIR', 'SI', 'FUNCION', 'LLAMAR', 'ACTIVAR', 'ASIGNAR'],
        maxBlocks: 20,
        hint: 'Combina funciones, repeticiones y condiciones para estabilizar el núcleo',
        map: {
            grid: [
                [1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 2, 0, 0, 0, 0, 0, 2, 1],
                [1, 0, 1, 1, 0, 1, 1, 0, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 1],
                [1, 0, 0, 0, 3, 0, 0, 0, 1],
                [1, 0, 1, 0, 0, 0, 1, 0, 1],
                [1, 0, 1, 1, 0, 1, 1, 0, 1],
                [1, 2, 0, 0, 0, 0, 0, 2, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1]
            ],
            start: { x: 4, y: 4, dir: 'up' },
            objective: [{ x: 1, y: 1 }, { x: 7, y: 1 }, { x: 1, y: 7 }, { x: 7, y: 7 }]
        },
        validateFn: (blocks: LogicAssemblyBlock[]) => {
            const flat = flatBlocksLocal(blocks)
            const types = new Set(flat.map((b: LogicAssemblyBlock) => b.type))
            return types.has('FUNCION') && types.has('REPETIR') && types.has('ACTIVAR')
        },
    },
    '2-R': {
        availableBlocks: ['MOVER', 'GIRAR', 'REPETIR', 'SI', 'FUNCION', 'LLAMAR', 'ACTIVAR', 'ASIGNAR'],
        maxBlocks: 15,
        hint: 'Demuestra tu dominio total del pseudocódigo',
        map: {
            grid: [
                [0, 0, 0, 0, 0],
                [0, 2, 0, 2, 0],
                [0, 0, 0, 0, 0],
                [0, 2, 0, 2, 0],
                [0, 0, 3, 0, 0]
            ],
            start: { x: 2, y: 4, dir: 'up' },
            objective: [{ x: 1, y: 1 }, { x: 3, y: 1 }, { x: 1, y: 3 }, { x: 3, y: 3 }]
        },
        validateFn: (blocks) => blocks.length > 0
    },
}

export const DEFAULT_LOGICASSEMBLY: LogicAssemblyLevelData = {
    availableBlocks: ['MOVER', 'GIRAR', 'REPETIR', 'ACTIVAR'],
    maxBlocks: 10,
    hint: 'Construye la secuencia correcta',
    validateFn: (blocks: LogicAssemblyBlock[]) => blocks.length > 0,
}
