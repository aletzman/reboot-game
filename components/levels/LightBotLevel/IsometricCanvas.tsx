'use client'

import { useEffect, useRef } from 'react'
import { ExtendedRobotState } from './types'
import { ISO, TILE_COLORS } from './constants'
import { toIso } from './utils'
import { LightbotLevelData } from '@/types/game'

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

function drawRobot(
    ctx: CanvasRenderingContext2D,
    robot: ExtendedRobotState,
    cx: number, cy: number,
    pulse: number
) {
    ctx.beginPath()
    ctx.ellipse(cx, cy + 8, 14, 6, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#00FFFF15'
    ctx.fill()

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
    mapData: LightbotLevelData
    robot: ExtendedRobotState
    activatedTiles: Set<string>
    status: 'idle' | 'success' | 'failed'
    isScanning?: boolean
}

export function IsometricCanvas({ mapData, robot, activatedTiles, status, isScanning }: IsometricCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animRef = useRef<number>(0)
    const visX = useRef(robot.x)
    const visY = useRef(robot.y)

    useEffect(() => {
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
        visX.current = robot.x
        visY.current = robot.y

        function render(time: number) {
            if (!ctx) return
            const elapsed = (time - startTime) / 1000
            const dt = Math.min((time - lastTime) / 1000, 0.1)
            lastTime = time
            const pulse = (Math.sin(elapsed * 2.5) + 1) / 2

            ctx.clearRect(0, 0, canvasW, canvasH)

            const bgGrad = ctx.createRadialGradient(canvasW / 2, canvasH / 2, 0, canvasW / 2, canvasH / 2, canvasW * 0.6)
            bgGrad.addColorStop(0, '#090C10')
            bgGrad.addColorStop(1, '#010101')
            ctx.fillStyle = bgGrad
            ctx.fillRect(0, 0, canvasW, canvasH)

            ctx.save()
            ctx.globalAlpha = 0.03
            ctx.strokeStyle = '#55e200'
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
                    const { x: sx, y: sy } = toIso(col, row, offsetX, offsetY)
                    const colors = TILE_COLORS[tile.type] ?? TILE_COLORS.floor
                    const th = tile.height || 0
                    const tz = th * 26

                    const isRobotHere = Math.round(visX.current) === col && Math.round(visY.current) === row
                    const isActivated = activatedTiles.has(`${col},${row}`)

                    let highlight = false
                    let highlightColor: string | undefined

                    if (tile.type === 'target') {
                        highlight = true
                        highlightColor = status === 'success' ? '#55e200' : isScanning ? '#7F77DD' : `rgba(13, 31, 0, ${0.6 + pulse * 0.4})`
                        
                        // Si está escaneando, dibujar pulso extra
                        if (isScanning) {
                            ctx.save()
                            ctx.beginPath()
                            ctx.ellipse(sx, sy - tz, 30 * pulse, 15 * pulse, 0, 0, Math.PI * 2)
                            ctx.strokeStyle = `rgba(127, 119, 221, ${1 - pulse})`
                            ctx.lineWidth = 2
                            ctx.stroke()
                            ctx.restore()
                        }
                    }
                    if (isActivated) {
                        highlight = true
                        highlightColor = '#1a4d00'
                    }

                    let imageToDraw: HTMLImageElement | null = null
                    if (tile.type === 'floor' || tile.type === 'target') imageToDraw = isActivated ? activeSprite : floorSprite
                    else if (tile.type === 'wall') imageToDraw = wallSprite
                    else if (tile.type === 'broken') imageToDraw = brokenSprite
                    else if (tile.type === 'generator') imageToDraw = isActivated ? genActiveSprite : genSprite
                    else if (tile.type === 'active') imageToDraw = activeSprite

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

                    if (tile.type === 'target' && !isRobotHere && !isActivated) drawTargetMarker(ctx, sx, sy - tz, pulse)
                    if (tile.type === 'generator') drawGeneratorIcon(ctx, sx, sy - tz, isActivated)
                    if (tile.type === 'broken') drawBrokenIcon(ctx, sx, sy - tz)
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
            const rz = isoH * 26

            let zOffset = 0
            if (robot.isJumping && progress < 1) {
                const arc = 1 - Math.pow(2 * progress - 1, 2)
                zOffset = arc * 25
            }

            drawRobot(ctx, robot, rx, ry - 8 - rz - zOffset, pulse)

            if (status === 'success') {
                ctx.fillStyle = `rgba(85, 226, 0, ${0.04 + pulse * 0.03})`; ctx.fillRect(0, 0, canvasW, canvasH)
            } else if (status === 'failed') {
                ctx.fillStyle = `rgba(226, 75, 74, ${0.06 * (1 - pulse)})`; ctx.fillRect(0, 0, canvasW, canvasH)
            }

            animRef.current = requestAnimationFrame(render)
        }

        animRef.current = requestAnimationFrame(render)
        return () => cancelAnimationFrame(animRef.current)
    }, [mapData, robot, activatedTiles, status, isScanning])

    return (
        <canvas
            ref={canvasRef}
            style={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: '55vh',
                objectFit: 'contain',
            }}
        />
    )
}
