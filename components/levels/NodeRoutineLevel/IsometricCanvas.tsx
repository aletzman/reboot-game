'use client'

import { useEffect, useRef } from 'react'
import { ExtendedRobotState } from './types'
import { ISO, TILE_COLORS } from './constants'
import { toIso } from './utils'
import { NodeRoutineLevelData, LevelState } from '@/types/game'

// --- Assets ---
const robotSprite = typeof window !== 'undefined' ? new Image() : null
if (robotSprite) robotSprite.src = '/game/robot_spritesheet.png'

const floorSprite = typeof window !== 'undefined' ? new Image() : null
if (floorSprite) floorSprite.src = '/assets/sample_floor.svg'

const activeSprite = typeof window !== 'undefined' ? new Image() : null
if (activeSprite) activeSprite.src = '/assets/sample_active.svg'

const wallSprite = typeof window !== 'undefined' ? new Image() : null
if (wallSprite) wallSprite.src = '/assets/sample_wall.svg'

const brokenSprite = typeof window !== 'undefined' ? new Image() : null
if (brokenSprite) brokenSprite.src = '/assets/sample_broken.svg'

const genSprite = typeof window !== 'undefined' ? new Image() : null
if (genSprite) genSprite.src = '/assets/sample_generator.svg'

const genActiveSprite = typeof window !== 'undefined' ? new Image() : null
if (genActiveSprite) genActiveSprite.src = '/assets/sample_generator_active.svg'

// --- Drawing functions ---

function drawIsoDiamond(
    ctx: CanvasRenderingContext2D,
    cx: number, cy: number,
    colors: { top: string; left: string; right: string; glow?: string },
    isHighlighted: boolean,
    highlightColor?: string,
    showTop: boolean = true
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

    if (showTop) {
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

    // Borde lateral central (unión de caras)
    ctx.beginPath()
    ctx.moveTo(cx, cy + hh)
    ctx.lineTo(cx, cy + hh + d)
    ctx.strokeStyle = '#0d1f0030'
    ctx.lineWidth = 0.5
    ctx.stroke()

    // Borde inferior del cubo
    ctx.beginPath()
    ctx.moveTo(cx - hw, cy + d)
    ctx.lineTo(cx, cy + hh + d)
    ctx.lineTo(cx + hw, cy + d)
    ctx.strokeStyle = '#0d1f0030'
    ctx.lineWidth = 0.5
    ctx.stroke()
}

function drawRobot(
    ctx: CanvasRenderingContext2D,
    robot: ExtendedRobotState,
    cx: number, cy: number,
    pulse: number
) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const flicker = Math.random() * 0.05;
    const breathingOffset = pulse * 2;
    const startY = cy - 8 - breathingOffset;
    const baseAlpha = 0.05 + (pulse * 0.05) + flicker;

    // 1. Elipse Superior
    ctx.lineWidth = 1.2 + flicker;
    ctx.beginPath();
    ctx.ellipse(cx, startY - 2, 10 + flicker * 2, 6 + pulse * 1, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 255, 255, ${baseAlpha})`;
    ctx.stroke();

    // 2. Elipse Central
    ctx.beginPath();
    ctx.ellipse(cx, startY + 3, 7 + flicker * 1.5, 4 + pulse * 0.5, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 255, 255, ${baseAlpha})`;
    ctx.stroke();

    // 3. Elipse Inferior
    ctx.beginPath();
    ctx.ellipse(cx, startY + 9, 4 + flicker * 1, 2 + pulse * 0.2, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 255, 255, ${baseAlpha})`;
    ctx.stroke();

    ctx.restore();

    if (robotSprite && robotSprite.complete) {
        const spriteWidth = 64;
        const spriteHeight = 64;

        let frameX = 0;
        if (robot.direction === 'north') frameX = 0;
        if (robot.direction === 'east') frameX = 64;
        if (robot.direction === 'south') frameX = 128;
        if (robot.direction === 'west') frameX = 192;

        let frameY = 0;
        if (robot.isJumping) frameY = 64;
        else if (robot.isActivating) frameY = 128;

        const breathingOff = pulse * 2;

        ctx.drawImage(
            robotSprite,
            frameX, frameY,
            spriteWidth, spriteHeight,
            cx - (spriteWidth / 2),
            cy - spriteHeight - breathingOff + 8,
            spriteWidth, spriteHeight
        );
    }
}

function drawTargetMarker(ctx: CanvasRenderingContext2D, cx: number, cy: number, pulse: number) {
    const r = 7 + pulse * 2
    ctx.beginPath()
    ctx.ellipse(cx, cy, r * 1.75, r, 0, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(18, 176, 187, ${0.4 + pulse * 0.3})`
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.beginPath()
    ctx.ellipse(cx, cy, 5, 3, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#12b0bb99'
    ctx.fill()

    ctx.beginPath()
    ctx.ellipse(cx, cy, 21, 12, 0, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(18, 176, 187, ${0.06 + pulse * 0.04})`
    ctx.fill()
}

function drawGeneratorIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, activated: boolean) {
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

interface IsometricCanvasProps {
    mapData: NodeRoutineLevelData
    robot: ExtendedRobotState
    activatedTiles: Set<string>
    status: LevelState['status']
    isScanning?: boolean
}

export function IsometricCanvas({ mapData, robot, activatedTiles, status, isScanning }: IsometricCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animRef = useRef<number>(0)
    const visX = useRef(robot.x)
    const visY = useRef(robot.y)

    // Partículas de "Polvo Digital"
    const particles = useRef<{ x: number, y: number, s: number, vx: number, vy: number }[]>([])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d', { alpha: false }) // Optimizado para fondos opacos
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
        const mapHeightPx = (cols + rows) * (ISO.TILE_H / 2) + maxH * (ISO.DEPTH - 1)

        const canvasW = Math.max(500, mapWidthPx + 150)
        const canvasH = Math.max(500, mapHeightPx + ISO.DEPTH + 150)
        canvas.width = canvasW
        canvas.height = canvasH

        const offsetX = canvasW / 2 - ((cols - rows) * (ISO.TILE_W / 2)) / 2
        const offsetY = canvasH / 2 - mapHeightPx / 2 + (maxH * (ISO.DEPTH - 1)) / 2

        // Inicializar partículas si no existen
        if (particles.current.length === 0) {
            particles.current = Array.from({ length: 50 }).map(() => ({
                x: Math.random() * canvasW,
                y: Math.random() * canvasH,
                s: 0.5 + Math.random() * 1.5,
                vx: -0.2 + Math.random() * 0.4,
                vy: -0.5 - Math.random() * 0.5
            }))
        }

        const startTime = performance.now()
        let lastTime = startTime
        visX.current = robot.x
        visY.current = robot.y

        function render(time: number) {
            if (!ctx) return
            const elapsed = (time - startTime) / 1000
            const dt = Math.min((time - lastTime) / 1000, 0.1)
            lastTime = time
            const pulse = (Math.sin(elapsed * 2.5) + 1) / 2

            ctx.clearRect(0, 0, canvasW, canvasH)

            // Fondo con degradado profundo
            const bgGrad = ctx.createRadialGradient(canvasW / 2, canvasH / 2, 0, canvasW / 2, canvasH / 2, canvasW * 0.7)
            bgGrad.addColorStop(0, '#0a0d12')
            bgGrad.addColorStop(0.5, '#040609')
            bgGrad.addColorStop(1, '#000000')
            ctx.fillStyle = bgGrad
            ctx.fillRect(0, 0, canvasW, canvasH)

            // Dibujar Partículas (Digital Dust)
            ctx.save()
            for (let i = 0; i < particles.current.length; i++) {
                const p = particles.current[i]
                p.y += p.vy
                p.x += p.vx
                if (p.y < 0) p.y = canvasH
                if (p.x < 0) p.x = canvasW
                if (p.x > canvasW) p.x = 0

                ctx.fillStyle = status === 'failed'
                    ? `rgba(226, 75, 74, ${0.1 + Math.random() * 0.3})`
                    : `rgba(85, 226, 0, ${0.05 + Math.random() * 0.2})`
                ctx.fillRect(p.x, p.y, p.s, p.s)
            }
            ctx.restore()

            // Dibujar Grilla "Digital Echo"
            ctx.save()
            ctx.globalAlpha = 0.05 + pulse * 0.03
            ctx.strokeStyle = '#55e200'
            ctx.lineWidth = 0.5
            for (let i = 0; i <= cols; i++) {
                const start = toIso(i, 0, offsetX, offsetY)
                const end = toIso(i, rows, offsetX, offsetY)
                ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke()
            }
            for (let j = 0; j <= rows; j++) {
                const start = toIso(0, j, offsetX, offsetY)
                const end = toIso(cols, j, offsetX, offsetY)
                ctx.beginPath(); ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke()
            }
            ctx.restore()

            const lerpFactor = 12 * dt
            visX.current += (robot.x - visX.current) * lerpFactor
            visY.current += (robot.y - visY.current) * lerpFactor

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const tile = mapData.map[row][col]
                    if (!tile || tile.type === 'empty') continue

                    const { x: sx, y: sy } = toIso(col, row, offsetX, offsetY)
                    const th = tile.height || 0
                    const isRobotHere = Math.round(visX.current) === col && Math.round(visY.current) === row
                    const isActivated = activatedTiles.has(`${col},${row}`)

                    // Rellenar desde el suelo hasta la altura del tile
                    for (let h = 0; h <= th; h++) {
                        const tz = h * (ISO.DEPTH - 0.5)
                        const isTop = h === th

                        const currentType = isTop ? tile.type : (tile.type === 'wall' ? 'wall' : 'floor')
                        const colors = TILE_COLORS[currentType] ?? TILE_COLORS.floor

                        let highlight = false
                        let highlightColor: string | undefined

                        if (isTop) {
                            if (tile.type === 'target') {
                                highlight = true
                                highlightColor = status === 'success' ? '#55e200' : isScanning ? '#7F77DD' : `rgba(13, 31, 0, ${0.4 + pulse * 0.4})`

                                if (isScanning) {
                                    ctx.save()
                                    ctx.beginPath()
                                    ctx.ellipse(sx, sy - tz, 40 * pulse, 20 * pulse, 0, 0, Math.PI * 2)
                                    ctx.strokeStyle = `rgba(127, 119, 221, ${0.4 - pulse * 0.4})`
                                    ctx.lineWidth = 1.5
                                    ctx.stroke()
                                    ctx.restore()
                                }
                            }
                            if (isActivated) {
                                highlight = true
                                highlightColor = '#1a4d00'
                            }
                        }

                        let imageToDraw: HTMLImageElement | null = null
                        if (currentType === 'floor' || currentType === 'target') imageToDraw = (isTop && isActivated) ? activeSprite : floorSprite
                        else if (currentType === 'wall') imageToDraw = wallSprite
                        else if (currentType === 'broken') imageToDraw = brokenSprite
                        else if (currentType === 'generator') imageToDraw = (isTop && isActivated) ? genActiveSprite : genSprite
                        else if (currentType === 'active') imageToDraw = activeSprite

                        if (imageToDraw && imageToDraw.complete) {
                            const imgX = sx - (ISO.TILE_W / 2)
                            const imgY = (sy - tz) - (ISO.TILE_H / 2)

                            // Animación de "Levantamiento" si es éxito
                            const finalTZ = (status === 'success' && isTop) ? tz + (Math.sin(elapsed * 4 + col + row) * 2) : tz

                            ctx.drawImage(imageToDraw, imgX, imgY - (finalTZ - tz), ISO.TILE_W, ISO.TILE_H + ISO.DEPTH + 1)

                            if (isTop && highlight && highlightColor) {
                                ctx.beginPath()
                                ctx.moveTo(sx, (sy - finalTZ) - ISO.TILE_H / 2)
                                ctx.lineTo(sx + ISO.TILE_W / 2, (sy - finalTZ))
                                ctx.lineTo(sx, (sy - finalTZ) + ISO.TILE_H / 2)
                                ctx.lineTo(sx - ISO.TILE_W / 2, (sy - finalTZ))
                                ctx.closePath()
                                ctx.strokeStyle = highlightColor
                                ctx.lineWidth = isScanning ? 2 : 1.5
                                if (isScanning) {
                                    ctx.shadowColor = highlightColor
                                    ctx.shadowBlur = 10 * pulse
                                }
                                ctx.stroke()
                                ctx.shadowBlur = 0
                            }
                        } else {
                            drawIsoDiamond(ctx, sx, sy - tz, colors, isTop && highlight, highlightColor, isTop)
                        }

                        if (isTop) {
                            if (tile.type === 'target' && !isRobotHere && !isActivated) drawTargetMarker(ctx, sx, sy - tz, pulse)
                            if (tile.type === 'generator') drawGeneratorIcon(ctx, sx, sy - tz, isActivated)
                            if (tile.type === 'broken') drawBrokenIcon(ctx, sx, sy - tz)
                        }
                    }
                }
            }

            let isoX = visX.current
            let isoY = visY.current
            let progress = 1

            if ((robot.isMoving || robot.isJumping) && robot.prevX !== undefined && robot.prevY !== undefined) {
                const totalDistX = robot.x - robot.prevX
                const totalDistY = robot.y - robot.prevY
                if (totalDistX !== 0) progress = (visX.current - robot.prevX) / totalDistX
                else if (totalDistY !== 0) progress = (visY.current - robot.prevY) / totalDistY
                progress = Math.max(0, Math.min(1, progress))
                isoX = robot.prevX + totalDistX * progress
                isoY = robot.prevY + totalDistY * progress
            }

            const { x: rx, y: ry } = toIso(isoX, isoY, offsetX, offsetY)
            const prevH = robot.prevHeight || 0
            const currentH = robot.height || 0
            const isoH = prevH + (currentH - prevH) * progress
            const rz = isoH * (ISO.DEPTH - 0.5)

            let zOffset = 0
            if (robot.isJumping && progress < 1) {
                const arc = 1 - Math.pow(2 * progress - 1, 2)
                zOffset = arc * 25
            }

            // Sombra del robot más dinámica
            ctx.beginPath()
            ctx.ellipse(rx, ry - rz + 2, 12 - zOffset * 0.1, 5 - zOffset * 0.05, 0, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(0, 0, 0, ${0.4 - zOffset * 0.01})`
            ctx.fill()

            drawRobot(ctx, robot, rx, ry - 8 - rz - zOffset, pulse)

            // Efectos de pantalla (Glitch en falla)
            if (status === 'success') {
                ctx.fillStyle = `rgba(85, 226, 0, ${0.02 + pulse * 0.03})`; ctx.fillRect(0, 0, canvasW, canvasH)
            } else if (status === 'failed') {
                ctx.fillStyle = `rgba(226, 75, 74, ${0.04 * (1 - pulse)})`; ctx.fillRect(0, 0, canvasW, canvasH)
                // Glitch sutil: desplazamiento aleatorio de bloques
                if (Math.random() > 0.98) {
                    const blockY = Math.random() * canvasH
                    const blockH = 5 + Math.random() * 20
                    ctx.drawImage(ctx.canvas, 10, blockY, canvasW - 10, blockH, 0, blockY, canvasW - 10, blockH)
                    ctx.fillStyle = 'rgba(255, 0, 0, 0.05)'
                    ctx.fillRect(0, blockY, canvasW, blockH)
                }
            }

            ctx.restore()

            animRef.current = requestAnimationFrame(render)
        }

        animRef.current = requestAnimationFrame(render)
        return () => cancelAnimationFrame(animRef.current)
    }, [mapData, robot, activatedTiles, status, isScanning])

    return (
        <canvas
            ref={canvasRef}
            className="rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.6)]"
            style={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: '58vh',
                objectFit: 'contain',
                filter: status === 'failed' ? 'hue-rotate(-10deg) saturate(1.4) contrast(1.1)' : 'none',
                transition: 'filter 0.5s ease'
            }}
        />
    )
}
