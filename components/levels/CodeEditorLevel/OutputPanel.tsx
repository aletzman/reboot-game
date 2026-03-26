'use client'

interface OutputPanelProps {
    output: string[]
    error: string | null
}

export function OutputPanel({ output, error }: OutputPanelProps) {
    return (
        <div className="flex-1 p-5 font-mono text-[11px] overflow-y-auto custom-scrollbar bg-black/20">
            <div className="flex flex-col gap-1.5">
                {output.length === 0 && !error && (
                    <div className="text-(--text-ghost) italic opacity-50 tracking-wide">
                        {'>'} Waiting for transmission...
                    </div>
                )}
                
                {output.map((line, i) => (
                    <div key={i} className={`flex gap-2 ${line.startsWith('ERROR') ? 'text-(--red)' : 'text-(--green-muted)'}`}>
                        <span className="opacity-30 shrink-0 select-none">[{i.toString().padStart(2, '0')}]</span>
                        <span className="break-all">{line}</span>
                    </div>
                ))}

                {error && (
                    <div className="mt-2 p-3 bg-(--red)/10 border border-(--red)/30 rounded flex flex-col gap-1">
                        <div className="text-(--red) font-bold uppercase text-[9px] tracking-widest flex items-center gap-2">
                            <span className="inline-block w-2 h-2 bg-(--red) rounded-full animate-pulse" />
                            Execution Fault
                        </div>
                        <div className="text-(--red) opacity-90 leading-normal font-mono text-[10px]">
                            {error}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
