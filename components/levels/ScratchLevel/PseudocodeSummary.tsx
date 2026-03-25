'use client'

import { ScratchBlock } from '@/types/game'
import { BLOCK_DEFS } from './constants'

export function PseudocodeSummary({ blocks, depth = 0 }: { blocks: ScratchBlock[]; depth?: number }) {
    return (
        <div className="font-mono text-[10px] text-(--text-ghost) leading-[1.8]">
            {blocks.map(block => {
                const indent = '  '.repeat(depth)
                const def = BLOCK_DEFS.find(d => d.type === block.type)!
                const val = block.value !== undefined ? `(${block.value})` : ''

                return (
                    <div key={block.id}>
                        <span style={{ color: def.border, opacity: .7 }}>
                            {indent}{block.type}{val}
                        </span>
                        {block.children && block.children.length > 0 && (
                            <PseudocodeSummary blocks={block.children} depth={depth + 1} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}
