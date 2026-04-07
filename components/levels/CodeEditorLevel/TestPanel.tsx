"use client"

import { TestCase, Level } from '@/types/game'
import { motion, AnimatePresence } from 'motion/react'
import { AlertTriangle, CheckCircle2, Cpu } from 'lucide-react'
import { Screw } from '@/components/ui/Screw'

interface TestPanelProps {
    tests: TestCase[]
    level: Level
}

export function TestPanel({ tests, level }: TestPanelProps) {
    return (
        <div className="flex-1 flex flex-col min-h-0 bg-[#080a0c] border-l border-black relative">
            {/* ─── MAIN TEST LIST ─── */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 flex flex-col gap-3 bg-(--bg-void) shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]">
                <AnimatePresence mode='popLayout'>
                    {tests.map((test, index) => {
                        const status = test.passed === true ? 'success' : test.passed === false ? 'failed' : 'idle';

                        return (
                            <motion.div
                                key={test.id || index}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.04 }}
                                className={`
                                    relative border transition-all duration-300
                                    ${status === 'success' ? 'bg-(--bg-deep) border-(--green-base)/30' :
                                        status === 'failed' ? 'bg-(--bg-deep) border-red-900/40' :
                                            'bg-(--bg-deep) border-white/5'}
                                `}
                            >
                                {/* Indicador lateral minimalista */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1
                                    ${status === 'success' ? 'bg-(--green-base)' :
                                        status === 'failed' ? 'bg-red-600' :
                                            'bg-zinc-800'}`}
                                />

                                <div className="p-4 pl-6 relative">
                                    <div className="flex items-center gap-4">
                                        {/* Icono de estado limpio */}
                                        <div className={`shrink-0
                                            ${status === 'success' ? 'text-(--green-base)' :
                                                status === 'failed' ? 'text-red-500' :
                                                    'text-zinc-700'}
                                        `}>
                                            {status === 'success' ? <CheckCircle2 size={18} /> :
                                                status === 'failed' ? <AlertTriangle size={18} /> :
                                                    <Cpu size={18} />}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-[9px] font-mono font-black tracking-widest uppercase opacity-70
                                                    ${status === 'success' ? 'text-(--green-light)' : 'text-cyan-500'}`}>
                                                    TEST_{Number(index + 1).toString().padStart(2, '0')}
                                                </span>
                                                {status === 'failed' && (
                                                    <span className="text-[8px] font-mono font-black text-red-500 uppercase tracking-widest">
                                                        PROTOCOL_VIOLATION
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className={`text-[12px] font-mono font-bold leading-tight uppercase tracking-wide
                                                ${status === 'success' ? 'text-white' : status === 'failed' ? 'text-red-100' : 'text-zinc-400'}`}>
                                                {test.description}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Data Dump Simplificado */}
                                    {status === 'failed' && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="mt-4 border-t border-red-900/20 pt-3"
                                        >
                                            <div className="grid grid-rows-2 gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] text-zinc-200 uppercase tracking-widest">Required</span>
                                                    <div className="text-[11px] font-mono text-(--green-muted) truncate bg-black/40 p-2 border border-white/5">
                                                        {test.expected !== undefined ? JSON.stringify(test.expected) : 'TRUE'}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[9px] font-black text-zinc-200 uppercase tracking-widest">Received</span>
                                                    <div className="text-[11px] font-mono text-red-400 truncate bg-black/40 p-2 border border-red-500/20 font-black">
                                                        {test.received !== undefined ? JSON.stringify(test.received) : 'NULL'}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>

            {/* ─── FOOTER BAR (Línea de cierre técnica) ─── */}
            <div className="h-2 bg-black border-t border-white/5" />
        </div>
    )
}