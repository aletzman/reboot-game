// ============================================================
// REBOOT — components/levels/LightbotLevel.tsx
// Nivel tipo Lightbot: arrastra comandos, el robot los ejecuta
// Mapa isométrico renderizado con Canvas 2D (sin Phaser)
// ============================================================

'use client'

import { useEffect, useRef, useState, useCallback, ForwardRefExoticComponent, RefAttributes } from 'react'
import type { Level, LevelState, Command, CommandType, LightbotLevelData, RobotState, Direction } from '@/types/game'
import { Button } from '@/components/ui/Button'
import { GameButton } from '@/components/ui/GameButton'
import { ButtonOption } from '@/components/ui/ButtonOption'
import { PlayIcon, CornerUpLeft, CornerUpRight, StepForward, MoveRightIcon, LucideProps, RotateCcwIcon, ChevronsUp, FunctionSquare, Repeat, Hand, Lightbulb, Sun, ChevronRightIcon, ChevronsRightIcon, PackageOpen } from 'lucide-react'
import { useAudioStore } from '@/store/audio.store'

// ------------------------------------------------------------
// TIPOS INTERNOS
// ------------------------------------------------------------

interface LightbotLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
}

// ------------------------------------------------------------
// COMANDOS DISPONIBLES EN LA PALETA
// ------------------------------------------------------------

const PALETTE_COMMANDS: { type: CommandType; label: string; icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>; cssColor: string }[] = [
    { type: 'move', label: 'avanzar', icon: MoveRightIcon, cssColor: 'var(--green-light)' },
    { type: 'turn-left', label: 'girar', icon: CornerUpLeft, cssColor: 'var(--green-light)' },
    { type: 'turn-right', label: 'girar', icon: CornerUpRight, cssColor: 'var(--green-light)' },
    { type: 'jump', label: 'saltar', icon: ChevronsUp, cssColor: 'var(--green-muted)' },
    { type: 'activate', label: 'activar', icon: Sun, cssColor: 'var(--amber)' },
    { type: 'repeat', label: 'repetir', icon: Repeat, cssColor: 'var(--purple)' },
    { type: 'call-fn', label: 'F1', icon: FunctionSquare, cssColor: 'var(--cyan)' },
]

const MAX_COMMANDS = 20
const EXEC_SPEED = 420

// ------------------------------------------------------------
// DATOS DE NIVELES LIGHTBOT
// ------------------------------------------------------------

const LIGHTBOT_MAPS: Record<string, LightbotLevelData> = {
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
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0, height: 1 }, { type: 'floor', x: 2, y: 0, height: 1 }, { type: 'target', x: 3, y: 0 }],
        ],
        robotStart: { x: 0, y: 0, direction: 'east' },
        targets: [{ x: 3, y: 0 }],
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
}

const DEFAULT_MAP: LightbotLevelData = {
    map: [
        [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'floor', x: 2, y: 0 }],
        [{ type: 'floor', x: 0, y: 1 }, { type: 'floor', x: 1, y: 1 }, { type: 'floor', x: 2, y: 1 }],
        [{ type: 'floor', x: 0, y: 2 }, { type: 'floor', x: 1, y: 2 }, { type: 'target', x: 2, y: 2 }],
    ],
    robotStart: { x: 0, y: 0, direction: 'east' },
    targets: [{ x: 2, y: 2 }],
    maxCommands: 5,
}

// ============================================================
// ISOMETRIC RENDERING ENGINE (Canvas 2D puro)
// ============================================================

const ISO = {
    TILE_W: 80,    // ancho del tile isométrico (diamante)
    TILE_H: 46,    // alto del tile isométrico
    DEPTH: 18,     // profundidad/grosor del tile 3D
}

// Colores de tiles (top face, side-left, side-right)
const TILE_COLORS: Record<string, { top: string; left: string; right: string; glow?: string }> = {
    floor: { top: '#141B24', left: '#0E1319', right: '#0B0F14' },
    wall: { top: '#080A0D', left: '#050607', right: '#030404' },
    active: { top: '#0d2600', left: '#0a1e00', right: '#081800', glow: '#55e20040' },
    target: { top: '#0a2e2e', left: '#072222', right: '#051a1a', glow: '#12b0bb30' },
    broken: { top: '#150d1e', left: '#100a16', right: '#0c0812', glow: '#7F77DD20' },
    generator: { top: '#1f1500', left: '#170f00', right: '#120b00', glow: '#EF9F2730' },
    empty: { top: '#010101', left: '#010101', right: '#010101' },
}

function toIso(col: number, row: number, offsetX: number, offsetY: number): { x: number; y: number } {
    const x = (col - row) * (ISO.TILE_W / 2) + offsetX
    const y = (col + row) * (ISO.TILE_H / 2) + offsetY
    return { x, y }
}

function drawIsoDiamond(
    ctx: CanvasRenderingContext2D,
    cx: number, cy: number,
    colors: { top: string; left: string; right: string; glow?: string },
    isHighlighted: boolean,
    highlightColor?: string
) {
    const hw = ISO.TILE_W / 2
    const hh = ISO.TILE_H / 2
    const d = ISO.DEPTH

    // Cara izquierda (profundidad)
    ctx.beginPath()
    ctx.moveTo(cx - hw, cy)
    ctx.lineTo(cx, cy + hh)
    ctx.lineTo(cx, cy + hh + d)
    ctx.lineTo(cx - hw, cy + d)
    ctx.closePath()
    ctx.fillStyle = colors.left
    ctx.fill()

    // Cara derecha (profundidad)
    ctx.beginPath()
    ctx.moveTo(cx + hw, cy)
    ctx.lineTo(cx, cy + hh)
    ctx.lineTo(cx, cy + hh + d)
    ctx.lineTo(cx + hw, cy + d)
    ctx.closePath()
    ctx.fillStyle = colors.right
    ctx.fill()

    // Cara superior (diamante)
    ctx.beginPath()
    ctx.moveTo(cx, cy - hh)
    ctx.lineTo(cx + hw, cy)
    ctx.lineTo(cx, cy + hh)
    ctx.lineTo(cx - hw, cy)
    ctx.closePath()
    ctx.fillStyle = isHighlighted && highlightColor ? highlightColor : colors.top
    ctx.fill()

    // Bordes del diamante superior
    ctx.strokeStyle = isHighlighted ? (highlightColor ?? '#55e200') : '#6a6a6a60'
    ctx.lineWidth = isHighlighted ? 1.5 : 0.5
    ctx.stroke()

    // Borde inferior del cubo
    ctx.beginPath()
    ctx.moveTo(cx - hw, cy + d)
    ctx.lineTo(cx, cy + hh + d)
    ctx.lineTo(cx + hw, cy + d)
    ctx.strokeStyle = '#0d1f0030'
    ctx.lineWidth = 0.5
    ctx.stroke()

    // Glow para tiles especiales
    if (colors.glow) {
        ctx.beginPath()
        ctx.moveTo(cx, cy - hh)
        ctx.lineTo(cx + hw, cy)
        ctx.lineTo(cx, cy + hh)
        ctx.lineTo(cx - hw, cy)
        ctx.closePath()
        ctx.fillStyle = colors.glow
        ctx.fill()
    }
}

const robotSprite = typeof window !== 'undefined' ? new Image() : null
if (robotSprite) {
    robotSprite.src = '/game/robot_spritesheet.png'
}

const floorSprite = typeof window !== 'undefined' ? new Image() : null
if (floorSprite) {
    floorSprite.src = '/assets/sample_floor.svg'
}

const activeSprite = typeof window !== 'undefined' ? new Image() : null
if (activeSprite) {
    activeSprite.src = '/assets/sample_active.svg'
}

const wallSprite = typeof window !== 'undefined' ? new Image() : null
if (wallSprite) wallSprite.src = '/assets/sample_wall.svg'

const brokenSprite = typeof window !== 'undefined' ? new Image() : null
if (brokenSprite) brokenSprite.src = '/assets/sample_broken.svg'

const genSprite = typeof window !== 'undefined' ? new Image() : null
if (genSprite) genSprite.src = '/assets/sample_generator.svg'

const genActiveSprite = typeof window !== 'undefined' ? new Image() : null
if (genActiveSprite) genActiveSprite.src = '/assets/sample_generator_active.svg'

function drawRobot(
    ctx: CanvasRenderingContext2D,
    robot: ExtendedRobotState,
    cx: number, cy: number,
    pulse: number // 0-1 para animación respiración
) {
    // Sombra
    ctx.beginPath()
    ctx.ellipse(cx, cy + 8, 14, 6, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#00FFFF15'
    ctx.fill()

    // Glow / Propulsor debajo del robot
    ctx.save();
    ctx.globalCompositeOperation = 'lighter'; // Efecto de luz aditiva


    // Reducimos drásticamente el parpadeo aleatorio para evitar efecto estroboscópico
    const flicker = Math.random() * 0.05;

    // Calculamos el mismo offset de respiración que usa el sprite
    const breathingOffset = pulse * 2;
    const startY = cy - 8 - breathingOffset;

    // Usamos el 'pulse' (que es una onda suave senoidal) para hacer la transparencia fluida
    const baseAlpha = 0.05 + (pulse * 0.05) + flicker;

    // 1. Elipse Superior (Más grande, más cerca al robot)
    ctx.lineWidth = 1.2 + flicker;
    ctx.beginPath();
    ctx.ellipse(cx, startY - 2, 10 + flicker * 2, 6 + pulse * 1, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 255, 255, ${baseAlpha})`;
    ctx.stroke();

    // 2. Elipse Central (Mediana, mucho más pegada a la superior)
    ctx.beginPath();
    ctx.ellipse(cx, startY + 3, 7 + flicker * 1.5, 4 + pulse * 0.5, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 255, 255, ${baseAlpha})`;
    ctx.stroke();

    // 3. Elipse Inferior (Más pequeña, muy pegada a la central)
    ctx.beginPath();
    ctx.ellipse(cx, startY + 9, 4 + flicker * 1, 2 + pulse * 0.2, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 255, 255, ${baseAlpha})`;
    ctx.stroke();

    ctx.restore();

    if (robotSprite && robotSprite.complete) {
        const spriteWidth = 64;
        const spriteHeight = 64;

        // Columna (X): Dirección
        let frameX = 0;
        if (robot.direction === 'north') frameX = 0;
        if (robot.direction === 'east') frameX = 64;
        if (robot.direction === 'south') frameX = 128;
        if (robot.direction === 'west') frameX = 192;

        // Fila (Y): Acción (Stand, Jump, Activate)
        let frameY = 0;
        if (robot.isJumping) frameY = 64;
        else if (robot.isActivating) frameY = 128;

        const breathingOffset = pulse * 2;

        ctx.drawImage(
            robotSprite,
            frameX, frameY,
            spriteWidth, spriteHeight,
            cx - (spriteWidth / 2),
            cy - spriteHeight - breathingOffset + 8,
            spriteWidth, spriteHeight
        );
    }
}

function drawTargetMarker(ctx: CanvasRenderingContext2D, cx: number, cy: number, pulse: number) {
    // Anillo pulsante
    const r = 7 + pulse * 2
    ctx.beginPath()
    ctx.ellipse(cx, cy, r * 1.75, r, 0, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(18, 176, 187, ${0.4 + pulse * 0.3})`
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Centro
    ctx.beginPath()
    ctx.ellipse(cx, cy, 5, 3, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#12b0bb99'
    ctx.fill()

    // Glow
    ctx.beginPath()
    ctx.ellipse(cx, cy, 21, 12, 0, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(18, 176, 187, ${0.06 + pulse * 0.04})`
    ctx.fill()
}

function drawGeneratorIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, activated: boolean) {
    // Rayo centrado matemáticamente respecto a cx, cy
    ctx.save()
    ctx.translate(cx, cy)
    ctx.beginPath()
    ctx.moveTo(-3, -7)
    ctx.lineTo(2, -1)
    ctx.lineTo(-1, -1)
    ctx.lineTo(3, 7)
    ctx.lineTo(-2, 1)
    ctx.lineTo(1, 1)
    ctx.closePath()

    if (activated) {
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = '#EF9F27'
        ctx.shadowBlur = 4
    } else {
        ctx.fillStyle = '#EF9F27'
    }

    ctx.fill()
    ctx.restore()
}

function drawBrokenIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
    ctx.save()
    ctx.translate(cx, cy - 2)
    ctx.font = '10px monospace'
    ctx.fillStyle = '#7F77DD80'
    ctx.textAlign = 'center'
    ctx.fillText('✗', 0, 4)
    ctx.restore()
}

// ============================================================
// MOTOR DE EJECUCIÓN (lógica pura)
// ============================================================

export interface ExtendedRobotState extends RobotState {
    isJumping?: boolean
    isActivating?: boolean
    prevX?: number
    prevY?: number
    height?: number
    prevHeight?: number
}

function getNextPosition(robot: ExtendedRobotState, mapData: LightbotLevelData, moveType: 'move' | 'jump' = 'move'): { x: number; y: number; height: number } | null {
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

function turnLeft(dir: Direction): Direction {
    return ({ north: 'west', west: 'south', south: 'east', east: 'north' } as const)[dir]
}
function turnRight(dir: Direction): Direction {
    return ({ north: 'east', east: 'south', south: 'west', west: 'north' } as const)[dir]
}

type FlatCommand = { cmd: Command; originalIdx: number; panel: 'main' | 'f1' }

function flattenCommands(commands: Command[], f1Commands: Command[], activePanel: 'main' | 'f1' = 'main', depth = 0): FlatCommand[] {
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

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// ============================================================
// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

function calcStars(usedMain: number, usedF1: number, maxMain?: number, maxF1?: number): 1 | 2 | 3 {
    if (!maxMain) return 3
    const totalUsed = usedMain + usedF1
    const optimal = maxMain + (maxF1 || 0)

    if (totalUsed <= optimal) return 3
    if (totalUsed <= optimal + 2) return 2
    return 1
}

export default function LightbotLevel({ level, state, onComplete }: LightbotLevelProps) {
    const mapData = LIGHTBOT_MAPS[level.id] ?? DEFAULT_MAP
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animRef = useRef<number>(0)
    const initRef = useRef(false)

    const moveSoundRef = useRef<HTMLAudioElement | null>(null)
    const jumpSoundRef = useRef<HTMLAudioElement | null>(null)
    const activateSoundRef = useRef<HTMLAudioElement | null>(null)

    const { sfxVolume, isMuted } = useAudioStore()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            moveSoundRef.current = new Audio('/sounds/robot-jump.mp3')
            jumpSoundRef.current = new Audio('/sounds/robot-jump.mp3')
            activateSoundRef.current = new Audio('/sounds/activation-sound-2.mp3')
        }
    }, [])

    useEffect(() => {
        const volume = Math.max(0, Math.min(1, isMuted ? 0 : sfxVolume))
        if (moveSoundRef.current) moveSoundRef.current.volume = volume
        if (jumpSoundRef.current) jumpSoundRef.current.volume = volume
        if (activateSoundRef.current) activateSoundRef.current.volume = volume
    }, [isMuted, sfxVolume])

    const [commands, setCommands] = useState<Command[]>([])
    const [commandsF1, setCommandsF1] = useState<Command[]>([])
    const [activePanel, setActivePanel] = useState<'main' | 'f1'>('main')
    const [robot, setRobot] = useState<ExtendedRobotState>({ ...mapData.robotStart, isMoving: false, isJumping: false, prevX: mapData.robotStart.x, prevY: mapData.robotStart.y })
    const [activatedTiles, setActivated] = useState<Set<string>>(new Set())
    const [isRunning, setIsRunning] = useState(false)
    const [executingIdx, setExecutingIdx] = useState<{ idx: number; panel: 'main' | 'f1' } | null>(null)
    const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle')
    const [repeatModalOpen, setRepeatModal] = useState(false)
    const [repeatTimes, setRepeatTimes] = useState(2)

    // Setup active palette 
    const allowedTools = mapData.allowedCommands
        ? PALETTE_COMMANDS.filter(cmd => mapData.allowedCommands?.includes(cmd.type))
        : PALETTE_COMMANDS

    // Refs para animation loop (evitar stale closures)
    const robotRef = useRef<ExtendedRobotState>(robot)
    const activatedRef = useRef(activatedTiles)
    const statusRef = useRef(status)

    useEffect(() => {
        robotRef.current = robot
        activatedRef.current = activatedTiles
        statusRef.current = status
    }, [robot, activatedTiles, status])

    // --------------------------------------------------------
    // CANVAS ISOMÉTRICO — render loop
    // --------------------------------------------------------

    useEffect(() => {
        if (initRef.current) return
        initRef.current = true

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const cols = mapData.map[0].length
        const rows = mapData.map.length

        let maxH = 0
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                maxH = Math.max(maxH, mapData.map[r][c]?.height || 0)
            }
        }

        const mapWidthPx = (cols + rows) * (ISO.TILE_W / 2)
        const mapHeightPx = (cols + rows) * (ISO.TILE_H / 2) + maxH * 26

        const canvasW = Math.max(500, mapWidthPx + 150)
        const canvasH = Math.max(500, mapHeightPx + ISO.DEPTH + 150)
        canvas.width = canvasW
        canvas.height = canvasH

        const offsetX = canvasW / 2 - ((cols - rows) * (ISO.TILE_W / 2)) / 2
        const offsetY = canvasH / 2 - mapHeightPx / 2 + (maxH * 26) / 2

        const startTime = performance.now()
        let lastTime = startTime
        let visX = mapData.robotStart.x
        let visY = mapData.robotStart.y

        function render(time: number) {
            if (!ctx) return
            const elapsed = (time - startTime) / 1000
            const dt = Math.min((time - lastTime) / 1000, 0.1) // limit to 100ms
            lastTime = time
            const pulse = (Math.sin(elapsed * 2.5) + 1) / 2 // 0-1

            ctx.clearRect(0, 0, canvasW, canvasH)

            // Fondo con gradiente sutil
            const bgGrad = ctx.createRadialGradient(canvasW / 2, canvasH / 2, 0, canvasW / 2, canvasH / 2, canvasW * 0.6)
            bgGrad.addColorStop(0, '#090C10')
            bgGrad.addColorStop(1, '#010101')
            ctx.fillStyle = bgGrad
            ctx.fillRect(0, 0, canvasW, canvasH)

            // Grid lines muy sutiles (decoración)
            ctx.save()
            ctx.globalAlpha = 0.03
            ctx.strokeStyle = '#55e200'
            for (let i = 0; i <= cols; i++) {
                const start = toIso(i, 0, offsetX, offsetY)
                const end = toIso(i, rows, offsetX, offsetY)
                ctx.beginPath()
                ctx.moveTo(start.x, start.y)
                ctx.lineTo(end.x, end.y)
                ctx.stroke()
            }
            for (let j = 0; j <= rows; j++) {
                const start = toIso(0, j, offsetX, offsetY)
                const end = toIso(cols, j, offsetX, offsetY)
                ctx.beginPath()
                ctx.moveTo(start.x, start.y)
                ctx.lineTo(end.x, end.y)
                ctx.stroke()
            }
            ctx.restore()

            const currentRobot = robotRef.current
            const currentActivated = activatedRef.current
            const currentStatus = statusRef.current

            // Smooth Movement Interpolation
            const lerpFactor = 12 * dt
            visX += (currentRobot.x - visX) * lerpFactor
            visY += (currentRobot.y - visY) * lerpFactor

            // Dibujar tiles (de atrás hacia adelante para z-order)
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const tile = mapData.map[row][col]
                    const { x: sx, y: sy } = toIso(col, row, offsetX, offsetY)
                    const colors = TILE_COLORS[tile.type] ?? TILE_COLORS.floor

                    const th = tile.height || 0
                    const tz = th * 26

                    const rxFloor = Math.round(visX)
                    const ryFloor = Math.round(visY)
                    const isRobotHere = rxFloor === col && ryFloor === row
                    const isActivated = currentActivated.has(`${col},${row}`)

                    // Color de highlight según tile
                    let highlight = false
                    let highlightColor: string | undefined

                    if (tile.type === 'target') {
                        highlight = true
                        highlightColor = currentStatus === 'success' ? '#55e200' : `rgba(13, 31, 0, ${0.6 + pulse * 0.4})`
                    }
                    if (isActivated) {
                        highlight = true
                        highlightColor = '#1a4d00'
                    }

                    let imageToDraw: HTMLImageElement | null = null

                    if (tile.type === 'floor' || tile.type === 'target') {
                        imageToDraw = isActivated ? activeSprite : floorSprite
                    } else if (tile.type === 'wall') {
                        imageToDraw = wallSprite
                    } else if (tile.type === 'broken') {
                        imageToDraw = brokenSprite
                    } else if (tile.type === 'generator') {
                        imageToDraw = isActivated ? genActiveSprite : genSprite
                    } else if (tile.type === 'active') {
                        imageToDraw = activeSprite
                    }

                    if (imageToDraw && imageToDraw.complete && tile.type !== 'empty') {
                        const imgX = sx - (ISO.TILE_W / 2)
                        const imgY = (sy - tz) - (ISO.TILE_H / 2)
                        ctx.drawImage(imageToDraw, imgX, imgY, ISO.TILE_W, ISO.TILE_H + ISO.DEPTH)
                        if (highlight && highlightColor) {
                            ctx.beginPath()
                            ctx.moveTo(sx, (sy - tz) - ISO.TILE_H / 2)
                            ctx.lineTo(sx + ISO.TILE_W / 2, (sy - tz))
                            ctx.lineTo(sx, (sy - tz) + ISO.TILE_H / 2)
                            ctx.lineTo(sx - ISO.TILE_W / 2, (sy - tz))
                            ctx.closePath()
                            ctx.strokeStyle = highlightColor
                            ctx.lineWidth = 1.5
                            ctx.stroke()
                        }
                    } else {
                        drawIsoDiamond(ctx, sx, sy - tz, colors, highlight, highlightColor)
                    }

                    // Iconos de tile
                    if (tile.type === 'target' && !isRobotHere && !isActivated) {
                        drawTargetMarker(ctx, sx, sy - tz, pulse)
                    }
                    if (tile.type === 'generator') {
                        drawGeneratorIcon(ctx, sx, sy - tz, isActivated)
                    }
                    if (tile.type === 'broken') {
                        drawBrokenIcon(ctx, sx, sy - tz)
                    }
                }
            }

            // Dibujar robot con interpolación
            let isoX = visX
            let isoY = visY
            let progress = 0
            let isAnimating = false

            if ((currentRobot.isMoving || currentRobot.isJumping) && currentRobot.prevX !== undefined && currentRobot.prevY !== undefined) {
                const totalDistX = currentRobot.x - currentRobot.prevX
                const totalDistY = currentRobot.y - currentRobot.prevY

                if (totalDistX !== 0) {
                    progress = (visX - currentRobot.prevX) / totalDistX
                } else if (totalDistY !== 0) {
                    progress = (visY - currentRobot.prevY) / totalDistY
                } else {
                    progress = 1
                }

                progress = Math.max(0, Math.min(1, progress))

                isoX = currentRobot.prevX + totalDistX * progress
                isoY = currentRobot.prevY + totalDistY * progress
                isAnimating = true
            } else {
                progress = 1 // Garantiza que si no se esta moviendo, adquiera su altura de destino final ('currentH')
            }

            const { x: rx, y: ry } = toIso(isoX, isoY, offsetX, offsetY)

            // Interpolate height
            const prevH = currentRobot.prevHeight || 0
            const currentH = currentRobot.height || 0
            const isoH = prevH + (currentH - prevH) * progress
            const rz = isoH * 26

            // Calculo de parábola para el salto
            let zOffset = 0
            if (currentRobot.isJumping && isAnimating) {
                if (progress >= 0 && progress <= 1) {
                    const arc = 1 - Math.pow(2 * progress - 1, 2) // parabola
                    zOffset = arc * 25 // height modifier
                }
            }

            drawRobot(ctx, currentRobot, rx, ry - 8 - rz - zOffset, pulse)

            // Efectos de grid o status pulse
            if (currentStatus === 'success') {
                ctx.fillStyle = `rgba(85, 226, 0, ${0.04 + pulse * 0.03})`
                ctx.fillRect(0, 0, canvasW, canvasH)
            } else if (currentStatus === 'failed') {
                ctx.fillStyle = `rgba(226, 75, 74, ${0.06 * (1 - pulse)})`
                ctx.fillRect(0, 0, canvasW, canvasH)
            }

            animRef.current = requestAnimationFrame(render)
        }

        animRef.current = requestAnimationFrame(render)

        return () => {
            cancelAnimationFrame(animRef.current)
            initRef.current = false
        }
    }, [level.id, mapData])

    // --------------------------------------------------------
    // EJECUTAR SECUENCIA
    // --------------------------------------------------------

    const executeCommands = useCallback(async () => {
        if (isRunning || commands.length === 0) return
        setIsRunning(true)
        setStatus('idle')

        const flat = flattenCommands(commands, commandsF1)
        let currentRobot: ExtendedRobotState = { ...mapData.robotStart, isMoving: false, isJumping: false, height: mapData.robotStart.height || 0 }
        const activated = new Set<string>()
        let won = false

        for (let i = 0; i < flat.length; i++) {
            const currentItem = flat[i]
            setExecutingIdx({ idx: currentItem.originalIdx, panel: currentItem.panel })
            const cmd = currentItem.cmd
            await sleep(EXEC_SPEED)

            if (cmd.type === 'move' || cmd.type === 'jump') {
                const isJump = cmd.type === 'jump'
                if (isJump) {
                    if (jumpSoundRef.current) { jumpSoundRef.current.currentTime = 0; jumpSoundRef.current.play().catch(() => { }) }
                } else {
                    if (moveSoundRef.current) { moveSoundRef.current.currentTime = 0; moveSoundRef.current.play().catch(() => { }) }
                }
                const next = getNextPosition(currentRobot, mapData, cmd.type as 'move' | 'jump')
                if (!next) {
                    setStatus('failed')
                    setIsRunning(false)
                    setExecutingIdx(null)
                    return // Restaura la falla instantánea al tocar pared o vacío como pidió el usuario
                }
                currentRobot = {
                    ...currentRobot,
                    prevX: currentRobot.x,
                    prevY: currentRobot.y,
                    prevHeight: currentRobot.height || 0,
                    ...next,
                    isMoving: true,
                    isJumping: isJump
                }
                setRobot({ ...currentRobot })
            } else if (cmd.type === 'turn-left') {
                if (moveSoundRef.current) { moveSoundRef.current.currentTime = 0; moveSoundRef.current.play().catch(() => { }) }
                currentRobot = { ...currentRobot, direction: turnLeft(currentRobot.direction), isMoving: false, isJumping: false }
                setRobot({ ...currentRobot })
            } else if (cmd.type === 'turn-right') {
                if (moveSoundRef.current) { moveSoundRef.current.currentTime = 0; moveSoundRef.current.play().catch(() => { }) }
                currentRobot = { ...currentRobot, direction: turnRight(currentRobot.direction), isMoving: false, isJumping: false }
                setRobot({ ...currentRobot })
            } else if (cmd.type === 'activate') {
                if (activateSoundRef.current) { activateSoundRef.current.currentTime = 0; activateSoundRef.current.play().catch(() => { }) }
                currentRobot = { ...currentRobot, isActivating: true, isMoving: false, isJumping: false }
                setRobot({ ...currentRobot })
                await sleep(250) // pausa para la animacion

                const key = `${currentRobot.x},${currentRobot.y}`
                if (activated.has(key)) {
                    activated.delete(key)
                } else {
                    activated.add(key)
                }
                setActivated(new Set(activated))

                currentRobot = { ...currentRobot, isActivating: false }
                setRobot({ ...currentRobot })
            }

            // Comprobar éxito en cada paso
            const allTargetsReached = mapData.targets.every(
                t => activated.has(`${t.x},${t.y}`)
            )
            if (allTargetsReached) {
                won = true
                break
            }
        }

        setExecutingIdx(null)

        if (won) {
            setStatus('success')
            await sleep(600)
            const stars = calcStars(commands.length, commandsF1.length, mapData.maxCommands, mapData.maxF1Commands)
            onComplete(stars, state.fragUsed)
        } else {
            setStatus('failed')
        }

        setIsRunning(false)
    }, [commands, commandsF1, isRunning, mapData, state.fragUsed, onComplete])



    // --------------------------------------------------------
    // RESET
    // --------------------------------------------------------

    function handleReset() {
        setRobot({ ...mapData.robotStart, isMoving: false, isJumping: false })
        setActivated(new Set())
        setIsRunning(false)
        setExecutingIdx(null)
        setStatus('idle')
    }

    // --------------------------------------------------------
    // MANEJO DE COMANDOS
    // --------------------------------------------------------

    function handleDragFromPalette(type: CommandType) {
        if (type === 'repeat') {
            setRepeatModal(true)
            return
        }
        if (activePanel === 'main') {
            if (commands.length >= (mapData.uiLimitMain || MAX_COMMANDS)) return
            setCommands(prev => [...prev, { type }])
        } else {
            if (commandsF1.length >= (mapData.uiLimitF1 || 8)) return
            setCommandsF1(prev => [...prev, { type }])
        }
    }

    function handleRemoveCommand(idx: number) {
        if (activePanel === 'main') {
            setCommands(prev => prev.filter((_, i) => i !== idx))
        } else {
            setCommandsF1(prev => prev.filter((_, i) => i !== idx))
        }
    }

    function handleAddRepeat() {
        if (activePanel === 'main') {
            if (commands.length >= (mapData.uiLimitMain || MAX_COMMANDS)) return
            setCommands(prev => [...prev, { type: 'repeat', times: repeatTimes, children: [] }])
        } else {
            if (commandsF1.length >= (mapData.uiLimitF1 || 8)) return
            setCommandsF1(prev => [...prev, { type: 'repeat', times: repeatTimes, children: [] }])
        }
        setRepeatModal(false)
    }

    // --------------------------------------------------------
    // RENDER
    // --------------------------------------------------------

    return (
        <div className="flex flex-1 min-h-0" style={{ background: 'var(--bg-void)' }}>

            {/* ===== PANEL IZQUIERDO — Mapa isométrico ===== */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 gap-3 relative overflow-hidden">

                {/* Título del nivel e instrucciones */}
                <div
                    className="self-start flex flex-col gap-1 mb-1 mt-2 mx-2"
                    style={{ fontFamily: 'var(--font-mono)', letterSpacing: '.14em' }}
                >
                    <div className="flex items-center gap-2 text-[11px] text-(--green-base)">
                        <span className='text-(--green-light) text-sm' style={{ textShadow: '0 0 10px var(--green-base)' }}>{'>'} {level.title?.toUpperCase()}</span>
                        {level.concept && (
                            <span className='text-(--text-ghost) text-sm' >
                                [{level.concept}]
                            </span>
                        )}
                    </div>
                    {level.description && (
                        <div className='text-(--text-muted) text-sm' style={{ letterSpacing: '.05em', maxWidth: '85%', lineHeight: '1.5', marginTop: '4px' }}>
                            {'//'} {level.description}
                        </div>
                    )}
                </div>

                {/* Canvas isométrico */}
                <div
                    className="relative"
                    style={{
                        border: `2px solid ${status === 'success' ? 'var(--green-base)' : status === 'failed' ? 'var(--red-dark)' : 'var(--bg-hover)'}`,
                        borderRadius: '5px',
                        overflow: 'hidden',
                        transition: 'border-color .4s, box-shadow .4s',
                        boxShadow: status === 'success'
                            ? '0 0 30px rgba(85,226,0,0.15), inset 0 0 20px rgba(85,226,0,0.05)'
                            : status === 'failed'
                                ? '0 0 20px rgba(226,75,74,0.2)'
                                : '0 0 20px rgba(85,226,0,0.03)',
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        style={{
                            display: 'block',
                            maxWidth: '100%',
                            maxHeight: '55vh',
                            objectFit: 'contain',
                        }}
                    />
                </div>

                {/* Estado */}
                <div
                    className="h-5 flex items-center text-xs font-mono tracking-widest"
                >
                    {status === 'failed' && (
                        <span className='text-(--red)' >
                            ✗ ERROR — el robot no pudo completar la secuencia
                        </span>
                    )}
                    {status === 'success' && (
                        <span className='text-(--green-light)' >
                            ✓ OBJETIVO ALCANZADO
                        </span>
                    )}
                    {status === 'idle' && !isRunning && commands.length === 0 && (
                        <span className='flex items-center gap-1 text-(--text-muted) text-xs'>
                            agrega comandos para guiar al robot <ChevronsRightIcon size={13} className='animate-arrow-right' />
                        </span>
                    )}
                </div>
            </div>

            {/* ===== PANEL DERECHO — Comandos ===== */}
            <div className="w-[300px] shrink-0 flex flex-col overflow-y-auto bg-(--bg-surface) border-l border-(--bg-hover) p-5 gap-4">

                {/* Paleta de comandos */}
                <div>
                    <div className="font-mono text-[12px] text-(--green-base) tracking-[.12em] mb-2 uppercase">
                        {'// comandos'}
                    </div>
                    <div className="grid grid-cols-2 gap-[6px]">
                        {allowedTools.map(cmd => (
                            <GameButton
                                key={cmd.type}
                                variant="command"
                                icon={<span className="text-[14px]"><cmd.icon size={14} /></span>}
                                onClick={() => handleDragFromPalette(cmd.type)}
                                disabled={
                                    isRunning ||
                                    (activePanel === 'main' && commands.length >= (mapData.uiLimitMain || MAX_COMMANDS)) ||
                                    (activePanel === 'f1' && commandsF1.length >= (mapData.uiLimitF1 || 8))
                                }
                                accentColor={cmd.cssColor}
                            >
                                {cmd.label}
                            </GameButton>
                        ))}
                    </div>
                </div>

                {/* Separador */}
                <div className="separator-glow" />

                {/* Secuencia de comandos - PRINCIPAL */}
                <div className="flex-1 flex flex-col cursor-pointer" onClick={() => !isRunning && setActivePanel('main')}>
                    <div className="flex justify-between items-center mb-2">
                        <div className={`font-mono text-[11px] tracking-[.12em] uppercase transition-colors ${activePanel === 'main' ? 'text-(--green-base)' : 'text-(--text-ghost)'}`}>
                            {'// secuencia principal'} ({commands.length}/{mapData.uiLimitMain || MAX_COMMANDS})
                        </div>
                        {commands.length > 0 && !isRunning && activePanel === 'main' && (
                            <ButtonOption
                                text="limpiar"
                                color="red"
                                onClick={() => setCommands([])}
                            />
                        )}
                    </div>

                    <div className={`flex flex-wrap gap-[6px] min-h-[80px] bg-(--bg-deep) rounded-[2px] p-3 border transition-colors content-start ${activePanel === 'main' ? 'border-(--green-base)' : 'border-(--bg-hover)'}`}>
                        {commands.length === 0 && (
                            <div className="font-mono text-[10px] text-(--text-ghost) w-full text-center py-4 flex flex-col items-center gap-1 tracking-wider uppercase">
                                <span className="text-base opacity-60"><PackageOpen absoluteStrokeWidth /></span>
                                <span className="text-xs opacity-100 ">vacío</span>
                            </div>
                        )}
                        {commands.map((cmd, idx) => {
                            const palette = PALETTE_COMMANDS.find(p => p.type === cmd.type)
                            const isExec = executingIdx?.panel === 'main' && executingIdx.idx === idx
                            const IconComp = palette?.icon
                            return (
                                <GameButton
                                    key={idx}
                                    variant="command"
                                    active={isExec}
                                    icon={<span className="text-[13px]">{IconComp && <IconComp size={13} />}</span>}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (!isRunning && activePanel === 'main') handleRemoveCommand(idx)
                                    }}
                                    disabled={isRunning}
                                    accentColor={palette?.cssColor}
                                    className="px-2 py-[5px] text-[10px]"
                                >
                                    {cmd.type === 'repeat' && cmd.times ? `×${cmd.times}` : ''}
                                </GameButton>
                            )
                        })}
                    </div>
                </div>

                {/* Secuencia de comandos - F1 (Si está activado) */}
                {mapData.allowF1 && (
                    <div className="flex-1 flex flex-col cursor-pointer mt-2" onClick={() => !isRunning && setActivePanel('f1')}>
                        <div className="flex justify-between items-center mb-2">
                            <div className={`font-mono text-[12px] tracking-[.12em] uppercase transition-colors ${activePanel === 'f1' ? 'text-(--cyan)' : 'text-(--text-ghost)'}`}>
                                {'// función f1'} ({commandsF1.length}/{mapData.uiLimitF1 || 8})
                            </div>
                            {commandsF1.length > 0 && !isRunning && activePanel === 'f1' && (
                                <ButtonOption
                                    text="limpiar"
                                    color="red"
                                    onClick={() => setCommandsF1([])}
                                />
                            )}
                        </div>

                        <div className={`flex flex-wrap gap-[6px] min-h-[60px] bg-(--bg-deep) rounded-[2px] p-3 border transition-colors content-start ${activePanel === 'f1' ? 'border-(--cyan)' : 'border-(--bg-hover)'}`}>
                            {commandsF1.length === 0 && (
                                <div className="font-mono text-[10px] text-(--text-ghost) w-full text-center py-2 flex flex-col items-center tracking-wider uppercase">
                                    <span>vacío</span>
                                </div>
                            )}
                            {commandsF1.map((cmd, idx) => {
                                const palette = PALETTE_COMMANDS.find(p => p.type === cmd.type)
                                const isExec = executingIdx?.panel === 'f1' && executingIdx.idx === idx
                                const IconComp = palette?.icon
                                return (
                                    <GameButton
                                        key={`f1-${idx}`}
                                        variant="command"
                                        active={isExec}
                                        icon={<span className="text-[13px]">{IconComp && <IconComp size={13} />}</span>}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (!isRunning && activePanel === 'f1') handleRemoveCommand(idx)
                                        }}
                                        disabled={isRunning}
                                        accentColor={palette?.cssColor}
                                        className="px-2 py-[5px] text-[10px]"
                                    >
                                        {cmd.type === 'repeat' && cmd.times ? `×${cmd.times}` : ''}
                                    </GameButton>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Separador */}
                <div className="separator-glow" />

                {/* Botones de control */}
                <div className="flex flex-col gap-2">
                    <Button
                        variant="solid"
                        size="sm"
                        onClick={executeCommands}
                        disabled={isRunning || commands.length === 0}
                        className="w-full"
                        icon={isRunning ? StepForward : PlayIcon}
                        iconPosition="left"
                    >
                        {isRunning ? 'Ejecutando...' : 'ejecutar'}
                    </Button>

                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={handleReset}
                        disabled={isRunning}
                        className="w-full"
                        icon={RotateCcwIcon}
                        iconPosition="left"
                    >
                        reiniciar
                    </Button>
                </div>

                {/* Info de estrellas */}
                {mapData.maxCommands && (
                    <div className="font-mono text-[10px] text-(--text-ghost) border-t border-(--bg-hover) pt-3 leading-[1.8]">
                        <span className="text-(--amber)">★★★</span> ≤ {mapData.maxCommands + (mapData.maxF1Commands || 0)} comandos<br />
                        <span className="text-(--amber)">★★</span>☆ ≤ {mapData.maxCommands + (mapData.maxF1Commands || 0) + 2} comandos<br />
                        <span className="text-(--amber)">★</span>☆☆ cualquier solución
                    </div>
                )}
            </div>

            {/* ===== MODAL REPETIR ===== */}
            {repeatModalOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ background: 'rgba(1,1,1,.85)', backdropFilter: 'blur(4px)' }}
                >
                    <div className="bg-(--bg-surface) border border-(--green-base) rounded-[2px] p-7 font-mono flex flex-col gap-5 min-w-[260px] shadow-[0_0_40px_rgba(85,226,0,0.1)]">
                        <div className="text-(--green-light) text-xs tracking-[.12em] uppercase">
                            {'// repetir N veces'}
                        </div>
                        <div className="flex items-center justify-center gap-4">
                            <GameButton
                                variant="command"
                                onClick={() => setRepeatTimes(t => Math.max(2, t - 1))}
                                className="text-base px-4"
                            >
                                −
                            </GameButton>
                            <span className="text-(--green-light) text-2xl min-w-[2ch] text-center font-mono">
                                {repeatTimes}
                            </span>
                            <GameButton
                                variant="command"
                                onClick={() => setRepeatTimes(t => Math.min(10, t + 1))}
                                className="text-base px-4"
                            >
                                +
                            </GameButton>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="solid"
                                size="xs"
                                onClick={handleAddRepeat}
                                className="flex-1"
                            >
                                agregar
                            </Button>
                            <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => setRepeatModal(false)}
                                className="flex-1"
                            >
                                cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}