import { ForwardRefExoticComponent, RefAttributes } from 'react'
import { CornerUpLeft, CornerUpRight, MoveRightIcon, LucideProps, ChevronsUp, FunctionSquare, Repeat, Sun } from 'lucide-react'
import { CommandType, NodeRoutineLevelData } from '@/types/game'

export const PALETTE_COMMANDS: { type: CommandType; label: string; icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>; cssColor: string }[] = [
    { type: 'move', label: 'avanzar', icon: MoveRightIcon, cssColor: 'var(--green-light)' },
    { type: 'turn-left', label: 'girar', icon: CornerUpLeft, cssColor: 'var(--green-light)' },
    { type: 'turn-right', label: 'girar', icon: CornerUpRight, cssColor: 'var(--green-light)' },
    { type: 'jump', label: 'saltar', icon: ChevronsUp, cssColor: 'var(--green-muted)' },
    { type: 'activate', label: 'activar', icon: Sun, cssColor: 'var(--amber)' },
    { type: 'repeat', label: 'repetir', icon: Repeat, cssColor: 'var(--purple)' },
    { type: 'call-fn', label: 'F1', icon: FunctionSquare, cssColor: 'var(--cyan)' },
]

export const MAX_COMMANDS = 20
export const EXEC_SPEED = 420

export const NODEROUTINE_MAPS: Record<string, NodeRoutineLevelData> = {
    '1-01': {
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'floor', x: 2, y: 0 }, { type: 'target', x: 3, y: 0 }],
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 3, y: 0 }],
        maxCommands: 4,
        allowedCommands: ['move', 'activate'],
    },
    '1-02': {
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'floor', x: 2, y: 0 }],
            [{ type: 'empty', x: 0, y: 1 }, { type: 'empty', x: 1, y: 1 }, { type: 'floor', x: 2, y: 1 }],
            [{ type: 'empty', x: 0, y: 2 }, { type: 'empty', x: 1, y: 2 }, { type: 'target', x: 2, y: 2 }],
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 2, y: 2 }],
        maxCommands: 6,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'activate'],
    },
    '1-03': {
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0, height: 1 }, { type: 'floor', x: 2, y: 0, height: 1}, { type: 'target', x: 3, y: 0 }],
            [{ type: 'floor', x: 0, y: 1 }, { type: 'floor', x: 1, y: 1, height: 1 }, { type: 'floor', x: 2, y: 1, height: 1 }, { type: 'floor', x: 0, y: 1 }],

        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 3, y: 0 } ],
        maxCommands: 6,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'jump', 'activate'],
    },
    '1-04': {
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'floor', x: 2, y: 0 }, { type: 'floor', x: 3, y: 0 }, { type: 'floor', x: 4, y: 0 }],
            [{ type: 'wall', x: 0, y: 1 }, { type: 'floor', x: 1, y: 1 }, { type: 'floor', x: 2, y: 1 }, { type: 'floor', x: 3, y: 1 }, { type: 'wall', x: 4, y: 1 }],
            [{ type: 'wall', x: 0, y: 2 }, { type: 'floor', x: 1, y: 2 }, { type: 'floor', x: 2, y: 2 }, { type: 'floor', x: 3, y: 2 }, { type: 'wall', x: 4, y: 2 }],
            [{ type: 'wall', x: 0, y: 3 }, { type: 'floor', x: 1, y: 3 }, { type: 'floor', x: 2, y: 3 }, { type: 'floor', x: 3, y: 3 }, { type: 'wall', x: 4, y: 3 }],
            [{ type: 'wall', x: 0, y: 4 }, { type: 'floor', x: 1, y: 4 }, { type: 'floor', x: 2, y: 4 }, { type: 'target', x: 3, y: 4 }, { type: 'wall', x: 4, y: 4 }],
        ],
        robotStart: { x: 1, y: 0, direction: 'south' },
        targets: [{ x: 3, y: 4 }],
        maxCommands: 6,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'jump', 'activate', 'repeat'],
    },
    '1-06': {
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'wall', x: 2, y: 0 }, { type: 'floor', x: 3, y: 0 }, { type: 'floor', x: 4, y: 0 }],
            [{ type: 'floor', x: 0, y: 1 }, { type: 'generator', x: 1, y: 1 }, { type: 'wall', x: 2, y: 1 }, { type: 'generator', x: 3, y: 1 }, { type: 'floor', x: 4, y: 1 }],
            [{ type: 'floor', x: 0, y: 2 }, { type: 'floor', x: 1, y: 2 }, { type: 'floor', x: 2, y: 2 }, { type: 'floor', x: 3, y: 2 }, { type: 'floor', x: 4, y: 2 }],
            [{ type: 'floor', x: 0, y: 3 }, { type: 'floor', x: 1, y: 3 }, { type: 'generator', x: 2, y: 3 }, { type: 'floor', x: 3, y: 3 }, { type: 'floor', x: 4, y: 3 }],
            [{ type: 'target', x: 0, y: 4 }, { type: 'floor', x: 1, y: 4 }, { type: 'floor', x: 2, y: 4 }, { type: 'floor', x: 3, y: 4 }, { type: 'wall', x: 4, y: 4 }],
        ],
        robotStart: { x: 4, y: 0, direction: 'west' },
        targets: [{ x: 0, y: 4 }],
        maxCommands: 12,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'jump', 'activate', 'repeat'],
    },
    '1-07': {
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'floor', x: 2, y: 0 }, { type: 'wall', x: 3, y: 0 }, { type: 'floor', x: 4, y: 0 }, { type: 'floor', x: 5, y: 0 }],
            [{ type: 'floor', x: 0, y: 1 }, { type: 'broken', x: 1, y: 1 }, { type: 'floor', x: 2, y: 1 }, { type: 'wall', x: 3, y: 1 }, { type: 'floor', x: 4, y: 1 }, { type: 'active', x: 5, y: 1 }],
            [{ type: 'floor', x: 0, y: 2 }, { type: 'floor', x: 1, y: 2 }, { type: 'floor', x: 2, y: 2 }, { type: 'floor', x: 3, y: 2 }, { type: 'floor', x: 4, y: 2 }, { type: 'floor', x: 5, y: 2 }],
            [{ type: 'active', x: 0, y: 3 }, { type: 'floor', x: 1, y: 3 }, { type: 'broken', x: 2, y: 3 }, { type: 'floor', x: 3, y: 3 }, { type: 'floor', x: 4, y: 3 }, { type: 'floor', x: 5, y: 3 }],
            [{ type: 'floor', x: 0, y: 4 }, { type: 'floor', x: 1, y: 4 }, { type: 'floor', x: 2, y: 4 }, { type: 'floor', x: 3, y: 4 }, { type: 'broken', x: 4, y: 4 }, { type: 'floor', x: 5, y: 4 }],
            [{ type: 'floor', x: 0, y: 5 }, { type: 'floor', x: 1, y: 5 }, { type: 'floor', x: 2, y: 5 }, { type: 'floor', x: 3, y: 5 }, { type: 'floor', x: 4, y: 5 }, { type: 'target', x: 5, y: 5 }],
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 5, y: 5 }],
        maxCommands: 16,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'jump', 'activate', 'repeat'],
    },
    '1-08': {
        map: [
            [{ type: 'floor', x: 0, y: 0, height: 0 }, { type: 'floor', x: 1, y: 0, height: 1 }, { type: 'floor', x: 2, y: 0, height: 2 }, { type: 'floor', x: 3, y: 0, height: 3 }, { type: 'floor', x: 4, y: 0, height: 3 }],
            [{ type: 'wall', x: 0, y: 1 }, { type: 'wall', x: 1, y: 1 }, { type: 'wall', x: 2, y: 1 }, { type: 'wall', x: 3, y: 1 }, { type: 'floor', x: 4, y: 1, height: 3 }],
            [{ type: 'empty', x: 0, y: 2 }, { type: 'empty', x: 1, y: 2 }, { type: 'empty', x: 2, y: 2 }, { type: 'wall', x: 3, y: 2 }, { type: 'floor', x: 4, y: 2, height: 2 }],
            [{ type: 'empty', x: 0, y: 3 }, { type: 'empty', x: 1, y: 3 }, { type: 'empty', x: 2, y: 3 }, { type: 'empty', x: 3, y: 3 }, { type: 'floor', x: 4, y: 3, height: 1 }],
            [{ type: 'target', x: 0, y: 4, height: 0 }, { type: 'floor', x: 1, y: 4, height: 0 }, { type: 'floor', x: 2, y: 4, height: 0 }, { type: 'floor', x: 3, y: 4, height: 0 }, { type: 'floor', x: 4, y: 4, height: 0 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 0, y: 4 }],
        maxCommands: 14,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'jump', 'activate', 'repeat'],
    },
    '1-09': {
        map: [
            [{ type: 'floor', x: 0, y: 0, height: 4 }, { type: 'floor', x: 1, y: 0, height: 3 }, { type: 'floor', x: 2, y: 0, height: 1 }],
            [{ type: 'wall', x: 0, y: 1 }, { type: 'floor', x: 1, y: 1, height: 2 }, { type: 'floor', x: 2, y: 1, height: 1 }],
            [{ type: 'wall', x: 0, y: 2 }, { type: 'wall', x: 1, y: 2 }, { type: 'target', x: 2, y: 2, height: 0 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 2, y: 2 }],
        maxCommands: 10,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'jump', 'activate', 'repeat'],
    },
    '2-08': {
        map: [
            [{ type: 'empty', x: 0, y: 0 }, { type: 'empty', x: 1, y: 0 }, { type: 'empty', x: 2, y: 0 }, { type: 'empty', x: 3, y: 0 }, { type: 'empty', x: 4, y: 0 }],
            [{ type: 'empty', x: 0, y: 1 }, { type: 'empty', x: 1, y: 1 }, { type: 'empty', x: 2, y: 1 }, { type: 'empty', x: 3, y: 1 }, { type: 'empty', x: 4, y: 1 }],
            [{ type: 'target', x: 0, y: 2 }, { type: 'floor', x: 1, y: 2 }, { type: 'target', x: 2, y: 2 }, { type: 'empty', x: 3, y: 2 }, { type: 'empty', x: 4, y: 2 }],
            [{ type: 'empty', x: 0, y: 3 }, { type: 'empty', x: 1, y: 3 }, { type: 'floor', x: 2, y: 3 }, { type: 'empty', x: 3, y: 3 }, { type: 'empty', x: 4, y: 3 }],
            [{ type: 'floor', x: 0, y: 4 }, { type: 'floor', x: 1, y: 4 }, { type: 'target', x: 2, y: 4 }, { type: 'empty', x: 3, y: 4 }, { type: 'empty', x: 4, y: 4 }]
        ],
        robotStart: { x: 0, y: 4, direction: 'east' },
        targets: [{ x: 2, y: 4 }, { x: 2, y: 2 }, { x: 0, y: 2 }],
        maxCommands: 4,
        allowF1: true,
        maxF1Commands: 4,
        uiLimitMain: 4,
        uiLimitF1: 4,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'activate', 'call-fn'],
    },
    '2-09': {
        map: [
            [{ type: 'floor', x: 0, y: 0, height: 4 }, { type: 'floor', x: 1, y: 0, height: 3 }, { type: 'empty', x: 2, y: 0, height: 0 }],
            [{ type: 'empty', x: 0, y: 1, height: 0 }, { type: 'empty', x: 1, y: 1, height: 0 }, { type: 'floor', x: 2, y: 1, height: 2 }],
            [{ type: 'target', x: 0, y: 2, height: 0 }, { type: 'floor', x: 1, y: 2, height: 0 }, { type: 'floor', x: 2, y: 2, height: 1 }]
        ],
        robotStart: { x: 0, y: 2, direction: 'east' },
        targets: [{ x: 0, y: 0 }],
        maxCommands: 6,
        allowF1: true,
        maxF1Commands: 4,
        uiLimitMain: 6,
        uiLimitF1: 4,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'jump', 'activate', 'call-fn', 'repeat'],
    },
    '1-R': {
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'wall', x: 2, y: 0 }, { type: 'floor', x: 3, y: 0, height: 1 }],
            [{ type: 'wall', x: 0, y: 1 }, { type: 'floor', x: 1, y: 1 }, { type: 'wall', x: 2, y: 1 }, { type: 'floor', x: 3, y: 1, height: 2 }],
            [{ type: 'floor', x: 0, y: 2, height: 1 }, { type: 'floor', x: 1, y: 2 }, { type: 'floor', x: 2, y: 2 }, { type: 'floor', x: 3, y: 2, height: 1 }],
            [{ type: 'target', x: 0, y: 3 }, { type: 'floor', x: 1, y: 3 }, { type: 'floor', x: 2, y: 3 }, { type: 'floor', x: 3, y: 3 }],
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 0, y: 3 }],
        maxCommands: 12,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'jump', 'activate', 'repeat'],
    },
}

export const DEFAULT_MAP: NodeRoutineLevelData = {
    map: [
        [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'floor', x: 2, y: 0 }],
        [{ type: 'floor', x: 0, y: 1 }, { type: 'floor', x: 1, y: 1 }, { type: 'floor', x: 2, y: 1 }],
        [{ type: 'floor', x: 0, y: 2 }, { type: 'floor', x: 1, y: 2 }, { type: 'target', x: 2, y: 2 }],
    ],
    robotStart: { x: 0, y: 0, direction: 'east' },
    targets: [{ x: 2, y: 2 }],
    maxCommands: 5,
}

export const ISO = {
    TILE_W: 80,    // ancho del tile isométrico (diamante)
    TILE_H: 46,    // alto del tile isométrico
    DEPTH: 18,     // profundidad/grosor del tile 3D
}

// Colores de tiles (top face, side-left, side-right)
export const TILE_COLORS: Record<string, { top: string; left: string; right: string; glow?: string }> = {
    floor: { top: '#141B24', left: '#0E1319', right: '#0B0F14' },
    wall: { top: '#080A0D', left: '#050607', right: '#030404' },
    active: { top: '#0d2600', left: '#0a1e00', right: '#081800', glow: '#55e20040' },
    target: { top: '#0a2e2e', left: '#072222', right: '#051a1a', glow: '#12b0bb30' },
    broken: { top: '#150d1e', left: '#100a16', right: '#0c0812', glow: '#7F77DD20' },
    generator: { top: '#1f1500', left: '#170f00', right: '#120b00', glow: '#EF9F2730' },
    empty: { top: '#010101', left: '#010101', right: '#010101' },
}
