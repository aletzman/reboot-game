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
    onReset
}: CommandPaletteProps) {
    const allowedTools = mapData.allowedCommands
        ? PALETTE_COMMANDS.filter(cmd => mapData.allowedCommands?.includes(cmd.type))
        : PALETTE_COMMANDS

    return (
        <div className="w-[300px] shrink-0 flex flex-col overflow-y-auto bg-(--bg-surface) border-l border-(--bg-hover) p-5 gap-4">
            {/* Paleta de comandos */}
            <div>
                <div className="font-mono text-[12px] text-(--green-base) tracking-[.12em] mb-2 uppercase">
                    {'// comandos'}
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
                                (activePanel === 'main' && commands.length >= (mapData.uiLimitMain || MAX_COMMANDS)) ||
                                (activePanel === 'f1' && commandsF1.length >= (mapData.uiLimitF1 || 8))
                            }
                            accentColor={cmd.cssColor}
                        >
                            {cmd.label}
                        </GameButton>
                    ))}
                </div>
            </div>

            <div className="separator-glow" />

            {/* Secuencia - PRINCIPAL */}
            <div className="flex-1 flex flex-col cursor-pointer" onClick={() => !isRunning && setActivePanel('main')}>
                <div className="flex justify-between items-center mb-2">
                    <div className={`font-mono text-[11px] tracking-[.12em] uppercase transition-colors ${activePanel === 'main' ? 'text-(--green-base)' : 'text-(--text-ghost)'}`}>
                        {'// secuencia principal'} ({commands.length}/{mapData.uiLimitMain || MAX_COMMANDS})
                    </div>
                    {commands.length > 0 && !isRunning && activePanel === 'main' && (
                        <ButtonOption
                            text="limpiar"
                            color="red"
                            onClick={onClearCommands}
                        />
                    )}
                </div>

                <div className={`flex flex-wrap gap-[6px] min-h-[80px] bg-(--bg-deep) rounded-[2px] p-3 border transition-colors content-start ${activePanel === 'main' ? 'border-(--green-base)' : 'border-(--bg-hover)'}`}>
                    {commands.length === 0 && (
                        <div className="font-mono text-[10px] text-(--text-ghost) w-full text-center py-4 flex flex-col items-center gap-1 tracking-wider uppercase">
                            <span className="text-base opacity-60"><PackageOpen absoluteStrokeWidth /></span>
                            <span className="text-xs opacity-100 ">vacío</span>
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
                                className="px-2 py-[5px] text-[10px]"
                            >
                                {cmd.type === 'repeat' && cmd.times ? `×${cmd.times}` : ''}
                            </GameButton>
                        )
                    })}
                </div>
            </div>

            {/* Secuencia - F1 */}
            {mapData.allowF1 && (
                <div className="flex-1 flex flex-col cursor-pointer mt-2" onClick={() => !isRunning && setActivePanel('f1')}>
                    <div className="flex justify-between items-center mb-2">
                        <div className={`font-mono text-[12px] tracking-[.12em] uppercase transition-colors ${activePanel === 'f1' ? 'text-(--cyan)' : 'text-(--text-ghost)'}`}>
                            {'// función f1'} ({commandsF1.length}/{mapData.uiLimitF1 || 8})
                        </div>
                        {commandsF1.length > 0 && !isRunning && activePanel === 'f1' && (
                            <ButtonOption
                                text="limpiar"
                                color="red"
                                onClick={onClearCommands}
                            />
                        )}
                    </div>

                    <div className={`flex flex-wrap gap-[6px] min-h-[60px] bg-(--bg-deep) rounded-[2px] p-3 border transition-colors content-start ${activePanel === 'f1' ? 'border-(--cyan)' : 'border-(--bg-hover)'}`}>
                        {commandsF1.length === 0 && (
                            <div className="font-mono text-[10px] text-(--text-ghost) w-full text-center py-2 flex flex-col items-center tracking-wider uppercase">
                                <span>vacío</span>
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
                                    className="px-2 py-[5px] text-[10px]"
                                >
                                    {cmd.type === 'repeat' && cmd.times ? `×${cmd.times}` : ''}
                                </GameButton>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className="separator-glow" />

            {/* Controles */}
            <div className="flex flex-col gap-2">
                <Button
                    variant="solid"
                    size="sm"
                    onClick={onExecute}
                    disabled={isRunning || commands.length === 0}
                    className="w-full"
                    icon={isRunning ? StepForward : PlayIcon}
                    iconPosition="left"
                >
                    {isRunning ? 'Ejecutando...' : 'ejecutar'}
                </Button>

                <Button
                    variant="ghost"
                    size="xs"
                    onClick={onReset}
                    disabled={isRunning}
                    className="w-full"
                    icon={RotateCcwIcon}
                    iconPosition="left"
                >
                    reiniciar
                </Button>
            </div>

            {/* Info de estrellas */}
            {mapData.maxCommands && (
                <div className="font-mono text-[10px] text-(--text-ghost) border-t border-(--bg-hover) pt-3 leading-[1.8]">
                    <span className="text-(--amber)">★★★</span> ≤ {mapData.maxCommands + (mapData.maxF1Commands || 0)} comandos<br />
                    <span className="text-(--amber)">★★</span>☆ ≤ {mapData.maxCommands + (mapData.maxF1Commands || 0) + 2} comandos<br />
                    <span className="text-(--amber)">★</span>☆☆ cualquier solución
                </div>
            )}
        </div>
    )
}
