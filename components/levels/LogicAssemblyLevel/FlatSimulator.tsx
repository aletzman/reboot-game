'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { LogicAssemblyBlock, LogicAssemblyBlockType } from '@/types/game'
import { MapData } from './types'

interface FlatSimulatorProps {
    blocks: LogicAssemblyBlock[]
    map: MapData
    isExecuting: boolean
    onFinish: (success: boolean) => void
}

type Direction = 'up' | 'down' | 'left' | 'right'

export function FlatSimulator({
    blocks,
    map,
    isExecuting,
    onFinish
}: FlatSimulatorProps) {
    const [robot, setRobot] = useState({
        x: map.start.x,
        y: map.start.y,
        dir: map.start.dir as Direction
    })
    const [activated, setActivated] = useState<string[]>([])
    const [currentStep, setCurrentStep] = useState(-1)
    const [error, setError] = useState<string | null>(null)
    const executionRef = useRef(0)

    // Reset simulation when logic starts/stops
    useEffect(() => {
        if (!isExecuting) {
            executionRef.current++
            setRobot({ x: map.start.x, y: map.start.y, dir: map.start.dir as Direction })
            setActivated([])
            setCurrentStep(-1)
            setError(null)
        } else {
            const execId = ++executionRef.current
            runSimulation(execId)
        }
    }, [isExecuting, map, blocks])

    // Tu lógica de flatInstructions se mantiene igual...
    const flatInstructions = useCallback((program: LogicAssemblyBlock[], allBlocks: LogicAssemblyBlock[]): { type: LogicAssemblyBlockType, value?: string | number }[] => {
        let result: { type: LogicAssemblyBlockType, value?: string | number }[] = []
        for (const b of program) {
            if (b.type === 'REPETIR' && b.children) {
                const times = parseInt(b.value as string) || 1
                for (let i = 0; i < times; i++) {
                    result.push(...flatInstructions(b.children, allBlocks))
                }
            } else if (b.type === 'LLAMAR') {
                const fnName = b.value as string
                const fnDef = allBlocks.find(block => block.type === 'FUNCION' && block.value === fnName)
                if (fnDef && fnDef.children) {
                    result.push(...flatInstructions(fnDef.children, allBlocks))
                }
            } else if (b.type === 'FUNCION') continue
            else result.push({ type: b.type, value: b.value })
        }
        return result
    }, [])

    async function runSimulation(id: number) {
        const queue = flatInstructions(blocks, blocks)
        let cx = map.start.x
        let cy = map.start.y
        let cd = map.start.dir as Direction
        let currentActivated: string[] = []
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms))

        for (let i = 0; i < queue.length; i++) {
            if (id !== executionRef.current || !isExecuting) return
            const inst = queue[i]
            setCurrentStep(i)
            await delay(400)
            if (id !== executionRef.current || !isExecuting) return

            if (inst.type === 'MOVER') {
                const dist = parseInt(inst.value as string) || 1
                for (let step = 0; step < dist; step++) {
                    let nx = cx, ny = cy
                    if (cd === 'up') ny--
                    else if (cd === 'down') ny++
                    else if (cd === 'left') nx--
                    else if (cd === 'right') nx++

                    if (ny < 0 || ny >= map.grid.length || nx < 0 || nx >= map.grid[0].length || map.grid[ny][nx] === 1) {
                        setError('UNIT_COLLISION_FATAL')
                        onFinish(false)
                        return
                    }
                    cx = nx; cy = ny
                    setRobot({ x: cx, y: cy, dir: cd })
                    await delay(200)
                }
            } else if (inst.type === 'GIRAR') {
                const val = inst.value as string
                const dirs: Direction[] = ['up', 'right', 'down', 'left']
                let idx = dirs.indexOf(cd)
                idx = val === 'derecha' ? (idx + 1) % 4 : (idx + 3) % 4
                cd = dirs[idx]
                setRobot({ x: cx, y: cy, dir: cd })
            } else if (inst.type === 'ACTIVAR') {
                if (map.grid[cy][cx] === 2) {
                    const key = `${cx}-${cy}`
                    if (!currentActivated.includes(key)) {
                        currentActivated = [...currentActivated, key]
                        setActivated(prev => [...prev, key])
                    }
                }
            }
        }
        const success = map.objective.every(obj => currentActivated.includes(`${obj.x}-${obj.y}`))
        await delay(500)
        onFinish(success)
    }

    return (
        <div className="flex flex-col gap-2">
            {/* GRID DISPLAY (Radar Táctico) */}
            <div
                className="relative overflow-hidden aspect-square flex items-center justify-center bg-[#020408]"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at center, #101825 0%, #020408 100%),
                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '100% 100%, 20px 20px, 20px 20px'
                }}
            >
                {/* Grid Container */}
                <div
                    className="grid gap-0.5 p-2 relative z-20 border border-white/5 bg-black/20"
                    style={{
                        gridTemplateColumns: `repeat(${map.grid[0].length}, 1fr)`,
                        width: '95%'
                    }}
                >
                    {map.grid.map((row, y) => row.map((cell, x) => {
                        const isObjective = map.objective.some(o => o.x === x && o.y === y)
                        const isRobot = robot.x === x && robot.y === y
                        const isActivated = activated.includes(`${x}-${y}`)
                        const isWall = cell === 1

                        return (
                            <div
                                key={`${x}-${y}`}
                                className={`
                                    w-full aspect-square relative flex items-center justify-center transition-all duration-300
                                    ${isWall ? 'bg-[#1A1F26] shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]' : 'bg-transparent'}
                                    border border-white/2
                                `}
                            >
                                {/* Puntos de la Cuadrícula (Estilo Blueprint) */}
                                {!isWall && <div className="w-px h-px bg-white/10 rounded-full" />}

                                {/* OBJETIVO: CIRCULO ORIGINAL CON ACTIVACIÓN TÁCTICA */}
                                {isObjective && (
                                    <div className="relative flex items-center justify-center w-full h-full group">

                                        {/* ============================================================
                                            ESTADO APAGADO (El círculo original) 
                                        ============================================================ */}
                                        {!isActivated && (
                                            <div className="w-4 h-4 rounded-full bg-[#191e26] border border-[#4a5c71] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] relative z-10 opacity-70 transition-opacity group-hover:opacity-100">
                                                {/* Micro-luz central apagada */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-1 h-1 rounded-full bg-(--green-base)/20 animate-pulse" />
                                                </div>
                                            </div>
                                        )}

                                        {/* ============================================================
                                                ESTADO ACTIVADO (Estallido de Energía Neon) 
                                        ============================================================ */}
                                        {isActivated && (
                                            <div className="relative flex items-center justify-center w-full h-full z-20">

                                                {/* 1. ONDA DE CHOQUE (Shockwave rápida y efímera) */}
                                                <div className="absolute w-[120%] h-[120%] rounded-full border-2 border-(--green-light) animate-shockwave-tac z-0 opacity-0" />

                                                {/* 2. NÚCLEO DE LUZ SÓLIDA (El nuevo círculo activo) */}
                                                <div className="w-3 h-3 rounded-full bg-(--green-light) border border-white/50 shadow-[0_0_15px_3px_var(--green-light)] z-10 flex items-center justify-center relative overflow-hidden">
                                                    {/* Un destello interior cian muy rápido */}
                                                    <div className="absolute inset-0 bg-(--cyan)/20 blur-[1px] animate-pulse" />
                                                </div>

                                                {/* 3. AURA DE ENERGÍA PERSISTENTE (El resplandor neón) */}
                                                <div className="absolute w-5 h-5 rounded-full bg-(--green-light)/10 blur-xl animate-pulse z-0" />
                                            </div>
                                        )}

                                        {/* LABEL TÁCTICO SUBTERRÁNEO */}
                                        <div className={`
                                            absolute -bottom-[2px] font-mono text-[8px] uppercase tracking-[0.2em] font-black transition-all
                                            ${isActivated ? 'text-(--green-light) opacity-100' : 'text-[#4A5568] opacity-75'}
                                        `}>
                                            {isActivated ? 'LINK_OK' : 'LOCKED'}
                                        </div>
                                    </div>
                                )}

                                {/* ROBOT (Unidad REBOOT) */}
                                {isRobot && (
                                    <div className="absolute z-30 transition-all duration-300" style={{
                                        transform: `rotate(${robot.dir === 'up' ? 0 : robot.dir === 'right' ? 90 : robot.dir === 'down' ? 180 : 270}deg)`
                                    }}>
                                        {/* Cursor de Navegación Táctico */}
                                        <div className="relative flex items-center justify-center">
                                            <svg viewBox="0 0 24 24" className="w-6 h-6 text-(--green-light) drop-shadow-[0_0_8px_var(--green-light)]">
                                                <path fill="currentColor" d="M12 2L4 21l1-1 7-4 7 4 1 1z" />
                                            </svg>
                                            {/* Aura de energía */}
                                            <div className="absolute inset-0 bg-(--green-light)/20 blur-md rounded-full animate-ping" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }))}
                </div>

                {/* ERROR OVERLAY (Alerta de Sistema Crítica) */}
                {error && (
                    <div className="absolute inset-0 bg-red-950/80 z-50 flex flex-col items-center justify-center backdrop-blur-md border-4 border-red-600/20 m-4">
                        <div className="p-4 border-2 border-red-600 flex flex-col items-center gap-3 bg-black">
                            <span className="font-mono text-[14px] text-red-500 font-black tracking-[0.3em] uppercase animate-pulse">
                                [ ! ] {error}
                            </span>
                            <div className="w-full h-1 bg-red-600/30 overflow-hidden">
                                <div className="h-full bg-red-600 w-1/2 animate-[shimmer_1s_infinite]" />
                            </div>
                            <span className="font-mono text-[8px] text-red-400 opacity-70">REBOOT_REQUIRED_TO_PROCEED</span>
                        </div>
                    </div>
                )}
            </div>

            {/* STATUS FOOTER (Panel de Datos Inferior) */}
            <div className="bg-[#0D1117] px-4 py-2 border-x border-b border-white/5 rounded-b font-mono text-[9px] flex justify-between items-center text-[#4A5568] uppercase tracking-widest shadow-inner">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${isExecuting ? 'bg-(--amber) shadow-[0_0_8px_var(--amber)] animate-pulse' : 'bg-white/5'}`} />
                        <span className={isExecuting ? 'text-(--amber)' : ''}>
                            {isExecuting ? 'SIMULANDO_TRAYECTORIA' : 'SISTEMA_STANDBY'}
                        </span>
                    </div>
                    <div className="h-3 w-px bg-white/10" />
                    <span>X: {robot.x} Y: {robot.y}</span>
                </div>

                {isExecuting && (
                    <div className="flex items-center gap-2">
                        <span className="text-(--green-light) opacity-60">STACK_POS:</span>
                        <span className="font-black text-white">[{String(currentStep + 1).padStart(3, '0')}]</span>
                    </div>
                )}
            </div>
        </div>
    )
}