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
    // ==========================================
    // FASE 1: SECUENCIAS BÁSICAS Y ORIENTACIÓN
    // ==========================================
    '1-01': { // 1. El primer paso (Solo avanzar)
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'target', x: 2, y: 0 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 2, y: 0 }],
        maxCommands: 3,
        uiLimitMain: 4,
        allowedCommands: ['move', 'activate'],
    },
    '1-02': { // 2. La caminata (Entender secuencias más largas)
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'floor', x: 2, y: 0 }, { type: 'floor', x: 3, y: 0 }, { type: 'target', x: 4, y: 0 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 4, y: 0 }],
        maxCommands: 5,
        uiLimitMain: 6,
        allowedCommands: ['move', 'activate'],
    },
    '1-03': { // 3. La primera esquina (Girar NO avanza)
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }],
            [{ type: 'empty', x: 0, y: 1 }, { type: 'target', x: 1, y: 1 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 1, y: 1 }],
        maxCommands: 4,
        uiLimitMain: 6,
        allowedCommands: ['move', 'turn-right', 'activate'],
    },
    '1-04': { // 4. El Zig-Zag básico (Izquierda y Derecha)
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
    '1-05': { // 5. La U (Giro de 180 grados)
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'floor', x: 2, y: 0 }],
            [{ type: 'floor', x: 0, y: 1 }, { type: 'wall', x: 1, y: 1 }, { type: 'floor', x: 2, y: 1 }],
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
    '1-06': { // 6. El primer escalón
        map: [
            [{ type: 'floor', x: 0, y: 0, height: 0 }, { type: 'floor', x: 1, y: 0, height: 1 }, { type: 'target', x: 2, y: 0, height: 1 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 2, y: 0 }],
        maxCommands: 3,
        uiLimitMain: 5,
        allowedCommands: ['move', 'jump', 'activate'],
    },
    '1-07': { // 7. El foso (Saltar hacia abajo)
        map: [
            [{ type: 'floor', x: 0, y: 0, height: 2 }, { type: 'floor', x: 1, y: 0, height: 0 }, { type: 'target', x: 2, y: 0, height: 0 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 2, y: 0 }],
        maxCommands: 3,
        uiLimitMain: 5,
        allowedCommands: ['move', 'jump', 'activate'],
    },
    '1-08': { // 8. La pirámide (Subir y bajar)
        map: [
            [{ type: 'floor', x: 0, y: 0, height: 0 }, { type: 'floor', x: 1, y: 0, height: 1 }, { type: 'floor', x: 2, y: 0, height: 2 }, { type: 'floor', x: 3, y: 0, height: 1 }, { type: 'target', x: 4, y: 0, height: 0 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 4, y: 0 }],
        maxCommands: 5,
        uiLimitMain: 8,
        allowedCommands: ['move', 'jump', 'activate'],
    },
    '1-09': { // 9. Escalera de caracol
        map: [
            [{ type: 'floor', x: 0, y: 0, height: 0 }, { type: 'floor', x: 1, y: 0, height: 1 }],
            [{ type: 'empty', x: 0, y: 1 }, { type: 'target', x: 1, y: 1, height: 2 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 1, y: 1 }],
        maxCommands: 4,
        uiLimitMain: 6,
        allowedCommands: ['turn-right', 'jump', 'activate'],
    },
    '1-10': { // 10. Parkour urbano (Saltos intermitentes con giros)
        map: [
            [{ type: 'floor', x: 0, y: 0, height: 1 }, { type: 'floor', x: 1, y: 0, height: 0 }, { type: 'floor', x: 2, y: 0, height: 1 }],
            [{ type: 'empty', x: 0, y: 1 }, { type: 'empty', x: 1, y: 1 }, { type: 'floor', x: 2, y: 1, height: 0 }],
            [{ type: 'empty', x: 0, y: 2 }, { type: 'empty', x: 1, y: 2 }, { type: 'target', x: 2, y: 2, height: 1 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 2, y: 2 }],
        maxCommands: 7,
        uiLimitMain: 9,
        allowedCommands: ['move', 'turn-right', 'jump', 'activate'],
    },

    // ==========================================
    // FASE 3: LA MAGIA DEL BUCLE (REPEAT)
    // ==========================================
    '1-11': { // 11. El pasillo infinito (Fuerza a usar Repeat por límite de UI)
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'floor', x: 2, y: 0 }, { type: 'floor', x: 3, y: 0 }, { type: 'floor', x: 4, y: 0 }, { type: 'target', x: 5, y: 0 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 5, y: 0 }],
        maxCommands: 3,
        uiLimitMain: 3, // Solo cabe: Repeat, Move, Activate
        allowedCommands: ['move', 'activate', 'repeat'],
    },
    '1-12': { // 12. Escalera al cielo (Repeat + Jump)
        map: [
            [{ type: 'floor', x: 0, y: 0, height: 0 }, { type: 'floor', x: 1, y: 0, height: 1 }, { type: 'floor', x: 2, y: 0, height: 2 }, { type: 'floor', x: 3, y: 0, height: 3 }, { type: 'target', x: 4, y: 0, height: 4 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 4, y: 0 }],
        maxCommands: 3,
        uiLimitMain: 3,
        allowedCommands: ['jump', 'activate', 'repeat'],
    },
    '1-13': { // 13. El Cuadrado (Repeat con patrones múltiples)
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'floor', x: 2, y: 0 }],
            [{ type: 'floor', x: 0, y: 1 }, { type: 'empty', x: 1, y: 1 }, { type: 'floor', x: 2, y: 1 }],
            [{ type: 'target', x: 0, y: 2 }, { type: 'floor', x: 1, y: 2 }, { type: 'floor', x: 2, y: 2 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 0, y: 2 }],
        maxCommands: 4,
        uiLimitMain: 5,
        allowedCommands: ['move', 'turn-right', 'activate', 'repeat'],
    },
    '1-14': { // 14. Zig-Zag infinito (Patrón Move-Turn-Move-Turn)
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'empty', x: 2, y: 0 }, { type: 'empty', x: 3, y: 0 }],
            [{ type: 'empty', x: 0, y: 1 }, { type: 'floor', x: 1, y: 1 }, { type: 'floor', x: 2, y: 1 }, { type: 'empty', x: 3, y: 1 }],
            [{ type: 'empty', x: 0, y: 2 }, { type: 'empty', x: 1, y: 2 }, { type: 'floor', x: 2, y: 2 }, { type: 'target', x: 3, y: 2 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 3, y: 2 }],
        maxCommands: 5,
        uiLimitMain: 6,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'activate', 'repeat'],
    },
    '1-15': { // 15. Pilares repetitivos (Jump + Move en bucle)
        map: [
            [{ type: 'floor', x: 0, y: 0, height: 1 }, { type: 'floor', x: 1, y: 0, height: 0 }, { type: 'floor', x: 2, y: 0, height: 1 }, { type: 'floor', x: 3, y: 0, height: 0 }, { type: 'target', x: 4, y: 0, height: 1 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 4, y: 0 }],
        maxCommands: 4,
        uiLimitMain: 4,
        allowedCommands: ['move', 'jump', 'activate', 'repeat'],
    },

    // ==========================================
    // FASE 4: FUNCIONES (F1 / CALL-FN)
    // ==========================================
    '1-16': { // 16. La primera Función (Avanzar y Activar x3)
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'target', x: 1, y: 0 }, { type: 'floor', x: 2, y: 0 }, { type: 'target', x: 3, y: 0 }, { type: 'floor', x: 4, y: 0 }, { type: 'target', x: 5, y: 0 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 1, y: 0 }, { x: 3, y: 0 }, { x: 5, y: 0 }],
        allowF1: true,
        maxCommands: 3,
        uiLimitMain: 3, // Obliga a llamar a F1 tres veces
        uiLimitF1: 3,   // F1: move, activate, move
        allowedCommands: ['move', 'activate', 'call-fn'],
    },
    '1-17': { // 17. Tres Islas (F1 con giro)
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'empty', x: 1, y: 0 }, { type: 'target', x: 2, y: 0 }],
            [{ type: 'empty', x: 0, y: 1 }, { type: 'floor', x: 1, y: 1 }, { type: 'empty', x: 2, y: 1 }],
            [{ type: 'target', x: 0, y: 2 }, { type: 'empty', x: 1, y: 2 }, { type: 'target', x: 2, y: 2 }]
        ],
        robotStart: { x: 1, y: 1, direction: 'north' },
        targets: [{ x: 1, y: 0 }, { x: 2, y: 1 }, { x: 1, y: 2 }],
        allowF1: true,
        maxCommands: 5,
        uiLimitMain: 6,
        uiLimitF1: 5,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'activate', 'call-fn'],
    },
    '1-18': { // 18. Cruz de Malta (F1 + Repeat en Main)
        map: [
            [{ type: 'empty', x: 0, y: 0 }, { type: 'target', x: 1, y: 0 }, { type: 'empty', x: 2, y: 0 }],
            [{ type: 'target', x: 0, y: 1 }, { type: 'floor', x: 1, y: 1 }, { type: 'target', x: 2, y: 1 }],
            [{ type: 'empty', x: 0, y: 2 }, { type: 'target', x: 1, y: 2 }, { type: 'empty', x: 2, y: 2 }]
        ],
        robotStart: { x: 1, y: 1, direction: 'north' },
        targets: [{ x: 1, y: 0 }, { x: 2, y: 1 }, { x: 1, y: 2 }, { x: 0, y: 1 }],
        allowF1: true,
        maxCommands: 4,
        uiLimitMain: 4,
        uiLimitF1: 5,
        allowedCommands: ['move', 'turn-right', 'activate', 'call-fn', 'repeat'],
    },
    '1-19': { // 19. El fractal de saltos
        map: [
            [{ type: 'floor', x: 0, y: 0, height: 0 }, { type: 'target', x: 1, y: 0, height: 1 }, { type: 'floor', x: 2, y: 0, height: 1 }, { type: 'target', x: 3, y: 0, height: 2 }, { type: 'floor', x: 4, y: 0, height: 2 }, { type: 'target', x: 5, y: 0, height: 3 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 1, y: 0 }, { x: 3, y: 0 }, { x: 5, y: 0 }],
        allowF1: true,
        maxCommands: 3,
        uiLimitMain: 3,
        uiLimitF1: 4,
        allowedCommands: ['move', 'jump', 'activate', 'call-fn', 'repeat'],
    },
    '1-20': { // 20. F1 con ida y vuelta
        map: [
            [{ type: 'target', x: 0, y: 0 }, { type: 'empty', x: 1, y: 0 }, { type: 'target', x: 2, y: 0 }],
            [{ type: 'floor', x: 0, y: 1 }, { type: 'floor', x: 1, y: 1 }, { type: 'floor', x: 2, y: 1 }]
        ],
        robotStart: { x: 1, y: 1, direction: 'north' },
        targets: [{ x: 0, y: 0 }, { x: 2, y: 0 }],
        allowF1: true,
        maxCommands: 4,
        uiLimitMain: 4,
        uiLimitF1: 6,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'activate', 'call-fn', 'repeat'],
    },
    '1-21': { // 21. Laberinto en U doble
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'empty', x: 2, y: 0 }, { type: 'empty', x: 3, y: 0 }],
            [{ type: 'floor', x: 0, y: 1 }, { type: 'empty', x: 1, y: 1 }, { type: 'floor', x: 2, y: 1 }, { type: 'floor', x: 3, y: 1 }],
            [{ type: 'target', x: 0, y: 2 }, { type: 'empty', x: 1, y: 2 }, { type: 'target', x: 2, y: 2 }, { type: 'floor', x: 3, y: 2 }]
        ],
        robotStart: { x: 3, y: 1, direction: 'west' },
        targets: [{ x: 0, y: 2 }, { x: 2, y: 2 }],
        allowF1: true,
        maxCommands: 5,
        uiLimitMain: 6,
        uiLimitF1: 6,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'activate', 'call-fn'],
    },
    '1-22': { // 22. Montañas gemelas
        map: [
            [{ type: 'floor', x: 0, y: 0, height: 0 }, { type: 'floor', x: 1, y: 0, height: 1 }, { type: 'target', x: 2, y: 0, height: 0 }, { type: 'floor', x: 3, y: 0, height: 1 }, { type: 'target', x: 4, y: 0, height: 0 }]
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 2, y: 0 }, { x: 4, y: 0 }],
        allowF1: true,
        maxCommands: 3,
        uiLimitMain: 3,
        uiLimitF1: 4,
        allowedCommands: ['move', 'jump', 'activate', 'call-fn', 'repeat'],
    },
    '1-23': { // 23. Espiral exterior
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'floor', x: 2, y: 0 }, { type: 'target', x: 3, y: 0 }],
            [{ type: 'empty', x: 0, y: 1 }, { type: 'empty', x: 1, y: 1 }, { type: 'empty', x: 2, y: 1 }, { type: 'floor', x: 3, y: 1 }],
            [{ type: 'target', x: 0, y: 2 }, { type: 'floor', x: 1, y: 2 }, { type: 'floor', x: 2, y: 2 }, { type: 'floor', x: 3, y: 2 }]
        ],
        robotStart: { x: 0, y: 2, direction: 'east' },
        targets: [{ x: 3, y: 0 }, { x: 0, y: 2 }], // Activa el inicio y el fin
        allowF1: true,
        maxCommands: 6,
        uiLimitMain: 6,
        uiLimitF1: 5,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'activate', 'call-fn', 'repeat'],
    },
    '1-24': { // 24. La Antesala (Preparación para el boss)
        map: [
            [{ type: 'target', x: 0, y: 0, height: 2 }, { type: 'empty', x: 1, y: 0 }, { type: 'target', x: 2, y: 0, height: 2 }],
            [{ type: 'floor', x: 0, y: 1, height: 1 }, { type: 'floor', x: 1, y: 1, height: 0 }, { type: 'floor', x: 2, y: 1, height: 1 }],
            [{ type: 'floor', x: 0, y: 2, height: 0 }, { type: 'empty', x: 1, y: 2 }, { type: 'floor', x: 2, y: 2, height: 0 }]
        ],
        robotStart: { x: 1, y: 1, direction: 'west' },
        targets: [{ x: 0, y: 0 }, { x: 2, y: 0 }],
        allowF1: true,
        maxCommands: 6,
        uiLimitMain: 5,
        uiLimitF1: 6,
        allowedCommands: ['move', 'turn-left', 'turn-right', 'jump', 'activate', 'call-fn', 'repeat'],
    },

    // ==========================================
    // FASE 5: EL EXAMEN FINAL DEL SECTOR 1
    // ==========================================
    '1-R': { // 25. EXAMEN FINAL (Optimización absoluta: F1 + Repeat + Saltos)
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
        allowedCommands: ['move', 'turn-left', 'turn-right', 'jump', 'activate', 'call-fn', 'repeat'],
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
