import { ForwardRefExoticComponent, RefAttributes } from 'react'
import { CornerUpLeft, CornerUpRight, MoveRightIcon, LucideProps, ChevronsUp, FunctionSquare, Repeat, Sun, Package } from 'lucide-react'
import { CommandType, NodeRoutineLevelData } from '@/types/game'

export const PALETTE_COMMANDS: { type: CommandType; label: string; icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>; cssColor: string }[] = [
    { type: 'move', label: 'avanzar', icon: MoveRightIcon, cssColor: 'var(--green-light)' },
    { type: 'turn-left', label: 'girar', icon: CornerUpLeft, cssColor: 'var(--green-light)' },
    { type: 'turn-right', label: 'girar', icon: CornerUpRight, cssColor: 'var(--green-light)' },
    { type: 'jump', label: 'saltar', icon: ChevronsUp, cssColor: 'var(--green-muted)' },
    { type: 'activate', label: 'activar', icon: Sun, cssColor: 'var(--amber)' },
    { type: 'repeat', label: 'repetir', icon: Repeat, cssColor: 'var(--purple)' },
    { type: 'call-f1', label: 'Sub F1', icon: Package, cssColor: 'var(--cyan)' },
    { type: 'call-f2', label: 'Sub F2', icon: Package, cssColor: 'var(--block-activar)' },
]

export const MAX_COMMANDS = 20
export const EXEC_SPEED = 550

export const NODEROUTINE_MAPS: Record<string, NodeRoutineLevelData> = {
    // ==========================================
    // FASE 1: SECUENCIAS BÁSICAS Y ORIENTACIÓN
    // ==========================================
    '1-01': {
        map: [
            [
                { type: 'floor', x: 0, y: 0 },
                { type: 'floor', x: 1, y: 0 },
                { type: 'target', x: 2, y: 0 },
            ],
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 2, y: 0 }],
        maxCommands: 3,
        uiLimitMain: 4,
        allowedCommands: ['move', 'activate'],
    },
    '1-02': {
        map: [
            [{ type: 'floor', x: 0, y: 0 },
            { type: 'floor', x: 1, y: 0 },
            { type: 'floor', x: 2, y: 0 },
            { type: 'floor', x: 3, y: 0 },
            { type: 'target', x: 4, y: 0 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 4, y: 0 }],
        maxCommands: 5,
        allowF1: true,
        allowF2: true,
        uiLimitMain: 6,
        allowedCommands: ['move', 'activate', 'turn-left', 'turn-right', 'jump', 'repeat', 'call-f1', 'call-f2'],
    },
    '1-03': {
        map: [
            [
                { type: 'floor', x: 0, y: 0 },
                { type: 'floor', x: 1, y: 0 }],
            [
                { type: 'empty', x: 0, y: 1 },
                { type: 'target', x: 1, y: 1 }
            ]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 1, y: 1 }],
        maxCommands: 4,
        uiLimitMain: 6,
        allowedCommands: ['move', 'turn-right', 'activate'],
    },
    '1-04': {
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'empty', x: 2, y: 0 }],
            [{ type: 'empty', x: 0, y: 1 }, { type: 'floor', x: 1, y: 1 }, { type: 'floor', x: 2, y: 1 }],
            [{ type: 'empty', x: 0, y: 2 }, { type: 'empty', x: 1, y: 2 }, { type: 'target', x: 2, y: 2 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 2, y: 2 }],
        maxCommands: 7,
        uiLimitMain: 8,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'activate'],
    },
    '1-05': {
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'floor', x: 2, y: 0 }],
            [{ type: 'empty', x: 0, y: 1 }, { type: 'empty', x: 1, y: 1 }, { type: 'floor', x: 2, y: 1 }],
            [{ type: 'target', x: 0, y: 2 }, { type: 'floor', x: 1, y: 2 }, { type: 'floor', x: 2, y: 2 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 0, y: 2 }],
        maxCommands: 8,
        uiLimitMain: 10,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'activate'],
    },

    // ==========================================
    // FASE 2: LA TERCERA DIMENSIÓN (SALTOS)
    // ==========================================
    '1-06': {
        map: [
            [{ type: 'floor', x: 0, y: 0, height: 0 }, { type: 'floor', x: 1, y: 0, height: 1 }, { type: 'target', x: 2, y: 0, height: 1 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 2, y: 0 }],
        maxCommands: 3,
        uiLimitMain: 5,
        allowedCommands: ['move', 'jump', 'activate'],
    },
    '1-07': {
        map: [
            [{ type: 'floor', x: 0, y: 0, height: 1 }, { type: 'floor', x: 1, y: 0, height: 0 }, { type: 'target', x: 2, y: 0, height: 0 }]
        ],
        robotStart: { x: 0, y: 0, height: 1, direction: 'east' },
        targets: [{ x: 2, y: 0 }],
        maxCommands: 3,
        uiLimitMain: 5,
        allowedCommands: ['move', 'jump', 'activate'],
    },
    '1-08': {
        map: [
            [{ type: 'floor', x: 0, y: 0, height: 0 }, { type: 'floor', x: 1, y: 0, height: 1 }, { type: 'floor', x: 2, y: 0, height: 2 }, { type: 'floor', x: 3, y: 0, height: 1 }, { type: 'target', x: 4, y: 0, height: 0 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 4, y: 0 }],
        maxCommands: 5,
        uiLimitMain: 8,
        allowedCommands: ['move', 'jump', 'activate'],
    },
    '1-09': {
        map: [
            [
                { type: 'floor', x: 0, y: 0, height: 2 },
                { type: 'floor', x: 1, y: 0, height: 3 },
                { type: 'target', x: 2, y: 0, height: 4 },
            ]
            ,
            [
                { type: 'floor', x: 0, y: 1, height: 2 },
                { type: 'floor', x: 1, y: 1, height: 0 },
                { type: 'floor', x: 2, y: 1, height: 0 },
            ],
            [
                { type: 'floor', x: 0, y: 2, height: 2 },
                { type: 'floor', x: 1, y: 2, height: 1 },
                { type: 'floor', x: 2, y: 2, height: 0 }
            ]
        ],
        robotStart: { x: 2, y: 2, direction: 'west' },
        targets: [{ x: 2, y: 2 }],
        maxCommands: 8,
        uiLimitMain: 10,
        allowedCommands: ['turn-right', 'jump', 'activate', 'move'],
    },
    '1-10': {
        map: [
            [
                { type: 'floor', x: 0, y: 0, height: 1 },
                { type: 'floor', x: 1, y: 0, height: 0 },
                { type: 'floor', x: 2, y: 0, height: 1 }
            ],
            [
                { type: 'empty', x: 0, y: 1 },
                { type: 'empty', x: 1, y: 1 },
                { type: 'floor', x: 2, y: 1, height: 0 }
            ],
            [
                { type: 'empty', x: 0, y: 2 },
                { type: 'empty', x: 1, y: 2 },
                { type: 'target', x: 2, y: 2, height: 1 }
            ]
        ],
        robotStart: { x: 0, y: 0, height: 1, direction: 'east' },
        targets: [{ x: 2, y: 2 }],
        maxCommands: 7,
        uiLimitMain: 9,
        allowedCommands: ['move', 'turn-right', 'jump', 'activate'],
    },

    // ==========================================
    // FASE 3: LA MAGIA DEL BUCLE (REPEAT)
    // ==========================================
    '1-11': {
        map: [
            [
                { type: 'floor', x: 0, y: 0 },
                { type: 'floor', x: 1, y: 0 },
                { type: 'floor', x: 2, y: 0 },
                { type: 'floor', x: 3, y: 0 },
                { type: 'floor', x: 4, y: 0 },
                { type: 'target', x: 5, y: 0 }
            ]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 5, y: 0 }],
        maxCommands: 3,
        uiLimitMain: 10, // Solo cabe: Repeat, Move, Activate
        allowedCommands: ['move', 'activate', 'repeat'],
    },
    '1-12': {
        map: [
            [
                { type: 'floor', x: 0, y: 0, height: 0 },
                { type: 'floor', x: 1, y: 0, height: 1 },
                { type: 'floor', x: 2, y: 0, height: 2 },
                { type: 'floor', x: 3, y: 0, height: 3 },
                { type: 'target', x: 4, y: 0, height: 4 }
            ]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 4, y: 0 }],
        maxCommands: 3,
        uiLimitMain: 10,
        allowedCommands: ['jump', 'activate', 'repeat', 'move'],
    },
    '1-13': {
        map: [
            [
                { type: 'floor', x: 0, y: 0 },
                { type: 'floor', x: 1, y: 0 },
                { type: 'floor', x: 2, y: 0 }
            ],
            [
                { type: 'wall', x: 0, y: 1 },
                { type: 'empty', x: 1, y: 1 },
                { type: 'floor', x: 2, y: 1 }
            ],
            [
                { type: 'target', x: 0, y: 2 },
                { type: 'floor', x: 1, y: 2 },
                { type: 'floor', x: 2, y: 2 }
            ]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 0, y: 2 }],
        maxCommands: 5,
        uiLimitMain: 12,
        allowedCommands: ['move', 'turn-right', 'activate', 'repeat'],
    },
    '1-14': {
        map: [
            [
                { type: 'floor', x: 0, y: 0 },
                { type: 'floor', x: 1, y: 0 },
                { type: 'wall', x: 2, y: 0 },
                { type: 'empty', x: 3, y: 0 }
            ],
            [
                { type: 'empty', x: 0, y: 1 },
                { type: 'floor', x: 1, y: 1 },
                { type: 'floor', x: 2, y: 1 },
                { type: 'empty', x: 3, y: 1 }
            ],
            [
                { type: 'empty', x: 0, y: 2 },
                { type: 'empty', x: 1, y: 2 },
                { type: 'floor', x: 2, y: 2 },
                { type: 'target', x: 3, y: 2 }
            ]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 3, y: 2 }],
        maxCommands: 6,
        uiLimitMain: 10,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'activate', 'repeat'],
    },
    '1-15': {
        map: [
            [
                { type: 'floor', x: 0, y: 0, height: 1 },
                { type: 'floor', x: 1, y: 0, height: 0 },
                { type: 'floor', x: 2, y: 0, height: 1 },
                { type: 'floor', x: 3, y: 0, height: 0 },
                { type: 'target', x: 4, y: 0, height: 1 }
            ]
        ],
        robotStart: { x: 0, y: 0, height: 1, direction: 'east' },
        targets: [{ x: 4, y: 0 }],
        maxCommands: 3,
        uiLimitMain: 12,
        allowedCommands: ['move', 'jump', 'activate', 'repeat', 'turn-left', 'turn-right'],
    },

    // ==========================================
    // FASE 4: FUNCIONES (F1 / CALL-FN)
    // ==========================================
    '1-16': {
        map: [
            [
                { type: 'floor', x: 0, y: 0 },
                { type: 'generator', x: 1, y: 0 },
                { type: 'generator', x: 2, y: 0 },
                { type: 'target', x: 3, y: 0 }
            ]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }],
        allowF1: true,
        maxCommands: 4,
        uiLimitMain: 6,
        uiLimitF1: 6,
        allowedCommands: ['move', 'activate', 'call-f1', 'repeat', 'turn-left', 'turn-right', 'jump'],
    },
    '1-17': {
        map: [
            [
                { type: 'empty', x: 0, y: 0 },
                { type: 'floor', x: 1, y: 0 },
                { type: 'empty', x: 2, y: 0 },
                { type: 'floor', x: 3, y: 0 },
                { type: 'empty', x: 4, y: 0 },
            ],
            [
                { type: 'floor', x: 0, y: 1 },
                { type: 'floor', x: 1, y: 1 },
                { type: 'floor', x: 2, y: 1 },
                { type: 'target', x: 3, y: 1 },
                { type: 'floor', x: 4, y: 1 },
            ],
            [
                { type: 'empty', x: 0, y: 2 },
                { type: 'floor', x: 1, y: 2 },
                { type: 'floor', x: 2, y: 2 },
                { type: 'floor', x: 3, y: 2 },
                { type: 'empty', x: 4, y: 2 },
            ],
            [
                { type: 'floor', x: 0, y: 3 },
                { type: 'generator', x: 1, y: 3 },
                { type: 'floor', x: 2, y: 3 },
                { type: 'generator', x: 3, y: 3 },
                { type: 'floor', x: 4, y: 3 },
            ],
            [
                { type: 'empty', x: 0, y: 4 },
                { type: 'floor', x: 1, y: 4 },
                { type: 'empty', x: 2, y: 4 },
                { type: 'floor', x: 3, y: 4 },
                { type: 'empty', x: 4, y: 4 },
            ]
        ],
        robotStart: { x: 2, y: 2, direction: 'south' },
        targets: [{ x: 3, y: 3 }, { x: 1, y: 3 }, { x: 3, y: 1 }],
        allowF1: true,
        maxCommands: 12,
        uiLimitMain: 10,
        uiLimitF1: 10,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'activate', 'call-f1', 'repeat', 'jump',],
    },
    '1-18': {
        map: [
            [
                { type: 'empty', x: 0, y: 0 },
                { type: 'generator', x: 1, y: 0 },
                { type: 'empty', x: 2, y: 0 }
            ],
            [
                { type: 'generator', x: 0, y: 1 },
                { type: 'floor', x: 1, y: 1 },
                { type: 'generator', x: 2, y: 1 }
            ],
            [
                { type: 'empty', x: 0, y: 2 },
                { type: 'target', x: 1, y: 2 },
                { type: 'empty', x: 2, y: 2 }
            ]
        ],
        robotStart: { x: 1, y: 1, direction: 'north' },
        targets: [{ x: 1, y: 0 }, { x: 2, y: 1 }, { x: 1, y: 2 }, { x: 0, y: 1 }],
        allowF1: true,
        maxCommands: 10,
        uiLimitMain: 10,
        uiLimitF1: 10,
        allowedCommands: ['move', 'turn-right', 'activate', 'call-f1', 'repeat', "jump", 'turn-left'],
    },
    '1-19': {
        map: [
            [
                { type: 'floor', x: 0, y: 0, height: 0 },
                { type: 'generator', x: 1, y: 0, height: 1 },
                { type: 'floor', x: 2, y: 0, height: 1 },
                { type: 'generator', x: 3, y: 0, height: 2 },
                { type: 'floor', x: 4, y: 0, height: 2 },
                { type: 'target', x: 5, y: 0, height: 3 }
            ]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 1, y: 0 }, { x: 3, y: 0 }, { x: 5, y: 0 }],
        allowF1: true,
        maxCommands: 5,
        uiLimitMain: 3,
        uiLimitF1: 4,
        allowedCommands: ['move', 'jump', 'activate', 'call-f1', 'repeat', 'turn-left', 'turn-right'],
    },
    '1-20': {
        map: [
            [
                { type: 'target', x: 0, y: 0 },
                { type: 'empty', x: 1, y: 0 },
                { type: 'target', x: 2, y: 0 }
            ],
            [
                { type: 'floor', x: 0, y: 1 },
                { type: 'floor', x: 1, y: 1 },
                { type: 'floor', x: 2, y: 1 }
            ]
        ],
        robotStart: { x: 1, y: 1, direction: 'north' },
        targets: [{ x: 0, y: 0 }, { x: 2, y: 0 }],
        allowF1: true,
        maxCommands: 4,
        uiLimitMain: 4,
        uiLimitF1: 6,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'activate', 'call-f1', 'repeat', 'jump'],
    },
    '1-21': {
        map: [
            [
                { type: 'floor', x: 0, y: 0 },
                { type: 'floor', x: 1, y: 0 },
                { type: 'floor', x: 2, y: 0 },
                { type: 'empty', x: 3, y: 0 },
                { type: 'floor', x: 4, y: 0 },
                { type: 'floor', x: 5, y: 0 },
                { type: 'floor', x: 6, y: 0 },
            ],
            [
                { type: 'floor', x: 0, y: 1 },
                { type: 'empty', x: 1, y: 1 },
                { type: 'floor', x: 2, y: 1 },
                { type: 'empty', x: 3, y: 1 },
                { type: 'floor', x: 4, y: 1 },
                { type: 'empty', x: 5, y: 1 },
                { type: 'floor', x: 6, y: 1 },
            ],
            [
                { type: 'target', x: 0, y: 2 },
                { type: 'empty', x: 1, y: 2 },
                { type: 'floor', x: 2, y: 2 },
                { type: 'floor', x: 3, y: 2 },
                { type: 'generator', x: 4, y: 2 },
                { type: 'empty', x: 5, y: 2 },
                { type: 'floor', x: 6, y: 2 },
            ]
        ],
        robotStart: { x: 6, y: 2, direction: 'north' },
        targets: [{ x: 4, y: 2 }, { x: 0, y: 2 }],
        allowF1: true,
        maxCommands: 12,
        uiLimitMain: 10,
        uiLimitF1: 7,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'activate', 'call-f1', 'repeat', 'jump'],
    },
    '1-22': {
        map: [
            [
                { type: 'generator', x: 0, y: 0 },
                { type: 'floor', x: 1, y: 0, height: 1 },
                { type: 'floor', x: 2, y: 0, height: 2 },
                { type: 'floor', x: 3, y: 0, height: 1 },
                { type: 'floor', x: 4, y: 0 },
            ],
            [
                { type: 'floor', x: 0, y: 1, height: 1 },
                { type: 'empty', x: 1, y: 1 },
                { type: 'empty', x: 2, y: 1, height: 2 },
                { type: 'empty', x: 3, y: 1 },
                { type: 'empty', x: 4, y: 1 },
            ],
            [
                { type: 'floor', x: 0, y: 2, height: 2 },
                { type: 'empty', x: 1, y: 2 },
                { type: 'empty', x: 2, y: 2 },
                { type: 'empty', x: 3, y: 2 },
                { type: 'empty', x: 4, y: 2 },
            ],
            [
                { type: 'floor', x: 0, y: 3, height: 1 },
                { type: 'empty', x: 1, y: 3 },
                { type: 'empty', x: 2, y: 3 },
                { type: 'empty', x: 3, y: 3 },
                { type: 'empty', x: 4, y: 3 },
            ],
            [
                { type: 'generator', x: 0, y: 4 },
                { type: 'floor', x: 1, y: 4, height: 1 },
                { type: 'floor', x: 2, y: 4, height: 2 },
                { type: 'floor', x: 3, y: 4, height: 1 },
                { type: 'target', x: 4, y: 4 },
            ]
        ],
        robotStart: { x: 4, y: 0, direction: 'west' },
        targets: [{ x: 0, y: 0 }, { x: 0, y: 4 }, { x: 4, y: 4 }],
        allowF1: true,
        maxCommands: 6,
        uiLimitMain: 3,
        uiLimitF1: 4,
        allowedCommands: ['move', 'jump', 'activate', 'call-f1', 'repeat', 'turn-left', 'turn-right'],
    },
    '1-23': {
        map: [
            [
                { type: 'floor', x: 0, y: 0 },
                { type: 'empty', x: 1, y: 0 },
                { type: 'floor', x: 2, y: 0 },
                { type: 'floor', x: 3, y: 0 },
                { type: 'generator', x: 4, y: 0 },

            ],
            [
                { type: 'floor', x: 0, y: 1 },
                { type: 'empty', x: 1, y: 1 },
                { type: 'floor', x: 2, y: 1 },
                { type: 'empty', x: 3, y: 1 },
                { type: 'floor', x: 4, y: 1 },
            ],
            [
                { type: 'floor', x: 0, y: 2 },
                { type: 'wall', x: 1, y: 2 },
                { type: 'target', x: 2, y: 2 },
                { type: 'wall', x: 3, y: 2 },
                { type: 'floor', x: 4, y: 2 },
            ],
            [
                { type: 'floor', x: 0, y: 3 },
                { type: 'empty', x: 1, y: 3 },
                { type: 'wall', x: 2, y: 3 },
                { type: 'empty', x: 3, y: 3 },
                { type: 'floor', x: 4, y: 3 },
            ],
            [
                { type: 'generator', x: 0, y: 4 },
                { type: 'floor', x: 1, y: 4 },
                { type: 'floor', x: 2, y: 4 },
                { type: 'floor', x: 3, y: 4 },
                { type: 'generator', x: 4, y: 4 },
            ],
        ],
        robotStart: { x: 0, y: 0, direction: 'south' },
        targets: [{ x: 4, y: 0 }, { x: 0, y: 4 }, { x: 4, y: 4 }, { x: 2, y: 2 }], // Activa el inicio y el fin
        allowF1: true,
        allowF2: true,
        maxCommands: 13,
        uiLimitMain: 12,
        uiLimitF1: 5,
        uiLimitF2: 5,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'activate', 'call-f1', 'call-f2', 'repeat', 'jump'],
    },
    '1-24': {
        map: [
            [
                { type: 'target', x: 0, y: 0, height: 4 },
                { type: 'floor', x: 1, y: 0, height: 3 },
                { type: 'floor', x: 2, y: 0, height: 2 },
                { type: 'floor', x: 3, y: 0, height: 1 },
                { type: 'floor', x: 4, y: 0 },

            ],
            [
                { type: 'empty', x: 0, y: 1 },
                { type: 'empty', x: 1, y: 1 },
                { type: 'empty', x: 2, y: 1 },
                { type: 'wall', x: 3, y: 1 },
                { type: 'floor', x: 4, y: 1 },
            ],
            [
                { type: 'floor', x: 0, y: 2, height: 4 },
                { type: 'floor', x: 1, y: 2, height: 3 },
                { type: 'floor', x: 2, y: 2, height: 2 },
                { type: 'floor', x: 3, y: 2, height: 1 },
                { type: 'generator', x: 4, y: 2 },
            ],
            [
                { type: 'floor', x: 0, y: 3, height: 4 },
                { type: 'empty', x: 1, y: 3 },
                { type: 'empty', x: 2, y: 3 },
                { type: 'wall', x: 3, y: 3 },
                { type: 'wall', x: 4, y: 3 },
            ],
            [
                { type: 'generator', x: 0, y: 4, height: 4 },
                { type: 'floor', x: 1, y: 4, height: 3 },
                { type: 'floor', x: 2, y: 4, height: 2 },
                { type: 'floor', x: 3, y: 4, height: 1 },
                { type: 'floor', x: 4, y: 4 },
            ],
        ],
        robotStart: { x: 4, y: 4, direction: 'west' },
        targets: [{ x: 0, y: 4 }, { x: 4, y: 2 }, { x: 0, y: 0 }],
        allowF1: true,
        allowF2: true,
        maxCommands: 14,
        uiLimitMain: 9,
        uiLimitF1: 6,
        uiLimitF2: 6,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'jump', 'activate', 'call-f1', 'repeat', 'call-f2'],
    },

    // ==========================================
    // FASE 5: EL EXAMEN FINAL DEL SECTOR 1
    // ==========================================
    '1-R': {
        map: [
            [{ type: 'floor', x: 0, y: 0, height: 0 }, { type: 'floor', x: 1, y: 0, height: 1 }, { type: 'floor', x: 2, y: 0, height: 2 }, { type: 'target', x: 3, y: 0, height: 2 }],
            [{ type: 'empty', x: 0, y: 1 }, { type: 'empty', x: 1, y: 1 }, { type: 'empty', x: 2, y: 1 }, { type: 'floor', x: 3, y: 1, height: 2 }],
            [{ type: 'target', x: 0, y: 2, height: 2 }, { type: 'floor', x: 1, y: 2, height: 2 }, { type: 'floor', x: 2, y: 2, height: 2 }, { type: 'floor', x: 3, y: 2, height: 2 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 3, y: 0 }, { x: 0, y: 2 }],
        allowF1: true,
        maxCommands: 5,
        uiLimitMain: 5, // UI súper restrictiva.
        uiLimitF1: 5,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'jump', 'activate', 'call-f1', 'repeat'],
    }
};
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
    TILE_W: 100,    // Antes 80
    TILE_H: 56,    // Antes 46
    DEPTH: 18,     // Antes 18
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
