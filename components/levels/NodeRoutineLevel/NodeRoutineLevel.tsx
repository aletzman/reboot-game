'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { LevelState, Command, CommandType } from '@/types/game'
import { ShieldAlert, Cpu, Share2, Terminal, Database, ArrowRight } from 'lucide-react'
import { useAudioStore } from '@/store/audio.store'
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

import { NodeRoutineLevelProps, ExtendedRobotState } from './types'
import { NODEROUTINE_MAPS, DEFAULT_MAP, MAX_COMMANDS, EXEC_SPEED } from './constants'
import { sleep, flattenCommands, getNextPosition, turnLeft, turnRight, calcStars } from './utils'
import { IsometricCanvas } from './IsometricCanvas'
import { CommandPalette } from './CommandPalette'
import { NODE_ROUTINE_TUTORIAL, TUTORIAL_CONFIG } from './tutorialSteps'

export default function NodeRoutineLevel({ level, state, onComplete, onFragUse, onStatusChange }: NodeRoutineLevelProps) {
    const mapData = NODEROUTINE_MAPS[level.id] ?? DEFAULT_MAP
    const moveSoundRef = useRef<HTMLAudioElement | null>(null)
    const jumpSoundRef = useRef<HTMLAudioElement | null>(null)
    const activateSoundRef = useRef<HTMLAudioElement | null>(null)

    const { sfxVolume, isMuted } = useAudioStore()

    // Logs del sistema para la terminal "coleta"
    const [logs, setLogs] = useState<{ id: string, msg: string, type: 'info' | 'warn' | 'success' | 'err' }[]>([
        { id: 'boot', msg: 'SISTEMA_REBOOT_V4 INICIADO...', type: 'info' },
        { id: 'ready', msg: 'ESPERANDO INPUT_DE_RUTINA...', type: 'info' }
    ])

    const addLog = useCallback((msg: string, type: 'info' | 'warn' | 'success' | 'err' = 'info') => {
        setLogs(prev => [{ id: Math.random().toString(), msg, type }, ...prev].slice(0, 5))
    }, [])

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
    const [status, setStatus] = useState<LevelState['status']>('idle')
    const [isScanning, setIsScanning] = useState(false)
    const [repeatModalOpen, setRepeatModal] = useState(false)
    const [repeatTimes, setRepeatTimes] = useState(2)

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
        // Solo lanzamos el tutorial en el primer nivel del Acto 1 por defecto
        // O si el nivel tiene una marca de tutorial específica
        if (level.id !== '1-01') return;

        const timer = setTimeout(() => {
            const driverObj = driver({
                ...TUTORIAL_CONFIG,
                steps: NODE_ROUTINE_TUTORIAL
            });

            driverObj.drive();
        }, 1000);

        return () => clearTimeout(timer);
    }, [level.id]);

    // --------------------------------------------------------
    // EJECUTAR SECUENCIA
    // --------------------------------------------------------

    const executeCommands = useCallback(async () => {
        if (isRunning || commands.length === 0) return
        setIsRunning(true)
        setStatus('playing')
        onStatusChange('playing')
        addLog('EJECUTANDO RUTINA_PRINCIPAL...', 'info')

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
                    onStatusChange('failed')
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
            }

            const allTargetsReached = mapData.targets.every(t => activated.has(`${t.x},${t.y}`))
            if (allTargetsReached) {
                won = true
                break
            }
        }

        setExecutingIdx(null)
        if (won) {
            addLog('ÉXITO: NODO_SINCRO_COMPLETA', 'success')
            setStatus('success')
            await sleep(600)
            const stars = calcStars(commands.length, commandsF1.length, mapData.maxCommands, mapData.maxF1Commands)
            onComplete(stars, state.fragUsed)
        } else {
            addLog('FALLO: OBJETIVOS_RESTANTES', 'err')
            setStatus('failed')
            onStatusChange('failed')
        }
        setIsRunning(false)
    }, [commands, commandsF1, isRunning, mapData, state.fragUsed, onComplete, addLog, onStatusChange])

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
        } else {
            if (commandsF1.length >= (mapData.uiLimitF1 || 8)) return
            setCommandsF1(prev => [...prev, { type }])
        }
    }

    function handleRemoveCommand(idx: number, panel?: 'main' | 'f1') {
        if (status === 'failed' || status === 'success') handleReset()
        const targetPanel = panel || activePanel
        if (targetPanel === 'main') setCommands(prev => prev.filter((_, i) => i !== idx))
        else setCommandsF1(prev => prev.filter((_, i) => i !== idx))
    }

    function handleClearCommands(panel?: 'main' | 'f1') {
        if (status === 'failed' || status === 'success') handleReset()
        const targetPanel = panel || activePanel
        if (targetPanel === 'main') setCommands([])
        else setCommandsF1([])
        addLog('BUFFER LIMPÍADO', 'warn')
    }

    function handleReset() {
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
        } else {
            if (commandsF1.length >= (mapData.uiLimitF1 || 8)) return
            setCommandsF1(prev => [...prev, { type: 'repeat', times: repeatTimes, children: [] }])
        }
        setRepeatModal(false)
    }

    return (
        <div className="flex flex-1 min-h-0 bg-(--bg-void) relative selection:bg-(--green-base) selection:text-(--white) overflow-hidden">

            {/* Decoración de fondo de consola ciberdeck */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-radial-gradient from-(--green-base) to-transparent" />
                <div className="grid grid-cols-20 h-full w-full">
                    {Array.from({ length: 400 }).map((_, i) => (
                        <div key={i} className="border-[0.5px] border-(--green-base)/20 h-10 w-full" />
                    ))}
                </div>
            </div>

            {/* PANEL IZQUIERDO — Interfaz Ciberdeck */}
            <div className="flex-1 flex flex-col p-4 md:p-6 gap-4 relative z-10 overflow-hidden">

                {/* Tactical Header V2 */}
                <div className="grid grid-cols-12 gap-4 border-b border-(--bg-hover) pb-4 mb-2 bg-(--bg-surface)/20 p-2 rounded-t-lg">
                    <div className="col-span-12 md:col-span-5 flex flex-col">
                        <div className="flex items-center gap-3 mb-1.5">
                            <div className="relative">
                                <span className={`absolute inset-0 rounded-full ${isRunning ? 'bg-(--amber)' : 'bg-(--green-light)'} opacity-40`} />
                                <span className={`relative block w-3 h-3 rounded-full ${isRunning ? 'bg-(--amber) animate-pulse' : 'bg-(--green-light)'} shadow-[0_0_10px_currentColor]`} />
                            </div>
                            <h1 id="level-title" className="text-2xl font-mono font-bold tracking-tighter text-(--text-primary)">
                                {level.title.toUpperCase()}
                            </h1>
                            <div className="px-2 py-0.5 border border-(--bg-hover) bg-(--bg-deep) text-[9px] font-mono text-(--text-ghost) rounded">
                                ACT_0{level.act}_NODO
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-1">
                            <div className="flex items-center gap-2">
                                <ShieldAlert size={10} className="text-(--amber)" />
                                <span className="hud-label text-[10px]">AUTH:</span>
                                <span className="text-[10px] font-mono text-(--green-light)">SYS_OPERATOR</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Cpu size={10} className="text-(--green-muted)" />
                                <span className="hud-label text-[10px]">ADDR:</span>
                                <span className="text-[10px] font-mono font-bold text-(--text-primary)">{level.id}</span>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-6 md:col-span-4 flex items-center justify-center border-x border-(--bg-hover)/30 px-4">
                        <div className="w-full flex flex-col gap-1.5">
                            <div className="flex justify-between items-end">
                                <span className="text-[9px] font-mono text-(--text-ghost)">SIGNAL_STRENGTH</span>
                                <span className="text-[9px] font-mono text-(--green-light)">98.4%</span>
                            </div>
                            <div className="h-1 w-full bg-(--bg-deep) rounded-full overflow-hidden border border-(--bg-hover)/50">
                                <div className="h-full bg-linear-to-r from-(--green-dark) to-(--green-light) w-[98%]" />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-6 md:col-span-3 flex flex-col items-end justify-center">
                        <div className="hud-label text-[9px] mb-1">DATA_STREAM:</div>
                        <div className={`px-4 py-1.5 border-2 text-[11px] font-mono tracking-[.25em] font-bold shadow-sm transition-all duration-300 ${status === 'success' ? 'border-(--green-base) text-(--green-light) bg-(--green-darkest)' : status === 'failed' ? 'border-(--red) text-(--red) bg-(--red)/10' : isRunning ? 'border-(--amber) text-(--amber) bg-(--amber)/10' : 'border-(--bg-hover) text-(--text-ghost) bg-(--bg-deep)'}`}>
                            {status === 'success' ? '>> REINICIO_OK' : status === 'failed' ? '!! FALLO_SEC' : isRunning ? '>> PROT_EJEC' : '>> MODO_STBY'}
                        </div>
                    </div>
                </div>

                {/* Main Content Layout — Split View */}
                <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">

                    {/* Sección del Mapa (Centro-Derecha en Desktop) */}
                    <div className="flex-3 flex flex-col gap-4 min-h-0 p-[2px]">
                        <div id="game-canvas-container" className="flex-1 flex items-center justify-center relative bg-(--bg-deep)/40 rounded-sm border border-(--bg-hover)/50 p-2 overflow-hidden shadow-inner">
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

                            {/* Floating Metadata Information Overlay */}
                            <div className="absolute bottom-6 left-6 flex flex-col gap-1 pointer-events-none">
                                <div className="flex items-center gap-3 bg-(--bg-surface)/80 px-3 py-1.5 border border-(--bg-hover) rounded-sm">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-mono text-(--text-ghost) leading-none mb-1 uppercase">Local_Coords</span>
                                        <span className="text-xs font-mono text-(--green-light) tabular-nums">X:{robot.x.toFixed(1)} Y:{robot.y.toFixed(1)}</span>
                                    </div>
                                    <div className="w-px h-6 bg-(--bg-hover)" />
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-mono text-(--text-ghost) leading-none mb-1 uppercase">Robot_Status</span>
                                        <span className={`text-xs font-mono tabular-nums ${isRunning ? 'text-(--amber)' : 'text-(--green-muted)'}`}>IDLE_LOCKED</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Feedback Banner */}
                        <div className="h-10 flex items-center justify-center overflow-hidden">
                            {status === 'failed' && (
                                <div className="w-full text-(--red) flex items-center gap-4 bg-(--red)/5 px-6 py-2 border border-(--red)/30 rounded-md animate-in slide-in-from-bottom-2 duration-300">
                                    <ShieldAlert size={16} />
                                    <span className="text-[11px] font-mono font-bold tracking-[.2em] uppercase">Anomalía_De_Secuencia: Re-calibrando buffers locales...</span>
                                </div>
                            )}
                            {status === 'success' && (
                                <div className="w-full text-(--green-light) flex items-center gap-4 bg-(--green-base)/10 px-6 py-2 border border-(--green-base)/40 rounded-md animate-in slide-in-from-bottom-2 duration-300">
                                    <Share2 size={16} className="animate-pulse" />
                                    <span className="text-[11px] font-mono font-bold tracking-[.2em] uppercase">Nivel_Sincronizado: Conexión establecida con el sector {level.act}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sección de Diagnóstico y Logs (Derecha en Desktop) */}
                    <div className="flex-1 flex flex-col gap-4 min-w-[280px] p-[2px]">

                        {/* Objetivo del Nivel en Box táctico */}
                        <div id="mission-objective" className="bg-(--bg-surface) border border-(--bg-hover) p-4 relative rounded-sm overflow-hidden min-h-[140px] flex flex-col">
                            <div className="absolute top-0 left-0 w-1 h-full bg-(--green-base)" />
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-[10px] font-mono font-bold text-(--text-ghost) uppercase tracking-widest flex items-center gap-2">
                                    <Database size={12} className="text-(--green-base)" />
                                    Objetivo_Misión
                                </h3>
                            </div>
                            <p className="text-[13px] text-(--text-primary)/90 font-sans leading-relaxed flex-1">
                                {level.description || 'Debe inyectar una secuencia de comandos válida para activar los nodos de respuesta del sector.'}
                            </p>
                            <div className="mt-4 flex items-center gap-2 border-t border-(--bg-hover) pt-3 opacity-60">
                                <ArrowRight size={10} className="text-(--green-light)" />
                                <span className="text-[9px] font-mono text-(--text-ghost) uppercase">Nodos: {mapData.targets.length} | Comandos: {mapData.maxCommands}</span>
                            </div>
                        </div>

                        {/* System Logs Realtime */}
                        <div id="system-logs" className="flex-1 bg-(--bg-deep) border border-(--bg-hover) rounded-sm flex flex-col overflow-hidden max-h-[300px]">
                            <div className="bg-(--bg-surface) px-3 py-1.5 border-b border-(--bg-hover) flex justify-between items-center">
                                <span className="text-[10px] font-mono font-bold text-(--text-primary) tracking-widest uppercase flex items-center gap-2">
                                    <Terminal size={12} className="text-(--green-light)" />
                                    System_Log
                                </span>
                                <div className="flex gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-(--green-base)/30 rounded-full" />
                                    <div className="w-1.5 h-1.5 bg-(--green-base)/30 rounded-full" />
                                </div>
                            </div>
                            <div className="flex-1 p-3 flex flex-col-reverse gap-2 overflow-y-auto custom-scrollbar font-mono text-[10px] leading-tight">
                                {logs.map(log => (
                                    <div key={log.id} className={`flex gap-2 animate-in slide-in-from-left-2 fade-in duration-300 ${log.type === 'err' ? 'text-(--red)' : log.type === 'warn' ? 'text-(--amber)' : log.type === 'success' ? 'text-(--green-light)' : 'text-(--text-muted)'}`}>
                                        <span className="opacity-50 shrink-0 select-none">[{">"}]</span>
                                        <span className="wrap-break-words">{log.msg}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-(--bg-surface)/50 p-1 px-3 border-t border-(--bg-hover) flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-(--green-base) rounded-full animate-pulse" />
                                <span className="text-[8px] text-(--text-ghost) font-mono uppercase tracking-tighter">Live_Telemetry_Feed_Active</span>
                            </div>
                        </div>
                    </div>
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
                status={status}
            />

            {repeatModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/85 animate-in fade-in duration-300">
                    <div className="bg-(--bg-surface) border border-(--green-base)/40 p-8 font-mono flex flex-col gap-6 min-w-[300px] shadow-[0_0_60px_rgba(45,120,0,0.2)] relative rounded-sm">
                        <div className="absolute top-2 left-2 text-[8px] text-(--text-ghost) opacity-40 uppercase">Sys_Dialog_v4</div>

                        <div className="text-(--green-light) text-[11px] tracking-[.2em] uppercase border-b border-(--bg-hover) pb-3 flex items-center justify-between">
                            <span>// PROTOCOLO_ITERATIVO</span>
                        </div>

                        <div className="py-4">
                            <div className="text-center text-(--text-ghost) text-[10px] mb-4 uppercase tracking-widest">DEFINIR_CANTIDAD_CICLOS</div>
                            <div className="flex items-center justify-center gap-6">
                                <button onClick={() => setRepeatTimes(t => Math.max(2, t - 1))} className="w-10 h-10 flex items-center justify-center border border-(--bg-hover) hover:border-(--green-base) bg-(--bg-deep) transition-colors rounded-md">−</button>
                                <div className="flex flex-col items-center">
                                    <span className="text-(--green-light) text-5xl font-mono leading-none animate-in slide-in-from-bottom-2" key={repeatTimes}>{repeatTimes}</span>
                                    <span className="text-[9px] text-(--text-ghost) mt-3 opacity-60 uppercase tracking-widest">Iteraciones</span>
                                </div>
                                <button onClick={() => setRepeatTimes(t => Math.min(10, t + 1))} className="w-10 h-10 flex items-center justify-center border border-(--bg-hover) hover:border-(--green-base) bg-(--bg-deep) transition-colors rounded-md">+</button>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button
                                onClick={handleAddRepeat}
                                className="flex-1 h-10 bg-(--green-dark) border border-(--green-base) text-(--white) font-mono text-xs uppercase tracking-widest hover:bg-(--green-base) transition-colors rounded-sm shadow-[0_0_15px_rgba(45,120,0,0.2)]"
                            >
                                Inyectar(n)
                            </button>
                            <button
                                onClick={() => setRepeatModal(false)}
                                className="flex-1 h-10 border border-(--bg-hover) text-(--text-muted) font-mono text-xs uppercase tracking-widest hover:text-(--text-primary) hover:bg-(--bg-hover) transition-all rounded-sm"
                            >
                                Abortar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}
