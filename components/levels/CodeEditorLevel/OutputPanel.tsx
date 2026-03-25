'use client'

interface OutputPanelProps {
    output: string[]
    error: string | null
}

export function OutputPanel({ output, error }: OutputPanelProps) {
    return (
        <div className="flex-1 p-4 font-mono text-xs overflow-y-auto flex flex-col gap-1.5">
            {error && (
                <div className="text-(--red) bg-[#1a0808] border border-(--red) rounded-[5px] p-2.5 text-[11px] leading-relaxed">
                    {error}
                </div>
            )}
            {output.length === 0 && !error && (
                <div className="text-(--text-ghost) text-[11px]">
                    {'// ejecuta el código para ver el output'}
                </div>
            )}
            {output.map((line, i) => (
                <div key={i} 
                    className={`text-xs leading-relaxed ${
                        line.startsWith('ERROR') ? 'text-(--red)' : 
                        line.includes('✓') ? 'text-(--green-light)' : 
                        'text-(--text-muted)'
                    }`}
                >
                    {line}
                </div>
            ))}
        </div>
    )
}
