"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getActSummary, getLevelProgress, canAccessLevel } from '@/lib/gameState'
import { isDemoModeActive } from '@/lib/store/useDemoStore'
import { ActSummary, ActNumber, Level, LevelProgress } from '@/types/game'
import { LevelCard, LevelCardSkeleton } from '@/components/map/LevelCard'

interface ActMapClientProps {
  actId: string
  levels: Level[]
}

export default function ActMapClient({ actId, levels }: ActMapClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [act, setAct] = useState<ActSummary | null>(null)

  useEffect(() => {
    const actNum = parseInt(actId as string) as ActNumber
    if (isNaN(actNum)) {
      router.push('/game')
      return
    }

    const summary = getActSummary(actNum, levels)
    setAct(summary)
  }, [actId, router, levels, pathname])

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
          let prog = getLevelProgress(level.id)
          const access = canAccessLevel(level.id, levels)

          if (isDemoModeActive() && index < 4 && act.number <= 4) {
            prog = {
              completed: true,
              stars: 3,
              usedFrag: false,
              attempts: 1,
              completedAt: new Date().toISOString()
            } as LevelProgress
          }

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
