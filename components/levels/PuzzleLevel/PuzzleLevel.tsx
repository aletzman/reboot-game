'use client'

import { PuzzleLevelProps, PUZZLE_DATA } from './types'
import { SortPuzzle } from './SortPuzzle'
import { FillPuzzle } from './FillPuzzle'
import { BugPuzzle } from './BugPuzzle'
import { MatchPuzzle } from './MatchPuzzle'

export default function PuzzleLevel(props: PuzzleLevelProps) {
    const data = PUZZLE_DATA[props.level.id]

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
