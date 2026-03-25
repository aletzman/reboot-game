import { Direction, Command, LightbotLevelData } from '@/types/game'
import { ExtendedRobotState, FlatCommand } from './types'
import { ISO } from './constants'

export function toIso(col: number, row: number, offsetX: number, offsetY: number): { x: number; y: number } {
    const x = (col - row) * (ISO.TILE_W / 2) + offsetX
    const y = (col + row) * (ISO.TILE_H / 2) + offsetY
    return { x, y }
}

export function turnLeft(dir: Direction): Direction {
    return ({ north: 'west', west: 'south', south: 'east', east: 'north' } as const)[dir]
}

export function turnRight(dir: Direction): Direction {
    return ({ north: 'east', east: 'south', south: 'west', west: 'north' } as const)[dir]
}

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

export function flattenCommands(commands: Command[], f1Commands: Command[], activePanel: 'main' | 'f1' = 'main', depth = 0): FlatCommand[] {
    if (depth > 20) return []
    const flat: FlatCommand[] = []

    for (let idx = 0; idx < commands.length; idx++) {
        const cmd = commands[idx]
        if (cmd.type === 'repeat' && cmd.times) {
            flat.push({ cmd, originalIdx: idx, panel: activePanel })

            const previous = flat.filter(f => f.cmd.type !== 'repeat')
            for (let i = 0; i < cmd.times - 1; i++) {
                flat.push(...previous)
                flat.push({ cmd, originalIdx: idx, panel: activePanel })
            }
        } else if (cmd.type === 'call-fn') {
            flat.push({ cmd, originalIdx: idx, panel: activePanel })
            if (f1Commands.length > 0) {
                const subFlat = flattenCommands(f1Commands, f1Commands, 'f1', depth + 1)
                flat.push(...subFlat)
            }
        } else {
            flat.push({ cmd, originalIdx: idx, panel: activePanel })
        }
    }
    return flat
}

export function getNextPosition(robot: ExtendedRobotState, mapData: LightbotLevelData, moveType: 'move' | 'jump' = 'move'): { x: number; y: number; height: number } | null {
    const { x, y, direction, height = 0 } = robot
    const deltas: Record<Direction, { dx: number; dy: number }> = {
        north: { dx: 0, dy: -1 }, south: { dx: 0, dy: 1 },
        east: { dx: 1, dy: 0 }, west: { dx: -1, dy: 0 },
    }
    const { dx, dy } = deltas[direction]

    const nx = x + dx
    const ny = y + dy

    // Check destination
    const row = mapData.map[ny]
    if (!row) return null
    const destTile = row[nx]
    if (!destTile || destTile.type === 'wall' || destTile.type === 'empty' || destTile.type === 'broken') return null

    const destHeight = destTile.height || 0
    const currentHeight = height

    if (moveType === 'jump') {
        // Can jump exactly 1 level up, or any number of levels down
        if (destHeight === currentHeight || destHeight > currentHeight + 1) return null;
    } else {
        // Move can only be done on the same height
        if (destHeight !== currentHeight) return null;
    }

    return { x: nx, y: ny, height: destHeight }
}

export function calcStars(usedMain: number, usedF1: number, maxMain?: number, maxF1?: number): 1 | 2 | 3 {
    if (!maxMain) return 3
    const totalUsed = usedMain + usedF1
    const optimal = maxMain + (maxF1 || 0)

    if (totalUsed <= optimal) return 3
    if (totalUsed <= optimal + 2) return 2
    return 1
}
