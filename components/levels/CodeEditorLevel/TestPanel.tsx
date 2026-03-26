'use client'

import { TestCase, Level } from '@/types/game'

interface TestPanelProps {
    tests: TestCase[]
    level: Level
}

export function TestPanel({ tests, level }: TestPanelProps) {
    return (
        <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
            <div className="flex flex-col gap-2">
                <div className="font-mono text-[9px] text-(--text-ghost) tracking-[0.2em] uppercase flex items-center gap-2">
                    <span className="w-4 h-px bg-(--bg-hover)" />
                    System Verifications
                </div>
                
                <div className="flex flex-col gap-1.5">
                    {tests.map(test => (
                        <div key={test.id} 
                            className={`flex items-start gap-3 p-3 border transition-all relative overflow-hidden group ${
                                test.passed === true ? 'bg-(--green-darkest)/30 border-(--green-dark)/50 shadow-[inset_0_0_10px_rgba(45,120,0,0.05)]' :
                                test.passed === false ? 'bg-(--red)/5 border-(--red)/30 shadow-[inset_0_0_10px_rgba(226,75,74,0.05)] animate-pulse' :
                                'bg-(--bg-elevated) border-(--bg-hover)'
                            }`}
                        >
                            {/* Decorative line */}
                            <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${
                                test.passed === true ? 'bg-(--green-base)' :
                                test.passed === false ? 'bg-(--red)' :
                                'bg-transparent'
                            }`} />

                            <div className={`mt-0.5 shrink-0 w-4 h-4 rounded-sm flex items-center justify-center font-bold text-[10px] ${
                                test.passed === true ? 'bg-(--green-base) text-(--bg-void)' :
                                test.passed === false ? 'bg-(--red) text-(--bg-void)' :
                                'bg-(--bg-hover) text-(--text-ghost)'
                            }`}>
                                {test.passed === true ? '✓' : test.passed === false ? '!' : '?'}
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <span className={`font-mono text-[11px] leading-tight ${
                                    test.passed === true ? 'text-(--green-muted)' :
                                    test.passed === false ? 'text-(--red)' :
                                    'text-(--text-muted)'
                                }`}>
                                    {test.description}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-px bg-(--bg-hover) my-2" />

            <div className="flex flex-col gap-3">
                <div className="font-mono text-[9px] text-(--text-ghost) tracking-[0.2em] uppercase flex items-center gap-2">
                    <span className="w-4 h-px bg-(--bg-hover)" />
                    Mission Logs
                </div>
                
                <div className="p-4 bg-(--bg-deep) border border-(--bg-hover) rounded-sm font-sans text-[11px] text-(--text-muted) leading-relaxed relative">
                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-(--green-dark)/30" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-(--green-dark)/30" />
                    
                    {level.description}

                    {level.codeExample && (
                        <div className="mt-4 p-3 bg-black/40 border-l-2 border-(--green-dark) font-mono text-[11px] text-(--green-muted) leading-[1.6] whitespace-pre overflow-x-auto italic">
                            {level.codeExample}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
