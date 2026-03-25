import { BlockDef, ScratchLevelData } from './types'
import { ScratchBlock } from '@/types/game'

// Redefinimos flatBlocks aquí para evitar dependencia circular con utils.ts
function flatBlocksLocal(blocks: ScratchBlock[]): ScratchBlock[] {
    const result: ScratchBlock[] = []
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
        color: '#0d1f00',
        border: '#2d7800',
        hasValue: true,
        valueType: 'number',
        valueDefault: 1,
    },
    {
        type: 'GIRAR',
        label: 'GIRAR',
        color: '#0d1f00',
        border: '#2d7800',
        hasValue: true,
        valueType: 'direction',
        valueDefault: 'derecha',
        valueOptions: ['izquierda', 'derecha'],
    },
    {
        type: 'REPETIR',
        label: 'REPETIR',
        color: '#26215C',
        border: '#534AB7',
        hasValue: true,
        valueType: 'number',
        valueDefault: 2,
        hasChildren: true,
    },
    {
        type: 'SI',
        label: 'SI',
        color: '#042C53',
        border: '#185FA5',
        hasValue: true,
        valueType: 'text',
        valueDefault: 'panel == VERDE',
        hasChildren: true,
    },
    {
        type: 'FUNCION',
        label: 'FUNCIÓN',
        color: '#412402',
        border: '#854F0B',
        hasValue: true,
        valueType: 'text',
        valueDefault: 'miFuncion',
        hasChildren: true,
    },
    {
        type: 'LLAMAR',
        label: 'LLAMAR',
        color: '#412402',
        border: '#EF9F27',
        hasValue: true,
        valueType: 'text',
        valueDefault: 'miFuncion',
    },
    {
        type: 'ACTIVAR',
        label: 'ACTIVAR',
        color: '#1a0d00',
        border: '#EF9F27',
    },
]

export const SCRATCH_DATA: Record<string, ScratchLevelData> = {
    '2-01': {
        availableBlocks: ['MOVER', 'GIRAR', 'REPETIR', 'ACTIVAR'],
        maxBlocks: 8,
        hint: 'Usa REPETIR para evitar repetir MOVER varias veces',
        validateFn: (blocks: ScratchBlock[]) => {
            const flat = flatBlocksLocal(blocks)
            const hasRepetir = flat.some((b: ScratchBlock) => b.type === 'REPETIR')
            const hasActivar = flat.some((b: ScratchBlock) => b.type === 'ACTIVAR')
            return hasRepetir && hasActivar
        },
    },
    '2-03': {
        availableBlocks: ['MOVER', 'GIRAR', 'FUNCION', 'LLAMAR', 'ACTIVAR'],
        maxBlocks: 12,
        hint: 'Define una FUNCIÓN con la secuencia y llámala 3 veces',
        validateFn: (blocks: ScratchBlock[]) => {
            const flat = flatBlocksLocal(blocks)
            const hasFuncion = flat.some((b: ScratchBlock) => b.type === 'FUNCION')
            const llamadas = flat.filter((b: ScratchBlock) => b.type === 'LLAMAR')
            return hasFuncion && llamadas.length >= 2
        },
    },
    '2-07': {
        availableBlocks: ['MOVER', 'GIRAR', 'REPETIR', 'SI', 'FUNCION', 'LLAMAR', 'ACTIVAR'],
        maxBlocks: 20,
        hint: 'Combina funciones, repeticiones y condiciones',
        validateFn: (blocks: ScratchBlock[]) => {
            const flat = flatBlocksLocal(blocks)
            const types = new Set(flat.map((b: ScratchBlock) => b.type))
            return types.has('FUNCION') && types.has('REPETIR') && types.has('ACTIVAR')
        },
    },
}

export const DEFAULT_SCRATCH: ScratchLevelData = {
    availableBlocks: ['MOVER', 'GIRAR', 'REPETIR', 'ACTIVAR'],
    maxBlocks: 10,
    hint: 'Construye la secuencia correcta',
    validateFn: (blocks: ScratchBlock[]) => blocks.length > 0,
}
