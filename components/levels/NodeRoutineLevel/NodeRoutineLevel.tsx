'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { Command, CommandType } from '@/types/game'
import { Button } from '@/components/ui/Button'
import { GameButton } from '@/components/ui/GameButton'
import { ChevronsRightIcon } from 'lucide-react'
import { useAudioStore } from '@/store/audio.store'

import { NodeRoutineLevelProps, ExtendedRobotState } from './types'
import { NODEROUTINE_MAPS, DEFAULT_MAP, MAX_COMMANDS, EXEC_SPEED } from './constants'
import { sleep, flattenCommands, getNextPosition, turnLeft, turnRight, calcStars } from './utils'
import { IsometricCanvas } from './IsometricCanvas'
import { CommandPalette } from './CommandPalette'

export default function NodeRoutineLevel({ level, state, onComplete, onFragUse }: NodeRoutineLevelProps) {
    const mapData = NODEROUTINE_MAPS[level.id] ?? DEFAULT_MAP
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
    const [isScanning, setIsScanning] = useState(false)
    const [repeatModalOpen, setRepeatModal] = useState(false)
    const [repeatTimes, setRepeatTimes] = useState(2)

    // Reaccionar al uso de FRAG
    useEffect(() => {
        if (state.fragUsed) {
            setIsScanning(true)
            const timer = setTimeout(() => setIsScanning(false), 3000)
            return () => clearTimeout(timer)
        }
    }, [state.fragUsed])

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
                    return
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
                await sleep(250)

                const key = `${currentRobot.x},${currentRobot.y}`
                if (activated.has(key)) activated.delete(key)
                else activated.add(key)
                setActivated(new Set(activated))

                currentRobot = { ...currentRobot, isActivating: false }
                setRobot({ ...currentRobot })
            }

            const allTargetsReached = mapData.targets.every(t => activated.has(`${t.x},${t.y}`))
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
    // MANEJO DE COMANDOS
    // --------------------------------------------------------

    function handleAddCommand(type: CommandType) {
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
        if (activePanel === 'main') setCommands(prev => prev.filter((_, i) => i !== idx))
        else setCommandsF1(prev => prev.filter((_, i) => i !== idx))
    }

    function handleClearCommands() {
        if (activePanel === 'main') setCommands([])
        else setCommandsF1([])
    }

    function handleReset() {
        setRobot({ ...mapData.robotStart, isMoving: false, isJumping: false })
        setActivated(new Set())
        setIsRunning(false)
        setExecutingIdx(null)
        setStatus('idle')
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

    return (
        <div className="flex flex-1 min-h-0 bg-(--bg-void)">

            {/* PANEL IZQUIERDO — Mapa */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 gap-3 relative overflow-hidden">
                <div className="self-start flex flex-col gap-1 mb-1 mt-2 mx-2 font-mono tracking-[.14em]">
                    <div className="flex items-center gap-2 text-[11px] text-(--green-base)">
                        <span className='text-(--green-light) text-sm' style={{ textShadow: '0 0 10px var(--green-base)' }}>{'>'} {level.title?.toUpperCase()}</span>
                        {level.concept && <span className='text-(--text-ghost) text-sm'>[{level.concept}]</span>}
                    </div>
                    {level.description && (
                        <div className='text-(--text-muted) text-sm tracking-[.05em] max-w-[85%] mt-1 leading-normal'>
                            {'//Objetivo: '} {level.description}
                        </div>
                    )}
                </div>

                <div
                    className="relative"
                    style={{
                        border: `2px solid ${status === 'success' ? 'var(--green-base)' : status === 'failed' ? 'var(--red-dark)' : 'var(--bg-hover)'}`,
                        borderRadius: '5px',
                        overflow: 'hidden',
                        transition: 'border-color .4s, box-shadow .4s',
                        boxShadow: status === 'success' ? '0 0 30px rgba(85,226,0,0.15), inset 0 0 20px rgba(85,226,0,0.05)' : status === 'failed' ? '0 0 20px rgba(226,75,74,0.2)' : '0 0 20px rgba(85,226,0,0.03)',
                    }}
                >
                    <IsometricCanvas
                        mapData={mapData}
                        robot={robot}
                        activatedTiles={activatedTiles}
                        status={status}
                        isScanning={isScanning}
                    />

                    {/* Sonar Overlay Effect */}
                    {isScanning && (
                        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                            <div className="w-[150%] h-[150%] border-2 border-(--purple) rounded-full animate-[ping_2s_ease-out_infinite]" />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-(--purple)/20 to-transparent animate-pulse" />
                        </div>
                    )}
                </div>

                <div className="h-5 flex items-center text-xs font-mono tracking-widest">
                    {status === 'failed' && <span className='text-(--red)'>✗ ERROR — el robot no pudo completar la secuencia</span>}
                    {status === 'success' && <span className='text-(--green-light)'>✓ OBJETIVO ALCANZADO</span>}
                    {status === 'idle' && !isRunning && commands.length === 0 && (
                        <span className='flex items-center gap-1 text-(--text-muted) text-xs'>
                            agrega comandos para guiar al robot <ChevronsRightIcon size={13} className='animate-arrow-right' />
                        </span>
                    )}
                </div>
            </div>

            <CommandPalette
                commands={commands}
                commandsF1={commandsF1}
                activePanel={activePanel}
                isRunning={isRunning}
                executingIdx={executingIdx}
                mapData={mapData}
                setActivePanel={setActivePanel}
                onAddCommand={handleAddCommand}
                onRemoveCommand={handleRemoveCommand}
                onClearCommands={handleClearCommands}
                onExecute={executeCommands}
                onReset={handleReset}
            />

            {repeatModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/85 backdrop-blur-xs">
                    <div className="bg-(--bg-surface) border border-(--green-base) rounded-[2px] p-7 font-mono flex flex-col gap-5 min-w-[260px] shadow-[0_0_40px_rgba(85,226,0,0.1)]">
                        <div className="text-(--green-light) text-xs tracking-[.12em] uppercase">{'// repetir N veces'}</div>
                        <div className="flex items-center justify-center gap-4">
                            <GameButton variant="command" onClick={() => setRepeatTimes(t => Math.max(2, t - 1))} className="text-base px-4">−</GameButton>
                            <span className="text-(--green-light) text-2xl min-w-[2ch] text-center font-mono">{repeatTimes}</span>
                            <GameButton variant="command" onClick={() => setRepeatTimes(t => Math.min(10, t + 1))} className="text-base px-4">+</GameButton>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="solid" size="xs" onClick={handleAddRepeat} className="flex-1">agregar</Button>
                            <Button variant="ghost" size="xs" onClick={() => setRepeatModal(false)} className="flex-1">cancelar</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
