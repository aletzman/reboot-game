'use client'

import { TestCase, Level } from '@/types/game'

interface TestPanelProps {
    tests: TestCase[]
    level: Level
}

export function TestPanel({ tests, level }: TestPanelProps) {
    return (
        <div className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
            <div className="font-mono text-[10px] text-(--text-ghost) tracking-widest mb-1">
                {'// verificaciones'}
            </div>
            {tests.map(test => (
                <div key={test.id} 
                    className={`flex items-start gap-2.5 p-2 border rounded-md transition-all ${
                        test.passed === true ? 'bg-(--green-darkest) border-(--green-dark)' :
                        test.passed === false ? 'bg-[#1a0808] border-(--red)' :
                        'bg-(--bg-elevated) border-(--bg-hover)'
                    }`}
                >
                    <span 
                        className={`text-xs shrink-0 mt-px ${
                            test.passed === true ? 'text-(--green-light)' :
                            test.passed === false ? 'text-(--red)' :
                            'text-(--text-ghost)'
                        }`}
                    >
                        {test.passed === true ? '✓' : test.passed === false ? '✗' : '○'}
                    </span>
                    <span 
                        className={`font-mono text-[11px] leading-normal ${
                            test.passed === true ? 'text-(--green-muted)' :
                            test.passed === false ? 'text-[#cc6666]' :
                            'text-(--text-ghost)'
                        }`}
                    >
                        {test.description}
                    </span>
                </div>
            ))}

            <div className="mt-4 p-3 bg-(--bg-elevated) rounded-md font-sans text-[11px] text-(--text-ghost) leading-relaxed">
                {level.description}
            </div>

            {level.codeExample && (
                <div className="p-3 bg-[#060809] border border-(--bg-hover) rounded-md font-mono text-[11px] text-(--green-muted) leading-[1.8] whitespace-pre overflow-x-auto">
                    {level.codeExample}
                </div>
            )}
        </div>
    )
}
