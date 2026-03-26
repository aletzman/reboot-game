'use client'

import { PuzzleLevelProps, PUZZLE_DATA } from './types'
import { SortPuzzle } from './SortPuzzle'
import { FillPuzzle } from './FillPuzzle'
import { BugPuzzle } from './BugPuzzle'
import { MatchPuzzle } from './MatchPuzzle'

export default function PuzzleLevel(props: PuzzleLevelProps) {
    let data = PUZZLE_DATA[props.level.id]

    // Fallback dinámico para Acto 4+ (definido en levels.json)
    if (!data && props.level.type === 'puzzle-match' && (props.level as any).pairs) {
        const pairs = (props.level as any).pairs as { left: string, right: string }[]
        data = {
            type: 'match',
            items: pairs.map((p, i) => ({ id: `l${i}`, text: p.left, isCode: false })),
            pairs: pairs.map((_, i) => ({ leftId: `l${i}`, rightId: `r${i}` })),
            rightItems: pairs.map((p, i) => ({ id: `r${i}`, text: p.right }))
        }
    }

    if (!data) {
        return (
            <div className="p-8 font-mono text-(--red) text-xs">
                ERROR: Puzzle no definido para nivel {props.level.id}
            </div>
        )
    }

    switch (data.type) {
        case 'sort': return <SortPuzzle  {...props} data={data} />
        case 'fill': return <FillPuzzle  {...props} data={data} />
        case 'bug': return <BugPuzzle   {...props} data={data} />
        case 'match': return <MatchPuzzle {...props} data={data} />
    }
}
