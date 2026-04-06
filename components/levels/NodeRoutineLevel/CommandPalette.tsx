'use client'

import { Command, CommandType, NodeRoutineLevelData } from '@/types/game'
import { GameButton } from '@/components/ui/GameButton'
import { Button } from '@/components/ui/Button'
import { PlayIcon, StepForward, RotateCcwIcon, Trash } from 'lucide-react'
import { PALETTE_COMMANDS, MAX_COMMANDS } from './constants'
import { SequenceMemory } from '@/components/ui/MemorySequence'
import { Panel } from '@/components/ui/Panel'
import SectionHeader from '@/components/ui/SectionHeader'
import { TacticalSection } from '@/components/ui/TacticalSection'


import { CloseButton } from '@/components/ui/CloseButton'
import { TacticalHeaderButton } from '@/components/ui/TacticalHeaderButton'

interface CommandPaletteProps {
    commands: Command[]
    commandsF1: Command[]
    commandsF2: Command[]
    activePanel: 'main' | 'f1' | 'f2'
    isRunning: boolean
    executingIdx: { idx: number; panel: 'main' | 'f1' | 'f2' } | null
    mapData: NodeRoutineLevelData
    setActivePanel: (panel: 'main' | 'f1' | 'f2') => void
    onAddCommand: (type: CommandType) => void
    onRemoveCommand: (idx: number, panel?: 'main' | 'f1' | 'f2') => void
    onClearCommands: (panel?: 'main' | 'f1' | 'f2') => void
    onExecute: () => void
    onReset: () => void
    status: 'idle' | 'playing' | 'success' | 'failed' | 'reviewing'
}

export function CommandPalette({
    commands,
    commandsF1,
    commandsF2,
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
    const f2Limit = mapData.uiLimitF2 || 8
    const totalLimit = mainLimit + (mapData.allowF1 ? f1Limit : 0) + (mapData.allowF2 ? f2Limit : 0)
    const currentTotal = commands.length + (mapData.allowF1 ? commandsF1.length : 0) + (mapData.allowF2 ? commandsF2.length : 0)
    const usagePercent = Math.min(100, (currentTotal / totalLimit) * 100)

    return (
        <Panel typePanel='aside' className="w-[350px] shrink-0 flex flex-col relative z-20">
            <SequenceMemory className="mt-px" maxBlocks={totalLimit} usedBlocks={currentTotal} isExecuting={isRunning} border={['bottom']} />

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                {/* Paleta de comandos */}
                <SectionHeader title='CONTROL_DE_MANDO' />
                <section id="command-bank" className="mt-2">
                    <TacticalSection title='ACCIONES_DISPONIBLES'>
                        <div className="grid grid-cols-2 gap-[6px] p-1.5">
                            {allowedTools.map(cmd => (
                                <GameButton
                                    key={cmd.type}
                                    variant="command"
                                    icon={<span className="text-[14px]"><cmd.icon size={14} /></span>}
                                    onClick={() => onAddCommand(cmd.type)}
                                    disabled={
                                        isRunning ||
                                        (activePanel === 'main' && commands.length >= mainLimit) ||
                                        (activePanel === 'f1' && (commandsF1.length >= f1Limit || cmd.type === 'call-f1' || cmd.type === 'call-fn')) ||
                                        (activePanel === 'f2' && (commandsF2.length >= f2Limit || cmd.type === 'call-f2'))
                                    }
                                    accentColor={cmd.cssColor}
                                >
                                    {cmd.label}
                                </GameButton>
                            ))}
                        </div>
                    </TacticalSection>
                </section>

                {/* Secuencia - PRINCIPAL */}
                <section id="main-routine" className="flex flex-col cursor-pointer group" onClick={() => !isRunning && setActivePanel('main')}>
                    <TacticalSection
                        title='01_BLOQUE_RUTINA'
                        isActived={activePanel === 'main'}
                        accentColor='var(--green-light)'
                        button={<TacticalHeaderButton color='red' onClick={() => onClearCommands('main')}>
                            Borrar
                        </TacticalHeaderButton>}
                    >
                        <div className={`relative min-h-[100px] bg-(--bg-deep) p-3 border-2 transition-all duration-300 grid grid-cols-6 gap-1.5 shadow-inner overflow-hidden ${activePanel === 'main'
                            ? 'border-(--green-light)/0 shadow-[inset_0_0_25px_rgba(85,226,0,0.08)]'
                            : 'border-(--bg-hover)/0 bg-(--bg-deep)/50 grayscale-[0.4]'
                            }`}>

                            {/* Slot Placeholders */}
                            {Array.from({ length: mainLimit }).map((_, i) => (
                                <div
                                    key={`slot-${i}`}
                                    className={`aspect-square border border-dashed rounded-[1px] flex items-center justify-center transition-colors duration-500 z-10 ${i < commands.length ? 'border-transparent opacity-100' : 'border-(--bg-hover) opacity-75'
                                        } ${activePanel === 'main' && i === commands.length ? 'border-(--green-light)/65 bg-(--green-base)/30 animate-pulse' : ''}`}
                                >
                                    {i >= commands.length && (
                                        <span className="text-[11px] font-mono text-(--text-primary)/75 select-none">
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
                                                            <div className="absolute -bottom-2 -right-2 text-(--amber) text-[10px] font-bold px-0.5 min-w-[10px] text-center leading-tight opacity-90 z-30">
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
                                                className="w-full aspect-square flex items-center justify-center text-[9px] animate-fade-in-up"
                                            >
                                                {null}
                                            </GameButton>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </TacticalSection>

                </section>

                {/* Secuencia - F1 */}
                {mapData.allowF1 && (
                    <section id="f1-routine" className="flex flex-col cursor-pointer group" onClick={() => !isRunning && setActivePanel('f1')}>
                        <TacticalSection
                            title='02_SUB_RUTINA_F1'
                            isActived={activePanel === 'f1'}
                            accentColor='var(--cyan)'
                            button={<TacticalHeaderButton color='red' onClick={() => onClearCommands('f1')}>
                                Borrar
                            </TacticalHeaderButton>}
                        >
                            <div className={`relative min-h-[60px] bg-(--bg-deep) p-3 border-2 transition-all duration-300 grid grid-cols-6 gap-1.5 shadow-inner overflow-hidden ${activePanel === 'f1'
                                ? 'border-(--cyan)/0 shadow-[inset_0_0_25px_rgba(25,200,212,0.08)]'
                                : 'border-(--bg-hover)/0 bg-(--bg-deep)/50 grayscale-[0.4]'
                                }`}>
                                {/* Hardware background pattern (Cyan) */}
                                <div className="absolute inset-0 z-0 opacity-100 pointer-events-none"
                                    style={{ backgroundImage: 'radial-gradient(var(--cyan) 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />

                                {/* Slot Placeholders */}
                                {Array.from({ length: f1Limit }).map((_, i) => (
                                    <div
                                        key={`f1-slot-${i}`}
                                        className={`aspect-square border border-dashed rounded-[1px] flex items-center justify-center transition-colors duration-500 z-10 ${i < commandsF1.length ? 'border-transparent opacity-100' : 'border-(--bg-hover) opacity-75'
                                            } ${activePanel === 'f1' && i === commandsF1.length ? 'border-(--cyan)/65 bg-(--cyan)/16 animate-pulse' : ''}`}
                                    >
                                        {i >= commandsF1.length && (
                                            <span className="text-[10px] font-mono text-(--text-muted)/80 select-none">
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
                                                                <div className="absolute -bottom-2 -right-2 text-(--amber) text-[10px] font-bold px-0.5 min-w-[10px] text-center leading-tight opacity-90 z-30">
                                                                    <span className="text-[8px]">x</span>{cmd.times}
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
                                                    className="w-full aspect-square flex items-center justify-center text-[9px] animate-fade-in-up"
                                                >
                                                    {null}
                                                </GameButton>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </TacticalSection>
                    </section>
                )}

                {/* Secuencia - F2 */}
                {mapData.allowF2 && (
                    <section id="f2-routine" className="flex flex-col cursor-pointer group" onClick={() => !isRunning && setActivePanel('f2')}>
                        <TacticalSection
                            title="03_SUB_RUTINA_F2"
                            subtitle="REF_0x2A"
                            variant="elevated"
                            accentColor="var(--block-activar)"
                            isActived={activePanel === 'f2'}
                            button={<TacticalHeaderButton color='red' onClick={() => onClearCommands('f2')}>
                                Borrar
                            </TacticalHeaderButton>}
                        >
                            <div className={`relative min-h-[60px] bg-(--bg-deep) p-3 border-2 transition-all duration-300 grid grid-cols-6 gap-1.5 shadow-inner overflow-hidden ${activePanel === 'f2'
                                ? 'border-(--block-activar)/0 shadow-[inset_0_0_25px_rgba(127,119,221,0.08)]'
                                : 'border-(--bg-hover)/0 bg-(--bg-deep)/50 grayscale-[0.4]'
                                }`}>
                                {/* Hardware background pattern (Purple) */}
                                <div className="absolute inset-0 z-0 opacity-100 pointer-events-none"
                                    style={{ backgroundImage: 'radial-gradient(var(--block-activar) 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />

                                {/* Slot Placeholders */}
                                {Array.from({ length: f2Limit }).map((_, i) => (
                                    <div
                                        key={`f2-slot-${i}`}
                                        className={`aspect-square border border-dashed rounded-[1px] flex items-center justify-center transition-colors duration-500 z-10 ${i < commandsF2.length ? 'border-transparent opacity-100' : 'border-(--bg-hover) opacity-75'
                                            } ${activePanel === 'f2' && i === commandsF2.length ? 'border-(--block-activar)/50 bg-(--block-activar)/18 animate-pulse' : ''}`}
                                    >
                                        {i >= commandsF2.length && (
                                            <span className="text-[10px] font-mono text-(--text-muted)/80 select-none">
                                                {(i + 1).toString().padStart(2, '0')}
                                            </span>
                                        )}
                                    </div>
                                ))}

                                {/* Actual Command Items */}
                                <div className="absolute inset-0 z-20 p-3 grid grid-cols-6 gap-1.5 content-start pointer-events-none">
                                    {commandsF2.map((cmd, idx) => {
                                        const palette = PALETTE_COMMANDS.find(p => p.type === cmd.type)
                                        const isExec = executingIdx?.panel === 'f2' && executingIdx.idx === idx
                                        const IconComp = palette?.icon
                                        return (
                                            <div key={`f2-${idx}`} className="pointer-events-auto">
                                                <GameButton
                                                    key={`f2-btn-${idx}`}
                                                    variant="command"
                                                    active={isExec}
                                                    icon={
                                                        <div className="relative flex items-center justify-center">
                                                            {IconComp && <IconComp size={16} strokeWidth={2} />}
                                                            {cmd.type === 'repeat' && cmd.times && (
                                                                <div className="absolute -bottom-2 -right-2 text-(--amber) text-[10px] font-bold px-0.5 min-w-[10px] text-center leading-tight opacity-90 z-30">
                                                                    <span className="text-[8px]">x</span>{cmd.times}
                                                                </div>
                                                            )}
                                                        </div>
                                                    }
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        if (!isRunning) {
                                                            setActivePanel('f2')
                                                            onRemoveCommand(idx, 'f2')
                                                        }
                                                    }}
                                                    disabled={isRunning}
                                                    accentColor={palette?.cssColor}
                                                    className="w-full aspect-square flex items-center justify-center text-[9px] animate-fade-in-up"
                                                >
                                                    {null}
                                                </GameButton>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </TacticalSection>
                    </section>
                )}
            </div>

        </Panel>
    )
}

