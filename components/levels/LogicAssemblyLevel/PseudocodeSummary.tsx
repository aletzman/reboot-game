'use client'

import { LogicAssemblyBlock } from '@/types/game'
import { BLOCK_DEFS } from './constants'
import { useLogicAssemblyData } from '@/lib/store/useLogicAssemblyData'

export function PseudocodeSummary({ blocks, depth = 0 }: { blocks: LogicAssemblyBlock[]; depth?: number }) {
    const currentFlatInstruction = useLogicAssemblyData((state) => state.currentFlatInstruction)
    console.log("blocks", blocks)
    return (
        <div className="font-mono text-[11px] text-(--text-ghost) leading-relaxed p-2 h-full overflow-y-auto custom-scrollbar">
            {blocks.map((block, idx) => {
                const def = BLOCK_DEFS.find(d => d.type === block.type)!
                const val = block.value !== undefined ? `(${block.value})` : ''

                return (
                    <div key={block.id} className="flex gap-3 group/line">
                        <span className="w-4 text-(--text-muted)/80 text-right select-none font-bold">{idx + 1}</span>
                        <div className="flex-1">
                            <span
                                style={{
                                    color: def.border,
                                    textShadow: `0 0 6px ${def.border}44`
                                }}
                                className="transition-all duration-300 group-hover/line:brightness-125"
                            >
                                {'  '.repeat(depth)}
                                {currentFlatInstruction.id === block.id && <span className="font-bold opacity-50 select-none mr-1">»</span>}
                                <span className="font-bold tracking-tight uppercase">{block.type}</span>
                                {val && <span className="text-(--text-muted) ml-1.5 font-medium">{val}</span>}
                            </span>
                            {block.children && block.children.length > 0 && (
                                <PseudocodeSummary blocks={block.children} depth={depth + 1} />
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
