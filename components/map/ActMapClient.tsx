"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getActSummary, getLevelProgress, canAccessLevel } from '@/lib/gameState'
import { ActSummary, ActNumber, Level } from '@/types/game'
import { LevelCard, LevelCardSkeleton } from '@/components/map/LevelCard'

interface ActMapClientProps {
  actId: string
  levels: Level[]
}

export default function ActMapClient({ actId, levels }: ActMapClientProps) {
  const router = useRouter()
  const [act, setAct] = useState<ActSummary | null>(null)

  useEffect(() => {
    const actNum = parseInt(actId as string) as ActNumber
    if (isNaN(actNum)) {
      router.push('/game')
      return
    }

    const summary = getActSummary(actNum, levels)
    setAct(summary)
  }, [actId, router, levels])

  if (!act) {
    return (
      <div className="flex flex-col gap-4 relative z-10 pt-0 pb-24 w-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <LevelCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="w-full pb-24">
      <div className="flex flex-col gap-4 relative z-10">
        {levels.map((level: Level, index: number) => {
          const prog = getLevelProgress(level.id)
          const access = canAccessLevel(level.id, levels)

          return (
            <LevelCard
              key={level.id}
              level={level}
              index={index}
              progress={prog}
              access={access}
              actNumber={act.number}
            />
          )
        })}
      </div>
    </div>
  )
}
