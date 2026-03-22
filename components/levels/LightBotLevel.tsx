// ============================================================
// REBOOT — components/levels/LightbotLevel.tsx
// Nivel tipo Lightbot: arrastra comandos, el robot los ejecuta
// Usa Phaser.js para el mapa isométrico (ssr: false siempre)
// ============================================================

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { Level, LevelState, Command, CommandType, LightbotLevelData, RobotState, Direction } from '@/types/game'

// ------------------------------------------------------------
// TIPOS INTERNOS
// ------------------------------------------------------------

interface LightbotLevelProps {
    level: Level
    state: LevelState
    onComplete: (stars: 0 | 1 | 2 | 3, usedFrag: boolean) => void
    onFragUse: () => void
}

interface DragState {
    dragging: boolean
    commandType: CommandType | null
    fromIndex: number | null  // null = viene de la paleta
}

// ------------------------------------------------------------
// COMANDOS DISPONIBLES EN LA PALETA
// ------------------------------------------------------------

const PALETTE_COMMANDS: { type: CommandType; label: string; icon: string; color: string }[] = [
    { type: 'move', label: 'avanzar', icon: '↑', color: '#55e200' },
    { type: 'turn-left', label: 'girar ←', icon: '↰', color: '#55e200' },
    { type: 'turn-right', label: 'girar →', icon: '↱', color: '#55e200' },
    { type: 'jump', label: 'saltar', icon: '⤴', color: '#88c44d' },
    { type: 'activate', label: 'activar', icon: '⚡', color: '#EF9F27' },
    { type: 'repeat', label: 'repetir', icon: '↻', color: '#7F77DD' },
]

// Máximo de comandos en la secuencia
const MAX_COMMANDS = 20

// Velocidad de ejecución en ms por paso
const EXEC_SPEED = 500

// ------------------------------------------------------------
// DATOS DE NIVELES LIGHTBOT
// Aquí defines el mapa y posición inicial de cada nivel
// ------------------------------------------------------------

const LIGHTBOT_MAPS: Record<string, LightbotLevelData> = {
    '1-01': {
        map: [
            [{ type: 'wall', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'floor', x: 2, y: 0 }, { type: 'wall', x: 3, y: 0 }, { type: 'wall', x: 4, y: 0 }],
            [{ type: 'floor', x: 0, y: 1 }, { type: 'floor', x: 1, y: 1 }, { type: 'floor', x: 2, y: 1 }, { type: 'floor', x: 3, y: 1 }, { type: 'wall', x: 4, y: 1 }],
            [{ type: 'floor', x: 0, y: 2 }, { type: 'floor', x: 1, y: 2 }, { type: 'floor', x: 2, y: 2 }, { type: 'floor', x: 3, y: 2 }, { type: 'floor', x: 4, y: 2 }],
            [{ type: 'wall', x: 0, y: 3 }, { type: 'floor', x: 1, y: 3 }, { type: 'floor', x: 2, y: 3 }, { type: 'target', x: 3, y: 3 }, { type: 'wall', x: 4, y: 3 }],
            [{ type: 'wall', x: 0, y: 4 }, { type: 'wall', x: 1, y: 4 }, { type: 'floor', x: 2, y: 4 }, { type: 'floor', x: 3, y: 4 }, { type: 'wall', x: 4, y: 4 }],
        ],
        robotStart: { x: 1, y: 1, direction: 'south' },
        targets: [{ x: 3, y: 3 }],
        maxCommands: 6,
    },
    '1-02': {
        map: [
            [{ type: 'floor', x: 0, y: 0 }, { type: 'floor', x: 1, y: 0 }, { type: 'floor', x: 2, y: 0 }, { type: 'floor', x: 3, y: 0 }, { type: 'floor', x: 4, y: 0 }],
            [{ type: 'wall', x: 0, y: 1 }, { type: 'floor', x: 1, y: 1 }, { type: 'floor', x: 2, y: 1 }, { type: 'floor', x: 3, y: 1 }, { type: 'wall', x: 4, y: 1 }],
            [{ type: 'wall', x: 0, y: 2 }, { type: 'floor', x: 1, y: 2 }, { type: 'floor', x: 2, y: 2 }, { type: 'floor', x: 3, y: 2 }, { type: 'wall', x: 4, y: 2 }],
            [{ type: 'wall', x: 0, y: 3 }, { type: 'floor', x: 1, y: 3 }, { type: 'floor', x: 2, y: 3 }, { type: 'floor', x: 3, y: 3 }, { type: 'wall', x: 4, y: 3 }],
            [{ type: 'wall', x: 0, y: 4 }, { type: 'floor', x: 1, y: 4 }, { type: 'floor', x: 2, y: 4 }, { type: 'target', x: 3, y: 4 }, { type: 'wall', x: 4, y: 4 }],
        ],
        robotStart: { x: 1, y: 0, direction: 'south' },
        targets: [{ x: 3, y: 4 }],
        maxCommands: 5,
    },
    '1-04': {
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
    },
    '1-05': {
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
    },
}

// Fallback para niveles sin mapa definido aún
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

// ------------------------------------------------------------
// MOTOR DE EJECUCIÓN (sin Phaser — lógica pura)
// ------------------------------------------------------------

function getNextPosition(
    robot: RobotState,
    mapData: LightbotLevelData
): { x: number; y: number } | null {
    const { x, y, direction } = robot
    const deltas: Record<Direction, { dx: number; dy: number }> = {
        north: { dx: 0, dy: -1 },
        south: { dx: 0, dy: 1 },
        east: { dx: 1, dy: 0 },
        west: { dx: -1, dy: 0 },
    }
    const { dx, dy } = deltas[direction]
    const nx = x + dx
    const ny = y + dy
    const row = mapData.map[ny]
    if (!row) return null
    const tile = row[nx]
    if (!tile || tile.type === 'wall') return null
    return { x: nx, y: ny }
}

function turnLeft(dir: Direction): Direction {
    const turns: Record<Direction, Direction> = {
        north: 'west', west: 'south', south: 'east', east: 'north',
    }
    return turns[dir]
}

function turnRight(dir: Direction): Direction {
    const turns: Record<Direction, Direction> = {
        north: 'east', east: 'south', south: 'west', west: 'north',
    }
    return turns[dir]
}

function flattenCommands(commands: Command[]): Command[] {
    const flat: Command[] = []
    for (const cmd of commands) {
        if (cmd.type === 'repeat' && cmd.times && cmd.children) {
            for (let i = 0; i < cmd.times; i++) {
                flat.push(...flattenCommands(cmd.children))
            }
        } else {
            flat.push(cmd)
        }
    }
    return flat
}

// ------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------

export default function LightbotLevel({
    level,
    state,
    onComplete,
    onFragUse,
}: LightbotLevelProps) {
    const mapData = LIGHTBOT_MAPS[level.id] ?? DEFAULT_MAP
    const phaserRef = useRef<HTMLDivElement>(null)
    const gameRef = useRef<unknown>(null)

    const [commands, setCommands] = useState<Command[]>([])
    const [robot, setRobot] = useState<RobotState>({ ...mapData.robotStart, isMoving: false })
    const [activatedTiles, setActivated] = useState<Set<string>>(new Set())
    const [isRunning, setIsRunning] = useState(false)
    const [executingIdx, setExecutingIdx] = useState<number>(-1)
    const [status, setStatus] = useState<'idle' | 'success' | 'failed'>('idle')
    const [repeatModalOpen, setRepeatModal] = useState(false)
    const [repeatTimes, setRepeatTimes] = useState(2)
    const [dragState, setDragState] = useState<DragState>({ dragging: false, commandType: null, fromIndex: null })

    // ------------------------------------------------------------
    // INICIALIZAR PHASER
    // ------------------------------------------------------------

    useEffect(() => {
        let game: unknown = null

        async function initPhaser() {
            const Phaser = (await import('phaser')).default

            const TILE = 56
            const cols = mapData.map[0].length
            const rows = mapData.map.length

            class GameScene extends Phaser.Scene {
                robotSprite!: Phaser.GameObjects.Rectangle
                tileSprites: Map<string, Phaser.GameObjects.Rectangle> = new Map()

                constructor() { super({ key: 'GameScene' }) }

                create() {
                    const colors: Record<string, number> = {
                        floor: 0x161B22,
                        wall: 0x060809,
                        target: 0x1a4d00,
                        active: 0x0F6E56,
                        broken: 0x1a1020,
                        generator: 0x412402,
                        empty: 0x010101,
                    }

                    // dibujar tiles
                    mapData.map.forEach((row, ry) => {
                        row.forEach((tile, rx) => {
                            const px = rx * TILE + TILE / 2
                            const py = ry * TILE + TILE / 2
                            const rect = this.add.rectangle(px, py, TILE - 2, TILE - 2, colors[tile.type] ?? 0x161B22)
                            rect.setStrokeStyle(0.5, 0x0d1f00)
                            this.tileSprites.set(`${rx},${ry}`, rect)

                            // ícono de target
                            if (tile.type === 'target') {
                                this.add.rectangle(px, py, 12, 12, 0x55e200)
                            }
                            // ícono de generator
                            if (tile.type === 'generator') {
                                this.add.rectangle(px, py, 10, 10, 0xEF9F27)
                            }
                            // ícono de broken
                            if (tile.type === 'broken') {
                                this.add.text(px - 6, py - 8, '✗', {
                                    fontSize: '12px',
                                    color: '#534AB7',
                                })
                            }
                        })
                    })

                    // robot
                    const rx = mapData.robotStart.x * TILE + TILE / 2
                    const ry = mapData.robotStart.y * TILE + TILE / 2
                    this.robotSprite = this.add.rectangle(rx, ry, TILE - 10, TILE - 10, 0x55e200)
                    this.robotSprite.setStrokeStyle(1, 0x88c44d)

                    // dirección del robot
                    this.drawDirectionArrow(rx, ry, mapData.robotStart.direction)
                }

                drawDirectionArrow(x: number, y: number, dir: Direction) {
                    const offsets: Record<Direction, { dx: number; dy: number }> = {
                        north: { dx: 0, dy: -14 },
                        south: { dx: 0, dy: 14 },
                        east: { dx: 14, dy: 0 },
                        west: { dx: -14, dy: 0 },
                    }
                    const { dx, dy } = offsets[dir]
                    this.add.rectangle(x + dx, y + dy, 6, 6, 0x88c44d)
                }

                moveRobotTo(x: number, y: number, dir: Direction) {
                    const px = x * TILE + TILE / 2
                    const py = y * TILE + TILE / 2
                    this.tweens.add({
                        targets: this.robotSprite,
                        x: px,
                        y: py,
                        duration: EXEC_SPEED * 0.8,
                        ease: 'Power2',
                    })
                }

                activateTile(x: number, y: number) {
                    const tile = this.tileSprites.get(`${x},${y}`)
                    if (tile) {
                        this.tweens.add({
                            targets: tile,
                            fillColor: 0x55e200,
                            duration: 200,
                        })
                    }
                }

                flashError() {
                    this.cameras.main.flash(300, 255, 50, 50)
                }

                flashSuccess() {
                    this.cameras.main.flash(500, 85, 226, 0)
                }
            }

            const config: Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                width: cols * TILE,
                height: rows * TILE,
                backgroundColor: '#010101',
                parent: phaserRef.current ?? undefined,
                scene: GameScene,
                audio: { noAudio: true },
            }

            game = new Phaser.Game(config)
            gameRef.current = game
        }

        initPhaser()
        return () => {
            if (game && typeof (game as { destroy?: (b: boolean) => void }).destroy === 'function') {
                (game as { destroy: (b: boolean) => void }).destroy(true)
            }
        }
    }, [level.id])

    // ------------------------------------------------------------
    // EJECUTAR SECUENCIA
    // ------------------------------------------------------------

    const executeCommands = useCallback(async () => {
        if (isRunning || commands.length === 0) return
        setIsRunning(true)
        setStatus('idle')

        const flat = flattenCommands(commands)
        let currentRobot: RobotState = { ...mapData.robotStart, isMoving: false }
        const activated = new Set<string>()
        const scene = (gameRef.current as { scene?: { getScene: (k: string) => unknown } })
            ?.scene?.getScene('GameScene') as {
                moveRobotTo: (x: number, y: number, d: Direction) => void
                activateTile: (x: number, y: number) => void
                flashError: () => void
                flashSuccess: () => void
            } | null

        for (let i = 0; i < flat.length; i++) {
            setExecutingIdx(i)
            const cmd = flat[i]
            await sleep(EXEC_SPEED)

            if (cmd.type === 'move') {
                const next = getNextPosition(currentRobot, mapData)
                if (!next) {
                    scene?.flashError()
                    setStatus('failed')
                    setIsRunning(false)
                    setExecutingIdx(-1)
                    return
                }
                currentRobot = { ...currentRobot, ...next, isMoving: true }
                scene?.moveRobotTo(currentRobot.x, currentRobot.y, currentRobot.direction)
                setRobot({ ...currentRobot })
            } else if (cmd.type === 'turn-left') {
                currentRobot = { ...currentRobot, direction: turnLeft(currentRobot.direction) }
                setRobot({ ...currentRobot })
            } else if (cmd.type === 'turn-right') {
                currentRobot = { ...currentRobot, direction: turnRight(currentRobot.direction) }
                setRobot({ ...currentRobot })
            } else if (cmd.type === 'activate') {
                const key = `${currentRobot.x},${currentRobot.y}`
                activated.add(key)
                scene?.activateTile(currentRobot.x, currentRobot.y)
                setActivated(new Set(activated))
            }
        }

        setExecutingIdx(-1)

        // verificar victoria
        const allTargetsReached = mapData.targets.every(
            t => currentRobot.x === t.x && currentRobot.y === t.y
        )

        if (allTargetsReached) {
            scene?.flashSuccess()
            setStatus('success')
            await sleep(600)
            const stars = calcStars(commands.length, mapData.maxCommands)
            onComplete(stars, state.fragUsed)
        } else {
            scene?.flashError()
            setStatus('failed')
        }

        setIsRunning(false)
    }, [commands, isRunning, mapData, state.fragUsed, onComplete])

    function calcStars(used: number, max?: number): 1 | 2 | 3 {
        if (!max) return 2
        const ratio = used / max
        if (ratio <= 0.6) return 3
        if (ratio <= 0.9) return 2
        return 1
    }

    // ------------------------------------------------------------
    // RESET
    // ------------------------------------------------------------

    function handleReset() {
        setRobot({ ...mapData.robotStart, isMoving: false })
        setActivated(new Set())
        setIsRunning(false)
        setExecutingIdx(-1)
        setStatus('idle')
        const scene = (gameRef.current as { scene?: { getScene: (k: string) => unknown } })
            ?.scene?.getScene('GameScene') as { moveRobotTo?: (x: number, y: number, d: Direction) => void } | null
        scene?.moveRobotTo?.(mapData.robotStart.x, mapData.robotStart.y, mapData.robotStart.direction)
    }

    // ------------------------------------------------------------
    // DRAG & DROP DE COMANDOS
    // ------------------------------------------------------------

    function handleDragFromPalette(type: CommandType) {
        if (type === 'repeat') {
            setRepeatModal(true)
            return
        }
        if (commands.length >= MAX_COMMANDS) return
        setCommands(prev => [...prev, { type }])
    }

    function handleRemoveCommand(idx: number) {
        setCommands(prev => prev.filter((_, i) => i !== idx))
    }

    function handleAddRepeat() {
        if (commands.length >= MAX_COMMANDS) return
        setCommands(prev => [...prev, {
            type: 'repeat',
            times: repeatTimes,
            children: [],
        }])
        setRepeatModal(false)
    }

    // ------------------------------------------------------------
    // RENDER
    // ------------------------------------------------------------

    return (
        <div style={{
            display: 'flex',
            flex: 1,
            background: 'var(--bg-void)',
            gap: 0,
            flexWrap: 'wrap',
        }}>

            {/* Panel izquierdo — mapa Phaser */}
            <div style={{
                flex: '1 1 320px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                gap: '1rem',
            }}>
                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--green-base)',
                    letterSpacing: '.12em',
                    alignSelf: 'flex-start',
                }}>
          // {level.title}
                </div>

                {/* Canvas de Phaser */}
                <div
                    ref={phaserRef}
                    style={{
                        border: `1px solid ${status === 'success' ? 'var(--green-base)' : status === 'failed' ? 'var(--red)' : 'var(--bg-hover)'}`,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        transition: 'border-color .3s',
                    }}
                />

                {/* Estado */}
                {status === 'failed' && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--red)', letterSpacing: '.1em' }}>
                        ERROR — el robot no pudo completar la secuencia
                    </div>
                )}
                {status === 'success' && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--green-light)', letterSpacing: '.1em' }}>
                        OBJETIVO ALCANZADO ✓
                    </div>
                )}
            </div>

            {/* Panel derecho — comandos */}
            <div style={{
                flex: '0 0 280px',
                background: 'var(--bg-surface)',
                borderLeft: '1px solid var(--bg-hover)',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.25rem',
                gap: '1rem',
            }}>

                {/* Paleta de comandos */}
                <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--green-base)', letterSpacing: '.12em', marginBottom: '.5rem' }}>
            // comandos disponibles
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.375rem' }}>
                        {PALETTE_COMMANDS.map(cmd => (
                            <button
                                key={cmd.type}
                                onClick={() => handleDragFromPalette(cmd.type)}
                                disabled={isRunning || commands.length >= MAX_COMMANDS}
                                style={{
                                    background: 'var(--bg-elevated)',
                                    border: '1px solid var(--bg-hover)',
                                    borderRadius: '6px',
                                    padding: '7px 10px',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '11px',
                                    color: cmd.color,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    letterSpacing: '.06em',
                                    opacity: isRunning ? 0.5 : 1,
                                    transition: 'border-color .15s',
                                }}
                                onMouseEnter={e => !isRunning && (e.currentTarget.style.borderColor = 'var(--green-base)')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--bg-hover)')}
                            >
                                <span style={{ fontSize: '14px' }}>{cmd.icon}</span>
                                {cmd.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Secuencia de comandos */}
                <div style={{ flex: 1 }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '.5rem',
                    }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--green-base)', letterSpacing: '.12em' }}>
              // secuencia ({commands.length}/{MAX_COMMANDS})
                        </div>
                        {commands.length > 0 && !isRunning && (
                            <button
                                onClick={() => setCommands([])}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-ghost)',
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '10px',
                                    cursor: 'pointer',
                                }}
                            >
                                limpiar
                            </button>
                        )}
                    </div>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '.375rem',
                        minHeight: '80px',
                        background: 'var(--bg-elevated)',
                        borderRadius: '6px',
                        padding: '.5rem',
                        border: '1px solid var(--bg-hover)',
                    }}>
                        {commands.length === 0 && (
                            <div style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                color: 'var(--text-ghost)',
                                width: '100%',
                                textAlign: 'center',
                                padding: '1rem 0',
                            }}>
                                agrega comandos arriba
                            </div>
                        )}
                        {commands.map((cmd, idx) => {
                            const palette = PALETTE_COMMANDS.find(p => p.type === cmd.type)
                            const isExec = idx === executingIdx
                            return (
                                <div
                                    key={idx}
                                    onClick={() => !isRunning && handleRemoveCommand(idx)}
                                    style={{
                                        background: isExec ? 'var(--green-dark)' : 'var(--bg-surface)',
                                        border: `1px solid ${isExec ? 'var(--green-light)' : 'var(--bg-hover)'}`,
                                        borderRadius: '5px',
                                        padding: '4px 8px',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '11px',
                                        color: palette?.color ?? 'var(--green-muted)',
                                        cursor: isRunning ? 'default' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        transition: 'all .15s',
                                    }}
                                    title="clic para eliminar"
                                >
                                    <span>{palette?.icon}</span>
                                    {cmd.type === 'repeat' && cmd.times && (
                                        <span style={{ fontSize: '10px', opacity: .7 }}>×{cmd.times}</span>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Botones de control */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                    <button
                        onClick={executeCommands}
                        disabled={isRunning || commands.length === 0}
                        style={{
                            background: 'var(--green-dark)',
                            border: '1px solid var(--green-base)',
                            borderRadius: '7px',
                            padding: '11px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '12px',
                            color: 'var(--green-light)',
                            cursor: commands.length === 0 || isRunning ? 'not-allowed' : 'pointer',
                            letterSpacing: '.1em',
                            opacity: commands.length === 0 || isRunning ? 0.4 : 1,
                            transition: 'all .15s',
                        }}
                    >
                        {isRunning ? '▶ ejecutando...' : '▶ ejecutar'}
                    </button>

                    <button
                        onClick={handleReset}
                        disabled={isRunning}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--bg-hover)',
                            borderRadius: '7px',
                            padding: '9px',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            cursor: isRunning ? 'not-allowed' : 'pointer',
                            letterSpacing: '.1em',
                            opacity: isRunning ? 0.4 : 1,
                        }}
                    >
                        ↺ reiniciar
                    </button>
                </div>

                {/* Info de estrellas */}
                {mapData.maxCommands && (
                    <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'var(--text-ghost)',
                        borderTop: '1px solid var(--bg-hover)',
                        paddingTop: '.75rem',
                        lineHeight: 1.8,
                    }}>
                        ★★★ ≤ {Math.floor(mapData.maxCommands * 0.6)} comandos<br />
                        ★★☆ ≤ {Math.floor(mapData.maxCommands * 0.9)} comandos<br />
                        ★☆☆ cualquier solución
                    </div>
                )}
            </div>

            {/* Modal de REPETIR */}
            {repeatModalOpen && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(1,1,1,.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 100,
                }}>
                    <div style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--green-base)',
                        borderRadius: '10px',
                        padding: '1.5rem',
                        fontFamily: 'var(--font-mono)',
                        display: 'flex', flexDirection: 'column', gap: '1rem',
                        minWidth: '240px',
                    }}>
                        <div style={{ color: 'var(--green-light)', fontSize: '12px', letterSpacing: '.1em' }}>
              // repetir N veces
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
                            <button onClick={() => setRepeatTimes(t => Math.max(2, t - 1))}
                                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-hover)', borderRadius: '5px', padding: '5px 12px', color: 'var(--green-light)', fontFamily: 'var(--font-mono)', cursor: 'pointer', fontSize: '14px' }}>
                                −
                            </button>
                            <span style={{ color: 'var(--green-light)', fontSize: '20px', minWidth: '2ch', textAlign: 'center' }}>{repeatTimes}</span>
                            <button onClick={() => setRepeatTimes(t => Math.min(10, t + 1))}
                                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--bg-hover)', borderRadius: '5px', padding: '5px 12px', color: 'var(--green-light)', fontFamily: 'var(--font-mono)', cursor: 'pointer', fontSize: '14px' }}>
                                +
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: '.5rem' }}>
                            <button onClick={handleAddRepeat}
                                style={{ flex: 1, background: 'var(--green-dark)', border: '1px solid var(--green-base)', borderRadius: '6px', padding: '8px', color: 'var(--green-light)', fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer', letterSpacing: '.08em' }}>
                                agregar
                            </button>
                            <button onClick={() => setRepeatModal(false)}
                                style={{ flex: 1, background: 'transparent', border: '1px solid var(--bg-hover)', borderRadius: '6px', padding: '8px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px', cursor: 'pointer' }}>
                                cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// ------------------------------------------------------------
// HELPER
// ------------------------------------------------------------

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
}