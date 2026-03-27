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
            executionRef.current++ // Detener cualquier loop anterior
            setRobot({ x: map.start.x, y: map.start.y, dir: map.start.dir as Direction })
            setActivated([])
            setCurrentStep(-1)
            setError(null)
        } else {
            const execId = ++executionRef.current
            runSimulation(execId)
        }
    }, [isExecuting, map, blocks])

    const flatInstructions = useCallback((program: LogicAssemblyBlock[], allBlocks: LogicAssemblyBlock[]): {type: LogicAssemblyBlockType, value?: string | number}[] => {
        let result: {type: LogicAssemblyBlockType, value?: string | number}[] = []
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
            } else if (b.type === 'FUNCION') {
                // Las definiciones de funciones no se ejecutan directamente
                continue
            } else {
                result.push({ type: b.type, value: b.value })
            }
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
                for(let step=0; step<dist; step++) {
                    let nx = cx
                    let ny = cy
                    if (cd === 'up') ny--
                    if (cd === 'down') ny++
                    if (cd === 'left') nx--
                    if (cd === 'right') nx++

                    // Check bounds & walls
                    if (ny < 0 || ny >= map.grid.length || nx < 0 || nx >= map.grid[0].length || map.grid[ny][nx] === 1) {
                        setError('COLISIÓN DETECTADA')
                        onFinish(false)
                        return
                    }
                    cx = nx
                    cy = ny
                    setRobot({ x: cx, y: cy, dir: cd })
                    await delay(200)
                }
            } else if (inst.type === 'GIRAR') {
                const val = inst.value as string
                const dirs: Direction[] = ['up', 'right', 'down', 'left']
                let idx = dirs.indexOf(cd)
                if (val === 'derecha') idx = (idx + 1) % 4
                else idx = (idx + 3) % 4
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

        // Validar objetivos
        const success = map.objective.every(obj => currentActivated.includes(`${obj.x}-${obj.y}`))
        await delay(500)
        onFinish(success)
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Grid Display */}
            <div 
                className="bg-black/90 p-4 border border-white/5 shadow-2xl relative overflow-hidden aspect-square flex flex-col items-center justify-center rounded-lg"
                style={{
                    backgroundImage: 'radial-gradient(circle at center, #1a1a1a 0%, #000 100%)'
                }}
            >
                {/* CRT Effect lines */}
                <div className="absolute inset-0 pointer-events-none bg-repeating-linear-gradient(transparent 0px, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px) opacity-20" />
                
                {/* Grid */}
                <div 
                    className="grid gap-1"
                    style={{ 
                        gridTemplateColumns: `repeat(${map.grid[0].length}, 1fr)`,
                        width: '100%' 
                    }}
                >
                    {map.grid.map((row, y) => row.map((cell, x) => {
                        const isObjective = map.objective.some(o => o.x === x && o.y === y)
                        const isRobot = robot.x === x && robot.y === y
                        const isActivated = activated.includes(`${x}-${y}`)
                        
                        return (
                            <div 
                                key={`${x}-${y}`}
                                className={`w-full aspect-square border relative flex items-center justify-center transition-all duration-300 ${
                                    cell === 1 ? 'bg-white/10 border-white/5' : 
                                    isObjective ? 'bg-(--green-darkest)/20 border-(--green-base)/30' : 
                                    'border-white/5'
                                }`}
                            >
                                {isObjective && (
                                    <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isActivated ? 'bg-(--green-light) shadow-[0_0_10px_var(--green-light)] scale-125' : 'bg-(--green-base)/40 animate-pulse'}`} />
                                )}
                                
                                {isRobot && (
                                    <div className="absolute z-10 transition-all duration-300" style={{
                                        transform: `rotate(${robot.dir === 'up' ? 0 : robot.dir === 'right' ? 90 : robot.dir === 'down' ? 180 : 270}deg)`
                                    }}>
                                        <div className="w-4 h-4 text-(--green-light)">
                                            <svg viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    }))}
                </div>

                {/* Overlays */}
                {error && (
                    <div className="absolute inset-0 bg-red-950/40 flex items-center justify-center backdrop-blur-sm">
                        <span className="font-mono text-xs text-(--red) font-bold tracking-[0.3em] uppercase animate-pulse">{error}</span>
                    </div>
                )}
            </div>

            {/* Status Footer */}
            <div className="bg-(--bg-deep) p-3 border border-white/5 rounded font-mono text-[9px] flex justify-between items-center text-(--text-ghost) uppercase tracking-wider">
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isExecuting ? 'bg-(--amber) animate-pulse' : 'bg-white/10'}`} />
                    <span>Hacker_Cursor_v2</span>
                </div>
                {isExecuting && (
                    <span>Paso: {currentStep + 1}</span>
                )}
            </div>
        </div>
    )
}
