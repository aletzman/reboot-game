'use client'

import { TestCase } from '@/types/game'

interface EditorFooterProps {
    phase: 'editing' | 'running' | 'passed' | 'failed'
    tests: TestCase[]
    lineCount: number
    attempts: number
}

export function EditorFooter({ phase, tests, lineCount, attempts }: EditorFooterProps) {
    const failedCount = tests.filter(t => t.passed === false).length
    const passedCount = tests.filter(t => t.passed === true).length
    const totalCount = tests.length

    return (
        <div className="bg-(--bg-deep) border-t border-(--bg-hover) p-[6px_20px] flex items-center gap-6 font-mono text-[10px] select-none">
            {/* Phase Status */}
            <div className={`flex items-center gap-2 font-bold tracking-widest uppercase ${
                phase === 'passed' ? 'text-(--green-light)' : 
                phase === 'failed' ? 'text-(--red)' : 
                phase === 'running' ? 'text-(--amber)' : 'text-(--text-ghost)'
            }`}>
                <span className="opacity-50">STATUS:</span>
                <span>
                    {phase === 'passed' && 'SYNCHRONIZED'}
                    {phase === 'failed' && 'MALFUNCTION'}
                    {phase === 'running' && 'EXECUTING...'}
                    {phase === 'editing' && 'READY'}
                </span>
            </div>

            <div className="h-4 w-px bg-(--bg-hover)" />

            {/* Test Stats */}
            <div className="flex items-center gap-4 text-(--text-muted)">
                <div className="flex items-center gap-1.5">
                    <span className="text-(--green-base)">✓</span>
                    <span>{passedCount}/{totalCount}</span>
                </div>
                {failedCount > 0 && (
                    <div className="flex items-center gap-1.5 text-(--red)">
                        <span>✗</span>
                        <span>{failedCount}</span>
                    </div>
                )}
            </div>

            <div className="ml-auto flex items-center gap-6 text-(--text-ghost)">
                <div className="flex items-center gap-2">
                    <span className="opacity-50 text-[8px] uppercase tracking-tighter">Attempt</span>
                    <span className="text-(--text-muted)">#{attempts + 1}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="opacity-50 text-[8px] uppercase tracking-tighter">Size</span>
                    <span className="text-(--text-muted)">{lineCount} LoC</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="opacity-50 text-[8px] uppercase tracking-tighter">Encoding</span>
                    <span className="text-(--text-muted)">UTF-8</span>
                </div>
            </div>
        </div>
    )
}
