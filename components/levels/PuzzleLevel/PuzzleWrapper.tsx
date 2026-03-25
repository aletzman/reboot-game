import { Button } from '@/components/ui/Button'
import { Level } from '@/types/game'
import { ScanLine } from 'lucide-react'

export function PuzzleWrapper({ level, title, children, onCheck, checkLabel = 'verificar', disabled }: {
    level: Level
    title: string
    children: React.ReactNode
    onCheck: () => void
    checkLabel?: string
    disabled?: boolean
}) {
    return (
        <div className="flex-1 flex flex-col items-center py-12 px-4 bg-(--bg-void) relative overflow-hidden min-h-screen">
            {/* ── CRT scanlines ── */}
            <div className="absolute inset-0 pointer-events-none crt-overlay opacity-20 z-0" />

            <div className="relative z-10 max-w-[620px] w-full flex flex-col gap-6 animate-fade-in-up">
                {/* ── DEVICE FRAME ── */}
                <div className="bg-(--bg-deep) border border-(--bg-hover) shadow-2xl rounded-xs overflow-hidden flex flex-col">

                    {/* ── HEADER TERMINAL ── */}
                    <div className="flex items-center justify-between border-b border-(--bg-hover) px-4 py-2 bg-(--bg-surface)">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-(--green-base) animate-pulse" />
                            <div className="text-[10px] text-(--green-muted) tracking-widest uppercase font-mono">
                                {level.id} // {title}
                            </div>
                        </div>
                        <div className="text-[9px] text-(--text-ghost) tracking-tighter font-mono uppercase">
                            Term-v.1.04_Reboot
                        </div>
                    </div>

                    <div className="p-6 md:p-8 flex flex-col gap-8">
                        {/* ── DESCRIPTION ── */}
                        <div className="relative">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-(--green-dark) opacity-30" />
                            <div className=" font-mono text-[11px] text-(--green-base) tracking-[.2em] mb-2 uppercase opacity-70">
                                // Misión actual
                            </div>
                            <h2 className="text-xl font-(family-name:--font-title) font-bold text-(--text-primary)/80 mb-2 tracking-tight">
                                {level.title}
                            </h2>
                            <p className="text-[14px] text-(--text-muted)  font-mono">
                                {level.description}
                            </p>
                        </div>

                        {/* ── PUZZLE CONTENT ── */}
                        <div className="bg-(--bg-void) border border-(--bg-hover) p-4 rounded-sm shadow-inner relative group">
                            <div className="absolute top-[-8px] right-4 bg-(--bg-deep) px-2 pt-px text-[9px] text-(--text-ghost) tracking-widest border border-(--border-color)/60 rounded-xs z-10 group-hover:text-(--green-muted) transition-colors">
                                AREA_DE_TRABAJO
                            </div>
                            {children}
                        </div>

                        {/* ── ACTIONS ── */}
                        <Button
                            onClick={onCheck}
                            disabled={disabled}
                            variant="solid"
                            size="lg"
                            className="w-full"
                            icon={disabled ? undefined : ScanLine}
                        >
                            {disabled ? '[ Ingresa datos ]' : `${checkLabel}`}
                        </Button>
                    </div>

                    {/* ── FOOTER BAR ── */}
                    <div className="border-t border-(--bg-hover) px-4 py-2 bg-(--bg-surface) flex justify-between items-center text-[9px] text-(--text-ghost) font-mono">
                        <div>REBOOT_OS // SYSTEM_READY</div>
                        <div className="flex gap-4">
                            <span>FRAG_ACTIVE: {level.id.includes('P') ? 'YES' : 'NO'}</span>
                            <span>ENCRYPT: AES-256</span>
                        </div>
                    </div>
                </div>

                {/* ── DECORATIVE ELEMENTS ── */}
                <div className="flex justify-between px-2 text-[8px] text-(--text-ghost) font-mono opacity-40">
                    <div>42.3684° N, 71.0125° W</div>
                    <div>{new Date().toISOString().split('T')[0]} // CACHE_LOADED</div>
                </div>
            </div>
        </div>
    )
}
