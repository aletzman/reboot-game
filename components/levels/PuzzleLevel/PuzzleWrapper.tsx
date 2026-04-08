import { Button } from '@/components/ui/Button'
import { Level } from '@/types/game'
import { ScanLine } from 'lucide-react'
import { TheoryButton } from '../TheoryOverlay/TheoryButton'

export function PuzzleWrapper({ level, title, children, onCheck, checkLabel = 'verificar', disabled }: {
    level: Level
    title: string
    children: React.ReactNode
    onCheck: () => void
    checkLabel?: string
    disabled?: boolean
}) {
    return (
        <div className="flex-1 flex flex-col items-center py-6 px-4 bg-(--bg-void) relative overflow-hidden h-[calc(100svh-var(--header-height))] bg-diagonal-lines">

            <div className="relative z-10 max-w-[650px] w-full flex flex-col gap-6 animate-fade-in-up">
                {/* ── DEVICE FRAME ── */}
                <div className="bg-(--bg-surface) border border-(--border-color) shadow-2xl rounded-xs overflow-hidden flex flex-col">

                    {/* ── HEADER TERMINAL ── */}
                    <div className="flex items-center justify-between border-b border-(--border-color) px-4 py-2 bg-(--bg-elevated)">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-(--green-base) animate-pulse" />
                            <div className="text-[11px] text-(--green-muted) tracking-widest uppercase font-mono">
                                {level.id} - {title}
                            </div>
                        </div>
                        <div className="text-[9px] text-(--text-ghost) tracking-tighter font-mono uppercase">
                            Term-v.1.04_Reboot
                        </div>
                    </div>

                    <div className="p-6 md:p-8 flex flex-col gap-8">
                        {/* ── DESCRIPTION ── */}
                        <div className="relative">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-(--cyan) opacity-45" />
                            <div className=" font-mono text-[11px] text-(--cyan) tracking-[.2em] mb-2 uppercase opacity-70">
                                Misión actual
                            </div>
                            <h2 className="text-2xl font-(family-name:--font-title) font-bold text-(--text-primary)/80 mb-2 tracking-tight">
                                {level.title}
                            </h2>
                            <p className="text-[14px] text-(--text-muted)  font-sans">
                                {level.description}
                            </p>
                        </div>

                        {/* ── PUZZLE CONTENT ── */}
                        <div className="bg-(--bg-void) border border-(--border-color) p-4 rounded-sm shadow-inner relative  ">
                            <div className="absolute top-[-8px] left-4 bg-(--bg-deep) px-2 pt-px text-[9px] text-(--green-muted) tracking-widest border border-(--border-color)/60 rounded-xs z-10 transition-colors">
                                AREA_DE_TRABAJO
                            </div>
                            {children}
                        </div>

                        {/* ── ACTIONS ── */}
                        <TheoryButton
                            onClick={onCheck}
                            disabled={disabled}
                            color="success"
                            size="lg"
                            className="w-full"
                            icon={disabled ? undefined : ScanLine}
                        >
                            {disabled ? '[ Verificar datos ]' : `${checkLabel}`}
                        </TheoryButton>
                    </div>

                    {/* ── FOOTER BAR ── */}
                    <div className="border-t border-(--bg-hover) px-4 py-2 bg-(--bg-surface) flex justify-between items-center text-[9px] text-(--text-ghost) font-mono">
                        <div>REBOOT_OS - SYSTEM_READY</div>
                        <div className="flex gap-4">
                            <span>FRAG_ACTIVE: {level.id.includes('P') ? 'YES' : 'NO'}</span>
                            <span>ENCRYPT: AES-256</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
