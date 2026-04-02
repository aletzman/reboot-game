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


export function moveNodeInTree(
    items: LogicAssemblyBlock[],
    sourceId: string,
    targetId: string,
    targetIndex: number,
    isNew: boolean = false,
    newType?: LogicAssemblyBlockType,
    providedBlock?: LogicAssemblyBlock 
): LogicAssemblyBlock[] {
    let movedBlock: LogicAssemblyBlock | null = providedBlock || null;

    // 1. Extraer el bloque del árbol si ya existe
    const findAndRemoveNode = (list: LogicAssemblyBlock[], idToRemove: string): LogicAssemblyBlock[] => {
        const idx = list.findIndex(b => b.id === idToRemove);
        if (idx !== -1) {
            if (!movedBlock) movedBlock = list[idx];
            return list.filter((_, i) => i !== idx);
        }
        return list.map(b => b.children ? { ...b, children: findAndRemoveNode(b.children, idToRemove) } : b);
    };

    if (movedBlock) {
        // Si tenemos un bloque proveído (ej: de onDragOver estable), lo removemos por SU ID real
        items = findAndRemoveNode(items, movedBlock.id);
    } else {
        if (isNew && newType) {
            movedBlock = makeBlock(newType);
        } else {
            // Buscar por el sourceId de la operación
            items = findAndRemoveNode(items, sourceId);
        }
    }

    if (!movedBlock) return items;

    // 2. Determinar destino
    const isInside = targetId.startsWith('children-');
    const targetRefId = isInside 
        ? targetId.replace('children-', '') 
        : targetId.replace('__drop', '');

    // 3. Insertar recursivamente
    const insertRecursive = (list: LogicAssemblyBlock[]): LogicAssemblyBlock[] => {
        // Caso Raíz
        if (!targetRefId || targetRefId === 'root' || targetRefId === 'logic-workspace' || targetRefId === 'root-workspace') {
            const next = [...list];
            next.splice(targetIndex, 0, movedBlock!);
            return next;
        }

        // Caso Adentro de un bloque (contenedor de hijos)
        if (isInside) {
            return list.map(b => {
                if (b.id === targetRefId) {
                    const nextChildren = [...(b.children || [])];
                    nextChildren.splice(targetIndex, 0, movedBlock!);
                    return { ...b, children: nextChildren };
                }
                return b.children ? { ...b, children: insertRecursive(b.children) } : b;
            });
        }

        // Caso Sobre un bloque (hermano)
        const siblingIdx = list.findIndex(b => b.id === targetRefId);
        if (siblingIdx !== -1) {
            const next = [...list];
            // Si el target es un bloque, usamos el targetIndex que nos da dnd-kit
            next.splice(targetIndex, 0, movedBlock!);
            return next;
        }

        // Seguir buscando en la profundidad
        return list.map(b => b.children ? { ...b, children: insertRecursive(b.children) } : b);
    };

    return insertRecursive(items);
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
