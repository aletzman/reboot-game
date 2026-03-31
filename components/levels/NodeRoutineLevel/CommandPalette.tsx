'use client'

import { Command, CommandType, NodeRoutineLevelData } from '@/types/game'
import { GameButton } from '@/components/ui/GameButton'
import { Button } from '@/components/ui/Button'
import { PlayIcon, StepForward, RotateCcwIcon } from 'lucide-react'
import { PALETTE_COMMANDS, MAX_COMMANDS } from './constants'

interface CommandPaletteProps {
    commands: Command[]
    commandsF1: Command[]
    activePanel: 'main' | 'f1'
    isRunning: boolean
    executingIdx: { idx: number; panel: 'main' | 'f1' } | null
    mapData: NodeRoutineLevelData
    setActivePanel: (panel: 'main' | 'f1') => void
    onAddCommand: (type: CommandType) => void
    onRemoveCommand: (idx: number, panel?: 'main' | 'f1') => void
    onClearCommands: (panel?: 'main' | 'f1') => void
    onExecute: () => void
    onReset: () => void
    status: 'idle' | 'playing' | 'success' | 'failed' | 'reviewing'
}

export function CommandPalette({
    commands,
    commandsF1,
    activePanel,
    isRunning,
    executingIdx,
    mapData,
    setActivePanel,
    onAddCommand,
    onRemoveCommand,
    onClearCommands,
    onExecute,
    onReset,
    status
}: CommandPaletteProps) {
    const allowedTools = mapData.allowedCommands
        ? PALETTE_COMMANDS.filter(cmd => mapData.allowedCommands?.includes(cmd.type))
        : PALETTE_COMMANDS

    const mainLimit = mapData.uiLimitMain || MAX_COMMANDS
    const f1Limit = mapData.uiLimitF1 || 8
    const totalLimit = mainLimit + (mapData.allowF1 ? f1Limit : 0)
    const currentTotal = commands.length + (mapData.allowF1 ? commandsF1.length : 0)
    const usagePercent = Math.min(100, (currentTotal / totalLimit) * 100)

    return (
        <div className="w-[320px] shrink-0 flex flex-col bg-(--bg-surface) border-l border-(--bg-hover) shadow-2xl relative z-20">

            {/* Memory / CPU Usage Header */}
            <div className="p-4 border-b border-(--bg-hover) bg-(--bg-deep)/50">
                <div className="flex justify-between items-end mb-2">
                    <span className="hud-label">MEMORIA_SECUENCIA</span>
                    <span className={`font-mono text-[10px] ${usagePercent > 90 ? 'text-(--red)' : usagePercent > 70 ? 'text-(--amber)' : 'text-(--green-light)'}`}>
                        {currentTotal}/{totalLimit} UTS
                    </span>
                </div>
                <div
                    className="memory-bar-container w-full bg-[#010101] border border-[#141B24] rounded-[1px] relative overflow-hidden"
                    style={{ height: '12px', padding: '2px' }}
                >
                    {/* Background segments track */}
                    <div className="absolute inset-0 z-0 opacity-10 flex gap-[2px] px-[2px] py-[2px]">
                        {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="flex-1 h-full bg-[#E6EDF3]" />
                        ))}
                    </div>

                    {/* Progress Fill */}
                    <div
                        className="h-full relative z-10 transition-all duration-500 ease-out"
                        style={{
                            width: `${usagePercent}%`,
                            backgroundColor: usagePercent > 90 ? '#E24B4A' : usagePercent > 70 ? '#EF9F27' : '#55e200',
                            boxShadow: `0 0 10px ${usagePercent > 90 ? '#E24B4A' : usagePercent > 70 ? '#EF9F27' : '#55e200'}80`,
                            backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.2), transparent, rgba(0,0,0,0.2))'
                        }}
                    />

                    {/* Block separation grid overlay */}
                    <div className="absolute inset-0 z-20 pointer-events-none flex gap-[2px] px-[2px] py-[2px]">
                        {Array.from({ length: 15 }).map((_, i) => (
                            <div key={i} className="flex-1 h-full border-r border-[#010101]/40 last:border-0" />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 p-4">
                {/* Paleta de comandos */}
                <section id="command-bank">
                    <div className="terminal-header mb-3">
                        <span>// ACCIONES_DISPONIBLES</span>
                        <span className="opacity-40">EXT.V4</span>
                    </div>
                    <div className="grid grid-cols-2 gap-[6px]">
                        {allowedTools.map(cmd => (
                            <GameButton
                                key={cmd.type}
                                variant="command"
                                icon={<span className="text-[14px]"><cmd.icon size={14} /></span>}
                                onClick={() => onAddCommand(cmd.type)}
                                disabled={
                                    isRunning ||
                                    (activePanel === 'main' && commands.length >= mainLimit) ||
                                    (activePanel === 'f1' && commandsF1.length >= f1Limit)
                                }
                                accentColor={cmd.cssColor}
                            >
                                {cmd.label}
                            </GameButton>
                        ))}
                    </div>
                </section>

                {/* Secuencia - PRINCIPAL */}
                <section id="main-routine" className="flex flex-col cursor-pointer group" onClick={() => !isRunning && setActivePanel('main')}>
                    <div className={`terminal-header mb-2 transition-colors ${activePanel === 'main' ? 'text-(--green-light) border-b-(--green-base)' : 'opacity-60'}`}>
                        <div className="flex items-center gap-2">
                            {activePanel === 'main' && <span className="w-1.5 h-1.5 bg-(--green-light) rounded-full animate-pulse shadow-[0_0_5px_var(--green-light)]" />}
                            <span className="font-bold tracking-widest text-[11px]">01_BLOQUE_RUTINA</span>
                        </div>
                        {commands.length > 0 && !isRunning && activePanel === 'main' && (
                            <button onClick={(e) => { e.stopPropagation(); onClearCommands('main'); }} className="hover:text-(--red) transition-colors text-[9px] font-mono">[RESET_SEC]</button>
                        )}
                    </div>

                    <div className={`relative min-h-[120px] bg-(--bg-deep) p-3 border-2 transition-all duration-300 grid grid-cols-5 gap-1.5 shadow-inner overflow-hidden ${activePanel === 'main'
                        ? 'border-(--green-base)/40 shadow-[inset_0_0_25px_rgba(85,226,0,0.08)]'
                        : 'border-(--bg-hover) bg-(--bg-deep)/50 grayscale-[0.4]'
                        }`}>
                        {/* Hardware background pattern */}
                        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(var(--green-base) 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />

                        {/* Slot Placeholders */}
                        {Array.from({ length: mainLimit }).map((_, i) => (
                            <div
                                key={`slot-${i}`}
                                className={`aspect-square border border-dashed rounded-[1px] flex items-center justify-center transition-colors duration-500 z-10 ${i < commands.length ? 'border-transparent opacity-100' : 'border-(--bg-hover) opacity-30'
                                    } ${activePanel === 'main' && i === commands.length ? 'border-(--green-base)/30 bg-(--green-base)/5 animate-pulse' : ''}`}
                            >
                                {i >= commands.length && (
                                    <span className="text-[7px] font-mono text-(--text-ghost) select-none">
                                        {(i + 1).toString().padStart(2, '0')}
                                    </span>
                                )}
                            </div>
                        ))}

                        {/* Actual Command Items */}
                        <div className="absolute inset-0 z-20 p-3 grid grid-cols-6 gap-1.5 content-start pointer-events-none">
                            {commands.map((cmd, idx) => {
                                const palette = PALETTE_COMMANDS.find(p => p.type === cmd.type)
                                const isExec = executingIdx?.panel === 'main' && executingIdx.idx === idx
                                const IconComp = palette?.icon
                                return (
                                    <div key={idx} className="pointer-events-auto">
                                        <GameButton
                                            variant="command"
                                            active={isExec}
                                            icon={
                                                <div className="relative flex items-center justify-center">
                                                    {IconComp && <IconComp size={16} strokeWidth={2} />}
                                                    {cmd.type === 'repeat' && cmd.times && (
                                                        <div className="absolute -bottom-3 -right-3 text-(--amber) text-[10px] font-bold px-0.5 min-w-[10px] text-center leading-tight clip-path-notch opacity-90 z-30">
                                                            <span className="text-[8px]">x</span>{cmd.times}
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (!isRunning) {
                                                    setActivePanel('main')
                                                    onRemoveCommand(idx, 'main')
                                                }
                                            }}
                                            disabled={isRunning}
                                            accentColor={palette?.cssColor}
                                            className="w-full aspect-square p-0 flex items-center justify-center text-[9px] animate-fade-in-up"
                                        >
                                            {null}
                                        </GameButton>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Secuencia - F1 */}
                {mapData.allowF1 && (
                    <section id="f1-routine" className="flex flex-col cursor-pointer group" onClick={() => !isRunning && setActivePanel('f1')}>
                        <div className={`terminal-header mb-2 transition-colors ${activePanel === 'f1' ? 'text-(--cyan) border-b-(--cyan)' : 'opacity-60'}`}>
                            <div className="flex items-center gap-2">
                                {activePanel === 'f1' && <span className="w-1.5 h-1.5 bg-(--cyan) rounded-full animate-pulse shadow-[0_0_5px_var(--cyan)]" />}
                                <span className="font-bold tracking-widest text-[11px]">02_SUB_RUTINA_F1</span>
                            </div>
                            {commandsF1.length > 0 && !isRunning && activePanel === 'f1' && (
                                <button onClick={(e) => { e.stopPropagation(); onClearCommands('f1'); }} className="hover:text-(--red) transition-colors text-[9px] font-mono">[RESET_F1]</button>
                            )}
                        </div>

                        <div className={`relative min-h-[80px] bg-(--bg-deep) p-3 border-2 transition-all duration-300 grid grid-cols-5 gap-1.5 shadow-inner overflow-hidden ${activePanel === 'f1'
                            ? 'border-(--cyan)/40 shadow-[inset_0_0_25px_rgba(25,200,212,0.08)]'
                            : 'border-(--bg-hover) bg-(--bg-deep)/50 grayscale-[0.4]'
                            }`}>
                            {/* Hardware background pattern (Cyan) */}
                            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(var(--cyan) 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />

                            {/* Slot Placeholders */}
                            {Array.from({ length: f1Limit }).map((_, i) => (
                                <div
                                    key={`f1-slot-${i}`}
                                    className={`aspect-square border border-dashed rounded-[1px] flex items-center justify-center transition-colors duration-500 z-10 ${i < commandsF1.length ? 'border-transparent opacity-100' : 'border-(--bg-hover) opacity-30'
                                        } ${activePanel === 'f1' && i === commandsF1.length ? 'border-(--cyan)/30 bg-(--cyan)/5 animate-pulse' : ''}`}
                                >
                                    {i >= commandsF1.length && (
                                        <span className="text-[7px] font-mono text-(--text-ghost) select-none">
                                            {(i + 1).toString().padStart(2, '0')}
                                        </span>
                                    )}
                                </div>
                            ))}

                            {/* Actual Command Items */}
                            <div className="absolute inset-0 z-20 p-3 grid grid-cols-6 gap-1.5 content-start pointer-events-none">
                                {commandsF1.map((cmd, idx) => {
                                    const palette = PALETTE_COMMANDS.find(p => p.type === cmd.type)
                                    const isExec = executingIdx?.panel === 'f1' && executingIdx.idx === idx
                                    const IconComp = palette?.icon
                                    return (
                                        <div key={`f1-${idx}`} className="pointer-events-auto">
                                            <GameButton
                                                key={`f1-btn-${idx}`}
                                                variant="command"
                                                active={isExec}
                                                icon={
                                                    <div className="relative flex items-center justify-center">
                                                        {IconComp && <IconComp size={16} strokeWidth={2} />}
                                                        {cmd.type === 'repeat' && cmd.times && (
                                                            <div className="absolute -bottom-1.5 -right-1.5 bg-(--bg-void) border border-(--amber)/50 text-(--amber) text-[7.5px] font-bold px-0.5 min-w-[10px] text-center leading-tight clip-path-notch opacity-90 z-30">
                                                                {cmd.times}
                                                            </div>
                                                        )}
                                                    </div>
                                                }
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    if (!isRunning) {
                                                        setActivePanel('f1')
                                                        onRemoveCommand(idx, 'f1')
                                                    }
                                                }}
                                                disabled={isRunning}
                                                accentColor={palette?.cssColor}
                                                className="w-full aspect-square p-0 flex items-center justify-center text-[9px] animate-fade-in-up"
                                            >
                                                {null}
                                            </GameButton>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {/* Panel de Control Inferior */}
            <div className="p-4 bg-(--bg-deep)/80 border-t border-(--bg-hover) flex flex-col gap-2">
                <Button
                    id="execute-button"
                    variant="solid"
                    size="sm"
                    onClick={onExecute}
                    disabled={isRunning || commands.length === 0 || status === 'failed'}
                    className={`w-full transition-all duration-300 ${isRunning || status === 'failed' ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:scale-[1.02] shadow-[0_0_20px_rgba(85,226,0,0.1)]'} ${status === 'failed' ? 'border-(--red)/50 text-(--red)' : ''}`}
                    icon={isRunning ? StepForward : PlayIcon}
                    iconPosition="left"
                >
                    {status === 'failed' ? 'SISTEMA BLOQUEADO' : isRunning ? 'PROCESANDO...' : 'EJECUTAR RUTINA'}
                </Button>

                <div id="execution-controls" className="grid grid-cols-2 gap-2">
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={onReset}
                        disabled={isRunning}
                        className={`w-full text-[10px] ${status === 'failed' ? 'border-(--amber)/50 text-(--amber) animate-pulse shadow-[0_0_15px_rgba(239,159,39,0.2)]' : ''}`}
                        icon={RotateCcwIcon}
                        iconPosition="left"
                    >
                        REINICIAR
                    </Button>
                    <div className="flex items-center justify-center p-1 border border-(--bg-hover) bg-(--bg-void)">
                        {mapData.maxCommands && (
                            <div className="font-mono text-[9px] text-(--text-ghost) text-center leading-tight">
                                <span className="text-(--amber)">★</span> {mapData.maxCommands + (mapData.maxF1Commands || 0)} MAX
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
