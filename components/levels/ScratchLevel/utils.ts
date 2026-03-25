import { ScratchBlock, ScratchBlockType } from '@/types/game'
import { BLOCK_DEFS } from './constants'

export function flatBlocks(blocks: ScratchBlock[]): ScratchBlock[] {
    const result: ScratchBlock[] = []
    if (!blocks) return result
    for (const b of blocks) {
        result.push(b)
        if (b.children) result.push(...flatBlocks(b.children))
    }
    return result
}

export function makeBlock(type: ScratchBlockType): ScratchBlock {
    const def = BLOCK_DEFS.find(d => d.type === type)!
    return {
        id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type,
        value: def.valueDefault,
        children: def.hasChildren ? [] : undefined,
    }
}

// Tree modification helpers
export function updateBlockValueInTree(id: string, value: string | number, blocks: ScratchBlock[]): ScratchBlock[] {
    return blocks.map(b => {
        if (b.id === id) return { ...b, value }
        if (b.children) return { ...b, children: updateBlockValueInTree(id, value, b.children) }
        return b
    })
}

export function removeBlockFromTree(id: string, blocks: ScratchBlock[]): ScratchBlock[] {
    return blocks
        .filter(b => b.id !== id)
        .map(b => b.children ? { ...b, children: removeBlockFromTree(id, b.children) } : b)
}

export function addChildToTree(parentId: string, type: ScratchBlockType, blocks: ScratchBlock[]): ScratchBlock[] {
    return blocks.map(b => {
        if (b.id === parentId && b.children !== undefined) {
            return { ...b, children: [...b.children, makeBlock(type)] }
        }
        if (b.children) return { ...b, children: addChildToTree(parentId, type, b.children) }
        return b
    })
}
