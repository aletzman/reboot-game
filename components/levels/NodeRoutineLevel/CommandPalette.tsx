'use client'

import { Command, CommandType, NodeRoutineLevelData } from '@/types/game'
import { GameButton } from '@/components/ui/GameButton'
import { ButtonOption } from '@/components/ui/ButtonOption'
import { Button } from '@/components/ui/Button'
import { PlayIcon, StepForward, RotateCcwIcon, PackageOpen } from 'lucide-react'
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
    onRemoveCommand: (idx: number) => void
    onClearCommands: () => void
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
                <div className="memory-bar-container">
                    <div
                        className="memory-bar-fill shadow-[0_0_8px_var(--green-base)]"
                        style={{
                            width: `${usagePercent}%`,
                            backgroundColor: usagePercent > 90 ? 'var(--red)' : usagePercent > 70 ? 'var(--amber)' : 'var(--green-base)'
                        }}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 p-4">
                {/* Paleta de comandos */}
                <section>
                    <div className="terminal-header mb-3">
                        <span>// BANCO_COMANDOS</span>
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
                <section className="flex flex-col cursor-pointer group" onClick={() => !isRunning && setActivePanel('main')}>
                    <div className={`terminal-header mb-1 transition-colors ${activePanel === 'main' ? 'text-(--green-light) border-b-(--green-base)' : 'opacity-60'}`}>
                        <div className="flex items-center gap-2">
                            {activePanel === 'main' && <span className="w-1.5 h-1.5 bg-(--green-light) rounded-full animate-pulse" />}
                            <span>01_MAIN_ROUTINE</span>
                        </div>
                        {commands.length > 0 && !isRunning && activePanel === 'main' && (
                            <button onClick={(e) => { e.stopPropagation(); onClearCommands(); }} className="hover:text-(--red) transition-colors text-[9px]">[BORRAR]</button>
                        )}
                    </div>

                    <div className={`flex flex-wrap gap-[6px] min-h-[100px] bg-(--bg-deep) p-3 border transition-all content-start relative overflow-hidden ${activePanel === 'main' ? 'border-(--green-base)/50 shadow-[inset_0_0_15px_rgba(85,226,0,0.05)]' : 'border-(--bg-hover)'}`}>
                        {commands.length === 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-(--text-ghost) opacity-20 group-hover:opacity-40 transition-opacity">
                                <PackageOpen size={24} strokeWidth={1} />
                                <span className="text-[10px] mt-1 tracking-[.2em]">VOID_SECTOR</span>
                            </div>
                        )}
                        {commands.map((cmd, idx) => {
                            const palette = PALETTE_COMMANDS.find(p => p.type === cmd.type)
                            const isExec = executingIdx?.panel === 'main' && executingIdx.idx === idx
                            const IconComp = palette?.icon
                            return (
                                <GameButton
                                    key={idx}
                                    variant="command"
                                    active={isExec}
                                    icon={<span className="text-[13px]">{IconComp && <IconComp size={13} />}</span>}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (!isRunning && activePanel === 'main') onRemoveCommand(idx)
                                    }}
                                    disabled={isRunning}
                                    accentColor={palette?.cssColor}
                                    className="px-2 py-[5px] text-[10px] animate-fade-in-up"
                                >
                                    {cmd.type === 'repeat' && cmd.times ? `×${cmd.times}` : ''}
                                </GameButton>
                            )
                        })}
                    </div>
                </section>

                {/* Secuencia - F1 */}
                {mapData.allowF1 && (
                    <section className="flex flex-col cursor-pointer group" onClick={() => !isRunning && setActivePanel('f1')}>
                        <div className={`terminal-header mb-1 transition-colors ${activePanel === 'f1' ? 'text-(--cyan) border-b-(--cyan)' : 'opacity-60'}`}>
                            <div className="flex items-center gap-2">
                                {activePanel === 'f1' && <span className="w-1.5 h-1.5 bg-(--cyan) rounded-full animate-pulse" />}
                                <span>02_SUB_F1</span>
                            </div>
                            {commandsF1.length > 0 && !isRunning && activePanel === 'f1' && (
                                <button onClick={(e) => { e.stopPropagation(); onClearCommands(); }} className="hover:text-(--red) transition-colors text-[9px]">[BORRAR]</button>
                            )}
                        </div>

                        <div className={`flex flex-wrap gap-[6px] min-h-[60px] bg-(--bg-deep) p-3 border transition-all content-start relative ${activePanel === 'f1' ? 'border-(--cyan)/50 shadow-[inset_0_0_15px_rgba(25,200,212,0.05)]' : 'border-(--bg-hover)'}`}>
                            {commandsF1.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center text-(--text-ghost) opacity-20 group-hover:opacity-40 transition-opacity">
                                    <span className="text-[9px] tracking-[.3em]">EMPTY_SUB</span>
                                </div>
                            )}
                            {commandsF1.map((cmd, idx) => {
                                const palette = PALETTE_COMMANDS.find(p => p.type === cmd.type)
                                const isExec = executingIdx?.panel === 'f1' && executingIdx.idx === idx
                                const IconComp = palette?.icon
                                return (
                                    <GameButton
                                        key={`f1-${idx}`}
                                        variant="command"
                                        active={isExec}
                                        icon={<span className="text-[13px]">{IconComp && <IconComp size={13} />}</span>}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (!isRunning && activePanel === 'f1') onRemoveCommand(idx)
                                        }}
                                        disabled={isRunning}
                                        accentColor={palette?.cssColor}
                                        className="px-2 py-[5px] text-[10px] animate-fade-in-up"
                                    >
                                        {cmd.type === 'repeat' && cmd.times ? `×${cmd.times}` : ''}
                                    </GameButton>
                                )
                            })}
                        </div>
                    </section>
                )}
            </div>

            {/* Panel de Control Inferior */}
            <div className="p-4 bg-(--bg-deep)/80 border-t border-(--bg-hover) flex flex-col gap-2">
                <Button
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

                <div className="grid grid-cols-2 gap-2">
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
