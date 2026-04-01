import { LogicAssemblyBlock, LogicAssemblyBlockType } from '@/types/game'
import { BLOCK_DEFS } from './constants'

export function flatBlocks(blocks: LogicAssemblyBlock[]): LogicAssemblyBlock[] {
    const result: LogicAssemblyBlock[] = []
    if (!blocks) return result
    for (const b of blocks) {
        result.push(b)
        if (b.children) result.push(...flatBlocks(b.children))
    }
    return result
}

export function makeBlock(type: LogicAssemblyBlockType): LogicAssemblyBlock {
    const def = BLOCK_DEFS.find(d => d.type === type)!
    return {
        id: `${type}-${Math.random().toString(36).substring(2, 9)}`,
        type,
        value: def.valueDefault,
        children: def.hasChildren ? [] : undefined,
    }
}

// Tree modification helpers
export function updateBlockValueInTree(id: string, value: string | number, blocks: LogicAssemblyBlock[]): LogicAssemblyBlock[] {
    return blocks.map(b => {
        if (b.id === id) return { ...b, value }
        if (b.children) return { ...b, children: updateBlockValueInTree(id, value, b.children) }
        return b
    })
}

export function removeBlockFromTree(id: string, blocks: LogicAssemblyBlock[]): LogicAssemblyBlock[] {
    return blocks
        .filter(b => b.id !== id)
        .map(b => b.children ? { ...b, children: removeBlockFromTree(id, b.children) } : b)
}

export function addChildToTree(parentId: string, type: LogicAssemblyBlockType, blocks: LogicAssemblyBlock[]): LogicAssemblyBlock[] {
    return blocks.map(b => {
        if (b.id === parentId && b.children !== undefined) {
            return { ...b, children: [...b.children, makeBlock(type)] }
        }
        if (b.children) return { ...b, children: addChildToTree(parentId, type, b.children) }
        return b
    })
}

export function findAndReorder(
    items: LogicAssemblyBlock[], 
    sourceId: string, 
    targetId: string | null, 
    isNew: boolean = false, 
    newBlockType?: LogicAssemblyBlockType
): LogicAssemblyBlock[] {
    let movedBlock: LogicAssemblyBlock | null = null;
    let listWithoutSource: LogicAssemblyBlock[] = items;

    // 1. Extraer el bloque origen si no es nuevo
    if (isNew && newBlockType) {
        movedBlock = makeBlock(newBlockType);
    } else {
        if (!sourceId) return items;
        
        let found = false;
        function extractRecursive(list: LogicAssemblyBlock[]): LogicAssemblyBlock[] {
            if (found) return list;
            const idx = list.findIndex(b => b.id === sourceId);
            if (idx !== -1) {
                movedBlock = list[idx];
                found = true;
                return list.filter((_, i) => i !== idx);
            }
            return list.map(b => (b.children && b.children.length > 0) 
                ? { ...b, children: extractRecursive(b.children) } 
                : b
            );
        }
        listWithoutSource = extractRecursive(items);
        if (!found || !movedBlock) return items;
    }

    // 2. Insertar en el bloque destino
    let inserted = false;

    // Caso A: El destino es un contenedor específico de hijos
    if (targetId && targetId.startsWith('children-')) {
        const parentId = targetId.replace('children-', '');
        function nestRecursive(list: LogicAssemblyBlock[]): LogicAssemblyBlock[] {
            if (inserted) return list;
            return list.map(b => {
                if (b.id === parentId) {
                    inserted = true;
                    return { ...b, children: [...(b.children || []), movedBlock!] };
                }
                if (b.children && b.children.length > 0) {
                    return { ...b, children: nestRecursive(b.children) };
                }
                return b;
            });
        }
        const result = nestRecursive(listWithoutSource);
        if (inserted) return result;
    }

    // Caso B: El destino es otro bloque (poner ANTES)
    if (targetId && targetId !== 'root-workspace') {
        function insertAtRecursive(list: LogicAssemblyBlock[]): LogicAssemblyBlock[] {
            if (inserted) return list;
            const idx = list.findIndex(b => b.id === targetId);
            if (idx !== -1) {
                inserted = true;
                const next = [...list];
                next.splice(idx, 0, movedBlock!);
                return next;
            }
            return list.map(b => (b.children && b.children.length > 0)
                ? { ...b, children: insertAtRecursive(b.children) }
                : b
            );
        }
        const finalResult = insertAtRecursive(listWithoutSource);
        if (inserted) return finalResult;
    }

    // Caso C: No hay destino o targetId era root-workspace -> al final del nivel raíz
    return [...listWithoutSource, movedBlock!];
}

export function moveBlockInTree(id: string, direction: 'up' | 'down', blocks: LogicAssemblyBlock[]): LogicAssemblyBlock[] {
    const idx = blocks.findIndex(b => b.id === id)
    if (idx !== -1) {
        const nextIdx = direction === 'up' ? idx - 1 : idx + 1
        if (nextIdx >= 0 && nextIdx < blocks.length) {
            const updated = [...blocks]
            const [moved] = updated.splice(idx, 1)
            updated.splice(nextIdx, 0, moved)
            return updated
        }
        return blocks // Límite de lista alcanzado
    }

    // No está en este nivel, buscar recursivamente
    return blocks.map(b => {
        if (b.children && b.children.length > 0) {
            const next = moveBlockInTree(id, direction, b.children)
            if (next !== b.children) return { ...b, children: next }
        }
        return b
    })
}
