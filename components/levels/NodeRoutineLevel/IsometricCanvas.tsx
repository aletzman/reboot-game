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
if (floorSprite) floorSprite.src = '/assets/sample_floor.png'

const activeSprite = typeof window !== 'undefined' ? new Image() : null
if (activeSprite) activeSprite.src = '/assets/sample_active.png'

const wallSprite = typeof window !== 'undefined' ? new Image() : null
if (wallSprite) wallSprite.src = '/assets/sample_wall.png'

const checkSprite = typeof window !== 'undefined' ? new Image() : null
if (checkSprite) checkSprite.src = '/assets/sample_check.png'

const genSprite = typeof window !== 'undefined' ? new Image() : null
if (genSprite) genSprite.src = '/assets/sample_generator.png'

const genActiveSprite = typeof window !== 'undefined' ? new Image() : null
if (genActiveSprite) genActiveSprite.src = '/assets/sample_generator_active.png'

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

function drawTargetMarker(ctx: CanvasRenderingContext2D, cx: number, cy: number, pulse: number, activated: boolean = false) {
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'

    // Colores dinámicos basados en si está activado o no 
    const glowColor = activated ? '#00ffff' : '#ff8800'
    const coreColor = activated ? '#ffffff' : '#ffcc66'

    // Opacidad palpitante
    const alpha = activated ? (0.4 + pulse * 0.2) : (0.6 + pulse * 0.4)
    const baseColorStr = activated ? `rgba(18, 176, 187, ${alpha})` : `rgba(145, 54, 1, ${alpha})`
    const secondaryColorStr = activated ? `rgba(0, 255, 255, ${0.1 + pulse * 0.1})` : `rgba(255, 140, 50, ${0.2 + pulse * 0.2})`

    // 1. Haz de luz volumétrico (hacia arriba)
    const beamH = 60 + pulse * 20
    const beamW = 25 + pulse * 12
    const beamGrad = ctx.createLinearGradient(cx, cy, cx, cy - beamH)
    beamGrad.addColorStop(0, baseColorStr)
    beamGrad.addColorStop(0.5, secondaryColorStr)
    beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')

    ctx.fillStyle = beamGrad
    ctx.beginPath()
    ctx.ellipse(cx, cy, beamW / 2, beamW / 4, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(cx - beamW / 3, cy)
    ctx.lineTo(cx + beamW / 3, cy)
    ctx.lineTo(cx + 1, cy - beamH)
    ctx.lineTo(cx - 1, cy - beamH)
    ctx.closePath()
    ctx.fill()

    // 2. Anillo de base palpitante
    const r = 10 + pulse * 4
    ctx.beginPath()
    ctx.ellipse(cx, cy, r * 1.8, r, 0, 0, Math.PI * 2)
    ctx.strokeStyle = baseColorStr
    ctx.lineWidth = 2.5
    ctx.stroke()

    // 3. Núcleo intenso con sombra de brillo
    ctx.beginPath()
    ctx.ellipse(cx, cy, 5, 2.5, 0, 0, Math.PI * 2)
    ctx.fillStyle = coreColor
    ctx.shadowBlur = 20 * pulse
    ctx.shadowColor = glowColor
    ctx.fill()

    ctx.restore()
}



function drawElectricDischarge(ctx: CanvasRenderingContext2D, cx: number, cy: number, pulse: number) {
    ctx.save()

    // 1. Glow base (Atmósfera eléctrica)
    const hw = ISO.TILE_W / 2
    const hh = ISO.TILE_H / 2
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, hw * 1.2)
    grad.addColorStop(0, `rgba(18, 176, 187, ${0.15 * pulse})`)
    grad.addColorStop(1, 'rgba(18, 176, 187, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(cx - hw * 1.5, cy - hh * 3, hw * 3, hh * 4)

    ctx.globalCompositeOperation = 'lighter'

    // 2. Ondas Magnéticas (Anillos sutiles que suben)
    const numRings = 2
    const time = performance.now() * 0.002
    for (let i = 0; i < numRings; i++) {
        const ringOffset = (time + i / numRings) % 1
        const ringAlpha = (1 - ringOffset) * 0.25
        const ringScale = 0.4 + ringOffset * 0.7

        ctx.beginPath()
        ctx.ellipse(cx, cy - 2 - (ringOffset * 20), hw * ringScale, hh * ringScale, 0, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(18, 176, 187, ${ringAlpha})`
        ctx.lineWidth = 1
        ctx.stroke()
    }

    // 3. Rayos Eléctricos (Flickering)
    // Usamos Math.random para el parpadeo rápido típico de la electricidad
    if (Math.random() > 0.8) {
        ctx.strokeStyle = Math.random() > 0.7 ? '#ffffff88' : '#12b0bb66'
        ctx.shadowColor = '#12b0bb88'
        ctx.shadowBlur = 10 * pulse

        const numBolts = 1 + Math.floor(Math.random() * 2)
        for (let b = 0; b < numBolts; b++) {
            ctx.lineWidth = 0.5 + Math.random() * 1.5
            let lx = cx + (Math.random() - 0.5) * hw * 0.8
            let ly = cy + (Math.random() - 0.5) * hh * 0.4
            ctx.beginPath()
            ctx.moveTo(lx, ly)

            const segments = 3 + Math.floor(Math.random() * 3)
            for (let s = 0; s < segments; s++) {
                lx += (Math.random() - 0.5) * 14
                ly -= 4 + Math.random() * 7
                ctx.lineTo(lx, ly)
            }
            ctx.stroke()
        }
    }

    // 4. Partículas/Chispas
    if (Math.random() > 0.8) {
        for (let p = 0; p < 2; p++) {
            const px = cx + (Math.random() - 0.5) * hw
            const py = cy - Math.random() * 25
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(px, py, 1.2, 1.2)
        }
    }

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

        const canvasW = Math.max(800, mapWidthPx + 150)
        const canvasH = Math.max(800, mapHeightPx + ISO.DEPTH + 150)
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
        // Solo forzar la posición (snap) si no estamos en movimiento/salto (ej. reseteo)
        // o si la distancia es demasiado grande (teletransporte)
        const dist = Math.hypot(robot.x - visX.current, robot.y - visY.current)
        if ((!robot.isMoving && !robot.isJumping) || dist > 1.5) {
            visX.current = robot.x
            visY.current = robot.y
        }

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
            bgGrad.addColorStop(1, '#040607')
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

                ctx.fillStyle = `rgba(85, 226, 0, ${0.05 + Math.random() * 0.2})`
                ctx.fillRect(p.x, p.y, p.s, p.s)
            }
            ctx.restore()

            // Dibujar Grilla "Digital Echo"
            ctx.save()
            ctx.globalAlpha = 0.05 + pulse * 0.03
            ctx.strokeStyle = '#55e20000'
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

            // Aumentamos el factor de lerp para que sea muy rápido (1-2 frames extra)
            // 24 * dt @ 60fps es ~0.38 por frame. En 2-3 frames está en su sitio.
            const lerpFactor = 24 * dt
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
                                highlightColor = status === 'success' ? '#55e200' : isScanning ? '#12b0bb' : `rgba(145, 54, 1, ${0.4 + pulse * 0.4})`

                                if (isScanning) {
                                    ctx.save()
                                    ctx.beginPath()
                                    ctx.ellipse(sx, sy - tz, 40 * pulse, 20 * pulse, 0, 0, Math.PI * 2)
                                    ctx.strokeStyle = `rgba(18, 176, 187, ${0.4 - pulse * 0.4})`
                                    ctx.lineWidth = 1.5
                                    ctx.stroke()
                                    ctx.restore()
                                }
                            }
                            if (isActivated) {
                                highlight = true
                                highlightColor = '#1a4d0000'
                            }
                        }

                        let imageToDraw: HTMLImageElement | null = null
                        if (currentType === 'target') imageToDraw = (isTop && isActivated) ? activeSprite : checkSprite
                        else if (currentType === 'floor') imageToDraw = (isTop && isActivated) ? activeSprite : floorSprite
                        else if (currentType === 'wall') imageToDraw = wallSprite
                        else if (currentType === 'generator') imageToDraw = (isTop && isActivated) ? genActiveSprite : genSprite
                        else if (currentType === 'active') imageToDraw = activeSprite

                        if (imageToDraw && imageToDraw.complete) {
                            const imgX = sx - (ISO.TILE_W / 2)
                            const imgY = (sy - tz) - (ISO.TILE_H / 2)

                            // Eliminado efecto de levantamiento para optimizar recursos
                            const finalTZ = tz

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
                            if (tile.type === 'target') drawTargetMarker(ctx, sx, sy - tz, pulse, isActivated)
                            if (tile.type === 'wall') drawElectricDischarge(ctx, sx, sy - tz, pulse)
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
            /* if (status === 'success') {
                 ctx.fillStyle = `rgba(85, 226, 0, ${0.02 + pulse * 0.03})`; ctx.fillRect(0, 0, canvasW, canvasH)
             } else if (status === 'failed') {
                 ctx.fillStyle = `rgba(226, 75, 74, ${0.04 * (1 - pulse)})`; ctx.fillRect(0, 0, canvasW, canvasH)
             }*/

            ctx.restore()

            animRef.current = requestAnimationFrame(render)
        }

        animRef.current = requestAnimationFrame(render)
        return () => cancelAnimationFrame(animRef.current)
    }, [mapData, robot, activatedTiles, status, isScanning])

    return (
        <canvas
            id="game-canvas"
            ref={canvasRef}
            className="rounded-lg "
            style={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: '58vh',
                objectFit: 'contain',
                transition: 'filter 0.5s ease'
            }}
        />
    )
}
