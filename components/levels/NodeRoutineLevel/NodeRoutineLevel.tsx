'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { LevelState, Command, CommandType } from '@/types/game'
import { RotateCcwIcon, Play, Minus, Plus } from 'lucide-react'
import { useAudioStore } from '@/store/audio.store'
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { NodeRoutineLevelProps, ExtendedRobotState } from './types'
import { NODEROUTINE_MAPS, DEFAULT_MAP, MAX_COMMANDS, EXEC_SPEED } from './constants'
import { sleep, flattenCommands, getNextPosition, turnLeft, turnRight, calcStars } from './utils'
import { IsometricCanvas } from './IsometricCanvas'
import { CommandPalette } from './CommandPalette'
import { NODE_ROUTINE_TUTORIAL, REPEAT_TUTORIAL, FUNCTION_TUTORIAL, FUNCTION_F2_TUTORIAL, TUTORIAL_CONFIG } from './tutorialSteps'
import { LevelHeader } from '../LevelHeader'
import { Panel } from '@/components/ui/Panel'
import { Button } from '@/components/ui/Button'
import { DirectivesPanel } from '@/components/ui/DirectivesPanel'
import { useSettingsStore } from '@/store/settings.store'
import { SpeedSelector } from '../../ui/SpeedSelector'
import SystemLogRealtime from './SystemLogRealtime'
import SectionHeader from '@/components/ui/SectionHeader'
import { TacticalSection } from '@/components/ui/TacticalSection'
import { RobotMonitor } from './RobotMonitor'
import { MissionStatusMonitor } from './MissionStatusMonitor'
import { useUIStore } from '@/lib/store/useUIStore'

export default function NodeRoutineLevel({ level, state, onComplete, onFragUse, onStatusChange }: NodeRoutineLevelProps) {
    const mapData = NODEROUTINE_MAPS[level.id] ?? DEFAULT_MAP
    const moveSoundRef = useRef<HTMLAudioElement | null>(null)
    const jumpSoundRef = useRef<HTMLAudioElement | null>(null)
    const activateSoundRef = useRef<HTMLAudioElement | null>(null)

    const { sfxVolume, isMuted } = useAudioStore()
    const closeDirectives = useUIStore((state) => state.closeDirectives)

    // Logs del sistema para la terminal "coleta"
    const [logs, setLogs] = useState<{ id: string, msg: string, type: 'info' | 'warn' | 'success' | 'err' }[]>([
        { id: 'boot', msg: 'SISTEMA_REBOOT_V4 INICIADO...', type: 'info' },
        { id: 'ready', msg: 'ESPERANDO INPUT_DE_RUTINA...', type: 'info' }
    ])

    const addLog = useCallback((msg: string, type: 'info' | 'warn' | 'success' | 'err' = 'info') => {
        setLogs(prev => [{ id: Math.random().toString(), msg, type }, ...prev].slice(0, 8))
    }, [])

    const [commands, setCommands] = useState<Command[]>([])
    const [commandsF1, setCommandsF1] = useState<Command[]>([])
    const [commandsF2, setCommandsF2] = useState<Command[]>([])
    const [activePanel, setActivePanel] = useState<'main' | 'f1' | 'f2'>('main')
    const [robot, setRobot] = useState<ExtendedRobotState>({ ...mapData.robotStart, isMoving: false, isJumping: false, prevX: mapData.robotStart.x, prevY: mapData.robotStart.y })
    const [activatedTiles, setActivated] = useState<Set<string>>(new Set())
    const [isRunning, setIsRunning] = useState(false)
    const [executingIdx, setExecutingIdx] = useState<{ idx: number; panel: 'main' | 'f1' | 'f2' } | null>(null)
    const [status, setStatus] = useState<LevelState['status']>('idle')
    const [isScanning, setIsScanning] = useState(false)
    const [repeatModalOpen, setRepeatModal] = useState(false)
    const [repeatTimes, setRepeatTimes] = useState(2)
    const speed = useSettingsStore((state) => state.simulationSpeed)

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

    // Reaccionar al uso de FRAG
    useEffect(() => {
        if (state.fragUsed) {
            setIsScanning(true)
            addLog('FRAG_RECON: ANALIZANDO VECTOR_DE_DATOS...', 'warn')
            const timer = setTimeout(() => setIsScanning(false), 3000)
            return () => clearTimeout(timer)
        }
    }, [state.fragUsed, addLog])

    // --------------------------------------------------------
    // TUTORIAL (DRIVER.JS)
    // --------------------------------------------------------
    useEffect(() => {
        // Solo lanzamos el tutorial en niveles específicos
        const tutorialSteps = {
            '1-01': NODE_ROUTINE_TUTORIAL,
            '1-11': REPEAT_TUTORIAL,
            '1-16': FUNCTION_TUTORIAL,
            '1-23': FUNCTION_F2_TUTORIAL,
        }[level.id]

        if (!tutorialSteps) return;

        const timer = setTimeout(() => {
            const driverObj = driver({
                ...TUTORIAL_CONFIG,
                steps: tutorialSteps
            });

            driverObj.drive();
        }, 1000);

        return () => clearTimeout(timer);
    }, [level.id]);


    const executeCommands = useCallback(async () => {
        if (isRunning || commands.length === 0) return

        closeDirectives() // Cerrar ayuda al iniciar

        setIsRunning(true)
        setStatus('playing')
        onStatusChange('playing')
        addLog('EJECUTANDO RUTINA_PRINCIPAL...', 'info')

        const { flat, overflow, involvedPanels } = flattenCommands(commands, commandsF1, commandsF2)
        if (overflow) {
            addLog('!! ERROR: BUCLE_INFINITO_RECONOCIDO', 'err')
            addLog('!! SECUENCIA_SIN_SALIDA: ABORTANDO...', 'err')
            setStatus('failed')
            onStatusChange('failed', 'infinite-loop', { involvedPanels })
            setIsRunning(false)
            return
        }

        let currentRobot: ExtendedRobotState = { ...mapData.robotStart, isMoving: false, isJumping: false, height: mapData.robotStart.height || 0 }
        const activated = new Set<string>()
        //EL CheckPosition es la ultima posicion de mapData.targets
        const checkPosition = (x: number, y: number) => {
            return mapData.targets.at(-1)?.x === x && mapData.targets.at(-1)?.y === y
        }
        let won = false
        let reasonFailed: LevelState['failReason'] = 'generic'

        for (let i = 0; i < flat.length; i++) {
            const currentItem = flat[i]
            setExecutingIdx({ idx: currentItem.originalIdx, panel: currentItem.panel })
            const cmd = currentItem.cmd
            await sleep(EXEC_SPEED / speed)

            if (cmd.type === 'move' || cmd.type === 'jump') {
                const isJump = cmd.type === 'jump'
                addLog(`OP_EJEC: ${isJump ? 'S_ALTO' : 'MV_ADEL'} // LOC:(${currentRobot.x},${currentRobot.y})`, 'info')

                if (isJump) {
                    if (jumpSoundRef.current) { jumpSoundRef.current.currentTime = 0; jumpSoundRef.current.play().catch(() => { }) }
                } else {
                    if (moveSoundRef.current) { moveSoundRef.current.currentTime = 0; moveSoundRef.current.play().catch(() => { }) }
                }
                const next = getNextPosition(currentRobot, mapData, cmd.type as 'move' | 'jump')
                if (!next) {
                    addLog('ERROR: COLISIÓN O MOVIMIENTO INVÁLIDO', 'err')
                    setStatus('failed')
                    onStatusChange('failed', 'out-of-bounds')
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
                addLog('OP_EJEC: ROT_IZQ', 'info')
                if (moveSoundRef.current) { moveSoundRef.current.currentTime = 0; moveSoundRef.current.play().catch(() => { }) }
                currentRobot = { ...currentRobot, direction: turnLeft(currentRobot.direction), isMoving: false, isJumping: false }
                setRobot({ ...currentRobot })
            } else if (cmd.type === 'turn-right') {
                addLog('OP_EJEC: ROT_DER', 'info')
                if (moveSoundRef.current) { moveSoundRef.current.currentTime = 0; moveSoundRef.current.play().catch(() => { }) }
                currentRobot = { ...currentRobot, direction: turnRight(currentRobot.direction), isMoving: false, isJumping: false }
                setRobot({ ...currentRobot })
            } else if (cmd.type === 'activate') {
                addLog('OP_EJEC: ACT_VINC', 'warn')
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
                if (checkPosition(currentRobot.x, currentRobot.y)) {
                    addLog('FALLO: OBJETIVOS_RESTANTES', 'err')
                    setStatus('failed')
                    onStatusChange('failed', 'sequence-violation')
                    setIsRunning(false)
                    return
                }
            }
            const allTargetsReached = mapData.targets.every(t => activated.has(`${t.x},${t.y}`))
            if (allTargetsReached) {
                //Last item from mapData
                const lastTarget = mapData.targets[mapData.targets.length - 1]
                //Last item from activated
                const lastActivated = Array.from(activated).pop()
                reasonFailed = 'sequence-violation'
                if (lastTarget && lastActivated && lastTarget.x === parseInt(lastActivated.split(',')[0]) && lastTarget.y === parseInt(lastActivated.split(',')[1])) {
                    won = true
                }
                break
            }
        }

        setExecutingIdx(null)
        if (won) {
            addLog('ÉXITO: NODO_SINCRO_COMPLETA', 'success')
            setStatus('success')
            await sleep(600)
            const stars = calcStars(commands.length, commandsF1.length, commandsF2.length, mapData.maxCommands, mapData.maxF1Commands, mapData.maxF2Commands)
            onComplete(stars, state.fragUsed)
        } else {
            addLog('FALLO: OBJETIVOS_RESTANTES', 'err')
            setStatus('failed')
            onStatusChange('failed', reasonFailed)
        }
        setIsRunning(false)
    }, [commands, commandsF1, commandsF2, isRunning, mapData, state.fragUsed, onComplete, addLog, onStatusChange])

    // --------------------------------------------------------
    // MANEJO DE COMANDOS
    // --------------------------------------------------------

    function handleAddCommand(type: CommandType) {
        if (status === 'failed' || status === 'success') handleReset()

        if (type === 'repeat') {
            setRepeatModal(true)
            return
        }
        if (activePanel === 'main') {
            if (commands.length >= (mapData.uiLimitMain || MAX_COMMANDS)) return
            setCommands(prev => [...prev, { type }])
        } else if (activePanel === 'f1') {
            if (commandsF1.length >= (mapData.uiLimitF1 || 8)) return
            setCommandsF1(prev => [...prev, { type }])
        } else {
            if (commandsF2.length >= (mapData.uiLimitF2 || 8)) return
            setCommandsF2(prev => [...prev, { type }])
        }
    }

    function handleRemoveCommand(idx: number, panel?: 'main' | 'f1' | 'f2') {
        if (status === 'failed' || status === 'success') handleReset()
        const targetPanel = panel || activePanel
        if (targetPanel === 'main') setCommands(prev => prev.filter((_, i) => i !== idx))
        else if (targetPanel === 'f1') setCommandsF1(prev => prev.filter((_, i) => i !== idx))
        else setCommandsF2(prev => prev.filter((_, i) => i !== idx))
    }

    function handleClearCommands(panel?: 'main' | 'f1' | 'f2') {
        if (status === 'failed' || status === 'success') handleReset()
        const targetPanel = panel || activePanel
        if (targetPanel === 'main') setCommands([])
        else if (targetPanel === 'f1') setCommandsF1([])
        else setCommandsF2([])
        addLog('BUFFER LIMPÍADO', 'warn')
    }

    function handleReset() {
        closeDirectives()
        setRobot({ ...mapData.robotStart, isMoving: false, isJumping: false })
        setActivated(new Set())
        setIsRunning(false)
        setExecutingIdx(null)
        setStatus('idle')
        onStatusChange('idle')
        addLog('SISTEMA REINICIADO', 'info')
    }

    function handleAddRepeat() {
        if (activePanel === 'main') {
            if (commands.length >= (mapData.uiLimitMain || MAX_COMMANDS)) return
            setCommands(prev => [...prev, { type: 'repeat', times: repeatTimes, children: [] }])
        } else if (activePanel === 'f1') {
            if (commandsF1.length >= (mapData.uiLimitF1 || 8)) return
            setCommandsF1(prev => [...prev, { type: 'repeat', times: repeatTimes, children: [] }])
        } else {
            if (commandsF2.length >= (mapData.uiLimitF2 || 8)) return
            setCommandsF2(prev => [...prev, { type: 'repeat', times: repeatTimes, children: [] }])
        }
        setRepeatModal(false)
    }

    return (
        <div className="flex flex-1 min-h-0 bg-(--bg-void) relative selection:bg-(--green-base) selection:text-(--white) overflow-hidden">
            <div className="flex-1 flex flex-col p-3 md:p-0 gap-0 relative z-10 overflow-hidden">
                <LevelHeader level={level} status={status} isRunning={isRunning} />
                {/* Main Content Layout — Split View */}
                <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                    {/* Sección de Diagnóstico y Logs (Derecha en Desktop) */}
                    {/* System Logs Realtime */}
                    <Panel typePanel='aside' border={["left"]} className='h-full min-h-0 w-[350px] '>
                        <SectionHeader title='DATOS_DE_CAMPO' />
                        <div className='flex flex-col gap-2 pt-2'>
                            <TacticalSection title='LOGS_DE_SISTEMA'>
                                <SystemLogRealtime logs={logs} />
                            </TacticalSection>
                            <TacticalSection title='ESTADO_DEL_ROBOT'>
                                <RobotMonitor robot={robot} />
                            </TacticalSection>
                            <TacticalSection title='ESTADO_DE_LA_MISIÓN'>
                                {/* Status Feedback Banner */}
                                <MissionStatusMonitor status={status} />
                            </TacticalSection>
                        </div>
                    </Panel>
                    <div className="flex-3 flex flex-col min-h-0 h-[calc(100svh-128px)]">
                        {/* Sección del Mapa (Centro-Derecha en Desktop) */}
                        <Panel typePanel='main' border={["left", "right"]} className='h-full min-h-0'>
                            <div id="game-canvas-container" className="flex-1 flex items-center justify-center bg-(--bg-void) h-full relative p-2 overflow-hidden shadow-inner">
                                <IsometricCanvas
                                    mapData={mapData}
                                    robot={robot}
                                    activatedTiles={activatedTiles}
                                    status={status}
                                    isScanning={isScanning}
                                />

                                {/* Corner Accents */}
                                <div className="absolute top-4 left-4 w-4 h-4 border-l border-t border-(--green-base)/40" />
                                <div className="absolute top-4 right-4 w-4 h-4 border-r border-t border-(--green-base)/40" />
                                <div className="absolute bottom-4 left-4 w-4 h-4 border-l border-b border-(--green-base)/40" />
                                <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b border-(--green-base)/40" />
                            </div>


                        </Panel>
                        <Panel typePanel='footer'>
                            <div className='flex flex-row items-center p-1.5 gap-2.5 h-28'>
                                <div id="execution-controls" className="  w-full h-full flex flex-row items-center justify-center gap-4">
                                    <Button
                                        id="execute-button"
                                        onClick={executeCommands}
                                        disabled={isRunning || status === 'failed'}
                                        variant={'green'}
                                        showStripes={!isRunning && status === 'idle' && commands.length > 0}
                                        icon={Play}
                                        iconPosition="right"
                                        size="lg"
                                        className="w-full"
                                    >
                                        INICIAR
                                    </Button>

                                    <Button
                                        variant="cyan"
                                        size="lg"
                                        onClick={handleReset}
                                        disabled={isRunning}
                                        className={`w-full text-3xl ${status === 'failed' ? 'border-(--amber)/50 text-(--amber) animate-pulse shadow-[0_0_15px_rgba(239,159,39,0.2)]' : ''}`}
                                        icon={RotateCcwIcon}
                                        iconPosition="right"
                                    >
                                        REINICIAR
                                    </Button>
                                </div>
                                <div className='flex items-start h-full '>
                                    <SpeedSelector />
                                </div>
                                <DirectivesPanel
                                    infoText={level.fragHint}
                                    missionText={level.description}
                                />
                            </div>
                        </Panel>
                    </div>
                </div>
            </div>

            <CommandPalette
                commands={commands}
                commandsF1={commandsF1}
                commandsF2={commandsF2}
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
                status={status}
            />

            {repeatModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/85 animate-in fade-in duration-300">
                    <Panel typePanel='main' id="repeat-modal" className="bg-(--bg-surface) border border-(--border-color) font-mono flex flex-col gap-6 min-w-[300px] shadow-[0_0_60px_rgba(45,120,0,0.2)] relative rounded-sm">
                        <div className="absolute top-2 left-2 text-[8px] text-(--text-ghost) opacity-40 uppercase">Sys_Dialog_v4</div>
                        <SectionHeader title="PROTOCOLO_ITERATIVO" />
                        <div className="pt-8 pb-6">
                            <div className="text-center text-(--text-primary) text-xs mb-4 uppercase tracking-widest">DEFINIR CANTIDAD DE REPETICIONES</div>
                            <div className="flex items-center justify-center gap-6 my-5">
                                <Button
                                    onClick={() => setRepeatTimes(t => Math.max(2, t - 1))}
                                    variant={'outline'}
                                    size="sm"
                                    icon={Minus}
                                    className="w-14"
                                />
                                <div className="flex flex-col items-center">
                                    <span className="text-(--green-light) text-5xl font-mono leading-none animate-in slide-in-from-bottom-2" key={repeatTimes}>{repeatTimes}</span>

                                </div>
                                <Button
                                    onClick={() => setRepeatTimes(t => Math.min(10, t + 1))}
                                    variant={'outline'}
                                    size="sm"
                                    icon={Plus}
                                    className="w-14"
                                />
                            </div>
                        </div>

                        <Panel typePanel='footer' className="flex flex-row items-center justify-center gap-4 p-2">
                            <Button
                                onClick={handleAddRepeat}
                                variant={'green'}
                                size="sm"
                                className='w-1/2'
                            >
                                Inyectar(n)
                            </Button>
                            <Button
                                onClick={() => setRepeatModal(false)}
                                variant={'red'}
                                size="sm"
                                className='w-1/2'
                            >
                                Abortar
                            </Button>
                        </Panel>
                    </Panel>
                </div>
            )}

        </div>
    )
}
