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

    return (
        <div className="bg-(--bg-surface) border-t border-(--bg-hover) p-[6px_16px] flex items-center gap-4 font-mono text-[10px]">
            <span 
                className={`tracking-widest ${
                    phase === 'passed' ? 'text-(--green-light)' : 
                    phase === 'failed' ? 'text-(--red)' : 
                    phase === 'running' ? 'text-(--amber)' : 'text-(--text-ghost)'
                }`}
            >
                {phase === 'passed' && '✓ todas las verificaciones pasaron'}
                {phase === 'failed' && `✗ ${failedCount} verificaciones fallidas`}
                {phase === 'running' && '⟳ ejecutando...'}
                {phase === 'editing' && '// listo para ejecutar'}
            </span>
            <span className="ml-auto text-(--text-ghost)">
                {lineCount} líneas
            </span>
            <span className="text-(--text-ghost)">
                intento {attempts}
            </span>
        </div>
    )
}
